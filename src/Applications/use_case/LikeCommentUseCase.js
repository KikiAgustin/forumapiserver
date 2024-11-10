const LikeComment = require("../../Domains/likes/entities/LikeComment");

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(params, owner) {
    const { threadId, commentId } = params;

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.checkCommentIsExist({ threadId, commentId });

    const checkLikeIsExist = await this._likeRepository.checkLikeIsExist({
      commentId,
      userId: owner,
    });

    if (checkLikeIsExist) {
      return this._likeRepository.deleteLike({ commentId, owner });
    }

    const like = new LikeComment({
      commentId,
      owner,
    });

    return this._likeRepository.addLike(like);
  }
}

module.exports = LikeCommentUseCase;
