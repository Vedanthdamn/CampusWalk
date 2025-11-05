import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getHostels, getBuildings, getNavigation } from '../lib/api';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for hostels and buildings
const hostelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const buildingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ originNode, destinationNode, onOriginSelect, onDestinationSelect, route }) {
  const [hostels, setHostels] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  // SRM KTR Campus center coordinates (approximate)
  const campusCenter = [12.823, 80.044];

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    try {
      const [hostelsData, buildingsData] = await Promise.all([
        getHostels(),
        getBuildings()
      ]);
      setHostels(hostelsData);
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Error loading markers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={campusCenter}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hostel Markers */}
        {hostels.map((hostel) => (
          <Marker
            key={`hostel-${hostel.id}`}
            position={[parseFloat(hostel.lat), parseFloat(hostel.lng)]}
            icon={hostelIcon}
            eventHandlers={{
              click: () => onOriginSelect(hostel)
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-blue-600">{hostel.name}</h3>
                <p className="text-gray-600">{hostel.description}</p>
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  onClick={() => onOriginSelect(hostel)}
                >
                  Set as Origin
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Building Markers */}
        {buildings.map((building) => (
          <Marker
            key={`building-${building.id}`}
            position={[parseFloat(building.lat), parseFloat(building.lng)]}
            icon={buildingIcon}
            eventHandlers={{
              click: () => onDestinationSelect(building)
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-red-600">{building.name}</h3>
                <p className="text-gray-600">{building.description}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  onClick={() => onDestinationSelect(building)}
                >
                  Navigate to this building
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        {route && route.length > 0 && (
          <Polyline
            positions={route.map(node => [parseFloat(node.lat), parseFloat(node.lng)])}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
