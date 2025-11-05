import { create } from 'zustand';
import { GraphNode } from './supabaseClient';

type MapState = {
  selectedHostel: number | null;
  selectedBuilding: number | null;
  path: GraphNode[];
  isLoading: boolean;
  setSelectedHostel: (hostelId: number | null) => void;
  setSelectedBuilding: (buildingId: number | null) => void;
  setPath: (path: GraphNode[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearPath: () => void;
};

export const useMapStore = create<MapState>((set) => ({
  selectedHostel: null,
  selectedBuilding: null,
  path: [],
  isLoading: false,
  setSelectedHostel: (hostelId) => set({ selectedHostel: hostelId }),
  setSelectedBuilding: (buildingId) => set({ selectedBuilding: buildingId }),
  setPath: (path) => set({ path }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearPath: () => set({ path: [], selectedHostel: null, selectedBuilding: null }),
}));
