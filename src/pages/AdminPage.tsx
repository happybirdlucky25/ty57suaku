import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { 
  Home, 
  Search, 
  FileText, 
  User, 
  Settings, 
  DollarSign, 
  TrendingUp,
  Bell,
  ExternalLink,
  Eye,
  Code
} from 'lucide-react'

interface PageLink {
  path: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'working' | 'placeholder' | 'protected'
  requiresAuth?: boolean
  requiredRole?: string
}

export function AdminPage() {
  const pages: PageLink[] = [
    {
      path: '/',
      name: 'Home Page',
      description: 'Shows Dashboard if authenticated, Landing if not',
      icon: <Home className="h-5 w-5" />,
      status: 'working'
    },
    {
      path: '/landing',
      name: 'Landing Page',
      description: 'Marketing page with hero section and features',
      icon: <ExternalLink className="h-5 w-5" />,
      status: 'working'
    },
    {
      path: '/search',
      name: 'Search Page',
      description: 'Search bills and legislators with filters',
      icon: <Search className="h-5 w-5" />,
      status: 'working'
    },
    {
      path: '/login',
      name: 'Login Page',
      description: 'Supabase authentication with social providers',
      icon: <User className="h-5 w-5" />,
      status: 'working'
    },
    {
      path: '/register',
      name: 'Register Page',
      description: 'Same as login page (Supabase handles both)',
      icon: <User className="h-5 w-5" />,
      status: 'working'
    },
    {
      path: '/dashboard',
      name: 'Dashboard Page',
      description: 'User dashboard with stats, newsfeed, and quick actions',
      icon: <FileText className="h-5 w-5" />,
      status: 'working',
      requiresAuth: true
    },
    {
      path: '/bill/123',
      name: 'Bill Detail Page',
      description: 'Individual bill details (placeholder)',
      icon: <FileText className="h-5 w-5" />,
      status: 'placeholder'
    },
    {
      path: '/campaigns',
      name: 'Campaigns Page',
      description: 'Campaign management (placeholder)',
      icon: <TrendingUp className="h-5 w-5" />,
      status: 'placeholder',
      requiresAuth: true,
      requiredRole: 'paid'
    },
    {
      path: '/campaign/123',
      name: 'Campaign Workspace',
      description: 'Individual campaign workspace (placeholder)',
      icon: <TrendingUp className="h-5 w-5" />,
      status: 'placeholder',
      requiresAuth: true,
      requiredRole: 'paid'
    },
    {
      path: '/profile',
      name: 'Profile Page',
      description: 'User profile management (placeholder)',
      icon: <User className="h-5 w-5" />,
      status: 'placeholder',
      requiresAuth: true
    },
    {
      path: '/pricing',
      name: 'Pricing Page',
      description: 'Subscription plans and pricing (placeholder)',
      icon: <DollarSign className="h-5 w-5" />,
      status: 'placeholder'
    },
    {
      path: '/admin',
      name: 'Admin Page',
      description: 'This page - testing and navigation hub',
      icon: <Settings className="h-5 w-5" />,
      status: 'working'
    }
  ]

  const getStatusBadge = (status: PageLink['status']) => {
    switch (status) {
      case 'working':
        return <Badge variant="default">Working</Badge>
      case 'placeholder':
        return <Badge variant="secondary">Placeholder</Badge>
      case 'protected':
        return <Badge variant="destructive">Protected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const workingPages = pages.filter(p => p.status === 'working')
  const placeholderPages = pages.filter(p => p.status === 'placeholder')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Admin Testing Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Navigate to all pages for testing functionality and UI components
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Working Pages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {workingPages.length}
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
                <Code className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Placeholder Pages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {placeholderPages.length}
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
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Pages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pages.length}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Working Pages
          </CardTitle>
          <CardDescription>
            Fully functional pages ready for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workingPages.map((page) => (
              <div key={page.path} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {page.icon}
                    <h3 className="font-medium text-gray-900">{page.name}</h3>
                  </div>
                  {getStatusBadge(page.status)}
                </div>
                <p className="text-sm text-gray-600 mb-4">{page.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {page.requiresAuth && (
                      <Badge variant="secondary" className="text-xs">Auth Required</Badge>
                    )}
                    {page.requiredRole && (
                      <Badge variant="warning" className="text-xs">{page.requiredRole}</Badge>
                    )}
                  </div>
                  <Link to={page.path}>
                    <Button size="sm" variant="secondary">
                      Visit Page
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-yellow-600" />
            Placeholder Pages
          </CardTitle>
          <CardDescription>
            Pages with basic routing but placeholder content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderPages.map((page) => (
              <div key={page.path} className="border rounded-lg p-4 hover:shadow-md transition-shadow opacity-75">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {page.icon}
                    <h3 className="font-medium text-gray-900">{page.name}</h3>
                  </div>
                  {getStatusBadge(page.status)}
                </div>
                <p className="text-sm text-gray-600 mb-4">{page.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {page.requiresAuth && (
                      <Badge variant="secondary" className="text-xs">Auth Required</Badge>
                    )}
                    {page.requiredRole && (
                      <Badge variant="warning" className="text-xs">{page.requiredRole}</Badge>
                    )}
                  </div>
                  <Link to={page.path}>
                    <Button size="sm" variant="ghost">
                      Visit Page
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Component Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Component Testing
          </CardTitle>
          <CardDescription>
            Test key functionality and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Authentication</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Login/Register with Supabase</li>
                <li>• User role detection (free/paid)</li>
                <li>• Protected route access</li>
                <li>• Auto profile creation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">UI Components</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Notification sidebar (bell icon)</li>
                <li>• Newsfeed with mock data</li>
                <li>• Search functionality</li>
                <li>• Responsive navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}