
import { Assignment, GradeRecord } from '../types';

const ASSIGNMENTS_KEY = 'linguist_pro_assignments';
const GRADES_KEY = 'linguist_pro_grades';

export const storage = {
  getAssignments: (): Assignment[] => {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveAssignments: (assignments: Assignment[]) => {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  },
  getGrades: (): GradeRecord[] => {
    const data = localStorage.getItem(GRADES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveGrades: (grades: GradeRecord[]) => {
    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  },
  addGrade: (grade: GradeRecord) => {
    const current = storage.getGrades();
    storage.saveGrades([...current, grade]);
  }
};
