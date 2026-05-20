import { OtpForm } from "../../features/auth/ui/OtpForm/OtpForm";
import { PageLayout } from "../../shared/ui/PageLayout/PageLayout";

export function LoginOtpPage() {
  return (
    <PageLayout
      title="Вход"
      description={`Введите проверочный код для входа\nв личный кабинет`}
    >
      <OtpForm />
    </PageLayout>
  );
}
