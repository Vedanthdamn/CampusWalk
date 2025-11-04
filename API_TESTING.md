# API Testing Guide and Examples

## Base URL
```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## Sample API Requests

### 1. Get All Buildings

**Request:**
```bash
curl -X GET http://localhost:8080/api/buildings
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Park",
    "description": "Main technology and computer science block",
    "createdAt": "2024-01-01T00:00:00",
    "floors": [
      {
        "id": 1,
        "floorNumber": 1,
        "floorName": "Ground Floor",
        "svgUrl": "/floorplans/techpark_ground.svg",
        "createdAt": "2024-01-01T00:00:00"
      },
      {
        "id": 2,
        "floorNumber": 2,
        "floorName": "First Floor",
        "svgUrl": "/floorplans/techpark_first.svg",
        "createdAt": "2024-01-01T00:00:00"
      }
    ]
  },
  {
    "id": 2,
    "name": "University Building",
    "description": "Central academic building with multiple departments",
    "createdAt": "2024-01-01T00:00:00",
    "floors": [...]
  }
]
```

### 2. Get Floors by Building

**Request:**
```bash
curl -X GET http://localhost:8080/api/floors/building/1
```

**Response:**
```json
[
  {
    "id": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "svgUrl": "/floorplans/techpark_ground.svg",
    "createdAt": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "floorNumber": 2,
    "floorName": "First Floor",
    "svgUrl": "/floorplans/techpark_first.svg",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### 3. Get Locations by Floor

**Request:**
```bash
curl -X GET http://localhost:8080/api/locations/floor/1
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "TP-GF-Entrance",
    "type": "entrance",
    "x": 50,
    "y": 50,
    "description": "Main entrance to Tech Park",
    "floorId": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  },
  {
    "id": 2,
    "name": "TP-GF-Reception",
    "type": "landmark",
    "x": 100,
    "y": 50,
    "description": "Reception desk",
    "floorId": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  }
]
```

### 4. Search Locations

**Request:**
```bash
curl -X GET "http://localhost:8080/api/locations/search?query=lab"
```

**Response:**
```json
[
  {
    "id": 3,
    "name": "Lab-101",
    "type": "lab",
    "x": 150,
    "y": 50,
    "description": "Computer Lab 101",
    "floorId": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  },
  {
    "id": 4,
    "name": "Lab-102",
    "type": "lab",
    "x": 200,
    "y": 50,
    "description": "Computer Lab 102",
    "floorId": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  }
]
```

### 5. Get Locations by Type

**Request:**
```bash
curl -X GET http://localhost:8080/api/locations/type/lab
```

**Response:**
```json
[
  {
    "id": 3,
    "name": "Lab-101",
    "type": "lab",
    "x": 150,
    "y": 50,
    "description": "Computer Lab 101",
    "floorId": 1,
    "floorNumber": 1,
    "floorName": "Ground Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  },
  {
    "id": 11,
    "name": "Lab-201",
    "type": "lab",
    "x": 150,
    "y": 50,
    "description": "Computer Lab 201",
    "floorId": 2,
    "floorNumber": 2,
    "floorName": "First Floor",
    "buildingId": 1,
    "buildingName": "Tech Park"
  }
]
```

### 6. Find Route (Same Floor)

**Request:**
```bash
# From TP-GF-Entrance (id:1) to Lab-102 (id:4)
curl -X GET "http://localhost:8080/api/navigation/route?from=1&to=4"
```

**Response:**
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
    {
      "locationId": 2,
      "locationName": "TP-GF-Reception",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 100,
      "y": 50,
      "locationType": "landmark"
    },
    {
      "locationId": 3,
      "locationName": "Lab-101",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 150,
      "y": 50,
      "locationType": "lab"
    },
    {
      "locationId": 4,
      "locationName": "Lab-102",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 200,
      "y": 50,
      "locationType": "lab"
    }
  ],
  "totalDistance": 15.0,
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
    {
      "instruction": "Walk right for 5.0m towards Lab-101",
      "direction": "right",
      "distance": 5.0,
      "locationType": "lab",
      "locationName": "Lab-101"
    },
    {
      "instruction": "Walk right for 5.0m towards Lab-102",
      "direction": "right",
      "distance": 5.0,
      "locationType": "lab",
      "locationName": "Lab-102"
    },
    {
      "instruction": "You have arrived at Lab-102",
      "direction": "arrive",
      "distance": 0.0,
      "locationType": "lab",
      "locationName": "Lab-102"
    }
  ],
  "success": true,
  "message": "Route found successfully"
}
```

### 7. Find Route (Multi-Floor)

**Request:**
```bash
# From Lab-101 Ground Floor (id:3) to Lab-201 First Floor (id:11)
curl -X GET "http://localhost:8080/api/navigation/route?from=3&to=11"
```

**Response:**
```json
{
  "path": [
    {
      "locationId": 3,
      "locationName": "Lab-101",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 150,
      "y": 50,
      "locationType": "lab"
    },
    {
      "locationId": 4,
      "locationName": "Lab-102",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 200,
      "y": 50,
      "locationType": "lab"
    },
    {
      "locationId": 5,
      "locationName": "TP-GF-Stairs1",
      "floorId": 1,
      "floorNumber": 1,
      "buildingName": "Tech Park",
      "x": 250,
      "y": 50,
      "locationType": "stairs"
    },
    {
      "locationId": 9,
      "locationName": "TP-FF-Stairs1",
      "floorId": 2,
      "floorNumber": 2,
      "buildingName": "Tech Park",
      "x": 250,
      "y": 50,
      "locationType": "stairs"
    },
    {
      "locationId": 11,
      "locationName": "Lab-201",
      "floorId": 2,
      "floorNumber": 2,
      "buildingName": "Tech Park",
      "x": 150,
      "y": 50,
      "locationType": "lab"
    }
  ],
  "totalDistance": 30.0,
  "instructions": [
    {
      "instruction": "Start at Lab-101",
      "direction": "start",
      "distance": 0.0,
      "locationType": "lab",
      "locationName": "Lab-101"
    },
    {
      "instruction": "Walk right for 5.0m towards Lab-102",
      "direction": "right",
      "distance": 5.0,
      "locationType": "lab",
      "locationName": "Lab-102"
    },
    {
      "instruction": "Walk right for 5.0m towards TP-GF-Stairs1",
      "direction": "right",
      "distance": 5.0,
      "locationType": "stairs",
      "locationName": "TP-GF-Stairs1"
    },
    {
      "instruction": "Take stairs to Tech Park - Floor 2",
      "direction": "stairs",
      "distance": 15.0,
      "locationType": "stairs",
      "locationName": "TP-FF-Stairs1"
    },
    {
      "instruction": "Walk left for 5.0m towards Lab-201",
      "direction": "left",
      "distance": 5.0,
      "locationType": "lab",
      "locationName": "Lab-201"
    },
    {
      "instruction": "You have arrived at Lab-201",
      "direction": "arrive",
      "distance": 0.0,
      "locationType": "lab",
      "locationName": "Lab-201"
    }
  ],
  "success": true,
  "message": "Route found successfully"
}
```

## Postman Collection

You can import this collection into Postman for easy testing:

```json
{
  "info": {
    "name": "CampusWalk API",
    "description": "Indoor Navigation API for SRM University",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Buildings",
      "item": [
        {
          "name": "Get All Buildings",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/buildings"
          }
        },
        {
          "name": "Get Building by ID",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/buildings/1"
          }
        }
      ]
    },
    {
      "name": "Floors",
      "item": [
        {
          "name": "Get All Floors",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/floors"
          }
        },
        {
          "name": "Get Floors by Building",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/floors/building/1"
          }
        }
      ]
    },
    {
      "name": "Locations",
      "item": [
        {
          "name": "Get All Locations",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/locations"
          }
        },
        {
          "name": "Search Locations",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/locations/search?query=lab",
              "query": [
                {
                  "key": "query",
                  "value": "lab"
                }
              ]
            }
          }
        },
        {
          "name": "Get Locations by Floor",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/locations/floor/1"
          }
        },
        {
          "name": "Get Locations by Type",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/locations/type/lab"
          }
        }
      ]
    },
    {
      "name": "Navigation",
      "item": [
        {
          "name": "Find Route (Same Floor)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/navigation/route?from=1&to=4",
              "query": [
                {
                  "key": "from",
                  "value": "1"
                },
                {
                  "key": "to",
                  "value": "4"
                }
              ]
            }
          }
        },
        {
          "name": "Find Route (Multi-Floor)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/navigation/route?from=3&to=11",
              "query": [
                {
                  "key": "from",
                  "value": "3"
                },
                {
                  "key": "to",
                  "value": "11"
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api"
    }
  ]
}
```

## Testing with JavaScript/Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// Test 1: Get all buildings
async function testGetBuildings() {
  try {
    const response = await axios.get(`${API_BASE}/buildings`);
    console.log('Buildings:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test 2: Search locations
async function testSearchLocations() {
  try {
    const response = await axios.get(`${API_BASE}/locations/search`, {
      params: { query: 'lab' }
    });
    console.log('Search Results:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test 3: Find route
async function testFindRoute() {
  try {
    const response = await axios.get(`${API_BASE}/navigation/route`, {
      params: { from: 1, to: 4 }
    });
    console.log('Route:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run tests
testGetBuildings();
testSearchLocations();
testFindRoute();
```

