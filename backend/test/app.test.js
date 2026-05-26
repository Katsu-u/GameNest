const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const app = require("../src/app");

test("the express app is created", () => {
  assert.equal(typeof app, "function");
});

test("GET /api/health returns the backend status", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
    assert.equal(body.app, "gamenest-backend");
    assert.equal(typeof body.timestamp, "string");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("GET /api/games/search requires a search query", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/games/search`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Search query is required");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("POST /api/games validates required fields before database access", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "released"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation failed");
    assert.equal(body.details[0].field, "title");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("POST /api/games validates status values before database access", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Test Game",
        status: "archived"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation failed");
    assert.equal(body.details[0].field, "status");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("POST /api/articles validates required fields before database access", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": "gamenest-admin"
      },
      body: JSON.stringify({
        sourceUrl: "https://example.com/article"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation failed");
    assert.equal(body.details[0].field, "title");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("POST /api/articles validates source URLs before database access", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": "gamenest-admin"
      },
      body: JSON.stringify({
        title: "Article test",
        sourceUrl: "not-a-url"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation failed");
    assert.equal(body.details[0].field, "sourceUrl");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test("POST /api/articles requires an admin token", async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Article test",
        sourceUrl: "https://example.com/article"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error, "Admin access required");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
