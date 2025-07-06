// DungeonCrawler.js - Main game component that orchestrates everything

import React, { useState, useEffect } from 'react';

// Import all the modular components and systems
import { GAME_DATA } from './GameData.js';
import { GameUtils } from './GameUtils.js';
import { CharacterCreator } from './CharacterCreator.js';
import { CombatSystem } from './CombatSystem.js';
import SetupScreen from './SetupScreen.js';
import CharacterCreationModal from './CharacterCreationModal.js';
import DungeonScreen from './DungeonScreen.js';
import CombatScreen from './CombatScreen.js';

const DungeonCrawler = () => {
  // ================== GAME STATE ==================
  const [gameState, setGameState] = useState('setup'); // setup, dungeon, combat
  const [party, setParty] = useState([null, null, null, null]);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [currentRoom, setCurrentRoom] = useState(1);
  
  // ================== CARD STATE ==================
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [cardsDrawnThisTurn, setCardsDrawnThisTurn] = useState(0);
  const [showCardReference, setShowCardReference] = useState(false);
  
  // ================== COMBAT STATE ==================
  const [enemy, setEnemy] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [initiativeRolled, setInitiativeRolled] = useState(false);
  
  // ================== UI STATE ==================
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // ================== INITIALIZATION ==================
  useEffect(() => {
    setDeck(GameUtils.createDeck());
  }, []);

  // ================== CARD MANAGEMENT ==================
  const drawCards = (count) => {
    const newHand = [...hand];
    const newDeck = [...deck];
    
    for (let i = 0; i < count && newDeck.length > 0; i++) {
      newHand.push(newDeck.pop());
    }
    
    setHand(newHand);
    setDeck(newDeck);
    setCardsDrawnThisTurn(prev => prev + count);
  };

  const applyDrawCardBonuses = () => {
    const cardsNotDrawn = GAME_DATA.constants.MAX_CARDS_PER_TURN - cardsDrawnThisTurn;
    const bonuses = CombatSystem.calculateDrawBonuses(cardsNotDrawn);
    
    if (bonuses.message) {
      setParty(prev => prev.map(char => 
        char ? { 
          ...char, 
          health: Math.min(char.maxHealth, char.health + bonuses.healing),
          tempAttack: (char.tempAttack || 0) + bonuses.tempAttack,
          tempMagic: (char.tempMagic || 0) + bonuses.tempMagic
        } : char
      ));
      setCombatLog(prev => [...prev, bonuses.message]);
    }
  };

  // ================== CHARACTER MANAGEMENT ==================
  const openCharacterCreation = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setSelectedRace('');
    setSelectedRole('');
    setShowCharacterCreation(true);
  };

  const addCharacterToParty = () => {
    if (!selectedRace || !selectedRole || selectedSlot === null) return;
    
    const newParty = [...party];
    newParty[selectedSlot] = CharacterCreator.createCharacter(selectedRace, selectedRole);
    setParty(newParty);
    setShowCharacterCreation(false);
  };

  const generateRandomCharacter = (slotIndex) => {
    const newParty = [...party];
    newParty[slotIndex] = CharacterCreator.generateRandomCharacter();
    setParty(newParty);
  };

  const generateRandomParty = () => {
    setParty(CharacterCreator.generateRandomParty());
  };

  const removeCharacter = (slotIndex) => {
    const newParty = [...party];
    newParty[slotIndex] = null;
    setParty(newParty);
  };

  const randomizeCharacterCreation = () => {
    const randomRace = GAME_DATA.races[Math.floor(Math.random() * GAME_DATA.races.length)];
    const randomRole = GAME_DATA.roles[Math.floor(Math.random() * GAME_DATA.roles.length)];
    setSelectedRace(randomRace.name);
    setSelectedRole(randomRole.name);
  };

  // ================== GAME FLOW ==================
  const startDungeon = () => {
    if (party.filter(char => char !== null).length === 0) return;
    setGameState('dungeon');
    drawCards(5);
    setCardsDrawnThisTurn(0); // Reset after initial draw
  };

  const enterCombat = () => {
    const randomEnemy = GAME_DATA.enemies[Math.floor(Math.random() * GAME_DATA.enemies.length)];
    setEnemy({ ...randomEnemy, currentHealth: randomEnemy.health });
    setGameState('combat');
    setCardsDrawnThisTurn(0);
    setInitiativeRolled(false);
    setTurnOrder([]);
    setCurrentTurnIndex(0);
    setSelectedCard(null);
    setSelectedCharacter(null);
    setCombatLog([`A ${randomEnemy.name} appears!`]);
  };

  // ================== COMBAT ACTIONS ==================
  const rollInitiative = () => {
    const initiativeOrder = CombatSystem.rollInitiative(party, enemy);
    
    setTurnOrder(initiativeOrder);
    setCurrentTurnIndex(0);
    setInitiativeRolled(true);
    setCombatLog(prev => [
      ...prev,
      "Initiative rolled!",
      ...initiativeOrder.map((entry, index) => 
        entry.type === 'player' 
          ? `${index + 1}. ${entry.character.race} ${entry.character.role} (${entry.initiative})`
          : `${index + 1}. ${entry.character.name} (${entry.initiative})`
      )
    ]);
    
    if (initiativeOrder[0].type === 'enemy') {
      setTimeout(() => executeEnemyTurn(), 1000);
    }
  };

  const executeEnemyTurn = () => {
    const damage = CombatSystem.calculateEnemyDamage(enemy);
    const alivePlayers = party.filter(char => char !== null && CharacterCreator.isAlive(char));
    
    if (alivePlayers.length > 0) {
      const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const actualDamage = CombatSystem.calculateActualDamage(damage, target.defense + (target.tempDefense || 0));
      
      setParty(prev => prev.map(char => 
        char && char.id === target.id 
          ? CharacterCreator.damageCharacter(char, actualDamage)
          : char
      ));
      
      setCombatLog(prev => [...prev, `${enemy.name} attacks ${target.race} ${target.role} for ${actualDamage} damage!`]);
    }
    
    setTimeout(() => {
      nextTurn();
    }, 1500);
  };

  const nextTurn = () => {
    // Clear temporary modifiers
    setParty(prev => prev.map(char => 
      char ? CharacterCreator.clearTempModifiers(char) : char
    ));
    
    const nextIndex = (currentTurnIndex + 1) % turnOrder.length;
    setCurrentTurnIndex(nextIndex);
    setSelectedCard(null);
    setSelectedCharacter(null);
    
    // Apply bonuses when round completes
    if (nextIndex === 0) {
      applyDrawCardBonuses();
      setCardsDrawnThisTurn(0);
    }
    
    if (turnOrder[nextIndex]?.type === 'enemy') {
      setTimeout(() => executeEnemyTurn(), 1000);
    }
  };

  const getCurrentCharacter = () => {
    if (!initiativeRolled || turnOrder.length === 0) return null;
    return turnOrder[currentTurnIndex];
  };

  const basicAttack = () => {
    const currentChar = getCurrentCharacter();
    if (!currentChar || currentChar.type === 'enemy') return;
    
    const stats = CharacterCreator.getEffectiveStats(currentChar.character);
    const damage = Math.floor(stats.attack / 2) + 1;
    const actualDamage = CombatSystem.calculateActualDamage(damage, enemy.defense);
    
    setEnemy(prev => ({ ...prev, currentHealth: prev.currentHealth - actualDamage }));
    setCombatLog(prev => [...prev, `${currentChar.character.race} ${currentChar.character.role} makes a basic attack for ${actualDamage} damage!`]);
    
    checkCombatEnd(actualDamage);
  };

  const guardAction = () => {
    const currentChar = getCurrentCharacter();
    if (!currentChar || currentChar.type === 'enemy') return;
    
    setParty(prev => prev.map(char => 
      char && char.id === currentChar.character.id 
        ? CharacterCreator.applyTempModifier(char, 'defense', 3)
        : char
    ));
    
    setCombatLog(prev => [...prev, `${currentChar.character.race} ${currentChar.character.role} takes a defensive stance! (+3 Defense until next turn)`]);
    
    setTimeout(() => {
      nextTurn();
    }, 1000);
  };

  const attemptEscape = () => {
    const escapeChance = Math.random();
    const successChance = CombatSystem.calculateEscapeChance(party);
    
    if (escapeChance < successChance) {
      setCombatLog(prev => [...prev, "Successfully escaped from combat!"]);
      setTimeout(() => {
        setGameState('dungeon');
        setEnemy(null);
        setInitiativeRolled(false);
        setTurnOrder([]);
        setCardsDrawnThisTurn(0);
      }, 1500);
    } else {
      setCombatLog(prev => [...prev, "Failed to escape! The enemy blocks your retreat."]);
      setTimeout(() => {
        nextTurn();
      }, 1000);
    }
  };

  const checkCombatEnd = (damageDealt) => {
    if (enemy.currentHealth - damageDealt <= 0) {
      setTimeout(() => {
        setCombatLog(prev => [...prev, `${enemy.name} defeated! ${enemy.reward}`]);
        setCurrentRoom(prev => prev + 1);
        
        if (currentRoom >= GAME_DATA.constants.ROOMS_PER_FLOOR) {
          setCurrentFloor(prev => prev + 1);
          setCurrentRoom(1);
        }
        
        setGameState('dungeon');
        setEnemy(null);
        setCardsDrawnThisTurn(0);
        setInitiativeRolled(false);
        setTurnOrder([]);
        
        // Apply enemy reward
        const reward = CombatSystem.processEnemyReward(enemy.reward);
        if (reward.type === 'cards') {
          setTimeout(() => drawCards(reward.amount), 500);
        } else if (reward.type === 'healing') {
          setParty(prev => prev.map(char => 
            char ? CharacterCreator.healCharacter(char, reward.amount) : null
          ));
        }
      }, 1000);
    } else {
      setTimeout(() => {
        nextTurn();
      }, 1000);
    }
  };

  const playCard = (card, character) => {
    if (!card || !character || character.type === 'enemy') return;

    const actualChar = character.character || character;
    const effect = CombatSystem.calculateCardEffect(card, actualChar);
    let logEntry = `${actualChar.race} ${actualChar.role} plays ${card.value}${card.suit}`;
    
    if (effect.damage > 0) {
      const actualDamage = CombatSystem.calculateActualDamage(effect.damage, enemy.defense);
      setEnemy(prev => ({ ...prev, currentHealth: prev.currentHealth - actualDamage }));
      logEntry += ` - Deals ${actualDamage} damage!`;
    }
    
    if (effect.healing > 0) {
      setParty(prev => prev.map(char => 
        char ? CharacterCreator.healCharacter(char, effect.healing) : char
      ));
      logEntry += ` - Heals ${effect.healing} HP!`;
    }
    
    if (effect.special) {
      logEntry += ` ${effect.special}`;
    }

    setCombatLog(prev => [...prev, logEntry]);
    setHand(prev => prev.filter(c => c.id !== card.id));
    setSelectedCard(null);
    setSelectedCharacter(null);

    checkCombatEnd(effect.damage > 0 ? CombatSystem.calculateActualDamage(effect.damage, enemy.defense) : 0);
  };

  // ================== EVENT HANDLERS ==================
  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const handleToggleCardReference = () => {
    setShowCardReference(!showCardReference);
  };

  const handleEndTurn = () => {
    setCardsDrawnThisTurn(0);
  };

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-gray-50">
      {gameState === 'setup' && (
        <SetupScreen
          party={party}
          onStartDungeon={startDungeon}
          onOpenCharacterCreation={openCharacterCreation}
          onGenerateRandomCharacter={generateRandomCharacter}
          onGenerateRandomParty={generateRandomParty}
          onRemoveCharacter={removeCharacter}
        />
      )}

      {gameState === 'dungeon' && (
        <DungeonScreen
          party={party}
          currentFloor={currentFloor}
          currentRoom={currentRoom}
          deck={deck}
          hand={hand}
          cardsDrawnThisTurn={cardsDrawnThisTurn}
          showCardReference={showCardReference}
          selectedCard={selectedCard}
          selectedCharacter={selectedCharacter}
          onToggleCardReference={handleToggleCardReference}
          onSelectCard={handleSelectCard}
          onSelectCharacter={handleSelectCharacter}
          onEnterCombat={enterCombat}
          onDrawCards={drawCards}
          onEndTurn={handleEndTurn}
        />
      )}

      {gameState === 'combat' && (
        <CombatScreen
          party={party}
          enemy={enemy}
          hand={hand}
          turnOrder={turnOrder}
          currentTurnIndex={currentTurnIndex}
          initiativeRolled={initiativeRolled}
          selectedCard={selectedCard}
          combatLog={combatLog}
          showCardReference={showCardReference}
          onRollInitiative={rollInitiative}
          onToggleCardReference={handleToggleCardReference}
          onSelectCard={handleSelectCard}
          onPlayCard={playCard}
          onBasicAttack={basicAttack}
          onGuardAction={guardAction}
          onAttemptEscape={attemptEscape}
          onSkipTurn={nextTurn}
          getCurrentCharacter={getCurrentCharacter}
        />
      )}

      <CharacterCreationModal
        show={showCharacterCreation}
        selectedSlot={selectedSlot}
        selectedRace={selectedRace}
        selectedRole={selectedRole}
        onRaceChange={setSelectedRace}
        onRoleChange={setSelectedRole}
        onCreateCharacter={addCharacterToParty}
        onRandomize={randomizeCharacterCreation}
        onClose={() => setShowCharacterCreation(false)}
      />
    </div>
  );
};

export default DungeonCrawler;
