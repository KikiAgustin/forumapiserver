const LikesHanlder = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "likes",
  register: async (server, { container }) => {
    const likesHanlder = new LikesHanlder(container);
    server.route(routes(likesHanlder));
  },
};
