"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { createSocketConnection } from "../utils/socket"
import { useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, Smile, X } from "lucide-react"

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [targetUser, setTargetUser] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const user = useSelector((store) => store.user)
  const userId = user?._id

  // Common emojis for quick access
  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😊",
    "😎",
    "🤔",
    "😮",
    "😢",
    "😡",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤝",
    "👏",
    "🙏",
    "💪",
    "❤️",
    "💯",
    "🔥",
    "⭐",
    "🎉",
    "🎊",
    "🏠",
    "🏡",
    "🍕",
    "☕",
    "🎵",
    "📱",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatMessages = async () => {
    try {
      setLoading(true)
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      })

      // Try to get target user info from connections
      try {
        const connectionsRes = await axios.get(BASE_URL + "/user/connection", {
          withCredentials: true,
        })
        const targetConnection = connectionsRes.data.data?.find((conn) => conn._id === targetUserId)
        if (targetConnection) {
          setTargetUser(targetConnection)
        } else {
          // If not in connections, try to get from requests
          const requestsRes = await axios.get(BASE_URL + "/user/requests/received", {
            withCredentials: true,
          })
          const targetRequest = requestsRes.data.data?.find((req) => req.fromUserId._id === targetUserId)
          if (targetRequest) {
            setTargetUser(targetRequest.fromUserId)
          } else {
            setTargetUser({ firstName: "User", lastName: "", photoUrl: null })
          }
        }
      } catch (error) {
        setTargetUser({ firstName: "User", lastName: "", photoUrl: null })
      }

      const chatMessages =
        chat?.data?.messages?.map((msg) => {
          const { senderId, text, createdAt } = msg
          return {
            id: msg._id || Date.now(),
            firstName: senderId?.firstName || "User",
            lastName: senderId?.lastName || "",
            text,
            timestamp: createdAt,
            isOwn: senderId._id === userId,
          }
        }) || []

      setMessages(chatMessages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setMessages([])
      setTargetUser({ firstName: "User", lastName: "", photoUrl: null })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChatMessages()
  }, [targetUserId])

  useEffect(() => {
    if (!userId) return
    const socket = createSocketConnection()

    socket.emit("joinChat", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
    })

    socket.on("messageReceived", ({ firstName, lastName, text, timestamp }) => {
      setMessages((messages) => [
        ...messages,
        {
          id: Date.now(),
          firstName,
          lastName,
          text,
          timestamp,
          isOwn: firstName === user.firstName,
        },
      ])
    })

    return () => {
      socket.disconnect()
    }
  }, [userId, targetUserId])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const socket = createSocketConnection()
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    })
    setNewMessage("")
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Enhanced Chat Header with Profile Info */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/connections" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>

              {/* Profile Photo with fallback */}
              <div className="relative">
                {targetUser?.photoUrl ? (
                  <img
                    src={targetUser.photoUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                ) : null}
                <div
                  className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center"
                  style={{ display: targetUser?.photoUrl ? "none" : "flex" }}
                >
                  <span className="text-lg font-bold">{targetUser?.firstName?.charAt(0) || "U"}</span>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {targetUser?.firstName} {targetUser?.lastName}
                </h2>
                <p className="text-sm opacity-90">
                  {targetUser?.age && targetUser?.gender ? `${targetUser.age}, ${targetUser.gender}` : "Roommate"}
                </p>
              </div>
            </div>

            {/* Chat Status */}
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm opacity-90">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Your Conversation</h3>
                <p className="text-gray-600">
                  Say hello to {targetUser?.firstName || "your potential roommate"} and break the ice!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {/* Message sender avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                    {msg.isOwn ? user.firstName?.charAt(0) : targetUser?.firstName?.charAt(0) || "U"}
                  </div>

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.isOwn
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 shadow-md rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-white/70" : "text-gray-500"}`}>
                      {msg.timestamp ? formatTime(msg.timestamp) : "now"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white border-t border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Quick Emojis</h3>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                {commonEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gray-100 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900"
                placeholder={`Message ${targetUser?.firstName || "User"}...`}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
