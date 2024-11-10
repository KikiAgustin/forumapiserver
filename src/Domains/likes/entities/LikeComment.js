class LikeComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, owner } = payload;

    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("LIKE_COMMENT.PAYLOAD_CANNOT_BE_EMPTY");
    }

    const { commentId, owner } = payload;

    if (!commentId || !owner) {
      throw new Error("LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof commentId !== "string" || typeof owner !== "string") {
      throw new Error("LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = LikeComment;
