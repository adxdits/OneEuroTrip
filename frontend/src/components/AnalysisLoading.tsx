import React from 'react'
import { Paper, Typography, CircularProgress } from '@mui/material'

const AnalysisLoading: React.FC = () => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
    >
      <CircularProgress size={48} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.primary" gutterBottom>
        Analyzing your photo...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Finding the best flights for you
      </Typography>
    </Paper>
  )
}

export default AnalysisLoading