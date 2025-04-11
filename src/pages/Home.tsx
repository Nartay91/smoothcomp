import { useState, useEffect } from 'react';
import SportsSection from '../components/SportsSection';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/api';
import '../styles/Home.scss';

const Home = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [userTypeId, setUserTypeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserTypeId = async () => {
      if (token) {
        try {
          const response = await apiClient.getMe();
          setUserTypeId(response.data.user_type_id ?? null);
        } catch (error) {
          console.error('Ошибка при загрузке роли пользователя:', error);
          setUserTypeId(null);
        }
      } else {
        setUserTypeId(null);
      }
    };

    fetchUserTypeId();
  }, [token]);

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1 className="title-heading">
            We empower the world's greatest tournaments and athletes
          </h1>
          <div className="buttons">
            <Link to="/tournaments" className="btn primary">
              {t('Find events')}
            </Link>
            {/* Показываем кнопку "Admin" только админам */}
            {userTypeId === 0 && (
              <Link to="/admin" className="btn primary">
                {t('Admin')}
              </Link>
            )}
          </div>
        </div>
      </div>
      <h1 className="sport-header">
        <p className="yellow">No 1</p> Tournament software for combat sports
      </h1>
      <SportsSection />
    </div>
  );
};

export default Home;