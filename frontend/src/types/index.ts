export interface UploadedImage {
  url: string
  file: File
}

export interface FlightResult {
  id: number
  destination: string
  price: string
  duration: string
}

export interface CameraDialogProps {
  open: boolean
  onClose: () => void
  onCapture: () => void
  videoRef: React.RefObject<HTMLVideoElement | null>
  error: string | null
}

export interface UploadAreaProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onOpenCamera: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export interface ImagePreviewProps {
  image: UploadedImage
  onClear: () => void
}

export interface FlightResultsProps {
  flights: FlightResult[]
}