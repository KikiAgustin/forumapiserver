const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addCommentThread({
    id = "comment-123",
    threadId = "thread-123",
    owner = "user-123",
    content = "some comment",
    isDeleted = false,
    date = "2021-08-08T07:19:09.775Z",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, threadId, owner, content, isDeleted, date],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
