import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowUpToLine } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const { paletteName } = useThemeContext(); // Obtenez le nom de la palette

    // Accédez à la palette actuelle
    const currentPalette = palette[paletteName];
    return (
        <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-10 right-10 z-50 rounded-full p-3 text-white shadow-md ${
                isVisible ? 'block' : 'hidden'
            }`}
            style={{ background: currentPalette[500] }}
        >
            <ArrowUpToLine />
        </motion.button>
    );
};
