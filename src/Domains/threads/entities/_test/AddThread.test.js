const AddThread = require("../AddThread");

describe("an AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "Thread title",
      body: "This is the body of the thread",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: 123,
      body: [],
      owner: "user123",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when title contains more than 100 characters", () => {
    // Arrange
    const payload = {
      title: "a".repeat(101),
      body: "This is the body of the thread",
      owner: "user123",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "Thread title",
      body: "This is the body of the thread",
      owner: "user123",
    };

    // Action
    const { title, body, owner } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
