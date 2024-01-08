// setting as an abstract class so it won't be instantiated
// using this to setup requirements for the subclasses of errors
export abstract class CustomError extends Error {
  // it must have these props
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }
  
}
