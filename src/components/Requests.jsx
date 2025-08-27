"use client"

import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addRequests, removeRequest } from "../utils/requestSlice"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MapPin, Briefcase, CheckCircle, XCircle } from "lucide-react"

const Requests = () => {
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [processingRequests, setProcessingRequests] = useState(new Set())
  const [error, setError] = useState("")

  const reviewRequest = async (status, _id) => {
    setProcessingRequests((prev) => new Set([...prev, _id]))
    try {
      await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, { withCredentials: true })
      dispatch(removeRequest(_id))
    } catch (err) {
      console.error("Failed to review request:", err)
      setError("Failed to process request. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(_id)
        return newSet
      })
    }
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      })
      dispatch(addRequests(res.data.data || []))
    } catch (err) {
      console.error("Failed to fetch requests:", err)
      setError("")
      dispatch(addRequests([]))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Heart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Connection Requests</h1>
          <p className="text-gray-600 mb-8">
            When people are interested in being your roommate, their requests will appear here.
          </p>
          <button
            onClick={fetchRequests}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Refresh
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Connection Requests</h1>
          <p className="text-gray-600">People who want to be your roommate</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Requests List */}
        <div className="space-y-6">
          <AnimatePresence>
            {requests.map((request, index) => {
              const { _id, firstName, lastName, photoUrl, age, gender, about, location, occupation } =
                request.fromUserId
              const isProcessing = processingRequests.has(request._id)

              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="md:flex">
                    {/* Profile Image */}
                    <div className="md:w-48 h-48 md:h-auto">
                      <img alt="Profile" className="w-full h-full object-cover" src={photoUrl || "/placeholder.svg"} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {firstName} {lastName}
                        </h3>
                        {age && gender && (
                          <p className="text-gray-600 mb-2">
                            {age}, {gender}
                          </p>
                        )}
                        {location && (
                          <p className="text-gray-600 mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {location}
                          </p>
                        )}
                        {occupation && (
                          <p className="text-gray-600 mb-3 flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {occupation}
                          </p>
                        )}
                      </div>

                      {about && <p className="text-gray-700 mb-6 leading-relaxed">{about}</p>}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => reviewRequest("rejected", request._id)}
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              Decline
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => reviewRequest("accepted", request._id)}
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Accept
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Requests
