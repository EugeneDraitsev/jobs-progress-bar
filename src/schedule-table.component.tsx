import { useEffect, useRef, useState } from 'react'

const SCHEDULE = [
  {
    time: '08:00',
    location: 'Brenellvägen 1 - Zone 1',
    action: 'Deploy',
    mower: '01',
  },
  {
    time: '08:15',
    location: 'Brenellvägen 1 - Zone 2',
    action: 'Deploy',
    mower: '02',
  },
  {
    time: '08:30',
    location: 'Brenellvägen 1 - Zone 3',
    action: 'Deploy',
    mower: '03',
  },
  {
    time: '09:45',
    location: 'Brenellvägen 1 - Zone 4',
    action: 'Deploy',
    mower: '04',
  },
  {
    time: '10:15',
    location: 'Drottningsgatan 11 - Zone 1',
    action: 'Deploy',
    mower: '05',
  },
  {
    time: '10:30',
    location: 'Drottningsgatan 11 - Zone 2',
    action: 'Deploy',
    mower: '06',
  },
  {
    time: '10:45',
    location: 'Drottningsgatan 11 - Zone 3',
    action: 'Deploy',
    mower: '07',
  },
  {
    time: '11:30',
    location: 'Brenellvägen 1 - Zone 1',
    action: 'Pickup',
    mower: '01',
  },
  {
    time: '11:45',
    location: 'Brenellvägen 1 - Zone 2',
    action: 'Pickup',
    mower: '02',
  },
  {
    time: '12:00',
    location: 'Brenellvägen 1 - Zone 3',
    action: 'Pickup',
    mower: '03',
  },
  {
    time: '12:15',
    location: 'Brenellvägen 1 - Zone 4',
    action: 'Pickup',
    mower: '04',
  },
  {
    time: '16:15',
    location: 'Drottningsgatan 11 - Zone 1',
    action: 'Pickup',
    mower: '05',
  },
  {
    time: '16:30',
    location: 'Drottningsgatan 11 - Zone 2',
    action: 'Pickup',
    mower: '06',
  },
  {
    time: '16:45',
    location: 'Drottningsgatan 11 - Zone 3',
    action: 'Pickup',
    mower: '07',
  },
]

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const ScheduleTable = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1 minute update
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const currentHour = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()
      const totalCurrentMinutes = currentHour * 60 + currentMinutes

      // find row with the closest time
      const closestRowIndex = SCHEDULE.findIndex((item) => {
        const rowTotalMinutes = timeToMinutes(item.time)
        return rowTotalMinutes > totalCurrentMinutes
      })

      // handle cases whe our current time is before the first row or after the last row
      if (closestRowIndex === -1 || closestRowIndex === 0) {
        // before the first row
        if (totalCurrentMinutes < timeToMinutes(SCHEDULE[0].time)) {
          setIndicatorPosition(0)
          // after the last row
        } else {
          setIndicatorPosition(
            containerRef.current?.getBoundingClientRect().height ?? 0,
          )
        }
        // return to avoid setting the indicator position
        return
      }

      // find the top in px of row in the dom in the table
      const closestRow = Array.from(
        containerRef.current.querySelectorAll('tbody tr'),
      )[closestRowIndex]
      const previousRow = Array.from(
        containerRef.current.querySelectorAll('tbody tr'),
      )[closestRowIndex - 1]

      const closestRowTop = closestRow?.getBoundingClientRect().top
      const previousRowHeight = previousRow?.getBoundingClientRect().height
      const containerTop = containerRef.current.getBoundingClientRect().top

      const timeDiff =
        timeToMinutes(SCHEDULE[closestRowIndex].time) - totalCurrentMinutes
      const previousTimeDiff =
        timeToMinutes(SCHEDULE[closestRowIndex].time) -
        timeToMinutes(SCHEDULE[closestRowIndex - 1].time)

      const position =
        closestRowTop -
        containerTop -
        previousRowHeight * (timeDiff / previousTimeDiff)

      setIndicatorPosition(position)
    }
  }, [currentTime, containerRef])

  return (
    <div ref={containerRef} className="relative">
      <div className="text-center py-2 font-semibold text-sm text-base-content/70">
        <div>Schedule</div>
      </div>

      <div className="overflow-x-auto">
        <table className="table border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-200">Time</th>
              <th className="p-2 border border-gray-200">Location</th>
              <th className="p-2 border border-gray-200">Action</th>
              <th className="p-2 border border-gray-200">Mower</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-200">{item.time}</td>
                <td className="p-2 border border-gray-200">{item.location}</td>
                <td
                  className={`p-2 border border-gray-200 ${item.action === 'Deploy' ? 'bg-orange-100' : 'bg-blue-100'}`}
                >
                  {item.action}
                </td>
                <td className="p-2 border border-gray-200">{item.mower}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Time Indicator */}
      {Boolean(indicatorPosition) && (
        <div
          className="absolute -left-1 w-full h-[2px] bg-red-500"
          style={{ top: `${indicatorPosition}px` }}
        >
          <div className="absolute rounded-full h-2 w-2 top-[-3px] left-0 bg-red-500" />
        </div>
      )}
    </div>
  )
}

export default ScheduleTable
