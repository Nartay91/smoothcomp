const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Фейковые данные
let users = [
  { id: 1, username: 'testuser', password: 'test123', user_type_id: 1, email: 'test@example.com' },
  { id: 2, username: 'admin', password: 'admin123', user_type_id: 0, email: 'admin@example.com' },
  { id: 3, username: 'athlete1', password: 'athlete123', user_type_id: 1, email: 'athlete1@example.com' },
];

let tournaments = [
  {
    id: 1,
    name: 'Турнир 1',
    status: 'open',
    description: 'Первый тестовый турнир',
    start_date: '2025-05-01T00:00:00Z',
    end_date: '2025-05-03T00:00:00Z',
    registration_deadline: '2025-04-30T23:59:59Z',
    max_participants: 50,
    created_by: 2,
    created_at: '2025-04-11T12:00:00Z',
    updated_at: '2025-04-11T12:00:00Z',
  },
  {
    id: 2,
    name: 'Турнир 2',
    status: 'open',
    description: 'Второй тестовый турнир',
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2025-06-03T00:00:00Z',
    registration_deadline: '2025-05-31T23:59:59Z',
    max_participants: 30,
    created_by: 2,
    created_at: '2025-04-11T12:00:00Z',
    updated_at: '2025-04-11T12:00:00Z',
  },
];

let categories = [
  { id: 1, tournament_id: 1, name: 'Вес до 70 кг', weight_max: 70, max_participants: 20 },
  { id: 2, tournament_id: 3, name: 'Вес до 90 кг', weight_max: 90, max_participants: 20 },
  { id: 3, tournament_id: 2, name: 'Открытая категория', max_participants: 30 },
];

let registrations = [
  {
    id: 1,
    tournament_id: 1,
    category_id: 1,
    user_id: 1,
    registration_date: '2025-04-12T10:00:00Z',
    status: 'pending',
    payment_status: 'pending',
  },
  {
    id: 2,
    tournament_id: 1,
    category_id: 2,
    user_id: 3,
    registration_date: '2025-04-12T11:00:00Z',
    status: 'approved',
    payment_status: 'completed',
  },
];

let tokens = {};

const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (tokens[token]) {
      req.user = tokens[token];
      return next();
    }
  }
  req.user = { id: 1, user_type_id: 1 }; // Фейковый пользователь по умолчанию
  next();
};

// Аутентификация
app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  const newUser = {
    id: users.length + 1,
    username: username || `user${users.length + 1}`,
    password: password || 'default',
    user_type_id: req.body.user_type_id || 1,
    email: email || `${username}@example.com`,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    const newUser = {
      id: users.length + 1,
      username,
      password,
      user_type_id: 1,
      email: `${username}@example.com`,
    };
    users.push(newUser);
    const token = `fake-token-${newUser.id}`;
    tokens[token] = newUser;
    return res.json({ access_token: token });
  }
  const token = `fake-token-${user.id}`;
  tokens[token] = user;
  res.json({ access_token: token });
});

app.get('/api/auth/me', checkToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    user_type_id: user.user_type_id,
    full_name: user.username,
    phone_number: null,
    birth_date: null,
    city: null,
    gender: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
});

app.put('/api/auth/me', checkToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  Object.assign(user, req.body);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    user_type_id: user.user_type_id,
    full_name: user.username,
    phone_number: null,
    birth_date: null,
    city: null,
    gender: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
});

// Admin Tournaments
app.post('/api/admin/tournaments/', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const newTournament = {
    id: tournaments.length + 1,
    ...req.body,
    created_by: req.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tournaments.push(newTournament);
  res.status(201).json(newTournament);
});

app.get('/api/admin/tournaments/', (req, res) => {
  const { skip = 0, limit = 100, status } = req.query;
  let result = tournaments.slice(Number(skip), Number(skip) + Number(limit));
  if (status) {
    result = result.filter((t) => t.status === status);
  }
  res.json(result);
});

app.get('/api/admin/tournaments/:id', (req, res) => {
  const tournament = tournaments.find((t) => t.id === +req.params.id);
  if (!tournament) return res.status(404).json({ detail: 'Not found' });
  const creator = users.find((u) => u.id === tournament.created_by);
  res.json({
    ...tournament,
    creator: {
      id: creator.id,
      username: creator.username,
      email: creator.email,
      user_type_id: creator.user_type_id,
      full_name: creator.username,
      phone_number: null,
      birth_date: null,
      city: null,
      gender: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: categories.filter((c) => c.tournament_id === tournament.id),
    registrations: registrations.filter((r) => r.tournament_id === tournament.id),
  });
});

app.put('/api/admin/tournaments/:id', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const tournament = tournaments.find((t) => t.id === +req.params.id);
  if (!tournament) return res.status(404).json({ detail: 'Not found' });
  Object.assign(tournament, req.body, { updated_at: new Date().toISOString() });
  res.json(tournament);
});

app.delete('/api/admin/tournaments/:id', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  tournaments = tournaments.filter((t) => t.id !== +req.params.id);
  res.status(204).send();
});

