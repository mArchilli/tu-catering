import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Hero from '@/Components/Landing/Hero';
import About from '@/Components/Landing/About';
import Services from '@/Components/Landing/Services';
import LevelsInstitutions from '@/Components/Landing/LevelsInstitutions';
import Benefits from '@/Components/Landing/Benefits';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Welcome() {
    useEffect(() => {
        AOS.init({ duration: 700, once: true, easing: 'ease-out-quart' });
        AOS.refresh();
    }, []);
    return (
        <>
            <Head title="Tu Catering" />
            <Hero />
            <About />
            <Services />
            <LevelsInstitutions />
            <Benefits />
            <CTA />
            <Footer />  
        </>
    );
}

