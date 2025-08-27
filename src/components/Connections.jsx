"use client"

import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnections } from "../utils/conectionSlice"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Users, Search, MapPin, Briefcase } from "lucide-react"

const Connections = () => {
  const connections = useSelector((store) => store.connections)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredConnections, setFilteredConnections] = useState([])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const res = await axios.get(BASE_URL + "/user/connection", {
        withCredentials: true,
      })
      dispatch(addConnections(res.data.data))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  useEffect(() => {
    if (connections) {
      const filtered = connections.filter((connection) =>
        `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredConnections(filtered)
    }
  }, [connections, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Users className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Connections Yet</h1>
          <p className="text-gray-600 mb-8">Start swiping to find your perfect roommate!</p>
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Discover People
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Connections</h1>
          <p className="text-gray-600">People you've matched with</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-600">{connections.length}</p>
              <p className="text-gray-600">Total Connections</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600">{Math.floor(connections.length * 0.7)}</p>
              <p className="text-gray-600">Active Chats</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{Math.floor(connections.length * 0.3)}</p>
              <p className="text-gray-600">New This Week</p>
            </div>
          </div>
        </motion.div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredConnections.map((connection, index) => {
              const { _id, firstName, lastName, photoUrl, age, gender, about, location, occupation } = connection
              return (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img alt="Profile" className="w-full h-48 object-cover" src={photoUrl || "/placeholder.svg"} />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Connected
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {firstName} {lastName}
                    </h3>

                    {age && gender && (
                      <p className="text-gray-600 mb-2 flex items-center gap-1">
                        <span>
                          {age}, {gender}
                        </span>
                      </p>
                    )}

                    {location && (
                      <p className="text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{location}</span>
                      </p>
                    )}

                    {occupation && (
                      <p className="text-gray-600 mb-3 flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{occupation}</span>
                      </p>
                    )}

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{about}</p>

                    <Link to={"/chat/" + _id}>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Start Chat
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredConnections.length === 0 && searchTerm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matches found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Connections
