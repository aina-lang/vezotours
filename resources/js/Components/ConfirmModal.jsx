import { Warning } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

const ConfirmModal = ({ open, onClose, onConfirm, title, content }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="custom-confirmation-dialog-title"
            aria-describedby="custom-confirmation-dialog-description"
            className="bg-white/50 backdrop-blur-sm"
        >
            <DialogTitle
                id="custom-confirmation-dialog-title"
                className="flex items-center justify-between"
            >
                {title}
                <Warning
                    fontSize="large"
                    className="h-8 w-8 rounded-full bg-gray-200 p-2"
                />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="custom-confirmation-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button
                    onClick={onConfirm}
                    className="text mb-2 inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-900"
                >
                    Confirmer
                </button>
                <button
                    onClick={onClose}
                    className="mb-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 disabled:opacity-25"
                    autoFocus
                >
                    Annuler
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
