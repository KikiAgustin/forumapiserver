const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("DeleteCommentUseCase", () => {
  it("should throw error if comment does not exist", async () => {
    // Arrange
    const owner = "user-123";
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError("COMMENT_NOT_FOUND"))
      );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(owner, params)
    ).rejects.toThrowError(NotFoundError);
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(
      params
    );
  });

  it("should throw error if user does not have access to the comment", async () => {
    // Arrange
    const owner = "user-123";
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new AuthorizationError("ACCESS_DENIED"))
      );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(owner, params)
    ).rejects.toThrowError(AuthorizationError);
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(
      params
    );
    expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledWith({
      owner: owner,
      commentId: params.commentId,
    });
  });

  it("should orchestrate the delete comment action correctly", async () => {
    // Arrange
    const owner = "user-123";
    const params = { threadId: "thread-123", commentId: "comment-123" };
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(owner, params);

    // Assert
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith({
      threadId: params.threadId,
      commentId: params.commentId,
    });
    expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledWith({
      commentId: params.commentId,
      owner: owner,
    });
    expect(mockCommentRepository.verifyCommentAccess).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(
      params.commentId
    );
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledTimes(1);
  });
});
