import React from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  IconButton, 
  Button 
} from '@mui/material'
import { Close, CameraAlt } from '@mui/icons-material'
import type { CameraDialogProps } from '../types'

const CameraDialog: React.FC<CameraDialogProps> = ({ 
  open, 
  onClose, 
  onCapture, 
  videoRef, 
  error 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CameraAlt sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Take a Photo
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please allow camera access in your browser settings
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              bgcolor: 'black',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onCapture}
          variant="contained"
          startIcon={<CameraAlt />}
          disabled={!!error}
          sx={{
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
            }
          }}
        >
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CameraDialog