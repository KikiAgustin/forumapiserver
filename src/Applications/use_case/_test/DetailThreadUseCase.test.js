const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
  it("should orchestrate the get detail thread action correctly", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
    };

    const expectedThreadDetail = {
      id: "thread-123",
      title: "Example Thread Title",
      body: "Example thread body content",
      date: "2024-11-01",
      username: "user123",
      comments: [
        {
          id: "comment-123",
          username: "user456",
          date: "2024-11-02",
          content: "Example comment content",
          likeCount: 5,
        },
      ],
    };

    // Mock dependencies
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeRepository = new LikeRepository();

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
    });

    // Mock methods
    jest.spyOn(threadRepository, "getThreadById").mockResolvedValue({
      id: "thread-123",
      title: "Example Thread Title",
      body: "Example thread body content",
      date: "2024-11-01",
      username: "user123",
    });

    jest.spyOn(commentRepository, "getCommentsByThreadId").mockResolvedValue([
      {
        id: "comment-123",
        username: "user456",
        date: "2024-11-02",
        content: "Example comment content",
        is_deleted: false,
      },
    ]);

    jest.spyOn(likeRepository, "getCountLikeByCommentId").mockResolvedValue(5);

    // Action
    const threadDetail = await detailThreadUseCase.execute(useCaseParams);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(threadRepository.getThreadById).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(commentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(likeRepository.getCountLikeByCommentId).toHaveBeenCalledWith(
      "comment-123"
    );
  });
  it("should return thread detail with deleted comment", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
    };

    const expectedThreadDetail = {
      id: "thread-123",
      title: "Example Thread Title",
      body: "Example thread body content",
      date: "2024-11-01",
      username: "user123",
      comments: [
        {
          id: "comment-123",
          username: "user456",
          date: "2024-11-02",
          content: "**komentar telah dihapus**",
          likeCount: 0,
        },
      ],
    };

    // Mock dependencies
    const threadRepository = new ThreadRepository();
    const commentRepository = new CommentRepository();
    const likeRepository = new LikeRepository();

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository,
      commentRepository,
      likeRepository,
    });

    // Mock methods
    jest.spyOn(threadRepository, "getThreadById").mockResolvedValue({
      id: "thread-123",
      title: "Example Thread Title",
      body: "Example thread body content",
      date: "2024-11-01",
      username: "user123",
    });

    jest.spyOn(commentRepository, "getCommentsByThreadId").mockResolvedValue([
      {
        id: "comment-123",
        username: "user456",
        date: "2024-11-02",
        content: "Example comment content",
        is_deleted: true,
      },
    ]);

    jest.spyOn(likeRepository, "getCountLikeByCommentId").mockResolvedValue(0);

    // Action
    const threadDetail = await detailThreadUseCase.execute(useCaseParams);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(threadRepository.getThreadById).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(commentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(likeRepository.getCountLikeByCommentId).toHaveBeenCalledWith(
      "comment-123"
    );
  });
});
