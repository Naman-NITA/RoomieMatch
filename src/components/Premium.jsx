"use client"

import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Crown, Check, Star, Zap, MessageCircle, Shield, Sparkles } from "lucide-react"

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyPremiumUser()
  }, [])

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      })
      if (res.data.isPremium) {
        setIsUserPremium(true)
      }
    } catch (error) {
      console.error("Failed to verify premium status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true },
      )
      const { amount, keyId, currency, notes, orderId } = order.data
      const options = {
        key: keyId,
        amount,
        currency,
        name: "RoomieMatch Premium",
        description: "Upgrade your roommate finding experience",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#9333EA",
        },
        handler: verifyPremiumUser,
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (isUserPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl p-12 shadow-2xl max-w-md"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full inline-block mb-6">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">You're Premium!</h1>
          <p className="text-gray-600 mb-8">Enjoy all the exclusive features and find your perfect roommate faster.</p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Your Premium Benefits:</h3>
            <ul className="text-left space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Unlimited swipes and connections
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Advanced matching algorithm
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Verified profile badge
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  const plans = [
    {
      name: "Silver",
      price: "$9.99",
      duration: "3 months",
      color: "from-gray-400 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
      features: [
        "Chat with matches",
        "100 connection requests/day",
        "Basic filters",
        "Profile verification badge",
        "Priority support",
      ],
      popular: false,
    },
    {
      name: "Gold",
      price: "$19.99",
      duration: "6 months",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      features: [
        "Everything in Silver",
        "Unlimited connection requests",
        "Advanced matching algorithm",
        "See who liked you",
        "Boost your profile",
        "Premium customer support",
      ],
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl inline-block mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Go Premium</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive features and find your perfect roommate faster with our premium plans
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative bg-gradient-to-br ${plan.bgColor} rounded-3xl p-8 shadow-2xl ${
                plan.popular ? "ring-4 ring-purple-500 ring-opacity-50" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`bg-gradient-to-r ${plan.color} p-4 rounded-2xl inline-block mb-4`}>
                  {plan.name === "Silver" ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <Crown className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyClick(plan.name.toLowerCase())}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-gray-600 to-gray-700"
                }`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-2xl inline-block mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Faster Matches</h3>
              <p className="text-gray-600">Advanced algorithm finds compatible roommates 3x faster</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 p-4 rounded-2xl inline-block mb-4">
                <MessageCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unlimited Connections</h3>
              <p className="text-gray-600">Connect with as many potential roommates as you want</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-2xl inline-block mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Priority Support</h3>
              <p className="text-gray-600">Get help when you need it with premium customer support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Premium
