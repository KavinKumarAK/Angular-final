export type CharacterClassId = 'warrior' | 'mage' | 'rogue' | 'paladin';
export type ElementType = 'flame' | 'frost' | 'lightning' | 'void';
export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

export interface CharacterClass {
  id: CharacterClassId;
  name: string;
  tagline: string;
  primaryStat: 'strength' | 'agility' | 'magic';
  iconSvg: string;
  badgeColor: string;
}

export interface HatItem {
  id: string;
  name: string;
  type: 'helm' | 'wizard' | 'visor' | 'crown' | 'hood';
  description: string;
  rarity: RarityType;
  strengthBonus: number;
  agilityBonus: number;
  magicBonus: number;
}

export interface OutfitItem {
  id: string;
  name: string;
  type: 'plate' | 'robe' | 'cyber' | 'leather';
  description: string;
  rarity: RarityType;
  baseColor: string;
  trimColor: string;
  defense: number;
}

export interface WeaponItem {
  id: string;
  name: string;
  type: 'sword' | 'staff' | 'bow' | 'scythe' | 'daggers' | 'wand';
  description: string;
  baseDamage: number;
  scalingStat: 'strength' | 'agility' | 'magic';
  element: ElementType;
  rarity: RarityType;
  symbolTag: string;
  accentColor: string;
}

export interface SpecialPower {
  id: string;
  name: string;
  element: ElementType;
  description: string;
  powerMultiplier: number;
  glowColor: string;
  secondaryGlow: string;
}

export interface RpgStats {
  strength: number;
  agility: number;
  magic: number;
}

export interface CharacterPreset {
  name: string;
  characterClass: CharacterClassId;
  skinColor: string;
  hatId: string;
  outfitId: string;
  weaponId: string;
  powerActive: boolean;
  powerId: string;
  stats: RpgStats;
}

export const CLASSES: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Dragon Warrior',
    tagline: 'Brutal melee mastery & iron defense',
    primaryStat: 'strength',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132 2.132-3.197a1.5 1.5 0 012.396.118l3.197 4.795a1.5 1.5 0 01-.118 2.396l-4.41 2.94zM3 21l6.75-6.75M9.75 14.25L5.25 18.75M14.25 9.75l4.5-4.5" />',
    badgeColor: '#f87171'
  },
  {
    id: 'mage',
    name: 'Arcane Mage',
    tagline: 'Unleashes destructive elemental spells',
    primaryStat: 'magic',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />',
    badgeColor: '#c084fc'
  },
  {
    id: 'rogue',
    name: 'Shadow Rogue',
    tagline: 'Lightning reflexes & precision criticals',
    primaryStat: 'agility',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-10.5m0 0h-6m6 0v6M20.25 10.5l-10.5 10.5m0 0h6m-6 0v-6" />',
    badgeColor: '#34d399'
  },
  {
    id: 'paladin',
    name: 'Cyber Paladin',
    tagline: 'Holy shields & futuristic cyber-sorcery',
    primaryStat: 'strength',
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />',
    badgeColor: '#fbbf24'
  }
];

export const HATS: HatItem[] = [
  {
    id: 'horned-helm',
    name: 'Viking War Helm',
    type: 'helm',
    description: 'Forged with dragon-iron horns for brutal headbutts.',
    rarity: 'rare',
    strengthBonus: 4,
    agilityBonus: 0,
    magicBonus: 0
  },
  {
    id: 'wizard-hat',
    name: 'Starseeker Wizard Hat',
    type: 'wizard',
    description: 'Embroidered with celestial starlight for spell weaving.',
    rarity: 'epic',
    strengthBonus: 0,
    agilityBonus: 1,
    magicBonus: 6
  },
  {
    id: 'cyber-visor',
    name: 'Neon Cyber Visor',
    type: 'visor',
    description: 'HUD tracking calculates enemy weak points at 240 FPS.',
    rarity: 'legendary',
    strengthBonus: 2,
    agilityBonus: 5,
    magicBonus: 2
  },
  {
    id: 'hero-crown',
    name: 'Crown of Radiance',
    type: 'crown',
    description: 'Worn by rulers whose aura commands the battlefield.',
    rarity: 'legendary',
    strengthBonus: 3,
    agilityBonus: 3,
    magicBonus: 4
  },
  {
    id: 'shadow-cowl',
    name: 'Shinobi Hood',
    type: 'hood',
    description: 'Woven from moonlit shadow silk. Silent in footsteps.',
    rarity: 'rare',
    strengthBonus: 1,
    agilityBonus: 5,
    magicBonus: 1
  }
];

export const OUTFITS: OutfitItem[] = [
  {
    id: 'plate-armor',
    name: 'Paladin Heavy Plate',
    type: 'plate',
    description: 'Reinforced steel with gold inlays to deflect dragon breath.',
    rarity: 'epic',
    baseColor: '#334155',
    trimColor: '#eab308',
    defense: 45
  },
  {
    id: 'archmage-robe',
    name: 'Archmage Velvet Robe',
    type: 'robe',
    description: 'Enchanted fabric that absorbs and redirects arcane mana.',
    rarity: 'rare',
    baseColor: '#4c1d95',
    trimColor: '#a855f7',
    defense: 20
  },
  {
    id: 'cyber-exosuit',
    name: 'Hyperdrive Cyber Suit',
    type: 'cyber',
    description: 'Carbon fiber weaves with pulse-conduit cooling channels.',
    rarity: 'legendary',
    baseColor: '#0f172a',
    trimColor: '#06b6d4',
    defense: 38
  },
  {
    id: 'rogue-tunic',
    name: 'Midnight Assassin Leathers',
    type: 'leather',
    description: 'Aerodynamic treated leather granting silent mobility.',
    rarity: 'rare',
    baseColor: '#1c1917',
    trimColor: '#10b981',
    defense: 28
  }
];

export const WEAPONS: WeaponItem[] = [
  {
    id: 'flame-sword',
    name: 'Infernal Sunblade',
    type: 'sword',
    description: 'Ignites the air with solar flames upon every swing.',
    baseDamage: 45,
    scalingStat: 'strength',
    element: 'flame',
    rarity: 'epic',
    symbolTag: 'SWD-FLM',
    accentColor: '#f97316'
  },
  {
    id: 'frost-staff',
    name: 'Glacial Scepter',
    type: 'staff',
    description: 'Channels blizzards capable of freezing lava solid.',
    baseDamage: 42,
    scalingStat: 'magic',
    element: 'frost',
    rarity: 'epic',
    symbolTag: 'STF-ICE',
    accentColor: '#38bdf8'
  },
  {
    id: 'lightning-bow',
    name: 'Thunderbolt Recurve',
    type: 'bow',
    description: 'Fires supersonic lightning arrows that split in mid-air.',
    baseDamage: 40,
    scalingStat: 'agility',
    element: 'lightning',
    rarity: 'legendary',
    symbolTag: 'BOW-BOLT',
    accentColor: '#eab308'
  },
  {
    id: 'void-scythe',
    name: 'Void Eclipse Scythe',
    type: 'scythe',
    description: 'Cleaves the dimensional fabric with dark gravity pulses.',
    baseDamage: 52,
    scalingStat: 'strength',
    element: 'void',
    rarity: 'legendary',
    symbolTag: 'SCT-VOID',
    accentColor: '#a855f7'
  },
  {
    id: 'venom-daggers',
    name: 'Emerald Twin Daggers',
    type: 'daggers',
    description: 'Coated in viper venom; strikes thrice before blinking.',
    baseDamage: 38,
    scalingStat: 'agility',
    element: 'frost',
    rarity: 'rare',
    symbolTag: 'DAG-VEN',
    accentColor: '#10b981'
  },
  {
    id: 'cosmic-wand',
    name: 'Supernova Prism Wand',
    type: 'wand',
    description: 'Funnels pure starlight into piercing gamma bursts.',
    baseDamage: 46,
    scalingStat: 'magic',
    element: 'lightning',
    rarity: 'epic',
    symbolTag: 'WND-STR',
    accentColor: '#ec4899'
  }
];

export const SPECIAL_POWERS: SpecialPower[] = [
  {
    id: 'flame-aura',
    name: 'Dragonfire Radiance',
    element: 'flame',
    description: 'Surrounds the champion in blazing dragon fire (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#ff4500',
    secondaryGlow: '#ffaa00'
  },
  {
    id: 'frost-barrier',
    name: 'Absolute Zero Aura',
    element: 'frost',
    description: 'Creates a crystal ice vortex that empowers frost spells (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#00d2ff',
    secondaryGlow: '#99f6ff'
  },
  {
    id: 'lightning-surge',
    name: 'Overcharged Ion Storm',
    element: 'lightning',
    description: 'Electricity crackles around the champion, electrifying attacks (+25% power).',
    powerMultiplier: 1.25,
    glowColor: '#ffe600',
    secondaryGlow: '#fffbeb'
  },
  {
    id: 'void-vortex',
    name: 'Singularity Void Aura',
    element: 'void',
    description: 'Gravitational distortion bends light and devours enemy defenses (+30% power).',
    powerMultiplier: 1.30,
    glowColor: '#9333ea',
    secondaryGlow: '#c084fc'
  }
];

export const SKIN_PALETTES = [
  { label: 'Yellow', value: '#fbbf24' },
  { label: 'Cream', value: '#fed7aa' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Purple', value: '#a78bfa' },
  { label: 'Mint', value: '#34d399' },
  { label: 'Light Blue', value: '#bae6fd' },
  { label: 'Slate', value: '#475569' }
];

export const PRESETS: CharacterPreset[] = [
  {
    name: 'Ignis Flareheart',
    characterClass: 'warrior',
    skinColor: '#fbbf24',
    hatId: 'horned-helm',
    outfitId: 'plate-armor',
    weaponId: 'flame-sword',
    powerActive: true,
    powerId: 'flame-aura',
    stats: { strength: 16, agility: 8, magic: 6 }
  },
  {
    name: 'Lyra Frostwhisper',
    characterClass: 'mage',
    skinColor: '#bae6fd',
    hatId: 'wizard-hat',
    outfitId: 'archmage-robe',
    weaponId: 'frost-staff',
    powerActive: true,
    powerId: 'frost-barrier',
    stats: { strength: 6, agility: 9, magic: 18 }
  },
  {
    name: 'Kaelen Ghoststride',
    characterClass: 'rogue',
    skinColor: '#fed7aa',
    hatId: 'shadow-cowl',
    outfitId: 'rogue-tunic',
    weaponId: 'lightning-bow',
    powerActive: true,
    powerId: 'lightning-surge',
    stats: { strength: 7, agility: 18, magic: 8 }
  },
  {
    name: 'V-09 Cyber Paladin',
    characterClass: 'paladin',
    skinColor: '#a78bfa',
    hatId: 'cyber-visor',
    outfitId: 'cyber-exosuit',
    weaponId: 'void-scythe',
    powerActive: true,
    powerId: 'void-vortex',
    stats: { strength: 14, agility: 11, magic: 12 }
  }
];