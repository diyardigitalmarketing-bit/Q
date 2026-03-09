'use client'

import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { MakeAppointmentAction } from '@/app/_actions/_actions'

// Define TypeScript type for your form
interface AppointmentForm {
  mr_no: string
  patient_name: string
  mobile_no: string
  appointment_dateTime: string
  department_id: string
  consultant_id: string
  message: string
  patient_category: string
}

const MakeAppointment: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentForm>({
    mr_no: '',
    patient_name: '',
    mobile_no: '',
    appointment_dateTime: '',
    department_id: '',
    consultant_id: '',
    message: '',
    patient_category: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await MakeAppointmentAction(formData)
      if (response.status === 'success') {
        toast.success('Appointment booked successfully!')
        setFormData({
          mr_no: '',
          patient_name: '',
          mobile_no: '',
          appointment_dateTime: '',
          department_id: '',
          consultant_id: '',
          message: '',
          patient_category: '',
        })
      } else {
        toast.error(response.message || 'Something went wrong')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  return (
    <div className="container">
      <h4 className="my-3">Book an Appointment</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>MR No:</label>
          <input
            type="text"
            name="mr_no"
            value={formData.mr_no}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Patient Name:</label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Appointment Date & Time:</label>
          <input
            type="datetime-local"
            name="appointment_dateTime"
            value={formData.appointment_dateTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Department:</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Department</option>
            {/* Add dynamic departments here */}
          </select>
        </div>

        <div className="mb-3">
          <label>Consultant:</label>
          <select
            name="consultant_id"
            value={formData.consultant_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Consultant</option>
            {/* Add dynamic consultants here */}
          </select>
        </div>

        <div className="mb-3">
          <label>Patient Category:</label>
          <select
            name="patient_category"
            value={formData.patient_category}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="vip">VIP</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Book Appointment
        </button>
      </form>
    </div>
  )
}

export default MakeAppointment
