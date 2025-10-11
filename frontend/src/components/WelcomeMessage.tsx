import React from 'react'
import { Box, Typography } from '@mui/material'

const WelcomeMessage: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          mb: 2 
        }}
      >
        Discover Your Next Adventure
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 400,
          mb: 1
        }}
      >
        Upload a photo of your dream destination
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
        }}
      >
        We'll find the best flights to get you there
      </Typography>
    </Box>
  )
}

export default WelcomeMessage