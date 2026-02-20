import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('admin_token')

    // Super simple auth check - replace with real auth in production
    if (!authCookie || authCookie.value !== 'authenticated') {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-black/20">
                <h1 className="text-xl font-orbitron text-theme">Admin Dashboard</h1>
                <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                    <span>SQL Navigator</span>
                </div>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}
