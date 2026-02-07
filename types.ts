
export enum CrystalColor {
  RUBY = 'ruby',
  SAPPHIRE = 'sapphire',
  EMERALD = 'emerald',
  CITRINE = 'citrine',
  AMETHYST = 'amethyst',
  DIAMOND = 'diamond',
  TOPAZ = 'topaz',
  QUARTZ = 'quartz',
  JADE = 'jade',
  OBSIDIAN = 'obsidian',
  PEARL = 'pearl'
}

export enum PowerType {
  NONE = 'none',
  LINE_BLASTER_H = 'line_blaster_h',
  LINE_BLASTER_V = 'line_blaster_v',
  AREA_BLAST = 'area_blast',
  COLOR_CORE = 'color_core'
}

export interface Crystal {
  id: string;
  color: CrystalColor;
  power: PowerType;
  row: number;
  col: number;
  isMarkedForRemoval?: boolean;
}

export type Grid = (Crystal | null)[][];

export enum GameState {
  SPLASH = 'splash',
  MENU = 'menu',
  LEVEL_SELECT = 'level_select',
  PLAYING = 'playing',
  LEVEL_COMPLETE = 'level_complete',
  GAME_OVER = 'game_over',
  COLLECTION = 'collection'
}

export interface LevelConfig {
  id: number;
  seasonId: number; // 1 or 2
  targetScore: number;
  diamondsTarget?: number; // New collection goal
  moves?: number;
  timeLimit?: number; // Time in seconds
  unlocked: boolean;
  stars: number;
}
