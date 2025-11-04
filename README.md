# 🏛️ CampusWalk - Indoor Navigation System for SRM University

CampusWalk is a comprehensive indoor navigation web application designed specifically for SRM University Kattankulathur Campus. It enables students, faculty, and visitors to easily navigate through campus buildings, find rooms, labs, mess halls, libraries, and get turn-by-turn directions between any two indoor locations.

## ✨ Features

### Core Navigation Features
- 🗺️ **Interactive Floor Maps** - View SVG-based floor plans for each building and floor
- 🔍 **Smart Search** - Search for any room, lab, library, mess, auditorium, or landmark
- 🧭 **Shortest Path Routing** - Uses Dijkstra's algorithm to find optimal routes
- 📍 **Turn-by-Turn Directions** - Human-readable navigation instructions
- 🪜 **Multi-Floor Navigation** - Support for stairs and elevators
- ✨ **Animated Path Visualization** - Animated route highlighting on floor maps
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Building Coverage
- **Tech Park** - Computer labs and technology facilities
- **University Building (UB)** - Academic departments and classrooms
- **Library** - Dr. T.P. Ganesan Library with multiple floors
- **Food Court** - Dining areas with multiple food counters
- **Admin Block** - Administrative offices and services

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Axios for API communication
- React Router for navigation
- SVG for floor plan rendering

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL (Supabase)
- Maven for build management

**Database:**
- Supabase PostgreSQL
- Supabase Storage for SVG floor plans

### System Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Spring Boot    │
│    (Backend)    │
│   Port: 8080    │
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

1. **buildings** - Campus buildings
2. **floors** - Floors within buildings with SVG URLs
3. **locations** - Individual locations (rooms, labs, etc.)
4. **edges** - Connections between locations on the same floor
5. **vertical_links** - Stairs and elevators connecting different floors

See `database/schema.sql` for the complete schema and sample data.

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
   - Execute the script

3. **Upload SVG Floor Plans** (Optional)
   - Go to Storage in Supabase
   - Create a bucket named `floorplans`
   - Upload your SVG floor plan files
   - Make the bucket public for read access
   - Update the `svg_url` in the database to point to your uploaded files

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure Database Connection**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://[YOUR-PROJECT-REF].supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=[YOUR-PASSWORD]
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

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Buildings

- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/{id}` - Get building by ID

### Floors

- `GET /api/floors` - Get all floors
- `GET /api/floors/{id}` - Get floor by ID
- `GET /api/floors/building/{buildingId}` - Get floors for a building

### Locations

- `GET /api/locations` - Get all locations
- `GET /api/locations/{id}` - Get location by ID
- `GET /api/locations/floor/{floorId}` - Get locations for a floor
- `GET /api/locations/search?query={term}` - Search locations
- `GET /api/locations/type/{type}` - Get locations by type

### Navigation

- `GET /api/navigation/route?from={fromId}&to={toId}` - Find shortest path

### Example API Response

**Navigation Route Response:**
```json
{
  "path": [
    {
      "locationId": 1,
      "locationName": "TP-GF-Entrance",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 50,
      "y": 50,
      "locationType": "entrance"
    },
    ...
  ],
  "totalDistance": 45.5,
  "instructions": [
    {
      "instruction": "Start at TP-GF-Entrance",
      "direction": "start",
      "distance": 0.0,
      "locationType": "entrance",
      "locationName": "TP-GF-Entrance"
    },
    {
      "instruction": "Walk right for 5.0m towards TP-GF-Reception",
      "direction": "right",
      "distance": 5.0,
      "locationType": "landmark",
      "locationName": "TP-GF-Reception"
    },
    ...
  ],
  "success": true,
  "message": "Route found successfully"
}
```

## 🗺️ How to Upload New Floor Maps

### Creating SVG Floor Plans

1. **Create or convert floor plans to SVG format**
   - Use tools like Inkscape, Adobe Illustrator, or online converters
   - Ensure coordinates are consistent
   - Keep file size reasonable (< 1MB per floor)

2. **Upload to Supabase Storage**
   ```sql
   -- After uploading, update the floors table
   UPDATE floors 
   SET svg_url = 'https://your-project.supabase.co/storage/v1/object/public/floorplans/techpark_ground.svg'
   WHERE id = 1;
   ```

3. **Add Location Coordinates**
   - Locations should have X and Y coordinates matching the SVG coordinate system
   - You can use browser developer tools to identify coordinates on the SVG

### Adding New Buildings and Floors

```sql
-- Insert a new building
INSERT INTO buildings (name, description) 
VALUES ('New Building', 'Description');

-- Insert floors for the building
INSERT INTO floors (building_id, floor_number, floor_name, svg_url) 
VALUES (6, 1, 'Ground Floor', '/floorplans/newbuilding_ground.svg');

-- Add locations
INSERT INTO locations (floor_id, name, type, x, y, description) 
VALUES (12, 'Room-101', 'room', 100, 150, 'Classroom 101');

-- Add edges (connections)
INSERT INTO edges (from_location, to_location, weight) 
VALUES (57, 58, 5.0);
```

## 🎨 Customization

### Changing Colors

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#1e40af',  // Change primary color
      secondary: '#7c3aed',  // Change secondary color
    },
  },
}
```

### Adding New Location Types

1. Update the database with new location types
2. Update color mapping in `FloorMapViewer.jsx`:
   ```javascript
   case 'new_type': return '#hexcolor';
   ```

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. **Test Search Functionality**
   - Search for "Lab"
   - Verify results appear
   - Click on a result

2. **Test Navigation**
   - Select a start location
   - Select a destination
   - Click "Find Route"
   - Verify path is displayed
   - Check turn-by-turn instructions

3. **Test Multi-Floor Navigation**
   - Select locations on different floors
   - Verify stairs/elevator transitions
   - Check floor switching in instructions

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Cannot connect to database
- Check Supabase credentials in `application.properties`
- Verify Supabase project is active
- Check firewall settings

**Problem:** API returns 404
- Verify Spring Boot is running on port 8080
- Check context path is `/api`

### Frontend Issues

**Problem:** Cannot connect to backend
- Check backend is running
- Verify proxy configuration in `vite.config.js`
- Check browser console for CORS errors

**Problem:** Locations not displaying
- Verify database has sample data
- Check browser console for JavaScript errors
- Verify API responses in Network tab

## 📈 Future Enhancements

- [ ] Real-time location tracking (if GPS is available indoors)
- [ ] AR navigation overlay using device camera
- [ ] Voice-guided navigation
- [ ] Accessibility features for differently-abled users
- [ ] Crowdsourced updates for room information
- [ ] Integration with campus events calendar
- [ ] Parking spot finder
- [ ] Save favorite locations
- [ ] Share routes with others
- [ ] Offline mode with cached maps

## 👥 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SRM University for campus data
- React and Spring Boot communities
- Contributors and testers

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🎓 For Students

This is an open-source educational project. Feel free to:
- Learn from the code
- Extend functionality
- Deploy for your campus
- Share improvements

---

**Note:** This application simulates indoor navigation and does not use paid Google Maps APIs or real GPS tracking. All navigation is based on the graph database of locations and pre-defined connections.

## Quick Start Commands

```bash
# Clone the repository
git clone https://github.com/Vedanthdamn/CampusWalk.git
cd CampusWalk

# Setup database (Supabase)
# Run database/schema.sql in Supabase SQL Editor

# Start backend
cd backend
mvn spring-boot:run

# In a new terminal, start frontend
cd frontend
npm install
npm run dev

# Access the application
# Open browser to http://localhost:5173
```

**Built with ❤️ for SRM University Students**