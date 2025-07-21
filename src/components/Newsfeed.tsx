import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockDataService } from '../services/mockData'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { FileText, User, TrendingUp, Clock, ExternalLink } from 'lucide-react'

interface NewsItem {
  id: string
  type: 'bill_update' | 'legislator_activity' | 'campaign_update' | 'general_news'
  title: string
  description: string
  timestamp: string
  source?: string
  relatedId?: string
  status?: string
}

export function Newsfeed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNewsfeed = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        // Generate dynamic newsfeed based on user's tracked items
        const [trackedBills, trackedLegislators, campaigns] = await Promise.all([
          mockDataService.getTrackedBills(user.id),
          mockDataService.getTrackedLegislators(user.id),
          mockDataService.getCampaigns(user.id)
        ])

        const generatedNews: NewsItem[] = []

        // Add bill updates
        trackedBills.slice(0, 2).forEach((trackedBill, index) => {
          generatedNews.push({
            id: `bill-${trackedBill.bill_id}`,
            type: 'bill_update',
            title: `${trackedBill.bill.bill_number} Status Update`,
            description: `Your tracked bill "${trackedBill.bill.title}" has status: ${trackedBill.bill.status}. This represents important progress in the legislative process.`,
            timestamp: `${index + 2} hours ago`,
            status: trackedBill.bill.status,
            relatedId: trackedBill.bill_id
          })
        })

        // Add legislator updates
        trackedLegislators.slice(0, 1).forEach((trackedLeg, index) => {
          generatedNews.push({
            id: `leg-${trackedLeg.legislator_id}`,
            type: 'legislator_activity',
            title: `${trackedLeg.legislator.full_name} Committee Activity`,
            description: `Your tracked legislator from ${trackedLeg.legislator.state} has recent activity in the ${trackedLeg.legislator.chamber}. Stay informed on their latest votes and sponsorships.`,
            timestamp: `${index + 4} hours ago`,
            relatedId: trackedLeg.legislator_id
          })
        })

        // Add campaign updates
        campaigns.slice(0, 1).forEach((campaign, index) => {
          generatedNews.push({
            id: `campaign-${campaign.id}`,
            type: 'campaign_update',
            title: `"${campaign.name}" Campaign Update`,
            description: 'Your campaign is gaining momentum! New supporters have joined and engagement metrics are improving.',
            timestamp: `${index + 6} hours ago`,
            relatedId: campaign.id.toString()
          })
        })

        // Add general news
        generatedNews.push({
          id: 'general-1',
          type: 'general_news',
          title: 'Congressional Schedule: Key Votes This Week',
          description: 'Several important bills are scheduled for votes this week, including infrastructure spending and education funding.',
          timestamp: '1 day ago',
          source: 'Congressional Calendar'
        })

        setNewsItems(generatedNews)
      } catch (error) {
        console.error('Failed to load newsfeed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNewsfeed()
  }, [user])

  const getIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'bill_update':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'legislator_activity':
        return <User className="h-5 w-5 text-green-600" />
      case 'campaign_update':
        return <TrendingUp className="h-5 w-5 text-purple-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeLabel = (type: NewsItem['type']) => {
    switch (type) {
      case 'bill_update':
        return 'Bill Update'
      case 'legislator_activity':
        return 'Legislator Activity'
      case 'campaign_update':
        return 'Campaign Update'
      default:
        return 'News'
    }
  }

  const handleItemClick = (item: NewsItem) => {
    if (item.type === 'bill_update' && item.relatedId) {
      navigate(`/bill/${item.relatedId}`)
    } else if (item.type === 'campaign_update' && item.relatedId) {
      navigate(`/campaign/${item.relatedId}`)
    }
    // Add other navigation logic as needed
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Newsfeed</CardTitle>
          <CardDescription>Loading latest updates...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Newsfeed</CardTitle>
            <CardDescription>Latest updates on your tracked items and campaigns</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {newsItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">No updates yet</p>
            <p className="text-sm">Start tracking bills and legislators to see updates here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div 
                key={item.id} 
                className="border-l-4 border-blue-200 pl-4 py-3 hover:bg-gray-50 rounded-r cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(item.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.status && (
                        <Badge variant="default" className="text-xs">
                          {item.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleItemClick(item)
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}