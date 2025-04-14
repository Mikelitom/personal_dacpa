import type React from 'react';
import type { Metadata } from 'next';
import { poppins, quicksand } from '../fonts'
import '../globals.css';

export const metadata: Metadata = {
  title: 'Pagos DACPa',
  description: 'Sistema de control de colegiatura y servicios colegio Despertar Al Conocimiento'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${quicksand.variable}`}>
      <body className={quicksand.className}>{children}</body>
    </html>
  )
}
