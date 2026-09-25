import { headers } from 'next/headers'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  return (
    <div className="flex h-screen overflow-hidden text-sm">
      <Sidebar currentPath={pathname} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
      <style>{`
        .sidebar-bg { background: #0f2936; }
        .header-bg { background: linear-gradient(to right, #0e7490, #0891b2); }
      `}</style>
    </div>
  )
}