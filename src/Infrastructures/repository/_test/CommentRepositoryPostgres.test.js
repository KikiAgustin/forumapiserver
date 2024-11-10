const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-1", username: "user1" });
    await ThreadsTableTestHelper.addThread({
      id: "thread-1",
      owner: "user-1",
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addCommentThread", () => {
    it("should add a comment and return the new comment", async () => {
      // Arrange
      const comment = {
        content: "Test comment",
        threadId: "thread-1",
        owner: "user-1",
      };
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action
      const result = await commentRepository.addCommentThread(comment);
      const getComment = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );

      // Assert
      expect(result).toEqual({
        id: "comment-123",
        content: comment.content,
        owner: comment.owner,
      });
      expect(getComment).toEqual({
        id: "comment-123",
        content: comment.content,
        thread_id: comment.threadId,
        owner: comment.owner,
        is_deleted: false,
        date: expect.any(String),
      });
    });
  });

  describe("getCommentsByThreadId", () => {
    it("should return list of comments for a given thread", async () => {
      // Arrange
      await CommentsTableTestHelper.addCommentThread({
        id: "comment-1",
        content: "This is a comment",
        threadId: "thread-1",
        owner: "user-1",
        date: "2024-01-01T00:00:00.000Z",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepository.getCommentsByThreadId("thread-1");

      // Assert
      expect(result).toEqual([
        {
          id: "comment-1",
          content: "This is a comment",
          date: "2024-01-01T00:00:00.000Z",
          username: "user1",
          is_deleted: false,
        },
      ]);
    });
  });

  describe("checkCommentIsExist", () => {
    it("should throw NotFoundError if the comment does not exist", async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.checkCommentIsExist({
          threadId: "thread-1",
          commentId: "comment-999",
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw an error if the comment exists", async () => {
      // Arrange
      await CommentsTableTestHelper.addCommentThread({
        id: "comment-1",
        threadId: "thread-1",
        owner: "user-1",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.checkCommentIsExist({
          threadId: "thread-1",
          commentId: "comment-1",
        })
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentAccess", () => {
    it("should throw AuthorizationError if the owner does not match", async () => {
      // Arrange
      await CommentsTableTestHelper.addCommentThread({
        id: "comment-1",
        threadId: "thread-1",
        owner: "user-1",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentAccess({
          commentId: "comment-1",
          owner: "user-2",
        })
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw an error if the owner matches", async () => {
      // Arrange
      await CommentsTableTestHelper.addCommentThread({
        id: "comment-1",
        threadId: "thread-1",
        owner: "user-1",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentAccess({
          commentId: "comment-1",
          owner: "user-1",
        })
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("deleteCommentById", () => {
    it("should delete the comment if it exists", async () => {
      // Arrange
      await CommentsTableTestHelper.addCommentThread({
        id: "comment-1",
        threadId: "thread-1",
        owner: "user-1",
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepository.deleteCommentById("comment-1");

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-1"
      );
      expect(comment.is_deleted).toBe(true);
    });
  });
});
