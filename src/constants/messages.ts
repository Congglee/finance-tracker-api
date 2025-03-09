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
  CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_100: 'Confirm password length must be between 6 and 100 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',

  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',

  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',

  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',

  REGISTER_SUCCESS: 'Register successfully, please check your email to verify your account',
  LOGIN_SUCCESS: 'Login successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
  EMAIL_VERIFY_SUCCESS: 'Email verify successfully',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify successfully',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset your password',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully'
}

export const USERS_MESSAGES = {
  GET_ME_SUCCESS: 'Get my profile successfully',

  USER_NOT_VERIFIED: 'User not verified',

  IMAGE_URL_MUST_BE_STRING: 'Image URL must be a string',
  IMAGE_URL_LENGTH: 'Image URL length must be between 1 and 400 characters',

  UPDATE_ME_SUCCESS: 'Update my profile successfully',

  OLD_PASSWORD_NOT_MATCH: 'Old password not match',

  CHANGE_PASSWORD_SUCCESS: 'Change password successfully'
}

export const CATEGORIES_MESSAGES = {
  CREATE_CATEGORY_SUCCESS: 'Create category successfully',

  CATEGORY_NAME_IS_REQUIRED: 'Category name is required',
  CATEGORY_NAME_MUST_BE_STRING: 'Category name must be a string',
  CATEGORY_NAME_MUST_BE_BETWEEN_1_AND_256: 'Category name must be between 1 and 256 characters',
  CATEGORY_ICON_MUST_BE_STRING: 'Category icon must be a string',

  GET_CATEGORIES_SUCCESS: 'Get categories successfully',

  INVALID_CATEGORY_ID: 'Invalid category id',
  CATEGORY_NOT_FOUND: 'Category not found',

  GET_CATEGORY_SUCCESS: 'Get category successfully',

  UPDATE_CATEGORY_SUCCESS: 'Update category successfully',

  DELETE_CATEGORY_SUCCESS: 'Delete category successfully',

  CATEGORY_IDS_MUST_BE_ARRAY: 'Category ids must be an array of strings',
  CATEGORY_IDS_CANNOT_BE_EMPTY: 'Category ids cannot be empty',

  BULK_DELETE_CATEGORY_SUCCESS: 'Bulk delete categories successfully'
}
