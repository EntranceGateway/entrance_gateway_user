import api from "./index";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AD POSITIONS - Matching Admin Panel Layout
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * HORIZONTAL POSITIONS (Full-width banners):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  HORIZONTAL_1  │  HORIZONTAL_1  │  HORIZONTAL_1  │  HORIZONTAL_1       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                        [ Courses Section ]                              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │     HORIZONTAL_2      │     HORIZONTAL_2      │     HORIZONTAL_2       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                        [ Mock Test Section ]                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │     HORIZONTAL_3      │     HORIZONTAL_3      │     HORIZONTAL_3       │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * VERTICAL POSITIONS (Sidebar - Right Panel):
 * ┌──────────────┐
 * │  VERTICAL_1  │ ← Sticky (Premium spot)
 * ├──────────────┤
 * │  VERTICAL_2  │
 * ├──────────────┤
 * │  VERTICAL_3  │
 * ├──────────────┤
 * │  VERTICAL_4  │
 * └──────────────┘
 * 
 * FLOATING POSITIONS (Fixed on screen):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Content                                              │ FLOATING_RIGHT │
 * │                                                       │ (Fixed)        │
 * ├───────────────────────────────────────────────────────┴─────────────────┤
 * │                           FLOATING_BOTTOM (Fixed Banner)                │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export const AD_POSITIONS = {
  // Inline positions (scroll with content)
  HORIZONTAL_1: "HORIZONTAL_1", // Hero section - 4 ads grid
  HORIZONTAL_2: "HORIZONTAL_2", // Mid-page - 3 ads grid
  HORIZONTAL_3: "HORIZONTAL_3", // Before footer - 3 ads grid
  VERTICAL_1: "VERTICAL_1",     // Sidebar top (sticky)
  VERTICAL_2: "VERTICAL_2",     // Sidebar second
  VERTICAL_3: "VERTICAL_3",     // Sidebar third
  VERTICAL_4: "VERTICAL_4",     // Sidebar bottom
  
  // Floating positions (fixed on screen)
  FLOATING_BOTTOM: "FLOATING_BOTTOM",   // Fixed bottom banner
  FLOATING_RIGHT: "FLOATING_RIGHT",     // Fixed right sidebar ads
};

/**
 * Priority levels for ad ordering
 */
export const AD_PRIORITY = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

/**
 * Ad status types
 */
export const AD_STATUS = {
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  PAUSED: "PAUSED",
  EXPIRED: "EXPIRED",
  SCHEDULED: "SCHEDULED",
};

/**
 * Position display limits
 */
