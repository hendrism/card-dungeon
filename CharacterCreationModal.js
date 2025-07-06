// CharacterCreationModal.js - Modal for creating new characters

import React from 'react';
import { GAME_DATA } from './GameData.js';

const CharacterCreationModal = ({
  show,
  selectedSlot,
  selectedRace,
  selectedRole,
  onRaceChange,
  onRoleChange,
  onCreateCharacter,
  onRandomize,
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Create Character for Slot {selectedSlot + 1}
        </h3>
        
        <div className="space-y-4">
          {/* Race Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Race</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedRace}
              onChange={(e) => onRaceChange(e.target.value)}
            >
              <option value="">Select Race</option>
              {GAME_DATA.races.map(race => (
                <option key={race.name} value={race.name}>{race.name}</option>
              ))}
            </select>
            {selectedRace && (
              <div className="mt-2 text-xs text-gray-600">
                {GAME_DATA.races.find(r => r.name === selectedRace)?.bonus}
              </div>
            )}
          </div>
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
            >
              <option value="">Select Role</option>
              {GAME_DATA.roles.map(role => (
                <option key={role.name} value={role.name}>{role.name}</option>
              ))}
            </select>
            {selectedRole && (
              <div className="mt-2 text-xs text-gray-600">
                {GAME_DATA.roles.find(r => r.name === selectedRole)?.ability}
              </div>
            )}
          </div>

          {/* Character Preview */}
          {selectedRace && selectedRole && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Character Preview:</h4>
              <div className="text-sm space-y-1">
                <div><strong>Race:</strong> {selectedRace}</div>
                <div><strong>Role:</strong> {selectedRole}</div>
                <div className="text-xs text-gray-600 mt-2">
                  This {selectedRace} {selectedRole} will have enhanced stats based on racial bonuses.
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex gap-2">
          <button 
            onClick={onCreateCharacter}
            disabled={!selectedRace || !selectedRole}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Create Character
          </button>
          <button 
            onClick={onRandomize}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Random
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationModal;
