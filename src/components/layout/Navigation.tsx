import { Link, useLocation } from 'react-router-dom'
import { User, Search, FileText, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function Navigation() {
  const { user, userRole, signOut, isAuthenticated } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                ShadowCongress
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Bills
              </Link>

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              )}

              {userRole === 'paid' && (
                <Link
                  to="/campaigns"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname.startsWith('/campaign')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Campaigns
                </Link>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* User Role Badge */}
            {isAuthenticated && (
              <Badge variant={userRole === 'paid' ? 'success' : 'secondary'}>
                {userRole === 'paid' ? 'Pro' : 'Free'}
              </Badge>
            )}

            {/* Upgrade Button for Free Users */}
            {userRole === 'free' && (
              <Button size="sm" variant="secondary">
                <Link to="/pricing">Upgrade</Link>
              </Button>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <span className="sr-only">Open main menu</span>
              {/* Mobile menu icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}