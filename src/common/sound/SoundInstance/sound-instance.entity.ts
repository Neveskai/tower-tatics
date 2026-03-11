import { PlayOptions, SoundConfig, StopOptions } from '../sound.types'
import { Howl } from 'howler'

export const DEFAULT_MIN_INTERVAL = 250
export const DEFAULT_MAX_INSTANCES = 3
export const DEFAULT_VOL_VARIATION = 0.1
export const DEFAULT_PITCH_VARIATION = 0.04

export class SoundInstance {
  private groupVolume: number = 1
  public howl: Howl
  public isLoaded = false

  private loop: boolean = false
  private lastPlayTime: number = 0
  private activePlayIds: number[] = []
  private emitterPlayMap = new Map<string, number>()

  private readonly baseVolume: number
  private readonly minInterval: number
  private readonly maxInstances: number
  private readonly pitchVariation: number
  private readonly volumeVariation: number

  constructor(private config: SoundConfig) {
    this.baseVolume = this.config.volume ?? 1
    this.minInterval = this.config.minInterval ?? DEFAULT_MIN_INTERVAL
    this.maxInstances = this.config.maxInstances ?? DEFAULT_MAX_INSTANCES
    this.pitchVariation = this.config.pitchVariation ?? DEFAULT_PITCH_VARIATION
    this.volumeVariation = this.config.volumeVariation ?? DEFAULT_VOL_VARIATION

    this.howl = new Howl({
      src: [this.config.path],
      volume: this.baseVolume,
      onload: () => (this.isLoaded = true),
      onend: id => this.handleStop(id),
      onstop: id => this.handleStop(id)
    })
  }

  private handleStop(id: number): void {
    this.removePlayId(id)
    this.removeEmitterByPlayId(id)
  }

  private removePlayId(id: number): void {
    this.activePlayIds = this.activePlayIds.filter(activeId => activeId !== id)
  }

  private removeEmitterByPlayId(id: number): void {
    for (const [emitterId, playId] of this.emitterPlayMap.entries()) {
      if (playId === id) {
        this.emitterPlayMap.delete(emitterId)
        break
      }
    }
  }

  private hasEnoughIntervalPassed(): boolean {
    return Date.now() - this.lastPlayTime >= this.minInterval
  }

  private updateActivePlayIds(): void {
    this.activePlayIds = this.activePlayIds.filter(id => this.howl.playing(id))
  }

  private applyVolumeVariation(id: number): void {
    const variation = (Math.random() * 2 - 1) * this.volumeVariation
    const finalVolume = this.clamp(
      (this.baseVolume + variation) * this.groupVolume,
      0,
      1
    )

    this.howl.volume(finalVolume, id)
  }

  private applyRateVariation(id: number, rate?: number): void {
    const finalRate =
      rate !== undefined
        ? rate
        : 1 + (Math.random() * 2 - 1) * this.pitchVariation

    this.howl.rate(finalRate, id)
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }

  public play(options: PlayOptions): void {
    const { rate, loop, emitterId } = options

    if (loop) this.loop = true
    if (!this.isLoaded || !this.hasEnoughIntervalPassed()) return

    this.updateActivePlayIds()

    if (emitterId && this.emitterPlayMap.has(emitterId)) {
      const existingId = this.emitterPlayMap.get(emitterId)!
      this.howl.stop(existingId)
      this.removePlayId(existingId)
    } else if (this.activePlayIds.length >= this.maxInstances) {
      return
    }

    const id = this.howl.play()
    this.activePlayIds.push(id)

    if (this.loop) this.howl.loop(true)
    if (emitterId) this.emitterPlayMap.set(emitterId, id)

    this.lastPlayTime = Date.now()

    this.applyVolumeVariation(id)
    this.applyRateVariation(id, rate)
  }

  public stop(options?: StopOptions): void {
    this.howl.loop(false)

    const fadeAndStop = (id: number, duration: number) => {
      const currentVolume = Number(this.howl.volume(id))
      this.howl.fade(currentVolume, 0, duration, id)

      setTimeout(() => {
        this.howl.stop(id)
        this.removePlayId(id)
        this.removeEmitterByPlayId(id)
      }, duration)
    }

    const fadeDuration = options?.fadeOutDuration ?? 0

    if (options?.emitterId) {
      const playId = this.emitterPlayMap.get(options.emitterId)
      if (playId !== undefined) {
        if (fadeDuration > 0) {
          fadeAndStop(playId, fadeDuration)
        } else {
          this.howl.stop(playId)
          this.removePlayId(playId)
          this.emitterPlayMap.delete(options.emitterId)
        }
      }
    } else {
      for (const id of this.activePlayIds) {
        if (fadeDuration > 0) {
          fadeAndStop(id, fadeDuration)
        } else {
          this.howl.stop(id)
        }
      }

      if (fadeDuration <= 0) {
        this.activePlayIds = []
        this.emitterPlayMap.clear()
      } else {
        setTimeout(() => {
          this.activePlayIds = []
          this.emitterPlayMap.clear()
        }, fadeDuration)
      }
    }
  }

  public pause(): void {
    this.howl.volume(0)
  }

  public setGroupVolume(volume: number): void {
    this.groupVolume = volume

    for (const id of this.activePlayIds) {
      const volume = this.clamp(this.baseVolume * this.groupVolume, 0, 1)
      this.howl.volume(volume, id)
    }
  }

  public resume(): void {
    for (const id of this.activePlayIds) {
      const volume = this.clamp(this.baseVolume * this.groupVolume, 0, 1)
      this.howl.volume(volume, id)
    }
  }

  public setVolume(volume: number): void {
    this.howl.volume(volume * this.groupVolume)
  }

  public unload(): void {
    this.howl.unload()
  }
}
