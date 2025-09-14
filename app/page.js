'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  Upload, 
  Instagram, 
  Facebook, 
  Globe,
  Zap,
  Users,
  TrendingUp,
  Plus,
  FileImage,
  Clock,
  Sparkles
} from 'lucide-react'
import ContentCreator from '@/components/ContentCreator'
import ImageLibrary from '@/components/ImageLibrary'
import PostScheduler from '@/components/PostScheduler'
import Analytics from '@/components/Analytics'
import BusinessProfile from '@/components/BusinessProfile'

export default function Home() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('create')
  const [stats, setStats] = useState({
    totalPosts: 247,
    engagement: 12.5,
    followers: 1834,
    reach: 15624
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">SocialFlow Pro</CardTitle>
            <CardDescription>
              Streamline your social media presence with our comprehensive management platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                <span>Instagram integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                <span>Facebook publishing</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span>Google My Business</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Advanced analytics</span>
              </div>
            </div>
            <Button onClick={() => signIn('google')} className="w-full" size="lg">
              Sign in with Google
            </Button>
            <p className="text-xs text-center text-gray-500">
              Powered by Strategist Ayub - Equip to Disrupt
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">SocialFlow Pro</h1>
                </div>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{stats.engagement}% engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{stats.followers.toLocaleString()} followers</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image} alt={session.user?.name} />
                  <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ContentCreator />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Posts</span>
                      <span className="font-semibold">{stats.totalPosts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold text-green-600">+23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Engagement</span>
                      <span className="font-semibold">{stats.engagement}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reach</span>
                      <span className="font-semibold">{stats.reach.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Connected Accounts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Instagram</span>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Facebook</span>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Google My Business</span>
                      </div>
                      <Badge variant="outline">Connect</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library">
            <ImageLibrary />
          </TabsContent>

          <TabsContent value="schedule">
            <PostScheduler />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="profile">
            <BusinessProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}