import { Response } from 'express';
import { AppError, HttpCode } from './AppError';

class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  private handleTrustedError(error: AppError, response: Response): void {
    console.log({status: error.httpCode, message: error.message})
    response.status(error.httpCode).json({ message: error.message });
  }

  private handleCriticalError(error: Error | AppError, response?: Response): void {
    if (response) {
        console.log({status: HttpCode.INTERNAL_SERVER_ERROR, message: error.message})
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }
}

export const errorHandler = new ErrorHandler();