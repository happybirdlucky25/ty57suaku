import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockDataService } from '../services/mockData'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ArrowLeft, Heart, FileText, Calendar, Users, ExternalLink, Share2 } from 'lucide-react'
import type { Bill, BillReport } from '../types/database'

export function BillDetailPage() {
  const { billId } = useParams<{ billId: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [bill, setBill] = useState<Bill | null>(null)
  const [report, setReport] = useState<BillReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    const loadBillData = async () => {
      if (!billId) return

      setLoading(true)
      try {
        const [billData, reportData] = await Promise.all([
          mockDataService.getBill(billId),
          mockDataService.getBillReport(billId)
        ])
        setBill(billData)
        setReport(reportData)
      } catch (error) {
        console.error('Failed to load bill data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBillData()
  }, [billId])

  const handleTrackBill = async () => {
    if (!user || !bill) {
      navigate('/login')
      return
    }

    setTracking(true)
    try {
      await mockDataService.trackBill(user.id, bill.bill_id)
      console.log('Bill tracked successfully')
    } catch (error) {
      console.error('Failed to track bill:', error)
    } finally {
      setTracking(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && bill) {
      await navigator.share({
        title: `${bill.bill_number} - ${bill.title}`,
        text: bill.description,
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      console.log('URL copied to clipboard')
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'passed house':
      case 'passed senate':
        return 'success'
      case 'in committee':
        return 'warning'
      case 'introduced':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Bill not found</h3>
        <p className="mt-2 text-gray-500">
          The bill you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => navigate('/search')}>
          Search Bills
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          {isAuthenticated ? (
            <Button 
              variant="secondary" 
              onClick={handleTrackBill}
              loading={tracking}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              {tracking ? 'Tracking...' : 'Track Bill'}
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Sign in to Track
            </Button>
          )}
        </div>
      </div>

      {/* Bill Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={getStatusColor(bill.status)} className="text-sm">
                  {bill.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {bill.status_date && new Date(bill.status_date).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-2xl">{bill.bill_number}</CardTitle>
              <h2 className="text-xl font-semibold text-gray-900 mt-2">{bill.title}</h2>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base leading-relaxed">
            {bill.description}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Bill Analysis */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI Analysis
            </CardTitle>
            <CardDescription>
              Generated analysis of this bill's key provisions and impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <p className="text-gray-700">{report.content.summary}</p>
            </div>
            
            {report.content.key_points && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {report.content.key_points.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.content.impact_analysis && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Impact Analysis</h4>
                <p className="text-gray-700">{report.content.impact_analysis}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Analysis generated on {new Date(report.completed_at!).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bill Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Legislative Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Current Status: {bill.status}</h4>
                <p className="text-sm text-gray-600">
                  {bill.status_date && `Updated ${new Date(bill.status_date).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-500">Introduced</h4>
                <p className="text-sm text-gray-500">Bill introduced in Congress</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-500">Committee Review</h4>
                <p className="text-sm text-gray-500">Under committee consideration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Take Action</CardTitle>
          <CardDescription>
            Ways to engage with this legislation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Contact Your Representative
            </Button>
            <Button variant="secondary" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Congress.gov
            </Button>
            <Button variant="secondary" className="justify-start" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report (Pro Feature)
            </Button>
            <Button variant="secondary" className="justify-start" disabled>
              <Share2 className="h-4 w-4 mr-2" />
              Add to Campaign (Pro Feature)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}