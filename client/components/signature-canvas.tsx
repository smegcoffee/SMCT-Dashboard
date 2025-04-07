"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Pen } from "lucide-react"

interface SignatureCanvasProps {
  onChange: (value: string) => void
  value?: string
}

export function SignatureCanvas({ onChange, value }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
  
    const context = canvas.getContext("2d")
    if (!context) return
  
    // Adjust for high-DPI displays
    const dpi = window.devicePixelRatio || 1
    const width = canvas.clientWidth * dpi
    const height = canvas.clientHeight * dpi
  
    canvas.width = width
    canvas.height = height
  
    context.scale(dpi, dpi) // Ensure drawing scales correctly
    context.lineWidth = 2
    context.lineCap = "round"
    context.strokeStyle = "#000"
  
    setCtx(context)
  
    // Redraw existing signature if available
    if (value) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0, width, height)
      }
      img.src = value
    }
  }, [value])
  

  // Handle mouse/touch events
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
  
    const rect = canvas.getBoundingClientRect()
    const dpi = window.devicePixelRatio || 1
  
    let x, y
    if ("touches" in e) {
      x = (e.touches[0].clientX - rect.left) * dpi
      y = (e.touches[0].clientY - rect.top) * dpi
    } else {
      x = (e.clientX - rect.left) * dpi
      y = (e.clientY - rect.top) * dpi
    }
  
    return { x, y }
  }
  
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return
  
    setIsDrawing(true)
    const { x, y } = getCanvasCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return
  
    const { x, y } = getCanvasCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  

  const stopDrawing = () => {
    if (!isDrawing || !ctx || !canvasRef.current) return

    setIsDrawing(false)
    ctx.closePath()

    // Save the signature as data URL
    const dataUrl = canvasRef.current.toDataURL("image/png")
    onChange(dataUrl)
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onChange("")
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={clearCanvas}>
          <Eraser className="h-4 w-4" />
          <span>Clear</span>
        </Button>
        <div className="text-xs text-muted-foreground flex items-center">
          <Pen className="h-3 w-3 mr-1" />
          Sign using your mouse or finger
        </div>
      </div>
    </div>
  )
}

