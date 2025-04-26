'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Sidebar } from '../components/dashboard/Sidebar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
        <Sidebar />
        <main className="pl-64 min-h-screen bg-gray-50">{children}</main>
      </div>
    </SessionContextProvider>
  );
}
