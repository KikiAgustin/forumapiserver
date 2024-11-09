class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(owner, params) {
    const { threadId, commentId } = params;

    await this._commentRepository.checkCommentIsExist({ threadId, commentId });
    await this._commentRepository.verifyCommentAccess({ commentId, owner });
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
