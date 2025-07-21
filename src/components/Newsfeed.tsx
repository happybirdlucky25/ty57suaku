import { useState, useEffect } from 'react'
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
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulating API call for now
    setTimeout(() => {
      setNewsItems([
        {
          id: '1',
          type: 'bill_update',
          title: 'HR-1234 Climate Action Bill Passes Committee',
          description: 'The bill you\'re tracking has moved from committee to floor vote. This represents significant progress toward passage.',
          timestamp: '2 hours ago',
          status: 'Passed Committee',
          relatedId: 'hr-1234'
        },
        {
          id: '2',
          type: 'legislator_activity',
          title: 'Sen. Jane Smith Introduces New Healthcare Bill',
          description: 'Your tracked legislator has introduced S-5678, a comprehensive healthcare reform bill focusing on prescription drug costs.',
          timestamp: '4 hours ago',
          relatedId: 'sen-jane-smith'
        },
        {
          id: '3',
          type: 'campaign_update',
          title: 'Your "Clean Energy Campaign" Gained 15 New Supporters',
          description: 'Your advocacy campaign is growing! 15 new members joined and 3 new organizations endorsed your position.',
          timestamp: '6 hours ago',
          relatedId: 'campaign-clean-energy'
        },
        {
          id: '4',
          type: 'general_news',
          title: 'Congressional Schedule: Key Votes This Week',
          description: 'Several important bills are scheduled for votes this week, including infrastructure spending and education funding.',
          timestamp: '1 day ago',
          source: 'Congressional Calendar'
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

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
              <div key={item.id} className="border-l-4 border-blue-200 pl-4 py-3 hover:bg-gray-50 rounded-r">
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
                  <Button variant="ghost" size="sm">
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