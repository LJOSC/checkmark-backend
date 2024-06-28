//@ts-nocheck
const Format = {
  error: (code, message?, data?) => ({
    code,
    data: data || null,
    message: message || 'Something went wrong',
  }),
  success: (data, message?) => ({
    code: 200,
    data: data || null,
    message: message || 'OK',
  }),
  noContent: (message?) => ({
    code: 204,
    data: null,
    message: message || 'No Content Found',
  }),
  badRequest: (data, message?) => ({
    code: 400,
    data: data || null,
    message: message || 'Bad Request',
  }),
  unAuthorized: (message?) => ({
    code: 401,
    data: null,
    message: message || 'Unauthorized',
  }),
  notFound: (message?) => ({
    code: 404,
    data: null,
    message: message || 'Not found',
  }),
  conflict: (data, message?) => ({
    code: 409,
    data: data || null,
    message: message || 'Conflict',
  }),
  internalError: (error, message?) => ({
    code: 500,
    data: null,
    error: `${error}`,
    message: message || 'Internal Server Error',
  }),
  generateErrorObject: (param, message, location) => ({
    param,
    message,
    location,
  }),
};

export default Format;
