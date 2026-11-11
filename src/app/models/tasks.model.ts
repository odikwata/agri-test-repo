export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'livestock' | 'crops' | 'equipment' | 'general';
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string; // User ID
  dueDate: Date;
  completedDate?: Date;
  organizationId: string;
  relatedEntityId?: string; // e.g., Animal ID or Field ID
}

export interface TaskLog {
  id: string;
  taskId: string;
  userId: string;
  timestamp: Date;
  action: string;
  notes?: string;
}
