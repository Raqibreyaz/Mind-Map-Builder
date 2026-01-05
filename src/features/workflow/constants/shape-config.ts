/**
 * Shape Configuration System
 * Defines all architectural shapes, colors, and sticker mappings
 */

export type ShapeType = 
  | 'circle'      // Services/Endpoints
  | 'triangle'    // Events/Triggers
  | 'diamond'     // Decisions/Gateways
  | 'hexagon'     // Processes/Workflows
  | 'cylinder'    // Databases/Storage
  | 'rectangle'   // APIs/Clients
  | 'parallelogram'; // Async Operations

export type StickerType =
  | 'database'
  | 'server'
  | 'cloud'
  | 'mobile'
  | 'web'
  | 'api'
  | 'lock'
  | 'lightning'
  | 'cog'
  | 'chart'
  | 'file'
  | 'folder'
  | 'user'
  | 'users'
  | 'mail'
  | 'calendar'
  | 'clock'
  | 'check'
  | 'alert'
  | 'help';

export interface ShapeConfig {
  name: string;
  color: string;
  lightColor: string;
  darkColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  description: string;
}

export interface StickerConfig {
  icon: string;
  name: string;
  description: string;
}

export const SHAPE_CONFIGS: Record<ShapeType, ShapeConfig> = {
  circle: {
    name: 'Circle',
    color: '#3B82F6',      // Blue
    lightColor: '#DBEAFE',
    darkColor: '#1E40AF',
    borderColor: '#1E40AF',
    textColor: '#1E3A8A',
    icon: '●',
    description: 'Services, Endpoints, APIs',
  },
  triangle: {
    name: 'Triangle',
    color: '#F97316',      // Orange
    lightColor: '#FED7AA',
    darkColor: '#C2410C',
    borderColor: '#C2410C',
    textColor: '#92400E',
    icon: '▲',
    description: 'Events, Triggers, Webhooks',
  },
  diamond: {
    name: 'Diamond',
    color: '#A855F7',      // Purple
    lightColor: '#E9D5FF',
    darkColor: '#6B21A8',
    borderColor: '#6B21A8',
    textColor: '#4C1D95',
    icon: '◆',
    description: 'Decisions, Gateways, Conditions',
  },
  hexagon: {
    name: 'Hexagon',
    color: '#22C55E',      // Green
    lightColor: '#DCFCE7',
    darkColor: '#15803D',
    borderColor: '#15803D',
    textColor: '#166534',
    icon: '⬡',
    description: 'Processes, Workflows, Jobs',
  },
  cylinder: {
    name: 'Cylinder',
    color: '#06B6D4',      // Cyan
    lightColor: '#CFFAFE',
    darkColor: '#0369A1',
    borderColor: '#0369A1',
    textColor: '#164E63',
    icon: '🗄️',
    description: 'Databases, Storage, Cache',
  },
  rectangle: {
    name: 'Rectangle',
    color: '#6366F1',      // Indigo
    lightColor: '#E0E7FF',
    darkColor: '#312E81',
    borderColor: '#312E81',
    textColor: '#1E1B4B',
    icon: '▭',
    description: 'APIs, Clients, Components',
  },
  parallelogram: {
    name: 'Parallelogram',
    color: '#F43F5E',      // Rose
    lightColor: '#FFE4E6',
    darkColor: '#9F1239',
    borderColor: '#9F1239',
    textColor: '#500724',
    icon: '▱',
    description: 'Async Operations, Queues',
  },
};

export const STICKER_CONFIGS: Record<StickerType, StickerConfig> = {
  database: { icon: '💾', name: 'Database', description: 'Database' },
  server: { icon: '🖥️', name: 'Server', description: 'Server' },
  cloud: { icon: '☁️', name: 'Cloud', description: 'Cloud Service' },
  mobile: { icon: '📱', name: 'Mobile', description: 'Mobile Device' },
  web: { icon: '🌐', name: 'Web', description: 'Web Browser' },
  api: { icon: '🔌', name: 'API', description: 'API Endpoint' },
  lock: { icon: '🔒', name: 'Lock', description: 'Security/Auth' },
  lightning: { icon: '⚡', name: 'Lightning', description: 'Fast/Async' },
  cog: { icon: '⚙️', name: 'Config', description: 'Configuration' },
  chart: { icon: '📊', name: 'Chart', description: 'Analytics' },
  file: { icon: '📄', name: 'File', description: 'Document' },
  folder: { icon: '📁', name: 'Folder', description: 'Storage' },
  user: { icon: '👤', name: 'User', description: 'Single User' },
  users: { icon: '👥', name: 'Users', description: 'Multiple Users' },
  mail: { icon: '📧', name: 'Mail', description: 'Email' },
  calendar: { icon: '📅', name: 'Calendar', description: 'Schedule' },
  clock: { icon: '⏱️', name: 'Clock', description: 'Timer/Schedule' },
  check: { icon: '✓', name: 'Check', description: 'Success/Valid' },
  alert: { icon: '⚠️', name: 'Alert', description: 'Warning/Alert' },
  help: { icon: '❓', name: 'Help', description: 'Help/Info' },
};

/**
 * Get all shape types as array
 */
export const getAllShapes = (): ShapeType[] => {
  return Object.keys(SHAPE_CONFIGS) as ShapeType[];
};

/**
 * Get all sticker types as array
 */
export const getAllStickers = (): StickerType[] => {
  return Object.keys(STICKER_CONFIGS) as StickerType[];
};

/**
 * Get shape config by type
 */
export const getShapeConfig = (shapeType: ShapeType): ShapeConfig => {
  return SHAPE_CONFIGS[shapeType];
};

/**
 * Get sticker config by type
 */
export const getStickerConfig = (stickerType: StickerType): StickerConfig => {
  return STICKER_CONFIGS[stickerType];
};
