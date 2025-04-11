import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/api';

interface ProtectedRouteProps {
  allowedUserTypeId: number; 
}

const ProtectedRoute = ({ allowedUserTypeId }: ProtectedRouteProps) => {
  const { token } = useAuthStore(); 
  const [userTypeId, setUserTypeId] = useState<number | null>(null); // Роль от сервера

  // Загружаем user_type_id с сервера, если есть токен
  useEffect(() => {
    const fetchUserTypeId = async () => {
      if (token) {
        try {
          const response = await apiClient.getMe();
          setUserTypeId(response.data.user_type_id ?? null);
        } catch (error) {
          console.error('Ошибка при загрузке данных пользователя:', error);
          setUserTypeId(null); // Если ошибка, сбрасываем
        }
      } else {
        setUserTypeId(null); // Нет токена — нет роли
      }
    };

    fetchUserTypeId();
  }, [token]); 

  // Если нет токена — отправляем на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, но userTypeId ещё не загрузился — ждём
  if (userTypeId === null) {
    return <div>Loading...</div>;
  }

  // Если админ (userTypeId: 0) — пускаем везде
  if (userTypeId === 0) {
    return <Outlet />;
  }

  // Если не админ, проверяем, совпадает ли роль с нужной
  if (userTypeId !== allowedUserTypeId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;