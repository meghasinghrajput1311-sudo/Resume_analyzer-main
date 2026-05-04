

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
  formData.append("job_role", jdText);

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