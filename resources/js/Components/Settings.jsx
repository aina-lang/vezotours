import {
    Box,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Palette } from '@mui/icons-material';
import { Moon, SettingsIcon, Sun } from 'lucide-react';

export default function Settings({ isGuest, isSticky }) {
    const { changePalette, paletteName } = useThemeContext();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen((prevState) => !prevState);
    };
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('dark-mode') === 'true';
    });

    useEffect(() => {
        const darkMode = localStorage.getItem('dark-mode');

        if (darkMode === 'false' || !darkMode) {
            document.querySelector('html').classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        } else {
            document.querySelector('html').classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        }
    }, [isDarkMode]);

    const toDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode.toString());
            return newMode;
        });
    };
    const toLightMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode.toString());
            return newMode;
        });
    };

    return (
        <div className='z-50'>
            <IconButton
                onClick={toggleDrawer}
                sx={
                    !isGuest
                        ? {
                              position: 'fixed',
                              right: 16,
                              bottom: 16,
                              backgroundColor: palette[paletteName][500],
                              color: 'white',
                              '&:hover': {
                                  backgroundColor: palette[paletteName][600],
                              },
                              boxShadow: 3,
                              borderRadius: '50%',
                              padding: 1.5,
                          }
                        : {
                              color: !isSticky ? 'white' : palette['gray'][600],
                          }
                }
            >
                <SettingsIcon />
            </IconButton>

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer}
                className="bg-white/50 backdrop-blur-sm"
            >
                <Box
                    sx={{
                        width: 400, // Adjusted width for more space
                        padding: 3,
                    }}
                    role="presentation"
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Paramètres
                    </Typography>
                    <Divider />
                    <Box className="my-5" />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                Mode actuel : {isDarkMode ? 'sombre' : 'light'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className="grid grid-cols-2" gap={4}>
                            <button
                                onClick={toLightMode}
                                disabled={!isDarkMode}
                                className={`flex items-center justify-center rounded-lg border p-6 ${isDarkMode ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-400 bg-gray-200 text-gray-500'} hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 ${!isDarkMode && 'cursor-not-allowed opacity-50'} transition duration-200 ease-in-out`}
                            >
                                <Sun className="h-8 w-8" />
                            </button>

                            <button
                                onClick={toDarkMode}
                                disabled={isDarkMode}
                                className={`flex items-center justify-center rounded-lg border p-6 ${isDarkMode ? 'border-gray-500 bg-gray-700 text-gray-100' : 'border-gray-800 bg-black text-white'} hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 ${isDarkMode && 'cursor-not-allowed opacity-50'} transition duration-200 ease-in-out`}
                            >
                                <Moon className="h-8 w-8" />
                            </button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                Palette actuelle : {paletteName}
                            </Typography>
                        </Grid>
                        {Object.entries(palette).map(([key, value]) => (
                            <Grid item xs={3} key={key}>
                                <button
                                    onClick={() => changePalette(key)}
                                    className="flex w-full flex-col items-center justify-center rounded-md focus:outline-none"
                                >
                                    <Palette
                                        className="mr-2"
                                        sx={{
                                            color: value[500],
                                            // color: 'white',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                cColor: value[600],
                                            },
                                        }}
                                    />{' '}
                                    {/* Adjust color here */}
                                    <span className="font-semibold text-gray-900">
                                        {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                    </span>
                                </button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Drawer>
        </div>
    );
}
