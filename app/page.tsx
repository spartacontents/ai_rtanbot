import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
<main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
  <div className="absolute top-[10px] inset-x-0 flex items-center justify-center">
    <Image
      src="/page1.png"
      alt="메인 이미지"
      width={350}
      height={350}
      className="object-contain"
      priority
    />
  </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="absolute left-1/2 top-[480px] transform -translate-x-1/2 w-[60%] max-w-[300px]">
          <Link href="/worry">
            <Image
              src="/page1 btn.png"
              alt="고민 상담 시작하기"
              width={200}
              height={60}
              className="hover:opacity-90 transition-opacity cursor-pointer w-full h-auto"
              priority
            />
          </Link>
        </div>
        <div className="absolute bottom-4 text-center w-full" style={{ color: '#ebc99e' }}>
          Copyright ⓒ TeamSparta All rights reserved.
        </div>
      </div>
    </main>
  )
}