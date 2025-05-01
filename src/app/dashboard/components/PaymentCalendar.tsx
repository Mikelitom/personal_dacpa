"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Calendar } from "lucide-react";
import { PagoColegiatura } from "../types";

interface PaymentCalendarProps {
  payments: PagoColegiatura[];
}

interface DetailedDate {
  day: number;
  month: number;
  year: number;
  type: string;
  description: string;
}

export function PaymentCalendar({ payments }: PaymentCalendarProps) {
  // Estado para controlar hidratación
  const [isClient, setIsClient] = useState(false);
  // Estados para controlar el mes y año actual del calendario
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  // Estado para almacenar la estructura del calendario
  const [calendarDays, setCalendarDays] = useState<
    Array<Array<{ day: number; isCurrentMonth: boolean; type?: string }>>
  >([]);

  function convertDate(data: PagoColegiatura): DetailedDate {
    const fechaPago = new Date(data.fecha_pago);

    return {
      day: fechaPago.getUTCDate(),
      month: fechaPago.getUTCMonth() + 1,
      year: fechaPago.getUTCFullYear(),
      type: data.concepto || "Pago",
      description: `${data.metodo_pago || "Pago"} - ${data.monto || "0"} - ${
        data.estado || "N/A"
      }`,
    };
  }

  // Usando useMemo para calcular las fechas de pago una sola vez cuando cambian los pagos
  const paymentDates = useMemo(() => {
    return payments.map((item) => convertDate(item));
  }, [payments]);

  // Activamos la hidratación del componente solo en el cliente
  useEffect(() => {
    setIsClient(true);
    // Inicializamos los valores del mes y año al cargar el componente
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Generamos el calendario cuando cambia el mes o el año
  useEffect(() => {
    if (isClient) {
      generateCalendarDays(currentMonth, currentYear);
    }
  }, [currentMonth, currentYear, isClient, paymentDates]);

  // Función para generar los días del calendario
  // Generación de días del calendario
  // Generación de días del calendario
const generateCalendarDays = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 = Domingo, 6 = Sábado
  const daysInMonth = lastDay.getDate();

  // Obtener días del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // Crear una matriz para representar el calendario
  const calendar: Array<
    Array<{ day: number; isCurrentMonth: boolean; type?: string }>
  > = [];
  let dayCounter = 1;
  let nextMonthDay = 1;

  // Para cada semana (máximo 6 semanas para cubrir todos los casos)
  for (let week = 0; week < 6; week++) {
    const weekDays = [];

    // Para cada día de la semana
    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < startDayOfWeek) {
        // Días del mes anterior
        weekDays.push({
          day: prevMonthLastDay - (startDayOfWeek - day - 1),
          isCurrentMonth: false,
        });
      } else if (dayCounter <= daysInMonth) {
        // Días del mes actual
        let dayType;

        // Verificar fechas especiales en `paymentDates`
        const matchingDate = paymentDates.find(
          (date) =>
            date.day === dayCounter &&
            date.month === month + 1 &&
            date.year === year
        );

        if (matchingDate) {
          // Si encontramos una fecha de pago, usamos su tipo
          dayType = matchingDate.type;
        } else {
          // Si no hay una fecha de pago, asignamos tipos para los días fijos
          if (dayCounter === 10) dayType = "payment";
          else if (dayCounter === 12) dayType = "deadline";
          else if (dayCounter === 20) dayType = "event";
        }

        weekDays.push({
          day: dayCounter,
          isCurrentMonth: true,
          type: dayType, // Asignamos el tipo calculado
        });
        dayCounter++;
      } else {
        // Días del mes siguiente
        weekDays.push({
          day: nextMonthDay,
          isCurrentMonth: false,
        });
        nextMonthDay++;
      }
    }

    calendar.push(weekDays);

    // Si ya hemos completado el mes y estamos en una nueva semana, podemos parar
    if (dayCounter > daysInMonth && week >= 3) break;
  }

  setCalendarDays(calendar);
};

// Función para renderizar día del calendario
function renderCalendarDay(day: {
  day: number;
  isCurrentMonth: boolean;
  type?: string;
}) {
  // Si no es del mes actual, mostrar en color gris
  if (!day.isCurrentMonth) {
    return <div className="text-gray-400 text-sm">{day.day}</div>;
  }

  // Si es un día especial, mostrar con formato especial
  if (day.type) {
    const bgColor =
      day.type === "payment"
        ? "bg-pink-500" // Fecha de pago, color rosa
        : day.type === "deadline"
        ? "bg-amber-500" // Fecha de recargo, color ámbar
        : "bg-red-500"; // Evento, color rojo

    return (
      <div
        className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${bgColor} text-white font-medium`}
      >
        {day.day}
      </div>
    );
  }

  // Día normal del mes actual
  return <div className="text-gray-700">{day.day}</div>;
}


  // Función para navegar al mes anterior
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Función para navegar al mes siguiente
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

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

  // Nombres de los meses en español
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

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
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={goToPreviousMonth}
            >
              {/* Icono para mes anterior */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="font-medium text-gray-700">
              {months[currentMonth]} {currentYear}
            </div>
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={goToNextMonth}
            >
              {/* Icono para mes siguiente */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
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
              <span className="text-gray-700">
                Último día para pago (día 20)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">
            Fechas importantes:
          </h4>
          <ul className="space-y-2 text-sm">
            {paymentDates
              .filter(
                (date) =>
                  date.month === currentMonth + 1 && date.year === currentYear
              )
              .map((date, index) => (
                <li
                  key={index}
                  data-testid="important-date"
                  className="flex items-start"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${getPaymentDateColor(
                      date.type
                    )}`}
                  ></div>
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
// Función auxiliar para obtener color según tipo
function getPaymentDateColor(type?: string) {
  return type === "payment"
    ? "bg-pink-500"
    : type === "deadline"
    ? "bg-amber-500"
    : "bg-red-500";
}
