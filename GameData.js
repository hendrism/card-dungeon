// GameData.js - All game configuration and static data

export const GAME_DATA = {
  races: [
    { name: 'Human', bonus: 'Versatile: +1 to all stats', color: 'bg-blue-100' },
    { name: 'Elf', bonus: 'Agile: +2 Speed, +1 Magic', color: 'bg-green-100' },
    { name: 'Dwarf', bonus: 'Hardy: +2 Defense, +1 Health', color: 'bg-orange-100' },
    { name: 'Orc', bonus: 'Strong: +2 Attack, +1 Health', color: 'bg-red-100' },
    { name: 'Halfling', bonus: 'Lucky: Draw extra card each turn', color: 'bg-yellow-100' },
    { name: 'Tiefling', bonus: 'Infernal: +2 Magic, Fire resistance', color: 'bg-purple-100' }
  ],
  
  roles: [
    { name: 'Fighter', health: 25, attack: 8, defense: 6, magic: 2, speed: 4, ability: 'Weapon Master: Face cards deal +3 damage' },
    { name: 'Paladin', health: 30, attack: 6, defense: 8, magic: 4, speed: 3, ability: 'Divine Shield: Hearts restore 2 HP to party' },
    { name: 'Rogue', health: 20, attack: 7, defense: 4, magic: 3, speed: 8, ability: 'Stealth Strike: Spades deal double damage' },
    { name: 'Wizard', health: 15, attack: 3, defense: 3, magic: 9, speed: 5, ability: 'Arcane Power: Clubs deal magic damage' },
    { name: 'Druid', health: 22, attack: 5, defense: 5, magic: 6, speed: 6, ability: 'Nature\'s Wrath: Diamonds boost next card' },
    { name: 'Barbarian', health: 28, attack: 9, defense: 5, magic: 1, speed: 5, ability: 'Rage: Aces deal massive damage' }
  ],
  
  enemies: [
    { name: 'Goblin Scout', health: 15, attack: 4, defense: 2, reward: 'Draw 2 cards' },
    { name: 'Skeleton Warrior', health: 20, attack: 6, defense: 4, reward: 'Party heals 5 HP' },
    { name: 'Orc Berserker', health: 25, attack: 8, defense: 3, reward: 'Draw 3 cards' },
    { name: 'Dark Mage', health: 18, attack: 7, defense: 5, reward: 'Party heals 8 HP' },
    { name: 'Minotaur', health: 35, attack: 10, defense: 6, reward: 'Draw 4 cards' }
  ],

  constants: {
    MAX_CARDS_PER_TURN: 2,
    PARTY_SIZE: 4,
    ROOMS_PER_FLOOR: 5
  }
};
