# GreenTrace Lite 🌳

A community-driven environmental tracking application for the Kilimani area in Nairobi, Kenya. GreenTrace Lite enables residents to map trees, report environmental issues, and contribute to local environmental awareness.

## 🌟 Features

### Core Functionality
- **Tree Mapping**: Add and track trees in the Kilimani area with location data
- **Issue Reporting**: Report environmental issues like flooding, tree cutting, trash, and noise
- **Interactive Map**: Visualize trees and reported issues on an interactive map
- **Location Services**: Automatic GPS location detection for accurate mapping
- **Social Authentication**: Login with Google or GitHub accounts
- **Mobile-First Design**: Optimized for mobile devices and field use

### Dashboard Features
- **Real-time Statistics**: View counts of trees added, issues reported, and active users
- **Activity Feed**: See recent community activities and contributions
- **Location Status**: Monitor your current GPS location with refresh capability

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **Maps**: Leaflet.js for interactive mapping
- **Authentication**: Social login (Google, GitHub)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📱 Screenshots

### Main Dashboard
- Interactive map showing trees and issues
- Statistics cards with real-time counts
- Social login integration
- Location status display

### Add Tree Page
- Tree type selection (Mango, Jacaranda, Neem)
- Photo upload capability
- GPS location capture
- Optional planter attribution

### Report Issue Page
- Issue type selection (Flooding, Tree Cutting, Trash, Noise)
- Detailed description input
- Photo upload for evidence
- GPS location capture

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern web browser with GPS capabilities

### Installation

1. **Clone the repository**
   ```bash
   git clone <git@github.com:gikenye/greentrace.git>
   cd greentrace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

The application currently uses mock data and local storage. For production deployment, you may want to configure:

- Database connection
- Authentication providers (Google, GitHub OAuth)
- Map service API keys
- Image upload service

## 📖 Usage Guide

### Adding a Tree
1. Login with your social account
2. Navigate to "Add Tree" from the main menu
3. Select the tree type from the dropdown
4. Upload a photo of the tree (optional)
5. Allow location access for GPS coordinates
6. Add your name or organization (optional)
7. Submit to add the tree to the map

### Reporting an Issue
1. Login with your social account
2. Navigate to "Report" from the main menu
3. Select the issue type from the dropdown
4. Provide a detailed description
5. Upload a photo as evidence (optional)
6. Allow location access for GPS coordinates
7. Submit to report the issue

### Viewing the Map
- The interactive map shows all trees (green markers) and reported issues (red markers)
- Click on markers to view details
- The map centers on your current location when available
- Default center is set to Kilimani, Nairobi

## 🏗️ Project Structure

```
greentrace-lite/
├── app/                    # Next.js app directory
│   ├── add-tree/          # Add tree page
│   ├── report/            # Report issue page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── InteractiveMap.tsx # Map component
│   ├── SocialLogin.tsx   # Authentication component
│   └── theme-provider.tsx # Theme configuration
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional stylesheets
```