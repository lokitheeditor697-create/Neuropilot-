export interface User {
  id: string;
  email: string;
  name: string;
  joinedAt: string;
  profile: {
    avatar: string;
    theme: "light" | "dark";
    dailyFocusTarget: number; // in minutes
  };
}

export interface TaskDetails {
  urgency: number; // 1-10
  impact: number; // 1-10
  difficulty: number; // 1-10
  completionProbability: number; // 0-100 percentage
}

export interface Task {
  id: string;
  userId: string;
  name: string;
  description: string;
  deadline: string;
  estimatedTime: number; // in hours
  importance: "high" | "medium" | "low";
  priorityScore: number; // 0-100 score
  riskScore: number; // 0-100 score
  status: "todo" | "inprogress" | "completed";
  suggestedStartTime: string;
  details: TaskDetails;
}

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  objective: string;
  category: "startup" | "learning" | "career" | "health" | "personal";
  progress: number; // 0-100
  prediction: string;
  milestones: Milestone[];
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: string;
  streak: number;
  consistency: number; // percentage
  performance: boolean[]; // array of last 7 days checkins
}

export interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  duration: number; // in minutes
  status: "pending" | "completed" | "rescheduled";
  category: "focus" | "task" | "break" | "habit";
  taskId?: string;
  habitId?: string;
}

export interface Schedule {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  items: ScheduleItem[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "critical" | "info" | "warning";
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface SimulationState {
  isActive: boolean;
  fatigueOverride: number; // 0-100
  scopeCreepOverride: number; // 0-100
  meetingLoadOverride: number; // 0-100
  slippedMilestoneCount: number; // 0-5
}

