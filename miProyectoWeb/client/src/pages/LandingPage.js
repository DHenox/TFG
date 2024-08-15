// src/pages/LandingPage.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Box } from '@mui/material';
import CustomButton from '../components/CustomButton';
import backgroundImage from '../assets/images/landing-bg.jpg';
import { useTheme } from '@mui/material/styles';

const LandingPage = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const theme = useTheme();

    if (isAuthenticated) {
        loginWithRedirect({
            appState: { returnTo: '/dashboard' },
        });
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center',
                color: theme.palette.text.primary,
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ mt: -15 }}>
                    <Typography variant="h2" gutterBottom>
                        PentestHub
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Plataforma de soporte para equipos de pentesting.
                    </Typography>
                    <CustomButton
                        text="Login"
                        onClick={loginWithRedirect}
                        sx={{
                            transition:
                                'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
                            transform: 'translateY(-3px)',
                            backgroundColor: theme.palette.secondary.main,
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                backgroundColor: theme.palette.secondary.main,
                                boxShadow: `0 2px 10px ${theme.palette.secondary.main}`,
                            },
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default LandingPage;
