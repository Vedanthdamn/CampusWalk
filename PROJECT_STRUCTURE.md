# CampusWalk Project Structure

```
CampusWalk/
│
├── README.md                          # Main project documentation
├── DEPLOYMENT.md                      # Deployment guide for various platforms
├── API_TESTING.md                     # API testing examples and Postman collection
├── .gitignore                         # Root gitignore
│
├── database/                          # Database scripts
│   └── schema.sql                     # PostgreSQL schema with sample data
│
├── backend/                           # Spring Boot Backend
│   ├── .gitignore                     # Backend gitignore
│   ├── pom.xml                        # Maven configuration
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/campuswalk/
│       │   │   ├── CampusWalkApplication.java    # Main Spring Boot application
│       │   │   │
│       │   │   ├── config/
│       │   │   │   └── WebConfig.java            # CORS and web configuration
│       │   │   │
│       │   │   ├── models/                       # JPA Entity Models
│       │   │   │   ├── Building.java
│       │   │   │   ├── Floor.java
│       │   │   │   ├── Location.java
│       │   │   │   ├── Edge.java
│       │   │   │   └── VerticalLink.java
│       │   │   │
│       │   │   ├── repositories/                 # JPA Repositories
│       │   │   │   ├── BuildingRepository.java
│       │   │   │   ├── FloorRepository.java
│       │   │   │   ├── LocationRepository.java
│       │   │   │   ├── EdgeRepository.java
│       │   │   │   └── VerticalLinkRepository.java
│       │   │   │
│       │   │   ├── services/                     # Business Logic
│       │   │   │   └── PathfindingService.java   # Dijkstra's algorithm implementation
│       │   │   │
│       │   │   ├── controllers/                  # REST Controllers
│       │   │   │   ├── BuildingController.java
│       │   │   │   ├── FloorController.java
│       │   │   │   ├── LocationController.java
│       │   │   │   └── NavigationController.java
│       │   │   │
│       │   │   └── dto/                          # Data Transfer Objects
│       │   │       ├── PathNode.java
│       │   │       ├── NavigationInstruction.java
│       │   │       ├── RouteResponse.java
│       │   │       └── LocationDTO.java
│       │   │
│       │   └── resources/
│       │       └── application.properties        # Application configuration
│       │
│       └── test/                                 # Test files directory
│           └── java/com/campuswalk/
│
└── frontend/                          # React + Vite Frontend
    ├── .gitignore                     # Frontend gitignore
    ├── package.json                   # NPM dependencies
    ├── package-lock.json              # NPM lock file
    ├── index.html                     # HTML entry point
    ├── vite.config.js                 # Vite configuration
    ├── tailwind.config.js             # TailwindCSS configuration
    ├── postcss.config.js              # PostCSS configuration
    ├── eslint.config.js               # ESLint configuration
    │
    ├── public/                        # Static assets
    │   └── floorplans/                # SVG floor plans
    │       └── techpark_ground.svg    # Sample floor plan
    │
    └── src/
        ├── main.jsx                   # React entry point
        ├── App.jsx                    # Root component
        ├── index.css                  # Global styles
        │
        ├── pages/                     # Page components
        │   └── NavigationPage.jsx     # Main navigation page
        │
        ├── components/                # Reusable components
        │   ├── FloorMapViewer.jsx     # SVG map viewer with route visualization
        │   ├── FloorSelector.jsx      # Building and floor selector
        │   ├── SearchBar.jsx          # Location search component
        │   └── NavigationInstructions.jsx  # Turn-by-turn directions display
        │
        └── utils/                     # Utility functions
            └── api.js                 # Axios API service layer
```

## Component Dependencies

### Backend Dependencies
- **Spring Boot 3.2.0** - Web framework
- **Spring Data JPA** - Database access
- **PostgreSQL Driver** - Database connection
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation

### Frontend Dependencies
- **React 18** - UI library
- **Vite 5** - Build tool
- **TailwindCSS 3** - Styling
- **Axios** - HTTP client
- **React Router DOM 6** - Routing

## Key Features by File

### Backend

