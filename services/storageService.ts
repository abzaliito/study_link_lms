
import { Assignment, GradeRecord, User, UserRole, Group } from '../types';

const ASSIGNMENTS_KEY = 'linguist_pro_assignments';
const GRADES_KEY = 'linguist_pro_grades';
const USERS_KEY = 'linguist_pro_users';
const GROUPS_KEY = 'linguist_pro_groups';

// Seed Groups
const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', name: 'B2 Morning Group', level: 'B2', teacherId: 'teacher1' },
  { id: 'g2', name: 'A1 Evening Group', level: 'A1', teacherId: 'teacher1' }
];

// Default Seed Users
const DEFAULT_USERS: User[] = [
  {
    id: 'admin1',
    name: 'James Curator',
    email: 'james@studylink.com',
    phoneNumber: '0000',
    password: 'admin',
    role: UserRole.ADMIN
  },
  {
    id: 'teacher1',
    name: 'Sarah Teacher',
    email: 'sarah@studylink.com',
    phoneNumber: '1111',
    password: 'teach',
    role: UserRole.TEACHER
  },
  {
    id: 'student1',
    name: 'Abzal',
    email: 'abzal@studylink.com',
    phoneNumber: '1234',
    password: '123',
    role: UserRole.STUDENT,
    level: 'B2',
    groupId: 'g1' // Assigned to B2 group
  }
];

// Helper to safely parse JSON
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return fallback;
  }
};

export const storage = {
  // Group Management
  getGroups: (): Group[] => {
    const data = localStorage.getItem(GROUPS_KEY);
    if (!data) {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(DEFAULT_GROUPS));
      return DEFAULT_GROUPS;
    }
    return safeParse(GROUPS_KEY, DEFAULT_GROUPS);
  },

  // Assignment Management with Group Logic
  getAssignments: (user?: User): Assignment[] => {
    const allAssignments: Assignment[] = safeParse(ASSIGNMENTS_KEY, []);
    
    if (!user) return [];

    if (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER) {
      return allAssignments;
    } 

    if (user.role === UserRole.STUDENT) {
      // Students only see assignments for their group
      return allAssignments.filter(a => a.groupId === user.groupId);
    }

    return [];
  },

  saveAssignments: (assignments: Assignment[]) => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  },

  addAssignment: (assignment: Assignment) => {
    const current = safeParse<Assignment[]>(ASSIGNMENTS_KEY, []);
    storage.saveAssignments([...current, assignment]);
  },

  submitAssignment: (assignmentId: string, studentId: string, score: number, maxScore: number, answers: Record<string, any>) => {
     // 1. Update assignment status (Mock logic)
     const allAssignments = safeParse<Assignment[]>(ASSIGNMENTS_KEY, []);
     
     // 2. Create Grade Record with Answers
     const student = storage.getUsers().find(u => u.id === studentId);
     const assignment = allAssignments.find(a => a.id === assignmentId);
     
     if (student && assignment) {
         const newGrade: GradeRecord = {
             id: Math.random().toString(36).substr(2, 9),
             studentId: student.id,
             studentName: student.name,
             assignmentId: assignment.id,
             assignmentTitle: assignment.title,
             score: score,
             maxScore: maxScore,
             date: new Date().toISOString().split('T')[0],
             answers: answers // Save the answers!
         };
         storage.addGrade(newGrade);
     }
  },

  getGrades: (): GradeRecord[] => {
    return safeParse(GRADES_KEY, []);
  },
  
  // Get specific grade for a student and assignment (helper for Assignments.tsx)
  getGradeForAssignment: (studentId: string, assignmentId: string): GradeRecord | undefined => {
    const grades = safeParse<GradeRecord[]>(GRADES_KEY, []);
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  },

  saveGrades: (grades: GradeRecord[]) => {
    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  },
  addGrade: (grade: GradeRecord) => {
    const current = storage.getGrades();
    // Remove existing grade for this assignment if it exists (overwrite)
    const filtered = current.filter(g => !(g.studentId === grade.studentId && g.assignmentId === grade.assignmentId));
    storage.saveGrades([...filtered, grade]);
  },
  
  // User Management
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return safeParse(USERS_KEY, DEFAULT_USERS);
  },
  addUser: (user: User) => {
    const users = storage.getUsers();
    if (users.find(u => u.phoneNumber === user.phoneNumber)) {
      throw new Error('User with this phone number already exists.');
    }
    const updatedUsers = [...users, user];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return updatedUsers;
  },
  updateUser: (updatedUser: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
};
