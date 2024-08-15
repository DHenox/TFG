// src/components/CustomButton.js
import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({
    text,
    onClick,
    variant = 'contained',
    sx,
    color = 'primary',
}) => (
    <Button variant={variant} onClick={onClick} color={color} sx={sx}>
        {text}
    </Button>
);

export default CustomButton;
