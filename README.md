# 🏛️ CampusWalk - Outdoor Navigation System for SRM University

CampusWalk is a complete outdoor navigation web application designed specifically for SRM University Kattankulathur Campus. It helps hostel students navigate from their hostels to academic buildings and facilities across campus using outdoor routes only. Navigation stops at building entrances - no indoor/floor navigation.

## ✨ Features

### Core Navigation Features
- 🗺️ **Interactive Campus Map** - OpenStreetMap-based outdoor campus map with Leaflet.js
- 🏠 **Hostel Locations** - Visual markers for Boys Hostel 1, BH2, MH12, and more
- 🏢 **Building Markers** - Academic buildings, TechPark, Library, Food Court, Mini Hall, etc.
- 🧭 **Shortest Path Routing** - Uses Dijkstra's algorithm for optimal outdoor routes
- 📍 **Turn-by-Turn Directions** - Step-by-step navigation instructions with distance
- 🔵 **Route Visualization** - Animated route polyline on the map
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔐 **Supabase Authentication** - Secure email/password login with guest access option

### Campus Coverage (SRM KTR)
- **Hostels**: BH1, BH2, MH12
- **Academic Buildings**: Tech Park, Main Academic Block, University Building
- **Facilities**: Mini Hall, Library, Food Court

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite
- Leaflet.js + React-Leaflet for outdoor maps
- TailwindCSS for styling
- Axios for API communication
- React Router for routing
- Supabase Auth for authentication

**Backend:**
- Spring Boot 3.2.0
- Java 17
- Spring Data JPA
- PostgreSQL (Supabase)
- Maven for build management

**Database:**
- Supabase PostgreSQL
- Tables: hostels, buildings, graph_nodes, graph_edges

### System Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
│   Port: 5173    │
│   Leaflet Map   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Spring Boot    │
│    (Backend)    │
│   Port: 8080    │
│  Dijkstra Path  │
└────────┬────────┘
         │ JDBC
         ▼
┌─────────────────┐
│   Supabase      │
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## 📊 Database Schema

### Tables

1. **hostels** - Campus hostels with lat/lng coordinates
   - id, name, lat, lng, description

2. **buildings** - Campus buildings with lat/lng coordinates  
   - id, name, lat, lng, description

3. **graph_nodes** - Outdoor walkable points (junctions, pathways, entrances)
   - id, name, lat, lng, node_type

4. **graph_edges** - Connections between nodes representing walkable paths
   - id, from_node, to_node, weight (distance in meters)

See `database/schema.sql` for the complete schema with sample seed data.

## 🚀 Setup Instructions

### Prerequisites

- **Java 17 or higher**
- **Maven 3.6+**
- **Node.js 18+ and npm**
- **PostgreSQL** (or Supabase account)
- **Git**

### Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and password

2. **Run the Schema**
   - Navigate to your Supabase project dashboard
   - Go to SQL Editor
   - Copy contents of `database/schema.sql`
   - Execute the script (includes seed data for SRM KTR)

3. **Get Connection Details**
   - Go to Project Settings → Database
   - Note the connection string, host, and credentials

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure Database Connection**
   
   Create or edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=your-password
   ```

   Or copy and configure the `.env.example`:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Copy and edit `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Hostels

- `GET /api/hostels` - Get all hostels with coordinates
- `GET /api/hostels/{id}` - Get hostel by ID

### Buildings

- `GET /api/buildings` - Get all buildings with coordinates
- `GET /api/buildings/{id}` - Get building by ID

### Navigation

- `GET /api/navigation?from={nodeId}&to={nodeId}` - Find shortest outdoor path
  - Returns array of RouteNode objects with lat, lng, and instructions

### Authentication

- `POST /api/auth/login` - Verify Supabase session token (body: {token})
- `GET /api/auth/health` - Health check endpoint

### Example API Response

**Navigation Route Response:**
```json
[
  {
    "lat": 12.823456,
    "lng": 80.043210,
    "instruction": "Start at BH1-Entrance"
  },
  {
    "lat": 12.824000,
    "lng": 80.043500,
    "instruction": "Continue through Hostel-Junction-1"
  },
  {
    "lat": 12.822345,
    "lng": 80.041234,
    "instruction": "Arrive at TP-Entrance"
  }
]
```

## 🎨 Usage Guide

