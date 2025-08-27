"use client"

import { motion, useAnimation } from "framer-motion"
import { useDispatch } from "react-redux"
import { removeUserFromFeed } from "../utils/feedSlice"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useState } from "react"
import { MapPin, Calendar, Briefcase, Home, Star, GraduationCap } from "lucide-react"

const UserCard = ({ user, onSwipe, swipeDirection }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    location,
    occupation,
    education,
    budget,
    skills,
    interests,
  } = user
  const controls = useAnimation()
  const dispatch = useDispatch()
  const [swiping, setSwiping] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const userData = {
    location: location || "",
    occupation: occupation || "",
    education: education || "",
    budget: budget || "",
    skills: skills || [],
    interests: interests || [],
    photos: [photoUrl],
  }

  const handleSendRequest = async (status) => {
    try {
      await axios.post(BASE_URL + "/request/send/" + status + "/" + _id, {}, { withCredentials: true })
      dispatch(removeUserFromFeed(_id))
      onSwipe(status === "ignored" ? "left" : "right")
    } catch (err) {
      console.error("API Error:", err)
    }
  }

  const handleSwipe = async (direction) => {
    setSwiping(true)
    await controls.start({
      x: direction === "left" ? -1000 : 1000,
      rotate: direction === "left" ? -20 : 20,
      opacity: 0.5,
      transition: { duration: 0.5 },
    })
    await handleSendRequest(direction === "left" ? "ignored" : "interested")
    controls.set({ x: 0, rotate: 0, opacity: 1 })
    setSwiping(false)
  }

  return (
    <motion.div
      className="relative w-[350px] sm:w-[400px] bg-white shadow-2xl rounded-3xl overflow-hidden"
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(e, info) => {
        const threshold = 150
        if (info.offset.x < -threshold) handleSwipe("left")
        else if (info.offset.x > threshold) handleSwipe("right")
        else controls.start({ x: 0, rotate: 0 })
      }}
      style={{ cursor: swiping ? "grabbing" : "grab" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Image Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={userData.photos[currentImageIndex] || "/placeholder.svg"}
          alt="User"
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Basic Info Overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Calendar className="w-4 h-4" />
            <span>{age ? `${age}, ${gender}` : gender || ""}</span>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="p-6 space-y-4">
        {/* Location, Occupation, Education & Budget */}
        {(userData.location || userData.occupation || userData.education || userData.budget) && (
          <div className="space-y-2">
            {userData.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{userData.location}</span>
              </div>
            )}
            {userData.occupation && (
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{userData.occupation}</span>
              </div>
            )}
            {userData.education && (
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm">{userData.education}</span>
              </div>
            )}
            {userData.budget && (
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-4 h-4" />
                <span className="text-sm">Budget: {userData.budget}/month</span>
              </div>
            )}
          </div>
        )}

        {/* About */}
        {about && (
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">{about}</p>
          </div>
        )}

        {/* Skills */}
        {userData.skills.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {userData.interests.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {userData.interests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  {interest}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleSwipe("left")}
            disabled={swiping}
          >
            Pass
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleSwipe("right")}
            disabled={swiping}
          >
            Interested
          </button>
        </div>
      </div>

      {/* Swipe Direction Indicator */}
      {swipeDirection && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center ${
            swipeDirection === "left" ? "bg-red-500/20" : "bg-green-500/20"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`text-6xl font-bold ${swipeDirection === "left" ? "text-red-500" : "text-green-500"}`}>
            {swipeDirection === "left" ? "PASS" : "LIKE"}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default UserCard
