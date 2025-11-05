-- CampusWalk Database Schema for Supabase PostgreSQL
-- Outdoor Navigation System for SRM University Kattankulathur Campus
-- NO FLOORS - Routing stops at building entrances

-- Drop existing tables if they exist
DROP TABLE IF EXISTS graph_edges CASCADE;
DROP TABLE IF EXISTS graph_nodes CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS hostels CASCADE;

-- Hostels table
CREATE TABLE hostels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    lat NUMERIC(10, 8) NOT NULL,
    lng NUMERIC(11, 8) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings table (destination points)
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    lat NUMERIC(10, 8) NOT NULL,
    lng NUMERIC(11, 8) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Graph nodes table (outdoor walkable points - junctions, pathways)
CREATE TABLE graph_nodes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    lat NUMERIC(10, 8) NOT NULL,
    lng NUMERIC(11, 8) NOT NULL,
    node_type TEXT DEFAULT 'junction', -- junction, pathway, entrance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Graph edges table (connections between nodes representing walkable paths)
CREATE TABLE graph_edges (
    id SERIAL PRIMARY KEY,
    from_node INT REFERENCES graph_nodes(id) ON DELETE CASCADE,
    to_node INT REFERENCES graph_nodes(id) ON DELETE CASCADE,
    weight NUMERIC NOT NULL, -- distance in meters
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_node != to_node)
);

-- Create indexes for better query performance
CREATE INDEX idx_edges_from ON graph_edges(from_node);
CREATE INDEX idx_edges_to ON graph_edges(to_node);

-- Sample seed data for SRM KTR Campus
-- Coordinates are approximate for SRM Kattankulathur Campus

-- Insert Hostels
INSERT INTO hostels (id, name, lat, lng, description) VALUES
(1, 'Boys Hostel 1 (BH1)', 12.823456, 80.043210, 'Boys Hostel Block 1'),
(2, 'Boys Hostel 2 (BH2)', 12.824567, 80.044321, 'Boys Hostel Block 2'),
(3, 'Boys Hostel 12 (MH12)', 12.825678, 80.045432, 'Mega Hostel Block 12');

-- Insert Buildings (Academic and Common Areas)
INSERT INTO buildings (id, name, lat, lng, description) VALUES
(1, 'Tech Park (TP)', 12.822345, 80.041234, 'Technology Park - Computer Science Block'),
(2, 'Mini Hall', 12.821234, 80.042345, 'Mini Auditorium and Event Hall'),
(3, 'Main Academic Block', 12.820123, 80.043456, 'Main Academic Building'),
(4, 'University Building (UB)', 12.821456, 80.044567, 'University Building - Central Academic Block'),
(5, 'Library', 12.822567, 80.045678, 'Central Library - Dr. T.P. Ganesan Library'),
(6, 'Food Court', 12.823678, 80.046789, 'Main Food Court');

-- Insert Graph Nodes (Junctions and Pathways)
-- Hostel area nodes
INSERT INTO graph_nodes (id, name, lat, lng, node_type) VALUES
(1, 'BH1-Entrance', 12.823456, 80.043210, 'entrance'),
(2, 'BH2-Entrance', 12.824567, 80.044321, 'entrance'),
(3, 'MH12-Entrance', 12.825678, 80.045432, 'entrance'),
(4, 'Hostel-Junction-1', 12.824000, 80.043500, 'junction'),
(5, 'Hostel-Junction-2', 12.825000, 80.044500, 'junction');

-- Building entrance nodes
INSERT INTO graph_nodes (id, name, lat, lng, node_type) VALUES
(6, 'TP-Entrance', 12.822345, 80.041234, 'entrance'),
(7, 'MiniHall-Entrance', 12.821234, 80.042345, 'entrance'),
(8, 'MainBlock-Entrance', 12.820123, 80.043456, 'entrance'),
(9, 'UB-Entrance', 12.821456, 80.044567, 'entrance'),
(10, 'Library-Entrance', 12.822567, 80.045678, 'entrance'),
(11, 'FoodCourt-Entrance', 12.823678, 80.046789, 'entrance');

