'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Upload, 
  Image as ImageIcon, 
  FolderOpen,
  Grid3X3,
  List,
  Calendar,
  FileImage,
  Trash2
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

const MOCK_IMAGES = [
  {
    id: '1',
    filename: 'summer-menu.jpg',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    category: 'Food',
    uploadedAt: '2024-06-15T10:00:00Z',
    size: '2.3MB'
  },
  {
    id: '2',
    filename: 'restaurant-interior.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    category: 'Interior',
    uploadedAt: '2024-06-14T15:30:00Z',
    size: '1.8MB'
  },
  {
    id: '3',
    filename: 'team-photo.jpg',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop',
    category: 'Team',
    uploadedAt: '2024-06-13T09:15:00Z',
    size: '3.1MB'
  },
  {
    id: '4',
    filename: 'special-dish.jpg',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
    category: 'Food',
    uploadedAt: '2024-06-12T18:45:00Z',
    size: '2.7MB'
  }
]

const CATEGORIES = ['All', 'Food', 'Interior', 'Team', 'Events', 'Products']

export default function ImageLibrary() {
  const [images, setImages] = useState(MOCK_IMAGES)
  const [filteredImages, setFilteredImages] = useState(MOCK_IMAGES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedImages, setSelectedImages] = useState([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        category: 'Uncategorized',
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
      }))
      
      setImages(prev => [...newImages, ...prev])
      toast.success(`${acceptedFiles.length} image(s) uploaded`)
    }
  })

  useEffect(() => {
    let filtered = images

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredImages(filtered)
  }, [images, selectedCategory, searchTerm])

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const deleteSelectedImages = () => {
    setImages(prev => prev.filter(img => !selectedImages.includes(img.id)))
    setSelectedImages([])
    toast.success(`${selectedImages.length} image(s) deleted`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-purple-600" />
            Image Library
          </CardTitle>
          <CardDescription>
            Manage your media assets and organize them for easy access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">
              {isDragActive ? 'Drop images here...' : 'Drag & drop images here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP • Up to 10 files</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions Bar */}
          {selectedImages.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedImages.length} image(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImages([])}
                >
                  Clear selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedImages}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Images Grid/List */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload some images to get started'
                }
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                : 'space-y-2'
            }>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={
                    viewMode === 'grid'
                      ? `relative group cursor-pointer ${
                          selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                        }`
                      : `flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer ${
                          selectedImages.includes(image.id) ? 'bg-blue-50 border-blue-200' : ''
                        }`
                  }
                  onClick={() => toggleImageSelection(image.id)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <img
                        src={image.thumbnail}
                        alt={image.filename}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          {image.category}
                        </Badge>
                      </div>
                      {selectedImages.includes(image.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                          ✓
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent rounded-b-lg p-2">
                        <p className="text-white text-xs truncate">{image.filename}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={image.thumbnail}
                        alt={image.filename}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{image.filename}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {image.category}
                          </Badge>
                          <span>{image.size}</span>
                          <span>{formatDate(image.uploadedAt)}</span>
                        </div>
                      </div>
                      {selectedImages.includes(image.id) && (
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                          ✓
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <span>{filteredImages.length} of {images.length} images</span>
            <span>Total storage: {images.reduce((sum, img) => sum + parseFloat(img.size), 0).toFixed(1)}MB</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}