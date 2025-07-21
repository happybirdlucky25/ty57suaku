import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { User, Mail, Phone, Building, Crown, Save, Edit3 } from 'lucide-react'

export function ProfilePage() {
  const { user, userRole } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    title: '',
    company: '',
    phone: ''
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Mock save - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Profile updated:', formData)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your basic account details and subscription status
              </CardDescription>
            </div>
            <Button 
              variant={editing ? "ghost" : "secondary"} 
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{user?.email}</span>
                  <Badge variant="secondary" className="ml-auto">Verified</Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Plan
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-900 capitalize">{userRole} Plan</span>
                  <Badge variant={userRole === 'paid' ? 'success' : 'secondary'} className="ml-auto">
                    {userRole === 'paid' ? 'Pro' : 'Free'}
                  </Badge>
                </div>
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {editing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formData.full_name || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                {editing ? (
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Policy Director"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md text-gray-900">
                    {formData.title || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                {editing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Your organization"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{formData.company || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {editing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 pt-4">
                <Button type="submit" loading={saving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userRole === 'free' ? (
              <>
                <p className="text-sm text-gray-600">
                  You're currently on the free plan. Upgrade to unlock advanced features.
                </p>
                <Button className="w-full">Upgrade to Pro</Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  You have access to all Pro features. Thank you for your support!
                </p>
                <Button variant="ghost" className="w-full">Manage Billing</Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>
              Control your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}