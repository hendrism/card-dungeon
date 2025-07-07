// CharacterCreator.js - Character creation and management logic

import { GAME_DATA } from './GameData.js';
import { GameUtils } from './GameUtils.js';

export const CharacterCreator = {
  /**
   * Creates a character with applied racial bonuses
   */
  createCharacter: (raceName, roleName) => {
    const raceData = GAME_DATA.races.find(r => r.name === raceName);
    const roleData = GAME_DATA.roles.find(r => r.name === roleName);
    
    if (!raceData || !roleData) {
      throw new Error(`Invalid race (${raceName}) or role (${roleName})`);
    }
    
    const stats = GameUtils.applyRaceBonus(roleData, raceName);
    
    return {
      id: Date.now() + Math.random(), // Unique ID
      race: raceName,
      role: roleName,
      ...stats,
      ability: roleData.ability,
      raceBonus: raceData.bonus,
      // Initialize temporary stat modifiers
      tempAttack: 0,
      tempDefense: 0,
      tempMagic: 0
    };
  },

  /**
   * Generates a character with random race and role
   */
  generateRandomCharacter: () => {
    const randomRace = GAME_DATA.races[Math.floor(Math.random() * GAME_DATA.races.length)];
    const randomRole = GAME_DATA.roles[Math.floor(Math.random() * GAME_DATA.roles.length)];
    return CharacterCreator.createCharacter(randomRace.name, randomRole.name);
  },

  /**
   * Generates a full party with no duplicate races or roles
   */
  generateRandomParty: () => {
    const shuffledRaces = [...GAME_DATA.races].sort(() => Math.random() - 0.5);
    const shuffledRoles = [...GAME_DATA.roles].sort(() => Math.random() - 0.5);
    
    const party = [];
    for (let i = 0; i < GAME_DATA.constants.PARTY_SIZE; i++) {
      const selectedRace = shuffledRaces[i % shuffledRaces.length];
      const selectedRole = shuffledRoles[i % shuffledRoles.length];
      party.push(CharacterCreator.createCharacter(selectedRace.name, selectedRole.name));
    }
    return party;
  },

  /**
   * Validates if a character is valid (has all required properties)
   */
  validateCharacter: (character) => {
    const requiredProps = ['id', 'race', 'role', 'health', 'maxHealth', 'attack', 'defense', 'magic', 'speed'];
    return requiredProps.every(prop => character.hasOwnProperty(prop));
  },

  /**
   * Gets character's effective stats including temporary modifiers
   */
  getEffectiveStats: (character) => {
    return {
      attack: character.attack + (character.tempAttack || 0),
      defense: character.defense + (character.tempDefense || 0),
      magic: character.magic + (character.tempMagic || 0),
      speed: character.speed, // Speed doesn't have temp modifiers
      health: character.health,
      maxHealth: character.maxHealth
    };
  },

  /**
   * Checks if character is alive
   */
  isAlive: (character) => {
    return character && character.health > 0;
  },

  /**
   * Heals character by specified amount (cannot exceed max health)
   */
  healCharacter: (character, amount) => {
    return {
      ...character,
      health: Math.min(character.maxHealth, character.health + amount)
    };
  },

  /**
   * Damages character by specified amount (cannot go below 0)
   */
  damageCharacter: (character, amount) => {
    return {
      ...character,
      health: Math.max(0, character.health - amount)
    };
  },

  /**
   * Applies temporary stat modifier to character
   */
  applyTempModifier: (character, stat, value) => {
    const validStats = ['tempAttack', 'tempDefense', 'tempMagic'];
    const tempStat = `temp${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
    
    if (!validStats.includes(tempStat)) {
      console.warn(`Invalid temporary stat: ${stat}`);
      return character;
    }
    
    return {
      ...character,
      [tempStat]: (character[tempStat] || 0) + value
    };
  },

  /**
   * Clears all temporary modifiers from character
   */
  clearTempModifiers: (character) => {
    return {
      ...character,
      tempAttack: 0,
      tempDefense: 0,
      tempMagic: 0
    };
  }
};
