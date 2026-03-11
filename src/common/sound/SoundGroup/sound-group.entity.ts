import { SoundInstance } from '../SoundInstance/sound-instance.entity'
import {
  SoundConfig,
  PlayOptions,
  StopOptions,
  VolumeOptions
} from '../sound.types'

export class SoundGroup {
  private sounds: Record<string, SoundInstance> = {}
  public volume: number = 1

  constructor(public groupName: string) {}

  setGroupVolume(volume: number) {
    this.volume = volume

    for (const sound of Object.values(this.sounds)) {
      sound.setGroupVolume(volume)
    }
  }

  async load(configs: SoundConfig[]) {
    for (const config of configs) {
      const instance = new SoundInstance(config)
      instance.setGroupVolume(this.volume)
      this.sounds[config.name] = instance
    }
  }

  play(options: PlayOptions) {
    const sound = this.sounds[options.name]
    if (sound) sound.play(options)
  }

  stop(options: StopOptions) {
    this.sounds[options.name]?.stop(options)
  }

  stopAll(): void {
    for (const sound of Object.values(this.sounds)) {
      sound.stop()
    }
  }

  setVolume(options: VolumeOptions) {
    this.sounds[options.name]?.setVolume(options.volume)
  }

  pauseAll(): void {
    for (const sound of Object.values(this.sounds)) {
      sound.pause()
    }
  }

  resumeAll(): void {
    for (const sound of Object.values(this.sounds)) {
      sound.resume()
    }
  }

  unloadAll() {
    for (const sound of Object.values(this.sounds)) {
      sound.unload()
    }
    this.sounds = {}
  }

  getSoundInstance(name: string): SoundInstance | undefined {
    return this.sounds[name]
  }
}
