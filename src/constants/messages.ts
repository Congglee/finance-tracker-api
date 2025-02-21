export const AUTH_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',

  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_BETWEEN_1_AND_256: 'Name length must be between 1 and 256 characters',

  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',

  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_100: 'Password length must be between 6 and 100 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Confirm password length must be between 6 and 50 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',

  REGISTER_SUCCESS: 'Register successfully, please check your email to verify your account'
}
