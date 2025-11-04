import { useState, useEffect } from 'react';
import { buildingService, locationService, navigationService } from '../utils/api';
import FloorMapViewer from '../components/FloorMapViewer';
import SearchBar from '../components/SearchBar';
import NavigationInstructions from '../components/NavigationInstructions';
import FloorSelector from '../components/FloorSelector';

function NavigationPage() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    if (selectedFloor) {
      loadLocationsForFloor(selectedFloor.id);
    }
  }, [selectedFloor]);

  const loadBuildings = async () => {
    try {
      const response = await buildingService.getAll();
      setBuildings(response.data);
      if (response.data.length > 0) {
        setSelectedBuilding(response.data[0]);
        if (response.data[0].floors && response.data[0].floors.length > 0) {
          setSelectedFloor(response.data[0].floors[0]);
        }
      }
    } catch (err) {
      setError('Failed to load buildings: ' + err.message);
    }
  };

  const loadLocationsForFloor = async (floorId) => {
    try {
      const response = await locationService.getByFloor(floorId);
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    }
  };

  const handleSearchResult = (location) => {
    if (!fromLocation) {
      setFromLocation(location);
    } else if (!toLocation) {
      setToLocation(location);
    }
  };

  const handleLocationClick = (location) => {
    if (!fromLocation) {
      setFromLocation(location);
    } else if (!toLocation) {
      setToLocation(location);
    } else {
      // Reset and start new route
      setFromLocation(location);
      setToLocation(null);
      setRoute(null);
    }
  };

  const findRoute = async () => {
    if (!fromLocation || !toLocation) {
      setError('Please select both start and destination locations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await navigationService.findRoute(fromLocation.id, toLocation.id);
      setRoute(response.data);
      
      if (!response.data.success) {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to find route: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetRoute = () => {
    setFromLocation(null);
    setToLocation(null);
    setRoute(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">CampusWalk</h1>
          <p className="text-blue-200 mt-1">SRM University Indoor Navigation</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Search and Controls */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Search Locations</h2>
              <SearchBar onSelectLocation={handleSearchResult} />
              
              <div className="mt-6 space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From:
                  </label>
                  <div className="text-sm">
                    {fromLocation ? (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{fromLocation.name}</span>
                        <button
                          onClick={() => setFromLocation(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select start location</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To:
                  </label>
                  <div className="text-sm">
                    {toLocation ? (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{toLocation.name}</span>
                        <button
                          onClick={() => setToLocation(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select destination</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={findRoute}
                  disabled={!fromLocation || !toLocation || loading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Finding Route...' : 'Find Route'}
                </button>

                <button
                  onClick={resetRoute}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  Reset
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Navigation Instructions */}
            {route && route.success && (
              <NavigationInstructions route={route} />
            )}
          </div>

          {/* Right Side - Map Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <FloorSelector
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                selectedFloor={selectedFloor}
                onBuildingChange={setSelectedBuilding}
                onFloorChange={setSelectedFloor}
              />
              
              <div className="mt-4">
                <FloorMapViewer
                  floor={selectedFloor}
                  locations={locations}
                  route={route}
                  fromLocation={fromLocation}
                  toLocation={toLocation}
                  onLocationClick={handleLocationClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationPage;
