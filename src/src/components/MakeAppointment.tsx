'use client'
import { MakePublicAppointmentAction } from '@/app/_actions/_actions'
import {
  getConsultantsByDepartmentId,
  getPublicConsultants,
} from '@/app/lib/getConsultants'
import {
  MakeAppointmentSchema,
  makeAppointmentSchema,
} from '@/app/utils/ValidationSchema'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import DateTimePicker from 'react-datetime-picker'
import { getDepartments } from '@/app/lib/getDepartments'
import Loader from './Loader'
import { formatDateTime } from '@/app/utils/helper'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import {
  getPublicConsultantSchedules,
  getSlotsByDate,
} from '@/app/lib/getSchedules'

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

const MakeAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableWeekDays, setAvailableWeekDays] = useState([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [allowedDays, setAllowedDays] = useState<number[]>([])
  const [allowedTimes, setAllowedTimes] = useState<string[]>([])
  const [examineDuration, setExamineDuration] = useState<number>()
  const [formatedDate, setFormatedDate] = useState<string>('')
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
    department_id: '',
    consultant_id: '',
    message: '',
  })

  const [errors, setErrors] = useState<{
    [key in keyof MakeAppointmentSchema]?: string
  }>({})

  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [consultants, setConsultants] = useState<Consultant[]>([])

  const getAllDepartments = async () => {
    setLoading(true)
    const res = await getDepartments()
    setDepartments(res.data)
    setLoading(false)
  }

  const getConsultants = async () => {
    if (!myForm.department_id) return
    setLoading(true)
    const res = await getConsultantsByDepartmentId(+myForm.department_id)
    setConsultants(res.data)
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target
    setMyForm({
      ...myForm,
      [name]: value,
    })
    if (errors[name as keyof MakeAppointmentSchema]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const getDaysOfWork = async (consultantId: number) => {
    if (!consultantId) return
    setLoading(true)
    // const res = await getConsultantSchedules(consultantId)
    const res = await getPublicConsultantSchedules(consultantId)
    setAvailableWeekDays(res?.data?.days_at_work)
    setExamineDuration(res?.data?.examine_duration)

    setAllowedDays(
      res?.data?.days_at_work?.map(
        (day: keyof typeof dayNameToNumber) => dayNameToNumber[day]
      )
    )
    setLoading(false)
  }

  const filterDate = (date: Date) => {
    return Array.isArray(allowedDays) && allowedDays.length > 0
      ? allowedDays.includes(date.getDay())
      : false
  }

  const getTimeSlots = async (date: string) => {
    if (!myForm.consultant_id) return
    setLoading(true)
    const res = await getSlotsByDate(+myForm.consultant_id, date)
    setAvailableTimeSlots(res.data)
    setLoading(false)
  }

  const handleDateChange = (date: Date | null) => {
    const dateStr = date
    const dateObj = new Date(dateStr!)
    const year = dateObj.getFullYear()
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
    const day = ('0' + dateObj.getDate()).slice(-2)
    const formattedDate = `${year}-${month}-${day}`
    setFormatedDate(formattedDate)
    setSelectedDate(date)
    getTimeSlots(formattedDate)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const filterTime = (time: Date) => {
    const formattedTime = formatTime(time)
    return availableTimeSlots.includes(formattedTime)
  }

  const handleTimeChange = (date: Date | null) => {
    const selectedStr = date
    const selectedObj = new Date(selectedStr!)
    const hours = selectedObj.getHours().toString().padStart(2, '0')
    const minutes = selectedObj.getMinutes().toString().padStart(2, '0')
    const seconds = selectedObj.getSeconds().toString().padStart(2, '0')
    const formatedTime = `${hours}:${minutes}:${seconds}`
    setSelectedTimeSlot(date)
    const concatedDateTime = `${formatedDate} ${formatedTime}`
    setMyForm({
      ...myForm,
      appointment_dateTime: concatedDateTime,
    })
  }

  useEffect(() => {
    if (selectedDate && myForm.consultant_id) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      getSlotsByDate(+myForm.consultant_id, dateStr)
        .then((res) => setAvailableTimeSlots(res.data))
        .finally(() => setLoading(false))
    }
  }, [selectedDate, myForm.consultant_id])

  const timesForPicker = useMemo(() => {
    if (!selectedDate) return []
    const slots = Array.isArray(availableTimeSlots) ? availableTimeSlots : []

    return slots.map((t) => {
      const [hhmm, mod] = t.split(' ')
      let [h, m] = hhmm.split(':').map(Number)

      if (mod === 'PM' && h < 12) h += 12
      if (mod === 'AM' && h === 12) h = 0

      const dt = new Date(selectedDate)
      dt.setHours(h)
      dt.setMinutes(m)
      dt.setSeconds(0)
      dt.setMilliseconds(0)

      return dt
    })
  }, [availableTimeSlots, selectedDate])

  useEffect(() => {
    getAllDepartments()
  }, [])

  useEffect(() => {
    getConsultants()
  }, [myForm.department_id])

  useEffect(() => {
    getDaysOfWork(+myForm.consultant_id)
  }, [myForm.consultant_id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const result = makeAppointmentSchema.safeParse(myForm)
    if (result.success) {
      const formData = new FormData()
      const formatteddateTime = formatDateTime(result.data.appointment_dateTime)
      formData.append('mr_no', result.data.mr_no)
      formData.append('patient_name', result.data.patient_name)
      formData.append('mobile_no', result.data.mobile_no)
      formData.append('appointment_dateTime', formatteddateTime)
      formData.append('department_id', result.data.department_id)
      formData.append('consultant_id', result.data.consultant_id)
     
      const res = await MakePublicAppointmentAction(formData)
      if (res.status === 'success') {
        setLoading(false)
        toast.success(res.message)
        setMyForm({
          mr_no: '',
          patient_name: '',
          mobile_no: '',
          appointment_dateTime: '',
          department_id: '',
          consultant_id: '',
          message: '',
        })
      } else {
        setLoading(false)
        toast.error(res.message)
      }
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
        <h5 className="card-heading">book an appointment</h5>
        <p className="card-desc">
          Please feel welcome to contact our staff with any general or medical
          enquiry. Our doctors will receive or return any urgent calls.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="select-holder">
                <select
                  className="form-control"
                  name="department_id"
                  value={myForm.department_id || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments?.length > 0 ? (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No departments available
                    </option>
                  )}
                </select>
                {errors.department_id && (
                  <p className="text-danger">{errors.department_id}</p>
                )}
                <div className="badge">department</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="select-holder">
                <select
                  className="form-control"
                  name="consultant_id"
                  value={myForm.consultant_id || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Consultant</option>
                  {consultants && consultants?.length > 0 ? (
                    consultants?.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No consultants available
                    </option>
                  )}
                </select>
                {errors.consultant_id && (
                  <p className="text-danger">{errors.consultant_id}</p>
                )}
                <div className="badge">choose doctor</div>
              </div>
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              <div className="row">
                <div className="col-6 ">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={today}
                    maxDate={maxDate}
                    filterDate={filterDate}
                    placeholderText="Select an available date"
                    dateFormat="yyyy-MM-dd"
                    wrapperClassName="w-100"
                    className="form-control "
                  />
                </div>
                <div className="col-6 ">
                  <select
                    className="form-control"
                    value={
                      selectedTimeSlot
                        ? format(selectedTimeSlot, 'h:mm aa')
                        : ''
                    }
                    onChange={(e) => {
                      const selectedTime = e.target.value
                      const selectedDate = timesForPicker.find(
                        (date) => format(date, 'h:mm aa') === selectedTime
                      )
                      handleTimeChange(selectedDate ?? null)
                    }}
                  >
                    <option value="">Select an available time</option>
                    {availableTimeSlots.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.appointment_dateTime && (
                <p className="text-danger">{errors.appointment_dateTime}</p>
              )}
            </div>

            <div className="col-12 col-md-12 col-lg-6">
              <input
                className="form-control"
                type="text"
                name="mr_no"
                value={myForm.mr_no}
                onChange={handleChange}
                placeholder="MR No"
              />
              {errors.mr_no && <p className="text-danger">{errors.mr_no}</p>}
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              <input
                className="form-control"
                type="text"
                name="patient_name"
                value={myForm.patient_name}
                onChange={handleChange}
                placeholder="Patient Name"
              />
              {errors.patient_name && (
                <p className="text-danger">{errors.patient_name}</p>
              )}
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <input
                className="form-control"
                type="text"
                name="mobile_no"
                value={myForm.mobile_no}
                onChange={handleChange}
                placeholder="Mobile Number"
              />
              {errors.mobile_no && (
                <p className="text-danger">{errors.mobile_no}</p>
              )}
            </div>

           

            <div className="col-12">
              <button
                type="submit"
                className="btn btn--secondary btn-line btn-line-before btn--block"
                style={{ width: '200px' }}
              >
                <span className="line">
                  {' '}
                  <span> </span>
                </span>
                <span>make appointment</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MakeAppointment
