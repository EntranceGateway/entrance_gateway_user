import api from "./index";

/**
 * Submit contact form to the API
 * @param {Object} data - Contact form data
 * @param {string} data.name - User's full name (required, ≥1 char)
 * @param {string} data.email - User's email address (required, valid email format)
 * @param {string} data.message - User's message (0-5000 chars)
 * @param {string} data.phone - User's phone number (optional)
 * @param {string} data.subject - Subject enum: GENERAL_INQUIRY, TECHNICAL_SUPPORT, BILLING_ISSUES, FEEDBACK_SUGGESTIONS, COURSE_INFORMATION, COLLABORATION_OPPORTUNITIES, OTHER
 * @returns {Promise} API response
 */
export const submitContactForm = async (data) => {
  const response = await api.post("/contact-us", data);
  return response.data;
};

export default {
  submitContactForm,
};
