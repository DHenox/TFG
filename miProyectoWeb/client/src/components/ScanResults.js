import React from 'react';
import {
    Box,
    Typography,
    CardContent,
    Divider,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
                <Accordion
                    key={index}
                    sx={{ mb: 3, backgroundColor: 'background.hover' }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon sx={{ color: '#3cf6bb' }} />
                        }
                        sx={{ backgroundColor: 'background.paper' }}
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
                                            sx={{
                                                color: 'text.primary',
                                                mr: 3,
                                            }}
                                        >
                                            Service: {result.serviceName}
                                        </Typography>
                                        <UpdateIcon
                                            sx={{
                                                mr: 1,
                                                color: 'secondary.main',
                                            }}
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
                                                    backgroundColor:
                                                        result.portStatus ===
                                                        'open'
                                                            ? 'green'
                                                            : result.portStatus ===
                                                              'closed'
                                                            ? 'red'
                                                            : 'orange',
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                mr: 3,
                                            }}
                                        >
                                            Port: {result.port}
                                        </Typography>
                                        <SwapHorizIcon
                                            sx={{
                                                mr: 1,
                                                color: 'secondary.main',
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.secondary',
                                                mr: 3,
                                            }}
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
                                                    sx={{
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    OS: {result.os}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </AccordionSummary>
                    <AccordionDetails>
                        <CardContent>
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
                                                backgroundColor:
                                                    'background.paper',
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
                                                            display:
                                                                'inline-block',
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
                                                {/* Attack Vector */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Attack Vector"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            AV:{' '}
                                                            {vuln.attackVector}
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Attack Complexity */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Attack Complexity"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            AC:{' '}
                                                            {
                                                                vuln.attackComplexity
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Privileges Required */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Privileges Required"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            PR:{' '}
                                                            {
                                                                vuln.privilegesRequired
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* User Interaction */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="User Interaction"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            UI:{' '}
                                                            {
                                                                vuln.userInteraction
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Scope */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Scope"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            S: {vuln.scope}
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Confidentiality Impact */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Confidentiality Impact"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            C:{' '}
                                                            {
                                                                vuln.confidentialityImpact
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Integrity Impact */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Integrity Impact"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
                                                        >
                                                            I:{' '}
                                                            {
                                                                vuln.integrityImpact
                                                            }
                                                        </Typography>
                                                    </Tooltip>
                                                </Grid>
                                                {/* Availability Impact */}
                                                <Grid item xs={6} sm={3}>
                                                    <Tooltip
                                                        title="Availability Impact"
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={labelStyles}
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
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

// Estilos para las etiquetas de información de vulnerabilidad
const labelStyles = {
    color: 'text.primary',
    backgroundColor: 'background.default',
    padding: '2px 8px',
    borderRadius: 1,
    textAlign: 'center',
    '&:hover': {
        backgroundColor: '#282c33',
    },
};

export default ScanResults;
