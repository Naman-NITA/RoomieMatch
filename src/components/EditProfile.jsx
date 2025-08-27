"use client"

import { useState } from "react"
import UserCard from "./UserCard"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { motion, AnimatePresence } from "framer-motion"
import { Save, User, Calendar, MapPin, Briefcase, FileText, Star, Camera } from "lucide-react"

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl)
  const [age, setAge] = useState(user.age || "")
  const [gender, setGender] = useState(user.gender || "")
  const [about, setAbout] = useState(user.about || "")
  const [location, setLocation] = useState(user.location || "")
  const [occupation, setOccupation] = useState(user.occupation || "")
  const [budget, setBudget] = useState(user.budget || "")
  const [skills, setSkills] = useState(user.skills?.join(", ") || "")
  const [interests, setInterests] = useState(user.interests?.join(", ") || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [showToast, setShowToast] = useState(false)

  const saveProfile = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age: Number.parseInt(age) || undefined,
          gender,
          about,
          location,
          occupation,
          budget,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          interests: interests
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        },
        { withCredentials: true },
      )
      dispatch(addUser(res?.data?.data))
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data || "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  const formFields = [
    { label: "First Name", value: firstName, setter: setFirstName, icon: User, required: true },
    { label: "Last Name", value: lastName, setter: setLastName, icon: User, required: true },
    { label: "Photo URL", value: photoUrl, setter: setPhotoUrl, icon: Camera },
    { label: "Age", value: age, setter: setAge, icon: Calendar, type: "number" },
    { label: "Gender", value: gender, setter: setGender, icon: User },
    { label: "Location", value: location, setter: setLocation, icon: MapPin },
    { label: "Occupation", value: occupation, setter: setOccupation, icon: Briefcase },
    { label: "Budget (per month)", value: budget, setter: setBudget, icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Edit Your Profile</h1>
          <p className="text-gray-600">Make your profile stand out to potential roommates</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            </div>

            <div className="space-y-6">
              {formFields.map((field, index) => {
                const IconComponent = field.icon
                return (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <IconComponent className="w-4 h-4" />
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </motion.div>
                )
              })}

              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  About Me
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-gray-900 bg-white"
                  placeholder="Tell potential roommates about yourself..."
                />
              </motion.div>

              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4" />
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="e.g., Cooking, Cleaning, Organized, Quiet"
                />
              </motion.div>

              {/* Interests Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4" />
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="e.g., Reading, Hiking, Movies, Coffee"
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                onClick={saveProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Profile Preview</h3>
              <p className="text-gray-600 text-center mb-6">This is how others will see your profile</p>
            </div>
            <UserCard
              user={{
                firstName,
                lastName,
                photoUrl,
                age: Number.parseInt(age) || undefined,
                gender,
                about,
                location,
                occupation,
                budget,
                skills: skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
                interests: interests
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              }}
              onSwipe={() => {}}
              swipeDirection={null}
            />
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Profile saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditProfile
