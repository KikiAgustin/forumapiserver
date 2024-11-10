const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should respond with 200 and success status when liking a comment", async () => {
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

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: requestPayloadAuth,
      });

      const accessToken = responseAuth.result.data.accessToken;

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

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should toggle like/unlike status when PUT /threads/{threadId}/comments/{commentId}/likes is called twice", async () => {
      // Arrange
      const requestPayloadAuth = {
        username: "dicoding",
        password: "secret",
      };
      const server = await createServer(container);

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

      await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseUnlike = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJsonUnlike = JSON.parse(responseUnlike.payload);
      expect(responseUnlike.statusCode).toEqual(200);
      expect(responseJsonUnlike.status).toEqual("success");
    });
  });
});
