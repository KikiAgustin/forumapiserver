class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(params) {
    const { threadId } = params;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const commentThread = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentsWithLikeCount = await Promise.all(
      commentThread.map(async (comment) => {
        const likeCount = await this._likeRepository.getCountLikeByCommentId(
          comment.id
        );
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.is_deleted
            ? "**komentar telah dihapus**"
            : comment.content,
          likeCount: likeCount || 0,
        };
      })
    );

    const result = {
      ...threadDetail,
      comments: commentsWithLikeCount,
    };

    return result;
  }
}

module.exports = DetailThreadUseCase;
