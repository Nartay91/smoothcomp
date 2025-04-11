import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/api';
import { TournamentRead } from '../api/type';
import { useAuthStore } from '../store/authStore';
import '../styles/AdminTournaments.scss';

const AdminTournaments: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<TournamentRead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getTournaments();
        setTournaments(response.data);
      } catch (err: any) {
        setError(t('Error loading tournaments') + ': ' + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [t]);

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleDeleteTournament = async (tournamentId: number) => {
    try {
      await apiClient.deleteTournament(tournamentId);
      setTournaments(tournaments.filter((t) => t.id !== tournamentId));
    } catch (err: any) {
      setError(t('Error deleting tournament') + ': ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-tournaments-container">
      <h1>{t('Admin Tournaments')}</h1>
      <div className="tournaments-list">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <h2>{tournament.name}</h2>
              <p>
                <strong>{t('start_date')}:</strong> {tournament.start_date}
              </p>
              <p>
                <strong>{t('status')}:</strong> {t(tournament.status || 'Unknown')}
              </p>
              <div className="tournament-actions">
                <Link to={`/admin/tournaments/${tournament.id}`} className="btn details-btn">
                  {t('Details')}
                </Link>
                <Link to={`/admin/edit-tournament/${tournament.id}`} className="btn edit-btn">
                  {t('Edit')}
                </Link>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDeleteTournament(tournament.id)}
                >
                  {t('Delete')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>{t('noTournaments')}</p>
        )}
      </div>
    </div>
  );
};

export default AdminTournaments;