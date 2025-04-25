"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { Toaster } from "@/app/components/ui/toaster";
import { WelcomeBanner } from "@/app/components/dashboard/WelcomeBanner";
import { QuickActions } from "@/app/components/dashboard/QuickActions";
import { ActiveConvenios } from "@/app/components/dashboard/ActiveConvenios";
import { UpcomingPayments } from "@/app/components/dashboard/UpcomingPayments";
import { Notifications } from "@/app/components/dashboard/Notifications";
import { PaymentCalendar } from "@/app/components/dashboard/PaymentCalendar";
import { StudentSummary } from "@/app/components/dashboard/StudentSummary";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from "../lib/types";

type Usuario = Database["public"]["Tables"]["Usuario"]["Row"];
type PadreFamilia = Database["public"]["Tables"]["PadreFamilia"]["Row"];
type Alumno = Database["public"]["Tables"]["Alumno"]["Row"];
type Convenio = Database["public"]["Tables"]["Convenio"]["Row"];

// Datos fallback para evitar errores de hidratación
const placeholderData = {
  students: [],
  nextPayment: { amount: 0, dueDate: "2024-05-10", status: "pending" },
  paymentDates: [],
  notifications: 0,
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  // useState con initialState definido explícitamente para evitar undefined
  const [ loading, setLoading ] = useState(true);
  const { toast } = useToast();
  const [ error, setError ] = useState<string | null>(null);
  const session = useSession();
  const [ usuario, setUsuario ] = useState<Usuario>();
  const [ alumnos, setAlumnos ] = useState<Alumno[]>([])
  const [ convenio, setConvenio ] = useState<Convenio>()

  // Nuevo estado para controlar hidratación
  useEffect(() => {
    // Marcar que estamos en el cliente inmediatamente
    async function fetchUsuario(email: string) {
      try {
        const response = await fetch(`/api/usuario/${email}/usuario`)

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch usuario')        
        }

        const data = await response.json();

        setUsuario(data);
      } catch (error) {
        console.error('Error: ', error)
      } finally {
        setLoading(false);
      }
    } 

    fetchUsuario(session?.user.email?.toString() ?? "")
  }, [session, toast]); // Añadimos toast a las dependencias

  

  // Skeleton loader cuando está cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <>
        <WelcomeBanner user={usuario} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <QuickActions />
            <ActiveConvenios students={alumnos} />
          </div>

          {/* Columna central */}
          <div className="space-y-6">
            <UpcomingPayments
              students={alumnos || []}
              nextPayment={userData.nextPayment}
            />
            <Notifications notifications={userData.notifications} />
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <PaymentCalendar paymentDates={userData.paymentDates || []} />
            <StudentSummary students={alumnos || []} />
          </div>
        </div>
      </>
    </div>
  );
}
