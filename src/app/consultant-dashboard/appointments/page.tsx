'use client'

import { getAppointments } from '@/app/lib/getAppointments'
import DeleteAppointments from '@/components/DeleteAppointments'
import Link from 'next/link'
import React from 'react'
import { FaEdit } from 'react-icons/fa'

interface AppointmentData {
  id: number
  mr_no: number
  patient_name: string
  mobile_no: string
  appointment_datetime: string
  patient_category: string // added patient_category
  consultant: {
    id: number
    name: string
    email: string
  }
  department: {
    id: number
    title: string
    description: string
  }
  user: {
    id: number
    name: string
    email: string
  }
}

interface Appointment {
  status: string
  message: string
  data: AppointmentData[]
}

const AdminAppointments = async () => {
  const allAppointments: Appointment = await getAppointments()

  return (
    <div className="container">
      <div className="m-5">
        <div className="d-flex justify-content-between">
          <h4>Appointments</h4>
          <Link
            href="/admin/appointments/create"
            className="btn btn--secondary btn-line btn-line-before"
            style={{ width: '200px' }}
          >
            Add Appointment
          </Link>
        </div>

        <table className="table mt-3">
          <thead>
            <tr>
              <th scope="col">Sr.</th>
              <th scope="col">Patient Name</th>
              <th scope="col">Patient Mobile No</th>
              <th scope="col">Appointment Date Time</th>
              <th scope="col">Patient Category</th>
              <th scope="col">Consultant</th>
              <th scope="col">Booked By</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAppointments?.data.length ? (
              allAppointments.data.map((appointment, index) => (
                <tr key={appointment.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.mobile_no}</td>
                  <td>{appointment.appointment_datetime}</td>
                  <td>{appointment.patient_category}</td>
                  <td>{appointment.consultant.name}</td>
                  <td>{appointment.user.name}</td>
                  <td>
                    <Link
                      href={`/admin/appointments/edit/${appointment.id}`}
                      className="text-primary mx-2"
                    >
                      <FaEdit />
                    </Link>
                    <DeleteAppointments id={appointment.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No appointments booked
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminAppointments