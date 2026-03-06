import { getConsultants } from '@/app/lib/getConsultants'
import DeleteConsultant from '@/components/DeleteConsultant'
import Link from 'next/link'
import React from 'react'
import { FaCalendarDays } from 'react-icons/fa6'
import { FiEdit, FiTrash } from 'react-icons/fi'

interface Consultants {
  status: string
  message: string
  data: [
    {
      id: number
      name: string
      email: string
      office_extension: string
      photo: string
      department_id: number
      created_at: string
      departments: [
        {
          id: number
          title: string
          description: string
          image: string
          created_at: string
        }
      ]
    }
  ]
}

const ConsultantsPage = async () => {
  const consultants: Consultants = await getConsultants()

  return (
    <div>
      <div className="container">
        <div className="m-5">
          <div className="d-flex justify-content-between">
            <div>
              <h4>Consultants</h4>
            </div>
            <div>
              <button style={{ width: '200px' }}>
                <Link
                  href="/admin/consultants/create"
                  type="button"
                  className="btn btn--secondary btn-line btn-line-before btn--block"
                >
                  Add consultant
                </Link>
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sr.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Department</th>
                <th scope="col">Schedule</th>
                <th scope="col">Office Extention</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {consultants?.data.length
                ? consultants.data.map((consultant, index) => (
                    <tr key={consultant.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{consultant.name}</td>
                      <td>{consultant.email}</td>
                      <td>{consultant.departments?.map((d) => d.title)}</td>
                      <td>
                        <Link
                          href={`/admin/consultants/schedule/${consultant.id}`}
                        >
                          <FaCalendarDays />
                        </Link>
                      </td>
                      <td>{consultant.office_extension}</td>

                      <td>
                        <Link
                          className="me-4"
                          href={`/admin/consultants/edit/${consultant.id}`}
                        >
                          <FiEdit />
                        </Link>
                        <DeleteConsultant id={consultant.id} />
                      </td>
                    </tr>
                  ))
                : 'no more data'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ConsultantsPage
