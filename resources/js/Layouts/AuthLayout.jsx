import Settings from '@/Components/Settings';
import { usePage } from '@inertiajs/react';
import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

function AuthLayout({ children }) {
    const { flash, serviceTypes } = usePage().props;
    const [confirmModal, setConfirmModal] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setMessage(flash.success || flash.error);
            setSeverity(flash.success ? 'success' : 'error');
            setOpen(true);
        }
    }, [flash]);

    const handleClose = () => {
        setOpen(false);
    };

    // Animation settings for the alert
    const slideBounceVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: {
            x: '0%', // Position finale
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 25,
                duration: 0.8,
            },
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div className="h-screen auto">
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={slideBounceVariants}
                    className="w-full max-w-sm"
                >
                    <Alert
                                onClose={handleClose}
                                severity={severity}
                                className="rounded-lg shadow-xl"
                            >
                                <div>
                                  
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html:message,
                                        }}
                                    />
                                </div>
                            </Alert>
                </div>
            </Snackbar>

            {children}

            {/* Settings component (presumably with settings functionality) */}
            <Settings className="z-50" />
        </div>
    );
}

export default AuthLayout;
