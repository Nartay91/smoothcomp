import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/api';
import { TournamentBasicRead, TournamentStatus } from '../../api/type';
import '../../styles/FindTournaments.scss';

const FindTournaments: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    status: '' as TournamentStatus | '',
    startDate: '',
  });
  const [tournaments, setTournaments] = useState<TournamentBasicRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.getTournaments(filters);
      setTournaments(response.data);
    } catch (err) {
      setError('Ошибка при поиске турниров');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="find-tournaments-container">
      <h1>{t('Find tournaments')}</h1>
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="form-group">
          <label>{t('name')}:</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder={t('Enter tournament name')}
          />
        </div>
        <div className="form-group">
          <label>{t('location')}:</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder={t('Enter location')}
          />
        </div>
        <div className="form-group">
          <label>{t('status')}:</label>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">{t('All')}</option>
            <option value={TournamentStatus.Open}>{t('Open')}</option>
            <option value={TournamentStatus.InProgress}>{t('In Progress')}</option>
            <option value={TournamentStatus.Completed}>{t('Completed')}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t('startDate')}:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn submit-btn" disabled={loading}>
          {loading ? t('Searching...') : t('Search')}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">{t('loading')}</div>}
      <div className="tournaments-list">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <h2>{tournament.name}</h2>
              <p><strong>{t('location')}:</strong> {tournament.location || 'Не указано'}</p>
              <p><strong>{t('startDate')}:</strong> {new Date(tournament.start_date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          !loading && <p>{t('noTournaments')}</p>
        )}
      </div>
    </div>
  );
};

export default FindTournaments;