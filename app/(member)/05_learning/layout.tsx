import type {ReactNode} from 'react';
import AcademyNavigationTracker from '@/components/member/learning/AcademyNavigationTracker';
import AcademyScrollRestoration from '@/components/member/learning/AcademyScrollRestoration';

export default function AcademyLayout({children}: {children: ReactNode}) {
  return <>
    <AcademyNavigationTracker />
    <AcademyScrollRestoration />
    {children}
  </>;
}
