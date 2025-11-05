# 🚀 Quick Start Guide - CampusWalk

This guide will help you get CampusWalk (outdoor navigation) up and running in under 10 minutes.

## Prerequisites

Make sure you have installed:
- ✅ Java 17 or higher (`java -version`)
- ✅ Maven 3.6+ (`mvn -version`)
- ✅ Node.js 18+ (`node -version`)
- ✅ npm (`npm -version`)
- ✅ A Supabase account (free tier works perfectly)

## Step 1: Clone the Repository

```bash
git clone https://github.com/Vedanthdamn/CampusWalk.git
cd CampusWalk
```

## Step 2: Setup Supabase Database

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details and create
4. Wait ~2 minutes for the project to be ready

### 2.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `database/schema.sql` from this repository
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`
6. You should see success messages - this creates all tables and adds sample seed data

### 2.3 Get Your Connection Details

1. Go to **Project Settings** → **Database**
2. Note these details:
   - Connection string (starts with `postgresql://`)
   - Host (looks like `db.xxxxx.supabase.co`)
   - Your database password

## Step 3: Configure Backend

### 3.1 Edit Database Configuration

Navigate to the backend and edit `application.properties`:

```bash
cd backend/src/main/resources
# Edit application.properties with your favorite editor
```

Update these lines with your Supabase credentials:

```properties
spring.datasource.url=jdbc:postgresql://db.YOUR-PROJECT-REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR-PASSWORD
```

Save the file.

### 3.2 Build and Start Backend

```bash
cd backend  # if not already there
mvn clean install
mvn spring-boot:run
```

Wait for the message: `Started CampusWalkApplication`

✅ Backend is now running at `http://localhost:8080`

## Step 4: Configure Frontend

Open a **new terminal** window.

### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

### 4.2 Configure Supabase Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

To get your anon key:
1. Go to Supabase **Project Settings** → **API**
2. Copy the `anon` `public` key

### 4.3 Start Frontend

```bash
npm run dev
```

✅ Frontend is now running at `http://localhost:5173`

## Step 5: Test the Application

### 5.1 Open in Browser

Navigate to `http://localhost:5173`

You should see the authentication screen.

### 5.2 Login

Choose one of:
- **Sign Up**: Create a new account with email/password
- **Sign In**: If you already have an account  
- **Continue as Guest**: Skip authentication (easiest for testing)

### 5.3 Test Navigation

Once logged in, you'll see:

1. **Campus Map** with OpenStreetMap tiles
2. **Blue markers** = Hostels (BH1, BH2, MH12)
3. **Red markers** = Buildings (TechPark, Library, Food Court, etc.)

**To navigate:**

1. Select your **origin hostel** from the dropdown (e.g., "Boys Hostel 1")
2. Select **destination building** (e.g., "Tech Park")
3. Click **"Start Navigation"**
4. View:
   - Blue route line on the map
   - Turn-by-turn directions panel
   - Distance and step count

## Step 6: Test the API

You can test backend endpoints directly:

```bash
# Get all hostels
curl http://localhost:8080/api/hostels

# Get all buildings
curl http://localhost:8080/api/buildings

# Get navigation route (use actual node IDs from database)
curl "http://localhost:8080/api/navigation?from=1&to=6"
```

## Troubleshooting

### Backend Issues

**Problem: Cannot connect to database**
- ✓ Check Supabase credentials in `application.properties`
- ✓ Verify Supabase project is active (green status)
- ✓ Try pinging the host: `ping db.YOUR-REF.supabase.co`

**Problem: Port 8080 already in use**
```bash
# Find and kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

### Frontend Issues

**Problem: Cannot connect to backend**
- ✓ Verify backend is running: `curl http://localhost:8080/api/buildings`
- ✓ Check browser console for errors (F12)
- ✓ Ensure CORS is enabled in backend (it should be by default)

