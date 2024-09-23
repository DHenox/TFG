import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
} from '@mui/material';
import ScanResults from './ScanResults';
import api from '../utils/api';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltipBar,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';

// Función para generar una lista de colores
const generateColors = (count) => {
    const colors = [];
    count += 1;
    for (let i = 1; i < count; i++) {
        const hue = (i * 360) / count; // Espaciado de color
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
};

const ScanModal = ({
    open = false,
    onClose = () => {},
    scanData = {},
    onDelete = () => {},
}) => {
    const handleDeleteScan = async () => {
        if (scanData?.id) {
            try {
                await api.deleteScan(scanData.id);
                onDelete();
                onClose();
            } catch (error) {
                console.error('Error deleting scan:', error);
            }
        }
    };

    const getSeverityData = (results) => {
        const severityCounts = {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        };

        results.forEach((result) => {
            result.vulnerabilities.forEach((vuln) => {
                severityCounts[vuln.baseSeverity] =
                    (severityCounts[vuln.baseSeverity] || 0) + 1;
            });
        });

        return Object.keys(severityCounts).map((key) => ({
            name: key,
            value: severityCounts[key],
        }));
    };

    const getBarChartData = (results) => {
        const serviceVulns = {};

        results.forEach((result) => {
            serviceVulns[`${result.serviceName} [:${result.port}]`] =
                (serviceVulns[result.serviceName] || 0) +
                result.vulnerabilities.length;
        });

        return Object.keys(serviceVulns).map((service) => ({
            name: service,
            vulnerabilities: serviceVulns[service],
        }));
    };

    const getRadarChartData = (results) => {
        const attributes = {
            AV: { NETWORK: 100, ADJACENT: 75, LOCAL: 50, PHYSICAL: 25 },
            AC: { LOW: 50, HIGH: 100 },
            PR: { NONE: 0, LOW: 50, HIGH: 100 },
            UI: { NONE: 0, REQUIRED: 100 },
            S: { UNCHANGED: 0, CHANGED: 100 },
            C: { NONE: 0, LOW: 25, HIGH: 100 },
            I: { NONE: 0, LOW: 25, HIGH: 100 },
            A: { NONE: 0, LOW: 25, HIGH: 100 },
        };

        const radarData = {
            AV: {},
            AC: {},
            PR: {},
            UI: {},
            S: {},
            C: {},
            I: {},
            A: {},
        };

        const fullNames = {
            AV: 'attackVector',
            AC: 'attackComplexity',
            PR: 'privilegesRequired',
            UI: 'userInteraction',
            S: 'scope',
            C: 'confidentialityImpact',
            I: 'integrityImpact',
            A: 'availabilityImpact',
        };

        results.forEach((result) => {
            const serviceName = result.serviceName;
            result.vulnerabilities.forEach((vuln) => {
                Object.keys(attributes).forEach((attr) => {
                    if (!radarData[attr][serviceName]) {
                        radarData[attr][serviceName] = [];
                    }
                    radarData[attr][serviceName].push(
                        attributes[attr][vuln[fullNames[attr]]] || 0
                    );
                });
            });
        });

        const radarChartData = Object.keys(radarData).map((attr) => {
            const categoryData = radarData[attr];
            const categoryValues = Object.keys(categoryData).map(
                (serviceName, index) => ({
                    [serviceName]:
                        categoryData[serviceName].reduce((a, b) => a + b, 0) /
                        categoryData[serviceName].length,
                })
            );

            return {
                category: attr,
                ...Object.assign({}, ...categoryValues),
            };
        });

        return radarChartData;
    };

    const severityData = getSeverityData(scanData?.services || []);
    const barChartData = getBarChartData(scanData?.services || []);
    const radarChartData = getRadarChartData(scanData?.services || []);

    // Generar colores dinámicos
    const serviceCount = scanData?.services?.length || 0;
    const colors = generateColors(serviceCount);
    const COLORS = ['#ff0000', '#ff7f00', '#cccc00', '#877b01'];

    // Estado para controlar qué servicios están visibles en el RadarChart
    const [hiddenServices, setHiddenServices] = useState([]);

    // Función para alternar la visibilidad de un servicio
    const toggleServiceVisibility = (serviceName) => {
        setHiddenServices((prevHiddenServices) =>
            prevHiddenServices.includes(serviceName)
                ? prevHiddenServices.filter((name) => name !== serviceName)
                : [...prevHiddenServices, serviceName]
        );
    };

    const charts = [
        {
            type: 'PieChart',
            title: 'Severity Distribution',
            component: (
                <Box
                    sx={{
                        minWidth: 600,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#e5e5e5', fontWeight: 'bold' }}
                    >
                        Severity Distribution
                    </Typography>
                    <PieChart width={600} height={400}>
                        <Pie
                            data={severityData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="40%"
                            innerRadius={90}
                            outerRadius={120}
                            fill="#3cf6bb"
                            paddingAngle={3}
                            label={({ name, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {severityData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    stroke="#3cf6bb"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: '#2d2d2d',
                                border: '1px solid #3cf6bb',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#e5e5e5' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            formatter={(value) => (
                                <span style={{ color: '#e5e5e5' }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </Box>
            ),
        },
        {
            type: 'BarChart',
            title: 'Vulnerabilities by Service',
            component: (
                <Box
                    sx={{
                        minWidth: 600,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#e5e5e5', fontWeight: 'bold' }}
                    >
                        Vulnerabilities by Service
                    </Typography>
                    <BarChart width={600} height={400} data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={110}
                        />
                        <YAxis />
                        <RechartsTooltipBar
                            contentStyle={{
                                backgroundColor: '#2d2d2d',
                                border: '1px solid #3cf6bb',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#e5e5e5' }}
                        />
                        <Bar dataKey="vulnerabilities" fill="#3cf6bb">
                            {barChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </Box>
            ),
        },
        {
            type: 'RadarChart',
            title: 'Vulnerability Attributes',
            component: (
                <Box
                    sx={{
                        minWidth: 600,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#e5e5e5', fontWeight: 'bold' }}
                    >
                        Vulnerability Attributes
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <RadarChart
                            width={600}
                            height={400}
                            data={radarChartData}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="category" />
                            <PolarRadiusAxis angle={22.5} domain={[0, 100]} />
                            {scanData?.services.map((service, index) =>
                                !hiddenServices.includes(
                                    `${service.serviceName} [:${service.port}]`
                                ) ? (
                                    <Radar
                                        key={index}
                                        name={service.serviceName}
                                        dataKey={service.serviceName}
                                        stroke={colors[index]}
                                        fill={colors[index]}
                                        fillOpacity={0.6}
                                    />
                                ) : null
                            )}
                        </RadarChart>
                        <Grid>
                            {scanData?.services.map((service, index) => (
                                <Box
                                    key={`${service.serviceName} [:${service.port}]`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        mb: 1,
                                        opacity: !hiddenServices.includes(
                                            `${service.serviceName} [:${service.port}]`
                                        )
                                            ? 1
                                            : 0.5,
                                    }}
                                    onClick={() =>
                                        toggleServiceVisibility(
                                            `${service.serviceName} [:${service.port}]`
                                        )
                                    }
                                >
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: colors[index],
                                            mr: 1,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                    >
                                        {`${service.serviceName} [:${service.port}]`}
                                    </Typography>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Scan result for IP:{' '}
                        <span style={{ color: '#3cf6bb' }}>
                            {scanData?.targetIp}
                        </span>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ mt: 1, fontWeight: 'bold' }}
                    >
                        Detected OS:{' '}
                        <span style={{ color: '#3cf6bb' }}>{scanData?.os}</span>
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            width: '100%',
                        }}
                    >
                        {charts.map((chart, index) => (
                            <Box
                                key={index}
                                sx={{ flexShrink: 0, width: 600, mr: 2 }}
                            >
                                {chart.component}
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScanResults results={scanData?.services} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button
                    onClick={handleDeleteScan}
                    variant="contained"
                    color="error"
                    sx={{ mr: 'auto' }}
                >
                    Delete Scan
                </Button>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScanModal;
