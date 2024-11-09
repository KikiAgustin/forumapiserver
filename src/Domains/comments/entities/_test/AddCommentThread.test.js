const AddCommentThread = require("../AddCommentThread");

describe("an AddCommentThread entities", () => {
  it("should throw error when payload is empty", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      "ADD_COMMENT_THREAD.PAYLOAD_CANNOT_BE_EMPTY"
    );
  });

  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "This is a comment",
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      "ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 456,
      owner: true,
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      "ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when content contains more than 500 characters", () => {
    // Arrange
    const payload = {
      content: "a".repeat(501),
      threadId: "thread-123",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddCommentThread(payload)).toThrowError(
      "ADD_COMMENT_THREAD.CONTENT_LIMIT_CHAR"
    );
  });

  it("should create AddCommentThread object correctly when payload is valid", () => {
    // Arrange
    const payload = {
      content: "This is a comment",
      threadId: "thread-123",
      owner: "user-123",
    };

    // Action
    const { content, threadId, owner } = new AddCommentThread(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
