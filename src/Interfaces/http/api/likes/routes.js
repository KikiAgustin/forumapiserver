const routes = (handler) => [
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: handler.putLikeCommentHandler,
  },
];

module.exports = routes;
