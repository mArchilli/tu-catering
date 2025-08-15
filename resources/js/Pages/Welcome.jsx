import { Head } from '@inertiajs/react';
import Hero from '@/Components/Landing/Hero';
import About from '@/Components/Landing/About';
import Services from '@/Components/Landing/Services';
import LevelsInstitutions from '@/Components/Landing/LevelsInstitutions';
import Benefits from '@/Components/Landing/Benefits';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="Tu Catering" />
            <div className="bg-white text-gray-900">
                <Hero />
                <About />
                <Services />
                <LevelsInstitutions />
                <Benefits />
                <CTA />
                <Footer />
            </div>
        </>
    );
}

