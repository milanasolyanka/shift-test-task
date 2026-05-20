export const OTP_CODE_LENGTH = 6;

export function validateOtpCode(value: string) {
  if (!new RegExp(`^\\d{${OTP_CODE_LENGTH}}$`).test(value)) {
    return `Код должен содержать ${OTP_CODE_LENGTH} цифр`;
  }

  return true;
}
