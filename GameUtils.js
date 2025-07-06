// GameUtils.js - Utility functions for game mechanics

export const GameUtils = {
  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  shuffleDeck: (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Creates a standard 52-card deck with suits and values
   */
  createDeck: () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];
    
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({ suit, value, id: `${suit}${value}` });
      });
    });
    
    return GameUtils.shuffleDeck(newDeck);
  },

  /**
   * Returns appropriate CSS color class for card suits
   */
  getCardColor: (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
  },

  /**
   * Converts card value to numeric value for calculations
   */
  getCardValue: (card) => {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
  },

  /**
   * Applies racial bonuses to base character stats
   */
  applyRaceBonus: (baseStats, raceName) => {
    const bonuses = {
      health: ['Dwarf', 'Orc', 'Human'].includes(raceName) ? 1 : 0,
      attack: raceName === 'Orc' ? 2 : raceName === 'Human' ? 1 : 0,
      defense: raceName === 'Dwarf' ? 2 : raceName === 'Human' ? 1 : 0,
      magic: raceName === 'Elf' ? 1 : raceName === 'Tiefling' ? 2 : raceName === 'Human' ? 1 : 0,
      speed: raceName === 'Elf' ? 2 : raceName === 'Human' ? 1 : 0
    };
    
    return {
      maxHealth: baseStats.health + bonuses.health,
      health: baseStats.health + bonuses.health,
      attack: baseStats.attack + bonuses.attack,
      defense: baseStats.defense + bonuses.defense,
      magic: baseStats.magic + bonuses.magic,
      speed: baseStats.speed + bonuses.speed
    };
  },

  /**
   * Generates random number between min and max (inclusive)
   */
  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Calculates percentage for health bars and other UI elements
   */
  getPercentage: (current, max) => {
    return Math.max(0, Math.min(100, (current / max) * 100));
  },

  /**
   * Formats damage text with color coding
   */
  formatDamage: (damage, type = 'physical') => {
    const colors = {
      physical: 'text-red-600',
      magic: 'text-blue-600',
      healing: 'text-green-600'
    };
    return { value: damage, color: colors[type] || colors.physical };
  }
};