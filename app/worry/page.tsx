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
  <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white relative">
    <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: '5px' }}>
      <Image
        src={showResponse ? "/page3.png" : "/page2.png"}
        alt={showResponse ? "page3" : "page2"}
        width={402}
        height={402}
        className="object-contain"
        priority
      />
    </div>
        <div className="relative w-full h-full flex flex-col px-8" style={{ paddingBottom: '0%' }}>
          {!showResponse ? (
            <div className="mt-auto flex flex-col items-center w-full" style={{ height: '100vh' }}>
              <textarea
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                placeholder="고민을 입력해주세요."
                className="w-[90%] h-[100px] p-4 bg-transparent text-black placeholder-gray-500 focus:outline-none resize-none text-center"
                style={{ marginTop: '35vh',    fontSize: '20px'  }}
              />
              
              <div style={{ position: 'absolute', bottom: '20%', width: '100%', display: 'flex', justifyContent: 'center' }}>
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
            </div>
          ) : (
            <div className="relative w-full min-h-[700px] flex flex-col items-center pt-[0%] gap-6">
            {/* 💬 말풍선 */}
            <div 
              className="fixed w-[80%] max-h-[25vh] overflow-y-auto"
              style={{
                top: '35%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'transparent',
                padding: '15px',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
              }}
            >
              <p 
                className="text-gray-800 whitespace-pre-line text-sm text-center"
                style={{
                  wordBreak: 'break-word',
                  lineHeight: '1.4',
                  margin: '0'
                }}
              >
                {aiResponse}
              </p>
            </div>

            {/* 스크롤바 숨김 스타일 */}
            <style jsx global>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
              {/* 중간에 위치할 새로운 버튼 */}
              <div className="fixed bottom-[35%] left-0 w-full flex justify-center items-center">
                <a
                  href="https://tutorteamsparta.ninehire.site/job_posting/J5Ygb1Ha?utm_source=2025ITRC"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '300px',
                    height: '0',
                    paddingBottom: '15%',
                    backgroundImage: "url('/page3 btn1.png')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                >
                  <span className="opacity-0">튜터 등록하기기</span>
                </a>
              </div>
            {/* 🔘 버튼 영역 */}
            
            <div className="fixed bottom-[10%] left-0 w-full flex justify-center items-center">
              <a
                href="https://teamsparta-tutor-introduction.oopy.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '300px',  // 이미지의 최대 너비 설정
                  height: '0',
                  paddingBottom: '15%',  // 이미지의 비율에 따라 조정 (예: 15%)
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