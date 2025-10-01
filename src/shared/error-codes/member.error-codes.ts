export const MemberErrorCodes = {
  INVALID_FULL_NAME: 'Full name is required.',
  INVALID_CLASSIFICATION: 'Classification must be communicant or non-communicant.',
  MISSING_COMMUNICANT_REQUIRED_FIELDS: 'Missing required fields for communicant admission.',
  INVALID_BIRTH_DATE: 'Invalid birth date.',
  INVALID_RECEPTION_DATE: 'Invalid reception date.',
} as const;

export type MemberErrorCode = keyof typeof MemberErrorCodes;
