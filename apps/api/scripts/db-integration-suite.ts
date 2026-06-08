import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { PrismaService } from "../src/nest/prisma.service.js";

function loadLocalEnv() {
  const envUrl = new URL("../.env", import.meta.url);
  if (!existsSync(envUrl)) {
    return;
  }

  for (const line of readFileSync(envUrl, "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!match || process.env[match[1]]) {
      continue;
    }
    process.env[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
  }
}

function runStep(label: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    console.log(`\n[db-integration] ${label}`);
    const child = spawn("npx", args, {
      cwd: new URL("..", import.meta.url),
      env: process.env,
      shell: true,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function main() {
  loadLocalEnv();
  assert.ok(process.env.DATABASE_URL, "DATABASE_URL is required for the DB integration suite.");
  const runId = `dbsuite_${randomUUID()}`;
  process.env.FOOBOW_DB_TEST_RUN_ID = runId;

  try {
    await runStep("Prisma service write-path smoke", ["tsx", "scripts/prisma-write-smoke.ts"]);
    await runStep("Nest HTTP DB smoke", ["tsx", "scripts/nest-db-http-smoke.ts"]);

    console.log("\nDB integration suite passed.");
  } finally {
    await cleanupRun(runId);
  }
}

async function cleanupRun(runId: string) {
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        delete from safety_reports
        where reason like ${`%${runId}%`}
      `;
      await tx.$executeRaw`
        with deleted as (
          delete from donations
          where idempotency_key like ${`%${runId}%`}
          returning campaign_id, amount
        ),
        totals as (
          select campaign_id, sum(amount) as amount
          from deleted
          group by campaign_id
        )
        update donation_campaigns
        set current_amount = greatest(0, donation_campaigns.current_amount - totals.amount)
        from totals
        where donation_campaigns.id = totals.campaign_id
      `;
      await tx.$executeRaw`
        delete from blessings
        where body like ${`%${runId}%`}
      `;
      await tx.$executeRaw`
        delete from karma_events
        where deed_action_id in (
          select id from deed_actions where metadata ->> 'test_run_id' = ${runId}
        )
      `;
      await tx.$executeRaw`
        delete from deed_actions
        where metadata ->> 'test_run_id' = ${runId}
      `;
      await tx.$executeRaw`
        delete from mood_checkins
        where note like ${`%${runId}%`}
      `;
    });
    console.log(`[db-integration] Cleaned records for ${runId}.`);
  } finally {
    await prisma.onModuleDestroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
