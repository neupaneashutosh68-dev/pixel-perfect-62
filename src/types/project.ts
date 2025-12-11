export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  dueDate?: string;
  tags: string[];
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  taskCount: number;
  completedCount: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
