'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMapStore } from '@/lib/store';
import Map from '@/components/Map';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

export default function MapPage() {
  const { selectedHostel, selectedBuilding, path, setPath, isLoading, setIsLoading } = useMapStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const findPath = useCallback(async () => {
    if (!selectedHostel || !selectedBuilding) return;

    setIsLoading(true);
    
    try {
      // Fetch hostel node
      const { data: hostelData } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', selectedHostel)
        .single();

      // Fetch building node
      const { data: buildingData } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', selectedBuilding)
        .single();

      if (!hostelData || !buildingData) {
        toast.error('Could not find locations');
        return;
      }

      // Find corresponding graph nodes (entrances)
      const { data: nodes } = await supabase
        .from('graph_nodes')
        .select('*');

      // Find closest nodes to hostel and building
      const hostelNodeMatch = nodes?.find(
        (n) => n.name.includes(hostelData.name) || 
               (Math.abs(n.lat - hostelData.lat) < 0.0001 && Math.abs(n.lng - hostelData.lng) < 0.0001)
      );

      const buildingNodeMatch = nodes?.find(
        (n) => n.name.includes(buildingData.name) || 
               (Math.abs(n.lat - buildingData.lat) < 0.0001 && Math.abs(n.lng - buildingData.lng) < 0.0001)
      );

      if (!hostelNodeMatch || !buildingNodeMatch) {
        toast.error('Could not find graph nodes for locations');
        return;
      }

      // Call API to find path
      const response = await fetch(
        `/api/path?from=${hostelNodeMatch.id}&to=${buildingNodeMatch.id}`
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'No route available');
        return;
      }

      const pathData = await response.json();
      setPath(pathData);
      toast.success('Route found!');
    } catch (error) {
      console.error('Error finding path:', error);
      toast.error('Failed to find path');
    } finally {
      setIsLoading(false);
    }
  }, [selectedHostel, selectedBuilding, setPath, setIsLoading]);

  useEffect(() => {
    if (mounted && selectedHostel && selectedBuilding) {
      findPath();
    }
  }, [mounted, selectedHostel, selectedBuilding, findPath]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Campus Navigation
            </h2>
            {path.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Route: {path[0]?.name} → {path[path.length - 1]?.name} ({path.length} waypoints)
              </p>
            )}
          </div>
          {isLoading && (
            <div className="text-blue-600">
              <span className="animate-pulse">Loading route...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        <Map path={path} />
      </div>
    </div>
  );
}
