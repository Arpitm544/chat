import axios from "../lib/axios"
import React, { useState } from "react"
import { Search as SearchIcon } from "lucide-react"

const Search = ({ onSelectUser }) => {
  const [search, setSearch] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])

  const handleSearch = async (e) => {
    const val = e.target.value
    setSearch(val)

    if (!val.trim()) {
      setFilteredUsers([])
      return
    }

    try {
      const res = await axios.get(
        `/user/search?name=${val}`
      )

      setFilteredUsers(res.data.users)
    } catch (err) {
      console.log("Search Error:", err)
    }
  }

  const handleSelect = (userId) => {
    onSelectUser(userId)
    setSearch("")
    setFilteredUsers([])
  }

  return (
    <div className="search-control">
      <SearchIcon size={21} aria-hidden="true" />
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search conversations"
        aria-label="Search users"
      />

      {filteredUsers.length > 0 && (
        <ul className="search-results">
          {filteredUsers.map((u) => (
            <li
              key={u._id}
            >
              <button onClick={() => handleSelect(u._id)}>{u.name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search
