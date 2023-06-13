
import { NextFunction, Request, Response } from 'express';
import  { HttpException, errorHandler } from '../exceptions'
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {

  errorHandler.handleError(error, response)
}
 
export default errorMiddleware;