**Problem: Map not displaying**
- ✓ Check internet connection (needed for OpenStreetMap tiles)
- ✓ Verify Leaflet CSS is loaded (check browser console)
- ✓ Check that lat/lng coordinates are valid numbers

**Problem: No route found**
- ✓ Verify seed data loaded: Check Supabase Table Editor
- ✓ Ensure `graph_nodes` and `graph_edges` tables have data
- ✓ Check browser network tab for API errors

**Problem: Authentication fails**
- ✓ Check Supabase URL and anon key in frontend `.env`
- ✓ Try "Continue as Guest" to bypass auth
- ✓ Verify Supabase Auth is enabled in project settings

## Verification Checklist

- [ ] Backend compiles without errors
- [ ] Backend starts on port 8080
- [ ] Database has sample data (check Supabase dashboard)
- [ ] Frontend installs dependencies successfully
- [ ] Frontend starts on port 5173
- [ ] Can see map with markers
- [ ] Can select hostel and building
- [ ] Navigation route appears on map
- [ ] Directions panel shows instructions

## What's Next?

1. **Explore the Code**
   - Check out `README.md` for full documentation
   - Review `PROJECT_STRUCTURE.md` for code organization

2. **Customize Data**
   - Add more hostels/buildings via SQL
   - Update coordinates for your actual campus
   - Add more graph nodes and edges for better routing

3. **Extend Functionality**
   - Add new features
   - Customize the UI
   - Integrate with other systems

## Quick Commands Reference

```bash
# Backend
cd backend
mvn clean install       # Build
mvn spring-boot:run    # Run
mvn test              # Test

# Frontend  
cd frontend
npm install           # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Database
# Run SQL queries in Supabase SQL Editor
```

## Getting Help

- 📖 **Full Documentation**: See [README.md](README.md)
- 🐛 **Found a Bug**: Open an issue on GitHub
- 💡 **Need Help**: Check GitHub Discussions

## Success! 🎉

If you can see the campus map and navigate between hostels and buildings, you're all set!

Start exploring the code and make it your own.

---

**Estimated Setup Time**: 10-15 minutes

**Built with ❤️ for SRM University Students**

### Step 1: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account
   - Create a new project
   - Wait 2 minutes for project to be ready

2. **Run Database Schema**
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New Query"
   - Copy entire contents of `database/schema.sql`
   - Paste and click "Run"
   - You should see "Success" messages

3. **Get Connection Details**
   - Go to Project Settings → Database
   - Copy the connection string
   - Note your password

### Step 2: Configure Backend

1. **Edit Application Properties**
   ```bash
   cd backend/src/main/resources
   nano application.properties
   # or use any text editor
   ```

2. **Update Database Connection**
   Replace these lines with your Supabase details:
   ```properties
   spring.datasource.url=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=your-password-here
   ```

3. **Save and Close**

### Step 3: Start Backend

```bash
cd backend
mvn spring-boot:run
```

Wait for the message: `Started CampusWalkApplication`

Backend is now running at `http://localhost:8080`

### Step 4: Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend is now running at `http://localhost:5173`

### Step 5: Test the Application

1. **Open Browser**
   - Navigate to `http://localhost:5173`
   - You should see the CampusWalk interface

2. **Test Search**
   - Type "Lab" in the search box
   - You should see Lab-101, Lab-102, etc.

3. **Test Navigation**
   - Click on "Lab-101" in search results
   - Search for "Lab-102"
   - Click on it
   - Click "Find Route"
   - You should see the route highlighted

## Option 3: Docker Setup (Advanced)

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/Vedanthdamn/CampusWalk.git
   cd CampusWalk
   ```

2. **Create Environment File**
   ```bash
   cat > .env << EOF
   DB_PASSWORD=yourpassword
   DB_URL=jdbc:postgresql://db:5432/campuswalk
   DB_USER=postgres
   EOF
   ```

3. **Start All Services**
   ```bash
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: `http://localhost:80`
   - Backend: `http://localhost:8080`
   - Database: `localhost:5432`

