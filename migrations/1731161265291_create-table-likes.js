exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    comment_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"comments"(id)',
      onDelete: "cascade",
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"(id)',
      onDelete: "cascade",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint(
    "likes",
    "unique_comment_id_user_id",
    "UNIQUE(comment_id, user_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("likes");
};
