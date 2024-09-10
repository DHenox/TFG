import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Tooltip,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import StorageIcon from '@mui/icons-material/Storage';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UpdateIcon from '@mui/icons-material/Update';
import ComputerIcon from '@mui/icons-material/Computer';

const ScanResults = ({ results }) => {
    return (
        <Box>
            {results?.map((result, index) => (
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
                                    <StorageIcon
                                        sx={{ mr: 1, color: 'info.main' }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{ color: 'text.primary', mr: 3 }}
                                    >
                                        Service: {result.serviceName}
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
                                    {/* Bola de color para el status */}
                                    <Tooltip
                                        title={`Status: ${result.portStatus}`}
                                        arrow
                                        placement="top"
                                    >
                                        <Box
                                            sx={{
                                                mr: 1.5,
                                                width: 17,
                                                height: 17,
                                                borderRadius: '50%',
                                                // Cambia el color de la bola dependiendo del status
                                                backgroundColor:
                                                    result.portStatus === 'open'
                                                        ? 'green'
                                                        : result.portStatus ===
                                                          'closed'
                                                        ? 'red'
                                                        : 'orange', // Si no es ni open ni closed, entonces es filtered
                                                position: 'relative',
                                            }}
                                        />
                                    </Tooltip>
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
                                                mb: 1,
                                            }}
                                        >
                                            <BugReportIcon
                                                sx={{
                                                    mr: 1,
                                                    color: 'error.main',
                                                }}
                                            />
                                            {vuln.cveId}
                                            <Tooltip
                                                title="Severity"
                                                arrow
                                                placement="right"
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        ml: 2,
                                                        fontWeight: 'bold',
                                                        padding: '4px 8px',
                                                        borderRadius: 1,
                                                        display: 'inline-block',
                                                        backgroundColor:
                                                            vuln.baseSeverity ===
                                                            'CRITICAL'
                                                                ? '#ff0000'
                                                                : vuln.baseSeverity ===
                                                                  'HIGH'
                                                                ? '#ff7f00'
                                                                : vuln.baseSeverity ===
                                                                  'MEDIUM'
                                                                ? '#cccc00'
                                                                : '#877b01',
                                                        color: 'black',
                                                    }}
                                                >
                                                    {`${vuln.baseScore} - ${vuln.baseSeverity}`}
                                                </Typography>
                                            </Tooltip>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.primary' }}
                                        >
                                            {vuln.description}
                                        </Typography>

                                        {/* Vulnerability Info Labels */}
                                        <Grid
                                            container
                                            spacing={1}
                                            sx={{ mt: 1 }}
                                        >
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Attack Vector"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        AV: {vuln.attackVector}
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Attack Complexity"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        AC:{' '}
                                                        {vuln.attackComplexity}
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Privileges Required"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        PR:{' '}
                                                        {
                                                            vuln.privilegesRequired
                                                        }
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="User Interaction"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        UI:{' '}
                                                        {vuln.userInteraction}
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Scope"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        S: {vuln.scope}
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Confidentiality Impact"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        C:{' '}
                                                        {
                                                            vuln.confidentialityImpact
                                                        }
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Integrity Impact"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        I:{' '}
                                                        {vuln.integrityImpact}
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Tooltip
                                                    title="Availability Impact"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.primary',
                                                            backgroundColor:
                                                                'background.default',
                                                            padding: '2px 8px',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    '#282c33',
                                                            },
                                                        }}
                                                    >
                                                        A:{' '}
                                                        {
                                                            vuln.availabilityImpact
                                                        }
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
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
