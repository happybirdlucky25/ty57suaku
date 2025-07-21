import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function LandingPage() {
  const { userRole, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleSearch = () => {
    navigate('/search')
  }

  const handleUpgrade = () => {
    navigate('/pricing')
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Turn Congressional 
            <span className="text-blue-600"> Chaos</span> Into 
            <span className="text-green-600"> Clarity</span>
          </h1>
          <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Stop struggling to follow what Congress is actually doing. Shadow Congress transforms complex legislation into clear, actionable intelligence—so you can advocate effectively and make your voice heard when it matters most.
          </p>
          
          {/* Social Proof */}
          <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Congressional Data</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓ Used by 10K+ Advocates</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓ Track 535 Legislators</span>
            </div>
          </div>
        </div>
        
        {!isAuthenticated && (
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Button size="lg" className="px-8 py-4 text-lg" onClick={handleGetStarted}>
              Start Tracking for Free
            </Button>
            <Button variant="ghost" size="lg" className="text-lg" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              See How It Works →
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-12 flex items-center justify-center gap-x-6">
            <Button size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
            <Button variant="secondary" size="lg" className="text-lg" onClick={handleSearch}>
              Search Bills Now
            </Button>
          </div>
        )}
      </div>

      {/* Problem Statement */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-4">
          The Problem: Democracy in the Dark
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-red-800">
          <div>
            <div className="text-3xl font-bold text-red-600">10,000+</div>
            <p className="text-sm">Bills introduced per Congress</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">2-5%</div>
            <p className="text-sm">Actually become law</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">0%</div>
            <p className="text-sm">Transparency for regular citizens</p>
          </div>
        </div>
        <p className="mt-6 text-lg text-red-900 font-medium">
          Important legislation gets buried in committee. Your representatives vote on issues you care about. 
          <br />And you find out about it... never.
        </p>
      </div>

      {/* Solution Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Your Congressional Intelligence System
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shadow Congress cuts through the noise. Track what matters, understand the impact, and take action when it counts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Smart Tracking</h3>
            <p className="text-gray-600 mb-4">
              Follow bills and legislators that actually affect your world. Get alerts when they act, not when it's too late.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div>✓ Real-time status updates</div>
              <div>✓ Committee movement alerts</div>
              <div>✓ Voting record tracking</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🧠 AI Insights</h3>
            <p className="text-gray-600 mb-4">
              Turn 100-page bills into 2-minute summaries. Understand what's really at stake without a law degree.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div>✓ Plain-English summaries</div>
              <div>✓ Impact analysis</div>
              <div>✓ Key player identification</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button size="lg" className="px-8 py-4 text-lg" onClick={handleSearch}>
            See It In Action →
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Three Steps to Congressional Clarity
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Stop wondering what your government is doing. Start knowing—and acting on it.
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="relative">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track What Matters</h3>
            <p className="text-gray-600">
              Search and follow bills, legislators, and issues that impact your life, business, or cause.
            </p>
          </div>

          <div className="relative">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Smart Alerts</h3>
            <p className="text-gray-600">
              Receive instant notifications when bills move, votes happen, or your reps take action.
            </p>
          </div>

          <div className="relative">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Action</h3>
            <p className="text-gray-600">
              Use AI insights to contact representatives, build campaigns, and make your voice count.
            </p>
          </div>
        </div>
      </div>

      {/* Powerful Features */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Tools for Modern Advocacy
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to stay informed and make impact
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Real-Time Intelligence</CardTitle>
              <CardDescription>
                Live data from Congress.gov, committee schedules, and voting records—updated every hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="success">Free & Pro</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <CardTitle>AI Bill Analysis</CardTitle>
              <CardDescription>
                Complex legislation broken down into key points, impact analysis, and stakeholder effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="success">Free & Pro</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-yellow-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <CardTitle>Campaign Builder</CardTitle>
              <CardDescription>
                Create advocacy campaigns, collaborate with teams, and track your influence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="warning">Pro Only</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Custom alerts for bill movements, vote schedules, and legislator activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="success">Free & Pro</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <CardTitle>Impact Tracking</CardTitle>
              <CardDescription>
                Measure your advocacy success and see how your efforts influence outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="warning">Pro Only</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <CardTitle>Instant Access</CardTitle>
              <CardDescription>
                Direct contact info for your representatives, committee members, and key staffers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="success">Free & Pro</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Proof & Testimonials */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Advocates Who Get Results
          </h2>
          <p className="text-lg text-gray-600">
            From grassroots organizers to policy professionals, here's how Shadow Congress is changing the game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                SJ
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Climate Advocate</div>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Shadow Congress helped me catch the climate bill before it died in committee. We mobilized 500 advocates in 48 hours and got it moving again."
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                MC
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Marcus Chen</div>
                <div className="text-sm text-gray-600">Policy Director</div>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "The AI summaries are a game-changer. I can brief our board on 20 bills in the time it used to take me to read one."
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                LR
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
                <div className="text-sm text-gray-600">Nonprofit Executive</div>
              </div>
            </div>
            <p className="text-gray-700 italic">
              "Finally, a tool that makes congressional tracking actually manageable. Our advocacy campaigns are 3x more effective now."
            </p>
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-orange-900 mb-4">
          Important Legislation Is Moving Right Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">127</div>
            <p className="text-sm text-orange-800">Bills in committee this week</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">43</div>
            <p className="text-sm text-orange-800">Floor votes scheduled</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">8</div>
            <p className="text-sm text-orange-800">Major bills advancing</p>
          </div>
        </div>
        <p className="text-lg text-orange-900 font-medium mb-6">
          Every day you wait is another day important decisions happen without your input.
        </p>
        <Button size="lg" className="px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700" onClick={handleGetStarted}>
          Start Tracking Today - It's Free
        </Button>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Stop Reacting. Start Leading.
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
          Join thousands of advocates who use Shadow Congress to stay ahead of the legislative curve, build winning campaigns, and make their voices heard when it matters most.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100" onClick={handleGetStarted}>
            Get Started Free - No Credit Card Required
          </Button>
          <div className="text-lg opacity-90">
            ✓ Free forever plan available  ✓ 2-minute setup  ✓ Cancel anytime
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-sm opacity-80">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-sm opacity-80">Bills Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-sm opacity-80">User Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {userRole === 'free' && (
        <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-yellow-900 mb-2">
                🚀 Ready to Supercharge Your Advocacy?
              </h3>
              <p className="text-lg text-yellow-800 mb-4">
                Unlock Pro features: unlimited tracking, campaign builder, team collaboration, and advanced AI insights
              </p>
              <Button className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600" onClick={handleUpgrade}>
                Upgrade to Pro - $29/month
              </Button>
              <p className="mt-3 text-sm text-yellow-700">
                30-day money-back guarantee • Cancel anytime • No hidden fees
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}