const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");
const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request, h) {
    const params = request.params;
    const authorization = request.headers.authorization;

    const authenticationTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );
    const accessToken = await authenticationTokenManager.getTokenHeader(
      authorization
    );
    await authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await authenticationTokenManager.decodePayload(
      accessToken
    );

    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    );

    await likeCommentUseCase.execute(params, owner);

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
