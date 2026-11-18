
/**
 * Custom error untuk mengatur pesan dan HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;

    // Memastikan prototype tetap sesuai dengan AppError
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
