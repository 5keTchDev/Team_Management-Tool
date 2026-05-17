import { useEffect, useMemo, useState } from 'react';
import { login, signup, fetchProjects, createProject, addMember, fetchTasks, createTask, updateTask, fetchDashboard } from './api.js';

const initialForm = { name: '', email: '', password: '' };
const taskFormInit = { title: '', description: '', assigneeEmail: '', dueDate: '' };
const projectFormInit = { name: '', description: '' };

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ttm-user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('ttm-token') || '');
  const [mode, setMode] = useState('login');
  const [authForm, setAuthForm] = useState(initialForm);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectForm, setProjectForm] = useState(projectFormInit);
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState(taskFormInit);
  const [dashboard, setDashboard] = useState({ tasks: [], statusSummary: {}, overdue: 0 });
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'admin';

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    if (token) {
      loadProjects();
      loadDashboard();
    }
  }, [token]);

  const persistAuth = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('ttm-user', JSON.stringify(userData));
    localStorage.setItem('ttm-token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ttm-user');
    localStorage.removeItem('ttm-token');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login({ email: authForm.email, password: authForm.password });
      persistAuth(data.user, data.token);
      setMessage('Login successful');
      setAuthForm(initialForm);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const data = await signup({ ...authForm, role: mode === 'signup' ? 'member' : 'member' });
      persistAuth(data.user, data.token);
      setMessage('Signup successful');
      setAuthForm(initialForm);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadProjects = async () => {
    try {
      const list = await fetchProjects(token);
      setProjects(list);
      setSelectedProject(list[0] || null);
    } catch (error) {
      setMessage('Could not load projects');
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await fetchDashboard(token);
      setDashboard(data);
    } catch (error) {
      setMessage('Could not load dashboard');
    }
  };

  const createNewProject = async (event) => {
    event.preventDefault();
    try {
      await createProject(token, projectForm);
      setProjectForm(projectFormInit);
      await loadProjects();
      setMessage('Project created');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const assignMember = async (event) => {
    event.preventDefault();
    if (!selectedProject) return;
    try {
      await addMember(token, selectedProject.id, { email: memberEmail });
      setMemberEmail('');
      setMessage('Member invited to project');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    if (!selectedProject) return;
    try {
      await createTask(token, selectedProject.id, taskForm);
      setTaskForm(taskFormInit);
      await loadDashboard();
      setMessage('Task created');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const changeStatus = async (taskId, status) => {
    try {
      await updateTask(token, taskId, { status });
      await loadDashboard();
      setMessage('Task status updated');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card auth-card">
          <h1>Team Task Manager</h1>
          <div className="auth-switch">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Signup</button>
          </div>
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            <label>Email</label>
            <input value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <label>Password</label>
            <input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            {mode === 'signup' && (
              <>
                <label>Name</label>
                <input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
              </>
            )}
            <button type="submit">{mode === 'login' ? 'Login' : 'Signup'}</button>
          </form>
          {message && <p className="message">{message}</p>}
          <p className="hint">Use Signup to create a new account. Set role to admin by editing the request in server or register first and then change role in DB.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Role: {user.role}</p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>

      <section className="grid">
        <div className="card summary-card">
          <h2>Dashboard</h2>
          <div className="status-grid">
            <div>To Do: {dashboard.statusSummary['To Do'] || 0}</div>
            <div>In Progress: {dashboard.statusSummary['In Progress'] || 0}</div>
            <div>Done: {dashboard.statusSummary['Done'] || 0}</div>
            <div>Overdue: {dashboard.overdue || 0}</div>
          </div>
        </div>

        <div className="card">
          <h2>Projects</h2>
          <select value={selectedProject?.id || ''} onChange={(e) => setSelectedProject(projects.find((project) => project.id === Number(e.target.value)))}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          {selectedProject && (
            <div className="project-card">
              <p>{selectedProject.description}</p>
              <small>Owner: {selectedProject.ownerName}</small>
            </div>
          )}
          {isAdmin && (
            <form onSubmit={createNewProject} className="small-form">
              <h3>Create Project</h3>
              <input placeholder="Name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
              <input placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
              <button type="submit">Create</button>
            </form>
          )}

          {selectedProject && isAdmin && (
            <form onSubmit={assignMember} className="small-form">
              <h3>Add Member</h3>
              <input placeholder="Member email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
              <button type="submit">Invite</button>
            </form>
          )}
        </div>
      </section>

      {selectedProject && (
        <section className="grid">
          <div className="card">
            <h2>Create Task</h2>
            <form onSubmit={addTask} className="small-form">
              <input placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <input placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
              <input placeholder="Assignee email" value={taskForm.assigneeEmail} onChange={(e) => setTaskForm({ ...taskForm, assigneeEmail: e.target.value })} />
              <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              <button type="submit">Add Task</button>
            </form>
          </div>

          <div className="card">
            <h2>Tasks</h2>
            {dashboard.tasks.filter((task) => task.projectId === selectedProject.id).map((task) => (
              <div key={task.id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description'}</p>
                <small>Assignee: {task.assigneeName || 'Unassigned'}</small>
                <small>Due: {task.dueDate || 'No due date'}</small>
                <small>Status: {task.status}</small>
                <div className="task-actions">
                  {['To Do', 'In Progress', 'Done'].map((status) => (
                    <button key={status} onClick={() => changeStatus(task.id, status)} disabled={task.status === status}>{status}</button>
                  ))}
                </div>
              </div>
            ))}
            {dashboard.tasks.filter((task) => task.projectId === selectedProject.id).length === 0 && <p>No tasks for this project yet.</p>}
          </div>
        </section>
      )}

      {message && <p className="message success">{message}</p>}
    </div>
  );
}

export default App;
