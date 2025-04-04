
export class AppError extends Error {
  public statusCode: number;
  public context?: Record<string, unknown>;

  constructor(message: string, statusCode = 400, context?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error: unknown): { message: string; statusCode: number } => {
  console.error('Error occurred:', error);
  
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  }
  
  return {
    message: 'An unknown error occurred',
    statusCode: 500,
  };
};
