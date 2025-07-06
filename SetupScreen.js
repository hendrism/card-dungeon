// SetupScreen.js - Character party setup interface

import React from 'react';
import { Users, Shuffle } from 'lucide-react';
import { GAME_DATA } from './GameData.js';

const SetupScreen = ({
  party,
  onStartDungeon,
  onOpenCharacterCreation,
  onGenerateRandomCharacter,
  onGenerateRandomParty,
  onRemoveCharacter
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Dungeon Crawler: Card Quest</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Build Your Party ({GAME_DATA.constants.PARTY_SIZE} slots)</h2>
        
        {/* Party Slots */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {party.map((character, index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 p-4 rounded-lg min-h-32">
              {character ? (
                <div className="text-center">
                  <div className="font-bold">{character.race}</div>
                  <div className="text-sm text-gray-600">{character.role}</div>
                  <div className="text-xs mt-2">HP: {character.health}</div>
                  <div className="flex gap-1 mt-2">
                    <button 
                      onClick={() => onGenerateRandomCharacter(index)}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Randomize
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => onRemoveCharacter(index)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div 
                    className="text-center text-gray-500 cursor-pointer hover:bg-gray-50 flex-1 flex flex-col justify-center"
                    onClick={() => onOpenCharacterCreation(index)}
                  >
                    <Users className="mx-auto mb-2" size={24} />
                    <div className="text-sm">Click to Add Character</div>
                  </div>
                  <div className="mt-2 text-center">
                    <button 
                      onClick={() => onGenerateRandomCharacter(index)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Random Character
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Random Party Button */}
        <div className="mb-6 text-center">
          <button 
            onClick={onGenerateRandomParty}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2 mx-auto"
          >
            <Shuffle size={20} />
            Generate Random Full Party (No Duplicates)
          </button>
          <div className="text-sm text-gray-600 mt-2">
            Creates {GAME_DATA.constants.PARTY_SIZE} random characters with unique race/role combinations
          </div>
        </div>
      </div>

      {/* Race and Role Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Available Races</h3>
          <div className="space-y-2">
            {GAME_DATA.races.map((race, index) => (
              <div key={index} className={`p-3 rounded-lg ${race.color}`}>
                <div className="font-medium">{race.name}</div>
                <div className="text-sm text-gray-600">{race.bonus}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Available Roles</h3>
          <div className="space-y-2">
            {GAME_DATA.roles.map((role, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="font-medium">{role.name}</div>
                <div className="text-sm text-gray-600 mb-1">
                  HP: {role.health} | ATK: {role.attack} | DEF: {role.defense} | MAG: {role.magic} | SPD: {role.speed}
                </div>
                <div className="text-xs text-blue-600">{role.ability}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Rules */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Card Combat Rules:</h3>
        <ul className="text-sm space-y-1">
          <li><span className="font-medium">♠ Spades:</span> Physical attacks (damage = card value + attack stat)</li>
          <li><span className="font-medium">♥ Hearts:</span> Healing (restores HP equal to card value)</li>
          <li><span className="font-medium">♦ Diamonds:</span> Buff next card played</li>
          <li><span className="font-medium">♣ Clubs:</span> Magic attacks (damage = card value + magic stat)</li>
          <li><span className="font-medium">Face Cards:</span> Count as 10, trigger special abilities</li>
          <li><span className="font-medium">Aces:</span> Count as 11, extremely powerful</li>
        </ul>
      </div>

      {/* Start Game Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={onStartDungeon}
          disabled={party.filter(char => char !== null).length === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          Enter the Dungeon
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
