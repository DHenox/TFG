import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import ScanResults from './ScanResults'; // Asegúrate de que la ruta es correcta

const ScanModal = ({ open, onClose, scanData }) => {
    console.log(scanData);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Scan result for {scanData.targetIp} ({scanData.os})
            </DialogTitle>
            <DialogContent>
                <ScanResults results={scanData} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScanModal;