## Verification Steps

### 1. Check Backend Health

```bash
curl http://localhost:8080/api/buildings
```

Expected output: JSON array of buildings

### 2. Check Frontend

Open `http://localhost:5173` in browser. You should see:
- CampusWalk header
- Search bar
- Building/Floor selectors
- Map viewer

### 3. Test Navigation

1. Search for "Entrance"
2. Click on "TP-GF-Entrance"
3. Search for "Lab-102"
4. Click on "Lab-102"
5. Click "Find Route"
6. Verify route appears on map

## Common Issues and Solutions

### Issue 1: Backend Won't Start

**Error**: `Connection refused to database`

**Solution**:
1. Verify Supabase project is active
2. Check connection string is correct
3. Verify password is correct
4. Check firewall isn't blocking port 5432

### Issue 2: Frontend Shows Errors

**Error**: `Cannot connect to backend`

**Solution**:
1. Verify backend is running (`http://localhost:8080/api/buildings`)
2. Check proxy configuration in `vite.config.js`
3. Clear browser cache

### Issue 3: No Locations Showing

**Error**: Empty map or "No locations found"

**Solution**:
1. Verify database schema was executed successfully
2. Check database has data:
   ```sql
   SELECT COUNT(*) FROM locations;
   ```
3. Restart backend

### Issue 4: Maven Build Fails

**Error**: `Failed to execute goal`

**Solution**:
```bash
# Clean Maven cache
rm -rf ~/.m2/repository
mvn clean install -U
```

### Issue 5: npm Install Fails

**Error**: `EACCES` or permission errors

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

## Development Tips

### Hot Reload

- **Backend**: Spring Boot DevTools is included - changes reload automatically
- **Frontend**: Vite provides instant HMR (Hot Module Replacement)

### Debug Mode

**Backend**:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

**Frontend**: Use browser DevTools (F12)

### Database GUI

Use these tools to view/edit database:
- [DBeaver](https://dbeaver.io/) (Free, all platforms)
- [pgAdmin](https://www.pgadmin.org/) (Free, PostgreSQL specific)
- Supabase Dashboard (Built-in)

## Next Steps

Once everything is running:

1. **Explore the Code**
   - Read `PROJECT_STRUCTURE.md` for code organization
   - Check `API_TESTING.md` for API examples

2. **Add Your Own Data**
   - Create new buildings in database
   - Add floors and locations
   - Upload your own SVG floor plans

3. **Customize**
   - Change colors in `tailwind.config.js`
   - Add new location types
   - Modify routing algorithm

4. **Deploy**
   - See `DEPLOYMENT.md` for production deployment
   - Consider using Docker for easier deployment

## Getting Help

- **Documentation**: Check README.md
- **API Testing**: See API_TESTING.md
- **Issues**: GitHub Issues
- **Community**: GitHub Discussions

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# Edit files...

# 3. Test locally
cd backend && mvn test
cd frontend && npm run build

# 4. Commit changes
git add .
git commit -m "Add my feature"

# 5. Push and create PR
git push origin feature/my-feature
```

## Performance Testing

Quick load test:
```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install ab  # macOS

# Test API
ab -n 100 -c 10 http://localhost:8080/api/buildings
```

## Monitoring

Check application status:

**Backend Logs**:
```bash
tail -f backend/logs/spring.log
```

**Frontend Console**: Open browser DevTools → Console

**Database Queries**: Check Supabase Dashboard → Database → Query Performance

## Resources

- **React Docs**: https://react.dev
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **TailwindCSS**: https://tailwindcss.com
- **PostgreSQL**: https://www.postgresql.org/docs/

## Success! 🎉

If you can see the map and navigate between locations, you're all set!

Start building amazing features for your campus navigation system.

---

**Estimated Setup Time**: 
- Without Database: 5 minutes
- With Supabase: 15 minutes
- With Docker: 10 minutes

**Need Help?** Open an issue on GitHub!
