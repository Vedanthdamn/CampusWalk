'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HostelSelect from '@/components/HostelSelect';
import BuildingSelect from '@/components/BuildingSelect';
import { useMapStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const [hostelId, setHostelId] = useState<number | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const { setSelectedHostel, setSelectedBuilding } = useMapStore();

  const handleFindPath = () => {
    if (!hostelId || !buildingId) {
      alert('Please select both hostel and destination building');
      return;
    }

    setSelectedHostel(hostelId);
    setSelectedBuilding(buildingId);
    router.push('/map');
  };

  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to CampusWalk
          </h1>
          <p className="text-lg text-gray-600">
            Navigate your way across SRM KTR Campus
          </p>
        </div>

        {/* Selection Form */}
        <div className="space-y-6">
          <HostelSelect value={hostelId} onChange={setHostelId} />
          <BuildingSelect value={buildingId} onChange={setBuildingId} />

          <button
            onClick={handleFindPath}
            disabled={!hostelId || !buildingId}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg
                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Find Path
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Select your hostel location</li>
            <li>Choose your destination building</li>
            <li>Click &quot;Find Path&quot; to see the optimal route</li>
            <li>Follow the directions on the map</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
