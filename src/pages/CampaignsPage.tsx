import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockDataService } from '../services/mockData'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Crown
} from 'lucide-react'
import type { Campaign } from '../types/database'

export function CampaignsPage() {
  const navigate = useNavigate()
  const { user, userRole } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')
  const [newCampaignDescription, setNewCampaignDescription] = useState('')

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!user) return

      setLoading(true)
      try {
        const userCampaigns = await mockDataService.getCampaigns(user.id)
        setCampaigns(userCampaigns)
      } catch (error) {
        console.error('Failed to load campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [user])

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newCampaignName.trim()) return

    setCreating(true)
    try {
      const newCampaign = await mockDataService.createCampaign(
        user.id, 
        newCampaignName.trim(), 
        newCampaignDescription.trim()
      )
      setCampaigns(prev => [newCampaign, ...prev])
      setNewCampaignName('')
      setNewCampaignDescription('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create campaign:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleViewCampaign = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`)
  }

  // Check if user has paid access
  if (userRole !== 'paid') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Crown className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Pro Feature Required</h2>
          <p className="mt-2 text-lg text-gray-600">
            Campaign management is available for Pro users only
          </p>
          <p className="mt-4 text-gray-500">
            Upgrade to Pro to create campaigns, collaborate with teams, and build advocacy strategies.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => navigate('/pricing')} className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Manage your advocacy campaigns and track their progress
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Campaigns
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Campaigns
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length * 2} {/* Mock: 2 docs per campaign */}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>
              Start building your advocacy strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <Input
                  id="campaign-name"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g., Climate Action Campaign"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="campaign-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="campaign-description"
                  value={newCampaignDescription}
                  onChange={(e) => setNewCampaignDescription(e.target.value)}
                  placeholder="Describe your campaign goals and strategy..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  loading={creating}
                  disabled={!newCampaignName.trim()}
                >
                  {creating ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewCampaignName('')
                    setNewCampaignDescription('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      {campaigns.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        2 docs
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewCampaign(campaign.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !showCreateForm && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-2 text-gray-500">
              Create your first campaign to start organizing your advocacy efforts
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pro Features Info */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Pro Campaign Features</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Team collaboration, advanced analytics, custom reports, and integration with tracking tools.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}