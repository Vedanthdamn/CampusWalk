function NavigationInstructions({ route }) {
  if (!route || !route.success || !route.instructions) {
    return null;
  }

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'start': return '🚩';
      case 'arrive': return '🎯';
      case 'stairs': return '🪜';
      case 'elevator': return '🛗';
      case 'up': return '⬆️';
      case 'down': return '⬇️';
      case 'left': return '⬅️';
      case 'right': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Turn-by-Turn Directions</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-gray-600">Total Distance</div>
        <div className="text-2xl font-bold text-primary">
          {route.totalDistance?.toFixed(1)} m
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {route.instructions.map((instruction, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              instruction.direction === 'start'
                ? 'bg-blue-50'
                : instruction.direction === 'arrive'
                ? 'bg-green-50'
                : 'bg-gray-50'
            }`}
          >
            <div className="text-2xl flex-shrink-0">
              {getDirectionIcon(instruction.direction)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {instruction.instruction}
              </div>
              {instruction.distance > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {instruction.distance.toFixed(1)} meters
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavigationInstructions;
