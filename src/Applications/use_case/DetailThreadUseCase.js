class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(params) {
    const { threadId } = params;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const commentThread = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const result = {
      ...threadDetail,
      comments: commentThread.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_deleted
          ? "**komentar telah dihapus**"
          : comment.content,
      })),
    };

    return result;
  }
}

module.exports = DetailThreadUseCase;
