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
  process.stdout.write(`INFO [${new Date().toString()}] ${method} URL: ${url}\n`);
}

function logResponse(method, url, data) {
  process.stdout.write(
    `INFO [${new Date().toString()}] RESPONSE (${method} ${url}): ${formatData(data)}\n`
  );
}

function logError(method, url, error) {
  const message = error instanceof Error ? error.message : formatData(error);
  process.stderr.write(
    `ERROR [${new Date().toString()}] RESPONSE(${method} ${url}): ${message}\n`
  );
}

module.exports = {
  logError,
  logRequest,
  logResponse,
};
