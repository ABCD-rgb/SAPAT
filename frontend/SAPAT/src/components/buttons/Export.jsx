import { RiFileDownloadLine } from 'react-icons/ri'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { useState } from 'react'

function Export({ ingredients, onExport }) {
  const [nutrientNames, setNutrientNames] = useState([])

  // for export function
  const fetchNutrients = async () => {
    try {
      const nutrientsFromDB = await Promise.all(
        ingredients[0].nutrients.map(async (nutrient) => {
          const nutrientId = nutrient.nutrient
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/nutrient/${nutrient.nutrient}/${nutrientId}`
          )
          const fetchedData = res.data.nutrients
          return {
            [nutrientId]: fetchedData.name,
          }
        })
      )
      // merge all objects to a single one
      const mergedNutrients = Object.assign({}, ...nutrientsFromDB)
      setNutrientNames(mergedNutrients)
    } catch (err) {
      console.log(err)
    }
  }

  const transformIngredientsData = async (ingredients) => {
    // get nutrient names
    await fetchNutrients()

    // Transform the data to have ingredients as rows and nutrients as columns
    return ingredients.map((ingredient) => {
      const result = {
        Name: ingredient.name,
        Price: parseFloat(ingredient.price), // Convert string to number
        Available: ingredient.available ? 'Yes' : 'No',
      }
      // Add all nutrients as separate columns
      ingredient.nutrients.forEach((nutrient) => {
        const nutrientId = nutrient.nutrient
        const nutrientName = nutrientNames[nutrientId] || nutrientId
        result[nutrientName] = nutrient.value
      })

      return result
    })
  }

  const exportToExcel = async () => {
    try {
      const transformedData = await transformIngredientsData(ingredients)
      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      // Convert JSON to worksheet
      const worksheet = XLSX.utils.json_to_sheet(transformedData)
      // Set column widths
      const colWidths = [
        { wch: 30 }, // Name
        { wch: 8 }, // Price
        { wch: 10 }, // Available
      ]
      const nutrientColumns = Object.keys(nutrientNames).length
      for (let i = 0; i < nutrientColumns; i++) {
        colWidths.push({ wch: 15 }) // Default width for nutrient columns
      }
      // Apply column widths
      worksheet['!cols'] = colWidths
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ingredients')
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, 'SAPAT_ingredient_data.xlsx')

      onExport('Ingredients exported!', 'success')
    } catch (err) {
      console.log(err)
      onExport('Failed to export ingredients.', 'error')
    }
  }

  return (
    <button
      onClick={exportToExcel}
      className="border-deepbrown text-deepbrown hover:bg-deepbrown active:bg-deepbrown/80 flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-colors hover:text-white md:gap-2 md:px-4 md:py-2 md:text-base"
    >
      <RiFileDownloadLine className="h-4 w-4 md:h-5 md:w-5" />
      <span>Export</span>
    </button>
  )
}

export default Export
