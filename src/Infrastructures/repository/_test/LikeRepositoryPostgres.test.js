const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");

describe("LikeRepositoryPostgres", () => {
  const threadId = "thread-123";
  const commentId = "comment-123";
  const userId = "user-123";
  const likeId = "like-123";

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: "dicoding" });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: "Thread Title",
      body: "Thread Body",
      owner: userId,
      date: "2024-11-05T03:37:44.956Z",
    });
    await CommentsTableTestHelper.addCommentThread({
      id: commentId,
      content: "Test comment",
      owner: userId,
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("checkLikeIsExist function", () => {
    it("should throw NotFoundError when like does not exist", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const commentId = "comment-123";
      const userId = "user-123";

      // Action
      const result = await likeRepositoryPostgres.checkLikeIsExist({
        commentId,
        userId,
      });

      // Assert
      expect(result).toBeUndefined();
    });

    it("should not throw NotFoundError when like exists", async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ commentId, userId });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        likeRepositoryPostgres.checkLikeIsExist({ commentId, userId })
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("addLike function", () => {
    it("should persist like and return added like correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123"; // Stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedLike = await likeRepositoryPostgres.addLike({
        commentId,
        owner: userId,
      });

      // Assert
      expect(addedLike).toStrictEqual({
        id: "like-123",
        comment_id: commentId,
        user_id: userId,
      });

      const likes = await LikesTableTestHelper.getLikeById("like-123");
      expect(likes).toStrictEqual({
        id: "like-123",
        comment_id: commentId,
        user_id: userId,
        created_at: likes.created_at,
      });
    });
  });

  describe("getLikeById function", () => {
    it("should return like details correctly when like is found", async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: likeId,
        commentId,
        owner: userId,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikeById(likeId);

      // Assert
      expect(like).toStrictEqual({
        id: likeId,
        comment_id: commentId,
        user_id: userId,
        created_at: like.created_at,
      });
    });

    it("should throw NotFoundError when like is not found", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Action & Assert
      await expect(
        likeRepositoryPostgres.getLikeById(likeId)
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("getCountLikeByCommentId function", () => {
    it("should return the correct like count for a comment", async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ commentId, owner: userId });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getCountLikeByCommentId(
        commentId
      );

      // Assert
      expect(likeCount).toBe(1);
    });
  });

  describe("deleteLike function", () => {
    it("should delete like from database", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        () => "123"
      );

      // Tambahkan like untuk dihapus
      await likeRepositoryPostgres.addLike({ commentId, owner: userId });

      // Action
      await likeRepositoryPostgres.deleteLike({ commentId, owner: userId });

      // Assert
      const like = await LikesTableTestHelper.getLikeById("like-123");
      expect(like).toBeUndefined();
    });
  });
});
