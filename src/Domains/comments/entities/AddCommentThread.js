class AddCommentThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("ADD_COMMENT_THREAD.PAYLOAD_CANNOT_BE_EMPTY");
    }

    const { content, threadId, owner } = payload;

    if (!content || !threadId || !owner) {
      throw new Error("ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof threadId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (content.length > 500) {
      throw new Error("ADD_COMMENT_THREAD.CONTENT_LIMIT_CHAR");
    }
  }
}

module.exports = AddCommentThread;
