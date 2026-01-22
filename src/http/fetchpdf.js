import api from "./index"; // axios instance

export const getSingle = async (url, token) => {
  const headers = {
    Accept: "application/pdf",
  };

  // Only add Authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await api.get(url, {
    headers,
    responseType: "blob",
    withCredentials: true, // ✅ matches access-control-allow-credentials: true
  });

  if (res.status !== 200) {
    throw new Error(`Unexpected response status: ${res.status}`);
  }

  const contentType = res.headers["content-type"];
  if (!contentType || !contentType.includes("application/pdf")) {
    throw new Error("Invalid response: not a PDF file");
  }

  return res.data; // blob

};

const noteFile="/notes"
const syllabusFile="/syllabus"

export {
    noteFile,
    syllabusFile
}