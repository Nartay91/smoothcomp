import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Admin.scss';

const Admin = () => {
  const { t } = useTranslation();

  return (
    <div className="admin">
      <h1>{t('Admin Dashboard')}</h1>
      <div className="admin-buttons">
        <Link to="/admin/tournaments" className="btn primary">
          {t('Manage Tournaments')}
        </Link>
        <Link to="/admin/create-tournament" className="btn primary">
          {t('Create Tournament')}
        </Link>
      </div>
    </div>
  );
};

export default Admin;