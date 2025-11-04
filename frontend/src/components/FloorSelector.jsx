function FloorSelector({ buildings, selectedBuilding, selectedFloor, onBuildingChange, onFloorChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Building
        </label>
        <select
          value={selectedBuilding?.id || ''}
          onChange={(e) => {
            const building = buildings.find(b => b.id === parseInt(e.target.value));
            onBuildingChange(building);
            if (building && building.floors && building.floors.length > 0) {
              onFloorChange(building.floors[0]);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Floor
        </label>
        <select
          value={selectedFloor?.id || ''}
          onChange={(e) => {
            const floor = selectedBuilding?.floors?.find(f => f.id === parseInt(e.target.value));
            if (floor) onFloorChange(floor);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!selectedBuilding || !selectedBuilding.floors}
        >
          {selectedBuilding?.floors?.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.floorName || `Floor ${floor.floorNumber}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FloorSelector;
