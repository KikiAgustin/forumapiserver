const LikeRepository = require("../../Domains/likes/LikeRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkLikeIsExist({ commentId, userId }) {
    const query = {
      text: `SELECT 1
                 FROM likes
                 WHERE comment_id = $1
                 AND user_id = $2`,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async addLike(like) {
    const { commentId, owner } = like;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO likes(id, comment_id, user_id) VALUES($1, $2, $3) RETURNING id, comment_id, user_id",
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeById(likeId) {
    const query = {
      text: `SELECT * 
             FROM likes
             WHERE id = $1`,
      values: [likeId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Like tidak ditemukan");
    }

    return result.rows[0];
  }

  async getCountLikeByCommentId(commentId) {
    const query = {
      text: `SELECT COUNT(*) AS like_count
             FROM likes
             WHERE comment_id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].like_count, 10);
  }

  async deleteLike({ commentId, owner }) {
    const query = {
      text: `DELETE FROM likes
             WHERE comment_id = $1
             AND user_id = $2`,
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
