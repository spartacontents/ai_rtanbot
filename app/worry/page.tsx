'use client'

import Image from "next/image"
import { useState } from "react"

export default function WorryPage() {
  const [worry, setWorry] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const handleSubmit = async () => {
    if (!worry.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: '사용자',
          concern: worry
        }),
      })

      const data = await response.json()
      setAiResponse(data.message)
      setShowResponse(true)
    } catch (error) {
      console.error('Error:', error)
      setAiResponse('죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-[390px] aspect-[9/19.5] relative">
        <div className="absolute inset-0">
          <Image
            src={showResponse ? "/고민해결.png" : "/고민책.png"}
            alt={showResponse ? "고민해결" : "고민책"}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative w-full h-full flex flex-col px-8" style={{ paddingBottom: '10%' }}>
          {!showResponse ? (
            <div className="mt-auto">
              <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="당신의 고민을 적어주세요..."
                className="w-full h-[100px] p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
              />
              
              <button 
                className="w-full mt-4 bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading || !worry.trim()}
              >
                {isLoading ? '답변 생성 중...' : '고민 제출하기'}
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-[80%] relative mt-[20%] mb-[30%]">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-white/90 rounded-full" />
                <p className="text-gray-800 whitespace-pre-line text-sm">
                  {aiResponse}
                </p>
              </div>
              
              <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex flex-col gap-[15px]">
                <a
                  href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors text-center"
                >
                  튜터풀 등록하기
                </a>
                
                <button
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                  onClick={() => {
                    setShowResponse(false)
                    setWorry('')
                    setAiResponse('')
                  }}
                >
                  다시 작성하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 