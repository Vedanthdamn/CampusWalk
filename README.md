# 🏛️ CampusWalk - Outdoor Campus Navigation for SRM KTR

CampusWalk is a fully working outdoor campus navigation web application designed specifically for SRM University Kattankulathur Campus. It helps students navigate from their hostels to academic buildings using the shortest outdoor routes. Navigation is building-to-building only (no indoor/floor routing).

## ✨ Features

### Core Navigation Features
- 🗺️ **Interactive Google Maps** - Real-time campus map with Google Maps JavaScript API
- 🏠 **Hostel Selection** - Choose from Boys Hostel 1, BH2, MH12, and more
- 🏢 **Building Selection** - Navigate to Tech Park, Library, Food Court, Mini Hall, etc.
- 🧭 **Shortest Path Routing** - Server-side Dijkstra's algorithm for optimal routes
- 📍 **Visual Path Display** - Blue polyline showing the complete route
- 🎯 **Smart Markers** - Color-coded markers (blue=hostels, red=buildings, yellow=junctions)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔐 **Supabase Authentication** - Secure login with SRM email addresses

### Campus Coverage (SRM KTR)
- **Hostels**: BH1, BH2, MH12
- **Buildings**: Tech Park, University Building, Library, Mini Hall, Food Court
- **Graph Network**: Junction nodes connecting all locations

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Google Maps JavaScript API
- Zustand (State Management)

**Backend:**
- Next.js API Routes (serverless)
- Dijkstra's Algorithm (TypeScript)
- Server-side path calculation

**Database:**
- Supabase PostgreSQL
- Tables: hostels, buildings, graph_nodes, graph_edges
- Supabase JS Client

**Authentication:**
- Supabase Auth
- Email/Password with SRM email validation

### System Architecture

```
┌──────────────────────┐
│   Next.js 14 App     │
│   (Frontend + API)   │
│   Port: 3000         │
│   ├─ React Pages     │
│   ├─ Google Maps     │
│   ├─ Zustand Store   │
│   └─ API Routes      │
└──────────┬───────────┘
           │ HTTP/REST
           ▼
┌──────────────────────┐
│   Supabase           │
│   (PostgreSQL)       │
│   ├─ hostels         │
│   ├─ buildings       │
│   ├─ graph_nodes     │
│   └─ graph_edges     │
└──────────────────────┘
```

## 📊 Database Schema

### Tables

1. **hostels** - Campus hostels with coordinates
   ```sql
   id, name, lat, lng, description
   ```

2. **buildings** - Campus buildings with coordinates
   ```sql
   id, name, lat, lng, description
   ```

3. **graph_nodes** - Walkable points (entrances, junctions)
   ```sql
   id, name, lat, lng, node_type
   ```

4. **graph_edges** - Connections between nodes
   ```sql
   id, from_node, to_node, weight
   ```

See `database/schema.sql` for complete schema with seed data.

## 🚀 Setup Instructions

### Prerequisites

- **Node.js 18+** and npm
- **Supabase Account** (free tier works)
- **Google Maps API Key** (development key)
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/Vedanthdamn/CampusWalk.git
cd CampusWalk
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Zustand
- Supabase JS Client
- Google Maps JS API Loader
- React Hot Toast

### Step 3: Setup Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**
   - Navigate to your Supabase project dashboard
   - Go to **SQL Editor**
   - Copy the entire contents of `database/schema.sql`
   - Paste and execute the script
   - This creates all tables and inserts seed data for SRM KTR

3. **Verify Data**
   - Go to **Table Editor** in Supabase
   - Check that you have data in: hostels, buildings, graph_nodes, graph_edges

### Step 4: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Create credentials → API Key
5. Restrict key to Maps JavaScript API (recommended)

### Step 5: Configure Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### Step 6: Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Step 7: Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

All API routes are serverless Next.js route handlers:

### Nodes
- `GET /api/nodes` - Get all graph nodes
  ```json
  [
    {
      "id": 1,
      "name": "BH1-Entrance",
      "lat": 12.8234,
      "lng": 80.0445,
      "node_type": "entrance"
    }
  ]
  ```