-- Pathway junction nodes
INSERT INTO graph_nodes (id, name, lat, lng, node_type) VALUES
(12, 'Main-Road-Junction-1', 12.822000, 80.042000, 'junction'),
(13, 'Main-Road-Junction-2', 12.821500, 80.043000, 'junction'),
(14, 'Main-Road-Junction-3', 12.822500, 80.044000, 'junction'),
(15, 'Main-Road-Junction-4', 12.823000, 80.045000, 'junction'),
(16, 'Cross-Path-Junction-1', 12.822800, 80.043200, 'junction'),
(17, 'Cross-Path-Junction-2', 12.823500, 80.044300, 'junction'),
(18, 'Cross-Path-Junction-3', 12.824200, 80.045400, 'junction');

-- Insert Graph Edges (Walkable Paths)
-- Bidirectional edges - each path in both directions

-- Hostel connections to junctions
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
-- BH1 connections
(1, 4, 80),
(4, 1, 80),
-- BH2 connections
(2, 5, 90),
(5, 2, 90),
-- MH12 connections
(3, 5, 70),
(5, 3, 70),
-- Hostel junction connections
(4, 5, 120),
(5, 4, 120),
(4, 16, 100),
(16, 4, 100),
(5, 17, 110),
(17, 5, 110);

-- Main road connections (backbone pathway)
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
(12, 13, 150),
(13, 12, 150),
(13, 14, 140),
(14, 13, 140),
(14, 15, 130),
(15, 14, 130);

-- Building entrance connections
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
-- Tech Park
(6, 12, 60),
(12, 6, 60),
-- Mini Hall
(7, 13, 50),
(13, 7, 50),
-- Main Block
(8, 13, 80),
(13, 8, 80),
-- University Building
(9, 14, 70),
(14, 9, 70),
-- Library
(10, 15, 65),
(15, 10, 65),
-- Food Court
(11, 15, 85),
(15, 11, 85);

-- Cross paths connections
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
(16, 12, 95),
(12, 16, 95),
(16, 13, 110),
(13, 16, 110),
(17, 14, 100),
(14, 17, 100),
(17, 15, 90),
(15, 17, 90),
(18, 15, 80),
(15, 18, 80),
(18, 11, 70),
(11, 18, 70);

-- Additional cross-campus shortcuts
INSERT INTO graph_edges (from_node, to_node, weight) VALUES
(16, 14, 180),
(14, 16, 180),
(4, 12, 150),
(12, 4, 150);

-- Reset sequence counters
SELECT setval('hostels_id_seq', (SELECT MAX(id) FROM hostels));
SELECT setval('buildings_id_seq', (SELECT MAX(id) FROM buildings));
SELECT setval('graph_nodes_id_seq', (SELECT MAX(id) FROM graph_nodes));
SELECT setval('graph_edges_id_seq', (SELECT MAX(id) FROM graph_edges));

-- Sample data for SRM KTR Campus
-- Insert Buildings
INSERT INTO buildings (id, name, description) VALUES
(1, 'Tech Park', 'Main technology and computer science block'),
(2, 'University Building', 'Central academic building with multiple departments'),
(3, 'Library', 'Central Library - Dr. T.P. Ganesan Library'),
(4, 'Food Court', 'Main food court and dining area'),
(5, 'Admin Block', 'Administrative offices and services');

-- Insert Floors for Tech Park
INSERT INTO floors (id, building_id, floor_number, floor_name, svg_url) VALUES
(1, 1, 1, 'Ground Floor', '/floorplans/techpark_ground.svg'),
(2, 1, 2, 'First Floor', '/floorplans/techpark_first.svg'),
(3, 1, 3, 'Second Floor', '/floorplans/techpark_second.svg');

