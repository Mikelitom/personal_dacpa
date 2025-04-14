export interface User {
  name: string,
  notifications: number,
  nextPayment: NextPayment,
  students: Student[],
  paymentDates: PaymentDate[]  
}

export interface NextPayment {
  date: string,
  amount: number
}

export interface Student {
  id: number,
  name: string,
  grade: string,
  image: string,
  hasConvenio: boolean,
  convenioType: string | undefined,
  colegiaturaRegular: number | undefined,
  colegiaturaConvenio: number | undefined
}

export interface PaymentDate {
  day: number,
  month: number,
  year: number,
  type: string,
  description: string
}