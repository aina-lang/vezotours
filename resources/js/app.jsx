import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import CustomThemeProvider from './contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <CustomThemeProvider>
                    <App {...props} />
                </CustomThemeProvider>,
            );
            return;
        }

        createRoot(el).render(
            <CustomThemeProvider>
                <App {...props} />
            </CustomThemeProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
