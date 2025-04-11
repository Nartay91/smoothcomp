import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/api';
import { TournamentRead, TournamentCategoryBasicRead, RegistrationCreate, RegistrationReadWithDetails } from '../../api/type';
import { useAuthStore } from '../../store/authStore';
import '../../styles/Tournaments.scss';

const Tournaments: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<TournamentRead[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationReadWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Получаем доступные турниры
        const tournamentsResponse = await apiClient.getAvailableTournaments();
        setTournaments(tournamentsResponse.data);

        // Получаем регистрации пользователя (если авторизован)
        if (token) {
          const registrationsResponse = await apiClient.getMyRegistrations();
          setRegistrations(registrationsResponse.data);
        }
      } catch (err: any) {
        setError(t('Error loading tournaments') + ': ' + (err.response?.data?.detail || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t, token]);

  // Регистрация на турнир
  const handleRegister = async (tournamentId: number, categoryId: number) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const registration: RegistrationCreate = { tournament_id: tournamentId, category_id: categoryId };
      const response = await apiClient.createRegistration(registration);
      setRegistrations([...registrations, response.data]);
    } catch (err: any) {
      setError(t('Error registering') + ': ' + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  // Удаление регистрации
  const handleCancelRegistration = async (registrationId: number) => {
    try {
      await apiClient.cancelMyRegistration(registrationId);
      setRegistrations(registrations.filter((reg) => reg.id !== registrationId));
    } catch (err: any) {
      setError(t('Error cancelling registration') + ': ' + (err.response?.data?.detail || err.message));
      console.error(err);
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tournaments-container">
      <h1>{t('Tournaments')}</h1>
      <div className="actions">
        <Link to="/find-tournaments" className="btn filter-btn">
          {t('Find tournaments')}
        </Link>
      </div>
      <div className="tournaments-list">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => {
            const userRegistration = registrations.find((reg) => reg.tournament_id === tournament.id);
            return (
              <div key={tournament.id} className="tournament-card">
                <h2>{tournament.name}</h2>
                <p>
                  <strong>{t('description')}:</strong> {tournament.description || t('No description')}
                </p>
                <p>
                  <strong>{t('location')}:</strong> {tournament.location || t('Not specified')}
                </p>
                <p>
                  <strong>{t('startDate')}:</strong>{' '}
                  {new Date(tournament.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>{t('endDate')}:</strong>{' '}
                  {new Date(tournament.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>{t('registrationDeadline')}:</strong>{' '}
                  {new Date(tournament.registration_deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>{t('status')}:</strong> {t(tournament.status || 'Unknown')}
                </p>
                {tournament.categories && tournament.categories.length > 0 && (
                  <div className="categories">
                    <strong>{t('Categories')}:</strong>
                    <ul>
                      {tournament.categories.map((category: TournamentCategoryBasicRead) => (
                        <li key={category.id}>
                          {category.name}{' '}
                          {category.gender && `(${category.gender}, ${category.age_min || '?'}-${category.age_max || '?'})`}
                          {token && tournament.status === 'open' && !userRegistration && (
                            <button
                              className="btn register-btn"
                              onClick={() => handleRegister(tournament.id, category.id)}
                            >
                              {t('Register')}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {userRegistration && (
                  <div className="registration">
                    <p>
                      <strong>{t('Your registration')}:</strong> {userRegistration.category.name} -{' '}
                      {t(userRegistration.status)}
                    </p>
                    <button
                      className="btn cancel-btn"
                      onClick={() => handleCancelRegistration(userRegistration.id)}
                    >
                      {t('Cancel registration')}
                    </button>
                  </div>
                )}
                <Link to={`/tournaments/${tournament.id}`} className="btn details-btn">
                  {t('Details')}
                </Link>
              </div>
            );
          })
        ) : (
          <p>{t('noTournaments')}</p>
        )}
      </div>
    </div>
  );
};

export default Tournaments;