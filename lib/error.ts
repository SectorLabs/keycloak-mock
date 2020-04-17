export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DuplicateUserError.prototype);

    this.name = "DuplicateUserError";
  }
}
