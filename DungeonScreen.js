// DungeonScreen.js - Dungeon exploration interface

import React from 'react';
import { Skull, Shuffle } from 'lucide-react';
import { GameUtils } from './GameUtils.js';
import { CombatSystem } from './CombatSystem.js';
import { GAME_DATA } from './GameData.js';

const DungeonScreen = ({
  party,
  currentFloor,
  currentRoom,
  deck,
  hand,
  cardsDrawnThisTurn,
  showCardReference,
  selectedCard,
  selectedCharacter,
  onToggleCardReference,
  onSelectCard,
  onSelectCharacter,
  onEnterCombat,
  onDrawCards,
  onEndTurn
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Floor {currentFloor} - Room {currentRoom}</h2>
        <div className="text-sm text-gray-600">Cards in deck: {deck.length}</div>
      </div>

      {/* Party Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {party.map((character, index) => (
          character && (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="font-bold">{character.race} {character.role}</div>
              <div className="text-sm text-gray-600 mb-2">
                HP: {character.health}/{character.maxHealth}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${GameUtils.getPercentage(character.health, character.maxHealth)}%` }}
                ></div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Hand Management */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Your Hand</h3>
          <button 
            onClick={onToggleCardReference}
            className="text-blue-600 text-sm hover:underline"
          >
            {showCardReference ? 'Hide' : 'Show'} Card Reference
          </button>
        </div>
        
        {/* Card Reference */}
        {showCardReference && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">Card Effects:</div>
                <div className="space-y-1">
                  <div><span className="font-medium">♠ Spades:</span> Physical Attack</div>
                  <div><span className="font-medium">♥ Hearts:</span> Healing</div>
                  <div><span className="font-medium">♦ Diamonds:</span> Buff next card</div>
                  <div><span className="font-medium">♣ Clubs:</span> Magic Attack</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Special Cards:</div>
                <div className="space-y-1">
                  <div><span className="font-medium">Ace:</span> Value 11, triggers class abilities</div>
                  <div><span className="font-medium">Face Cards:</span> Value 10, class bonuses</div>
                  <div><span className="font-medium">Numbers:</span> Face value</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Card Display */}
        <div className="flex flex-wrap gap-2">
          {hand.map((card, index) => {
            const effect = selectedCharacter ? CombatSystem.getCardEffect(card, selectedCharacter) : null;
            return (
              <div key={index} className="relative group">
                <div 
                  className={`bg-white border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCard?.id === card.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectCard(card)}
                >
                  <div className={`text-center font-bold ${GameUtils.getCardColor(card.suit)}`}>
                    {card.value}{card.suit}
                  </div>
                </div>
                
                {/* Tooltip */}
                {selectedCharacter && effect && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {effect.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button 
          onClick={onEnterCombat}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2"
        >
          <Skull size={20} />
          Fight Monster
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onDrawCards(1)}
            disabled={deck.length === 0 || cardsDrawnThisTurn >= GAME_DATA.constants.MAX_CARDS_PER_TURN}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400"
          >
            <Shuffle size={20} />
            Draw Card ({cardsDrawnThisTurn}/{GAME_DATA.constants.MAX_CARDS_PER_TURN})
          </button>
          
          <button 
            onClick={onEndTurn}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            End Turn
          </button>
        </div>
        
        {/* Card Draw Strategy Info */}
        <div className="text-sm text-gray-600">
          You can draw up to {GAME_DATA.constants.MAX_CARDS_PER_TURN} cards per turn. Click "End Turn" to reset your draw limit.
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-800 mb-1">Card Draw Bonuses (applied at end of round):</div>
            <div className="text-xs space-y-1">
              <div><strong>Draw 0 cards:</strong> Party heals 3 HP, +2 Attack/Magic next turn</div>
              <div><strong>Draw 1 card:</strong> Party heals 1 HP, +1 Attack next turn</div>
              <div><strong>Draw 2 cards:</strong> No bonus (but maximum hand size)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DungeonScreen;
