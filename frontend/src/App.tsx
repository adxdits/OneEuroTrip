import { useState } from 'react'
import { Container, Typography, Button, Box, AppBar, Toolbar, Card, CardContent } from '@mui/material'
import { Add } from '@mui/icons-material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vite + React + MUI
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <img src={viteLogo} style={{ height: '6em' }} alt="Vite logo" />
            <img src={reactLogo} style={{ height: '6em' }} alt="React logo" />
          </Box>
          
          <Typography variant="h2" component="h1" gutterBottom>
            Vite + React + MUI
          </Typography>
          
          <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setCount((count) => count + 1)}
                size="large"
                fullWidth
              >
                Count is {count}
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Edit <code>src/App.tsx</code> and save to test HMR
              </Typography>
            </CardContent>
          </Card>
          
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            Click on the Vite and React logos to learn more
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default App
