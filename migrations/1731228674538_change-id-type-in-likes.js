exports.up = (pgm) => {
  pgm.dropColumn("likes", "id");

  pgm.addColumn("likes", {
    id: { type: "text", primaryKey: true },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("likes", "id");

  pgm.addColumn("likes", {
    id: { type: "serial", primaryKey: true },
  });
};
