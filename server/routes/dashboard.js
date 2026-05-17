const express = require('express');
const { get, all } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const tasks = await all(
    `SELECT t.*, p.name AS projectName, u.name AS assigneeName
     FROM tasks t
     JOIN projects p ON p.id = t.projectId
     LEFT JOIN users u ON u.id = t.assigneeId
     WHERE t.projectId IN (
       SELECT projectId FROM project_members WHERE userId = ?
     )
     ORDER BY t.dueDate IS NULL, t.dueDate ASC`,
    [req.user.id]
  );

  const statusSummary = { 'To Do': 0, 'In Progress': 0, Done: 0 };
  let overdue = 0;
  const now = new Date().toISOString();

  tasks.forEach((task) => {
    statusSummary[task.status] = (statusSummary[task.status] || 0) + 1;
    if (task.dueDate && task.dueDate < now && task.status !== 'Done') {
      overdue += 1;
    }
  });

  res.json({ tasks, statusSummary, overdue });
});

module.exports = router;
