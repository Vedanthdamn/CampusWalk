import { GraphNode, GraphEdge } from './supabaseClient';

export function dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNodeId: number,
  endNodeId: number
): GraphNode[] | null {
  // Build adjacency list
  const adjacencyList: Map<number, { nodeId: number; weight: number }[]> = new Map();
  
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach((edge) => {
    adjacencyList.get(edge.from_node)?.push({
      nodeId: edge.to_node,
      weight: edge.weight,
    });
    adjacencyList.get(edge.to_node)?.push({
      nodeId: edge.from_node,
      weight: edge.weight,
    });
  });

  // Initialize distances and previous nodes
  const distances: Map<number, number> = new Map();
  const previous: Map<number, number | null> = new Map();
  const unvisited: Set<number> = new Set();

  nodes.forEach((node) => {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
    unvisited.add(node.id);
  });

  distances.set(startNodeId, 0);

  // Priority queue implementation using array (for simplicity)
  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentNode: number | null = null;
    let smallestDistance = Infinity;

    unvisited.forEach((nodeId) => {
      const dist = distances.get(nodeId) || Infinity;
      if (dist < smallestDistance) {
        smallestDistance = dist;
        currentNode = nodeId;
      }
    });

    if (currentNode === null || smallestDistance === Infinity) {
      break; // No path found
    }

    if (currentNode === endNodeId) {
      break; // Reached destination
    }

    unvisited.delete(currentNode);

    // Update distances to neighbors
    const neighbors = adjacencyList.get(currentNode) || [];
    neighbors.forEach((neighbor) => {
      if (unvisited.has(neighbor.nodeId)) {
        const altDistance = (distances.get(currentNode!) || 0) + neighbor.weight;
        if (altDistance < (distances.get(neighbor.nodeId) || Infinity)) {
          distances.set(neighbor.nodeId, altDistance);
          previous.set(neighbor.nodeId, currentNode);
        }
      }
    });
  }

  // Reconstruct path
  if ((distances.get(endNodeId) || Infinity) === Infinity) {
    return null; // No path found
  }

  const path: number[] = [];
  let currentId: number | null = endNodeId;

  while (currentId !== null) {
    path.unshift(currentId);
    currentId = previous.get(currentId) || null;
  }

  // Convert node IDs to node objects
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const pathNodes = path.map((id) => nodeMap.get(id)!).filter(Boolean);

  return pathNodes;
}
