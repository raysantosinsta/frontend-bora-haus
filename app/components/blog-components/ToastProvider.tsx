// app/components/ToastProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="bottom-right" toastOptions={{ className: 'bg-gray-800 text-white' }} />;
}