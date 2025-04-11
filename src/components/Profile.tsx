import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/api';
import { UserRead, UserUpdate, GenderEnum } from '../api/type';
import { useAuthStore } from '../store/authStore';
import '../styles/Profile.scss';

const Profile: React.FC = () => {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'settings'>('details');
  const [formData, setFormData] = useState<UserUpdate>({
    email: null,
    full_name: null,
    phone_number: null,
    birth_date: null,
    city: null,
    gender: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Проверка query-параметра tab при загрузке
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab === 'settings') {
      setActiveTab('settings');
    } else {
      setActiveTab('details');
    }
  }, [location.search]);

  // Загрузка данных профиля
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const response = await apiClient.getMe();
        setProfile(response.data);
        setFormData({
          email: response.data.email || null,
          full_name: response.data.full_name || null,
          phone_number: response.data.phone_number || null,
          birth_date: response.data.birth_date || null,
          city: response.data.city || null,
          gender: response.data.gender || null,
        });
      } catch (err) {
        setError('Ошибка при загрузке профиля');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.updateMe(formData);
      setProfile(response.data);
      setError(null);
      setActiveTab('details');
      // Устанавливаем текущую дату и время после успешного обновления
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError('Ошибка при обновлении профиля');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading && !profile) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">Профиль не найден</div>;

  return (
    <div className="profile-container">
      <h1>Профиль</h1>
      <div className="tabs">
        <button
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          User Details
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="profile-details">
          <h2>Информация о пользователе</h2>
          <p><strong>Имя пользователя:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Полное имя:</strong> {profile.full_name || 'Не указано'}</p>
          <p><strong>Телефон:</strong> {profile.phone_number || 'Не указано'}</p>
          <p><strong>Дата рождения:</strong> {profile.birth_date || 'Не указано'}</p>
          <p><strong>Город:</strong> {profile.city || 'Не указано'}</p>
          <p><strong>Пол:</strong> {profile.gender || 'Не указано'}</p>
          <p><strong>ID пользователя:</strong> {profile.id}</p>
          <p>
            <strong>Тип пользователя:</strong>{' '}
            {profile.user_type?.name || 'Не указано'} (ID: {profile.user_type_id || 'Не указано'})
          </p>
          <p><strong>Создан:</strong> {new Date(profile.created_at).toLocaleString()}</p>
          <p><strong>Обновлен:</strong> {lastUpdated || new Date(profile.updated_at).toLocaleString()}</p>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="profile-settings">
          <h2>Настройки профиля</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя пользователя:</label>
              <input type="text" value={profile.username} readOnly disabled />
            </div>
            <div className="form-group">
              <label>ID пользователя:</label>
              <input type="text" value={profile.id} readOnly disabled />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Полное имя:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Телефон:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Дата рождения:</label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Город:</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Пол:</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
              >
                <option value="">Не указано</option>
                <option value={GenderEnum.Male}>Мужской</option>
                <option value={GenderEnum.Female}>Женский</option>
              </select>
            </div>
            <div className="form-group">
              <label>Тип пользователя:</label>
              <input
                type="text"
                value={profile.user_type?.name || 'Не указано'}
                readOnly
                disabled
              />
            </div>
            <div className="form-group">
              <label>Создан:</label>
              <input
                type="text"
                value={new Date(profile.created_at).toLocaleString()}
                readOnly
                disabled
              />
            </div>
            <div className="form-group">
              <label>Обновлен:</label>
              <input
                type="text"
                value={lastUpdated || new Date(profile.updated_at).toLocaleString()}
                readOnly
                disabled
              />
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;