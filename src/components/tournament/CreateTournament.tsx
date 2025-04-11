import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/api';
import { TournamentCreate, TournamentStatus, TournamentCategoryCreate, GenderEnum } from '../../api/type';
import { useAuthStore } from '../../store/authStore';
import '../../styles/CreateTournament.scss';

const CreateTournament: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Состояние для данных турнира
  const [formData, setFormData] = useState<TournamentCreate>({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_participants: null,
    status: TournamentStatus.Draft,
  });

  // Состояние для данных категории (одной)
  const [categoryData, setCategoryData] = useState<TournamentCategoryCreate>({
    name: '',
    description: '',
    age_min: null,
    age_max: null,
    gender: null,
    weight_min: null,
    weight_max: null,
    max_participants: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверка авторизации
  if (!token) {
    navigate('/login'); 
    return null;
  }

  // Обработка изменений в форме турнира
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : (name === 'max_participants' ? Number(value) : value),
    }));
  };

  // Обработка изменений в форме категории
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value === '' ? null : (name === 'age_min' || name === 'age_max' || name === 'weight_min' || name === 'weight_max' || name === 'max_participants' ? Number(value) : value),
    }));
  };

  // Отправка формы (турнир + категория)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Проверяем обязательные поля турнира
      if (!formData.name || !formData.start_date || !formData.end_date || !formData.registration_deadline) {
        throw new Error(t('Tournament required fields missing'));
      }

      // Создаём турнир
      const tournamentResponse = await apiClient.createTournament(formData);
      const tournamentId = tournamentResponse.data.id;

      // Если заполнены данные категории, создаём её
      if (categoryData.name) {
        await apiClient.createTournamentCategory(tournamentId, categoryData);
      }

      navigate('/tournaments');
    } catch (err: any) {
      setError(t('Error creating tournament') + ': ' + (err.response?.data?.detail || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-tournament-container">
      <h1>{t('Create tournament')}</h1>
      <form onSubmit={handleSubmit} className="create-form">
        {/* Поля турнира */}
        <div className="form-group">
          <label>{t('name')}:</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('description')}:</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>{t('location')}:</label>
          <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>{t('startDate')}:</label>
          <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('endDate')}:</label>
          <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>{t('registrationDeadline')}:</label>
          <input
            type="date"
            name="registration_deadline"
            value={formData.registration_deadline || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('maxParticipants')}:</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t('status')}:</label>
          <select name="status" value={formData.status || ''} onChange={handleChange}>
            <option value={TournamentStatus.Draft}>{t('Draft')}</option>
            <option value={TournamentStatus.Open}>{t('Open')}</option>
            <option value={TournamentStatus.Closed}>{t('Closed')}</option>
            <option value={TournamentStatus.InProgress}>{t('InProgress')}</option>
            <option value={TournamentStatus.Completed}>{t('Completed')}</option>
          </select>
        </div>

        {/* Поля категории */}
        <h2>{t('Category')}</h2>
        <div className="form-group">
          <label>{t('categoryName')}:</label>
          <input type="text" name="name" value={categoryData.name || ''} onChange={handleCategoryChange} />
        </div>
        <div className="form-group">
          <label>{t('description')}:</label>
          <textarea name="description" value={categoryData.description || ''} onChange={handleCategoryChange} />
        </div>
        <div className="form-group">
          <label>{t('ageMin')}:</label>
          <input
            type="number"
            name="age_min"
            value={categoryData.age_min || ''}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <label>{t('ageMax')}:</label>
          <input
            type="number"
            name="age_max"
            value={categoryData.age_max || ''}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <label>{t('gender')}:</label>
          <select name="gender" value={categoryData.gender || ''} onChange={handleCategoryChange}>
            <option value="">{t('Not specified')}</option>
            <option value={GenderEnum.Male}>{t('Male')}</option>
            <option value={GenderEnum.Female}>{t('Female')}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t('weightMin')}:</label>
          <input
            type="number"
            name="weight_min"
            value={categoryData.weight_min || ''}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <label>{t('weightMax')}:</label>
          <input
            type="number"
            name="weight_max"
            value={categoryData.weight_max || ''}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <label>{t('maxParticipants')}:</label>
          <input
            type="number"
            name="max_participants"
            value={categoryData.max_participants || ''}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Одна кнопка для создания */}
        <button type="submit" className="btn submit-btn" disabled={loading}>
          {loading ? t('Creating...') : t('Create')}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CreateTournament;