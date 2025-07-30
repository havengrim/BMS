"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IoSend,
  IoClose,
  IoChatbubbleEllipses,
  IoPersonCircle,
  IoDocumentText,
  IoTicket,
  IoShieldCheckmark,
} from "react-icons/io5"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function SindalanConnectChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hi, How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)

  // React Query mutation to call chatbot API
  const chatbotMutation = useMutation({
    mutationFn: (data: { message: string }) =>
      api.post("/api/chatbot/query/", data).then((res) => res.data),
  })

  // Show tooltip periodically every minute when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setShowTooltip(true)

      const interval = setInterval(() => {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
      }, 60000)

      const initialTimeout = setTimeout(() => setShowTooltip(false), 3000)

      return () => {
        clearInterval(interval)
        clearTimeout(initialTimeout)
      }
    } else {
      setShowTooltip(false)
    }
  }, [isOpen])

  const quickActions = [
    { text: "Search Support Articles", icon: IoDocumentText },
    { text: "Submit Support Ticket", icon: IoTicket },
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    chatbotMutation.mutate(
      { message: input },
      {
        onSuccess: (data) => {
          const assistantResponse = {
            id: messages.length + 2,
            type: "assistant",
            content:
              data?.reply ||
              "Sorry, I couldn't process your request at the moment.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantResponse])
        },
        onError: () => {
          const errorResponse = {
            id: messages.length + 2,
            type: "assistant",
            content:
              "Oops, something went wrong while connecting to the chatbot. Please try again.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorResponse])
        },
        onSettled: () => {
          setLoading(false)
        },
      }
    )
  }

  const handleQuickAction = (action: string) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: action,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setTimeout(() => {
      let assistantResponse = ""
      if (action === "Submit Support Ticket") {
        assistantResponse =
          "I'll help you submit a support ticket. Please describe your concern and I'll create a ticket for you."
      } else {
        assistantResponse =
          "I can help you search our support articles. What specific information are you looking for?"
      }
      const response = {
        id: messages.length + 2,
        type: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  // When closed, show message icon + tooltip bubble on the left side
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative flex items-center">
          {/* Tooltip positioned to the left of the button */}
          {showTooltip && (
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-sm rounded-lg px-4 py-2 shadow-lg select-none whitespace-nowrap animate-in slide-in-from-right-2 fade-in-0 duration-300">
              Hi, how can I help you?
              {/* Arrow pointing to the button */}
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-blue-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          )}

          <Button
            onClick={() => {
              setIsOpen(true)
              setShowTooltip(false)
            }}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Open chat"
          >
            <IoChatbubbleEllipses className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    )
  }

  // When open, show full chat window
  return (
    <div className="fixed bottom-28 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-xl border-0 bg-white !p-0 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <IoShieldCheckmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sindalan Connect</h3>
                <p className="text-blue-100 text-xs">Barangay Support Assistant</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              aria-label="Close chat"
            >
              <IoClose className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages Container */}
        <CardContent className="flex-1 p-0">
          <div className="h-[380px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <IoShieldCheckmark className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                <div className={`max-w-[280px] ${message.type === "user" ? "ml-auto" : ""}`}>
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.type === "user" && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <IoPersonCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Actions - Show only after initial message */}
            {messages.length === 1 && (
              <div className="space-y-3 mt-6">
                <p className="text-xs text-gray-600 font-medium px-1">Quick Actions:</p>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                    onClick={() => handleQuickAction(action.text)}
                  >
                    <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">{action.text}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 px-3"
                disabled={!input.trim() || loading}
              >
                <IoSend className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center mt-2">
              <Badge variant="secondary" className="text-xs text-gray-500">
                Powered by Sindalan Connect
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
