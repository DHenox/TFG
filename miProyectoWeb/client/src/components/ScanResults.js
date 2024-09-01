import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Grid,
    Chip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UpdateIcon from '@mui/icons-material/Update';
import DnsIcon from '@mui/icons-material/Dns';
import ComputerIcon from '@mui/icons-material/Computer'; // Icono para mostrar OS

const ScanResults = ({ results }) => {
    return (
        <Box sx={{ p: 2 }}>
            {results.map((result, index) => (
                <Card
                    key={index}
                    sx={{
                        mb: 3,
                        backgroundColor: 'background.hover',
                        borderRadius: 2,
                    }}
                >
                    <CardContent>
                        <Grid container spacing={2}>
                            {/* Service and Version Information */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <PlumbingIcon
                                        sx={{ mr: 1, color: 'info.main' }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{ color: 'text.primary', mr: 3 }}
                                    >
                                        Service: {result.service}
                                    </Typography>
                                    <UpdateIcon
                                        sx={{ mr: 1, color: 'secondary.main' }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Version: {result.version}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Port, Protocol, Status, and OS Information */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <DnsIcon
                                        sx={{ mr: 1, color: 'info.main' }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'text.primary', mr: 3 }}
                                    >
                                        Port: {result.port}
                                    </Typography>
                                    <SwapHorizIcon
                                        sx={{ mr: 1, color: 'secondary.main' }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'text.secondary', mr: 3 }}
                                    >
                                        Protocol: {result.protocol}
                                    </Typography>
                                    <Chip
                                        label={result.status.toUpperCase()}
                                        color={
                                            result.status === 'open'
                                                ? 'success'
                                                : 'error'
                                        }
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem',
                                            color: 'background.paper',
                                            mr: 3,
                                        }}
                                    />
                                    {result.os && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ComputerIcon
                                                sx={{
                                                    mr: 1,
                                                    color: 'info.main',
                                                }}
                                            />
                                            <Typography
                                                variant="body1"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                OS: {result.os}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Vulnerabilities Section */}
                        <Divider
                            sx={{ my: 2, borderColor: 'text.secondary' }}
                        />
                        {result.vulnerabilities.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'error.main',
                                        mb: 2,
                                    }}
                                >
                                    <SecurityIcon sx={{ mr: 1 }} />
                                    Vulnerabilities Found
                                </Typography>
                                {result.vulnerabilities.map((vuln, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            borderRadius: 1,
                                            backgroundColor: 'background.paper',
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontWeight: 'bold',
                                                color: 'error.main',
                                                mb: 1,
                                            }}
                                        >
                                            <BugReportIcon sx={{ mr: 1 }} />
                                            {vuln.id}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.primary' }}
                                        >
                                            <strong>Severity:</strong>{' '}
                                            {vuln.severity}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 1,
                                                color: 'text.secondary',
                                            }}
                                        >
                                            {vuln.description}
                                        </Typography>
                                        <Button
                                            component="a"
                                            startIcon={<OpenInNewIcon />}
                                            href={vuln.link}
                                            target="_blank"
                                            variant="outlined"
                                            sx={{
                                                color: 'secondary.main',
                                                borderColor: 'secondary.main',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'background.paper',
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                No vulnerabilities found.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ScanResults;
