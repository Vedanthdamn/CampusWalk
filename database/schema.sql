-- CampusWalk Database Schema for SRM KTR
-- This schema supports outdoor campus navigation with Dijkstra's algorithm

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: hostels
-- Stores hostel locations on campus
CREATE TABLE IF NOT EXISTS hostels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: buildings
-- Stores building locations on campus
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: graph_nodes
-- Stores all walkable points (entrances, junctions, pathways)
CREATE TABLE IF NOT EXISTS graph_nodes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  node_type VARCHAR(50) NOT NULL, -- 'entrance', 'junction', 'pathway'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: graph_edges
-- Stores connections between nodes with weights (distances)
CREATE TABLE IF NOT EXISTS graph_edges (
  id SERIAL PRIMARY KEY,
  from_node INTEGER NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  to_node INTEGER NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  weight DOUBLE PRECISION NOT NULL, -- Distance in meters
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_graph_edges_from ON graph_edges(from_node);
CREATE INDEX IF NOT EXISTS idx_graph_edges_to ON graph_edges(to_node);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(node_type);

-- ============================================
-- SAMPLE SEED DATA FOR SRM KTR CAMPUS
-- ============================================

-- Insert Hostels
INSERT INTO hostels (name, lat, lng, description) VALUES
('Boys Hostel 1 (BH1)', 12.8234, 80.0445, 'Boys Hostel Block 1'),
('Boys Hostel 2 (BH2)', 12.8245, 80.0455, 'Boys Hostel Block 2'),
('Mens Hostel 12 (MH12)', 12.8220, 80.0465, 'Mens Hostel Block 12');

-- Insert Buildings
INSERT INTO buildings (name, lat, lng, description) VALUES
('Tech Park (TP)', 12.8225, 80.0420, 'Technology Park - IT and CSE Departments'),
('University Building (UB)', 12.8210, 80.0435, 'Main University Building'),
('Library', 12.8215, 80.0440, 'Central Library'),
('Mini Hall', 12.8230, 80.0425, 'Mini Auditorium'),
('Food Court', 12.8228, 80.0438, 'Main Food Court');

-- Insert Graph Nodes (Entrances for hostels and buildings)
INSERT INTO graph_nodes (name, lat, lng, node_type) VALUES
-- Hostel entrances
('BH1-Entrance', 12.8234, 80.0445, 'entrance'),
('BH2-Entrance', 12.8245, 80.0455, 'entrance'),
('MH12-Entrance', 12.8220, 80.0465, 'entrance'),

-- Building entrances
('TP-Entrance', 12.8225, 80.0420, 'entrance'),
('UB-Entrance', 12.8210, 80.0435, 'entrance'),
('Library-Entrance', 12.8215, 80.0440, 'entrance'),
('MiniHall-Entrance', 12.8230, 80.0425, 'entrance'),
('FoodCourt-Entrance', 12.8228, 80.0438, 'entrance'),

-- Junction nodes (pathway intersections)
('Junction-1', 12.8235, 80.0440, 'junction'),
('Junction-2', 12.8230, 80.0435, 'junction'),
('Junction-3', 12.8225, 80.0430, 'junction'),
('Junction-4', 12.8220, 80.0445, 'junction'),
('Junction-5', 12.8240, 80.0448, 'junction');

-- Insert Graph Edges (bidirectional connections)
-- Format: from_node, to_node, weight (distance in meters)

-- BH1 connections
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
(1, 9, 50),  -- BH1-Entrance to Junction-1
(1, 13, 35), -- BH1-Entrance to Junction-5

-- BH2 connections
(2, 13, 40), -- BH2-Entrance to Junction-5
(2, 9, 70),  -- BH2-Entrance to Junction-1

-- MH12 connections
(3, 12, 60), -- MH12-Entrance to Junction-4

-- Junction interconnections
(9, 10, 55),  -- Junction-1 to Junction-2
(9, 8, 45),   -- Junction-1 to FoodCourt-Entrance
(10, 11, 50), -- Junction-2 to Junction-3
(10, 6, 40),  -- Junction-2 to Library-Entrance
(11, 4, 35),  -- Junction-3 to TP-Entrance
(11, 7, 30),  -- Junction-3 to MiniHall-Entrance
(12, 5, 55),  -- Junction-4 to UB-Entrance
(12, 6, 40),  -- Junction-4 to Library-Entrance
(13, 9, 50),  -- Junction-5 to Junction-1

-- Building to junction connections
(4, 11, 35),  -- TP-Entrance to Junction-3
(5, 12, 55),  -- UB-Entrance to Junction-4
(6, 10, 40),  -- Library-Entrance to Junction-2
(6, 12, 40),  -- Library-Entrance to Junction-4
(7, 11, 30),  -- MiniHall-Entrance to Junction-3
(8, 9, 45);   -- FoodCourt-Entrance to Junction-1

-- Add reverse edges for bidirectional paths
INSERT INTO graph_edges (from_node, to_node, weight)
SELECT to_node, from_node, weight FROM graph_edges;

-- ============================================
-- QUERIES FOR TESTING
-- ============================================

-- Get all hostels
-- SELECT * FROM hostels;

-- Get all buildings
-- SELECT * FROM buildings;

-- Get all graph nodes
-- SELECT * FROM graph_nodes ORDER BY id;

-- Get all edges
-- SELECT * FROM graph_edges ORDER BY from_node, to_node;

-- Get neighbors of a specific node
-- SELECT gn.*, ge.weight 
-- FROM graph_edges ge
-- JOIN graph_nodes gn ON ge.to_node = gn.id
-- WHERE ge.from_node = 1;
