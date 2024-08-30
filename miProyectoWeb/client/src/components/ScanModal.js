import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import ScanResults from './ScanResults'; // Asegúrate de que la ruta es correcta

const ScanModal = ({ open, onClose, scanData }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Escaneo Resultados</DialogTitle>
            <DialogContent>
                <ScanResults results={scanData} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScanModal;
