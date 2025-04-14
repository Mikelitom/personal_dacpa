"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/use-toast"
import { Toaster } from "@/app/components/ui/toaster"
import { User } from '@/app/types/user'
import { WelcomeBanner } from '@/app/components/dashboard/WelcomeBanner'
import { QuickActions } from "@/app/components/dashboard/QuickActions";
import { ActiveConvenios } from "@/app/components/dashboard/ActiveConvenios";
import { UpcomingPayments } from "@/app/components/dashboard/UpcomingPayments";
import { Notifications } from "@/app/components/dashboard/Notifications";
import { PaymentCalendar } from "@/app/components/dashboard/PaymentCalendar";
import { StudentSummary } from "@/app/components/dashboard/StudentSummary";

// Datos fallback para evitar errores de hidratación
const placeholderData = {
  students: [],
  nextPayment: { amount: 0, dueDate: '2024-05-10', status: 'pending' },
  paymentDates: [],
  notifications: 0
};

export default function DashboardPage() {
  // useState con initialState definido explícitamente para evitar undefined
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [userData, setUserData] = useState<User>(placeholderData as unknown as User);
  const [error, setError] = useState<string | null>(null);
  // Nuevo estado para controlar hidratación
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Marcar que estamos en el cliente inmediatamente
    setIsClient(true);
    
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');

        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
        
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        toast({
          title: 'Error al cargar usuario',
          description: 'No pudimos cargar los datos del usuario. Por favor, intentelo mas tarde.',
          variant: 'destructive'
        });
      }
    };

    fetchUser();
  }, [toast]); // Añadimos toast a las dependencias

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
      {/* Solo renderizar el contenido si estamos en el cliente para evitar errores de hidratación */}
      {isClient && (
        <>
          <WelcomeBanner user={userData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <QuickActions />
              <ActiveConvenios students={userData.students || []} />
            </div>

            {/* Columna central */}
            <div className="space-y-6">
              <UpcomingPayments 
                students={userData.students || []} 
                nextPayment={userData.nextPayment} 
              />
              <Notifications notifications={userData.notifications} />
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <PaymentCalendar paymentDates={userData.paymentDates || []} />
              <StudentSummary students={userData.students || []} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}