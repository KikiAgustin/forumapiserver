const AddThreadUseCase = require("../AddThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddThreadUseCase", () => {
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "Thread Title",
      body: "This is the body of the thread.",
    };
    const owner = "user-123";

    const expectedAddedThread = {
      id: "thread-123",
      title: useCasePayload.title,
      owner,
    };

    const threadRepository = new ThreadRepository();

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository,
    });

    // Mocking
    jest.spyOn(threadRepository, "addThread").mockResolvedValue({
      id: "thread-123",
      title: useCasePayload.title,
      owner,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(threadRepository.addThread).toHaveBeenCalledWith(
      expect.objectContaining({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner,
      })
    );
  });
});
