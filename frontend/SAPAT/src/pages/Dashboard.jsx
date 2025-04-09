import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { RiFileList2Line, RiLeafLine } from 'react-icons/ri'
import StatCard from '../components/StatCard'
import useAuth from '../hook/useAuth'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend)

function Dashboard() {
  const { user, loading } = useAuth()

  const [formulationCount, setFormulationCount] = useState(0)
  const [ingredientCount, setIngredientCount] = useState(0)
  const [formulationTypeCount, setFormulationTypeCount] = useState([0, 0, 0])
  const [recentFormulations, setRecentFormulations] = useState([])

  const pieData = useMemo(() => ({
    labels: ['Swine', 'Pig', 'Poultry'],
    datasets: [
      {
        data: formulationTypeCount,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 0,
      },
    ],
  }), [formulationTypeCount]);

  const pieOptions = useMemo(() => ({
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
  }), []);

  useEffect(() => {
    if (user) {
      fetchFormulationData()
      fetchIngredientData()
    }
  }, [user])

  const fetchFormulationData = async () => {
    try {
      const formulationRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/formulation/filtered/${user._id}`
      )
      const formulations = formulationRes.data.formulations
      setFormulationCount(formulations.length)
      // count formulation types
      const swine = formulations.filter((item) => item.animal_group === 'Swine')
      const pig = formulations.filter((item) => item.animal_group === 'Pig')
      const poultry = formulations.filter(
        (item) => item.animal_group === 'Poultry'
      )
      const typeCount = [swine.length, pig.length, poultry.length]
      setFormulationTypeCount(typeCount)
      // recent formulations
      const recent = formulations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
      setRecentFormulations(recent)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchIngredientData = async () => {
    try {
      const ingredientRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/ingredient/filtered/${user._id}`
      )
      const ingredients = ingredientRes.data.ingredients
      setIngredientCount(ingredients.length)
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-deepbrown mb-6 text-2xl font-bold">
        Welcome, {user.displayName}!
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={RiFileList2Line}
          value={formulationCount}
          label="Active Formulations"
        />
        <StatCard
          icon={RiLeafLine}
          value={ingredientCount}
          label="Ingredients"
        />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-deepbrown mb-4 text-lg font-semibold">
            Feed Classifications
          </h2>
          <div className="h-[200px] w-full">
            { (formulationTypeCount[0] !== 0 || formulationTypeCount[1] !== 0 || formulationTypeCount[2] !== 0 )
              ? <Pie data={pieData} options={pieOptions} />
              :
              <div className="flex items-center justify-center h-full w-full rounded-md">
                <p className="text-gray-500 text-lg text-center p-4">
                  No data to display yet.
                  <br/>
                  <span className="text-sm italic">Create/Classify a formulation to see results.</span>
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-deepbrown mb-4 text-lg font-semibold">
          Recently Created Formulations
        </h2>
        <div className="w-full">
          {recentFormulations.length > 0 ? (
            <div className="space-y-3">
              {recentFormulations.map((f) => (
                <div
                  key={f._id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-4 md:min-w-[200px]">
                      <span className="hidden md:block font-mono md:min-w-[60px] text-right pr-2 text-gray-500">
                        {f.code || '-'}
                      </span>
                      <span className="hidden md:block font-mono text-right pr-2 text-gray-500">
                        |
                      </span>
                      <span className="font-medium text-deepbrown">
                        {f.name}
                      </span>
                    </div>
                    {/*<span className="badge badge-sm badge-outline badge-neutral text-gray-500">*/}
                    {/*  {f.animal_group || '-'}*/}
                    {/*</span>*/}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No recent formulations
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
