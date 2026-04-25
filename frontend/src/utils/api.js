// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// /**
//  * Analyzes a resume against a job description.
//  * @param {File} file - The resume file (PDF or DOCX).
//  * @param {string} jdText - The job description text.
//  * @returns {Promise<Object>} - The structured JSON analysis result.
//  */
// export const analyzeResume = async (file, jdText) => {
//   const formData = new FormData();
//   formData.append('resume_file', file);
//   formData.append('jd_text', jdText);

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout

//   try {
//     const response = await fetch(`${BASE_URL}/analyze/`, {
//       method: 'POST',
//       body: formData,
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//       if (!response.ok) {
//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { message: 'An unexpected error occurred.' };
//       }
      
//       throw {
//         error: errorData.error || 'server_error',
//         message: errorData.message || 'The server returned an error.',
//         code: errorData.code || `ERR_${response.status}`,
//       };
//     }

//     return await response.json();
//   } catch (err) {
//     clearTimeout(timeoutId);
    
//     if (err.name === 'AbortError') {
//       throw {
//         error: 'timeout',
//         message: 'The request took too long. Please try again.',
//         code: 'TIMEOUT_001',
//       };
//     }

//     if (err.error) throw err;

//     throw {
//       error: 'network_error',
//       message: 'Could not reach the server. Please try again.',
//       code: 'NET_001',
//     };
//   }
// };



const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const analyzeResume = async (file, jdText) => {

  // 1 Input validation
  if (!file) {
    throw new Error("Resume file is required");
  }

  if (!jdText?.trim()) {
    throw new Error("Job description is required");
  }

  const formData = new FormData();
  formData.append("resume_file", file);
  formData.append("jd_text", jdText);

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    45000
  ); // 45 seconds

  try {

    const response = await fetch(`${BASE_URL}/analyze/`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    // 2 Handle server errors safely
    if (!response.ok) {

      let errorMessage = "Server returned an error";
      let errorCode = `ERR_${response.status}`;

      const contentType = response.headers.get("content-type");

      try {

        if (contentType?.includes("application/json")) {

          const data = await response.json();

          errorMessage =
            data.message ||
            data.error ||
            errorMessage;

          errorCode =
            data.code ||
            errorCode;

        } else {

          // handle HTML/text errors
          const text = await response.text();

          console.error("Server response:", text);

          if (text) {
            errorMessage = text;
          }
        }

      } catch(parseError) {
        console.error(
          "Error parsing server response:",
          parseError
        );
      }

      const error = new Error(errorMessage);
      error.code = errorCode;
      error.type = "server_error";

      throw error;
    }

    // 3 Safe success parsing
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      throw new Error(
        "Invalid response format from server"
      );
    }

    return await response.json();

  } catch (err) {

    // timeout
    if (err.name === "AbortError") {
      const error = new Error(
        "Request timed out. Please try again."
      );
      error.code = "TIMEOUT_001";
      error.type = "timeout";
      throw error;
    }

    // preserve known errors
    if (err.type || err.code) {
      throw err;
    }

    // network failures
    if (
      err.message.includes("Failed to fetch") ||
      err.message.includes("Network")
    ) {
      const error = new Error(
        "Could not reach server."
      );
      error.code = "NET_001";
      error.type = "network_error";
      throw error;
    }

    throw err;

  } finally {
    clearTimeout(timeoutId);
  }
};