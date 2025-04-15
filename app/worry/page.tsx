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
      <div className="w-full max-w-[430px] mx-auto">
        <div className="w-full">
          <Image
            src={showResponse ? "/고민해결.png" : "/고민책.png"}
            alt={showResponse ? "고민해결" : "고민책"}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative w-full h-full flex flex-col px-8" style={{ paddingBottom: '0%' }}>
          {!showResponse ? (
            <div className="mt-auto">
              <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="고민을 입력해주세요."
                className="w-full h-[100px] p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
              />
              
              <button 
                className="w-full mt-4 bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading || !worry.trim()}
              >
                {isLoading ? '르탄이가 해결 방안 모색 중…' : '고민 털어놓기'}
              </button>
            </div>
          ) : (
            <div className="relative w-full min-h-[700px] flex flex-col items-center pt-[0%] gap-6">
            {/* 💬 말풍선 */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-full relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-white/90 rounded-full" />
              <div className="max-h-[350px] overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-line text-sm">
                  {aiResponse}
                </p>
              </div>
            </div>

                {/* 🔘 버튼 영역 (말풍선 밖에 위치) */}
                <div className="flex flex-col items-center gap-[15px]">
                  <a
                    href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors text-center"
                  >
                    튜터풀 등록하기
                  </a>
                  <a
                    href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors text-center"
                  >
                    튜터 더 알아보기
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