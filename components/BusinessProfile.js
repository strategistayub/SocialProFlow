'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Building2,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Globe,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Users,
  Upload,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react'
import { toast } from 'sonner'

const BUSINESS_TYPES = [
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
  { id: 'salon', name: 'Beauty Salon', icon: '💄' },
  { id: 'tradesman', name: 'Tradesman', icon: '🔧' },
  { id: 'retail', name: 'Retail Store', icon: '🛍️' },
  { id: 'fitness', name: 'Fitness Center', icon: '💪' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'other', name: 'Other', icon: '🏢' }
]

const CONNECTED_ACCOUNTS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    connected: true,
    username: '@samplebusiness',
    followers: '2.4K'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    connected: false,
    username: null,
    followers: null
  },
  {
    id: 'google-business',
    name: 'Google My Business',
    icon: Globe,
    color: 'text-green-600',
    connected: false,
    username: null,
    followers: null
  }
]

export default function BusinessProfile() {
  const [profile, setProfile] = useState({
    businessName: 'Sample Business',
    businessType: 'restaurant',
    description: 'A modern restaurant serving fresh, locally-sourced cuisine in a welcoming atmosphere.',
    address: '123 Main Street, Downtown',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '(555) 123-4567',
    email: 'contact@samplebusiness.com',
    website: 'https://samplebusiness.com',
    logo: null
  })

  const [connectedAccounts, setConnectedAccounts] = useState(CONNECTED_ACCOUNTS)
  const [notifications, setNotifications] = useState({
    postPublished: true,
    postFailed: true,
    weeklyReport: true,
    monthlyReport: true,
    newFeatures: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    }

    setIsLoading(false)
  }

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handleConnectAccount = (accountId) => {
    // In a real app, this would initiate OAuth flow
    toast.info(`Redirecting to ${accountId} authentication...`)
  }

  const handleDisconnectAccount = (accountId) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, connected: false, username: null, followers: null }
          : account
      )
    )
    toast.success('Account disconnected successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Settings</h2>
          <p className="text-gray-600">Manage your business profile and account settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Business Information
              </CardTitle>
              <CardDescription>
                Update your business details and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Business Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.logo} alt={profile.businessName} />
                      <AvatarFallback className="text-lg">
                        {profile.businessName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={profile.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <select
                      id="businessType"
                      value={profile.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your business..."
                    value={profile.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={profile.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Social Accounts</CardTitle>
              <CardDescription>
                Manage your social media connections for publishing content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedAccounts.map((account) => {
                const Icon = account.icon
                
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Icon className={`h-6 w-6 ${account.color}`} />
                      <div>
                        <h4 className="font-medium">{account.name}</h4>
                        {account.connected ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{account.username}</span>
                            {account.followers && (
                              <>
                                <span>•</span>
                                <span>{account.followers} followers</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span>Not connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {account.connected ? (
                        <Badge variant="secondary" className="text-green-700 bg-green-50">
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Disconnected
                        </Badge>
                      )}
                      
                      <Button
                        variant={account.connected ? "outline" : "default"}
                        size="sm"
                        onClick={() => 
                          account.connected 
                            ? handleDisconnectAccount(account.id)
                            : handleConnectAccount(account.id)
                        }
                      >
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Post Published</h4>
                    <p className="text-sm text-gray-500">
                      Get notified when your posts are successfully published
                    </p>
                  </div>
                  <Switch
                    checked={notifications.postPublished}
                    onCheckedChange={(checked) => handleNotificationChange('postPublished', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Post Failed</h4>
                    <p className="text-sm text-gray-500">
                      Get alerted when posts fail to publish
                    </p>
                  </div>
                  <Switch
                    checked={notifications.postFailed}
                    onCheckedChange={(checked) => handleNotificationChange('postFailed', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-500">
                      Receive weekly performance summaries
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => handleNotificationChange('weeklyReport', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monthly Reports</h4>
                    <p className="text-sm text-gray-500">
                      Get detailed monthly analytics reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.monthlyReport}
                    onCheckedChange={(checked) => handleNotificationChange('monthlyReport', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Features</h4>
                    <p className="text-sm text-gray-500">
                      Stay updated on new features and improvements
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) => handleNotificationChange('newFeatures', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">SocialFlow Pro</h3>
                    <p className="text-blue-700">$150/month • Professional Plan</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Full access to all features and integrations
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Unlimited posts across all platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Advanced analytics and reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>AI-powered content optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Google Drive integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Priority customer support</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  Next billing date: July 15, 2024
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    View Billing History
                  </Button>
                  <Button variant="outline">
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center py-6 border-t">
        <p className="text-sm text-gray-500">
          Powered by <strong>Strategist Ayub - Equip to Disrupt</strong>
        </p>
      </div>
    </div>
  )
}