### For Students

1. **Open the application** at `http://localhost:5173`
2. **Sign in** with your email/password or continue as guest
3. **Select your hostel** from the dropdown (e.g., BH1, BH2, MH12)
4. **Choose destination building** (e.g., Tech Park, Library, Mini Hall)
5. **Click "Start Navigation"** to get your route
6. **View the route** on the map as a blue polyline
7. **Follow turn-by-turn directions** in the floating panel
8. **Navigate to the building entrance** - route ends there (no indoor navigation)

### Map Interactions

- **Click hostel markers** (blue) to set as origin
- **Click building markers** (red) to set as destination  
- **Zoom and pan** the map to explore campus
- **View popups** for location details

## 🗺️ Customization

### Adding New Locations

1. **Add to Database**
   ```sql
   -- Add a new hostel
   INSERT INTO hostels (name, lat, lng, description) 
   VALUES ('New Hostel', 12.825000, 80.046000, 'Description');

   -- Add a new building
   INSERT INTO buildings (name, lat, lng, description) 
   VALUES ('New Building', 12.821000, 80.042000, 'Description');
   ```

2. **Add Graph Nodes and Edges**
   ```sql
   -- Add entrance node
   INSERT INTO graph_nodes (name, lat, lng, node_type) 
   VALUES ('NewBuilding-Entrance', 12.821000, 80.042000, 'entrance');

   -- Add connecting edges (bidirectional)
   INSERT INTO graph_edges (from_node, to_node, weight) 
   VALUES (existing_node_id, new_node_id, 100);
   ```

3. **Restart backend** to load new data

### Changing Map Tiles

Edit `frontend/src/components/MapView.jsx`:
```javascript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Change to other tile providers like CartoDB, Stamen, etc.
/>
```

### Styling

Edit `frontend/tailwind.config.js` for theme customization.

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Manual Testing

1. **Test Authentication**
   - Try sign up, sign in, and guest access
   
2. **Test Data Loading**
   - Verify hostels and buildings appear on map
   - Check marker icons and popups

3. **Test Navigation**
   - Select BH1 as origin
   - Select Tech Park as destination
   - Verify route appears
   - Check directions panel

4. **Test API Directly**
   ```bash
   # Get hostels
   curl http://localhost:8080/api/hostels
   
   # Get buildings
   curl http://localhost:8080/api/buildings
   
   # Get navigation route (use actual node IDs from your database)
   curl "http://localhost:8080/api/navigation?from=1&to=6"
   ```

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Cannot connect to database
- Check Supabase credentials in `application.properties`
- Verify Supabase project is active
- Check IP allowlist in Supabase settings

**Problem:** API returns 404
- Verify Spring Boot is running on port 8080
- Check context path is `/api`
- Look at console logs for errors

### Frontend Issues

**Problem:** Cannot connect to backend
- Check backend is running on port 8080
- Verify CORS is enabled in backend
- Check browser console for errors

**Problem:** Map not displaying
- Verify Leaflet CSS is loaded
- Check browser console for JavaScript errors
- Ensure lat/lng coordinates are valid numbers

**Problem:** Authentication fails
- Check Supabase URL and anon key in `.env`
- Verify Supabase project is active
- Try guest access to bypass auth

## 📈 Future Enhancements

- [ ] Real-time location tracking (if GPS available)
- [ ] Voice-guided navigation
- [ ] Save favorite routes
- [ ] Multiple language support
- [ ] Accessibility features
- [ ] Crowdsourced updates
- [ ] Integration with class schedules
- [ ] Weather-based route suggestions
- [ ] Estimated walking time
- [ ] Share routes with friends

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- SRM University for campus data
- React and Spring Boot communities
- Leaflet.js for excellent mapping library
- Supabase for backend infrastructure
- OpenStreetMap contributors

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

## Quick Start Commands

```bash
# Clone the repository
git clone https://github.com/Vedanthdamn/CampusWalk.git
cd CampusWalk

# Setup database (run schema.sql in Supabase SQL Editor)

# Start backend
cd backend
# Configure application.properties with your Supabase credentials
mvn spring-boot:run

# In a new terminal, start frontend
cd frontend
npm install
# Create .env with your Supabase credentials
npm run dev

# Access the application
# Open browser to http://localhost:5173
```

**Built with ❤️ for SRM University Students**