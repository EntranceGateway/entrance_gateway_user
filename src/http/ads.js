import api from "./index";

/**
 * Position constants matching admin panel
 */
export const AD_POSITIONS = {
  HORIZONTAL_1: "HORIZONTAL_1",
  HORIZONTAL_2: "HORIZONTAL_2",
  HORIZONTAL_3: "HORIZONTAL_3",
  VERTICAL_1: "VERTICAL_1",
  VERTICAL_2: "VERTICAL_2",
  VERTICAL_3: "VERTICAL_3",
  VERTICAL_4: "VERTICAL_4",
};

/**
 * Static fallback ads - matches admin panel structure
 * Used when API is unavailable or returns empty
 */
export const STATIC_ADS = [
  // Horizontal Position 1 - Top Banner Ads
  {
    id: "static-h1-1",
    title: "Limited Time: 50% Off First Month!",
    bannerName: "ACHS Promo",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: "HIGH",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA",
    redirectUrl: "https://entrancegateway.com/courses",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 5000,
    costPerClick: 0.50,
    costPerImpression: 0.02,
    maxImpressions: 100000,
    maxClicks: 10000,
    weight: 10,
    targetAudience: "Students, Professionals",
    targetLocation: "Nepal, Kathmandu",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "promo, discount, course",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=promo",
    notes: "New Year promotion",
    isActive: true,
  },
  {
    id: "static-h1-2",
    title: "Join Thousands of Successful Students",
    bannerName: "Success Stories",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg",
    redirectUrl: "https://entrancegateway.com/testimonials",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 3000,
    costPerClick: 0.30,
    costPerImpression: 0.01,
    maxImpressions: 50000,
    maxClicks: 5000,
    weight: 8,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop",
    tags: "success, testimonial",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=success",
    notes: "",
    isActive: true,
  },
  {
    id: "static-h1-3",
    title: "Enroll Now & Secure Your Rank!",
    bannerName: "Enrollment CTA",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: "HIGH",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA",
    redirectUrl: "https://entrancegateway.com/register",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 4000,
    costPerClick: 0.40,
    costPerImpression: 0.015,
    maxImpressions: 80000,
    maxClicks: 8000,
    weight: 9,
    targetAudience: "Students, High Schoolers",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "enrollment, cta, register",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=enroll",
    notes: "Main enrollment banner",
    isActive: true,
  },
  {
    id: "static-h1-4",
    title: "Master Entrance with Confidence",
    bannerName: "Confidence Banner",
    position: AD_POSITIONS.HORIZONTAL_1,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://i.pinimg.com/736x/09/47/db/0947db859f8bbec51f4f85d030c59b03.jpg",
    redirectUrl: "https://entrancegateway.com/mock-tests",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 2500,
    costPerClick: 0.25,
    costPerImpression: 0.01,
    maxImpressions: 60000,
    maxClicks: 6000,
    weight: 7,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Desktop, Tablet",
    tags: "mock test, practice",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=mocktest",
    notes: "",
    isActive: true,
  },

  // Horizontal Position 2 - Mid-page Ads
  {
    id: "static-h2-1",
    title: "Free Mock Tests Available Now!",
    bannerName: "Mock Test Promo",
    position: AD_POSITIONS.HORIZONTAL_2,
    priority: "HIGH",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    redirectUrl: "https://entrancegateway.com/mock-tests",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Fri 9AM-9PM",
    totalBudget: 2000,
    costPerClick: 0.20,
    costPerImpression: 0.008,
    maxImpressions: 40000,
    maxClicks: 4000,
    weight: 6,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop",
    tags: "mock test, free",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=freemock",
    notes: "",
    isActive: true,
  },
  {
    id: "static-h2-2",
    title: "Download Study Materials",
    bannerName: "Notes Download",
    position: AD_POSITIONS.HORIZONTAL_2,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    redirectUrl: "https://entrancegateway.com/notes",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 1500,
    costPerClick: 0.15,
    costPerImpression: 0.005,
    maxImpressions: 30000,
    maxClicks: 3000,
    weight: 5,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop, Tablet",
    tags: "notes, download, study",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=notes",
    notes: "",
    isActive: true,
  },

  // Horizontal Position 3 - Before Footer
  {
    id: "static-h3-1",
    title: "Explore Top Colleges in Nepal",
    bannerName: "College Explorer",
    position: AD_POSITIONS.HORIZONTAL_3,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    redirectUrl: "https://entrancegateway.com/colleges",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 1800,
    costPerClick: 0.18,
    costPerImpression: 0.007,
    maxImpressions: 35000,
    maxClicks: 3500,
    weight: 5,
    targetAudience: "Students, Parents",
    targetLocation: "Nepal",
    targetDevices: "Mobile, Desktop",
    tags: "college, explore",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=banner&utm_campaign=colleges",
    notes: "",
    isActive: true,
  },

  // Vertical Position 1 - Sidebar Top (Sticky)
  {
    id: "static-v1-1",
    title: "Premium Membership - 30% Off",
    bannerName: "Premium Sidebar",
    position: AD_POSITIONS.VERTICAL_1,
    priority: "HIGH",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    redirectUrl: "https://entrancegateway.com/premium",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 3500,
    costPerClick: 0.35,
    costPerImpression: 0.012,
    maxImpressions: 70000,
    maxClicks: 7000,
    weight: 10,
    targetAudience: "Students",
    targetLocation: "Nepal, Kathmandu",
    targetDevices: "Desktop",
    tags: "premium, membership, discount",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=sidebar&utm_campaign=premium",
    notes: "Sidebar sticky ad",
    isActive: true,
  },

  // Vertical Position 2
  {
    id: "static-v2-1",
    title: "Daily Practice Questions",
    bannerName: "Daily Practice",
    position: AD_POSITIONS.VERTICAL_2,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    redirectUrl: "https://entrancegateway.com/practice",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 1200,
    costPerClick: 0.12,
    costPerImpression: 0.004,
    maxImpressions: 25000,
    maxClicks: 2500,
    weight: 4,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Desktop, Tablet",
    tags: "practice, daily",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=sidebar&utm_campaign=practice",
    notes: "",
    isActive: true,
  },

  // Vertical Position 3
  {
    id: "static-v3-1",
    title: "Join Our Community",
    bannerName: "Community Ad",
    position: AD_POSITIONS.VERTICAL_3,
    priority: "LOW",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
    redirectUrl: "https://entrancegateway.com/community",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Sun 24hrs",
    totalBudget: 800,
    costPerClick: 0.08,
    costPerImpression: 0.003,
    maxImpressions: 20000,
    maxClicks: 2000,
    weight: 3,
    targetAudience: "Students",
    targetLocation: "Nepal",
    targetDevices: "Desktop",
    tags: "community, social",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=sidebar&utm_campaign=community",
    notes: "",
    isActive: true,
  },

  // Vertical Position 4
  {
    id: "static-v4-1",
    title: "Career Guidance Webinar",
    bannerName: "Webinar Promo",
    position: AD_POSITIONS.VERTICAL_4,
    priority: "MEDIUM",
    status: "ACTIVE",
    createdBy: "admin@entrancegateway.com",
    imageUrl: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400",
    redirectUrl: "https://entrancegateway.com/webinars",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    displaySchedule: "Mon-Fri 6PM-9PM",
    totalBudget: 1000,
    costPerClick: 0.10,
    costPerImpression: 0.004,
    maxImpressions: 15000,
    maxClicks: 1500,
    weight: 4,
    targetAudience: "Students, Professionals",
    targetLocation: "Nepal",
    targetDevices: "Desktop, Tablet",
    tags: "webinar, career, guidance",
    trackingPixel: "",
    utmParameters: "utm_source=entrance&utm_medium=sidebar&utm_campaign=webinar",
    notes: "Evening webinar promotion",
    isActive: true,
  },
];

