"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { addFeed } from "../utils/feedSlice"
import UserCard from "./UserCard"
import FilterPanel from "./FilterPanel"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Filter, Heart, X } from "lucide-react"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [matchCount, setMatchCount] = useState(0)

  const getFeed = async () => {
    if (feed && feed.length > 0) return
    setLoading(true)
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true })
      dispatch(addFeed(res.data))
    } catch (error) {
      console.error("Failed to fetch feed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

  const handleCardSwipe = (direction) => {
    setSwipeDirection(direction)
    if (direction === "right") {
      setMatchCount((prev) => prev + 1)
    }
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-lg text-gray-600">Finding your perfect roommate...</p>
      </div>
    )
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="text-center">
          <Users className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No New Users Found</h1>
          <p className="text-gray-600 mb-8">Check back later for new potential roommates!</p>
          <button
            onClick={getFeed}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    )
  }

  if (currentIndex >= feed.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="text-center">
          <Heart className="w-24 h-24 text-pink-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">You've seen everyone!</h1>
          <p className="text-gray-600 mb-4">You've reviewed all available roommates.</p>
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <p className="text-2xl font-bold text-purple-600">{matchCount}</p>
            <p className="text-gray-600">Potential matches</p>
          </div>
          <button
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Review Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      {/* Header Stats */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{currentIndex + 1}</p>
            <p className="text-xs text-gray-500">Current</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{feed.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{matchCount}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-white border-2 border-purple-200 text-purple-600 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filters & Preferences
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-md mx-auto px-4 mb-6"
          >
            <FilterPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Area */}
      <div className="flex justify-center items-center px-4 relative">
        <div className="relative">
          {/* Background Cards for Stack Effect */}
          {feed.slice(currentIndex + 1, currentIndex + 3).map((user, index) => (
            <div
              key={user._id}
              className="absolute inset-0 bg-white rounded-3xl shadow-lg"
              style={{
                transform: `scale(${0.95 - index * 0.05}) translateY(${(index + 1) * 8}px)`,
                zIndex: -index - 1,
                opacity: 0.7 - index * 0.2,
              }}
            />
          ))}

          {/* Current Card */}
          <UserCard user={feed[currentIndex]} onSwipe={handleCardSwipe} swipeDirection={swipeDirection} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="flex justify-center gap-6">
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-4 rounded-full shadow-lg transition-all duration-300"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>

          <button
            onClick={() => handleCardSwipe("left")}
            className="bg-red-100 hover:bg-red-200 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>

          <button
            onClick={() => handleCardSwipe("right")}
            className="bg-green-100 hover:bg-green-200 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </div>

      {/* Swipe Hints */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="flex justify-between text-sm text-gray-500">
          <span>← Swipe left to pass</span>
          <span>Swipe right to like →</span>
        </div>
      </div>
    </div>
  )
}

export default Feed
