import api from "./index";

// --------------------------------------
// Get All Notices (PUBLIC)
// Expected backend shape:
// { message: string, data: { content: Notice[], ...pagination } }
// --------------------------------------
export const getNotices = async (params = {}) => {
  const res = await api.get("/api/v1/notices", { params });
  return {
    content: res.data?.data?.content || [],
    page: res.data?.data || {},
    raw: res.data,
  };
};

// --------------------------------------
// Get Single Notice By ID (PUBLIC)
// --------------------------------------
export const getNoticeById = async (id) => {
  if (!id) throw new Error("Notice ID is missing");
  const res = await api.get(`/api/v1/notices/${id}`);
  return res.data;
};

// --------------------------------------
// Get Notice File/Image (PUBLIC)
// Returns blob of image file
// --------------------------------------
export const getNoticeFile = async (noticeId) => {
  if (!noticeId) throw new Error("Notice ID is missing");
  try {
    const res = await api.get(`/api/v1/notices/getNoticeFile/${noticeId}`, {
      responseType: "blob",
    });
    return res.data; // Blob object
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to fetch notice file";
    throw new Error(message);
  }
};
