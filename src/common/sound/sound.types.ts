export interface SoundConfig {
  name: string
  path: string
  volume?: number
  maxInstances?: number
  minInterval?: number
  volumeVariation?: number
  pitchVariation?: number
}

export interface PlayOptions {
  name: string
  rate?: number
  loop?: boolean
  emitterId?: string
}

export interface StopOptions {
  name: string
  emitterId?: string
  fadeOutDuration?: number
}

export interface VolumeOptions {
  name: string
  volume: number
}
