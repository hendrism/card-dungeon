// CombatSystem.js - Combat mechanics and card effects

import { GameUtils } from './GameUtils.js';
import { CharacterCreator } from './CharacterCreator.js';

export const CombatSystem = {
  /**
   * Calculates the effect of playing a card with a character
   */
  calculateCardEffect: (card, character) => {
    if (!card || !character) {
      return { damage: 0, healing: 0, special: '' };
    }

    let damage = 0;
    let healing = 0;
    let special = '';
    const cardValue = GameUtils.getCardValue(card);
    const stats = CharacterCreator.getEffectiveStats(character);

    // Base suit effects
    switch (card.suit) {
      case '♠': // Physical damage
        damage = cardValue + stats.attack;
        if (character.role === 'Rogue') {
          damage *= 2;
          special = 'Stealth Strike!';
        }
        break;
      case '♥': // Healing
        healing = cardValue;
        if (character.role === 'Paladin') {
          healing += 2;
          special = 'Divine healing spreads to party!';
        }
        break;
      case '♦': // Buff
        special = 'Next card enhanced!';
        break;
      case '♣': // Magic damage
        damage = cardValue + stats.magic;
        if (character.role === 'Wizard') {
          damage += 3;
          special = 'Arcane Power!';
        }
        break;
    }

    // Face card bonuses
    if (['J', 'Q', 'K'].includes(card.value) && character.role === 'Fighter') {
      damage += 3;
      special = special ? `${special} Weapon Master!` : 'Weapon Master!';
    }

    // Ace bonuses
    if (card.value === 'A' && character.role === 'Barbarian') {
      damage += 10;
      special = special ? `${special} RAGE!` : 'RAGE!';
    }

    return { damage, healing, special };
  },

  /**
   * Gets user-friendly description of card effect
   */
  getCardEffect: (card, character) => {
    if (!card || !character) {
      return { description: '', damage: 0, healing: 0 };
    }
    
    const cardValue = GameUtils.getCardValue(card);
    const stats = CharacterCreator.getEffectiveStats(character);
    let description = '';
    let damage = 0;
    let healing = 0;

    switch (card.suit) {
      case '♠':
        damage = cardValue + stats.attack;
        description = `Physical Attack: ${damage} damage`;
        if (character.role === 'Rogue') {
          damage *= 2;
          description = `Stealth Strike: ${damage} damage (doubled!)`;
        }
        break;
      case '♥':
        healing = cardValue;
        description = `Healing: Restore ${healing} HP`;
        if (character.role === 'Paladin') {
          healing += 2;
          description = `Divine Healing: Restore ${healing} HP to all`;
        }
        break;
      case '♦':
        description = 'Buff: Enhance next card played';
        break;
      case '♣':
        damage = cardValue + stats.magic;
        description = `Magic Attack: ${damage} magic damage`;
        if (character.role === 'Wizard') {
          damage += 3;
          description = `Arcane Blast: ${damage} magic damage`;
        }
        break;
    }

    // Apply role bonuses to description
    if (['J', 'Q', 'K'].includes(card.value) && character.role === 'Fighter') {
      if (damage > 0) damage += 3;
      description += ' +3 (Weapon Master)';
    }

    if (card.value === 'A' && character.role === 'Barbarian') {
      if (damage > 0) damage += 10;
      description += ' +10 (RAGE!)';
    }

    return { description, damage, healing };
  },

  /**
   * Determines if a card is optimal for a character
   */
  isCardOptimal: (card, character) => {
    if (!card || !character || character.type === 'enemy') {
      return false;
    }
    
    const actualChar = character.character || character;
    const cardValue = GameUtils.getCardValue(card);
    const stats = CharacterCreator.getEffectiveStats(actualChar);
    
    // High value cards (9+) are generally good for appropriate classes
    if (cardValue >= 9) {
      if (card.suit === '♠' && (stats.attack >= 7 || actualChar.role === 'Rogue')) return true;
      if (card.suit === '♣' && (stats.magic >= 6 || actualChar.role === 'Wizard')) return true;
      if (card.suit === '♥' && actualChar.role === 'Paladin') return true;
    }
    
    // Class-specific optimal cards
    const optimalCombos = {
      'Rogue': card.suit === '♠',
      'Wizard': card.suit === '♣',
      'Paladin': card.suit === '♥',
      'Fighter': ['J', 'Q', 'K'].includes(card.value),
      'Barbarian': card.value === 'A'
    };
    
    return optimalCombos[actualChar.role] || false;
  },

  /**
   * Rolls initiative for all combatants
   */
  rollInitiative: (party, enemy) => {
    const activeParty = party.filter(char => char !== null && CharacterCreator.isAlive(char));
    
    const initiativeOrder = activeParty.map(character => ({
      type: 'player',
      character,
      initiative: GameUtils.randomBetween(1, 20) + character.speed
    }));
    
    // Add enemy to initiative
    const enemyInitiative = {
      type: 'enemy',
      character: enemy,
      initiative: GameUtils.randomBetween(1, 20) + enemy.attack
    };
    
    initiativeOrder.push(enemyInitiative);
    return initiativeOrder.sort((a, b) => b.initiative - a.initiative);
  },

  /**
   * Calculates actual damage after defense
   */
  calculateActualDamage: (baseDamage, defense) => {
    return Math.max(1, baseDamage - defense);
  },

  /**
   * Generates enemy attack damage
   */
  calculateEnemyDamage: (enemy) => {
    const baseDamage = Math.floor(Math.random() * enemy.attack) + Math.floor(enemy.attack / 2);
    return baseDamage;
  },

  /**
   * Calculates escape chance based on party speed
   */
  calculateEscapeChance: (party) => {
    const aliveMembers = party.filter(char => char && CharacterCreator.isAlive(char));
    if (aliveMembers.length === 0) return 0;
    
    const averageSpeed = aliveMembers.reduce((total, char) => total + char.speed, 0) / aliveMembers.length;
    return 0.3 + (averageSpeed / 100); // 30% base + speed bonus
  },

  /**
   * Applies card draw bonuses based on cards not drawn
   */
  calculateDrawBonuses: (cardsNotDrawn) => {
    const bonuses = {
      2: { // Drew 0 cards
        healing: 3,
        tempAttack: 2,
        tempMagic: 2,
        message: "Focus Bonus: Party heals 3 HP and gains +2 Attack/Magic for next turn!"
      },
      1: { // Drew 1 card
        healing: 1,
        tempAttack: 1,
        tempMagic: 0,
        message: "Discipline Bonus: Party heals 1 HP and gains +1 Attack for next turn!"
      },
      0: { // Drew 2 cards
        healing: 0,
        tempAttack: 0,
        tempMagic: 0,
        message: null
      }
    };
    
    return bonuses[cardsNotDrawn] || bonuses[0];
  },

  /**
   * Processes reward from defeating enemy
   */
  processEnemyReward: (reward) => {
    if (reward.includes('Draw')) {
      const cardCount = parseInt(reward.match(/\d+/)[0]);
      return { type: 'cards', amount: cardCount };
    } else if (reward.includes('heals')) {
      const healAmount = parseInt(reward.match(/\d+/)[0]);
      return { type: 'healing', amount: healAmount };
    }
    return { type: 'none', amount: 0 };
  }
};
