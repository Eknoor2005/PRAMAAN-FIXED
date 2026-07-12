'use client';

import { Suspense } from 'react';
import FirebaseAuthPage from '../page';

export default function FirebaseSignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirebaseAuthPage />
    </Suspense>
  );
}
