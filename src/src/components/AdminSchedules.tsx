'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction'
import type { EventApi, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import Loader from './Loader'
import toast from 'react-hot-toast'

interface AvailabilityEvent {
  id?: string
  user_id?: number
  title: string
  start: string | Date
  end: string | Date
}

interface AvailabilityCalendarProps {
  consultantId: number
}

const AdminAvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ consultantId }) => {
  const [availableSchedule, setAvailableSchedule] = useState<AvailabilityEvent[]>([])
  const [examineDuration, setExamineDuration] = useState('30') // default duration
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 })

  const calendarRef = useRef<HTMLDivElement>(null)
  const calendarInstanceRef = useRef<Calendar | null>(null)

  // Fetch saved schedule from backend
  const getSchedule = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/saveSchedule?consultantId=${consultantId}`)
      const data = await res.json()
      setAvailableSchedule(data.schedule_days || [])
      setExamineDuration(data.examine_duration || '30')
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch schedule')
    }
    setLoading(false)
  }

  useEffect(() => {
    getSchedule()
  }, [consultantId])

  // Initialize calendar
  useEffect(() => {
    if (!calendarRef.current) return

    const calendarEl = calendarRef.current
    const calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      events: availableSchedule,
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      allDaySlot: false,
      eventResizableFromStart: true,
      headerToolbar: false,
      timeZone: 'Asia/Karachi',
      slotDuration: '00:05:00', // grid every 5 min
      snapDuration: '00:01:00', // snap events every 1 min
      slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      initialDate: new Date(),

      // Add new slot dynamically
      select: (info: DateSelectArg) => {
        const durationInMinutes = parseInt(examineDuration) || 30
        const endDate = new Date(info.start.getTime() + durationInMinutes * 60 * 1000)

        const newEvent = calendar.addEvent({
          title: 'Availability',
          start: info.start,
          end: endDate,
          allDay: false,
          backgroundColor: '#01306f',
          borderColor: '#01306f',
        })
        calendar.unselect()
        if (newEvent) mergeOverlappingEvents(newEvent)
      },

      eventDrop: (info: EventDropArg) => mergeOverlappingEvents(info.event),
      eventResize: (info: EventResizeDoneArg) => mergeOverlappingEvents(info.event),

      eventDidMount: (info) => {
        info.el.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          setSelectedEvent(info.event)
          setContextMenuPosition({ left: e.pageX - 150, top: e.pageY - 50 })
          setShowContextMenu(true)
        })
      },
    })

    // Merge overlapping events automatically
    const mergeOverlappingEvents = (newEvent: EventApi) => {
      const events = calendar.getEvents()
      let mergedStart = newEvent.start as Date
      let mergedEnd = newEvent.end as Date

      events.forEach((event) => {
        if (event.id !== newEvent.id && event.title === 'Availability') {
          if ((newEvent.start as Date) < (event.end as Date) && (newEvent.end as Date) > (event.start as Date)) {
            mergedStart = new Date(Math.min(mergedStart.getTime(), (event.start as Date).getTime()))
            mergedEnd = new Date(Math.max(mergedEnd.getTime(), (event.end as Date).getTime()))
            event.remove()
          }
        }
      })

      newEvent.remove()
      calendar.addEvent({
        id: Math.random().toString(36).substr(2, 9),
        title: 'Availability',
        start: mergedStart,
        end: mergedEnd,
        allDay: false,
        backgroundColor: '#01306f',
        borderColor: '#01306f',
      })
    }

    calendar.render()
    calendarInstanceRef.current = calendar

    return () => calendar.destroy()
  }, [availableSchedule, examineDuration])

  // Hide context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => setShowContextMenu(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Delete selected event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.remove()
      setSelectedEvent(null)
      setShowContextMenu(false)
    }
  }

  // Save events to backend
  const handleSaveEvents = async () => {
    if (!calendarInstanceRef.current) return
    const events = calendarInstanceRef.current.getEvents().map((event) => ({
      title: event.title,
      start: event.start,
      end: event.end,
      user_id: consultantId,
    }))

    try {
      const res = await fetch('/api/saveSchedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId,
          examine_duration: examineDuration,
          schedule_days: events,
        }),
      })
      if (!res.ok) throw new Error('Failed to save schedule')
      toast.success('Availability saved successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Error saving availability')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="position-relative w-100 h-100">
      <div className="mb-2 w-100 d-flex justify-content-start align-items-baseline gap-4">
        <div className="w-25">
          <input
            type="number"
            value={examineDuration}
            onChange={(e) => setExamineDuration(e.target.value)}
            className="form-control"
            placeholder="Examine Duration (min)"
            min={5}
            step={5}
          />
        </div>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleSaveEvents}>
            Save Availability
          </button>
        </div>
      </div>

      <div ref={calendarRef} id="calendar" className="w-100 h-100"></div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="position-absolute p-2 rounded z-3 bg-white shadow"
          style={{ left: `${contextMenuPosition.left}px`, top: `${contextMenuPosition.top}px` }}
        >
          <button className="btn btn-danger btn-sm" onClick={handleDeleteEvent}>
            Delete Event
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminAvailabilityCalendar
