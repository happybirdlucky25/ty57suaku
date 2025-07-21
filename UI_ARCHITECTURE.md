# ShadowCongress UI Architecture Plan

## Current Stack Analysis
- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS 4.x  
- **Auth**: Supabase Auth UI
- **State**: Currently basic useState (need global state)
- **Routing**: Need to add React Router
- **Edge Functions**: 18 functions ready for integration

## Component Architecture

### 1. Core Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base design system components
│   ├── auth/            # Authentication components
│   ├── bills/           # Bill-related components
│   ├── legislators/     # Legislator components
│   ├── campaigns/       # Campaign workspace components
│   ├── dashboard/       # Dashboard components
│   └── layout/          # Layout components
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts for state
├── services/            # API integration layer
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

### 2. User Role-Based UI Requirements

#### Anonymous Users
- Landing page with public bill search
- Bill detail pages with "Generate Summary" CTA
- Register/Login CTAs throughout
- **Components Needed**:
  - `PublicBillSearch`
  - `BillDetailPublic` 
  - `RegisterPrompt`
  - `PublicNavigation`

#### Free Users
- Personal dashboard with tracked items
- Bill/legislator tracking controls
- Private notes on tracked items
- Upgrade prompts for paid features
- **Components Needed**:
  - `UserDashboard`
  - `TrackingControls`
  - `NotesManager`
  - `UpgradePrompts`

#### Paid Users
- Campaign workspace
- AI content generation
- Team collaboration
- Document management
- **Components Needed**:
  - `CampaignWorkspace`
  - `AIContentGenerator`
  - `TeamManagement`
  - `DocumentManager`

### 3. Page-Level Components (Routes)

```typescript
// Route structure based on user requirements
const routes = {
  '/': 'LandingPage',                    // Public
  '/bill/:bill_id': 'BillDetailPage',    // Public + Auth features
  '/dashboard': 'UserDashboard',         // Free+ users
  '/campaign/:id': 'CampaignWorkspace',  // Paid users
  '/profile': 'ProfilePage',             // Auth users
  '/pricing': 'PricingPage',             // Public
  '/about': 'AboutPage',                 // Static
  // ... other static pages
}
```

### 4. State Management Strategy

#### Global State (React Context)
```typescript
// AuthContext - user authentication & permissions
interface AuthState {
  user: User | null
  session: Session | null
  userRole: 'anonymous' | 'free' | 'paid'
  permissions: UserPermissions
}

// AppContext - app-wide state
interface AppState {
  notifications: Notification[]
  feed: FeedItem[]
  trackingData: TrackingData
}
```

#### Local State
- Component-specific state (forms, UI toggles)
- Temporary search results
- Modal/dialog states

### 5. API Integration Layer

#### Custom Hooks Pattern
```typescript
// hooks/api/useAuth.ts
export function useAuth()

// hooks/api/useBills.ts  
export function useBillSearch()
export function useBillDetails()
export function useTrackBill()

// hooks/api/useCampaigns.ts
export function useCampaigns()
export function useCampaignDetails()
```

#### Service Layer
```typescript
// services/authService.ts
// services/billService.ts
// services/campaignService.ts
```

### 6. Component Design System

#### Base UI Components
```typescript
// components/ui/
- Button (variants: primary, secondary, ghost, etc.)
- Input, TextArea, Select
- Card, Modal, Tooltip
- Badge, Avatar, Spinner
- Alert, Toast notifications
```

#### Composite Components
```typescript
// components/bills/
- BillCard
- BillSearchFilters
- BillStatusBadge
- TrackingButton

// components/campaigns/
- CampaignCard
- TeamMemberList
- DocumentList
- AIContentBox
```

### 7. Route Protection Strategy

```typescript
// Based on user roles from edge functions
<ProtectedRoute 
  roles={['free', 'paid']} 
  fallback={<RegisterPrompt />}
>
  <DashboardPage />
</ProtectedRoute>

<ProtectedRoute 
  roles={['paid']} 
  fallback={<UpgradePage />}
>
  <CampaignWorkspace />
</ProtectedRoute>
```

### 8. Integration with Edge Functions

#### API Client Setup
```typescript
// services/apiClient.ts
class ApiClient {
  async trackItem(itemType, itemId)      // -> track-item function
  async searchBills(query, filters)       // -> search-bills-legislators  
  async createCampaign(data)             // -> create-campaign
  async generateAIContent(params)        // -> generate-ai-content
  // ... map to all 18 edge functions
}
```

### 9. Development Priority Order

1. **Foundation** (Week 1)
   - Base UI components
   - Layout structure
   - Auth integration
   - Routing setup

2. **Core Features** (Week 2)
   - Bill search & details
   - Tracking functionality
   - User dashboard
   - Basic notifications

3. **Advanced Features** (Week 3)
   - Campaign workspace
   - AI content generation
   - Team management
   - Document management

4. **Polish & Testing** (Week 4)
   - Error handling
   - Loading states
   - Responsive design
   - Performance optimization

### 10. Missing Dependencies to Add

```json
{
  "react-router-dom": "^6.x",      // Routing
  "react-hook-form": "^7.x",       // Form handling
  "react-query": "^4.x",           // API state management
  "lucide-react": "^0.x",          // Icons
  "cmdk": "^0.x",                  // Command palette
  "sonner": "^1.x"                 // Toast notifications
}
```

## Next Steps

1. Install missing dependencies
2. Create base UI component library
3. Set up routing and contexts
4. Build authentication flow
5. Implement core search functionality

This architecture ensures:
- ✅ Scalable component structure
- ✅ Role-based access control
- ✅ Clean API integration
- ✅ Consistent user experience
- ✅ TypeScript safety throughout