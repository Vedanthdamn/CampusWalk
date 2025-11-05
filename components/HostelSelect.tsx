'use client';

import { useEffect, useState } from 'react';
import { Hostel } from '@/lib/supabaseClient';

type HostelSelectProps = {
  value: number | null;
  onChange: (hostelId: number | null) => void;
};

export default function HostelSelect({ value, onChange }: HostelSelectProps) {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/hostels');
      const data = await response.json();
      setHostels(data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Hostel
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      >
        <option value="">Select a hostel...</option>
        {hostels.map((hostel) => (
          <option key={hostel.id} value={hostel.id}>
            {hostel.name}
          </option>
        ))}
      </select>
    </div>
  );
}
