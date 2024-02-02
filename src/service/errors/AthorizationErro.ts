export class AuthorizationError extends Error {
  constructor() {
    super("Error with token");
  }
}
