import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const respond = (res: Response, data: object = {}) => {
  res.status(StatusCodes.OK).json({
    status: true,
    data,
  });
};

export const respondError = (
  res: Response,
  error: string,
  code = StatusCodes.INTERNAL_SERVER_ERROR,
) => {
  res.status(code).json({
    status: false,
    error,
  });
};
