const AddCommentThreadUseCase = require("../AddCommentThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("AddCommentThreadUseCase", () => {
  it("should orchestrate the add comment thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "This is a comment",
    };
    const owner = "user-123";
    const params = { threadId: "thread-123" };

    const expectedAddedCommentThread = {
      id: "comment-123",
      content: useCasePayload.content,
      owner,
    };

    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();

    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository,
      commentRepository,
    });

    // Mocking dependencies
    jest.spyOn(threadRepository, "verifyThreadExists").mockResolvedValue();
    jest.spyOn(commentRepository, "addCommentThread").mockResolvedValue({
      id: "comment-123",
      content: useCasePayload.content,
      owner,
    });

    // Action
    const addedCommentThread = await addCommentThreadUseCase.execute(
      params,
      owner,
      useCasePayload
    );

    // Assert
    expect(addedCommentThread).toStrictEqual(expectedAddedCommentThread);
    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(
      params.threadId
    );
    expect(commentRepository.addCommentThread).toHaveBeenCalledWith(
      expect.objectContaining({
        content: useCasePayload.content,
        owner,
        threadId: params.threadId,
      })
    );
  });
});
