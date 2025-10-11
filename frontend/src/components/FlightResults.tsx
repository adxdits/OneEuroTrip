import React from 'react'
import { Box, Typography, Stack, Paper, Chip, Button } from '@mui/material'
import { Flight } from '@mui/icons-material'
import type { FlightResultsProps } from '../types'

const FlightResults: React.FC<FlightResultsProps> = ({ flights }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Flight sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Available Flights
        </Typography>
      </Box>

      <Stack spacing={2}>
        {flights.map((flight) => (
          <Paper 
            key={flight.id}
            elevation={0}
            sx={{ 
              p: 3,
              bgcolor: 'white',
              border: '1px solid #EBEBEB',
              borderRadius: 3,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                  {flight.destination}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    label={flight.duration} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'secondary.light',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    Direct flight
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                  {flight.price}
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)',
                    }
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default FlightResults