'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

import { MakePublicAppointmentAction } from '@/app/_actions/_actions'
import { getDepartments } from '@/app/lib/getDepartments'
import { getConsultantsByDepartmentId } from '@/app/lib/getConsultants'
import { getPublicConsultantSchedules, getSlotsByDate } from '@/app/lib/getSchedules'
import { MakeAppointmentSchema, makeAppointmentSchema } from '@/app/utils/ValidationSchema'
import Loader from './Loader'
import { formatDateTime } from '@/app/utils/helper'

interface Consultant {
  id: number
  name: string
  email: string
}

interface Department {
  id: number
  title: string
  description: string
}

const BookAppointment = ({
  consultantId,
  departmentId,
}: {
  consultantId: number
  departmentId: number
}) => {
  // State
  const [departments, setDepartments] = useState<Department[]>([])
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [allowedDays, setAllowedDays] = useState<number[]>([])
  const [examineDuration, setExamineDuration] = useState<number>()
  const [formatedDate, setFormatedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const today = new Date()
  const maxDate = new Date()
  maxDate.setMonth(today.getMonth() + 2)

  const dayNameToNumber = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }

  const [myForm, setMyForm] = useState<MakeAppointmentSchema>({
    mr_no: '',
    patient_name: '',
    mobile_no: '',
    appointment_dateTime: '',
    department_id: departmentId?.toString(),
    consultant_id: consultantId?.toString(),
    patient_category: '', // 👈 added
    
  })

  const [errors, setErrors] = useState<{
    [key in keyof MakeAppointmentSchema]?: string
  }>({})

  // Handle form field change
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target
    setMyForm({ ...myForm, [name]: value })
    if (errors[name as keyof MakeAppointmentSchema]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  // Load departments
  const getAllDepartments = async () => {
    setLoading(true)
    const res = await getDepartments()
    setDepartments(res.data)
    setLoading(false)
  }

  // Load consultants by department
  const getConsultants = async () => {
    if (!myForm.department_id) return
    setLoading(true)
    const res = await getConsultantsByDepartmentId(+myForm.department_id)
    setConsultants(res.data)
    setLoading(false)
  }

  // Load consultant schedule
  const getDaysOfWork = async (consultantId: number) => {
    if (!consultantId) return
    setLoading(true)
    const res = await getPublicConsultantSchedules(consultantId)
    setExamineDuration(res.examine_duration)
    setAllowedDays(
      res.days_at_work.map(
        (day: keyof typeof dayNameToNumber) => dayNameToNumber[day]
      )
    )
    setLoading(false)
  }

  const filterDate = (date: Date) => allowedDays.includes(date.getDay())

  // Get available time slots for a date
  const getTimeSlots = async (date: string) => {
    if (!myForm.consultant_id) return
    setLoading(true)
    const res = await getSlotsByDate(+myForm.consultant_id, date)
    setAvailableTimeSlots(res)
    setLoading(false)
  }

  const handleDateChange = (date: Date | null) => {
    if (!date) return
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const formattedDate = `${year}-${month}-${day}`
    setFormatedDate(formattedDate)
    setSelectedDate(date)
    getTimeSlots(formattedDate)
  }

  const handleTimeChange = (date: Date | null) => {
    if (!date) return
    setSelectedTimeSlot(date)
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`
    setMyForm({ ...myForm, appointment_dateTime: `${formatedDate} ${formattedTime}` })
  }

  // Convert available time strings to Date objects for picker
  const timesForPicker = useMemo(() => {
    if (!selectedDate) return []
    return availableTimeSlots.map((t) => {
      const [hhmm, mod] = t.split(' ')
      let [h, m] = hhmm.split(':').map(Number)
      if (mod === 'PM' && h < 12) h += 12
      if (mod === 'AM' && h === 12) h = 0
      const dt = new Date(selectedDate)
      dt.setHours(h, m, 0, 0)
      return dt
    })
  }, [availableTimeSlots, selectedDate])

  useEffect(() => {
    getAllDepartments()
    getConsultants()
  }, [])

  useEffect(() => {
    getDaysOfWork(+myForm.consultant_id)
  }, [myForm.consultant_id])

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const result = makeAppointmentSchema.safeParse(myForm)

    if (result.success) {
      const formData = new FormData()
      formData.append('mr_no', result.data.mr_no)
      formData.append('patient_name', result.data.patient_name)
      formData.append('mobile_no', result.data.mobile_no)
      formData.append('appointment_dateTime', formatDateTime(result.data.appointment_dateTime))
      formData.append('department_id', departmentId?.toString() || '')
      formData.append('consultant_id', consultantId?.toString() || '')
      formData.append('patient_category', result.data.patient_category)

      const res = await MakePublicAppointmentAction(formData)

      if (res.status === 'success') {
        toast.success(res.message)
        setMyForm({
          mr_no: '',
          patient_name: '',
          mobile_no: '',
          appointment_dateTime: '',
          department_id: '',
          consultant_id: '',
          patient_category: '',
         
        })
      } else {
        toast.error(res.message)
      }
      setLoading(false)
    } else {
      setLoading(false)
      const fieldErrors: { [key in keyof MakeAppointmentSchema]?: string } = {}
      result.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof MakeAppointmentSchema
        fieldErrors[fieldName] = error.message
      })
      setErrors(fieldErrors)
    }
  }

  return (
    <div className="contact-card">
      {loading && <Loader />}
      <div className="contact-body">
        <h5 className="card-heading mb-5">Book an appointment</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Department */}
            <div className="col-12 col-md-6">
              <select
                className="form-control"
                name="department_id"
                value={myForm.department_id}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Consultant */}
            <div className="col-12 col-md-6">
              <select
                className="form-control"
                name="consultant_id"
                value={myForm.consultant_id}
                onChange={handleChange}
              >
                <option value="">Select Consultant</option>
                {consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Category */}
            <div className="col-12 col-md-6">
              <select
                className="form-control"
                name="patient_category"
                value={myForm.patient_category}
                onChange={handleChange}
              >
                <option value="">Select Patient Type</option>
                <option value="new_cash">New Patient – Cash</option>
                <option value="new_panel">New Patient – Panel</option>
                <option value="followup_cash">Follow-up Patient – Cash</option>
                <option value="followup_panel">Follow-up Patient – Panel</option>
              </select>
            </div>

            {/* Date */}
            <div className="col-12 col-md-6">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={today}
                maxDate={maxDate}
                filterDate={filterDate}
                className="form-control"
                placeholderText="Select Date"
              />
            </div>

            {/* Time */}
            <div className="col-12 col-md-6">
              <select
                className="form-control"
                value={selectedTimeSlot ? format(selectedTimeSlot, 'h:mm aa') : ''}
                onChange={(e) => {
                  const selectedTime = e.target.value
                  const selectedDateObj = timesForPicker.find(
                    (date) => format(date, 'h:mm aa') === selectedTime
                  )
                  handleTimeChange(selectedDateObj ?? null)
                }}
              >
                <option value="">Select Time</option>
                {availableTimeSlots.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* MR No */}
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                name="mr_no"
                value={myForm.mr_no}
                onChange={handleChange}
                placeholder="MR No"
              />
            </div>

            {/* Patient Name */}
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                name="patient_name"
                value={myForm.patient_name}
                onChange={handleChange}
                placeholder="Patient Name"
              />
            </div>

            {/* Mobile */}
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                name="mobile_no"
                value={myForm.mobile_no}
                onChange={handleChange}
                placeholder="Mobile Number"
              />
            </div>

            {/* Submit */}
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn--secondary" style={{ width: '200px' }}>
                Book Appointment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookAppointment