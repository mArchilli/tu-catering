export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-orange-100 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-sm text-gray-600 lg:px-8">
                <p>© {year} Tu Catering. Todos los derechos reservados.</p>
                <a href="#about" className="text-orange-600 hover:text-orange-700">Sobre nosotros</a>
            </div>
        </footer>
    );
}
