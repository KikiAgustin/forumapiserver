const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit"
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang"
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password"
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "menambahkan thread yang tidak mengandung properti yang dibutuhkan"
  ),
  "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "menambahkan thread yang tidak memenuhi spesifikasi data"
  ),
  "ADD_THREAD.TITLE_LIMIT_CHAR": new InvariantError(
    "menambahkan thread dengan karakter yang dibatasi"
  ),
  "ADD_COMMENT_THREAD.PAYLOAD_CANNOT_BE_EMPTY": new InvariantError(
    "Isi dari payload komentar tidak boleh kosong"
  ),
  "ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "Properti yang diperlukan tidak ada dalam payload komentar"
  ),
  "ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "Jenis data pada payload komentar tidak sesuai dengan spesifikasi yang diperlukan"
  ),
  "ADD_COMMENT_THREAD.CONTENT_LIMIT_CHAR": new InvariantError(
    "Konten komentar melebihi batas karakter yang diizinkan."
  ),
};

module.exports = DomainErrorTranslator;
