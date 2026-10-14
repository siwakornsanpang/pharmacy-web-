import { mapIncomingCategory, pageIncomingCourses } from './incoming';
import {getAcademyCategories as getPublicCategories, getAcademyCourses as getPublicCourses, getAcademyReviews as getPublicReviews} from '@/lib/academy';

export interface AcademyCategory {
  id: number;
  name: string;
  count: number;
  imageUrl?: string | null;
  color?: string | null;
}

export interface AcademyCourse {
  id: number;
  title: string;
  summary: string | null;
  details?: string | null;
  learningOutcomes?: string[];
  curriculum?: string[];
  instructorName: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number;
  durationLabel?: string | null;
  cpeCredits: number | string;
  cpeLabel?: string;
  price: number | string;
  maxStudents?: number | null;
  enrollmentDeadline?: string | null;
  categoryId: number | null;
  categoryName: string | null;
  format?: 'online' | 'onsite';
  venue?: string | null;
  trainingStartsAt?: string | null;
  trainingEndsAt?: string | null;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  isFeatured?: boolean;
}

export interface AcademyInstructor { id: number; name: string; title: string | null; expertise: string | null; imageUrl: string | null }
export interface AcademyReview { id: number; courseId?: number; rating: number; body: string; reviewerName: string; reviewerRole: string | null; courseTitle: string | null }
export interface AcademyStats { courseCount: number; learnerCount: number; instructorCount: number }

export interface AcademyPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export class AcademyError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'AcademyError';
  }
}

// These adapters only shape public data for the Academy UI.
// Member actions use Siwakorn's existing routes directly.
export function listAcademyCategories() {
  return getPublicCategories().then(items => items.map(mapIncomingCategory));
}
export function listAcademyReviews(): Promise<AcademyReview[]> { return getPublicReviews(); }
export function listAcademyCourses(params: {search?: string; categoryId?: number | null; page?: number; limit?: number; featured?: boolean} = {}) {
  return getPublicCourses({q: params.search?.trim(), featured: params.featured})
    .then(items => pageIncomingCourses(items, params));
}
