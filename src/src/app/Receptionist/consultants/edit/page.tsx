import { getAppointments } from '@/app/lib/getAppointments'
import DeleteAppointments from '@/components/DeleteAppointments'
import Link from 'next/link'
import React from 'react'
import { FaEdit } from 'react-icons/fa'

const AdminAppointments = async () => {

  const allAppointments = await getAppointments()

  return (
    <div className="container">
      <div className="m-5">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Appointments</h4>

          <Link
            href="/admin/appointments/create"
            className="btn btn--secondary btn-line btn-line-before"
            style={{ width: '200px' }}
          >
            Add Appointment
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Patient Name</th>
              <th>Mobile No</th>
              <th>Appointment Date & Time</th>
              <th>Patient Category</th>
              <th>Consultant</th>
              <th>Booked By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {allAppointments?.data?.length ? (
              allAppointments.data.map((appointment: any, index: number) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
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
