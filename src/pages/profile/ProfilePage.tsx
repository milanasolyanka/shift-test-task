import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/model/authStore';
import { Button } from '../../shared/ui/Button/Button';
import { PageLayout } from '../../shared/ui/PageLayout/PageLayout';
import styles from './ProfilePage.module.scss';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fullName = [user?.lastname, user?.firstname, user?.middlename].filter(Boolean).join(' ');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <PageLayout title="Личный кабинет" description="Информация о текущем пользователе.">
      <div className={styles.profile}>
        <p>ID: {user?._id ?? 'Не указан'}</p>
        <p>Телефон: {user?.phone ?? 'Не указан'}</p>
        {fullName && <p>ФИО: {fullName}</p>}
        {user?.email && <p>Email: {user.email}</p>}
        {user?.city && <p>Город: {user.city}</p>}

        <Button onClick={handleLogout}>Выйти</Button>
      </div>
    </PageLayout>
  );
}