/**
 * Fetch all active ads from API
 * Falls back to static ads if API fails
 * @returns {Promise} - Array of ads
 */
export const getAds = async () => {
  try {
    const response = await api.get("/api/v1/ads");
    const data = response.data?.data || [];
    // If API returns empty, use static ads
    return data.length > 0 ? data : STATIC_ADS.filter((ad) => ad.isActive);
  } catch (error) {
    console.warn("Ads API unavailable, using static ads:", error.message);
    return STATIC_ADS.filter((ad) => ad.isActive);
  }
};

/**
 * Fetch ads by position
 * @param {string} position - Position like "HORIZONTAL_1", "VERTICAL_1", etc.
 * @returns {Promise} - Array of ads for that position
 */
export const getAdsByPosition = async (position) => {
  try {
    const response = await api.get(`/api/v1/ads?position=${position}`);
    const data = response.data?.data || [];
    if (data.length > 0) return data;
    // Fallback to static
    return STATIC_ADS.filter((ad) => ad.position === position && ad.isActive);
  } catch (error) {
    return STATIC_ADS.filter((ad) => ad.position === position && ad.isActive);
  }
};

/**
 * Helper to filter ads by position from a list
 * @param {Array} ads - Array of all ads
 * @param {string} position - Position to filter by
 * @returns {Array} - Filtered ads sorted by weight (descending)
 */
export const filterAdsByPosition = (ads, position) => {
  return ads
    .filter((ad) => ad.position === position && ad.isActive !== false)
    .sort((a, b) => (b.weight || 0) - (a.weight || 0));
};
