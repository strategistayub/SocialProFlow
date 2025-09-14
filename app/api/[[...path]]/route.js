import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const client = new MongoClient(process.env.MONGO_URL)

async function connectDB() {
  try {
    await client.connect()
    return client.db(process.env.DB_NAME || 'socialflow_pro')
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

// GET handler
export async function GET(request, { params }) {
  const path = params?.path || []
  const endpoint = path.join('/')

  try {
    // Root endpoint
    if (!endpoint) {
      return NextResponse.json({ 
        message: 'SocialFlow Pro API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      })
    }

    // Get user profile
    if (endpoint === 'profile') {
      const db = await connectDB()
      // Mock response for now - will be replaced with real user data
      return NextResponse.json({
        success: true,
        profile: {
          id: uuidv4(),
          businessName: 'Sample Business',
          businessType: 'restaurant',
          address: '123 Main St, City, State',
          phone: '(555) 123-4567',
          email: 'contact@samplebusiness.com',
          connectedAccounts: {
            instagram: { connected: true, username: '@samplebusiness' },
            facebook: { connected: false, username: null },
            googleBusiness: { connected: false, username: null }
          }
        }
      })
    }

    // Get posts
    if (endpoint === 'posts') {
      const url = new URL(request.url)
      const status = url.searchParams.get('status') || 'all'
      
      // Mock posts data
      const mockPosts = [
        {
          id: uuidv4(),
          content: 'Check out our delicious new summer menu! 🌞🍽️',
          platforms: ['instagram', 'facebook'],
          status: 'published',
          scheduledAt: new Date('2024-06-15T10:00:00Z').toISOString(),
          publishedAt: new Date('2024-06-15T10:00:00Z').toISOString(),
          images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'],
          engagement: { likes: 45, comments: 12, shares: 8 }
        },
        {
          id: uuidv4(),
          content: 'Happy Friday everyone! What are your weekend plans? 🎉',
          platforms: ['instagram'],
          status: 'scheduled',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          publishedAt: null,
          images: [],
          engagement: { likes: 0, comments: 0, shares: 0 }
        }
      ]

      const filteredPosts = status === 'all' ? mockPosts : mockPosts.filter(post => post.status === status)
      
      return NextResponse.json({
        success: true,
        posts: filteredPosts,
        total: filteredPosts.length
      })
    }

    // Get analytics
    if (endpoint === 'analytics') {
      const url = new URL(request.url)
      const timeframe = url.searchParams.get('timeframe') || '30'
      
      // Mock analytics data
      return NextResponse.json({
        success: true,
        analytics: {
          overview: {
            totalPosts: 247,
            totalReach: 15624,
            totalEngagement: 1934,
            followerGrowth: 12.5
          },
          engagement: {
            likes: 1245,
            comments: 456,
            shares: 233,
            avgEngagementRate: 12.5
          },
          platforms: {
            instagram: { posts: 89, reach: 8924, engagement: 1124 },
            facebook: { posts: 67, reach: 4567, engagement: 567 },
            googleBusiness: { posts: 23, reach: 2133, engagement: 243 }
          },
          topPosts: [
            {
              id: uuidv4(),
              content: 'Summer special menu launch! 🌞',
              platform: 'instagram',
              engagement: 234,
              reach: 1890
            }
          ]
        }
      })
    }

    // Image library
    if (endpoint === 'images') {
      // Mock image library
      return NextResponse.json({
        success: true,
        images: [
          {
            id: uuidv4(),
            filename: 'summer-menu.jpg',
            url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
            category: 'Food',
            uploadedAt: new Date().toISOString(),
            size: '2.3MB'
          },
          {
            id: uuidv4(),
            filename: 'restaurant-interior.jpg',
            url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
            category: 'Interior',
            uploadedAt: new Date().toISOString(),
            size: '1.8MB'
          }
        ]
      })
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 })
  }
}

// POST handler
export async function POST(request, { params }) {
  const path = params?.path || []
  const endpoint = path.join('/')

  try {
    const body = await request.json()

    // Create new post
    if (endpoint === 'posts') {
      const db = await connectDB()
      
      const newPost = {
        id: uuidv4(),
        content: body.content,
        platforms: body.platforms || [],
        status: body.action === 'publish' ? 'published' : 'scheduled',
        scheduledAt: body.scheduledAt || new Date().toISOString(),
        publishedAt: body.action === 'publish' ? new Date().toISOString() : null,
        images: body.images || [],
        createdAt: new Date().toISOString(),
        engagement: { likes: 0, comments: 0, shares: 0 }
      }

      // In a real app, you would:
      // 1. Save to database
      // 2. If publishing now, call social media APIs
      // 3. If scheduling, add to job queue
      
      console.log('Creating post:', newPost)
      
      return NextResponse.json({
        success: true,
        post: newPost,
        message: body.action === 'publish' ? 'Post published successfully!' : 'Post scheduled successfully!'
      })
    }

    // Save business profile
    if (endpoint === 'profile') {
      const db = await connectDB()
      
      const updatedProfile = {
        ...body,
        id: body.id || uuidv4(),
        updatedAt: new Date().toISOString()
      }

      console.log('Updating profile:', updatedProfile)
      
      return NextResponse.json({
        success: true,
        profile: updatedProfile,
        message: 'Profile updated successfully!'
      })
    }

    // Upload image
    if (endpoint === 'images/upload') {
      // Mock image upload - in real app, you'd handle file upload to Google Drive
      const newImage = {
        id: uuidv4(),
        filename: body.filename || 'uploaded-image.jpg',
        url: body.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
        thumbnail: body.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
        category: body.category || 'Uncategorized',
        uploadedAt: new Date().toISOString(),
        size: '2.1MB'
      }

      return NextResponse.json({
        success: true,
        image: newImage,
        message: 'Image uploaded successfully!'
      })
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT handler
export async function PUT(request, { params }) {
  const path = params?.path || []
  const endpoint = path.join('/')

  try {
    const body = await request.json()

    // Update post
    if (endpoint.startsWith('posts/')) {
      const postId = endpoint.split('/')[1]
      
      const updatedPost = {
        id: postId,
        ...body,
        updatedAt: new Date().toISOString()
      }

      console.log('Updating post:', updatedPost)
      
      return NextResponse.json({
        success: true,
        post: updatedPost,
        message: 'Post updated successfully!'
      })
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request, { params }) {
  const path = params?.path || []
  const endpoint = path.join('/')

  try {
    // Delete post
    if (endpoint.startsWith('posts/')) {
      const postId = endpoint.split('/')[1]
      
      console.log('Deleting post:', postId)
      
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully!'
      })
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 })
  }
}