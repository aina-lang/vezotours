import { useState } from 'react';
import { Button, Snackbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CookieConsent = () => {
    const [open, setOpen] = useState(true);

    const handleAccept = () => {
        // You could save the consent to local storage or cookies here
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            style={{ bottom: 0 }}
            className="flex justify-center items-center w-full"
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md flex flex-col sm:flex-row justify-between items-center"
            >
                <Typography variant="body2" className="text-sm mb-2 sm:mb-0">
                    We use cookies to improve your experience on our site. By accepting, you agree to our use of cookies.
                </Typography>
                <div className="flex space-x-2">
                    <Button
                        variant="outlined"
                        color="inherit"
                        className="text-white border-white hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAccept}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Accept
                    </Button>
                </div>
            </motion.div>
        </Snackbar>
    );
};

export default CookieConsent;