-- Insert Floors for University Building
INSERT INTO floors (id, building_id, floor_number, floor_name, svg_url) VALUES
(4, 2, 1, 'Ground Floor', '/floorplans/ub_ground.svg'),
(5, 2, 2, 'First Floor', '/floorplans/ub_first.svg');

-- Insert Floors for Library
INSERT INTO floors (id, building_id, floor_number, floor_name, svg_url) VALUES
(6, 3, 1, 'Ground Floor', '/floorplans/library_ground.svg'),
(7, 3, 2, 'First Floor', '/floorplans/library_first.svg'),
(8, 3, 3, 'Second Floor', '/floorplans/library_second.svg');

-- Insert Floors for Food Court
INSERT INTO floors (id, building_id, floor_number, floor_name, svg_url) VALUES
(9, 4, 1, 'Ground Floor', '/floorplans/foodcourt_ground.svg');

-- Insert Floors for Admin Block
INSERT INTO floors (id, building_id, floor_number, floor_name, svg_url) VALUES
(10, 5, 1, 'Ground Floor', '/floorplans/admin_ground.svg'),
(11, 5, 2, 'First Floor', '/floorplans/admin_first.svg');

-- Locations for Tech Park - Ground Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(1, 'TP-GF-Entrance', 'entrance', 50, 50, 'Main entrance to Tech Park'),
(1, 'TP-GF-Reception', 'landmark', 100, 50, 'Reception desk'),
(1, 'Lab-101', 'lab', 150, 50, 'Computer Lab 101'),
(1, 'Lab-102', 'lab', 200, 50, 'Computer Lab 102'),
(1, 'TP-GF-Stairs1', 'stairs', 250, 50, 'Staircase 1'),
(1, 'TP-GF-Elevator1', 'elevator', 270, 50, 'Elevator 1'),
(1, 'Room-103', 'room', 150, 100, 'Classroom 103'),
(1, 'Room-104', 'room', 200, 100, 'Classroom 104');

-- Locations for Tech Park - First Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(2, 'TP-FF-Stairs1', 'stairs', 250, 50, 'Staircase 1 - First Floor'),
(2, 'TP-FF-Elevator1', 'elevator', 270, 50, 'Elevator 1 - First Floor'),
(2, 'Lab-201', 'lab', 150, 50, 'Computer Lab 201'),
(2, 'Lab-202', 'lab', 200, 50, 'Computer Lab 202'),
(2, 'Room-203', 'room', 150, 100, 'Classroom 203'),
(2, 'Room-204', 'room', 200, 100, 'Classroom 204'),
(2, 'Faculty-Office-1', 'room', 100, 100, 'Faculty Office Area');

-- Locations for Tech Park - Second Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(3, 'TP-SF-Stairs1', 'stairs', 250, 50, 'Staircase 1 - Second Floor'),
(3, 'TP-SF-Elevator1', 'elevator', 270, 50, 'Elevator 1 - Second Floor'),
(3, 'Lab-301', 'lab', 150, 50, 'Computer Lab 301'),
(3, 'Lab-302', 'lab', 200, 50, 'Computer Lab 302'),
(3, 'Auditorium', 'auditorium', 150, 150, 'Tech Park Auditorium');

-- Locations for University Building - Ground Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(4, 'UB-GF-Entrance', 'entrance', 50, 50, 'UB Main Entrance'),
(4, 'UB-GF-Stairs', 'stairs', 200, 50, 'UB Staircase'),
(4, 'UB-GF-Elevator', 'elevator', 220, 50, 'UB Elevator'),
(4, 'Room-UB-101', 'room', 150, 50, 'Classroom UB-101'),
(4, 'Room-UB-102', 'room', 150, 100, 'Classroom UB-102');

