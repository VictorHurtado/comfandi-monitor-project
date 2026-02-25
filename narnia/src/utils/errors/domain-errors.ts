export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 400, cause);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 404, cause);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 409, cause);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 401, cause);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 403, cause);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 500, cause);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 400, cause);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 422, cause);
  }
}
