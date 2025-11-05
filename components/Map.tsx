'use client';

import { useEffect, useRef, useState } from 'react';
import { GraphNode, Hostel, Building } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

type MapProps = {
  path: GraphNode[];
};

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function Map({ path }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      toast.error('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
      return;
    }

    // Check if script is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error('Error loading Google Maps');
      toast.error('Failed to load Google Maps');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.823, lng: 80.044 }, // SRM KTR approximate center
        zoom: 16,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(mapInstance);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to initialize map');
    }
  }, [isLoaded, map]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesRes, hostelsRes, buildingsRes] = await Promise.all([
          fetch('/api/nodes'),
          fetch('/api/hostels'),
          fetch('/api/buildings'),
        ]);

        const nodesData = await nodesRes.json();
        const hostelsData = await hostelsRes.json();
        const buildingsData = await buildingsRes.json();

        setNodes(nodesData);
        setHostels(hostelsData);
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Create markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add hostel markers (blue)
    hostels.forEach((hostel) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hostel.lat, lng: hostel.lng },
        map,
        title: hostel.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${hostel.name}</strong><br/>${hostel.description || ''}</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseover', () => {
        marker.setTitle(`${hostel.name} (Hostel)`);
      });

      newMarkers.push(marker);
    });

    // Add building markers (red)
    buildings.forEach((building) => {
      const marker = new window.google.maps.Marker({
        position: { lat: building.lat, lng: building.lng },
        map,
        title: building.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${building.name}</strong><br/>${building.description || ''}</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseover', () => {
        marker.setTitle(`${building.name} (Building)`);
      });

      newMarkers.push(marker);
    });

    // Add junction markers (yellow)
    nodes
      .filter((node) => node.node_type === 'junction')
      .forEach((node) => {
        const marker = new window.google.maps.Marker({
          position: { lat: node.lat, lng: node.lng },
          map,
          title: node.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        marker.addListener('mouseover', () => {
          marker.setTitle(`${node.name} (${node.node_type})`);
        });

        newMarkers.push(marker);
      });

    setMarkers(newMarkers);
    
    // Cleanup function
    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, nodes, hostels, buildings, isLoaded]);

  // Draw path
  useEffect(() => {
    if (!map || !isLoaded || path.length === 0) {
      if (polyline) {
        polyline.setMap(null);
        setPolyline(null);
      }
      return;
    }

    // Clear existing polyline
    if (polyline) {
      polyline.setMap(null);
    }

    // Create new polyline
    const pathCoordinates = path.map((node) => ({
      lat: node.lat,
      lng: node.lng,
    }));

    const newPolyline = new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#4285F4',
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });

    newPolyline.setMap(map);
    setPolyline(newPolyline);

    // Fit map to path bounds
    const bounds = new window.google.maps.LatLngBounds();
    pathCoordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);

    // Cleanup function
    return () => {
      if (newPolyline) {
        newPolyline.setMap(null);
      }
    };
  }, [map, path, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
}
