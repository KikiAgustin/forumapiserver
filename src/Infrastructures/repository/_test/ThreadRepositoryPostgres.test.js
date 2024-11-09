const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist thread and return added thread correctly", async () => {
      // Arrange
      const userId = "user-123";
      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding",
        password: "password123",
        fullname: "dicoding id",
      });

      const newThread = {
        title: "Thread Title",
        body: "Thread Body",
        owner: userId,
      };

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      const thread = await ThreadsTableTestHelper.findThreadById("thread-123");

      // Assert
      expect(addedThread).toStrictEqual({
        id: "thread-123",
        title: "Thread Title",
        owner: userId,
      });
      expect(thread).toStrictEqual({
        id: "thread-123",
        title: "Thread Title",
        body: "Thread Body",
        owner: userId,
        date: expect.any(String),
      });
    });
  });

  describe("verifyThreadExists function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExists("thread-999")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread exists", async () => {
      // Arrange
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "Thread Title",
        owner: userId,
        date: "2021-08-08T07:19:09.775Z",
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExists("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should return thread details correctly when thread is found", async () => {
      // Arrange
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "dicoding" });
      const threadId = "thread-123";
      const threadData = {
        id: threadId,
        title: "Thread Title",
        body: "Thread Body",
        date: "2024-11-05T03:37:44.956Z",
        owner: userId,
      };
      await ThreadsTableTestHelper.addThread(threadData);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toStrictEqual({
        id: threadId,
        title: threadData.title,
        body: threadData.body,
        date: threadData.date,
        username: "dicoding",
      });
    });
  });
});
