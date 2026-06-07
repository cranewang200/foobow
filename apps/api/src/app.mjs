import { createServer as createHttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  blessings,
  deedTypes,
  demoProfile,
  donationCampaigns,
  mapSpots,
  nowIso
} from "./fixtures.mjs";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function page(items) {
  return {
    items,
    page_info: {
      next_cursor: null,
      has_next_page: false
    }
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, jsonHeaders);
  response.end(JSON.stringify(payload));
}

function sendError(response, status, code, message, details = []) {
  sendJson(response, status, {
    error: {
      code,
      message,
      details,
      request_id: `req_${randomUUID()}`
    }
  });
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

function filterByCategory(items, category) {
  if (!category || category === "all") {
    return items;
  }

  return items.filter((item) => item.category === category);
}

function selectRecommendedDeed(mood) {
  const moodMap = {
    heavy: "deed_release_fish",
    lonely: "deed_send_blessing",
    anxious: "deed_clean_beach",
    grateful: "deed_elder_crossing",
    hopeful: "deed_clean_beach",
    calm: "deed_send_blessing"
  };

  return deedTypes.find((deed) => deed.id === moodMap[mood]) ?? deedTypes[0];
}

function normalizeAmount(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return numeric.toFixed(2);
}

export function createApp(options = {}) {
  const state = {
    blessings: options.blessings ? structuredClone(options.blessings) : structuredClone(blessings),
    checkins: [],
    deedActions: [],
    donations: new Map(),
    reports: []
  };

  async function handleRequest(request, response) {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const path = requestUrl.pathname;
    const method = request.method ?? "GET";

    if (method === "OPTIONS") {
      response.writeHead(204, {
        ...jsonHeaders,
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": "content-type,authorization,idempotency-key"
      });
      response.end();
      return;
    }

    if (path === "/health" && method === "GET") {
      sendJson(response, 200, {
        status: "ok",
        service: "foobow-api",
        version: "0.1.0",
        time: nowIso
      });
      return;
    }

    if (path === "/api/v1/me" && method === "GET") {
      sendJson(response, 200, { profile: demoProfile });
      return;
    }

    if (path === "/api/v1/today" && method === "GET") {
      sendJson(response, 200, {
        checkin: state.checkins.at(-1) ?? null,
        recommended_deed: selectRecommendedDeed("heavy"),
        journal_prompt: "What small kindness would make today feel lighter?",
        active_campaigns: donationCampaigns.filter(
          (campaign) => campaign.status === "active" && campaign.verification_status === "verified"
        ),
        streak: demoProfile.karma.streak_days
      });
      return;
    }

    if (path === "/api/v1/deed-types" && method === "GET") {
      const items = filterByCategory(deedTypes, requestUrl.searchParams.get("category")).filter(
        (deed) => deed.status === "active"
      );
      sendJson(response, 200, page(items));
      return;
    }

    if (path === "/api/v1/map-spots" && method === "GET") {
      const items = filterByCategory(mapSpots, requestUrl.searchParams.get("category")).filter(
        (spot) => spot.status === "active"
      );
      sendJson(response, 200, page(items));
      return;
    }

    if (path === "/api/v1/donation-campaigns" && method === "GET") {
      const items = donationCampaigns.filter(
        (campaign) => campaign.status === "active" && campaign.verification_status === "verified"
      );
      sendJson(response, 200, page(items));
      return;
    }

    if (path === "/api/v1/blessings" && method === "GET") {
      const items = state.blessings.filter((blessing) => blessing.moderation_status === "visible");
      sendJson(response, 200, page(items));
      return;
    }

    if (path === "/api/v1/blessings" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const text = typeof body.body === "string" ? body.body.trim() : "";
      if (text.length < 3 || text.length > 240) {
        sendError(response, 422, "validation_error", "Blessing body must be between 3 and 240 characters.", [
          { field: "body", issue: "length" }
        ]);
        return;
      }

      const blessing = {
        id: `blessing_${randomUUID()}`,
        body: text,
        visibility: body.visibility === "public" ? "public" : "anonymous",
        moderation_status: "visible",
        reactions: { bless: 0, support: 0, thank_you: 0, same_feeling: 0 },
        created_at: new Date().toISOString()
      };
      state.blessings.unshift(blessing);
      sendJson(response, 201, { blessing });
      return;
    }

    if (path === "/api/v1/checkins" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const allowedMoods = new Set(["calm", "heavy", "lonely", "grateful", "hopeful", "anxious"]);
      if (!allowedMoods.has(body.mood)) {
        sendError(response, 422, "validation_error", "Mood is not supported.", [
          { field: "mood", issue: "unsupported" }
        ]);
        return;
      }

      const checkin = {
        id: `checkin_${randomUUID()}`,
        mood: body.mood,
        note: typeof body.note === "string" ? body.note.slice(0, 500) : "",
        checked_in_on: "2026-06-07",
        created_at: new Date().toISOString()
      };
      state.checkins.push(checkin);
      sendJson(response, 201, {
        checkin,
        recommended_deed: selectRecommendedDeed(body.mood),
        streak: demoProfile.karma.streak_days + 1
      });
      return;
    }

    if (path === "/api/v1/deed-actions" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const deedType = deedTypes.find((deed) => deed.id === body.deed_type_id);
      if (!deedType) {
        sendError(response, 422, "validation_error", "Unknown deed type.", [
          { field: "deed_type_id", issue: "unknown" }
        ]);
        return;
      }

      const deedAction = {
        id: `action_${randomUUID()}`,
        deed_type_id: deedType.id,
        map_spot_id: body.map_spot_id ?? null,
        status: body.status === "completed" ? "completed" : "started",
        visibility: ["public", "friends_only", "anonymous", "private"].includes(body.visibility)
          ? body.visibility
          : "private",
        completed_at: body.status === "completed" ? new Date().toISOString() : null
      };
      state.deedActions.push(deedAction);

      sendJson(response, 201, {
        deed_action: deedAction,
        karma_event: {
          id: `karma_${randomUUID()}`,
          event_type: "earned",
          points: deedAction.status === "completed" ? deedType.default_karma_points : 0,
          reason: deedType.name
        },
        badges_earned: deedAction.status === "completed" ? [{ id: "badge_daily_light", name: "Daily Light" }] : []
      });
      return;
    }

    if (path === "/api/v1/donations" && method === "POST") {
      const idempotencyKey = request.headers["idempotency-key"];
      if (!idempotencyKey) {
        sendError(response, 422, "validation_error", "Donation creation requires an Idempotency-Key header.", [
          { field: "Idempotency-Key", issue: "required" }
        ]);
        return;
      }

      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const amount = normalizeAmount(body.amount);
      if (!amount) {
        sendError(response, 422, "validation_error", "Donation amount must be greater than zero.", [
          { field: "amount", issue: "invalid" }
        ]);
        return;
      }

      const campaign = donationCampaigns.find((item) => item.id === body.campaign_id);
      if (!campaign || campaign.status !== "active" || campaign.verification_status !== "verified") {
        sendError(response, 422, "unverified_campaign", "Donations can only be created for verified active campaigns.", [
          { field: "campaign_id", issue: "not_verified_or_active" }
        ]);
        return;
      }

      const fingerprint = JSON.stringify({
        campaign_id: campaign.id,
        amount,
        currency: body.currency ?? "USD"
      });
      const existing = state.donations.get(idempotencyKey);
      if (existing && existing.fingerprint !== fingerprint) {
        sendError(response, 409, "idempotency_conflict", "Idempotency-Key was reused with a different donation payload.");
        return;
      }
      if (existing) {
        sendJson(response, 200, existing.response);
        return;
      }

      const payload = {
        donation: {
          id: `donation_${randomUUID()}`,
          campaign_id: campaign.id,
          amount,
          currency: body.currency ?? "USD",
          payment_status: "pending",
          karma_points_awarded: 0
        },
        checkout: {
          url: `https://payments.example.test/checkout/${randomUUID()}`
        },
        transparency_note: "Donation support is separate from symbolic karma and does not buy luck, virtue, or guaranteed outcomes."
      };
      state.donations.set(idempotencyKey, { fingerprint, response: payload });
      sendJson(response, 201, payload);
      return;
    }

    if (path === "/api/v1/reports" && method === "POST") {
      const body = await readJson(request);
      if (!body || !body.target_type || !body.target_id || !body.reason) {
        sendError(response, 422, "validation_error", "Report target and reason are required.");
        return;
      }

      const report = {
        id: `report_${randomUUID()}`,
        target_type: body.target_type,
        target_id: body.target_id,
        reason: body.reason,
        moderation_status: "open",
        created_at: new Date().toISOString()
      };
      state.reports.push(report);
      sendJson(response, 201, { report });
      return;
    }

    sendError(response, 404, "not_found", "Endpoint not found.");
  }

  return {
    handleRequest,
    state
  };
}

export function createServer(options = {}) {
  const app = createApp(options);
  const server = createHttpServer(app.handleRequest);
  server.appState = app.state;
  return server;
}
