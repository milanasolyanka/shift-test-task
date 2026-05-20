import { PhoneForm } from "../../features/auth/ui/PhoneForm/PhoneForm";
import { PageLayout } from "../../shared/ui/PageLayout/PageLayout";

export function LoginPhonePage() {
  return (
    <PageLayout
      title="Вход"
      description={`Введите номер телефона для входа\nв личный кабинет`}
    >
      <PhoneForm />
    </PageLayout>
  );
}
