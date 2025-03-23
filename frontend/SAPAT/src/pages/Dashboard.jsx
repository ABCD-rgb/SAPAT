import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { RiFileList2Line, RiLeafLine } from 'react-icons/ri'
import StatCard from '../components/StatCard'
import useAuth from '../hook/useAuth'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'
import {useState, useEffect} from "react";
import axios from 'axios';


ChartJS.register(ArcElement, Tooltip, Legend)

function Dashboard() {
  const { user, loading } = useAuth()

  const [formulationCount, setFormulationCount] = useState(0)
  const [ingredientCount, setIngredientCount] = useState(0)
  const [formulationTypeCount, setFormulationTypeCount] = useState([0,0,0])

  const pieData = {
    labels: ['Swine', 'Pig', 'Poultry'],
    datasets: [
      {
        data: `${formulationTypeCount}`,
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

  useEffect(() => {
    fetchFormulationData();
    fetchIngredientData();
  }, []);

  const fetchFormulationData = async () => {
    try {
      const formulationRes = await axios.get(`${import.meta.env.VITE_API_URL}/formulation/filtered/${user._id}`);
      const formulations = formulationRes.data.formulations;
      setFormulationCount(formulations.length)
      // count formulation types
      const swine =  formulations.filter(item => item.animal_group === 'Swine')
      const pig =  formulations.filter(item => item.animal_group === 'Pig')
      const poultry =  formulations.filter(item => item.animal_group === 'Poultry')
      const typeCount = [swine.length, pig.length, poultry.length]
      console.log("typeCount", typeCount)
      setFormulationTypeCount(typeCount)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchIngredientData = async () => {
    try {
      const ingredientRes = await axios.get(`${import.meta.env.VITE_API_URL}/ingredient/filtered/${user._id}`);
      const ingredients = ingredientRes.data.ingredients;
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
      <h1 className="text-deepbrown mb-6 text-2xl font-bold">Welcome, {user.displayName}!</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={RiFileList2Line}
          value={formulationCount}
          label="Active Formulations"
        />
        <StatCard icon={RiLeafLine} value={ingredientCount} label="Ingredients" />
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
