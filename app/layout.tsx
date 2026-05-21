// app/layout.tsx
import './globals.css' // 引入全局样式

export const metadata = {
  title: '虚拟软件公司 AI 助手',
  description: '基于 Dify API 的智能研发平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
