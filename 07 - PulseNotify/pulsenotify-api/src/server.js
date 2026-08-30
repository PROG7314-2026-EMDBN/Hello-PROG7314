import express from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

const FOREGROUND_INTERVAL_MS = Number(
  process.env.FOREGROUND_INTERVAL_MS || 5 * 60 * 1000
);

const BACKGROUND_INTERVAL_MS = Number(
  process.env.BACKGROUND_INTERVAL_MS || 15 * 60 * 1000
);

let nextId = 1;
const messages = [];

function createMessage(type, source = "automatic") {
  const id = nextId++;
  const foreground = type === "foreground";

  const message = {
    id,
    type,
    title: foreground
      ? `Live update #${id}`
      : `Background update #${id}`,
    message: foreground
      ? "A new foreground message is available."
      : "A new background message is available.",
    createdAt: new Date().toISOString(),
    source
  };

  messages.push(message);

  console.log(
    `[${message.createdAt}] ${type} message ${id} created (${source})`
  );

  return message;
}

function getMessagesAfter(type, afterId) {
  return messages.filter(
    message =>
      message.type === type &&
      message.id > afterId
  );
}

// Give students something to retrieve immediately.
createMessage("foreground", "startup");
createMessage("background", "startup");

setInterval(
  () => createMessage("foreground"),
  FOREGROUND_INTERVAL_MS
);

setInterval(
  () => createMessage("background"),
  BACKGROUND_INTERVAL_MS
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    serverTime: new Date().toISOString(),
    foregroundIntervalMinutes:
      FOREGROUND_INTERVAL_MS / 60000,
    backgroundIntervalMinutes:
      BACKGROUND_INTERVAL_MS / 60000,
    messageCount: messages.length
  });
});

app.get("/messages/foreground", (req, res) => {
  const afterId = Number(req.query.afterId || 0);

  res.json(
    getMessagesAfter("foreground", afterId)
  );
});

app.get("/messages/background", (req, res) => {
  const afterId = Number(req.query.afterId || 0);

  res.json(
    getMessagesAfter("background", afterId)
  );
});

app.post("/messages/foreground", (_req, res) => {
  res.status(201).json(
    createMessage("foreground", "manual")
  );
});

app.post("/messages/background", (_req, res) => {
  res.status(201).json(
    createMessage("background", "manual")
  );
});

app.get("/messages", (_req, res) => {
  res.json(messages);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `PulseNotify API listening on http://localhost:${PORT}`
  );

  console.log(
    `Foreground messages: every ${
      FOREGROUND_INTERVAL_MS / 60000
    } minute(s)`
  );

  console.log(
    `Background messages: every ${
      BACKGROUND_INTERVAL_MS / 60000
    } minute(s)`
  );
});
