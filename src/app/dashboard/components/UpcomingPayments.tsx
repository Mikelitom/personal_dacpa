"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { AlertCircle, CreditCard } from "lucide-react";
import type { Alumno, Convenio, PagoColegiatura } from "../types";

interface UpcomingPaymentsProps {
  alumnos: Alumno[];
  convenios: Convenio[];
  pagosColegiatura: PagoColegiatura[];
}

export function UpcomingPayments({
  alumnos,
  convenios,
  pagosColegiatura,
}: UpcomingPaymentsProps) {
  const alumnosConInfo = alumnos.map((alumno) => {
    const convenio = convenios.find(
      (c) => c.id_alumno === alumno.id_alumno && c.firmado
    );

    const pagosPendientes = pagosColegiatura
      .filter(
        (p) => p.id_alumno === alumno.id_alumno && p.estado === "pendiente"
      )
      .sort(
        (a, b) =>
          new Date(a.fecha_pago).getTime() - new Date(b.fecha_pago).getTime()
      );

    const proximoPago = pagosPendientes[0];

    const montoOriginal = proximoPago?.monto ?? 0;
    const montoFinal = convenio
      ? montoOriginal + (montoOriginal * convenio.porcentaje_incremento) / 100
      : montoOriginal;

    return {
      alumno,
      convenio,
      proximoPago: proximoPago
        ? {
            fecha: proximoPago.fecha_pago,
            estado: proximoPago.estado,
            descripcion: proximoPago.concepto,
            montoOriginal,
            montoFinal,
          }
        : undefined,
    };
  });

  if (pagosColegiatura.length === 0) {
    return (
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="pb-2 border-b border-gray-100">
          <CardTitle className="text-lg text-gray-800 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-pink-500" />
            Próximos Pagos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">No hay pagos pendientes</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-lg text-gray-800 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-pink-500" />
          Próximos Pagos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {alumnosConInfo.map(({ alumno, convenio, proximoPago }) => (
            proximoPago?.estado === 'pendiente' && (
              <PaymentItem
                key={alumno.id_alumno}
                student={alumno}
                date={proximoPago.fecha}
                month={proximoPago.descripcion}
                status={proximoPago.estado}
                amount={proximoPago.montoFinal}
              />
            )
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Recordatorio</h4>
              <p className="text-amber-700 text-sm mt-1">
                Después del día 12 de cada mes se aplica un 10% de interés a los
                pagos pendientes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/dashboard/colegiatura">
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Realizar Pago
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentItemProps {
  student: Alumno;
  date?: string;
  month?: string;
  status?: string;
  amount?: number;
}

function PaymentItem({
  student,
  date,
  month,
  status,
  amount,
}: PaymentItemProps) {
  return (
    <div className="p-3 border border-pink-200 rounded-lg bg-pink-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{month}</p>
          <p className="text-sm text-gray-600">Vence: {date}</p>
        </div>
        <Badge
          variant="outline"
          className="bg-pink-100 text-pink-700 border-pink-200"
        >
          {status}
        </Badge>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {student.nombre} ({student.grado})
        </span>
        <span className="font-medium text-pink-600">${amount?.toFixed(2)}</span>
      </div>
    </div>
  );
}
