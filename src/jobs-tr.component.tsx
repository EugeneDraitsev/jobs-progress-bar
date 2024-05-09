import { useState, type CSSProperties, useRef } from 'react'

import {
  ExclamationCircleIcon,
  ChatBubbleLeftIcon,
  PlayIcon,
  XMarkIcon,
  PauseIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'

interface JobsTrComponentProps {
  job: {
    location: string
    mower: string
  }
}

type JobStatus = 'pending' | 'paused' | 'in-progress' | 'completed' | 'error'

const DURATION = 5_000 // 5 seconds

const JobsTr = ({ job }: JobsTrComponentProps) => {
  const [status, setStatus] = useState<JobStatus>('pending')
  const [isExpanded, setIsExpanded] = useState(false)
  const [progress, setProgress] = useState(0)

  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  // Function to increment progress over time
  const incrementProgress = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }

    // Calculate elapsed time, including previously elapsed time when paused
    const elapsedTime = elapsedRef.current + (timestamp - startTimeRef.current)
    // Calculate percentage based on elapsed time and desired duration
    const percentage = Math.min((elapsedTime / DURATION) * 100, 100)

    // Update progress state
    setProgress(percentage)

    // Continue animation if progress is not complete and not paused
    if (percentage < 100) {
      animationRef.current = requestAnimationFrame(incrementProgress)
    } else {
      cancelAnimationFrame(animationRef.current!)
    }
  }

  // start or unpause
  const startProgress = () => {
    startTimeRef.current = null
    animationRef.current = requestAnimationFrame(incrementProgress)
  }

  const pauseProgress = () => {
    setStatus('paused')
    elapsedRef.current =
      elapsedRef.current + (performance.now() - startTimeRef.current!)
    cancelAnimationFrame(animationRef.current!)
  }

  const resetProgress = () => {
    setStatus('pending')
    setProgress(0)
    elapsedRef.current = 0
    startTimeRef.current = null
    cancelAnimationFrame(animationRef.current!)
  }

  const progressBgStyles = {
    '--progress-color': `color-mix(in srgb, #85fe82 ${progress}%, #eeff81)`,
    background: `linear-gradient(to right, var(--progress-color) ${progress}%, #ffffff ${progress}%)`,
  } as CSSProperties

  return (
    <>
      <tr style={progressBgStyles}>
        <td className="p-2 border border-gray-200">{job.location}</td>
        <td className="p-2 border border-gray-200">{job.mower}</td>
        <td className="p-2 border border-gray-200">
          <div className="flex gap-2">
            {status === 'pending' && (
              <button
                className="btn min-h-min h-auto p-1 btn-success text-white"
                onClick={() => {
                  setStatus('in-progress')
                  startProgress()
                }}
              >
                <PlayIcon className="size-5 " />
              </button>
            )}
            {status === 'in-progress' && (
              <button
                className="btn min-h-min h-auto p-1 btn-warning text-white"
                onClick={() => pauseProgress()}
              >
                <PauseIcon className="size-5 " />
              </button>
            )}
            {status === 'paused' && (
              <button
                className="btn min-h-min h-auto p-1 btn-error text-white"
                onClick={resetProgress}
              >
                <XMarkIcon className="size-5 " />
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`btn min-h-min h-auto p-1 ${isExpanded ? 'text-blue-400 bg-white hover:bg-blue-100' : 'text-white bg-blue-300 hover:bg-blue-400'}`}
            >
              <ListBulletIcon className="size-5" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr style={progressBgStyles}>
          <td colSpan={2}>
            <div className="flex justify-between">
              <div>Estimated Duration: 8h 30min</div>
              <div></div>
            </div>
          </td>
          <td className="p-2 border border-l-transparent border-gray-200">
            <div className="flex gap-2">
              <button className="btn min-h-min h-auto p-1 bg-yellow-400 hover:bg-yellow-500 text-white">
                <ChatBubbleLeftIcon className="size-5" />
              </button>
              <button className="btn min-h-min h-auto p-1 bg-red-400 hover:bg-red-500 text-white">
                <ExclamationCircleIcon className="size-5" />
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default JobsTr