## Load Testing with Apache Bench

```bash
# Test get buildings endpoint
ab -n 1000 -c 10 http://localhost:8080/api/buildings

# Test search endpoint
ab -n 1000 -c 10 "http://localhost:8080/api/locations/search?query=lab"

# Test navigation endpoint
ab -n 500 -c 5 "http://localhost:8080/api/navigation/route?from=1&to=4"
```

## Expected Performance

- **Buildings/Floors endpoints**: < 100ms
- **Location search**: < 200ms
- **Navigation (same floor)**: < 300ms
- **Navigation (multi-floor)**: < 500ms

## Error Responses

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 404,
  "error": "Not Found",
  "path": "/api/buildings/999"
}
```

### 400 Bad Request
```json
{
  "path": null,
  "totalDistance": 0.0,
  "instructions": null,
  "success": false,
  "message": "Invalid location IDs"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/navigation/route"
}
```

## Integration Testing Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "Testing CampusWalk API..."

# Test 1: Buildings
echo "\n1. Testing Buildings endpoint..."
curl -s "$BASE_URL/buildings" | jq '.[0].name'

# Test 2: Floors
echo "\n2. Testing Floors endpoint..."
curl -s "$BASE_URL/floors/building/1" | jq '.[0].floorName'

# Test 3: Locations
echo "\n3. Testing Locations endpoint..."
curl -s "$BASE_URL/locations/floor/1" | jq '.[0].name'

# Test 4: Search
echo "\n4. Testing Search endpoint..."
curl -s "$BASE_URL/locations/search?query=lab" | jq 'length'

# Test 5: Navigation
echo "\n5. Testing Navigation endpoint..."
curl -s "$BASE_URL/navigation/route?from=1&to=4" | jq '.totalDistance'

echo "\n\nAll tests completed!"
```

## Continuous Testing

Set up automated testing with GitHub Actions or Jenkins to run these tests on every commit.
