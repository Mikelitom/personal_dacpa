"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Bell } from "@/app/components/shared/Icons";
import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/use-toast";

interface NotificationsProps {
  notifications: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "payment" | "info" | "warning";
}

export function Notifications({ notifications }: NotificationsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notificationsList, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoti = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notification data.");
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
        toast({
          title: "Error al cargar notificaciones",
          description: "No pudimos cargar las notificaciones. Por favor, intenta más tarde.",
          variant: "destructive",
        });
      }
    };

    fetchNoti();
  }, []);

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-pink-500" />
          Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {loading && <div>Cargando...</div>} {/* Mensaje de carga */}
          {error && !loading && <div className="text-red-500">No pudimos cargar las notificaciones. Por favor, intenta más tarde.</div>} {/* Mensaje de error */}
          {!loading && !error && notificationsList.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
  
}

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  // Define el color según el tipo de notificación
  const bgColor =
    notification.type === "payment"
      ? "bg-pink-50 border-pink-200"
      : notification.type === "warning"
      ? "bg-amber-50 border-amber-200"
      : "bg-blue-50 border-blue-200";

  return (
    <div className={`p-3 rounded-lg border ${bgColor}`}>
      <p className="font-medium text-gray-800">{notification.title}</p>
      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
    </div>
  );
}
