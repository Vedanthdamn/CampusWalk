import React, { useState, useEffect } from 'react';
import { getHostels, getBuildings, getNavigation } from '../lib/api';

function SearchPanel({ onRouteFound, onOriginChange, onDestinationChange, selectedOrigin, selectedDestination }) {
  const [hostels, setHostels] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [originHostelId, setOriginHostelId] = useState('');
  const [destinationBuildingId, setDestinationBuildingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOrigin) {
      setOriginHostelId(selectedOrigin.id.toString());
    }
  }, [selectedOrigin]);

  useEffect(() => {
    if (selectedDestination) {
      setDestinationBuildingId(selectedDestination.id.toString());
    }
  }, [selectedDestination]);

  const loadData = async () => {
    try {
      const [hostelsData, buildingsData] = await Promise.all([
        getHostels(),
        getBuildings()
      ]);
      setHostels(hostelsData);
      setBuildings(buildingsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load hostels and buildings');
    }
  };

  const handleStartNavigation = async () => {
    if (!originHostelId || !destinationBuildingId) {
      setError('Please select both origin hostel and destination building');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For simplification, we'll use the hostel/building IDs directly as node IDs
      // In a real scenario, you'd map hostel/building to their entrance nodes
      const route = await getNavigation(originHostelId, destinationBuildingId);
      
      if (route && route.length > 0) {
        onRouteFound(route);
      } else {
        setError('No route found between selected locations');
      }
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Error finding route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Campus Navigation</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Origin Hostel Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Origin Hostel
        </label>
        <select
          value={originHostelId}
          onChange={(e) => {
            setOriginHostelId(e.target.value);
            const hostel = hostels.find(h => h.id.toString() === e.target.value);
            if (hostel) onOriginChange(hostel);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your hostel</option>
          {hostels.map((hostel) => (
            <option key={hostel.id} value={hostel.id}>
              {hostel.name}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Building Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Building
        </label>
        <select
          value={destinationBuildingId}
          onChange={(e) => {
            setDestinationBuildingId(e.target.value);
            const building = buildings.find(b => b.id.toString() === e.target.value);
            if (building) onDestinationChange(building);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select destination building</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {/* Start Navigation Button */}
      <button
        onClick={handleStartNavigation}
        disabled={loading || !originHostelId || !destinationBuildingId}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading || !originHostelId || !destinationBuildingId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Finding Route...' : 'Start Navigation'}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Navigation shows outdoor routes only. The route ends at the building entrance.
        </p>
      </div>
    </div>
  );
}

export default SearchPanel;
