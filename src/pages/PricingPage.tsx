import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Check, Crown, Star, Zap } from 'lucide-react'

export function PricingPage() {
  const navigate = useNavigate()
  const { userRole, isAuthenticated } = useAuth()

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Mock upgrade process
    console.log('Starting upgrade process...')
  }

  const features = {
    free: [
      'Track up to 10 bills and legislators',
      'Basic AI summaries',
      'Email notifications',
      'Search congressional data',
      'View voting records'
    ],
    paid: [
      'Unlimited tracking',
      'Advanced AI analysis & reports',
      'Create unlimited campaigns',
      'Team collaboration tools',
      'Custom notification settings',
      'Priority support',
      'Export data & reports',
      'API access',
      'Advanced search filters'
    ]
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Get the tools you need to track congressional action and build effective advocacy campaigns
        </p>
      </div>

      {/* Current Plan Indicator */}
      {isAuthenticated && (
        <div className="text-center">
          <Badge variant={userRole === 'paid' ? 'success' : 'secondary'} className="text-lg px-4 py-2">
            Current Plan: {userRole === 'paid' ? 'Pro' : 'Free'}
          </Badge>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className={`relative ${userRole === 'free' ? 'ring-2 ring-blue-500' : ''}`}>
          {userRole === 'free' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge variant="success">Current Plan</Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Star className="h-12 w-12 text-gray-600" />
            </div>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <CardDescription className="mt-4">
              Perfect for individual advocates getting started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full" 
              variant={userRole === 'free' ? 'secondary' : 'ghost'}
              disabled={userRole === 'free'}
              onClick={() => !isAuthenticated && navigate('/login')}
            >
              {userRole === 'free' ? 'Current Plan' : 'Get Started Free'}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative ${userRole === 'paid' ? 'ring-2 ring-yellow-500' : 'ring-2 ring-blue-500 shadow-lg'}`}>
          {userRole !== 'paid' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600">Most Popular</Badge>
            </div>
          )}
          {userRole === 'paid' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge variant="success">Current Plan</Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              Pro Plan
              <Badge variant="warning" className="text-xs">Popular</Badge>
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <CardDescription className="mt-4">
              Advanced tools for organizations and professional advocates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="success" className="mb-4">
                Everything in Free, plus:
              </Badge>
            </div>
            
            <ul className="space-y-3">
              {features.paid.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full" 
              variant={userRole === 'paid' ? 'secondary' : 'primary'}
              disabled={userRole === 'paid'}
              onClick={handleUpgrade}
            >
              {userRole === 'paid' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
            
            {userRole !== 'paid' && (
              <p className="text-xs text-center text-gray-500">
                30-day money-back guarantee • Cancel anytime
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enterprise */}
      <Card className="max-w-2xl mx-auto border-purple-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Zap className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Enterprise</CardTitle>
          <CardDescription className="mt-4">
            Custom solutions for large organizations and government agencies
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Everything in Pro</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Custom integrations</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>White-label options</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Advanced security & compliance</span>
            </li>
          </ul>
          
          <div className="pt-4">
            <Button variant="secondary">Contact Sales</Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">
              The free plan gives you access to core features. Pro plan comes with a 30-day money-back guarantee.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How accurate is the data?</h3>
            <p className="text-gray-600 text-sm">
              We source data directly from official government APIs and update it in real-time for maximum accuracy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Do you offer discounts?</h3>
            <p className="text-gray-600 text-sm">
              We offer discounts for non-profits, students, and annual subscriptions. Contact us for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}