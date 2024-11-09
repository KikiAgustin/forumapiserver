const AddCommentThread = require("../../Domains/comments/entities/AddCommentThread");

class AddCommentThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(params, owner, useCasePayload) {
    await this._threadRepository.verifyThreadExists(params.threadId);

    const comment = new AddCommentThread({
      ...useCasePayload,
      owner,
      threadId: params.threadId,
    });

    return this._commentRepository.addCommentThread(comment);
  }
}

module.exports = AddCommentThreadUseCase;
