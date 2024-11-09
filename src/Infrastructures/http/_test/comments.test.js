const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/comments endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should respond with 201 and persisted comment", async () => {
      // Arrange
      const requestPayloadAuth = {
        username: "dicoding",
        password: "secret",
      };
      const server = await createServer(container);

      // Add user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // Authenticate user
      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayloadAuth,
      });

      const accessToken = responseAuth.result.data.accessToken;

      // Add thread
      const requestPayloadThread = {
        title: "Thread Title",
        body: "This is the body of the thread.",
      };
      const responseThread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = responseThread.result.data.addedThread.id;

      // Prepare comment payload
      const requestPayloadComment = {
        content: "This is a comment.",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(
        requestPayloadComment.content
      );
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should respond with 200 and success status", async () => {
      // Arrange
      const requestPayloadAuth = {
        username: "dicoding",
        password: "secret",
      };
      const server = await createServer(container);

      // Add user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      // Authenticate user
      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayloadAuth,
      });

      const accessToken = responseAuth.result.data.accessToken;

      // Add thread
      const requestPayloadThread = {
        title: "Thread Title",
        body: "This is the body of the thread.",
      };
      const responseThread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = responseThread.result.data.addedThread.id;

      // Add comment
      const requestPayloadComment = {
        content: "This is a comment.",
      };
      const responseComment = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentId = responseComment.result.data.addedComment.id;

      // Action: Delete the comment
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("CommentsTableTestHelper", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
    });

    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    it("should insert a comment with default values when no arguments are provided", async () => {
      await CommentsTableTestHelper.addCommentThread({});
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );

      expect(comment).toBeDefined();
      expect(comment.thread_id).toBe("thread-123");
      expect(comment.owner).toBe("user-123");
      expect(comment.content).toBe("some comment");
      expect(comment.is_deleted).toBe(false);
      expect(comment.date).toBe("2021-08-08T07:19:09.775Z");
    });

    it("should insert a comment with specified values when arguments are provided", async () => {
      const customComment = {
        id: "comment-456",
        threadId: "thread-123",
        owner: "user-123",
        content: "custom comment",
        isDeleted: true,
        date: "2023-01-01T00:00:00.000Z",
      };
      await CommentsTableTestHelper.addCommentThread(customComment);
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-456"
      );

      expect(comment).toBeDefined();
      expect(comment.thread_id).toBe("thread-123");
      expect(comment.owner).toBe("user-123");
      expect(comment.content).toBe("custom comment");
      expect(comment.is_deleted).toBe(true);
      expect(comment.date).toBe("2023-01-01T00:00:00.000Z");
    });
  });
});
