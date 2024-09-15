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
    for (let i = 0; i < count; i++) {
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
    const [hiddenServices, setHiddenServices] = useState([]);

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
            serviceVulns[result.serviceName] =
                (serviceVulns[result.serviceName] || 0) +
                result.vulnerabilities.length;
        });

        return Object.keys(serviceVulns).map((service) => ({
            name: service,
            value: serviceVulns[service],
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

        console.log('radarChartData:', radarChartData);

        return radarChartData;
    };

    const severityData = getSeverityData(scanData?.services || []);
    const barChartData = getBarChartData(scanData?.services || []);
    const radarChartData = getRadarChartData(scanData?.services || []);

    // Generar colores dinámicos
    const serviceCount = scanData?.services?.length || 0;
    const colors = generateColors(serviceCount);
    const COLORS = ['#ff0000', '#ff7f00', '#cccc00', '#877b01'];

    const toggleServiceVisibility = (serviceName) => {
        if (hiddenServices.includes(serviceName)) {
            setHiddenServices(hiddenServices.filter((name) => name !== serviceName));
        } else {
            setHiddenServices([...hiddenServices, serviceName]);
        }
    };

    const isServiceVisible = (serviceName) => !hiddenServices.includes(serviceName);

    const charts = [
        {
            type: 'PieChart',
            title: 'Severity Distribution',
            component: (
                <Box sx={{ minWidth: 600, p: 1 }}>
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
                <Box sx={{ minWidth: 600, p: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#e5e5e5', fontWeight: 'bold' }}
                    >
                        Vulnerabilities by Service
                    </Typography>
                    <BarChart width={600} height={400} data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltipBar
                            contentStyle={{
                                backgroundColor: '#2d2d2d',
                                border: '1px solid #3cf6bb',
                                borderRadius: '8px',
                            }}
                            itemStyle={{ color: '#e5e5e5' }}
                        />
                        <Bar dataKey="value" fill="#3cf6bb" />
                    </BarChart>
                </Box>
            ),
        },
        {
            type: 'RadarChart',
            title: 'Vulnerability Attributes',
            component: (
                <Box sx={{ minWidth: 600, p: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, color: '#e5e5e5', fontWeight: 'bold' }}
                    >
                        Vulnerability Attributes
                    </Typography>
                    <RadarChart
                        outerRadius={120}
                        width={600}
                        height={400}
                        data={radarChartData}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {scanData?.services.map((service, index) => (
                            isServiceVisible(service.serviceName) && (
                                <Radar
                                    key={index}
                                    name={service.serviceName}
                                    dataKey={service.serviceName}
                                    stroke={colors[index]}
                                    fill={colors[index]}
                                    fillOpacity={0.6}
                                />
                            )
                        ))}
                        <Legend
                            verticalAlign="bottom"
                            layout="horizontal"
                            wrapperStyle={{
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}
                            payload={scanData?.services.map((service, index) => ({
                                id: service.serviceName,
                                type: 'square',
                                value: service.serviceName,
                                color: colors[index],
                            }))}
                            onClick={(e) => toggleServiceVisibility(e.id)}
                        />
                    </RadarChart>
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
