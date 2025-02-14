import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { RiFileList2Line, RiLeafLine } from 'react-icons/ri'

ChartJS.register(ArcElement, Tooltip, Legend)

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center md:items-start">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-deepbrown" />
        <span className="text-2xl font-bold text-deepbrown">{value}</span>
      </div>
      <span className="text-darkbrown mt-1">{label}</span>
    </div>
  )
}

function Dashboard() {
  const pieData = {
    labels: ['Starter', 'Grower', 'Finisher', 'Layer'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        borderWidth: 0,
      },
    ],
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-deepbrown mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={RiFileList2Line}
          value="15"
          label="Active Formulations"
        />
        <StatCard 
          icon={RiLeafLine}
          value="12"
          label="Ingredients"
        />
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-deepbrown mb-4">Feed Classifications</h2>
          <div className="h-[200px] w-full">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-deepbrown mb-4">Recently Viewed</h2>
        <div className="h-[300px] flex items-center justify-center text-darkbrown">
          No recent items
        </div>
      </div>
    </div>
  )
}

export default Dashboard
