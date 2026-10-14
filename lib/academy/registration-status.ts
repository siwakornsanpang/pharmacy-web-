import type {AcademyCourse} from './client';

export function registrationClosedReason(course: Pick<AcademyCourse, 'status' | 'enrollmentDeadline'>) {
  if (course.status === 'draft') return 'ยังไม่เปิดลงทะเบียน';
  if (course.status === 'archived') return 'ปิดรับสมัคร';
  if (course.enrollmentDeadline && new Date(course.enrollmentDeadline).getTime() <= Date.now()) return 'ปิดรับสมัคร';
  return '';
}
