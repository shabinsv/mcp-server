function formatData(data) {
  if (data === undefined) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}

function logRequest(method, url) {
  console.log(`[INFO]: ${method} URL: ${url}`);
}

function logResponse(method, url, data) {
  console.log(
    `[INFO]: RESPONSE (${method} ${url}): ${formatData(data)}`
  );
}

function logError(method, url, error) {
  const message = error instanceof Error ? error.message : formatData(error);
  console.error(
    `[ERROR]: RESPONSE (${method} ${url}): ${message}`
  );
}

module.exports = {
  logError,
  logRequest,
  logResponse,
};
