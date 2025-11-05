import React, { useState } from 'react';
import MapView from '../components/MapView';
import SearchPanel from '../components/SearchPanel';
import DirectionsPanel from '../components/DirectionsPanel';

function HomePage() {
  const [route, setRoute] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleRouteFound = (routeData) => {
    setRoute(routeData);
    setShowDirections(true);
  };

  const handleOriginSelect = (origin) => {
    setSelectedOrigin(origin);
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
  };

  const handleCloseDirections = () => {
    setShowDirections(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h1 className="text-2xl font-bold">CampusWalk</h1>
              <p className="text-sm text-blue-100">SRM University Navigation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapView
            originNode={selectedOrigin}
            destinationNode={selectedDestination}
            onOriginSelect={handleOriginSelect}
            onDestinationSelect={handleDestinationSelect}
            route={route}
          />
        </div>

        {/* Search Panel - Floating on the left */}
        <div className="absolute top-4 left-4 z-10">
          <SearchPanel
            onRouteFound={handleRouteFound}
            onOriginChange={handleOriginSelect}
            onDestinationChange={handleDestinationSelect}
            selectedOrigin={selectedOrigin}
            selectedDestination={selectedDestination}
          />
        </div>

        {/* Directions Panel - Floating on the right */}
        {showDirections && route && (
          <div className="absolute top-4 right-4 z-10">
            <DirectionsPanel
              route={route}
              onClose={handleCloseDirections}
            />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
        <h3 className="font-bold text-gray-800 mb-2 text-sm">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Hostels</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Buildings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-blue-600"></div>
            <span className="text-xs text-gray-600">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
