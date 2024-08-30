import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ScanResults = ({ results }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Resultados del Escaneo
            </Typography>
            {results.map((result, index) => (
                <Card key={index} sx={{ mb: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {result.service} ({result.port})
                        </Typography>
                        <Typography color="text.secondary">
                            Protocol: {result.protocol}
                        </Typography>
                        <Typography color="text.secondary">
                            Version: {result.version}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Status:</strong> {result.status}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        {result.vulnerabilities.length > 0 ? (
                            result.vulnerabilities.map((vuln, i) => (
                                <Box key={i} sx={{ mb: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        color="error"
                                    >
                                        {vuln.id}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Severity:</strong>{' '}
                                        {vuln.severity}
                                    </Typography>
                                    <Typography variant="body2">
                                        {vuln.description}
                                    </Typography>
                                    <Button
                                        component="a"
                                        startIcon={<OpenInNewIcon />}
                                        href={vuln.link}
                                        target="_blank"
                                        sx={{ mt: 1 }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
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
