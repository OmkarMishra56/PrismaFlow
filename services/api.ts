
import { Task, User, Priority } from "../types";

const STORAGE_KEY_USERS = 'prisma_flow_users';
const STORAGE_KEY_TASKS = 'prisma_flow_tasks';
const SESSION_KEY = 'prisma_session';

const getUsers = (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
const getTasks = (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]');

export const api = {
  auth: {
    async login(email: string): Promise<User> {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error("Neural ID not found in database.");
      }

      const sessionUser = { ...user, token: `jwt_${Math.random().toString(36).substr(2)}` };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    },

    async register(username: string, email: string): Promise<User> {
      const users = getUsers();
      if (users.some(u => u.email === email)) {
        throw new Error("This Neural ID is already registered.");
      }

      const newUser: User = { 
        id: `u-${Math.random().toString(36).substr(2, 5)}`, 
        username, 
        email, 
        token: `jwt_${Math.random().toString(36).substr(2)}` 
      };
      
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return newUser;
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
    },

    getSession(): User | null {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return null;
      // Simulated JWT verification: Check if session exists in memory/storage
      return JSON.parse(session);
    }
  },

  tasks: {
    async getAll(): Promise<Task[]> {
      const user = api.auth.getSession();
      if (!user) return [];
      return getTasks().filter(t => t.userId === user.id);
    },

    async create(title: string, description: string, priority: Priority, dueDate: string): Promise<Task> {
      const user = api.auth.getSession();
      if (!user) throw new Error("Unauthorized: Session Expired");
      
      const newTask: Task = {
        id: `task-${Math.random().toString(36).substr(2, 7)}`,
        title,
        description,
        priority,
        dueDate,
        completed: false,
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      
      const tasks = getTasks();
      tasks.push(newTask);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      return newTask;
    },

    async update(id: string, updates: Partial<Task>): Promise<Task> {
      const tasks = getTasks();
      const index = tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Operational Record not found");
      
      tasks[index] = { ...tasks[index], ...updates };
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      return tasks[index];
    },

    async delete(id: string): Promise<void> {
      const tasks = getTasks().filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    }
  }
};
