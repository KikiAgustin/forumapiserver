const LikeCommentUseCase = require("../LikeCommentUseCase");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("LikeCommentUseCase", () => {
  it("should throw error if thread does not exist", async () => {
    // Arrange
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const owner = "user-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("THREAD_NOT_FOUND"))
      );

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute(params, owner)
    ).rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      params.threadId
    );
  });

  it("should throw error if comment does not exist", async () => {
    // Arrange
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const owner = "user-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("COMMENT_NOT_FOUND"))
      );

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeCommentUseCase.execute(params, owner)
    ).rejects.toThrowError(NotFoundError);
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith({
      threadId: params.threadId,
      commentId: params.commentId,
    });
  });

  it("should remove like if it already exists", async () => {
    // Arrange
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const owner = "user-123";
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(params, owner);

    // Assert
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith({
      commentId: params.commentId,
      owner: owner,
    });
  });

  it("should add like if it does not exist", async () => {
    // Arrange
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const owner = "user-123"; // pastikan owner ini sudah didefinisikan dengan benar
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkLikeIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(params, owner);

    // Assert
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
      expect.objectContaining({
        commentId: params.commentId,
        owner,
      })
    );
  });
});
