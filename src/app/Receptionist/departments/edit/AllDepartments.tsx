'use client'
import { DepartmentDeleteAction } from '@/app/_actions/_actions'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FiEdit, FiTrash } from 'react-icons/fi'

interface DepartmentData {
  id: number
  title: string
  description: string
  image: string
  user_id: number
  created_at: Date
}

interface Department {
  status: string
  message: string
  data: DepartmentData[]
}

const Departments = ({ departments }: { departments: Department }) => {
  const [departmentsArr, setDepartmentsArr] = useState(departments.data)

  const handleDelete = async (id: number) => {
    let res = await DepartmentDeleteAction(id)
    if (res.status === 'success') {
      setDepartmentsArr(
        departmentsArr.filter((department) => department.id !== id)
      )
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="container">
      <div className="m-5">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Departments</h4>
          </div>
          <div>
            <Link
              href="/admin/departments/create"
              style={{ width: '200px' }}
              className="btn btn--secondary btn-line btn-line-before btn--block"
            >
              Add Department
            </Link>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sr.</th>
              <th scope="col">Department</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {departmentsArr.map((department, index) => (
              <tr key={department.id}>
                <th scope="row">{index + 1}</th>
                <td>{department.title}</td>

                <td>
                  <Link
                    className="me-4"
                    href={`/admin/departments/edit/${Number(department.id)}`}
                  >
                    <FiEdit role="button" aria-label="Edit department" />
                  </Link>
                  <FiTrash
                    onClick={() => handleDelete(department.id)}
                    type="button"
                    role="button"
                    aria-label="Delete department"
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Departments
