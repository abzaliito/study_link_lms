import React from 'react';
import { UserRole, Book, Assignment } from './types';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Modern English Grammar',
    author: 'Raymond Murphy',
    category: 'Grammar',
    cover: 'https://picsum.photos/seed/book1/300/400',
    description: 'A self-study reference and practice book for intermediate learners of English.',
    url: '#'
  },
  {
    id: '2',
    title: 'Business English Vocabulary',
    author: 'Bill Mascull',
    category: 'Business',
    cover: 'https://picsum.photos/seed/book2/300/400',
    description: 'The perfect tool for anyone needing to use English in their professional life.',
    url: '#'
  },
  {
    id: '3',
    title: 'Advanced Listening Skills',
    author: 'Sarah Johnson',
    category: 'Listening',
    cover: 'https://picsum.photos/seed/book3/300/400',
    description: 'Improve your auditory comprehension with authentic native speakers.',
    url: '#'
  },
  {
    id: '4',
    title: 'Academic Writing Masterclass',
    author: 'Dr. Emily Chen',
    category: 'Writing',
    cover: 'https://picsum.photos/seed/book4/300/400',
    description: 'Learn the nuances of essay writing and research papers.',
    url: '#'
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'The Passive Voice Essay',
    description: 'Write a 500-word essay about the history of the industrial revolution using passive voice where appropriate.',
    dueDate: '2024-06-20',
    courseId: 'ENG-302',
    status: 'PENDING',
    points: 100,
    type: 'legacy'
  },
  {
    id: 'a2',
    title: 'Idioms and Phrasal Verbs Quiz',
    description: 'A 20-question quiz covering common business idioms.',
    dueDate: '2024-06-22',
    courseId: 'ENG-101',
    status: 'SUBMITTED',
    points: 50,
    type: 'legacy'
  },
  {
    id: 'a3',
    title: 'Present Perfect vs Past Simple',
    description: 'Complete the worksheet provided in the course materials.',
    dueDate: '2024-06-15',
    courseId: 'ENG-205',
    status: 'GRADED',
    grade: 85,
    feedback: 'Excellent use of context clues!',
    points: 100,
    type: 'legacy'
  }
];