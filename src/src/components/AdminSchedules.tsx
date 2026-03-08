'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventApi, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import { EventResizeDoneArg } from '@fullcalendar/interaction'

import '@fullcalendar/core/index.css'
import '@fullcalendar/timegrid/index.css'

import { getAdminConsultantSchedule } from '@/app/lib/getSchedules'
import Loader from './Loader'

interface AvailabilityEvent {
  id?: string
  title?: string
  start: string | Date
  end: string | Date | null
}

interface AvailabilityCalendarProps {
  consultantId: number
  onUpdateAvailability?: (
    events: AvailabilityEvent[],
    examineDuration: string
  ) => void
}

const AdminAvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  consultantId,
  onUpdateAvailability,
}) => {

  const calendarRef = useRef<HTMLDivElement>(null)
  const calendarInstanceRef = useRef<Calendar | null>(null)

  const [availableSchedule, setAvailableSchedule] = useState<AvailabilityEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 })
  const [examineDuration, setExamineDuration] = useState('30')
  const [loading, setLoading] = useState(false)

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60).toString().padStart(2, '0')
    const mins = (minutes % 60).toString().padStart(2, '0')
    return `00:${mins}:00` // FullCalendar expects "HH:MM:SS" format
  }

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getAdminConsultantSchedule(consultantId)

      const events =
        res.schedule_days?.map((item: any) => ({
          id: crypto.randomUUID(),
          title: 'Availability',
          start: item.start,
          end: item.end,
          backgroundColor: '#01306f',
          borderColor: '#01306f',
        })) || []

      setAvailableSchedule(events)
      setExamineDuration(res.examine_duration?.toString() ?? '30')
    } catch (error) {
      console.error('Schedule fetch error:', error)
      setAvailableSchedule([])
    } finally {
      setLoading(false)
    }
  }

  // Load schedule on consultant change
  useEffect(() => { getSchedule() }, [consultantId])

  // Initialize calendar after component mounts
  useEffect(() => {
    if (!calendarRef.current) return
    const calendar = new Calendar(calendarRef.current, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      allDaySlot: false,
      height: 650,
      headerToolbar: false,
      timeZone: 'Asia/Karachi',
      slotDuration: formatDuration(Number(examineDuration) || 30),

      select: (info: DateSelectArg) => {
        const newEvent = calendar.addEvent({
          id: crypto.randomUUID(),
          title: 'Availability',
          start: info.start,
          end: info.end,
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
          setContextMenuPosition({ left: e.pageX - 200, top: e.pageY - 100 })
          setShowContextMenu(true)
        })
      },
    })

    const mergeOverlappingEvents = (newEvent: EventApi) => {
      const events = calendar.getEvents()
      let mergedStart = newEvent.start!
      let mergedEnd = newEvent.end!

      events.forEach((event) => {
        if (event.id !== newEvent.id && event.title === 'Availability') {
          if (newEvent.start! < event.end! && newEvent.end! > event.start!) {
            mergedStart = new Date(Math.min(mergedStart.getTime(), event.start!.getTime()))
            mergedEnd = new Date(Math.max(mergedEnd.getTime(), event.end!.getTime()))
            event.remove()
          }
        }
      })

      newEvent.remove()

      calendar.addEvent({
        id: crypto.randomUUID(),
        title: 'Availability',
        start: mergedStart,
        end: mergedEnd,
        backgroundColor: '#01306f',
        borderColor: '#01306f',
      })
    }

    calendarInstanceRef.current = calendar
    calendar.render()

    return () => calendar.destroy()
  }, [])

  // Update calendar events whenever schedule or duration changes
  useEffect(() => {
    if (!calendarInstanceRef.current) return
    const calendar = calendarInstanceRef.current
    calendar.removeAllEvents()
    availableSchedule.forEach((event) => calendar.addEvent(event))
  }, [availableSchedule])

  useEffect(() => {
    const handleClick = () => setShowContextMenu(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleDeleteEvent = () => {
    selectedEvent?.remove()
    setSelectedEvent(null)
    setShowContextMenu(false)
  }

  const handleSaveEvents = async () => {
    if (!calendarInstanceRef.current) return
    const events = calendarInstanceRef.current.getEvents().map((event) => ({
      title: event.title,
      start: event.start,
      end: event.end,
    }))
    if (onUpdateAvailability) {
      await onUpdateAvailability(events as AvailabilityEvent[], examineDuration)
    }
    getSchedule()
  }

  if (loading) return <Loader />

  return (
    <div className="position-relative w-100">
      <h3 className="mb-3">Set Your Availability</h3>

      <div className="mb-3 d-flex gap-3">
        <input
          type="number"
          value={examineDuration}
          onChange={(e) => setExamineDuration(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <button className="btn btn-primary" onClick={handleSaveEvents}>
          Save Availability
        </button>
      </div>

      <div ref={calendarRef} style={{ width: '100%', height: '650px' }} />

      {showContextMenu && (
        <div
          className="position-absolute bg-white p-2 shadow rounded"
          style={{ left: contextMenuPosition.left, top: contextMenuPosition.top, zIndex: 1000 }}
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
