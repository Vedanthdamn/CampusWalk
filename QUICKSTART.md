# Quick Start Guide for CampusWalk

This guide will help you get CampusWalk up and running in less than 10 minutes.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ (`java -version`)
- ✅ Maven 3.6+ (`mvn -version`)
- ✅ Node.js 18+ (`node -version`)
- ✅ npm (`npm -version`)
- ✅ Git (`git -version`)

## Option 1: Quick Local Setup (No External Database)

If you want to test the application structure without setting up a database:

### 1. Clone the Repository
```bash
git clone https://github.com/Vedanthdamn/CampusWalk.git
cd CampusWalk
```

### 2. Start Backend (Will fail without DB, but you can verify compilation)
```bash
cd backend
mvn clean install -DskipTests
# This verifies the code compiles correctly
cd ..
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` but won't have data without the backend.

## Option 2: Full Setup with Supabase (Recommended)

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
