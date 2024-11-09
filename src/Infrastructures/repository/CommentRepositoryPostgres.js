const CommentRepository = require("../../Domains/comments/CommentRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentThread(comment) {
    const { content, threadId, owner } = comment;
    const id = `comment-${this._idGenerator()}`;
    const commentCreated = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments(id, thread_id, owner, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, threadId, owner, content, commentCreated],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT  comments.id,
              comments.is_deleted,
              comments.date,
              comments.content, 
              users.username
              FROM comments INNER JOIN users
              ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkCommentIsExist({ threadId, commentId }) {
    const query = {
      text: ` SELECT 1
      FROM comments INNER JOIN threads ON comments.thread_id = threads.id
      WHERE threads.id = $1
      AND comments.id = $2
      `,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async verifyCommentAccess({ commentId, owner }) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError(
        "anda tidak mempunyai hak menghapus komentar ini"
      );
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: "UPDATE comments SET is_deleted=TRUE WHERE id=$1 RETURNING id",
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
