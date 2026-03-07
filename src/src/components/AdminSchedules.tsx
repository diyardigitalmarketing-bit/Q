'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import type { EventApi, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import { getAdminConsultantSchedule } from '@/app/lib/getSchedules'
import Loader from './Loader'

interface AvailabilityEvent {
  id?: string
  user_id?: number
  examine_duration?: string
  schedule_days?: {
    title: string
    start: string | Date
    end: string | Date | null
  }
}

interface AvailabilityCalendarProps {
  initialAvailability?: AvailabilityEvent[]
  onUpdateAvailability?: (
    events: AvailabilityEvent[],
    examineDuration: string
  ) => void
  consultantId: number
}

const AdminAvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  initialAvailability = [],
  onUpdateAvailability,
  consultantId,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null)
  const calendarInstanceRef = useRef<Calendar | null>(null)

  const [availableSchedule, setAvailableSchedule] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 })
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [examineDuration, setExamineDuration] = useState('30')
  const [loading, setLoading] = useState(false)

  // Convert minutes to HH:mm:ss
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`
  }

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getAdminConsultantSchedule(consultantId)
      if (!res) {
        setAvailableSchedule([])
        setExamineDuration('30')
        return
      }
      setAvailableSchedule(res.schedule_days ?? [])
      setExamineDuration(res.examine_duration ?? '30')
    } catch (error) {
      console.error('Schedule fetch error:', error)
      setAvailableSchedule([])
      setExamineDuration('30')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSchedule()
  }, [consultantId])

  useEffect(() => {
    if (!calendarRef.current) return

    const calendar = new Calendar(calendarRef.current, {
      plugins: [timeGridPlugin, interactionPlugin],
      events: availableSchedule,
      initialView: 'timeGridWeek',
      dayHeaderFormat: { weekday: 'long' },
      editable: true,
      selectable: true,
      droppable: true,
      eventResizableFromStart: true,
      allDaySlot: false,
      headerToolbar: false,
      timeZone: 'Asia/Karachi',
      initialDate: '2023-01-01',

      // ⭐ Dynamic slot duration
      slotDuration: formatDuration(Number(examineDuration) || 30),

      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },

      select: (info: DateSelectArg) => {
        const newEvent = calendar.addEvent({
          id: crypto.randomUUID(),
          title: 'Availability',
          start: info.startStr,
          end: info.endStr,
          backgroundColor: '#01306f',
          borderColor: '#01306f',
        })

        calendar.unselect()
        if (newEvent) mergeOverlappingEvents(newEvent)
      },

      eventDrop: (info: EventDropArg) => {
        const event = info.event
        const eventStart = event.start || new Date()
        const eventEnd = event.end || new Date(eventStart.getTime() + Number(examineDuration) * 60 * 1000)

        if (eventStart.getDate() !== eventEnd.getDate()) {
          event.setEnd(
            new Date(
              eventStart.getFullYear(),
              eventStart.getMonth(),
              eventStart.getDate(),
              23,
              59,
              59
            )
          )
        }

        mergeOverlappingEvents(event)
      },

      eventResize: (info: EventResizeDoneArg) => {
        mergeOverlappingEvents(info.event)
      },

      eventDidMount: (info) => {
        info.el.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          setSelectedEvent(info.event)
          setContextMenuPosition({
            left: e.pageX - 290,
            top: e.pageY - 100,
          })
          setShowContextMenu(true)
        })
      },
    })

    // Merge overlapping events and update state
    const mergeOverlappingEvents = (newEvent: EventApi) => {
      const events = calendar.getEvents()

      let mergedStart = newEvent.start || new Date()
      let mergedEnd = newEvent.end || new Date(mergedStart.getTime() + Number(examineDuration) * 60 * 1000)

      events.forEach((event) => {
        if (event.id !== newEvent.id && event.title === 'Availability') {
          if (
            (newEvent.start as Date) < (event.end as Date) &&
            (newEvent.end as Date) > (event.start as Date)
          ) {
            mergedStart = new Date(Math.min(mergedStart.getTime(), (event.start as Date).getTime()))
            mergedEnd = new Date(Math.max(mergedEnd.getTime(), (event.end as Date).getTime()))
            event.remove()
          }
        }
      })

      newEvent.remove()

      const mergedEvent = calendar.addEvent({
        id: crypto.randomUUID(),
        title: 'Availability',
        start: mergedStart,
        end: mergedEnd,
        backgroundColor: '#01306f',
        borderColor: '#01306f',
      })

      // ✅ Update state so newly added/merged events stay visible
      setAvailableSchedule(calendar.getEvents().map(ev => ({
        title: ev.title,
        start: ev.start,
        end: ev.end,
      })))
    }

    calendar.render()
    calendarInstanceRef.current = calendar

    return () => {
      calendar.destroy()
    }
  }, [availableSchedule, examineDuration])

  useEffect(() => {
    const handleClick = () => setShowContextMenu(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleDeleteEvent = () => {
    if (!selectedEvent) return

    selectedEvent.remove()
    setSelectedEvent(null)
    setShowContextMenu(false)

    // ✅ Update state after delete
    setAvailableSchedule(calendarInstanceRef.current?.getEvents().map(ev => ({
      title: ev.title,
      start: ev.start,
      end: ev.end,
    })) || [])
  }

  const handleSaveEvents = () => {
    if (!calendarInstanceRef.current) return

    const events = calendarInstanceRef.current.getEvents().map((event) => {
      const start = event.start || new Date()
      const end = event.end || new Date(start.getTime() + Number(examineDuration) * 60 * 1000)
      return {
        title: event.title,
        start,
        end,
      }
    })

    if (onUpdateAvailability) {
      onUpdateAvailability(events as AvailabilityEvent[], examineDuration)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="position-relative w-100 h-100">
      <div className="mb-2 w-100 d-flex gap-4 align-items-baseline">
        <div className="w-25">
          <input
            type="number"
            value={examineDuration}
            onChange={(e) => setExamineDuration(e.target.value)}
            className="form-control"
            placeholder="Examine Duration (minutes)"
          />
        </div>

        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleSaveEvents}>
            Save Availability
          </button>
        </div>
      </div>

      <div ref={calendarRef} className="w-100 h-100"></div>

      {showContextMenu && (
        <div
          className="position-absolute p-2 rounded z-3"
          style={{
            left: contextMenuPosition.left,
            top: contextMenuPosition.top,
          }}
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
