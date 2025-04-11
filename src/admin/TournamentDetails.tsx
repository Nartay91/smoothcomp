import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/api';
import {
  TournamentReadWithDetails,
  TournamentCategoryCreate,
  TournamentCategoryUpdate,
  RegistrationReadWithDetails,
  RegistrationStatus,
  TournamentCategoryBasicRead,
} from '../api/type';
import '../styles/TournamentDetails.scss';

const TournamentDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<TournamentReadWithDetails | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationReadWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<TournamentCategoryCreate>({
    name: '',
    description: null,
    age_min: null,
    age_max: null,
    gender: null,
    weight_min: null,
    weight_max: null,
    max_participants: null,
  });
  const [editCategory, setEditCategory] = useState<TournamentCategoryUpdate | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getTournament(Number(id));
        setTournament(response.data);
        const regResponse = await apiClient.getTournamentRegistrations(Number(id));
        setRegistrations(regResponse.data);
      } catch (err: any) {
        setError(t('Error loading tournament') + ': ' + (err.response?.data?.detail || err.message));
        console.error('Ошибка загрузки:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id, t]);

  const handleDeleteTournament = async () => {
    try {
      await apiClient.deleteTournament(Number(id));
      navigate('/admin/tournaments');
    } catch (err: any) {
      setError(t('Error deleting tournament') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await apiClient.createTournamentCategory(Number(id), newCategory);
      setTournament({
        ...tournament!,
        categories: [...(tournament?.categories || []), response.data],
      });
      setNewCategory({
        name: '',
        description: null,
        age_min: null,
        age_max: null,
        gender: null,
        weight_min: null,
        weight_max: null,
        max_participants: null,
      });
    } catch (err: any) {
      setError(t('Error creating category') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await apiClient.deleteTournamentCategory(categoryId);
      setTournament({
        ...tournament!,
        categories: tournament?.categories?.filter((c) => c.id !== categoryId),
      });
    } catch (err: any) {
      setError(t('Error deleting category') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryId || !editCategory) return;
    try {
      const response = await apiClient.updateTournamentCategory(editCategoryId, editCategory);
      setTournament({
        ...tournament!,
        categories: tournament?.categories?.map((c) =>
          c.id === editCategoryId ? response.data : c
        ),
      });
      setEditCategory(null);
      setEditCategoryId(null);
    } catch (err: any) {
      setError(t('Error updating category') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateRegistrationStatus = async (registrationId: number, status: RegistrationStatus) => {
    try {
      await apiClient.updateRegistrationStatus(registrationId, { status });
      setRegistrations(
        registrations.map((r) => (r.id === registrationId ? { ...r, status } : r))
      );
    } catch (err: any) {
      setError(t('Error updating registration') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const startEditCategory = (category: TournamentCategoryBasicRead) => {
    setEditCategory({
      name: category.name,
      description: category.description,
      age_min: category.age_min,
      age_max: category.age_max,
      gender: category.gender,
      weight_min: category.weight_min,
      weight_max: category.weight_max,
      max_participants: category.max_participants,
    });
    setEditCategoryId(category.id);
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tournament) return <div className="not-found">{t('Tournament not found')}</div>;

  return (
    <div className="tournament-details">
      <header className="tournament-header">
        <h1>{tournament.name}</h1>
        <p className="description">{tournament.description || t('No description')}</p>
      </header>

      <section className="tournament-info">
        <div className="info-item">
          <span className="label">{t('start_date')}:</span>
          <span>{tournament.start_date}</span>
        </div>
        <div className="info-item">
          <span className="label">{t('end_date')}:</span>
          <span>{tournament.end_date}</span>
        </div>
        <div className="info-item">
          <span className="label">{t('registration_deadline')}:</span>
          <span>{tournament.registration_deadline}</span>
        </div>
        <div className="info-item">
          <span className="label">{t('status')}:</span>
          <span className="status">{t(tournament.status || 'Unknown')}</span>
        </div>
        <div className="info-item">
          <span className="label">{t('created_by')}:</span>
          <span>{tournament.creator.username}</span>
        </div>
      </section>

      <section className="categories-section">
        <h2>{t('Categories')}</h2>
        {tournament.categories && tournament.categories.length > 0 ? (
          <ul className="category-list">
            {tournament.categories.map((category) => (
              <li key={category.id} className="category-item">
                <span className="category-name">{category.name}</span>
                <span className="category-details">
                  ({category.gender || 'Any'}, {category.age_min || '?'} - {category.age_max || '?'},{' '}
                  {category.weight_min || '?'} - {category.weight_max || '?'} kg)
                </span>
                <div className="category-actions">
                  <button className="btn edit-btn" onClick={() => startEditCategory(category)}>
                    {t('Edit')}
                  </button>
                  <button className="btn delete-btn" onClick={() => handleDeleteCategory(category.id)}>
                    {t('Delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">{t('No categories')}</p>
        )}

        <div className="category-form">
          <h3>{t('Add Category')}</h3>
          <div className="form-group">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder={t('Category name')}
              className="input-field"
            />
            <button className="btn create-btn" onClick={handleCreateCategory}>
              {t('Create')}
            </button>
          </div>
        </div>

        {editCategory && editCategoryId && (
          <div className="category-form edit-form">
            <h3>{t('Edit Category')}</h3>
            <div className="form-group">
              <input
                type="text"
                value={editCategory.name || ''}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                placeholder={t('Category name')}
                className="input-field"
              />
              <button className="btn save-btn" onClick={handleUpdateCategory}>
                {t('Save')}
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => {
                  setEditCategory(null);
                  setEditCategoryId(null);
                }}
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="registrations-section">
        <h2>{t('Registrations')}</h2>
        {registrations.length > 0 ? (
          <ul className="registration-list">
            {registrations.map((reg) => (
              <li key={reg.id} className="registration-item">
                <Link to={`/profile/${reg.user_id}`} className="user-link">
                  {reg.user?.username || reg.user_id}
                </Link>
                <span className="status">{t(reg.status)}</span>
                <select
                  value={reg.status}
                  onChange={(e) =>
                    handleUpdateRegistrationStatus(reg.id, e.target.value as RegistrationStatus)
                  }
                  className="status-select"
                >
                  <option value="pending">{t('Pending')}</option>
                  <option value="approved">{t('Approved')}</option>
                  <option value="rejected">{t('Rejected')}</option>
                  <option value="cancelled">{t('Cancelled')}</option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">{t('No registrations yet')}</p>
        )}
      </section>

      <footer className="actions-section">
        <Link to={`/admin/edit-tournament/${tournament.id}`} className="btn edit-btn">
          {t('Edit Tournament')}
        </Link>
        <button className="btn delete-btn" onClick={handleDeleteTournament}>
          {t('Delete Tournament')}
        </button>
        <Link to="/admin/tournaments" className="btn back-btn">
          {t('Back')}
        </Link>
      </footer>
    </div>
  );
};

export default TournamentDetails;