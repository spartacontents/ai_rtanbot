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

  // page2.png is 753×1255, page3.png is 753×1386 — different aspect ratios per view.
  const frameAspect = showResponse ? '753 / 1386' : '753 / 1255'

  return (
    <main className="min-h-screen flex items-start justify-center bg-white">
      <div
        className="relative w-full max-w-[430px]"
        style={{ aspectRatio: frameAspect }}
      >
        {/* Background frame image */}
        <Image
          src={showResponse ? "/page3.png" : "/page2.png"}
          alt={showResponse ? "page3" : "page2"}
          fill
          className="object-contain"
          priority
        />

        {!showResponse ? (
          // ===== Input view =====
          isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-xl text-gray-800">르탄이가 해결 방안 모색 중…</p>
            </div>
          ) : (
            <>
              {/* Textarea — inside white content area (~12% ~ 72%) */}
              <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="고민을 입력해주세요."
                className="absolute bg-transparent text-black placeholder-gray-500 focus:outline-none resize-none text-center"
                style={{
                  top: '14%',
                  left: '8%',
                  right: '8%',
                  height: '58%',
                  fontSize: '18px',
                  padding: '20px 10px',
                  lineHeight: '1.5',
                }}
              />

              {/* Submit button — inside gray bottom area (~75% ~ 100%) */}
              <button
                className="absolute disabled:opacity-50 bg-transparent border-0 p-0"
                onClick={handleSubmit}
                disabled={isLoading || !worry.trim()}
                style={{
                  top: '83%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '55%',
                  aspectRatio: '350 / 86',
                  backgroundImage: "url('/page2 btn.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <span className="opacity-0">
                  {isLoading ? '르탄이가 해결 방안 모색 중…' : '고민 털어놓기'}
                </span>
              </button>
            </>
          )
        ) : (
          // ===== Response view =====
          <>
            {/* AI Response — inside the big white content box (18.6%~56.7%) */}
            <div
              ref={bubbleRef}
              className="absolute overflow-y-auto"
              style={{
                top: '20%',
                left: '11%',
                right: '11%',
                height: '34%',
                padding: '12px 10px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              <p
                className="text-gray-800 whitespace-pre-wrap text-sm text-center"
                style={{
                  wordBreak: 'keep-all',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                {aiResponse}
              </p>
            </div>

            {/* Down arrow — bottom of the white box */}
            {showArrow && (
              <div
                className="absolute z-10 animate-bounce"
                style={{ top: '52%', left: '50%', transform: 'translateX(-50%)' }}
              >
                <span className="text-2xl" style={{ color: 'rgba(232, 52, 78, 0.8)' }}>
                  ↓
                </span>
              </div>
            )}

            {/* Button 1 (튜터 등록하기) — in the gap between white box and event promo */}
            <div
              className="absolute flex justify-center"
              style={{ top: '58.5%', left: 0, right: 0 }}
            >
              <a
                href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '70%',
                  aspectRatio: '602 / 86',
                  backgroundImage: "url('/page3 btn1.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <span className="opacity-0">튜터 등록하기</span>
              </a>
            </div>

            {/* Button 2 (자세히 알아보기) — just below button 1, still inside the gap */}
            <div
              className="absolute flex justify-center"
              style={{ top: '64%', left: 0, right: 0 }}
            >
              <a
                href="https://teamsparta-tutor-introduction.oopy.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '70%',
                  aspectRatio: '602 / 86',
                  backgroundImage: "url('/page3 btn2.png')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <span className="opacity-0">팀스파르타 튜터 자세히 알아보기</span>
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
