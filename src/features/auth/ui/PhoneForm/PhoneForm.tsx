import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { FormError } from '../../../../shared/ui/FormError/FormError';
import { Input } from '../../../../shared/ui/Input/Input';
import { getDigitsOnly, validatePhone } from '../../lib/phoneValidation';
import { useAuthStore } from '../../model/authStore';
import styles from './PhoneForm.module.scss';

type PhoneFormValues = {
  phone: string;
};

const PHONE_MAX_LENGTH = 11;

export function PhoneForm() {
  const navigate = useNavigate();
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PhoneFormValues>({
    defaultValues: {
      phone: '',
    },
  });
  const phoneRegister = register('phone', {
    validate: validatePhone,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = getDigitsOnly(event.target.value).slice(0, PHONE_MAX_LENGTH);
    },
  });

  const onSubmit = handleSubmit(async ({ phone }) => {
    resetError();

    try {
      await requestOtp(phone);
      navigate('/login/otp');
    } catch {
      // Error
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        autoComplete="tel"
        aria-label="Телефон"
        className={styles.input}
        inputMode="numeric"
        maxLength={PHONE_MAX_LENGTH}
        placeholder="Телефон"
        {...phoneRegister}
        error={errors.phone?.message}
      />

      <FormError message={authError} />

      <Button className={styles.submitButton} type="submit" disabled={isLoading}>
        {isLoading ? 'Отправляем...' : 'Продолжить'}
      </Button>
    </form>
  );
}
