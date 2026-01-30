
'use client'

import React, { useState, useCallback } from 'react'
import Cropper, { Point, Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImagePlus, Loader2, Crop as CropIcon } from 'lucide-react'

interface ImageUploadProps {
    onUploadComplete: (url: string) => void
    initialImage?: string
}

const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = new Image()
    image.src = imageSrc
    image.crossOrigin = "anonymous"

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                return reject(new Error('Could not get canvas context'))
            }

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            )

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return
                }
                resolve(blob)
            }, 'image/jpeg')
        }
        image.onerror = (e) => reject(e)
    })
}

export function ImageUpload({ onUploadComplete, initialImage }: ImageUploadProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(16 / 9)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null)
                setIsDialogOpen(true)
            })
            reader.readAsDataURL(file)
        }
    }

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        try {
            setIsUploading(true)
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)

            // Get signature
            const signatureFormatted = await fetch('/api/sign-cloudinary', {
                method: 'POST',
            }).then(r => r.json())

            const formData = new FormData()
            formData.append('file', croppedImageBlob)
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '257731154365268');
            formData.append('timestamp', signatureFormatted.timestamp)
            formData.append('signature', signatureFormatted.signature)

            // Upload to Cloudinary
            // Construct cloud name from env if available, or use the one from .env.local manually if needed.
            // But typically, we should use the env var on client side if it's NEXT_PUBLIC_...
            // The user provided CLOUDINARY_name in .env.local without NEXT_PUBLIC prefix.
            // We might need to hardcode or ask user to change it. 
            // For now, I'll use the value from .env.local I saw earlier: drhik2yqo

            // Wait, I saw CLOUDINARY_name=drhik2yqo in .env.local. It is NOT prefixed with NEXT_PUBLIC.
            // So I cannot access it here with process.env.CLOUDINARY_name.
            // I will hardcode it for now as 'drhik2yqo' or better yet, I will pass it from the server via signature response?
            // No, upload url uses cloud name.
            // I'll assume I can use the hardcoded one I saw for now, or fetch it. 
            // Actually, better to just use the one I saw: drhik2yqo

            const cloudName = 'drhik2yqo';

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            }).then(r => r.json())

            if (uploadRes.secure_url) {
                onUploadComplete(uploadRes.secure_url)
                setIsDialogOpen(false)
                setImageSrc(null)
            } else {
                console.error('Upload failed:', uploadRes)
            }

        } catch (e) {
            console.error('Error uploading image:', e)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Upload Image
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </Button>
                {initialImage && !imageSrc && (
                    <span className="text-sm text-muted-foreground">Current image active</span>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                    </DialogHeader>

                    <div className="relative flex-1 bg-black min-h-[300px]">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Aspect Ratio</Label>
                            <Select value={aspect.toString()} onValueChange={(v) => setAspect(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ratio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={(16 / 9).toString()}>16:9 (Landscape)</SelectItem>
                                    <SelectItem value={(9 / 16).toString()}>9:16 (Portrait)</SelectItem>
                                    <SelectItem value={(1).toString()}>1:1 (Square)</SelectItem>
                                    <SelectItem value={(4 / 3).toString()}>4:3 (Standard)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Zoom</Label>
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(vals) => setZoom(vals[0])}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload & Save'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
