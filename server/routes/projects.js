const express = require('express');
const { run, get, all } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const projects = await all(
    `SELECT p.*, u.name AS ownerName
     FROM projects p
     JOIN users u ON u.id = p.ownerId
     WHERE p.id IN (
       SELECT projectId FROM project_members WHERE userId = ?
     )`,
    [req.user.id]
  );
  res.json(projects);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  const createdAt = new Date().toISOString();
  const result = await run(
    'INSERT INTO projects (name, description, ownerId, createdAt) VALUES (?, ?, ?, ?)',
    [name.trim(), description || '', req.user.id, createdAt]
  );

  await run('INSERT INTO project_members (projectId, userId) VALUES (?, ?)', [result.lastID, req.user.id]);
  res.status(201).json({ id: result.lastID, name: name.trim(), description: description || '', ownerId: req.user.id, createdAt });
});

router.post('/:projectId/members', requireRole('admin'), async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const project = await get('SELECT * FROM projects WHERE id = ?', [projectId]);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Only project owner can add members' });
  }

  const user = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await run('INSERT OR IGNORE INTO project_members (projectId, userId) VALUES (?, ?)', [projectId, user.id]);
  res.json({ projectId: Number(projectId), userId: user.id });
});

router.get('/:projectId/tasks', async (req, res) => {
  const { projectId } = req.params;
  const membership = await get('SELECT 1 FROM project_members WHERE projectId = ? AND userId = ?', [projectId, req.user.id]);
  if (!membership) return res.status(403).json({ error: 'Forbidden' });

  const tasks = await all(
    `SELECT t.*, u.name AS assigneeName
     FROM tasks t
     LEFT JOIN users u ON u.id = t.assigneeId
     WHERE t.projectId = ?`,
    [projectId]
  );
  res.json(tasks);
});

module.exports = router;
