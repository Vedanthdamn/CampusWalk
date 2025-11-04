# Deployment Guide for CampusWalk

## Docker Deployment (Recommended)

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=${DB_URL}
      - SPRING_DATASOURCE_USERNAME=${DB_USER}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=campuswalk
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres-data:
```

## Cloud Deployment Options

### 1. Heroku

#### Backend (Spring Boot):
```bash
# Login to Heroku
heroku login

# Create app
heroku create campuswalk-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend (React):
```bash
# Create frontend app
heroku create campuswalk-frontend

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git subtree push --prefix frontend heroku main
```

### 2. AWS (Elastic Beanstalk)

#### Backend:
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-17 campuswalk-backend

# Create environment
eb create campuswalk-backend-env

# Deploy
eb deploy
```

#### Frontend (S3 + CloudFront):
```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://campuswalk-frontend

# Configure CloudFront for SPA
```

### 3. Digital Ocean

#### Using App Platform:
1. Connect GitHub repository
2. Configure build settings:
   - Backend: Maven, Java 17
   - Frontend: Node.js, npm
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### 4. Google Cloud Platform

#### Backend (Cloud Run):
```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/campuswalk-backend

# Deploy to Cloud Run
gcloud run deploy campuswalk-backend \
  --image gcr.io/PROJECT_ID/campuswalk-backend \
  --platform managed \
  --region us-central1
```

#### Frontend (Firebase Hosting):
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
cd frontend
npm run build
firebase deploy
```

## Environment Variables

Create `.env` files for each environment:

### Backend `.env`:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
```

### Frontend `.env`:
```properties
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Production Checklist

- [ ] Update database credentials
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Enable rate limiting on APIs
- [ ] Configure CDN for frontend assets
- [ ] Set up CI/CD pipeline
- [ ] Document API versioning strategy
- [ ] Configure database connection pooling
- [ ] Enable database indexing
- [ ] Set up health check endpoints
- [ ] Configure auto-scaling (if needed)
- [ ] Test disaster recovery procedures

## Monitoring and Maintenance

### Backend Monitoring
```java
// Add Spring Boot Actuator
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access health endpoints:
- `/actuator/health` - Application health
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application info

### Database Maintenance

```sql
-- Regular maintenance queries
VACUUM ANALYZE buildings;
VACUUM ANALYZE floors;
VACUUM ANALYZE locations;
VACUUM ANALYZE edges;
VACUUM ANALYZE vertical_links;

-- Check database size
SELECT pg_size_pretty(pg_database_size('campuswalk'));

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Scaling Considerations

1. **Database Optimization**
   - Add read replicas for heavy read operations
   - Implement database connection pooling
   - Cache frequently accessed data

2. **Backend Scaling**
   - Horizontal scaling with load balancer
   - Stateless session management
   - API caching with Redis

3. **Frontend Optimization**
   - CDN for static assets
   - Code splitting and lazy loading
   - Service worker for offline support

## Backup Strategy

### Automated Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres campuswalk > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://campuswalk-backups/
```

### Restore from Backup
```bash
gunzip backup_20240101_120000.sql.gz
psql -h localhost -U postgres campuswalk < backup_20240101_120000.sql
```

## Security Best Practices

1. **API Security**
   - Implement rate limiting
   - Add authentication/authorization if needed
   - Validate all inputs
   - Use HTTPS only in production

2. **Database Security**
   - Use strong passwords
   - Limit database access to application only
   - Regular security updates
   - Enable SSL for database connections

3. **Environment Security**
   - Never commit secrets to Git
   - Use environment variables
   - Rotate credentials regularly
   - Keep dependencies updated

## Performance Optimization

### Backend
```properties
# Production application.properties
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.generate_statistics=false
logging.level.root=WARN

# Connection pooling
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### Frontend
```javascript
// vite.config.js for production
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          api: ['axios'],
        },
      },
    },
  },
})
```

## Troubleshooting Production Issues

### Common Issues

1. **Memory Leaks**
   ```bash
   # Monitor Java heap
   jmap -heap <pid>
   
   # Heap dump
   jmap -dump:format=b,file=heap.bin <pid>
   ```

2. **Database Connection Issues**
   ```sql
   -- Check active connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Kill idle connections
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'idle' AND state_change < current_timestamp - interval '5 minutes';
   ```

3. **High CPU Usage**
   ```bash
   # Find expensive queries
   SELECT pid, query, state, query_start 
   FROM pg_stat_activity 
   WHERE state != 'idle' 
   ORDER BY query_start;
   ```

## Support and Updates

For production support:
1. Monitor application logs
2. Set up alerting for errors
3. Regular dependency updates
4. Security patch management
5. Performance monitoring
6. User feedback collection
