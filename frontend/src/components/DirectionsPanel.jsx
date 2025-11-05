import React from 'react';

function DirectionsPanel({ route, onClose }) {
  if (!route || route.length === 0) {
    return null;
  }

  // Calculate total distance (approximate)
  const calculateTotalDistance = () => {
    let total = 0;
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];
      // Simple Haversine formula for distance
      const R = 6371000; // Earth's radius in meters
      const dLat = (parseFloat(curr.lat) - parseFloat(prev.lat)) * Math.PI / 180;
      const dLng = (parseFloat(curr.lng) - parseFloat(prev.lng)) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(parseFloat(prev.lat) * Math.PI / 180) * 
                Math.cos(parseFloat(curr.lat) * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return Math.round(total);
  };

  const totalDistance = calculateTotalDistance();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Directions</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Distance</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalDistance}m
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Steps</p>
            <p className="text-2xl font-bold text-blue-600">
              {route.length}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step instructions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Step-by-Step
        </h3>
        {route.map((node, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                index === 0 ? 'bg-green-500' :
                index === route.length - 1 ? 'bg-red-500' :
                'bg-blue-500'
              }`}>
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">
                {node.instruction}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {parseFloat(node.lat).toFixed(6)}, 
                Lng: {parseFloat(node.lng).toFixed(6)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close Directions
        </button>
      </div>
    </div>
  );
}

export default DirectionsPanel;
