exports.up = (pgm) => {
  pgm.alterColumn("threads", "date", {
    type: "TEXT",
    notNull: true,
    default: pgm.func("current_timestamp"),
  });

  // Mengubah kolom 'date' di tabel 'comments'
  pgm.alterColumn("comments", "date", {
    type: "TEXT",
    notNull: true,
    default: pgm.func("current_timestamp"),
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("threads", "date", {
    type: "TEXT",
    notNull: true,
    default: null,
  });

  pgm.alterColumn("comments", "date", {
    type: "TEXT",
    notNull: true,
    default: null,
  });
};
