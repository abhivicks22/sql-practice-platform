import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_token')

    // Super simple auth check - replace with real auth in production
    if (!authCookie || authCookie.value !== 'authenticated') {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-black/20">
                <Link href="/admin">
                    <h1 className="text-xl font-orbitron text-theme hover:opacity-80 transition-opacity">Admin Dashboard</h1>
                </Link>
                <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
                        &larr; Back to SQL Navigator
                    </Link>
                </div>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}