-- Locations for University Building - First Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(5, 'UB-FF-Stairs', 'stairs', 200, 50, 'UB Staircase - First Floor'),
(5, 'UB-FF-Elevator', 'elevator', 220, 50, 'UB Elevator - First Floor'),
(5, 'Room-UB-201', 'room', 150, 50, 'Classroom UB-201'),
(5, 'Lab-UB-202', 'lab', 150, 100, 'Lab UB-202');

-- Locations for Library - Ground Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(6, 'LIB-GF-Entrance', 'entrance', 50, 50, 'Library Main Entrance'),
(6, 'LIB-GF-Reception', 'landmark', 100, 50, 'Library Reception'),
(6, 'LIB-GF-Stairs', 'stairs', 200, 50, 'Library Staircase'),
(6, 'LIB-GF-Elevator', 'elevator', 220, 50, 'Library Elevator'),
(6, 'Reading-Room-1', 'library', 150, 100, 'Reading Room 1'),
(6, 'Periodicals', 'library', 200, 100, 'Periodicals Section');

-- Locations for Library - First Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(7, 'LIB-FF-Stairs', 'stairs', 200, 50, 'Library Staircase - First Floor'),
(7, 'LIB-FF-Elevator', 'elevator', 220, 50, 'Library Elevator - First Floor'),
(7, 'Reference-Section', 'library', 150, 50, 'Reference Book Section'),
(7, 'Study-Area-1', 'library', 150, 100, 'Study Area 1');

-- Locations for Library - Second Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(8, 'LIB-SF-Stairs', 'stairs', 200, 50, 'Library Staircase - Second Floor'),
(8, 'LIB-SF-Elevator', 'elevator', 220, 50, 'Library Elevator - Second Floor'),
(8, 'Digital-Library', 'library', 150, 50, 'Digital Library'),
(8, 'Study-Area-2', 'library', 150, 100, 'Study Area 2');

-- Locations for Food Court
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(9, 'FC-Entrance', 'entrance', 50, 50, 'Food Court Entrance'),
(9, 'North-Indian-Counter', 'mess', 100, 50, 'North Indian Food Counter'),
(9, 'South-Indian-Counter', 'mess', 150, 50, 'South Indian Food Counter'),
(9, 'Chinese-Counter', 'mess', 200, 50, 'Chinese Food Counter'),
(9, 'Dining-Area-1', 'mess', 150, 100, 'Dining Area 1'),
(9, 'Dining-Area-2', 'mess', 200, 100, 'Dining Area 2');

-- Locations for Admin Block - Ground Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(10, 'ADMIN-GF-Entrance', 'entrance', 50, 50, 'Admin Block Entrance'),
(10, 'ADMIN-GF-Stairs', 'stairs', 200, 50, 'Admin Staircase'),
(10, 'Admissions-Office', 'room', 150, 50, 'Admissions Office'),
(10, 'Accounts-Office', 'room', 150, 100, 'Accounts Office');

-- Locations for Admin Block - First Floor
INSERT INTO locations (floor_id, name, type, x, y, description) VALUES
(11, 'ADMIN-FF-Stairs', 'stairs', 200, 50, 'Admin Staircase - First Floor'),
(11, 'Registrar-Office', 'room', 150, 50, 'Registrar Office'),
(11, 'HOD-Offices', 'room', 150, 100, 'HOD Offices');

-- Insert Edges for Tech Park Ground Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
-- Tech Park Ground Floor connections
(1, 2, 5),  -- Entrance to Reception
(2, 3, 5),  -- Reception to Lab 101
(3, 4, 5),  -- Lab 101 to Lab 102
(4, 5, 5),  -- Lab 102 to Stairs
(5, 6, 2),  -- Stairs to Elevator
(2, 7, 7),  -- Reception to Room 103
(7, 8, 5),  -- Room 103 to Room 104
(3, 7, 7),  -- Lab 101 to Room 103
(4, 8, 7);  -- Lab 102 to Room 104

