/**
 * Old Question Collection API Service
 * Handles all API calls for old exam papers/questions
 * 
 * API Base: /api/v1/old-question-collections
 */
import api from "./index";

// Base URL for PDF viewing
const PDF_BASE_URL = "https://api.entrancegateway.com/api/v1";

/**
 * Get semesters available for a specific course
 * @param {number} courseId - Course ID
 * @returns {Promise<number[]>} List of semester numbers
 */
export const getSemestersForCourse = async (courseId) => {
  try {
    const response = await api.get(`/old-question-collections/course/${courseId}/semesters`);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Failed to fetch semesters:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch semesters");
  }
};

/**
 * Get subjects/syllabi for a specific course and semester
 * @param {number} courseId - Course ID
 * @param {number} semester - Semester number
 * @returns {Promise<Array>} List of subjects with syllabusId
 */
export const getSubjectsForSemester = async (courseId, semester) => {
  try {
    const response = await api.get(
      `/old-question-collections/course/${courseId}/semester/${semester}/subjects`
    );
    const data = response.data?.data || response.data || [];
    return data.map(item => ({
      syllabusId: item.syllabusId,
      subject: item.subject,
      courseName: item.courseName,
    }));
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch subjects");
  }
};

/**
 * Get old questions by syllabus ID
 * @param {number} syllabusId - Syllabus ID
 * @returns {Promise<Array>} List of old questions
 */
export const getQuestionsBySyllabus = async (syllabusId) => {
  try {
    const response = await api.get(`/old-question-collections/syllabus/${syllabusId}`);
    const data = response.data?.data || response.data || [];
    return normalizeQuestions(data);
  } catch (error) {
    console.error("Failed to fetch questions by syllabus:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch questions");
  }
};

/**
 * Filter old questions with multiple parameters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.courseName - Course name (required)
 * @param {number} filters.semester - Semester number (optional)
 * @param {number} filters.year - Academic year (optional)
 * @param {string} filters.affiliation - Affiliation enum (optional)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated response
 */
export const filterOldQuestions = async (filters, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.courseName) params.append("courseName", filters.courseName);
    if (filters.semester) params.append("semester", filters.semester);
    if (filters.year) params.append("year", filters.year);
    if (filters.affiliation) params.append("affiliation", filters.affiliation);
    params.append("page", page);
    params.append("size", size);
    params.append("sortBy", "year");
    params.append("sortDir", "desc");

    const response = await api.get(`/old-question-collections/filter?${params.toString()}`);
    const responseData = response.data?.data || response.data;
    
    return {
      items: normalizeQuestions(responseData?.content || []),
      totalElements: responseData?.totalElements || 0,
      totalPages: responseData?.totalPages || 0,
      currentPage: responseData?.pageNumber || page,
      pageSize: responseData?.pageSize || size,
    };
  } catch (error) {
    console.error("Failed to filter questions:", error);
    throw new Error(error.response?.data?.message || "Failed to filter questions");
  }
};

/**
 * Search old questions with multiple optional parameters
 * @param {Object} searchParams - Search parameters (all optional)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated response
 */
export const searchOldQuestions = async (searchParams = {}, page = 0, size = 12) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.courseName) params.append("courseName", searchParams.courseName);
    if (searchParams.syllabusName) params.append("syllabusName", searchParams.syllabusName);
    if (searchParams.year) params.append("year", searchParams.year);
    if (searchParams.setName) params.append("setName", searchParams.setName);
    if (searchParams.semester) params.append("semester", searchParams.semester);
    if (searchParams.affiliation) params.append("affiliation", searchParams.affiliation);
    params.append("page", page);
    params.append("size", size);
    params.append("sortBy", "year");
    params.append("sortDir", "desc");

    const response = await api.get(`/old-question-collections/search?${params.toString()}`);
    const responseData = response.data?.data || response.data;
    
    return {
      items: normalizeQuestions(responseData?.content || []),
      totalElements: responseData?.totalElements || 0,
      totalPages: responseData?.totalPages || 0,
      currentPage: responseData?.pageNumber || page,
      pageSize: responseData?.pageSize || size,
    };
  } catch (error) {
    console.error("Failed to search questions:", error);
    // Return empty results instead of throwing
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: page,
      pageSize: size,
    };
  }
};

/**
 * Get PDF view URL for a question
 * @param {number} id - Question ID
 * @returns {string} PDF view URL
 */
export const getPdfViewUrl = (id) => {
  return `${PDF_BASE_URL}/old-question-collections/view/${id}`;
};

/**
 * Fetch PDF blob for viewing with authentication
 * @param {string} url - PDF URL path (e.g., "/old-question-collections/9")
 * @param {string} token - Auth token
 * @returns {Promise<Blob>} PDF blob
 */
export const fetchPdfBlob = async (url = "", token) => {
  if (!token) throw new Error("Authentication token is missing");
  if (!url) throw new Error("URL is missing");

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "blob",
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }

    const contentType = res.headers["content-type"];
    if (!contentType || !contentType.includes("application/pdf")) {
      throw new Error("Invalid response: not a PDF file");
    }

    return res.data; // Blob object
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to fetch PDF";
    throw new Error(message);
  }
};

/**
 * Get old question details by ID
 * @param {number} id - Question ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Question details
 */
export const getOldQuestionById = async (id, token) => {
  if (!id) throw new Error("Question ID is missing");
  if (!token) throw new Error("Authentication token is missing");

  try {
    const res = await api.get(`/old-question-collections/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data?.data || res.data;
    return normalizeQuestions([data])[0] || null;
  } catch (err) {
    console.error("Failed to fetch question details:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch question details");
  }
};

/**
 * Normalize question data from API
 * @param {Array} questions - Raw questions from API
 * @returns {Array} Normalized questions
 */
const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];
  
  return questions.map(q => ({
    id: q.id,
    setName: q.setName || "Set A",
    description: q.description || "",
    year: q.year,
    pdfFilePath: q.pdfFilePath,
    pdfUrl: q.id ? getPdfViewUrl(q.id) : null,
    syllabusId: q.syllabusId,
    subject: q.subject || "Unknown Subject",
    courseName: q.courseName || "",
    affiliation: q.affiliation || "TRIBHUVAN_UNIVERSITY",
    // Computed display fields
    displayTitle: `${q.subject || "Question"} - ${q.setName || "Set A"} (${q.year || "N/A"})`,
    displayYear: q.year ? `${q.year}` : "N/A",
  }));
};

/**
 * Get all old questions with pagination
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated response
 */
export const getAllOldQuestions = async (page = 0, size = 12) => {
  return searchOldQuestions({}, page, size);
};

export default {
  getSemestersForCourse,
  getSubjectsForSemester,
  getQuestionsBySyllabus,
  filterOldQuestions,
  searchOldQuestions,
  getPdfViewUrl,
  fetchPdfBlob,
  getOldQuestionById,
  getAllOldQuestions,
};