### Buildings
- `GET /api/buildings` - Get all buildings
  ```json
  [
    {
      "id": 1,
      "name": "Tech Park (TP)",
      "lat": 12.8225,
      "lng": 80.0420,
      "description": "Technology Park"
    }
  ]
  ```

### Hostels
- `GET /api/hostels` - Get all hostels
  ```json
  [
    {
      "id": 1,
      "name": "Boys Hostel 1 (BH1)",
      "lat": 12.8234,
      "lng": 80.0445,
      "description": "Boys Hostel Block 1"
    }
  ]
  ```

### Path Finding
- `GET /api/path?from={nodeId}&to={nodeId}` - Calculate shortest path
  ```json
  [
    {
      "id": 1,
      "name": "BH1-Entrance",
      "lat": 12.8234,
      "lng": 80.0445,
      "node_type": "entrance"
    },
    {
      "id": 9,
      "name": "Junction-1",
      "lat": 12.8235,
      "lng": 80.0440,
      "node_type": "junction"
    },
    ...
  ]
  ```

## 🎨 Project Structure

```
CampusWalk/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with sidebar/navbar
│   ├── page.tsx             # Home page (select hostel/building)
│   ├── map/                 # Map page with navigation
│   │   └── page.tsx
│   ├── buildings/           # Buildings list page
│   │   └── page.tsx
│   ├── hostels/             # Hostels list page
│   │   └── page.tsx
│   ├── login/               # Authentication page
│   │   └── page.tsx
│   └── api/                 # API routes
│       ├── nodes/route.ts   # Get all graph nodes
│       ├── path/route.ts    # Calculate shortest path
│       ├── buildings/route.ts
│       └── hostels/route.ts
├── components/              # React components
│   ├── Map.tsx             # Google Maps with markers/polyline
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Navbar.tsx          # Top navbar with logout
│   ├── HostelSelect.tsx    # Hostel dropdown selector
│   └── BuildingSelect.tsx  # Building dropdown selector
├── lib/                     # Utility libraries
│   ├── supabaseClient.ts   # Supabase configuration & types
│   ├── dijkstra.ts         # Dijkstra's algorithm implementation
│   └── store.ts            # Zustand state management
├── database/
│   └── schema.sql          # Database schema with seed data
├── .env.local.example      # Environment variables template
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎮 Usage Guide

### For Students

1. **Open Application**: Navigate to `http://localhost:3000`

2. **Login (Optional)**:
   - Click "Login" in navbar
   - Sign up with your SRM email (@srmist.edu.in)
   - Or continue as guest

3. **Select Route**:
   - Choose your **hostel** from dropdown (e.g., BH1, BH2, MH12)
   - Choose **destination building** (e.g., Tech Park, Library)
   - Click **"Find Path"**

4. **View Route**:
   - Automatically redirected to map page
   - Blue polyline shows your route
   - Markers show hostels (blue), buildings (red), junctions (yellow)

5. **Navigate**:
   - Follow the polyline on the map
   - Route ends at building entrance

### Map Interactions

- **Zoom**: Use mouse wheel or map controls
- **Pan**: Click and drag the map
- **Marker Click**: Shows location name and description
- **Marker Hover**: Shows location type (hostel/building/junction)

## 🧪 How Dijkstra's Algorithm Works

### Implementation Details

The shortest path calculation uses **Dijkstra's algorithm** implemented in TypeScript:

**File**: `lib/dijkstra.ts`

**Algorithm Steps**:

1. **Graph Construction**:
   - Fetches all graph_nodes and graph_edges from Supabase
   - Builds adjacency list representing the campus road network
   - Each edge has a weight (distance in meters)

2. **Initialization**:
   - Set distance to start node = 0
   - Set distance to all other nodes = Infinity
   - Create unvisited nodes set

