'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Instagram,
  Facebook,
  Globe,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  Image as ImageIcon,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'

const PLATFORM_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  'google-business': Globe
}

const PLATFORM_COLORS = {
  instagram: 'text-pink-500',
  facebook: 'text-blue-600',
  'google-business': 'text-green-600'
}

const STATUS_CONFIG = {
  published: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    label: 'Published',
    borderColor: 'border-green-200'
  },
  scheduled: { 
    icon: Clock, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50', 
    label: 'Scheduled',
    borderColor: 'border-blue-200'
  },
  failed: { 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    label: 'Failed',
    borderColor: 'border-red-200'
  },
  paused: { 
    icon: PauseCircle, 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50', 
    label: 'Paused',
    borderColor: 'border-yellow-200'
  }
}

const MOCK_POSTS = [
  {
    id: '1',
    content: 'Excited to share our new summer menu! 🌞 Fresh ingredients, bold flavors, and perfect for the season. Come taste the difference! #SummerMenu #FreshFood #LocalIngredients',
    platforms: ['instagram', 'facebook'],
    status: 'published',
    scheduledAt: '2024-06-15T10:00:00Z',
    publishedAt: '2024-06-15T10:00:00Z',
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'],
    engagement: { likes: 245, comments: 18, shares: 12 }
  },
  {
    id: '2',
    content: 'Behind the scenes: Our amazing team prepping for tonight\'s dinner service! The dedication and passion they bring every day is incredible. 👨‍🍳👩‍🍳 #TeamWork #BehindTheScenes',
    platforms: ['instagram'],
    status: 'scheduled',
    scheduledAt: '2024-06-16T18:00:00Z',
    publishedAt: null,
    images: ['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop'],
    engagement: { likes: 0, comments: 0, shares: 0 }
  },
  {
    id: '3',
    content: 'Weekend special alert! 🚨 Our signature pasta with truffle oil is back by popular demand. Available this Saturday and Sunday only. Book your table now! #WeekendSpecial #TrufflePasta',
    platforms: ['instagram', 'facebook', 'google-business'],
    status: 'scheduled',
    scheduledAt: '2024-06-17T14:00:00Z',
    publishedAt: null,
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'],
    engagement: { likes: 0, comments: 0, shares: 0 }
  },
  {
    id: '4',
    content: 'Customer appreciation post! 💝 Thank you to all our wonderful guests who make what we do worthwhile. Your smiles and feedback inspire us every day! #CustomerLove #Grateful',
    platforms: ['facebook'],
    status: 'failed',
    scheduledAt: '2024-06-14T16:00:00Z',
    publishedAt: null,
    images: [],
    engagement: { likes: 0, comments: 0, shares: 0 }
  }
]

export default function PostScheduler() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [activeTab, setActiveTab] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState(MOCK_POSTS)

  useEffect(() => {
    const filtered = activeTab === 'all' 
      ? posts 
      : posts.filter(post => post.status === activeTab)
    
    setFilteredPosts(filtered.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)))
  }, [posts, activeTab])

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== postId))
        toast.success('Post deleted successfully')
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleRetryPost = async (postId) => {
    try {
      // In a real app, this would retry the failed post
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'scheduled', scheduledAt: new Date(Date.now() + 3600000).toISOString() }
          : post
      ))
      toast.success('Post rescheduled successfully')
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (diffDays > 0) {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit' 
      })
    }
  }

  const getTabCounts = () => {
    return {
      all: posts.length,
      scheduled: posts.filter(p => p.status === 'scheduled').length,
      published: posts.filter(p => p.status === 'published').length,
      failed: posts.filter(p => p.status === 'failed').length
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Post Scheduler
          </CardTitle>
          <CardDescription>
            Manage your scheduled and published content across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                Scheduled
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.scheduled}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="published" className="flex items-center gap-2">
                Published
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.published}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="failed" className="flex items-center gap-2">
                Failed
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.failed}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab === 'all' ? '' : activeTab} posts
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'scheduled' 
                      ? 'Schedule your first post to see it here'
                      : activeTab === 'published'
                      ? 'Published posts will appear here'
                      : activeTab === 'failed'
                      ? 'Failed posts will appear here for retry'
                      : 'Create your first post to get started'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => {
                    const StatusIcon = STATUS_CONFIG[post.status].icon
                    const statusConfig = STATUS_CONFIG[post.status]
                    
                    return (
                      <Card key={post.id} className={`${statusConfig.borderColor} border-l-4`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              {/* Status and Platforms */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}>
                                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {post.platforms.map((platform) => {
                                      const PlatformIcon = PLATFORM_ICONS[platform]
                                      const platformColor = PLATFORM_COLORS[platform]
                                      return (
                                        <PlatformIcon 
                                          key={platform}
                                          className={`h-4 w-4 ${platformColor}`}
                                        />
                                      )
                                    })}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {post.status === 'published' && post.publishedAt
                                    ? `Published ${formatDateTime(post.publishedAt)}`
                                    : `Scheduled for ${formatDateTime(post.scheduledAt)}`
                                  }
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex gap-4">
                                {post.images.length > 0 && (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={post.images[0]}
                                      alt="Post preview"
                                      className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    {post.images.length > 1 && (
                                      <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        +{post.images.length - 1}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-gray-900 line-clamp-3">
                                    {post.content}
                                  </p>
                                </div>
                              </div>

                              {/* Engagement (for published posts) */}
                              {post.status === 'published' && (
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                  <span>{post.engagement.likes} likes</span>
                                  <span>{post.engagement.comments} comments</span>
                                  <span>{post.engagement.shares} shares</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              {post.status === 'failed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetryPost(post.id)}
                                >
                                  Retry
                                </Button>
                              )}
                              {post.status === 'scheduled' && (
                                <Button size="sm" variant="outline">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}