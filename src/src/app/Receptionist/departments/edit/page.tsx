import { getDepartments } from '@/app/lib/getDepartments'
import React from 'react'
import AllDepartments from './AllDepartments'

interface DepartmentData {
  id: number;
  title: string;
  description: string;
  image: string;
  user_id: number;
  created_at: Date;
}

interface Department {
  status: string;
  message: string;
  data: DepartmentData[];
}

const AdminDepartment = async () => {
  const departments: Department = await getDepartments()

  return (
    <div>
      <AllDepartments departments={departments} />
    </div>
  )
}

export default AdminDepartment
