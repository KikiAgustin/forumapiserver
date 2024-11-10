const LikeComment = require("../LikeComment");

describe("an LikeComment entities", () => {
  it("should throw error when payload is empty", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError(
      "LIKE_COMMENT.PAYLOAD_CANNOT_BE_EMPTY"
    );
  });

  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
    };

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError(
      "LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: 123,
    };

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError(
      "LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create LikeComment object correctly when payload is valid", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      owner: "user-123",
    };

    // Action
    const { commentId, owner } = new LikeComment(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
