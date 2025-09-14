'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Instagram, 
  Facebook, 
  Globe, 
  Image as ImageIcon, 
  Calendar, 
  Send,
  Sparkles,
  Hash,
  Clock,
  Zap
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'google-business', name: 'Google My Business', icon: Globe, color: 'text-green-600' }
]

export default function ContentCreator() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram'])
  const [uploadedImages, setUploadedImages] = useState([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [showOptimalTime, setShowOptimalTime] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }))
      setUploadedImages(prev => [...prev, ...newImages])
      toast.success(`${acceptedFiles.length} image(s) added`)
    }
  })

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const generateHashtags = () => {
    const hashtags = [
      '#socialmedia', '#marketing', '#business', '#entrepreneur', 
      '#digitalmarketing', '#brandstrategy', '#contentcreator', '#success'
    ].slice(0, Math.floor(Math.random() * 5) + 3)
    
    setContent(prev => prev + '\n\n' + hashtags.join(' '))
    toast.success('AI hashtags generated!')
  }

  const getOptimalTime = () => {
    const times = [
      'Today at 6:00 PM (Peak engagement)',
      'Tomorrow at 9:00 AM (Morning boost)',
      'Tomorrow at 1:00 PM (Lunch break)'
    ]
    return times[Math.floor(Math.random() * times.length)]
  }

  const handlePublish = async (action) => {
    if (!content.trim()) {
      toast.error('Please add some content to your post!')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform!')
      return
    }

    setIsPublishing(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          images: uploadedImages.map(img => img.url),
          action,
          scheduledAt: action === 'schedule' ? new Date(Date.now() + 3600000).toISOString() : null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setContent('')
        setUploadedImages([])
        setSelectedPlatforms(['instagram'])
      } else {
        toast.error('Failed to create post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }

    setIsPublishing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Create New Post
        </CardTitle>
        <CardDescription>
          Create engaging content and publish across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Input */}
        <div className="space-y-2">
          <Label htmlFor="content">Post Content</Label>
          <Textarea
            id="content"
            placeholder="What's on your mind? Share something amazing with your audience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] text-base"
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{content.length} characters</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={generateHashtags}
              className="h-auto p-1"
            >
              <Hash className="h-4 w-4 mr-1" />
              Generate hashtags
            </Button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <Label>Images</Label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <ImageIcon className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">Up to 5 images • JPG, PNG, GIF</p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <Label>Publish to</Label>
          <div className="grid gap-3">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon
              const isSelected = selectedPlatforms.includes(platform.id)
              
              return (
                <div
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${platform.color}`} />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <Switch checked={isSelected} readOnly />
                </div>
              )
            })}
          </div>
        </div>

        {/* Optimal Time Suggestion */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">AI Recommendation</span>
          </div>
          <p className="text-sm text-blue-700">
            Best time to post: <strong>{getOptimalTime()}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handlePublish('publish')}
            disabled={isPublishing}
            className="flex-1"
            size="lg"
          >
            <Send className="h-4 w-4 mr-2" />
            {isPublishing ? 'Publishing...' : 'Publish Now'}
          </Button>
          <Button
            onClick={() => handlePublish('schedule')}
            disabled={isPublishing}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Clock className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}