-- Insert Edges for Tech Park First Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(9, 10, 2),   -- Stairs to Elevator
(9, 11, 5),   -- Stairs to Lab 201
(11, 12, 5),  -- Lab 201 to Lab 202
(9, 15, 7),   -- Stairs to Faculty Office
(15, 13, 7),  -- Faculty Office to Room 203
(13, 14, 5);  -- Room 203 to Room 204

-- Insert Edges for Tech Park Second Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(16, 17, 2),  -- Stairs to Elevator
(16, 18, 5),  -- Stairs to Lab 301
(18, 19, 5),  -- Lab 301 to Lab 302
(18, 20, 10); -- Lab 301 to Auditorium

-- Insert Edges for University Building Ground Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(21, 22, 15), -- Entrance to Stairs
(22, 23, 2),  -- Stairs to Elevator
(21, 24, 10), -- Entrance to Room 101
(24, 25, 7);  -- Room 101 to Room 102

-- Insert Edges for University Building First Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(26, 27, 2),  -- Stairs to Elevator
(26, 28, 5),  -- Stairs to Room 201
(28, 29, 7);  -- Room 201 to Lab 202

-- Insert Edges for Library Ground Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(30, 31, 5),  -- Entrance to Reception
(31, 32, 10), -- Reception to Stairs
(32, 33, 2),  -- Stairs to Elevator
(31, 34, 8),  -- Reception to Reading Room
(34, 35, 5);  -- Reading Room to Periodicals

-- Insert Edges for Library First Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(36, 37, 2),  -- Stairs to Elevator
(36, 38, 5),  -- Stairs to Reference Section
(38, 39, 7);  -- Reference to Study Area

-- Insert Edges for Library Second Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(40, 41, 2),  -- Stairs to Elevator
(40, 42, 5),  -- Stairs to Digital Library
(42, 43, 7);  -- Digital Library to Study Area

-- Insert Edges for Food Court
INSERT INTO edges (from_location, to_location, weight) VALUES
(44, 45, 5),  -- Entrance to North Indian
(45, 46, 5),  -- North to South Indian
(46, 47, 5),  -- South to Chinese
(45, 48, 8),  -- North Indian to Dining 1
(48, 49, 5),  -- Dining 1 to Dining 2
(46, 48, 7);  -- South Indian to Dining 1

-- Insert Edges for Admin Block Ground Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(50, 51, 15), -- Entrance to Stairs
(50, 52, 10), -- Entrance to Admissions
(52, 53, 7);  -- Admissions to Accounts

-- Insert Edges for Admin Block First Floor
INSERT INTO edges (from_location, to_location, weight) VALUES
(54, 55, 5),  -- Stairs to Registrar
(55, 56, 7);  -- Registrar to HOD Offices

-- Insert Vertical Links (Stairs connections)
INSERT INTO vertical_links (from_location, to_location, vertical_type, weight) VALUES
-- Tech Park Stairs
(5, 9, 'stairs', 15),    -- Ground to First Floor
(9, 16, 'stairs', 15),   -- First to Second Floor
-- Tech Park Elevators
(6, 10, 'elevator', 10),  -- Ground to First Floor
(10, 17, 'elevator', 10), -- First to Second Floor
-- UB Stairs and Elevators
(22, 26, 'stairs', 15),
(23, 27, 'elevator', 10),
-- Library Stairs and Elevators
(32, 36, 'stairs', 15),
(36, 40, 'stairs', 15),
(33, 37, 'elevator', 10),
(37, 41, 'elevator', 10),
-- Admin Stairs
(51, 54, 'stairs', 15);

-- Reset sequence counters
SELECT setval('buildings_id_seq', (SELECT MAX(id) FROM buildings));
SELECT setval('floors_id_seq', (SELECT MAX(id) FROM floors));
SELECT setval('locations_id_seq', (SELECT MAX(id) FROM locations));
SELECT setval('edges_id_seq', (SELECT MAX(id) FROM edges));
SELECT setval('vertical_links_id_seq', (SELECT MAX(id) FROM vertical_links));

-- Grant necessary permissions (adjust as needed for Supabase)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
