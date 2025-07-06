// CombatScreen.jsx - Combat interface with turn-based mechanics

import React from 'react';
import { GameUtils } from './GameUtils.js';
import { CombatSystem } from './CombatSystem.js';

const CombatScreen = ({
  party,
  enemy,
  hand,
  turnOrder,
  currentTurnIndex,
  initiativeRolled,
  selectedCard,
  combatLog,
  showCardReference,
  onRollInitiative,
  onToggleCardReference,
  onSelectCard,
  onPlayCard,
  onBasicAttack,
  onGuardAction,
  onAttemptEscape,
  onSkipTurn,
  getCurrentCharacter
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Enemy Status */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Combat!</h2>
        <div className="bg-red-100 p-4 rounded-lg">
          <div className="font-bold text-lg">{enemy.name}</div>
          <div className="text-sm text-gray-600 mb-2">
            HP: {enemy.currentHealth}/{enemy.health} | ATK: {enemy.attack} | DEF: {enemy.defense}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-red-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${GameUtils.getPercentage(enemy.currentHealth, enemy.health)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Initiative Section */}
      {!initiativeRolled && (
        <div className="mb-6 text-center">
          <button 
            onClick={onRollInitiative}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 flex items-center gap-2 mx-auto"
          >
            🎲 Roll Initiative
          </button>
          <div className="text-sm text-gray-600 mt-2">
            Determine turn order based on character speed + dice roll
          </div>
        </div>
      )}

      {/* Turn Order Display */}
      {initiativeRolled && (
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Turn Order:</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {turnOrder.map((entry, index) => (
                <div 
                  key={entry.type === 'player' ? entry.character.id : 'enemy'}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === currentTurnIndex 
                      ? 'bg-green-500 text-white font-bold' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {index + 1}. {entry.type === 'player' 
                    ? `${entry.character.race} ${entry.character.role}` 
                    : entry.character.name
                  } ({entry.initiative})
                </div>
              ))}
            </div>
            {getCurrentCharacter() && (
              <div className="text-center">
                <div className={`font-bold ${getCurrentCharacter().type === 'enemy' ? 'text-red-700' : 'text-green-700'}`}>
                  Current Turn: {getCurrentCharacter().type === 'player' 
                    ? `${getCurrentCharacter().character.race} ${getCurrentCharacter().character.role}`
                    : `${getCurrentCharacter().character.name} (Enemy)`
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Party Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {party.map((character, index) => (
          character && (
            <div 
              key={index} 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                getCurrentCharacter()?.type === 'player' && getCurrentCharacter()?.character?.id === character.id 
                  ? 'bg-green-100 border-green-500 border-2' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="font-bold text-sm">{character.race} {character.role}</div>
              <div className="text-xs text-gray-600 mb-1">
                HP: {character.health}/{character.maxHealth}
                {character.tempDefense > 0 && <span className="text-blue-600"> (+{character.tempDefense} DEF)</span>}
                {character.tempAttack > 0 && <span className="text-orange-600"> (+{character.tempAttack} ATK)</span>}
                {character.tempMagic > 0 && <span className="text-purple-600"> (+{character.tempMagic} MAG)</span>}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${GameUtils.getPercentage(character.health, character.maxHealth)}%` }}
                ></div>
              </div>
              {getCurrentCharacter()?.type === 'player' && getCurrentCharacter()?.character?.id === character.id && (
                <div className="text-xs text-green-700 font-bold mt-1">⭐ Active Turn</div>
              )}
              {getCurrentCharacter()?.type === 'enemy' && (
                <div className="text-xs text-red-700 font-bold mt-1">🔴 Enemy Turn</div>
              )}
            </div>
          )
        ))}
      </div>

      {/* Hand and Cards */}
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
            const currentChar = getCurrentCharacter();
            const isOptimal = currentChar?.type === 'player' ? CombatSystem.isCardOptimal(card, currentChar.character) : false;
            const effect = currentChar?.type === 'player' ? CombatSystem.getCardEffect(card, currentChar.character) : null;
            
            return (
              <div key={index} className="relative group">
                <div 
                  className={`bg-white border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCard?.id === card.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : isOptimal
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                        : 'hover:bg-gray-50'
                  } ${getCurrentCharacter()?.type === 'enemy' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => getCurrentCharacter()?.type === 'player' ? onSelectCard(card) : null}
                >
                  <div className={`text-center font-bold ${GameUtils.getCardColor(card.suit)}`}>
                    {card.value}{card.suit}
                  </div>
                  {isOptimal && (
                    <div className="text-xs text-yellow-700 font-bold mt-1">⭐ OPTIMAL</div>
                  )}
                </div>
                
                {/* Tooltip */}
                {currentChar?.type === 'player' && effect && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {effect.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Empty Hand Warning */}
        {hand.length === 0 && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-medium">No cards in hand!</div>
            <div className="text-yellow-600 text-sm">Use basic actions below or try to draw more cards</div>
          </div>
        )}
      </div>

      {/* Combat Actions */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => onPlayCard(selectedCard, getCurrentCharacter())}
            disabled={!selectedCard || !getCurrentCharacter() || !initiativeRolled || getCurrentCharacter()?.type === 'enemy'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            Play Card
          </button>
          
          <button 
            onClick={onBasicAttack}
            disabled={!getCurrentCharacter() || !initiativeRolled || getCurrentCharacter()?.type === 'enemy'}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400"
          >
            ⚔️ Basic Attack
          </button>
          
          <button 
            onClick={onGuardAction}
            disabled={!getCurrentCharacter() || !initiativeRolled || getCurrentCharacter()?.type === 'enemy'}
            className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            🛡️ Guard
          </button>
          
          <button 
            onClick={onAttemptEscape}
            disabled={!initiativeRolled || getCurrentCharacter()?.type === 'enemy'}
            className="bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400"
          >
            🏃 Escape
          </button>
          
          {initiativeRolled && getCurrentCharacter()?.type === 'player' && (
            <button 
              onClick={onSkipTurn}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Skip Turn
            </button>
          )}
        </div>
        
        {/* Action Descriptions */}
        {getCurrentCharacter()?.type === 'player' && (
          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <div><strong>Basic Attack:</strong> Deal {Math.floor((getCurrentCharacter().character.attack + (getCurrentCharacter().character.tempAttack || 0)) / 2) + 1} damage (no cards needed)</div>
            <div><strong>Guard:</strong> +3 Defense until your next turn</div>
            <div><strong>Escape:</strong> Attempt to flee combat (success based on party speed)</div>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>Round Bonuses:</strong> Draw 0 cards = +3 HP, +2 ATK/MAG | Draw 1 card = +1 HP, +1 ATK | Draw 2 cards = No bonus
            </div>
          </div>
        )}
        
        {/* Enemy Turn Indicator */}
        {getCurrentCharacter()?.type === 'enemy' && (
          <div className="text-center p-3 bg-red-100 rounded-lg mb-4">
            <div className="text-red-800 font-medium">Enemy is taking their turn...</div>
          </div>
        )}

        {/* Action Preview */}
        {selectedCard && getCurrentCharacter()?.type === 'player' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold text-lg mb-3">Action Preview</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-blue-800 mb-2">Active Character:</div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-bold">{getCurrentCharacter().character.race} {getCurrentCharacter().character.role}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ATK: {getCurrentCharacter().character.attack} | DEF: {getCurrentCharacter().character.defense + (getCurrentCharacter().character.tempDefense || 0)} | 
                    MAG: {getCurrentCharacter().character.magic} | SPD: {getCurrentCharacter().character.speed}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">{getCurrentCharacter().character.ability}</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium text-blue-800 mb-2">Selected Card:</div>
                <div className="bg-white p-3 rounded-lg">
                  <div className={`font-bold text-lg ${GameUtils.getCardColor(selectedCard.suit)}`}>
                    {selectedCard.value}{selectedCard.suit}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Base Value: {GameUtils.getCardValue(selectedCard)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="font-medium text-blue-800 mb-2">Effect Calculation:</div>
              <div className="bg-white p-4 rounded-lg">
                {(() => {
                  const effect = CombatSystem.calculateCardEffect(selectedCard, getCurrentCharacter().character);
                  const cardValue = GameUtils.getCardValue(selectedCard);
                  
                  return (
                    <div className="space-y-2">
                      {effect.damage > 0 && (
                        <div>
                          <div className="font-medium text-green-700">
                            {selectedCard.suit === '♣' ? 'Magic' : 'Physical'} Attack Damage:
                          </div>
                          <div className="text-sm">
                            Total Damage: <span className="font-bold">{effect.damage}</span>
                            <br />
                            vs Enemy Defense ({enemy?.defense || 0}): 
                            <span className="font-bold text-green-700 ml-1">
                              {Math.max(1, effect.damage - (enemy?.defense || 0))} actual damage
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {effect.healing > 0 && (
                        <div>
                          <div className="font-medium text-green-700">Healing:</div>
                          <div className="text-sm">
                            <span className="font-bold">{effect.healing} HP</span> restored
                            {getCurrentCharacter().character.role === 'Paladin' && <span className="text-blue-600 font-medium"> to entire party</span>}
                          </div>
                        </div>
                      )}
                      
                      {selectedCard.suit === '♦' && (
                        <div>
                          <div className="font-medium text-purple-700">Buff Effect:</div>
                          <div className="text-sm">Next card played will be enhanced!</div>
                        </div>
                      )}
                      
                      {effect.special && (
                        <div className="mt-2 p-2 bg-yellow-100 rounded border-l-4 border-yellow-500">
                          <div className="font-medium text-yellow-800">Special Effect:</div>
                          <div className="text-sm text-yellow-700">{effect.special}</div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Combat Log */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Combat Log</h3>
        <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
          {combatLog.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CombatScreen;
