"use client"

import { useState } from "react"
import { Sliders } from "lucide-react"

const FilterPanel = () => {
  const [filters, setFilters] = useState({
    ageRange: [18, 35],
    budgetRange: [500, 2000],
    location: "",
    gender: "any",
    lifestyle: {
      smoking: "any",
      pets: "any",
      drinking: "any",
    },
    interests: [],
  })

  const interestOptions = ["Reading", "Music", "Gaming", "Coffee", "Fitness", "Photography", "Movies", "Hiking"]

  const handleInterestToggle = (interest) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filter Preferences</h3>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
        </label>
        <div className="flex gap-4">
          <input
            type="range"
            min="18"
            max="50"
            value={filters.ageRange[0]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                ageRange: [Number.parseInt(e.target.value), prev.ageRange[1]],
              }))
            }
            className="flex-1"
          />
          <input
            type="range"
            min="18"
            max="50"
            value={filters.ageRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                ageRange: [prev.ageRange[0], Number.parseInt(e.target.value)],
              }))
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range: ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
        </label>
        <div className="flex gap-4">
          <input
            type="range"
            min="300"
            max="3000"
            step="50"
            value={filters.budgetRange[0]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                budgetRange: [Number.parseInt(e.target.value), prev.budgetRange[1]],
              }))
            }
            className="flex-1"
          />
          <input
            type="range"
            min="300"
            max="3000"
            step="50"
            value={filters.budgetRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                budgetRange: [prev.budgetRange[0], Number.parseInt(e.target.value)],
              }))
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
        <div className="flex gap-2">
          {["any", "male", "female"].map((option) => (
            <button
              key={option}
              onClick={() => setFilters((prev) => ({ ...prev, gender: option }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filters.gender === option ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shared Interests</label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                filters.interests.includes(interest)
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
        Apply Filters
      </button>
    </div>
  )
}

export default FilterPanel