// Admin Categories
app.post('/api/admin/tournaments/:id/categories', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const newCategory = {
    id: categories.length + 1,
    tournament_id: +req.params.id,
    ...req.body,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.get('/api/admin/tournaments/:id/categories', (req, res) => {
  const { skip = 0, limit = 100 } = req.query;
  const tournamentCategories = categories
    .filter((c) => c.tournament_id === +req.params.id)
    .slice(Number(skip), Number(skip) + Number(limit));
  res.json(tournamentCategories);
});

app.put('/api/admin/categories/:id', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const category = categories.find((c) => c.id === +req.params.id);
  if (!category) return res.status(404).json({ detail: 'Not found' });
  Object.assign(category, req.body);
  res.json(category);
});

app.delete('/api/admin/categories/:id', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  categories = categories.filter((c) => c.id !== +req.params.id);
  res.status(204).send();
});

// Admin Registrations
app.get('/api/admin/tournaments/:id/registrations', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const { skip = 0, limit = 100 } = req.query;
  const tournamentId = +req.params.id;
  const tournamentRegistrations = registrations
    .filter((r) => r.tournament_id === tournamentId)
    .slice(Number(skip), Number(skip) + Number(limit));
  const detailedRegistrations = tournamentRegistrations.map((reg) => {
    const user = users.find((u) => u.id === reg.user_id);
    const tournament = tournaments.find((t) => t.id === reg.tournament_id);
    const category = categories.find((c) => c.id === reg.category_id);
    return {
      ...reg,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type_id: user.user_type_id,
        full_name: user.username,
        phone_number: null,
        birth_date: null,
        city: null,
        gender: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tournament: {
        ...tournament,
        creator: users.find((u) => u.id === tournament.created_by),
      },
      category: category || null,
    };
  });
  res.json(detailedRegistrations);
});

app.put('/api/admin/registrations/:id', checkToken, (req, res) => {
  if (req.user.user_type_id !== 0) return res.status(403).json({ detail: 'Forbidden' });
  const registration = registrations.find((r) => r.id === +req.params.id);
  if (!registration) return res.status(404).json({ detail: 'Not found' });
  Object.assign(registration, req.body);
  res.json(registration);
});

// Public Tournaments
app.get('/api/tournaments/', (req, res) => {
  const { skip = 0, limit = 100, status } = req.query;
  let result = tournaments.slice(Number(skip), Number(skip) + Number(limit));
  if (status) {
    result = result.filter((t) => t.status === status);
  }
  res.json(result);
});

app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournaments.find((t) => t.id === +req.params.id);
  if (!tournament) return res.status(404).json({ detail: 'Not found' });
  const creator = users.find((u) => u.id === tournament.created_by);
  res.json({
    ...tournament,
    creator: {
      id: creator.id,
      username: creator.username,
      email: creator.email,
      user_type_id: creator.user_type_id,
      full_name: creator.username,
      phone_number: null,
      birth_date: null,
      city: null,
      gender: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    categories: categories.filter((c) => c.tournament_id === tournament.id),
    registrations: registrations.filter((r) => r.tournament_id === tournament.id),
  });
});

app.get('/api/tournaments/:id/categories', (req, res) => {
  const { skip = 0, limit = 100 } = req.query;
  const tournamentCategories = categories
    .filter((c) => c.tournament_id === +req.params.id)
    .slice(Number(skip), Number(skip) + Number(limit));
  res.json(tournamentCategories);
});

// Registrations
app.post('/api/registrations/', checkToken, (req, res) => {
  const newRegistration = {
    id: registrations.length + 1,
    user_id: req.user.id,
    ...req.body,
    registration_date: new Date().toISOString(),
    status: 'pending',
    payment_status: 'pending',
  };
  registrations.push(newRegistration);
  res.status(201).json(newRegistration);
});

app.get('/api/registrations/', checkToken, (req, res) => {
  const { skip = 0, limit = 100 } = req.query;
  const userRegistrations = registrations
    .filter((r) => r.user_id === req.user.id)
    .slice(Number(skip), Number(skip) + Number(limit));
  const detailedRegistrations = userRegistrations.map((reg) => {
    const tournament = tournaments.find((t) => t.id === reg.tournament_id);
    const category = categories.find((c) => c.id === reg.category_id);
    return {
      ...reg,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        user_type_id: req.user.user_type_id,
        full_name: req.user.username,
        phone_number: null,
        birth_date: null,
        city: null,
        gender: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      tournament: {
        ...tournament,
        creator: users.find((u) => u.id === tournament.created_by),
      },
      category: category || null,
    };
  });
  res.json(detailedRegistrations);
});

app.delete('/api/registrations/:id', checkToken, (req, res) => {
  const registration = registrations.find((r) => r.id === +req.params.id && r.user_id === req.user.id);
  if (!registration) return res.status(404).json({ detail: 'Not found' });
  registrations = registrations.filter((r) => r.id !== +req.params.id);
  res.status(204).send();
});

// Athlete Profile
app.get('/api/athlete/profile', checkToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    user_type_id: user.user_type_id,
    full_name: user.username,
    phone_number: null,
    birth_date: null,
    city: null,
    gender: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
});

app.put('/api/athlete/profile', checkToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  Object.assign(user, req.body);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    user_type_id: user.user_type_id,
    full_name: user.username,
    phone_number: null,
    birth_date: null,
    city: null,
    gender: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Fake server running on http://localhost:${PORT}`);
});