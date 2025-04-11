import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/api';
import {
  TournamentReadWithDetails,
  RegistrationCreate,
  RegistrationReadWithDetails,
  UserRead,
  RegistrationBasicRead,
//   TournamentCategoryBasicRead,
  RegistrationStatus,
} from '../../api/type';
import '../../styles/AthleteTournamentDetails.scss';

const AthleteTournamentDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<TournamentReadWithDetails | null>(null);
  const [myRegistration, setMyRegistration] = useState<RegistrationReadWithDetails | null>(null);
  const [profile, setProfile] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const tournamentId = Number(id);
        if (isNaN(tournamentId)) throw new Error('Invalid tournament ID');

        const [tournamentResponse, profileResponse, registrationsResponse] = await Promise.all([
          apiClient.getPublicTournamentDetails(tournamentId),
          apiClient.getAthleteProfile(),
          apiClient.getMyRegistrations(),
        ]);

        setTournament(tournamentResponse.data);
        setProfile(profileResponse.data);

        const existingRegistration = registrationsResponse.data.find(
          (reg) => reg.tournament_id === tournamentId
        );
        setMyRegistration(existingRegistration || null);
        setSelectedCategoryId(existingRegistration?.category_id || null);
      } catch (err: any) {
        setError(t('Error loading data') + ': ' + (err.response?.data?.detail || err.message));
        console.error('Ошибка загрузки:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  const handleRegister = async () => {
    if (!selectedCategoryId || !id || !tournament || !profile) {
      setError(t('Please select a category'));
      return;
    }

    try {
      const registrationData: RegistrationCreate = {
        tournament_id: Number(id),
        category_id: selectedCategoryId,
      };
      const response = await apiClient.createRegistration(registrationData);
      const basicRegistration: RegistrationBasicRead = response.data;

      const category = tournament.categories?.find((c) => c.id === selectedCategoryId);
      if (!category) throw new Error('Category not found');

      // Формируем RegistrationReadWithDetails для текущего пользователя
      const newRegistration: RegistrationReadWithDetails = {
        ...basicRegistration,
        user: profile,
        tournament: {
          id: tournament.id,
          name: tournament.name,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          registration_deadline: tournament.registration_deadline,
          status: tournament.status,
          created_by: tournament.created_by,
          created_at: tournament.created_at,
          updated_at: tournament.updated_at,
        },
        category,
      };

      setMyRegistration(newRegistration);

      // Добавляем только базовую регистрацию в список tournament.registrations
      setTournament({
        ...tournament,
        registrations: [...(tournament.registrations || []), basicRegistration],
      });
      setSelectedCategoryId(null);
    } catch (err: any) {
      setError(t('Error registering') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCancelRegistration = async () => {
    if (!myRegistration || !tournament) return;

    try {
      await apiClient.cancelMyRegistration(myRegistration.id);
      setMyRegistration(null);
      setSelectedCategoryId(null);
      setTournament({
        ...tournament,
        registrations: tournament.registrations?.filter((r) => r.id !== myRegistration.id) || [],
      });
    } catch (err: any) {
      setError(t('Error cancelling registration') + ': ' + (err.response?.data?.detail || err.message));
    }
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
        {tournament.categories?.length ? (
          <ul className="category-list">
            {tournament.categories.map((category) => (
              <li key={category.id} className="category-item">
                <span className="category-name">{category.name}</span>
                <span className="category-details">
                  ({category.gender || 'Any'}, {category.age_min || '?'} - {category.age_max || '?'},{' '}
                  {category.weight_min || '?'} - {category.weight_max || '?'} kg)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">{t('No categories')}</p>
        )}

        {!myRegistration && tournament.status === 'open' && (
          <div className="category-form">
            <h3>{t('Register for Tournament')}</h3>
            <div className="form-group">
              <select
                value={selectedCategoryId ?? ''}
                onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="input-field"
              >
                <option value="">{t('Select a category')}</option>
                {tournament.categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="btn create-btn" onClick={handleRegister}>
                {t('Register')}
              </button>
            </div>
          </div>
        )}

        {myRegistration && (
          <div className="registration-status">
            <h3>{t('Your Registration')}</h3>
            <p>
              {t('Category')}: {myRegistration.category.name || 'N/A'} - {t('Status')}: {t(myRegistration.status)}
            </p>
            {myRegistration.status === RegistrationStatus.Pending && (
              <button className="btn delete-btn" onClick={handleCancelRegistration}>
                {t('Cancel Registration')}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="registrations-section">
        <h2>{t('Registered Athletes')}</h2>
        {tournament.registrations?.length ? (
          <ul className="registration-list">
            {tournament.registrations.map((reg) => {
              const category = tournament.categories?.find((c) => c.id === reg.category_id);
              const isCurrentUser = profile && reg.user_id === profile.id;
              return (
                <li key={reg.id} className="registration-item">
                  <span className="athlete-name">
                    {isCurrentUser ? profile.full_name || profile.username : `Athlete ${reg.user_id}`}
                  </span>
                  <span className="athlete-details">
                    {t('Email')}: {isCurrentUser ? profile.email : 'Hidden'} -{' '}
                    {t('Birth Date')}: {isCurrentUser ? profile.birth_date || 'N/A' : 'Hidden'}
                  </span>
                  <span className="athlete-category">
                    {t('Category')}: {category?.name || 'N/A'}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-data">{t('No athletes registered yet')}</p>
        )}
      </section>

      <footer className="actions-section">
        <Link to="/profile" className="btn profile-btn">
          {t('My Profile')}
        </Link>
        <Link to="/tournaments" className="btn back-btn">
          {t('Back')}
        </Link>
      </footer>
    </div>
  );
};

export default AthleteTournamentDetails;