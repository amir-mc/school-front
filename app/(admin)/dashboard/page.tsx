// app/(admin)/dashboard/page.tsx
"use client"
import { DashboardCard } from "./components/DashboardCard"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">داشبورد ادمین</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardCard title="کل کاربران" count={145} icon="👥" />
        <DashboardCard title="تعداد کلاس‌ها" count={12} icon="🏫" />
        <DashboardCard title="پیام‌های ارسالی" count={32} icon="📩" />
        <DashboardCard title="نمرات ثبت‌شده" count={87} icon="📊" />
        <DashboardCard title="بازخوردها" count={23} icon="⭐" />
      </div>
    </div>
  )
}
