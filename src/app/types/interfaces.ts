export interface User {
  userId: number,
  name: string,
  mail: string,
  phone: string,
  role: string,
  department: string | null,
  state: string,
  create_at: string
}

export interface Tutor {
  tutorId: number, 
  direction: string,
  economicIncome: string,
  scholarity: string,
  ocupation: string
}
