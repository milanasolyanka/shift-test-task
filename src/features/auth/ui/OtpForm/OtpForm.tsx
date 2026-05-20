import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { FormError } from '../../../../shared/ui/FormError/FormError';
import { Input } from '../../../../shared/ui/Input/Input';
import { getDigitsOnly } from '../../lib/phoneValidation';
import { OTP_CODE_LENGTH, validateOtpCode } from '../../lib/otpValidation';
import { useAuthStore } from '../../model/authStore';
import styles from './OtpForm.module.scss';

type OtpFormValues = {
  code: string;
};

const DEFAULT_RESEND_TIMEOUT_SECONDS = 30;

function getRetrySeconds(retryDelay: number | null) {
  if (!retryDelay) {
    return DEFAULT_RESEND_TIMEOUT_SECONDS;
  }

  return Math.ceil(retryDelay / 1000);
}

function formatPhone(phone: string | null) {
  const digits = getDigitsOnly(phone ?? '');
  const normalized = digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits;

  if (normalized.length !== 11) {
    return phone ?? '';
  }

  return `+${normalized.slice(0, 1)} ${normalized.slice(1, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
}

export function OtpForm() {
  const navigate = useNavigate();
  const retryDelay = useAuthStore((state) => state.retryDelay);
  const [secondsLeft, setSecondsLeft] = useState(getRetrySeconds(retryDelay));
  const phone = useAuthStore((state) => state.phone);
  const signIn = useAuthStore((state) => state.signIn);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<OtpFormValues>({
    defaultValues: {
      code: '',
    },
  });
  const codeRegister = register('code', {
    validate: validateOtpCode,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = getDigitsOnly(event.target.value).slice(0, OTP_CODE_LENGTH);
    },
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [secondsLeft]);

  const onSubmit = handleSubmit(async ({ code }) => {
    resetError();

    try {
      await signIn(code);
      navigate('/profile', { replace: true });
    } catch {
      // Error 
    }
  });

  const handleRepeat = async () => {
    if (!phone) {
      return;
    }

    resetError();

    try {
      const nextRetryDelay = await requestOtp(phone);
      setSecondsLeft(getRetrySeconds(nextRetryDelay));
    } catch {
      // Error
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input aria-label="Телефон" className={styles.input} readOnly value={formatPhone(phone)} />

      <Input
        autoComplete="one-time-code"
        aria-label="Проверочный код"
        className={styles.input}
        inputMode="numeric"
        maxLength={OTP_CODE_LENGTH}
        placeholder="Проверочный код"
        {...codeRegister}
        error={errors.code?.message}
      />

      <FormError message={authError} />

      <Button className={styles.submitButton} type="submit" disabled={isLoading}>
        {isLoading ? 'Проверяем...' : 'Войти'}
      </Button>

      <div className={secondsLeft > 0 ? styles.repeatTimerRow : styles.repeatActiveRow}>
        {secondsLeft > 0 ? (
          <p className={styles.repeatText}>Запросить код ещё раз через {secondsLeft} сек.</p>
        ) : (
          <Button className={styles.repeatButton} type="button" onClick={handleRepeat} disabled={isLoading}>
            Запросить код ещё раз
          </Button>
        )}
      </div>
    </form>
  );
}
