import { useEffect, useRef, useState } from 'react';

function FloorMapViewer({ floor, locations, route, fromLocation, toLocation, onLocationClick }) {
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState('0 0 800 600');
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    // Calculate viewBox based on locations
    if (locations && locations.length > 0) {
      const xs = locations.map(l => parseFloat(l.x));
      const ys = locations.map(l => parseFloat(l.y));
      const minX = Math.min(...xs) - 50;
      const minY = Math.min(...ys) - 50;
      const maxX = Math.max(...xs) + 50;
      const maxY = Math.max(...ys) + 50;
      setViewBox(`${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    }
  }, [locations]);

  useEffect(() => {
    // Calculate path length for animation
    if (route && route.path) {
      const path = createPathString(route.path);
      const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.setAttribute('d', path);
      setPathLength(tempPath.getTotalLength());
    }
  }, [route]);

  const createPathString = (pathNodes) => {
    if (!pathNodes || pathNodes.length === 0) return '';
    
    // Filter path nodes for current floor
    const currentFloorNodes = pathNodes.filter(
      node => node.floorId === floor?.id
    );

    if (currentFloorNodes.length === 0) return '';

    let pathStr = `M ${currentFloorNodes[0].x} ${currentFloorNodes[0].y}`;
    for (let i = 1; i < currentFloorNodes.length; i++) {
      pathStr += ` L ${currentFloorNodes[i].x} ${currentFloorNodes[i].y}`;
    }
    return pathStr;
  };

  const getLocationColor = (location) => {
    if (fromLocation && location.id === fromLocation.id) return '#3b82f6'; // blue
    if (toLocation && location.id === toLocation.id) return '#22c55e'; // green
    
    switch (location.type) {
      case 'lab': return '#8b5cf6';
      case 'room': return '#6366f1';
      case 'stairs': return '#f59e0b';
      case 'elevator': return '#f59e0b';
      case 'library': return '#ec4899';
      case 'mess': return '#f97316';
      case 'auditorium': return '#ef4444';
      case 'entrance': return '#10b981';
      default: return '#6b7280';
    }
  };

  const isLocationOnRoute = (locationId) => {
    if (!route || !route.path) return false;
    return route.path.some(node => node.locationId === locationId);
  };

  const handleLocationClickInternal = (location) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  // Filter locations for current floor
  const currentFloorLocations = locations.filter(
    loc => loc.floorId === floor?.id
  );

  const pathString = route && route.path ? createPathString(route.path) : '';

  return (
    <div className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Floor Info */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {floor?.floorName || 'Select a floor'}
            </h3>
            {floor && (
              <p className="text-sm text-gray-500">
                {currentFloorLocations.length} locations on this floor
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>End</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Floor Map */}
      <div className="relative" style={{ minHeight: '500px' }}>
        {floor ? (
          <svg
            ref={svgRef}
            viewBox={viewBox}
            className="w-full h-full"
            style={{ minHeight: '500px' }}
          >
            {/* Background Grid */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Draw edges between locations (simplified) */}
            {currentFloorLocations.map((loc, idx) => (
              currentFloorLocations.slice(idx + 1).map((otherLoc) => {
                const distance = Math.sqrt(
                  Math.pow(parseFloat(loc.x) - parseFloat(otherLoc.x), 2) +
                  Math.pow(parseFloat(loc.y) - parseFloat(otherLoc.y), 2)
                );
                // Only draw edges to nearby locations
                if (distance < 100) {
                  return (
                    <line
                      key={`edge-${loc.id}-${otherLoc.id}`}
                      x1={loc.x}
                      y1={loc.y}
                      x2={otherLoc.x}
                      y2={otherLoc.y}
                      stroke="#d1d5db"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  );
                }
                return null;
              })
            ))}

            {/* Draw route path with animation */}
            {pathString && (
              <>
                {/* Static path background */}
                <path
                  d={pathString}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeOpacity="0.3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Animated path */}
                <path
                  d={pathString}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from={pathLength}
                    to="0"
                    dur="2s"
                    fill="freeze"
                  />
                </path>
                {/* Moving dot animation */}
                <circle r="6" fill="#3b82f6">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={pathString}
                  />
                </circle>
              </>
            )}

            {/* Draw location nodes */}
            {currentFloorLocations.map((location) => {
              const isOnRoute = isLocationOnRoute(location.id);
              const isStart = fromLocation && location.id === fromLocation.id;
              const isEnd = toLocation && location.id === toLocation.id;

              return (
                <g key={location.id}>
                  {/* Location circle */}
                  <circle
                    cx={location.x}
                    cy={location.y}
                    r={isStart || isEnd ? 10 : isOnRoute ? 8 : 6}
                    fill={getLocationColor(location)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleLocationClickInternal(location)}
                  />
                  
                  {/* Location label */}
                  <text
                    x={location.x}
                    y={parseFloat(location.y) - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="500"
                    fill="#374151"
                    className="pointer-events-none select-none"
                  >
                    {location.name}
                  </text>

                  {/* Type badge */}
                  <text
                    x={location.x}
                    y={parseFloat(location.y) + 20}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#6b7280"
                    className="pointer-events-none select-none"
                  >
                    {location.type}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[500px]">
            <div className="text-center text-gray-500">
              <p className="text-lg">No floor selected</p>
              <p className="text-sm mt-2">Please select a building and floor</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span>Lab</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6366f1' }}></div>
            <span>Room</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Stairs/Elevator</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ec4899' }}></div>
            <span>Library</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
            <span>Mess</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <span>Entrance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorMapViewer;
