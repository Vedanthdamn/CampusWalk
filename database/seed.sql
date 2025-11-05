-- Seed data for SRM KTR Campus
-- Run this after schema.sql to populate the database with sample data

-- Clear existing data (optional - comment out if you want to keep existing data)
TRUNCATE TABLE graph_edges RESTART IDENTITY CASCADE;
TRUNCATE TABLE graph_nodes RESTART IDENTITY CASCADE;
TRUNCATE TABLE buildings RESTART IDENTITY CASCADE;
TRUNCATE TABLE hostels RESTART IDENTITY CASCADE;

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

-- Verify data was inserted
SELECT 'Hostels: ' || COUNT(*) FROM hostels;
SELECT 'Buildings: ' || COUNT(*) FROM buildings;
SELECT 'Graph Nodes: ' || COUNT(*) FROM graph_nodes;
SELECT 'Graph Edges: ' || COUNT(*) FROM graph_edges;
