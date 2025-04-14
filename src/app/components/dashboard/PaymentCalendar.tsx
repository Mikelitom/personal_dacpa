"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Calendar } from "lucide-react";
import { PaymentDate } from "@/app/types/user";

interface PaymentCalendarProps {
  paymentDates: PaymentDate[];
}

export function PaymentCalendar({ paymentDates = [] }: PaymentCalendarProps) {
  // Estado para controlar hidratación
  const [isClient, setIsClient] = useState(false);

  // Activamos los cálculos solo en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Si no estamos en el cliente aún, mostrar un esqueleto
  if (!isClient) {
    return (
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="pb-2 border-b border-gray-100">
          <CardTitle className="text-lg text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-pink-500" />
            Calendario de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Cargando calendario...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular el mes y año directamente cuando estamos en el cliente
  // No necesitamos useState para esto ya que isClient asegura que solo se ejecute en el navegador
  const now = new Date();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonth = months[now.getMonth()];
  const currentYear = now.getFullYear();

  // Datos pre-calculados para el calendario
  const calendarDays = [
    [{ day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, { day: 1, isCurrentMonth: true }, { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }, { day: 4, isCurrentMonth: true }],
    [{ day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true }, { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true, type: "payment" }, { day: 11, isCurrentMonth: true }],
    [{ day: 12, isCurrentMonth: true, type: "deadline" }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true }, { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }, { day: 18, isCurrentMonth: true }],
    [{ day: 19, isCurrentMonth: true }, { day: 20, isCurrentMonth: true, type: "event" }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true }, { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }, { day: 25, isCurrentMonth: true }],
    [{ day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true }, { day: 29, isCurrentMonth: true }, { day: 30, isCurrentMonth: true }, { day: 31, isCurrentMonth: true }, { day: 1, isCurrentMonth: false }]
  ];

  // Resto del componente igual...
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-pink-500" />
          Calendario de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Contenido del calendario... */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
              {/* Icono para mes anterior */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="font-medium text-gray-700">{currentMonth} {currentYear}</div>
            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
              {/* Icono para mes siguiente */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Tabla del calendario... */}
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-2 text-xs font-medium text-gray-500">D</th>
                <th className="p-2 text-xs font-medium text-gray-500">L</th>
                <th className="p-2 text-xs font-medium text-gray-500">M</th>
                <th className="p-2 text-xs font-medium text-gray-500">M</th>
                <th className="p-2 text-xs font-medium text-gray-500">J</th>
                <th className="p-2 text-xs font-medium text-gray-500">V</th>
                <th className="p-2 text-xs font-medium text-gray-500">S</th>
              </tr>
            </thead>
            <tbody>
              {calendarDays.map((week, weekIndex) => (
                <tr key={weekIndex} className="border-b border-gray-200">
                  {week.map((day, dayIndex) => (
                    <td key={dayIndex} className="p-1">
                      {/* Renderizado de cada celda del calendario */}
                      {renderCalendarDay(day)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
              <span className="text-gray-700">Fecha de pago (día 10)</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-gray-700">Inicio de recargos (día 12)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-gray-700">Último día para pago (día 20)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Fechas importantes:</h4>
          <ul className="space-y-2 text-sm">
            {paymentDates.map((date, index) => (
              <li key={index} className="flex items-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${getPaymentDateColor(date.type)}`}></div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">
                      {date.day}/{date.month}/{date.year}
                    </span>{" "}
                    - {date.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Función auxiliar para renderizar día del calendario
function renderCalendarDay(day: { day: number; isCurrentMonth: boolean; type?: string }) {
  // Si no es del mes actual, mostrar en color gris
  if (!day.isCurrentMonth) {
    return <div className="text-gray-400">{day.day}</div>;
  }

  // Si es un día especial, mostrar con formato especial
  if (day.type) {
    const bgColor = 
      day.type === "payment" ? "bg-pink-500" : 
      day.type === "deadline" ? "bg-amber-500" : 
      "bg-red-500";

    return (
      <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${bgColor} text-white font-medium`}>
        {day.day}
      </div>
    );
  }

  // Día normal del mes actual
  return <div className="text-gray-700">{day.day}</div>;
}

// Función auxiliar para obtener color según tipo
function getPaymentDateColor(type?: string) {
  return type === "payment" ? "bg-pink-500" : 
         type === "deadline" ? "bg-amber-500" : 
         "bg-red-500";
}