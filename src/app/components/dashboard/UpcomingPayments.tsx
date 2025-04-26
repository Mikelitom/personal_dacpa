"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AlertCircle, CreditCard } from "lucide-react";
import { Database } from "@/app/lib/types";
import { useEffect, useState } from 'react'

type Alumno = Database['public']['Tables']['Alumno']['Row']
type PagoColegiatura = Database['public']['Tables']['PagoColegiatura']['Row']
type Convenio = Database['public']['Tables']['Convenio']['Row']

interface UpcomingPaymentsProps {
  students: Alumno[];
}

export function UpcomingPayments({ students }: UpcomingPaymentsProps) {
  const studentsWithConvenio = students.filter((student) => student.convenio);
  const [ convenios, setConvenios ] = useState<Record<string, Convenio>>({})
  const [ pagos, setPagos ] = useState<Record<string, PagoColegiatura>>({})

  const fetchPagoById = async (idAlumno: number) => {
    try {
      const response = await fetch(`/api/pago-colegiatura/${idAlumno}/by_id`)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pagos')        
      }

      return await response.json();
    } catch (error) {
      console.error('Error: ', error)
    } 
  }


  const fetchConvenioById = async (idAlumno: number) => {
    try {
      const response = await fetch(`/api/convenios/${idAlumno}/by_id`)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch convenio')        
      }

      return await response.json();
    } catch (error) {
      console.error('Error: ', error)
    } 
  }

  useEffect(() => {
    async function loadConvenios() {
      for (const alumno of studentsWithConvenio) {
        const convenio = await fetchConvenioById(alumno.id_alumno);

        if (convenio) {
          setConvenios(prev => ({
            ...prev,
            [alumno.id_alumno]: convenio
          }))
        }
      }
    }

    async function loadPagos() {
      for (const alumno of students) {
        const pago = await fetchPagoById(alumno.id_alumno);
  
        if (pago) {
          setPagos(prev => ({
            ...prev,
            [alumno.id_alumno]: pago
          }))
        }
      }
    }

    loadPagos();
    loadConvenios();
  }, [students])

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
          {
            students.map((student) => (
              <PaymentItem 
              key={student.id_alumno} 
              student={student} 
              date="10/05/2024" 
              month="Mayo 2024" 
              status="Pendiente"
              amount={student.convenio && convenios[student.id_alumno]?.porcentaje_incremento ? (pagos[student.id_alumno].monto * convenios[student.id_alumno]?.porcentaje_incremento) : 1500}
            />
            ))
          }


          <div className="p-3 border border-gray-200 rounded-lg bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Junio 2024</p>
                <p className="text-sm text-gray-600">Vence: 10/06/2024</p>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                Próximo
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Recordatorio</h4>
              <p className="text-amber-700 text-sm mt-1">
                Después del día 12 de cada mes se aplica un 10% de interés a los pagos pendientes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/dashboard/colegiatura">
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">Realizar Pago</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentItemProps {
  student: Alumno;
  date: string;
  month: string;
  status: string;
  amount: number;
}

function PaymentItem({ student, date, month, status, amount }: PaymentItemProps) {
  return (
    <div className="p-3 border border-pink-200 rounded-lg bg-pink-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{month}</p>
          <p className="text-sm text-gray-600">Vence: {date}</p>
        </div>
        <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
          {status}
        </Badge>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">{student.nombre} ({student.grado})</span>
        <span className="font-medium text-pink-600">${amount.toFixed(2)}</span>
      </div>
    </div>
  );
}