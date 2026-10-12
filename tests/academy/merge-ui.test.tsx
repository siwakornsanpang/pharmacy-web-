import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ExperiencedInstructors from '@/components/member/learning/ExperiencedInstructors';
import PopularCourses from '@/components/member/learning/PopularCourses';
import FeaturedCourse from '@/components/member/learning/FeaturedCourse';
import cardStyles from '@/components/member/learning/courses/CourseCard.module.css';

afterEach(cleanup);

it('limits the home instructor section to four people and links to all instructors', () => {
  render(<ExperiencedInstructors instructors={Array.from({length: 6}, (_, id) => ({id, name: `วิทยากร ${id}`, title: null, expertise: null, imageUrl: null}))} />);
  expect(screen.getAllByRole('heading', {level: 3})).toHaveLength(4);
  expect(screen.getByRole('link', {name: 'ดูทั้งหมด'})).toHaveAttribute('href', '/learning/instructors');
});

it('uses the shared styled course card and omits absent categories', () => {
  render(<PopularCourses courses={[{id: 1, title: 'คอร์สทดสอบ', summary: null, coverUrl: null, durationLabel: '1 ชั่วโมง', cpeLabel: '3 หน่วยกิต', categoryName: null, categoryColor: null, instructorName: null, instructorTitle: null, studentCount: 0, rating: null, reviewCount: 0, outcomes: [], isFeatured: false, format: 'online', venue: null, trainingStartsAt: null, trainingEndsAt: null}]} />);
  const card = screen.getByRole('link', {name: /คอร์สทดสอบ/});
  expect(card.className).toContain('card');
  expect(card.querySelector('[class*="badge"]')).toBeNull();
  expect(card.getAttribute('href')).toContain('from=');
});

it('shares the detail button style and hides irrelevant carousel controls for one course', () => {
  render(<FeaturedCourse courses={[{id:1,title:'คอร์สทดสอบ',summary:null,coverUrl:null,durationLabel:null,cpeLabel:'3 หน่วยกิต',categoryName:null,categoryColor:null,instructorName:null,instructorTitle:null,studentCount:0,rating:null,reviewCount:0,outcomes:[],isFeatured:true,format:'online',venue:null,trainingStartsAt:null,trainingEndsAt:null}]} />);
  expect(screen.getByRole('link',{name:'ดูรายละเอียด'})).toHaveClass(cardStyles.enrollBtn);
  expect(screen.queryByRole('button',{name:'คอร์สแนะนำถัดไป'})).not.toBeInTheDocument();
});
