import { Head, Link } from '@inertiajs/react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Head title="Página no encontrada" />

      {/* Fondo degradado dinámico */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600" />
      {/* Capa brillo / textura suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.18),transparent_65%)]" />
      {/* Shapes decorativos */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] w-96 h-96 rounded-full bg-white/10 blur-3xl" />

      <header className="relative px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-bold tracking-tight text-white drop-shadow-sm hover:opacity-90 transition">
          Tu Catering
        </Link>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center text-white">
          <div className="mb-10">
            <div className="relative inline-block">
              <span className="block text-[7rem] leading-none font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-orange-100 to-orange-200 drop-shadow-sm select-none">
                404
              </span>
              <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-br from-white via-orange-200 to-orange-500 rounded-lg" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
            Página no encontrada
          </h1>
          <p className="text-orange-50/90 leading-relaxed mb-10 text-base sm:text-lg max-w-xl mx-auto">
            El recurso que buscás no existe o fue movido. Verificá la dirección o regresá al inicio para continuar navegando.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/"
              className="group relative overflow-hidden px-8 py-3 rounded-xl bg-white text-orange-700 font-semibold shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <span className="relative z-10">Volver al inicio</span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-200 via-orange-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-3 rounded-xl border border-white/30 backdrop-blur-sm bg-white/10 text-white font-semibold hover:bg-white/20 hover:border-white/40 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Contacto
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative py-8 text-center text-xs text-orange-50/70">
        © {new Date().getFullYear()} Tu Catering. Todos los derechos reservados.
      </footer>
    </div>
  );
}
