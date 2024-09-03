import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import ScanResults from './ScanResults';
import api from '../utils/api';

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Scan result for IP:{' '}
                        <span style={{ color: '#1976d2' }}>
                            {scanData?.targetIp}
                        </span>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ mt: 1, fontWeight: 'bold' }}
                    >
                        Detected OS:{' '}
                        <span style={{ color: '#1976d2' }}>{scanData?.os}</span>
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <ScanResults results={scanData?.services} />
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
