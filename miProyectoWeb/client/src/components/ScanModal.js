import React from 'react';
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
} from 'recharts';

const ScanModal = ({ open, onClose, scanData, onDelete }) => {
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

    // Calcular datos de severidad para el gráfico
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

    const severityData = getSeverityData(scanData?.services || []);

    // Colores personalizados
    const COLORS = ['#ff0000', '#ff7f00', '#cccc00', '#877b01']; // CRITICAL, HIGH, MEDIUM, LOW

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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <ScanResults results={scanData?.services} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 2,
                                backgroundColor: '#2d2d2d',
                                borderRadius: 2,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
                                position: 'sticky',
                                top: '0px',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    color: '#e5e5e5',
                                    fontWeight: 'bold',
                                }}
                            >
                                Scan Severity Statistics
                            </Typography>
                            <PieChart width={320} height={450}>
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
