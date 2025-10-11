import React from 'react'
import { Paper, Box, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import type { ImagePreviewProps } from '../types'

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onClear }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        position: 'relative'
      }}
    >
      <IconButton
        onClick={onClear}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'white',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'grey.100'
          }
        }}
      >
        <Close />
      </IconButton>
      <Box
        component="img"
        src={image.url}
        alt="Uploaded"
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'cover',
          borderRadius: 2,
        }}
      />
    </Paper>
  )
}

export default ImagePreview