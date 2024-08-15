import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
        handleClose();
    };

    return (
        <AppBar
            sx={{
                position: 'sticky',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(10px)',
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                        to="/dashboard"
                        style={{ color: '#e5e5e5', textDecoration: 'none' }}
                    >
                        Home
                    </Link>
                </Typography>
                {isAuthenticated && (
                    <div>
                        <IconButton onClick={handleMenu} color="inherit">
                            <img
                                src={user.picture}
                                alt={user.name}
                                style={{
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    objectFit: 'cover',
                                }}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: '#1c1f24',
                                    color: '#e5e5e5',
                                },
                            }}
                        >
                            <MenuItem disabled>{user.name}</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
