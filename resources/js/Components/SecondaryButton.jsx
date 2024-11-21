import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Button } from '@mui/material';
import React from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    isSticky,
    ...props
}) {
    const { paletteName } = useThemeContext(); // Get the palette name

    // Access the current palette
    const currentPalette = palette[paletteName];

    return (
        <Button
            {...props}
            type={type}
            variant="outlined" // Use outlined variant for secondary button
            sx={{
                border: `1px solid ${palette.gray[200]}`, // Border color from palette
                color: !isSticky ? 'white' : palette.gray[500], // Text color
                backgroundColor: 'transparent', // Transparent background
                padding: '6px 14px', // Compact padding
                borderRadius: '8px',
                fontSize: '0.875rem', // Smaller font size (14px)
                minWidth: '100px', // Minimum button width
                textTransform: 'none', // Avoid uppercase text
                opacity: disabled ? 0.5 : 1, // Handle opacity when disabled
                transition: 'background-color 0.2s, box-shadow 0.2s', // Smooth transition
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle background change on hover
                    // boxShadow: `0 2px 4px ${currentPalette[600]}`, // Shadow on hover
                },
                // boxShadow: `0 2px 8px rgba(0,0,0,0.1)`, // Subtle shadow using current palette

                '&:focus': {
                    outline: `2px solid ${currentPalette[300]}`, // Focus outline for accessibility
                },
            }}
            disabled={disabled}
            className={`rounded-sm ${className}`}
        >
            {children}
        </Button>
    );
}
