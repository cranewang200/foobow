export const nowIso = "2026-06-07T12:00:00.000Z";

export const deedTypes = [
  {
    id: "deed_release_fish",
    slug: "virtual-release",
    name: "Virtual Fangsheng",
    localized_name: { "zh-Hans": "云放生" },
    category: "animals",
    description: "Release a symbolic fish into a protected lake without affecting real ecosystems.",
    ritual_instructions: "Drag the fish into the water and write one quiet wish.",
    default_karma_points: 8,
    status: "active"
  },
  {
    id: "deed_elder_crossing",
    slug: "elder-crossing",
    name: "Help an Elder Cross",
    localized_name: { "zh-Hans": "扶老奶奶过马路" },
    category: "elders",
    description: "Guide an elder safely across a calm city crossing.",
    ritual_instructions: "Hold to guide, release only when the crossing light is safe.",
    default_karma_points: 7,
    status: "active"
  },
  {
    id: "deed_clean_beach",
    slug: "clean-shore",
    name: "Clean a Shore",
    localized_name: { "zh-Hans": "净化海岸" },
    category: "environment",
    description: "Clear virtual litter from a river, park, beach, or street.",
    ritual_instructions: "Collect five pieces of litter and leave the place visually restored.",
    default_karma_points: 6,
    status: "active"
  },
  {
    id: "deed_send_blessing",
    slug: "anonymous-blessing",
    name: "Send a Quiet Blessing",
    localized_name: { "zh-Hans": "送一句祝福" },
    category: "support",
    description: "Send a short anonymous sentence of support to the blessing wall.",
    ritual_instructions: "Write one sentence that is gentle, specific, and non-demanding.",
    default_karma_points: 5,
    status: "active"
  }
];

export const donationCampaigns = [
  {
    id: "campaign_shelter_meals",
    slug: "shelter-meals",
    name: "Shelter Meal Support",
    partner_name: "Verified Shelter Network",
    category: "animals",
    verification_status: "verified",
    description: "Optional small donations that support shelter food and care.",
    target_amount: "12000.00",
    current_amount: "3920.00",
    status: "active"
  },
  {
    id: "campaign_operating_support",
    slug: "operating-support",
    name: "Foobow Operating Support",
    partner_name: "Foobow",
    category: "platform",
    verification_status: "verified",
    description: "Helps keep the app ad-light, moderated, and available.",
    target_amount: "5000.00",
    current_amount: "1180.00",
    status: "active"
  },
  {
    id: "campaign_unverified_school",
    slug: "unverified-school-supplies",
    name: "School Supply Review",
    partner_name: "Pending Partner",
    category: "education",
    verification_status: "pending_review",
    description: "Visible to admins only until verification is complete.",
    target_amount: "8000.00",
    current_amount: "0.00",
    status: "draft"
  }
];

export const mapSpots = [
  {
    id: "spot_east_lake",
    slug: "east-lake-wuhan",
    name: "East Lake",
    category: "animals",
    latitude: 30.5579,
    longitude: 114.3947,
    region: "Wuhan, China",
    story: "A symbolic release spot inspired by quiet water rituals.",
    status: "active",
    campaign_id: "campaign_shelter_meals",
    impact: { actions_completed: 18240, collective_points: 92400 }
  },
  {
    id: "spot_shibuya_crossing",
    slug: "shibuya-kind-crossing",
    name: "Kind Crossing",
    category: "elders",
    latitude: 35.6595,
    longitude: 139.7005,
    region: "Tokyo, Japan",
    story: "A virtual crossing for elder-care and patience rituals.",
    status: "active",
    campaign_id: null,
    impact: { actions_completed: 9821, collective_points: 44210 }
  },
  {
    id: "spot_toronto_waterfront",
    slug: "toronto-waterfront-cleanup",
    name: "Toronto Waterfront",
    category: "environment",
    latitude: 43.6387,
    longitude: -79.3816,
    region: "Toronto, Canada",
    story: "A digital shoreline for cleanup and tree-watering rituals.",
    status: "active",
    campaign_id: null,
    impact: { actions_completed: 12044, collective_points: 51090 }
  }
];

export const blessings = [
  {
    id: "blessing_001",
    body: "May your next step feel lighter than the last.",
    visibility: "anonymous",
    moderation_status: "visible",
    reactions: { bless: 128, support: 43, thank_you: 18, same_feeling: 22 },
    created_at: nowIso
  },
  {
    id: "blessing_002",
    body: "For anyone carrying guilt today: one kind action is still real.",
    visibility: "anonymous",
    moderation_status: "visible",
    reactions: { bless: 96, support: 51, thank_you: 11, same_feeling: 37 },
    created_at: nowIso
  }
];

export const demoProfile = {
  id: "profile_demo",
  display_name: "Quiet Helper",
  locale: "en",
  privacy_mode: "private",
  quiet_ranking_enabled: true,
  theme_preference: "system",
  notification_preference: "daily",
  karma: {
    total_points: 304,
    streak_days: 8,
    category_totals: {
      animals: 120,
      elders: 64,
      environment: 75,
      support: 45
    }
  }
};