3. **Main Loop**:
   - Pick unvisited node with smallest distance
   - For each neighbor:
     - Calculate alternate distance = current distance + edge weight
     - If alternate distance < neighbor's current distance:
       - Update neighbor's distance
       - Record path (previous node pointer)
   - Mark current node as visited

4. **Path Reconstruction**:
   - Starting from destination node
   - Follow previous node pointers back to start
   - Return ordered array of GraphNode objects

5. **Response**:
   - Returns array of nodes with lat/lng coordinates
   - Frontend renders polyline connecting these points

**Time Complexity**: O((V + E) log V) with priority queue
**Space Complexity**: O(V + E)

Where:
- V = number of graph nodes
- E = number of graph edges

### Why Dijkstra?

- **Optimal**: Always finds shortest path
- **Efficient**: Fast enough for campus-scale networks
- **Proven**: Industry-standard pathfinding algorithm
- **No Heuristic Needed**: Unlike A*, doesn't require distance estimation

## 🔧 Customization

### Adding New Locations

1. **Add to Database** (via Supabase SQL Editor):

```sql
-- Add a new hostel
INSERT INTO hostels (name, lat, lng, description) 
VALUES ('New Hostel', 12.825000, 80.046000, 'Description');

-- Add a new building
INSERT INTO buildings (name, lat, lng, description) 
VALUES ('New Building', 12.821000, 80.042000, 'Description');

-- Add entrance node
INSERT INTO graph_nodes (name, lat, lng, node_type) 
VALUES ('NewBuilding-Entrance', 12.821000, 80.042000, 'entrance');

-- Add edges connecting to existing nodes
INSERT INTO graph_edges (from_node, to_node, weight) 
VALUES 
  (existing_junction_id, new_node_id, 100),
  (new_node_id, existing_junction_id, 100);
```

2. **Restart Application** - Changes are reflected immediately

### Customizing Map Style

Edit `components/Map.tsx`:

```typescript
const mapInstance = new google.maps.Map(mapRef.current, {
  center: { lat: 12.823, lng: 80.044 },
  zoom: 16,
  // Add custom map styles
  styles: [
    // Your custom map styling
  ],
});
```

### Changing Colors

Edit `tailwind.config.ts` to customize theme colors.

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSy...` |

## 🔒 Security

### Authentication
- Supabase Auth validates SRM email addresses
- Email must end with `@srmist.edu.in` or `@srmist.ac.in`
- Passwords are hashed by Supabase

### API Security
- Environment variables are server-side only (except `NEXT_PUBLIC_*`)
- API routes validate inputs
- Database queries use parameterized statements (SQL injection prevention)

### Best Practices
- Never commit `.env.local` to version control
- Use environment variables for sensitive data
- Keep dependencies updated

## 🐛 Troubleshooting

### Issue: Map not loading

**Solution**:
- Check Google Maps API key is valid
- Verify Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for errors

### Issue: Cannot connect to Supabase

**Solution**:
- Verify Supabase URL and anon key in `.env.local`
- Check Supabase project is active
- Ensure database tables exist (run schema.sql)

### Issue: No path found

**Solution**:
- Verify graph_edges table has bidirectional connections
- Check that nodes exist for selected hostel/building
- Ensure graph is connected (no isolated nodes)

### Issue: Authentication fails

**Solution**:
- Use SRM email address (@srmist.edu.in)
- Check email verification if required
- Try guest access to bypass auth

## 📈 Future Enhancements

- [ ] Real-time location tracking with device GPS
- [ ] Turn-by-turn voice navigation
- [ ] Save favorite routes
- [ ] Multiple language support
- [ ] Weather-based route suggestions
- [ ] Estimated walking time calculation
- [ ] Share routes with friends
- [ ] Mobile app (React Native)
- [ ] Accessibility features
- [ ] Dark mode

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- SRM University for campus data
- Next.js team for amazing framework
- Supabase for backend infrastructure
- Google Maps for mapping services

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation above
- Review existing issues for solutions

---

**Built with ❤️ for SRM University Students**
