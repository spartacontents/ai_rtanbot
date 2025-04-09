"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function ChatBot() {
  // Chat state
  const [step, setStep] = useState(0)
  const [userName, setUserName] = useState("")
  const [concern, setConcern] = useState("")
  const [interest, setInterest] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant"
      content: string
      image?: string
    }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const [showInput, setShowInput] = useState(true)
  const [options, setOptions] = useState<string[]>([])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // AI chat for summary generation
  const { handleSubmit: aiHandleSubmit, isLoading: aiIsLoading } = useChat({
    api: "/api/chat",
  })

  // Questions flow
  const questions = [
    "이야기를 시작해볼게요!",
    "이름이 뭐야?",
    "NAME님 고민을 말해주세요.",
    "어때, 튜터에 관심이 있어요?",
    "만나서 반가웠어~!\n다음에 만났을 때는 튜터로 만나면 좋겠어요 :)",
  ]

  // Options for multiple choice questions
  useEffect(() => {
    if (step === 0) {
      setOptions(["응 좋아", "너무 좋아"])
    } else if (step === 3) {
      setOptions(["관심 있다", "관심 없다"])
    } else {
      setOptions([])
    }
  }, [step])

  // Add initial bot message
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(questions[0], "/pixel-welcome.png")
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Add bot message with typing effect
  const addBotMessage = (content: string, image?: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content, image }])
      setIsTyping(false)
    }, 1000)
  }

  // Add user message
  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }])
  }

  // Generate summary
  const generateSummary = async (concernText: string) => {
    setIsTyping(true)

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, concern: concernText }),
      })

      const data = await response.json()
      const aiResponse = data.message

      if (aiResponse) {
        let formatted = aiResponse

        if (!formatted.includes(`${userName}님`)) {
          formatted = `${userName}님, ${formatted}`
        }

        if (!formatted.includes("튜터 지원하러가기")) {
          formatted +=
            "\n\n팀스파르타에는 내가 원하는 시간에 재택근무할 수 있는 튜터 활동과 대기업 등에서 진행하는 오프라인 튜터 활동이 있어요!\n> 튜터 지원하러가기 : https://spartacodingclub.kr/"
        }

        addBotMessage(formatted, "/pixel-thinking.png")
      } else {
        throw new Error("응답 없음")
      }
    } catch (error) {
      console.error("AI 요약 생성 오류:", error)
      const fallback = `${userName}님, 고민이 눈 녹듯 사라지길 바래요 :) 고민을 말씀해주셔서 감사합니다.\n 팀스파르타에는 내가 원하는 시간에 재택근무할 수 있는 튜터 활동과 대기업 등에서 진행하는 오프라인 튜터 활동이 있어요!\n> 튜터 지원하러가기 : https://spartacodingclub.kr/`
      addBotMessage(fallback, "/pixel-sad.png")
    } finally {
      setIsTyping(false)
      setStep(3)
    }
  }

  // Handle user input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (inputValue.trim() === "" && options.length === 0) return

    const userResponse = inputValue

    // For option selection
    if (options.length > 0 && !inputValue) {
      return
    }

    addUserMessage(userResponse)
    setInputValue("")

    // Process based on current step
    if (step === 0) {
      setStep(1)
      setTimeout(() => addBotMessage(questions[1], "/pixel-question.png"), 1000)
    } else if (step === 1) {
      setUserName(userResponse)
      setStep(2)
      setTimeout(() => addBotMessage(questions[2].replace("NAME", userResponse), "/pixel-listening.png"), 1000)
    } else if (step === 2) {
      setConcern(userResponse)
      generateSummary(userResponse)
    } else if (step === 3) {
      setInterest(userResponse)
      setStep(4)
      setShowInput(false)
      setTimeout(() => addBotMessage(questions[4], "/pixel-goodbye.png"), 1000)
    }
  }

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    setInputValue(option)
    handleSubmit(new Event("submit") as any)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === "assistant"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {message.image && (
                <div className="mb-2">
                  <Image
                    src={message.image}
                    alt="Bot avatar"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>입력 중...</p>
            </div>
          </div>
        )}
      </div>

      {showInput && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit">전송</Button>
        </form>
      )}

      {options.length > 0 && (
        <div className="flex gap-2 mt-2">
          {options.map((option) => (
            <Button
              key={option}
              onClick={() => handleOptionSelect(option)}
              variant="outline"
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
} 