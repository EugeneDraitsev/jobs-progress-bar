import JobsTr from './jobs-tr.component.tsx'
import ScheduleTable from './schedule-table.component.tsx'

const JOBS = [
  { location: 'Brinellvägen 1 - Zone 1', mower: '01' },
  { location: 'Brinellvägen 1 - Zone 2', mower: '02' },
  { location: 'Brinellvägen 1 - Zone 3', mower: '03' },
  { location: 'Brinellvägen 1 - Zone 4', mower: '04' },
  { location: 'Drottningsgatan 11 - Zone 1', mower: '05' },
  { location: 'Drottningsgatan 11 - Zone 2', mower: '06' },
  { location: 'Drottningsgatan 11 - Zone 3', mower: '07' },
]

function App() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 max-w-[1200px] mx-auto">
      <div className="bg-white">
        <ScheduleTable />
      </div>

      <div className="bg-white">
        <div className="text-center py-2 font-semibold text-sm text-base-content/70">
          <div>Jobs</div>
        </div>
        <div className="overflow-x-auto bg-white">
          <table className="table border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-200">Location</th>
                <th className="p-2 border border-gray-200">Mower</th>
                <th className="p-2 border border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {JOBS.map((job, i) => (
                <JobsTr job={job} key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
