import React from 'react'
import { Paper, Stack, Box, Typography, Button } from '@mui/material'
import { PhotoCamera, Image as ImageIcon } from '@mui/icons-material'
import type { UploadAreaProps } from '../types'

const UploadArea: React.FC<UploadAreaProps> = ({ 
  onFileUpload, 
  onOpenCamera, 
  fileInputRef 
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 6, 
        textAlign: 'center',
        border: '2px dashed #DDDDDD',
        bgcolor: 'background.paper',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: '#FFF5F7',
        }
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9
          }}
        >
          <ImageIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography variant="h6" color="text.primary" fontWeight={600}>
          Share your inspiration
        </Typography>

        <Stack direction="row" spacing={2}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileUpload}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<ImageIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
              }
            }}
          >
            Choose from Gallery
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<PhotoCamera />}
            onClick={onOpenCamera}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                bgcolor: 'rgba(255, 56, 92, 0.04)',
              }
            }}
          >
            Take Photo
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Supported formats: JPG, PNG, HEIC
        </Typography>
      </Stack>
    </Paper>
  )
}

export default UploadArea