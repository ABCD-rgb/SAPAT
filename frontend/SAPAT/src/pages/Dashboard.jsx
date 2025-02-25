import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { RiFileList2Line, RiLeafLine } from 'react-icons/ri'
import StatCard from '../components/StatCard'
import useAuth from '../hook/useAuth'
import { Navigate } from 'react-router-dom'

ChartJS.register(ArcElement, Tooltip, Legend)

function Dashboard() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" />
  }

  const pieData = {
    labels: ['Starter', 'Grower', 'Finisher', 'Layer'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-deepbrown mb-6 text-2xl font-bold">Welcome, {user.displayName}!</h1>
      <button onClick={logout}>Logout</button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={RiFileList2Line}
          value="15"
          label="Active Formulations"
        />
        <StatCard icon={RiLeafLine} value="12" label="Ingredients" />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-deepbrown mb-4 text-lg font-semibold">
            Feed Classifications
          </h2>
          <div className="h-[200px] w-full">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-deepbrown mb-4 text-lg font-semibold">
          Recently Viewed
        </h2>
        <div className="text-darkbrown flex h-[300px] items-center justify-center">
          No recent items
        </div>
      </div>
    </div>
  )
}

export default Dashboard
