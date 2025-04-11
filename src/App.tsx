import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AuthForm from './components/auth/AuthForm';
import Profile from './components/Profile';
import Tournaments from './components/tournament/Tournaments';
import FindTournaments from './components/tournament/FindTournaments';
import CreateTournament from './components/tournament/CreateTournament';
import AthleteTournamentDetails from './components/tournament/AthleteTournamentDetails';
import AdminTournaments from './admin/AdminTournaments';
import Admin from './admin/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import TournamentDetails from "./admin/TournamentDetails"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<AuthForm />} />
          <Route path="login" element={<AuthForm />} />

          {/* Клиентские страницы: для атлетов (user_type_id: 1) и админов */}
          <Route element={<ProtectedRoute allowedUserTypeId={1} />}>
            <Route path="profile" element={<Profile />} />
            <Route path="tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<AthleteTournamentDetails />} />
            <Route path="find-tournaments" element={<FindTournaments />} />
          </Route>

          {/* Админские страницы: только для админов (user_type_id: 0) */}
          <Route element={<ProtectedRoute allowedUserTypeId={0} />}>
            <Route path="admin" element={<Admin />} /> 
            <Route path="admin/tournaments" element={<AdminTournaments />} />
            <Route path="admin/tournaments/:id" element={<TournamentDetails />} />
            <Route path="admin/create-tournament" element={<CreateTournament />} />
            <Route path="admin/edit-tournament/:id" element={<CreateTournament />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;