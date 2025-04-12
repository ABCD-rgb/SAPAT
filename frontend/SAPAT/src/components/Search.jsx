import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'
import { RiSearchLine } from 'react-icons/ri'
import axios from 'axios'

export default function Search({ userId, handleSearchQuery, use, page=1, limit=10 }) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    handleSearch(searchQuery, page)
  }, [page])

  const handleSearch = useCallback(
    debounce(async (query, page=1) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/${use}/filtered/search/${userId}?searchQuery=${query}&skip=${(page - 1) * limit}&limit=${limit}`
        )
        const fetchedData = res.data
        handleSearchQuery(fetchedData)
      } catch (err) {
        console.log(err)
      }
    }, 500),
    []
  )

  const handleChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  return (
    <div className="relative w-[240px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
        <RiSearchLine className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
        className="rounded-lg border border-gray-300 py-1 pl-8 text-sm transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none md:py-2 md:text-base"
      />
      {/*<button className="text-darkbrown hover:border-deepbrown flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-sm whitespace-nowrap transition-colors hover:bg-gray-50 active:bg-gray-100 md:gap-2 md:px-4 md:py-2 md:text-base">*/}
      {/*  <RiFilterLine className="h-4 w-4 md:h-5 md:w-5" />*/}
      {/*  <span>Filter</span>*/}
      {/*</button>*/}
    </div>
  )
}
