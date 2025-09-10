import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Hero from '@/Components/Landing/Hero';
import About from '@/Components/Landing/About';
import Services from '@/Components/Landing/Services';
import LevelsInstitutions from '@/Components/Landing/LevelsInstitutions';
import Benefits from '@/Components/Landing/Benefits';
import CTA from '@/Components/Landing/CTA';
import Footer from '@/Components/Landing/Footer';

export default function Welcome() {
    useEffect(() => {
        
        const ensureAOSCSS = () => {
            if (document.querySelector('link[data-aos]')) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/aos@2.3.4/dist/aos.css';
            link.setAttribute('data-aos', 'true');
            document.head.appendChild(link);
        };

        const ensureAOSScript = () => new Promise((resolve, reject) => {
            if (window.AOS) return resolve(window.AOS);
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/aos@2.3.4/dist/aos.js';
            script.async = true;
            script.onload = () => resolve(window.AOS);
            script.onerror = reject;
            document.head.appendChild(script);
        });

        let mounted = true;
        ensureAOSCSS();
        ensureAOSScript()
            .then((AOS) => {
                if (!mounted || !AOS) return;
                AOS.init({ duration: 600, once: true });
            })
            .catch((e) => console.warn('AOS no disponible (CDN):', e));

        return () => { mounted = false; };
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

