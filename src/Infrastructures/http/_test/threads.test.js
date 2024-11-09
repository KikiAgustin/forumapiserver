const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayloadAuth = {
        username: "dicoding",
        password: "secret",
      };
      const server = await createServer(container);
      // add user
      const responseUser = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayloadAuth,
      });

      const userId = responseUser.result.data.addedUser.id;
      const accessToken = responseAuth.result.data.accessToken;

      const requestPayload = {
        title: "Thread Title",
        body: "This is the body of the thread.",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.owner).toEqual(userId);
    });
  });

  describe("when GET /threads/{id}", () => {
    it("should response 200 and return thread detail", async () => {
      // Arrange
      const requestPayloadAuth = {
        username: "dicoding",
        password: "secret",
      };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayloadAuth,
      });

      const accessToken = responseAuth.result.data.accessToken;

      const threadPayload = {
        title: "Thread Title",
        body: "This is the body of the thread.",
      };

      const responseThread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { addedThread } = JSON.parse(responseThread.payload).data;

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.title).toEqual(threadPayload.title);
      expect(responseJson.data.thread.body).toEqual(threadPayload.body);
    });
  });

  describe("ThreadsTableTestHelper", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
    });

    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    it("should insert a thread with default values when no arguments are provided", async () => {
      await ThreadsTableTestHelper.addThread({});
      const thread = await ThreadsTableTestHelper.findThreadById("thread-123");

      expect(thread).toBeDefined();
      expect(thread.title).toBe("Judul Thread");
      expect(thread.body).toBe("Isi thread ini");
      expect(thread.owner).toBe("user-123");
      expect(thread.date).toBe("2021-08-08T07:19:09.775Z");
    });

    it("should insert a thread with specified values when arguments are provided", async () => {
      const customThread = {
        id: "thread-456",
        title: "Custom Title",
        body: "Custom Body",
        owner: "user-123",
        date: "2023-01-01T00:00:00.000Z",
      };
      await ThreadsTableTestHelper.addThread(customThread);
      const thread = await ThreadsTableTestHelper.findThreadById("thread-456");

      expect(thread).toBeDefined();
      expect(thread.title).toBe("Custom Title");
      expect(thread.body).toBe("Custom Body");
      expect(thread.owner).toBe("user-123");
      expect(thread.date).toBe("2023-01-01T00:00:00.000Z");
    });
  });
});
