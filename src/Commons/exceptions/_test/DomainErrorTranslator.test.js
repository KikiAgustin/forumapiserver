const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "menambahkan thread yang tidak mengandung properti yang dibutuhkan"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "menambahkan thread yang tidak memenuhi spesifikasi data"
      )
    );
    expect(
      DomainErrorTranslator.translate(new Error("ADD_THREAD.TITLE_LIMIT_CHAR"))
    ).toStrictEqual(
      new InvariantError("menambahkan thread dengan karakter yang dibatasi")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_THREAD.PAYLOAD_CANNOT_BE_EMPTY")
      )
    ).toStrictEqual(
      new InvariantError("Isi dari payload komentar tidak boleh kosong")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "Properti yang diperlukan tidak ada dalam payload komentar"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "Jenis data pada payload komentar tidak sesuai dengan spesifikasi yang diperlukan"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_COMMENT_THREAD.CONTENT_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "Konten komentar melebihi batas karakter yang diizinkan."
      )
    );
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