export const POSITION_LIMITS = {
  [AD_POSITIONS.HORIZONTAL_1]: 4,
  [AD_POSITIONS.HORIZONTAL_2]: 3,
  [AD_POSITIONS.HORIZONTAL_3]: 3,
  [AD_POSITIONS.VERTICAL_1]: 1,
  [AD_POSITIONS.VERTICAL_2]: 1,
  [AD_POSITIONS.VERTICAL_3]: 1,
  [AD_POSITIONS.VERTICAL_4]: 1,
  [AD_POSITIONS.FLOATING_BOTTOM]: 3,   // Up to 3 rotating ads
  [AD_POSITIONS.FLOATING_RIGHT]: 2,    // Up to 2 stacked ads
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STATIC ADS DATA - Nepal Education Context
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const STATIC_ADS = [
  // ─────────────────────────────────────────────────────────────────────────
  // FLOATING BOTTOM: Fixed bottom banner (Premium - High visibility)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "FB-LIMITED-OFFER-2026",
    title: "🎉 Limited Time: 40% Off All Premium Courses!",
    bannerName: "Flash Sale Banner",
    position: AD_POSITIONS.FLOATING_BOTTOM,
    priority: AD_PRIORITY.CRITICAL,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/courses?offer=flash-sale",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 100000,
    costPerClick: 5.00,
    costPerImpression: 0.25,
    weight: 100,
    targeting: {
      universities: ["ALL"],
      courses: ["ALL"],
      locations: ["Nepal"],
    },
    utmSource: "floating_banner",
    utmMedium: "display",
    utmCampaign: "flash_sale_2026",
  },
  {
    id: "FB-CEE-COUNTDOWN-2026",
    title: "⏰ CEE 2026 in 90 Days - Start Now!",
    bannerName: "CEE Countdown",
    position: AD_POSITIONS.FLOATING_BOTTOM,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/courses/cee-preparation",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    displaySchedule: "24/7",
    totalBudget: 75000,
    costPerClick: 4.00,
    costPerImpression: 0.20,
    weight: 90,
    targeting: {
      universities: ["TRIBHUVAN_UNIVERSITY"],
      courses: ["CEE", "MBBS", "Engineering"],
      locations: ["Nepal"],
    },
    utmSource: "floating_banner",
    utmMedium: "display",
    utmCampaign: "cee_countdown_2026",
  },
  {
    id: "FB-FREE-MOCK-TEST",
    title: "📝 Take Free Mock Test - 10,000+ Students Passed!",
    bannerName: "Free Mock Test CTA",
    position: AD_POSITIONS.FLOATING_BOTTOM,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/mock-test",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 50000,
    costPerClick: 3.00,
    costPerImpression: 0.15,
    weight: 85,
    targeting: {
      universities: ["ALL"],
      courses: ["ALL"],
      locations: ["Nepal"],
    },
    utmSource: "floating_banner",
    utmMedium: "display",
    utmCampaign: "free_mock_test",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FLOATING RIGHT: Fixed right sidebar ads
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "FR-PREMIUM-SUBSCRIPTION",
    title: "Go Premium - Unlimited Access",
    bannerName: "Premium Subscription",
    position: AD_POSITIONS.FLOATING_RIGHT,
    priority: AD_PRIORITY.CRITICAL,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&q=80",
    redirectUrl: "/premium",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 80000,
    costPerClick: 4.50,
    costPerImpression: 0.20,
    weight: 95,
    targeting: {
      universities: ["ALL"],
      courses: ["ALL"],
      locations: ["Nepal"],
    },
    utmSource: "floating_sidebar",
    utmMedium: "display",
    utmCampaign: "premium_subscription",
  },
  {
    id: "FR-DOWNLOAD-APP",
    title: "Download Our App - Study Anywhere!",
    bannerName: "Mobile App Download",
    position: AD_POSITIONS.FLOATING_RIGHT,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&q=80",
    redirectUrl: "/download-app",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 60000,
    costPerClick: 3.50,
    costPerImpression: 0.18,
    weight: 88,
    targeting: {
      universities: ["ALL"],
      courses: ["ALL"],
      locations: ["Nepal"],
    },
    utmSource: "floating_sidebar",
    utmMedium: "display",
    utmCampaign: "app_download",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HORIZONTAL 1: Hero Section (4 ads in grid)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "H1-CEE-2026",
    title: "CEE 2026 Complete Preparation",
    bannerName: "CEE Prep",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: AD_PRIORITY.CRITICAL,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/courses/cee-preparation",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    displaySchedule: "24/7",
    totalBudget: 50000,
    costPerClick: 2.50,
    costPerImpression: 0.10,
    maxImpressions: 500000,
    maxClicks: 20000,
    weight: 100,
    targetAudience: "+2 Science Students, CEE Aspirants",
    targetLocation: "Nepal - All Districts",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "cee, medical, engineering, entrance, 2026",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=hero&utm_campaign=cee2026",
    notes: "Primary CEE campaign - highest priority",
    isActive: true,
  },
  {
    id: "H1-IOE-MOCK",
    title: "IOE Mock Tests - 500+ Questions",
    bannerName: "IOE Mock",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/mock-tests/ioe",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 35000,
    costPerClick: 1.80,
    costPerImpression: 0.08,
    maxImpressions: 400000,
    maxClicks: 15000,
    weight: 90,
    targetAudience: "Engineering Aspirants, +2 Students",
    targetLocation: "Kathmandu Valley, Pokhara, Chitwan",
    targetDevices: "Mobile, Desktop",
    tags: "ioe, engineering, mock test, practice",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=hero&utm_campaign=ioe_mock",
    notes: "IOE entrance mock test promotion",
    isActive: true,
  },
  {
    id: "H1-MBBS-NEPAL",
    title: "MBBS in Nepal - Top Colleges",
    bannerName: "MBBS Nepal",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/colleges?category=medical",
    startDate: "2026-01-01",
    endDate: "2026-08-31",
    displaySchedule: "24/7",
    totalBudget: 45000,
    costPerClick: 2.20,
    costPerImpression: 0.09,
    maxImpressions: 450000,
    maxClicks: 18000,
    weight: 85,
    targetAudience: "Medical Aspirants, Parents",
    targetLocation: "Nepal - All Districts",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "mbbs, medical, college, admission",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=hero&utm_campaign=mbbs",
    notes: "Medical college admission campaign",
    isActive: true,
  },
  {
    id: "H1-FREE-NOTES",
    title: "Free Study Notes - All Subjects",
    bannerName: "Free Notes",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: AD_PRIORITY.MEDIUM,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/notes",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 20000,
    costPerClick: 1.00,
    costPerImpression: 0.05,
    maxImpressions: 300000,
    maxClicks: 12000,
    weight: 75,
    targetAudience: "All Students",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "notes, free, study material, download",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=hero&utm_campaign=free_notes",
    notes: "Free notes download promotion",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HORIZONTAL 2: Mid-Page Section (3 ads)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "H2-TU-SYLLABUS",
    title: "TU Entrance Syllabus 2026",
    bannerName: "TU Syllabus",
    position: AD_POSITIONS.HORIZONTAL_2,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/syllabus/tribhuvan-university",
    startDate: "2026-01-01",
    endDate: "2026-07-31",
    displaySchedule: "Mon-Sun 6AM-11PM",
    totalBudget: 25000,
    costPerClick: 1.50,
    costPerImpression: 0.06,
    maxImpressions: 350000,
    maxClicks: 14000,
    weight: 80,
    targetAudience: "TU Aspirants, +2 Students",
    targetLocation: "Nepal - All Districts",
    targetDevices: "Mobile, Desktop",
    tags: "tu, tribhuvan, syllabus, entrance",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=mid&utm_campaign=tu_syllabus",
    notes: "TU syllabus download page",
    isActive: true,
  },
  {
    id: "H2-SCHOLARSHIP",
    title: "Scholarship Alerts 2026",
    bannerName: "Scholarship",
    position: AD_POSITIONS.HORIZONTAL_2,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/notices?type=scholarship",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 30000,
    costPerClick: 1.80,
    costPerImpression: 0.07,
    maxImpressions: 380000,
    maxClicks: 15000,
    weight: 85,
    targetAudience: "All Students, Parents",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "scholarship, financial aid, admission",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=mid&utm_campaign=scholarship",
    notes: "Scholarship notification alerts",
    isActive: true,
  },
  {
    id: "H2-VIDEO-LECTURES",
    title: "Video Lectures by Top Educators",
    bannerName: "Video Class",
    position: AD_POSITIONS.HORIZONTAL_2,
    priority: AD_PRIORITY.MEDIUM,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/courses/video-lectures",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 22000,
    costPerClick: 1.20,
    costPerImpression: 0.05,
    maxImpressions: 280000,
    maxClicks: 11000,
    weight: 70,
    targetAudience: "Students preferring online learning",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "video, lecture, online, education",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=mid&utm_campaign=video",
    notes: "Video course promotion",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HORIZONTAL 3: Lower Section (3 ads)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "H3-KU-ADMISSION",
    title: "Kathmandu University Admission",
    bannerName: "KU Admission",
    position: AD_POSITIONS.HORIZONTAL_3,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/colleges/kathmandu-university",
    startDate: "2026-02-01",
    endDate: "2026-05-31",
    displaySchedule: "24/7",
    totalBudget: 40000,
    costPerClick: 2.00,
    costPerImpression: 0.08,
    maxImpressions: 420000,
    maxClicks: 16000,
    weight: 88,
    targetAudience: "KU Aspirants, High Achievers",
    targetLocation: "Kathmandu, Lalitpur, Bhaktapur",
    targetDevices: "Desktop, Tablet",
    tags: "ku, kathmandu university, admission",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=lower&utm_campaign=ku",
    notes: "KU admission season campaign",
    isActive: true,
  },
  {
    id: "H3-PAST-PAPERS",
    title: "10 Years Past Papers Collection",
    bannerName: "Past Papers",
    position: AD_POSITIONS.HORIZONTAL_3,
    priority: AD_PRIORITY.MEDIUM,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/notes?type=past-papers",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 18000,
    costPerClick: 0.90,
    costPerImpression: 0.04,
    maxImpressions: 250000,
    maxClicks: 10000,
    weight: 65,
    targetAudience: "Entrance Aspirants",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop",
    tags: "past papers, old questions, practice",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=lower&utm_campaign=past_papers",
    notes: "Past papers collection",
    isActive: true,
  },
  {
    id: "H3-CAREER-COUNSELING",
    title: "Free Career Counseling",
    bannerName: "Counseling",
    position: AD_POSITIONS.HORIZONTAL_3,
    priority: AD_PRIORITY.MEDIUM,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&q=80",
    redirectUrl: "/counseling",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sat 9AM-6PM",
    totalBudget: 15000,
    costPerClick: 0.80,
    costPerImpression: 0.03,
    maxImpressions: 200000,
    maxClicks: 8000,
    weight: 60,
    targetAudience: "Confused Students, Parents",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop",
    tags: "counseling, career, guidance, free",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=lower&utm_campaign=counseling",
    notes: "Career counseling booking",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // VERTICAL 1: Sidebar Top (Sticky - Premium)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "V1-PREMIUM",
    title: "Go Premium - Unlock All",
    bannerName: "Premium",
    position: AD_POSITIONS.VERTICAL_1,
    priority: AD_PRIORITY.CRITICAL,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=500&fit=crop&q=80",
    redirectUrl: "/premium",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 60000,
    costPerClick: 3.00,
    costPerImpression: 0.12,
    maxImpressions: 600000,
    maxClicks: 25000,
    weight: 100,
    targetAudience: "Serious Students",
    targetLocation: "Nepal - Urban Areas",
    targetDevices: "Desktop",
    tags: "premium, membership, unlimited, pro",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=sidebar&utm_campaign=premium",
    notes: "Premium membership - highest priority sidebar",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // VERTICAL 2: Sidebar Second
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "V2-DAILY-QUIZ",
    title: "Daily Quiz - Win Prizes!",
    bannerName: "Daily Quiz",
    position: AD_POSITIONS.VERTICAL_2,
    priority: AD_PRIORITY.HIGH,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=500&fit=crop&q=80",
    redirectUrl: "/quiz/daily",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 25000,
    costPerClick: 1.50,
    costPerImpression: 0.06,
    maxImpressions: 350000,
    maxClicks: 14000,
    weight: 80,
    targetAudience: "Active Students",
    targetLocation: "Nepal",
    targetDevices: "Desktop, Tablet",
    tags: "quiz, daily, challenge, prizes",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=sidebar&utm_campaign=quiz",
    notes: "Daily quiz engagement",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // VERTICAL 3: Sidebar Third
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "V3-MOBILE-APP",
    title: "Download Our App",
    bannerName: "Mobile App",
    position: AD_POSITIONS.VERTICAL_3,
    priority: AD_PRIORITY.MEDIUM,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=500&fit=crop&q=80",
    redirectUrl: "/download-app",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 20000,
    costPerClick: 1.20,
    costPerImpression: 0.05,
    maxImpressions: 300000,
    maxClicks: 12000,
    weight: 70,
    targetAudience: "Mobile Users",
    targetLocation: "Nepal",
    targetDevices: "Desktop",
    tags: "app, mobile, download, android, ios",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=sidebar&utm_campaign=app",
    notes: "Mobile app download",
    isActive: true,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // VERTICAL 4: Sidebar Bottom
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "V4-TELEGRAM",
    title: "Join 50K+ on Telegram",
    bannerName: "Telegram",
    position: AD_POSITIONS.VERTICAL_4,
    priority: AD_PRIORITY.LOW,
    status: AD_STATUS.ACTIVE,
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=500&fit=crop&q=80",
    redirectUrl: "https://t.me/entrancegateway",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "24/7",
    totalBudget: 10000,
    costPerClick: 0.50,
    costPerImpression: 0.02,
    maxImpressions: 200000,
    maxClicks: 8000,
    weight: 50,
    targetAudience: "Community Seekers",
    targetLocation: "Nepal",
    targetDevices: "Desktop, Mobile",
    tags: "telegram, community, group, social",
    trackingPixel: "",
    utmParameters: "utm_source=entrancegateway&utm_medium=sidebar&utm_campaign=telegram",
    notes: "Telegram community",
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const isWithinSchedule = (ad) => {
  const today = getCurrentDate();
  const start = ad.startDate || "2000-01-01";
  const end = ad.endDate || "2099-12-31";
  return today >= start && today <= end;
};

const getActiveScheduledAds = (ads) => {
  return ads.filter(
    (ad) => ad.isActive && ad.status === AD_STATUS.ACTIVE && isWithinSchedule(ad)
  );
};

const PRIORITY_ORDER = {
  [AD_PRIORITY.CRITICAL]: 4,
  [AD_PRIORITY.HIGH]: 3,
  [AD_PRIORITY.MEDIUM]: 2,
  [AD_PRIORITY.LOW]: 1,
};

// ═══════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch all ads from the API with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (0-indexed)
 * @param {number} options.size - Number of ads per page
 * @returns {Promise<Array>} Array of ads
 */
export const getAds = async ({ page = 0, size = 10 } = {}) => {
  try {
    const response = await api.get(`/ads?page=${page}&size=${size}`);
    const responseData = response.data;
    
    // Handle different API response structures
    let ads = [];
    if (responseData?.data?.content) {
      // Paginated response: { data: { content: [...], totalPages, totalElements } }
      ads = responseData.data.content;
    } else if (Array.isArray(responseData?.data)) {
      // Array response: { data: [...] }
      ads = responseData.data;
    } else if (Array.isArray(responseData?.content)) {
      // Direct paginated: { content: [...] }
      ads = responseData.content;
    } else if (Array.isArray(responseData)) {
      // Direct array response
      ads = responseData;
    }
    
    if (ads.length > 0) {
      // Normalize ad data and filter active ads
      return ads
        .filter((ad) => ad.isActive !== false && ad.status !== "INACTIVE")
        .map(normalizeAdData);
    }
    
    // Fallback to static ads if API returns empty
    return getActiveScheduledAds(STATIC_ADS);
  } catch (error) {
    console.warn("Ads API unavailable, using static ads:", error.message);
    return getActiveScheduledAds(STATIC_ADS);
  }
};

/**
 * Fetch all ads (with larger page size for complete list)
 * @returns {Promise<Array>} Array of all active ads
 */
export const getAllAds = async () => {
  return getAds({ page: 0, size: 100 });
};

/**
 * Normalize position string from API to match our constants
 * Handles various formats: "Horizontal 1", "horizontal_1", "HORIZONTAL_1", etc.
 * @param {string} position - Position string from API
 * @returns {string} Normalized position constant
 */
const normalizePosition = (position) => {
  if (!position) return AD_POSITIONS.HORIZONTAL_1;
  
  // Convert to uppercase and replace spaces with underscores
  const normalized = position.toString().toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
  
  // Map common variations
  const positionMap = {
    'HORIZONTAL_1': AD_POSITIONS.HORIZONTAL_1,
    'HORIZONTAL_2': AD_POSITIONS.HORIZONTAL_2,
    'HORIZONTAL_3': AD_POSITIONS.HORIZONTAL_3,
    'VERTICAL_1': AD_POSITIONS.VERTICAL_1,
    'VERTICAL_2': AD_POSITIONS.VERTICAL_2,
    'VERTICAL_3': AD_POSITIONS.VERTICAL_3,
    'VERTICAL_4': AD_POSITIONS.VERTICAL_4,
    'FLOATING_BOTTOM': AD_POSITIONS.FLOATING_BOTTOM,
    'FLOATING_RIGHT': AD_POSITIONS.FLOATING_RIGHT,
    // Handle "Horizontal 1" format
    'HORIZONTAL1': AD_POSITIONS.HORIZONTAL_1,
    'HORIZONTAL2': AD_POSITIONS.HORIZONTAL_2,
    'HORIZONTAL3': AD_POSITIONS.HORIZONTAL_3,
    'VERTICAL1': AD_POSITIONS.VERTICAL_1,
    'VERTICAL2': AD_POSITIONS.VERTICAL_2,
    'VERTICAL3': AD_POSITIONS.VERTICAL_3,
    'VERTICAL4': AD_POSITIONS.VERTICAL_4,
    'FLOATINGBOTTOM': AD_POSITIONS.FLOATING_BOTTOM,
    'FLOATINGRIGHT': AD_POSITIONS.FLOATING_RIGHT,
  };
  
  return positionMap[normalized] || positionMap[normalized.replace(/_/g, '')] || AD_POSITIONS.HORIZONTAL_1;
};

/**
 * Normalize ad data from API to consistent format
 * API Response Structure:
 * - adId: unique identifier
 * - title: ad title
 * - banner: banner name/text
 * - position: "vertical_1", "horizontal_1", etc.
 * - images: array of image filenames
 * - status: "ACTIVE", "PAUSED", etc.
 * - isActive: boolean
 * - priority: "HIGH", "MEDIUM", "LOW"
 * - weight: display weight/priority
 * 
 * @param {Object} ad - Ad data from API
 * @returns {Object} Normalized ad data
 */
const normalizeAdData = (ad) => {
  // Base URL for images
  const IMAGE_BASE_URL = "https://api.entrancegateway.com/images/";
  
  // Get the first image from images array, or fallback to other image fields
  let imageUrl = "";
  if (ad.images && ad.images.length > 0) {
    imageUrl = `${IMAGE_BASE_URL}${ad.images[0]}`;
  } else if (ad.imageUrl) {
    imageUrl = ad.imageUrl.startsWith("http") ? ad.imageUrl : `${IMAGE_BASE_URL}${ad.imageUrl}`;
  } else if (ad.image) {
    imageUrl = ad.image.startsWith("http") ? ad.image : `${IMAGE_BASE_URL}${ad.image}`;
  } else if (ad.bannerImage) {
    imageUrl = ad.bannerImage.startsWith("http") ? ad.bannerImage : `${IMAGE_BASE_URL}${ad.bannerImage}`;
  }
  
  return {
    id: ad.adId || ad.id || ad._id || `ad-${Date.now()}`,
    adId: ad.adId || ad.id,
    title: ad.title || ad.bannerName || "Advertisement",
    bannerName: ad.banner || ad.bannerName || ad.name || "",
    description: ad.notes || ad.description || "",
    position: normalizePosition(ad.position),
    priority: ad.priority || AD_PRIORITY.MEDIUM,
    status: ad.status || AD_STATUS.ACTIVE,
    imageUrl: imageUrl,
    bannerUrl: imageUrl, // Alias for compatibility
    redirectUrl: ad.redirectUrl || ad.link || ad.url || "#",
    linkUrl: ad.redirectUrl || ad.link || ad.url || "#", // Alias
    startDate: ad.startDate || null,
    endDate: ad.endDate || null,
    weight: ad.weight || 50,
    isActive: ad.isActive !== false && ad.status === "ACTIVE",
    // Additional fields from API
    totalBudget: ad.totalBudget || 0,
    costPerClick: ad.costPerClick || 0,
    costPerImpression: ad.costPerImpression || 0,
    maxImpressions: ad.maxImpressions || 0,
    maxClicks: ad.maxClicks || 0,
    targetAudience: ad.targetAudience || "",
    targetLocation: ad.targetLocation || "",
    targetDevices: ad.targetDevices || "",
    tags: ad.tags || "",
    utmParameters: ad.utmParameters || "",
    trackingPixel: ad.trackingPixel || "",
    displaySchedule: ad.displaySchedule || "",
    createdBy: ad.createdBy || "",
  };
};

export const getAdsByPosition = async (position, { page = 0, size = 10 } = {}) => {
  try {
    const response = await api.get(`/ads?position=${position}&page=${page}&size=${size}`);
    const responseData = response.data;
    
    let ads = [];
    if (responseData?.data?.content) {
      ads = responseData.data.content;
    } else if (Array.isArray(responseData?.data)) {
      ads = responseData.data;
    } else if (Array.isArray(responseData)) {
      ads = responseData;
    }
    
    if (ads.length > 0) {
      return ads
        .filter((ad) => ad.isActive !== false)
        .map(normalizeAdData);
    }
    return getActiveScheduledAds(STATIC_ADS).filter((ad) => ad.position === position);
  } catch (error) {
    return getActiveScheduledAds(STATIC_ADS).filter((ad) => ad.position === position);
  }
};

export const filterAdsByPosition = (ads, position) => {
  return ads
    .filter((ad) => ad.position === position && ad.isActive !== false)
    .sort((a, b) => {
      const weightDiff = (b.weight || 0) - (a.weight || 0);
      if (weightDiff !== 0) return weightDiff;
      return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
    });
};

export const getPositionLimit = (position) => {
  return POSITION_LIMITS[position] || 1;
};