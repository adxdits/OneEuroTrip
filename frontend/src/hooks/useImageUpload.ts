import { useState, useRef, useEffect } from 'react'
import camera from '../utils/camera'
import type { UploadedImage, FlightResult } from '../types'
import { searchFlights } from '../services/flightApi'

// Backend API URL - Using Vite proxy
const API_URL = '/api/image'
export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [flightResults, setFlightResults] = useState<FlightResult[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [originAirport, setOriginAirport] = useState<string>('')
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().split('T')[0]
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true)
    setFlightResults([])
    setCameraError(null)
    
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/recognize`, {
      method: 'POST',
      body: formData,
    }).catch(() => null)

    if (response?.ok) {
      const data = await response.json().catch(() => null)
      
      if (data?.monument && data?.city) {
        const flights = await searchFlights(data.city, originAirport, departureDate).catch(() => [])
        
        const flightsWithContext = flights.map(flight => ({
          ...flight,
          monument: data.monument,
          city: data.city,
          country: data.country
        }))
        
        setFlightResults(flightsWithContext)
      }
    }
    
    setIsAnalyzing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage({ url, file })
      analyzeImage(file)
    }
  }

  const handleOpenCamera = () => {
    setCameraError(null)
    setIsCameraOpen(true)
  }

  useEffect(() => {
    let mounted = true

    const startCameraStream = async () => {
      if (!isCameraOpen) return

      let attempts = 0
      while (!videoRef.current && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }

      if (!videoRef.current) {
        setCameraError('Failed to initialize camera dialog')
        setIsCameraOpen(false)
        return
      }

      try {
        await camera.startCamera(videoRef.current, 680, 480)
        
        if (!mounted) return
        
        videoRef.current.muted = true
        const playPromise = videoRef.current.play()
        
        if (playPromise !== undefined) {
          await playPromise
        }
      } catch (error) {
        if (!mounted) return
        
        let errorMessage = 'Failed to access camera'
        if (error instanceof Error) {
          errorMessage = error.message
          if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera permission denied. Please allow camera access.'
          } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found on this device.'
          }
        }
        setCameraError(errorMessage)
        setIsCameraOpen(false)
      }
    }

    startCameraStream()

    return () => {
      mounted = false
    }
  }, [isCameraOpen])

  const handleTakeSnapshot = () => {
    const snapshot = camera.takeSnapshot()
    if (snapshot) {
      fetch(snapshot)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-snapshot.png', { type: 'image/png' })
          const url = snapshot
          setUploadedImage({ url, file })
          handleCloseCamera()
          analyzeImage(file)
        })
    }
  }

  const handleCloseCamera = () => {
    camera.stopCamera()
    setIsCameraOpen(false)
    setCameraError(null)
  }

  const handleClearImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url)
    }
    setUploadedImage(null)
    setFlightResults([])
    setIsAnalyzing(false)
  }

  return {
    uploadedImage,
    isAnalyzing,
    flightResults,
    isCameraOpen,
    cameraError,
    originAirport,
    setOriginAirport,
    departureDate,
    setDepartureDate,
    fileInputRef,
    videoRef,
    handleFileUpload,
    handleOpenCamera,
    handleTakeSnapshot,
    handleCloseCamera,
    handleClearImage,
  }
}