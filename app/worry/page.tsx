'use client'

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

export default function WorryPage() {
  const [worry, setWorry] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [showArrow, setShowArrow] = useState(false)

  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bubble = bubbleRef.current
    if (!bubble) return

    const handleScroll = () => {
      if (bubble.scrollHeight - bubble.scrollTop > bubble.clientHeight + 10) {
        setShowArrow(true)
      } else {
        setShowArrow(false)
      }
    }

    if (bubble.scrollHeight > bubble.clientHeight) {
      setShowArrow(true)
    }

    bubble.addEventListener('scroll', handleScroll)
    return () => bubble.removeEventListener('scroll', handleScroll)
  }, [aiResponse])

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white relative">
      <div className="absolute top-[10px] inset-x-0 flex items-center justify-center">
        <Image
          src={showResponse ? "/page3.png" : "/page2.png"}
          alt={showResponse ? "page3" : "page2"}
          width={350}
          height={350}
          className="object-contain"
          priority
        />
      </div>

      <div className="relative w-full h-full flex flex-col px-8" style={{ paddingBottom: '0%' }}>
        {!showResponse ? (
          <div className="mt-auto flex flex-col items-center w-full" style={{ height: '100vh' }}>
            {isLoading ? (
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-xl text-gray-800">르탄이가 해결 방안 모색 중…</p>
              </div>
            ) : (
              <>
                <textarea
                  value={worry}
                  onChange={(e) => setWorry(e.target.value)}
                  placeholder="고민을 입력해주세요."
                  className="w-[90%] h-[200px] p-4 bg-transparent text-black placeholder-gray-500 focus:outline-none resize-none text-center"
                  style={{ marginTop: '100px', fontSize: '20px' }}
                />

                <div style={{ position: 'absolute', top: '480px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <button 
                    className="w-[200px] h-[50px] disabled:opacity-50 bg-transparent"
                    onClick={handleSubmit}
                    disabled={isLoading || !worry.trim()}
                    style={{
                      backgroundImage: "url('/page2 btn.png')",
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      border: 'none'
                    }}
                  >
                    <span className="opacity-0">
                      {isLoading ? '르탄이가 해결 방안 모색 중…' : '고민 털어놓기'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative w-full min-h-[700px] flex flex-col items-center pt-[0%] gap-6">
            {/* 💬 말풍선 */}
            <div 
              ref={bubbleRef}
              className="fixed w-[60%] max-h-[200px] overflow-y-auto"
              style={{
                top: '250px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'transparent',
                padding: '20px 20px 30px 20px',
              }}
            >
              <p 
                className="text-gray-800 whitespace-pre-wrap text-sm text-center"
                style={{
                  wordBreak: 'break-all',
                  lineHeight: '1.4',
                  margin: '0',
                  minWidth: '100%'
                }}
              >
                {aiResponse}
              </p>
            </div>

            {/* ⬇️ 아래로 스크롤 유도 화살표 */}
            {showArrow && (
              <div className="fixed top-[355px] left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                <span className="text-2xl text-gray-600">↓</span>
              </div>
            )}

            {/* 버튼1 */}
            <div className="fixed top-[385px] left-0 w-full flex justify-center items-center">
              <a
                href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '280px',
                  height: '0',
                  paddingBottom: '15%',
                  backgroundImage: "url('/page3 btn1.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                <span className="opacity-0">튜터 등록하기</span>
              </a>
            </div>

            {/* 버튼2 */}
            <div className="fixed top-[580px] left-0 w-full flex justify-center items-center">
              <a
                href="https://teamsparta-tutor-introduction.oopy.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '280px',
                  height: '0',
                  paddingBottom: '15%',
                  backgroundImage: "url('/page3 btn2.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                <span className="opacity-0">튜터 더 알아보기</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
