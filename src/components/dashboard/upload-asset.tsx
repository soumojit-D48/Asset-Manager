'use client'

import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { uploadAssetAction } from "@/actions/dashboard-actions";

type Category = {
  id: number,
  name: string,
  createdAt: Date
}

type FormState = {
  title: string,
  description: string,
  categoryId: string,
  file: File | null
}

type CloudinarySignature = {
  signature: string,
  timestamp: number,
  apiKey: string
}

interface UploadDialogProps {
  categories: Category[]
}

function UploadAsset({categories} : UploadDialogProps) {

  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgessStatus, setUploadProgessStatus] = useState(0)
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    categoryId: '',
    file: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} =  e.target
    setFormState(prev => ({...prev, [name] : value}))
  }

  const handleCategoryChange = (value: string) => {
    // console.log(value);
    setFormState(prev => ({...prev, categoryId: value}))
    
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      setFormState(prev => ({...prev, file}))
    }
  }
  // console.log(formState);

  async function getCloudinarySignature(): Promise<CloudinarySignature> {
    const timestamp = Math.round(new Date().getTime() / 1000)

    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({timestamp})
    })

    if(!response.ok) {
      throw new Error("Failed to create  cloudinary signature")
    }

    return response.json()
  }
  

  const handleAssetUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsUploading(true)
    setUploadProgessStatus(0)

    try {
      const {signature, apiKey, timestamp} = await getCloudinarySignature()
      // console.log(signature, apiKey, timestamp);

      const cloudinaryData = new FormData()

      cloudinaryData.append('file', formState.file as File)
      cloudinaryData.append('api_key', apiKey)
      cloudinaryData.append('timestamp', timestamp.toString())
      cloudinaryData.append('signature', signature)
      cloudinaryData.append('folder', 'cloudinary-assets-store')

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`)

      xhr.upload.onprogress = (event) => {
        if(event.lengthComputable){
          const progess = Math.round((event.loaded / event.total) * 100)
          setUploadProgessStatus(progess)
        }
      }

      const cloudinaryPromise = new Promise<any> ((resolve, reject) => {
        xhr.onload = () => {
          if(xhr.status >= 200 && xhr.status < 300) { // success
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } 
          else {
            reject(new Error('Upload to Cloudinary failed!'))
          }
        }

        xhr.onerror = () => reject(new Error('Upload to Cloudinary failed!'))
      })

      xhr.send(cloudinaryData)

      const cloudinaryResponse = await cloudinaryPromise
      console.log("cloudinaryResponse", cloudinaryResponse);
      

      const formData = new FormData()
      formData.append('title', formState.title)
      formData.append('description', formState.description)
      formData.append('categoryId', formState.categoryId)
      formData.append('fileUrl', cloudinaryResponse.secure_url)
      formData.append('thumbnailUrl', cloudinaryResponse.secure_url)

      // upload this asset to DB // Action
      
      const result = await uploadAssetAction(formData)

      if(result.success) {
        setOpen(false)
        setFormState({
          title: '',
          description: '',
          categoryId: '',
          file: null
        }) 
      }
      else {
        throw new Error(result?.error)
      }

    } catch (e) {
      console.error(e);
      
    } finally {
      setIsUploading(false)
      setUploadProgessStatus(0)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="mr-2 w-4 h-4" />
          Upload Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Asset</DialogTitle>
          <DialogDescription>Upload a new asset</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAssetUpload} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Title"
              value={formState.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formState.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formState.categoryId} onValueChange={handleCategoryChange}> {/* this will not gave the event it gives a value */}
              <SelectTrigger>
                <SelectValue placeholder="Select a category">
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {
                  categories.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            />
          </div>

          {
            isUploading && uploadProgessStatus > 0 && (
              <div className="mb-5 w-full bg-stone-100 rounded-full h-2 ">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{width: `${uploadProgessStatus}%`}}
                />
                <p className="text-xs text-slate-500 mt-2 text-right">
                  {uploadProgessStatus}% upload
                </p>
              </div>
            )
          }

        <DialogFooter className="mt-6">
        <Button type="submit">
          <Upload className="mr-2 h-5 w-5"/>
          Upload Asset
        </Button>
      </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  );
}

export default UploadAsset;