import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-orange-50">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
            <div className="mb-6 flex items-center gap-3">
                <Link href="/" className="inline-flex items-center gap-2">
                    <img src="/logo-hero.png" alt="Tu Catering" className="h-12 w-auto" />
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 sm:border sm:border-orange-100 sm:bg-white sm:shadow-sm sm:p-8">
                {children}
            </div>
        </div>
    );
}
