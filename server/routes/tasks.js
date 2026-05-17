const express = require('express');
const { run, get, all } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/:projectId/tasks', async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assigneeEmail, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  const membership = await get('SELECT 1 FROM project_members WHERE projectId = ? AND userId = ?', [projectId, req.user.id]);
  if (!membership) return res.status(403).json({ error: 'Forbidden' });

  let assigneeId = null;
  if (assigneeEmail) {
    const assignee = await get('SELECT id FROM users WHERE email = ?', [assigneeEmail.toLowerCase().trim()]);
    if (!assignee) return res.status(404).json({ error: 'Assignee not found' });
    assigneeId = assignee.id;
  }

  const createdAt = new Date().toISOString();
  const result = await run(
    'INSERT INTO tasks (title, description, dueDate, projectId, assigneeId, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [title.trim(), description || '', dueDate || null, projectId, assigneeId, createdAt]
  );

  const task = await get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
  res.status(201).json(task);
});

router.patch('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const task = await get('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const membership = await get('SELECT 1 FROM project_members WHERE projectId = ? AND userId = ?', [task.projectId, req.user.id]);
  if (!membership) return res.status(403).json({ error: 'Forbidden' });

  if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
    return res.status(400).json({ error: 'Status must be To Do, In Progress or Done' });
  }

  const allowed = task.assigneeId === req.user.id || req.user.role === 'admin';
  if (!allowed) {
    return res.status(403).json({ error: 'Only task assignee or admin can update status' });
  }

  await run('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);
  const updated = await get('SELECT * FROM tasks WHERE id = ?', [taskId]);
  res.json(updated);
});

module.exports = router;
