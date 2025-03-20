'use client'
import type React from 'react';
import { useState } from 'react';
import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';

export default function DashboardLayout(this: any, { children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar title='Inicio' user='Miguel Fajardo'/>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}