import { MongoError } from 'mongodb';

interface MongoErrorResponse {
  message: string;
  code?: number;
}

export function handleMongoError(error: MongoError): MongoErrorResponse {
  let response: MongoErrorResponse;

  switch (error.code) {
    case 11000:
      response = {
        message: 'Duplicate key error: A record with the same value already exists.',
        code: error.code,
      };
      break;
    case 121:
      response = {
        message: 'Document validation error: The document does not meet the validation criteria.',
        code: error.code,
      };
      break;
    case 13:
      response = {
        message: 'Unauthorized: You do not have permission to perform this action.',
        code: error.code,
      };
      break;
    default:
      response = {
        message: 'An unknown error occurred while interacting with the database.',
        code: error.code as number,
      };
      break;
  }

  return response;
}
