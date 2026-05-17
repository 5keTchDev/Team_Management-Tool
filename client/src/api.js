const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const jsonOptions = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export const signup = (payload) =>
  fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    ...jsonOptions(),
    body: JSON.stringify(payload),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  });

export const login = (payload) =>
  fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    ...jsonOptions(),
    body: JSON.stringify(payload),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  });

export const fetchProjects = (token) =>
  fetch(`${baseUrl}/api/projects`, {
    method: 'GET',
    ...jsonOptions(token),
  }).then((res) => res.json());

export const createProject = (token, payload) =>
  fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    ...jsonOptions(token),
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const addMember = (token, projectId, payload) =>
  fetch(`${baseUrl}/api/projects/${projectId}/members`, {
    method: 'POST',
    ...jsonOptions(token),
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const fetchTasks = (token, projectId) =>
  fetch(`${baseUrl}/api/projects/${projectId}/tasks`, {
    method: 'GET',
    ...jsonOptions(token),
  }).then((res) => res.json());

export const createTask = (token, projectId, payload) =>
  fetch(`${baseUrl}/api/${projectId}/tasks`, {
    method: 'POST',
    ...jsonOptions(token),
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const updateTask = (token, taskId, payload) =>
  fetch(`${baseUrl}/api/${taskId}`, {
    method: 'PATCH',
    ...jsonOptions(token),
    body: JSON.stringify(payload),
  }).then((res) => res.json());

export const fetchDashboard = (token) =>
  fetch(`${baseUrl}/api/dashboard`, {
    method: 'GET',
    ...jsonOptions(token),
  }).then((res) => res.json());