#### PathfindingService.java
- Dijkstra's shortest path algorithm
- Graph construction from database
- Multi-floor navigation support
- Turn-by-turn instruction generation
- Distance calculation

#### Controllers
- **BuildingController**: CRUD for buildings
- **FloorController**: Floor management and queries
- **LocationController**: Location search, filtering by type/floor
- **NavigationController**: Route finding endpoint

#### Models
- JPA entities with relationships
- Bidirectional mappings
- Cascade operations
- Soft delete support

### Frontend

#### FloorMapViewer.jsx
- SVG rendering
- Dynamic viewBox calculation
- Interactive location nodes
- Animated route path
- Color-coded location types
- Click handling

#### NavigationPage.jsx
- State management
- API integration
- User flow orchestration
- Error handling

#### SearchBar.jsx
- Real-time search
- Debounced API calls
- Result dropdown
- Keyboard navigation support

## Data Flow

```
User Action
    ↓
React Component
    ↓
API Service (Axios)
    ↓
REST Controller
    ↓
Service Layer (Business Logic)
    ↓
Repository (JPA)
    ↓
Database (PostgreSQL)
    ↓
Response DTO
    ↓
JSON Response
    ↓
React Component Update
    ↓
UI Render
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buildings` | Get all buildings |
| GET | `/api/buildings/{id}` | Get building by ID |
| GET | `/api/floors` | Get all floors |
| GET | `/api/floors/{id}` | Get floor by ID |
| GET | `/api/floors/building/{id}` | Get floors for building |
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/{id}` | Get location by ID |
| GET | `/api/locations/floor/{id}` | Get locations for floor |
| GET | `/api/locations/search?query={term}` | Search locations |
| GET | `/api/locations/type/{type}` | Get locations by type |
| GET | `/api/navigation/route?from={id}&to={id}` | Find route |

## Database Tables

| Table | Rows (Sample) | Purpose |
|-------|---------------|---------|
| buildings | 5 | Campus buildings |
| floors | 11 | Building floors |
| locations | 56 | Points of interest |
| edges | ~50 | Horizontal connections |
| vertical_links | ~13 | Stairs/elevators |

## Location Types

- `entrance` - Building entrances
- `exit` - Building exits
- `room` - Classrooms
- `lab` - Computer/research labs
- `library` - Library sections
- `mess` - Food court areas
- `auditorium` - Auditoriums
- `stairs` - Staircases
- `elevator` - Elevators
- `landmark` - Notable points

## Testing Strategy

1. **Unit Tests**: Service layer logic (Dijkstra's algorithm)
2. **Integration Tests**: API endpoints with test database
3. **E2E Tests**: Full user workflows in browser
4. **Load Tests**: Performance under concurrent users
5. **Manual Tests**: UI/UX validation

## Performance Metrics

- **Backend Response Time**: < 500ms (95th percentile)
- **Frontend Load Time**: < 2s (initial)
- **Route Calculation**: < 300ms (same floor), < 500ms (multi-floor)
- **Search Results**: < 200ms

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention via JPA
- XSS prevention in React
- CORS configuration for production
- Rate limiting (recommended for production)
- HTTPS only in production

## Scalability

- Stateless backend (horizontal scaling)
- Database connection pooling
- Frontend CDN distribution
- API caching layer (Redis)
- Load balancer support

## Future Enhancements Roadmap

### Phase 1 (v1.1)
- [ ] User authentication
- [ ] Favorite locations
- [ ] Route history

### Phase 2 (v1.2)
- [ ] Real-time occupancy data
- [ ] AR navigation overlay
- [ ] Voice navigation

### Phase 3 (v2.0)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Indoor GPS support

## Contributing Guidelines

1. Fork the repository
2. Create feature branch
3. Follow code style (ESLint + Checkstyle)
4. Write tests
5. Update documentation
6. Submit pull request

## Support and Resources

- **GitHub Repository**: https://github.com/Vedanthdamn/CampusWalk
- **Documentation**: README.md, DEPLOYMENT.md, API_TESTING.md
- **Issue Tracker**: GitHub Issues
- **License**: MIT

---

**Project Status**: ✅ Production Ready

**Last Updated**: January 2025

**Maintainer**: SRM University Development Team
