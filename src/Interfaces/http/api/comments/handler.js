const AddCommentThreadUseCase = require("../../../../Applications/use_case/AddCommentThreadUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const params = request.params;
    const authorization = request.headers.authorization;

    const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const accessToken = await authenticationTokenManager.getTokenHeader(authorization);
    await authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await authenticationTokenManager.decodePayload(accessToken);

    const addCommentThreadUseCase = this._container.getInstance(
      AddCommentThreadUseCase.name
    );

    const addedComment = await addCommentThreadUseCase.execute(
      params,
      owner,
      request.payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const authorization = request.headers.authorization;
    const params = request.params;

    const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    const accessToken = await authenticationTokenManager.getTokenHeader(authorization);
    await authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await authenticationTokenManager.decodePayload(accessToken);

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute(owner, params);
    return h.response({
      status: "success",
    });
  }
}

module.exports = CommentsHandler;
