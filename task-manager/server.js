import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      project_id INTEGER,
      assigned_to INTEGER,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id),
      FOREIGN KEY (assigned_to) REFERENCES users (id),
      FOREIGN KEY (created_by) REFERENCES users (id)
    )
  `);

  // Insert demo users if not exist
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      const hashedAdmin = bcrypt.hashSync('admin123', 10);
      const hashedMember = bcrypt.hashSync('member123', 10);

      db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin User', 'admin@task.local', hashedAdmin, 'Admin']);
      db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Team Member', 'member@task.local', hashedMember, 'Member']);
    }
  });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    const token = jwt.sign(
      { id: this.lastID, email, role: 'Member' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: this.lastID,
        name,
        email,
        role: 'Member'
      }
    });
  });
});

app.post('/api/auth/reset-password', authenticateToken, (req, res) => {
  const { email, password } = req.body;

  if (req.user.email !== email) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Password reset successful' });
  });
});

// Projects routes
app.get('/api/projects', authenticateToken, (req, res) => {
  db.all(`
    SELECT p.*, u.name as created_by_name,
           (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    ORDER BY p.created_at DESC
  `, [], (err, projects) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(projects);
  });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ error: 'Project name required' });

  db.run("INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)",
    [name, description, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.get("SELECT * FROM projects WHERE id = ?", [this.lastID], (err, project) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json(project);
    });
  });
});

// Tasks routes
app.get('/api/projects/:projectId/tasks', authenticateToken, (req, res) => {
  const { projectId } = req.params;

  db.all(`
    SELECT t.*, u.name as assigned_to_name, c.name as created_by_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.project_id = ?
    ORDER BY t.created_at DESC
  `, [projectId], (err, tasks) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(tasks);
  });
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, projectId, assignedTo } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ error: 'Title and project ID required' });
  }

  db.run("INSERT INTO tasks (title, description, project_id, assigned_to, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, description, projectId, assignedTo, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.get(`
      SELECT t.*, u.name as assigned_to_name, c.name as created_by_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ?
    `, [this.lastID], (err, task) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json(task);
    });
  });
});

app.put('/api/tasks/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['todo', 'in-progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run("UPDATE tasks SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });

    db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, task) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(task);
    });
  });
});

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});