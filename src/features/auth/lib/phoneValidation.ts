const PHONE_LENGTH = 11;

export function getDigitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

export function normalizePhone(value: string) {
  const digits = getDigitsOnly(value);

  if (digits.length === PHONE_LENGTH && digits.startsWith('7')) {
    return `8${digits.slice(1)}`;
  }

  return digits;
}

export function validatePhone(value: string) {
  const digits = getDigitsOnly(value);

  if (!digits) {
    return 'Поле является обязательным';
  }

  if (!/^[78]\d{10}$/.test(digits)) {
    return 'Введите корректный номер телефона';
  }

  return true;
}
