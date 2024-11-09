const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");
const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
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

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, owner);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const threadId = request.params;
    const detailThreadUseCase = this._container.getInstance(
      DetailThreadUseCase.name
    );
    const thread = await detailThreadUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
