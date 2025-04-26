import type { Metadata } from 'next';
import { poppins, quicksand } from '../fonts';
import '../globals.css';
import { ClientLayout } from './client-layout';

export const metadata: Metadata = {
  title: 'Pagos DACPa',
  description: 'Sistema de control de colegiatura y servicios colegio Despertar Al Conocimiento',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="es" className={`${poppins.variable} ${quicksand.variable}`}>
      <div>
        <ClientLayout>{children}</ClientLayout>
      </div>
    </div>
  );
}