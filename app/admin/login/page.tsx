import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

async function loginUser(formData: FormData) {
    'use server'
    const secret = process.env.ADMIN_SECRET
    const password = formData.get('password')

    if (password === secret) {
        cookies().set('admin_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 day
        })
        redirect('/admin')
    }
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-orbitron text-theme mb-2">Admin Portal</h1>
                    <p className="text-sm text-muted-foreground font-mono">Authenticate to manage SQL Data</p>
                </div>

                <form action={loginUser} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Admin Secret</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full bg-black/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-theme transition-colors font-mono"
                            placeholder="Enter password..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-space-primary px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    )
}
