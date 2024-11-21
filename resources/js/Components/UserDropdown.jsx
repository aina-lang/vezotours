import { Avatar, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { LogOut } from 'lucide-react';
import React, { useState } from 'react';

function UserDropdown({ auth, handleLogout, menuItems }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <Avatar sx={{ bgcolor: 'gray' }}>
                    {auth.user.nom
                        .split(' ')
                        .map((part) => part.charAt(0).toUpperCase())
                        .join('')}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <div className="px-4 py-2 text-sm text-gray-700">
                    Connecté en tant que:
                    <div className="font-bold">{auth.user.nom}</div>
                </div>
                <Divider />

                {/* Dynamic menu items */}
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            item.action();
                            handleClose();
                        }}
                    >
                        {/* <span className="mr-2">{item.icon && item.icon}</span> */}
                        {item.label}
                    </MenuItem>
                ))}

                <Divider />
                <MenuItem
                    onClick={() => {
                        handleLogout();
                        handleClose();
                    }}
                >
                    <LogOut className="mr-2" /> Se déconnecter
                </MenuItem>
            </Menu>
        </div>
    );
}

export default UserDropdown;
