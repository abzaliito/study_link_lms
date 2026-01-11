
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface Group {
  id: string;
  name: string;
  level: string;
  teacherId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  level?: string;
  groupId?: string; // Links student to a group
}

export type ExerciseType = 'multiple_choice' | 'fill_blank';

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  content: {
    question?: string;
    options?: string[]; // For multiple choice
    correctAnswer?: string | string[]; // String for MC, Array for Blanks
    textWithBlanks?: string; // For fill_blank: "London is {1} of UK"
  };
  points: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string; // Acts as "Unit" or "Category"
  groupId?: string; // Assigned to specific group
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  type: 'legacy' | 'interactive';
  exercises?: Exercise[]; // The interactive content
  grade?: number;
  feedback?: string;
  points: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  url: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  date: string;
  answers?: Record<string, any>; // Stores the student's specific answers
}