'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Share,
  Instagram,
  Facebook,
  Globe,
  Calendar,
  Award,
  Target
} from 'lucide-react'

const PLATFORM_COLORS = {
  Instagram: '#E4405F',
  Facebook: '#1877F2',
  'Google Business': '#4285F4'
}

const MOCK_ANALYTICS = {
  overview: {
    totalPosts: 247,
    totalReach: 15624,
    totalEngagement: 1934,
    followerGrowth: 12.5,
    avgEngagementRate: 8.2,
    topPerformingDay: 'Friday'
  },
  engagementData: [
    { name: 'Mon', likes: 120, comments: 25, shares: 8 },
    { name: 'Tue', likes: 98, comments: 18, shares: 12 },
    { name: 'Wed', likes: 156, comments: 32, shares: 15 },
    { name: 'Thu', likes: 144, comments: 28, shares: 11 },
    { name: 'Fri', likes: 189, comments: 45, shares: 22 },
    { name: 'Sat', likes: 167, comments: 38, shares: 18 },
    { name: 'Sun', likes: 134, comments: 29, shares: 14 }
  ],
  reachData: [
    { name: 'Week 1', reach: 2400 },
    { name: 'Week 2', reach: 2800 },
    { name: 'Week 3', reach: 3200 },
    { name: 'Week 4', reach: 3800 }
  ],
  platformData: [
    { name: 'Instagram', value: 45, posts: 89, reach: 8924, engagement: 1124 },
    { name: 'Facebook', value: 35, posts: 67, reach: 4567, engagement: 567 },
    { name: 'Google Business', value: 20, posts: 23, reach: 2133, engagement: 243 }
  ],
  topPosts: [
    {
      id: '1',
      content: 'Summer special menu launch! 🌞 Fresh ingredients...',
      platform: 'Instagram',
      engagement: 234,
      reach: 1890,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      content: 'Behind the scenes with our amazing team! 👨‍🍳',
      platform: 'Facebook',
      engagement: 189,
      reach: 1456,
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      content: 'Weekend pasta special is back by popular demand!',
      platform: 'Instagram',
      engagement: 167,
      reach: 1234,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop'
    }
  ]
}

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('30')
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS)

  const StatCard = ({ title, value, change, icon: Icon, color = 'text-blue-600' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gray-50`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your social media performance and engagement</p>
        </div>
        <div className="flex gap-2">
          {['7', '30', '90'].map((days) => (
            <Button
              key={days}
              variant={timeframe === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(days)}
            >
              {days} days
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reach"
          value={analytics.overview.totalReach.toLocaleString()}
          change={12.5}
          icon={Eye}
          color="text-purple-600"
        />
        <StatCard
          title="Engagement"
          value={analytics.overview.totalEngagement.toLocaleString()}
          change={8.2}
          icon={Heart}
          color="text-pink-600"
        />
        <StatCard
          title="Posts Published"
          value={analytics.overview.totalPosts}
          change={15.3}
          icon={Award}
          color="text-green-600"
        />
        <StatCard
          title="Avg. Engagement Rate"
          value={`${analytics.overview.avgEngagementRate}%`}
          change={-2.1}
          icon={Target}
          color="text-blue-600"
        />
      </div>

      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="reach">Reach</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Engagement Breakdown</CardTitle>
              <CardDescription>
                Likes, comments, and shares across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#8884d8" name="Likes" />
                  <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                  <Bar dataKey="shares" fill="#ffc658" name="Shares" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reach" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reach Trend</CardTitle>
              <CardDescription>
                Total reach across all platforms over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.reachData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>
                  Engagement breakdown by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>
                  Detailed metrics by platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.platformData.map((platform) => {
                  const Icon = platform.name === 'Instagram' ? Instagram 
                              : platform.name === 'Facebook' ? Facebook 
                              : Globe
                  
                  return (
                    <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" style={{ color: PLATFORM_COLORS[platform.name] }} />
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-sm text-gray-500">{platform.posts} posts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{platform.reach.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">reach</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Your best content from the last {timeframe} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPosts.map((post, index) => {
                  const Icon = post.platform === 'Instagram' ? Instagram 
                            : post.platform === 'Facebook' ? Facebook 
                            : Globe
                  
                  return (
                    <div key={post.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-lg font-bold min-w-[32px] justify-center">
                          #{index + 1}
                        </Badge>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post preview"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{post.content}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Icon className="h-4 w-4" style={{ color: PLATFORM_COLORS[post.platform] }} />
                            <span>{post.platform}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.reach.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.engagement}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}