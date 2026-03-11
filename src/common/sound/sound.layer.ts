import { SoundGroups } from '@/common/enum/sound-groups'
import { SoundGroup } from './SoundGroup/sound-group.entity'
import {
  SoundConfig,
  PlayOptions,
  StopOptions,
  VolumeOptions
} from './sound.types'
import {
  loadGroupVolume,
  loadMasterVolume,
  saveGroupVolume,
  saveMasterVolume
} from '@/common/stores/sound/sound.storage'

class SoundLayerEntity {
  private groups: Record<string, SoundGroup> = {}
  public volume = 0.5

  constructor() {
    Howler.volume(this.volume)

    const effects = new SoundGroup(SoundGroups.Effects)
    this.groups[SoundGroups.Effects] = effects

    const monsters = new SoundGroup(SoundGroups.Monsters)
    this.groups[SoundGroups.Monsters] = monsters

    const voices = new SoundGroup(SoundGroups.Voices)
    this.groups[SoundGroups.Voices] = voices

    const musics = new SoundGroup(SoundGroups.Musics)
    this.groups[SoundGroups.Musics] = musics

    this.loadPersistedVolumes()
  }

  public async loadPersistedVolumes() {
    const master = await loadMasterVolume()
    const voices = await loadGroupVolume(SoundGroups.Voices)
    const musics = await loadGroupVolume(SoundGroups.Musics)
    const effects = await loadGroupVolume(SoundGroups.Effects)
    const monster = await loadGroupVolume(SoundGroups.Monsters)

    if (master !== null) this.setMasterVolume(master)
    if (voices !== null) this.setGroupVolume(SoundGroups.Voices, voices, false)
    if (musics !== null) this.setGroupVolume(SoundGroups.Musics, musics, false)
    if (effects !== null) this.setGroupVolume(SoundGroups.Effects, effects, false)
    if (monster !== null) this.setGroupVolume(SoundGroups.Monsters, monster, false)
  }

  async loadGroup(groupName: SoundGroups, configs: SoundConfig[]) {
    const group = this.groups[groupName]
    await group.load(configs)
    this.groups[groupName] = group
  }

  play(groupName: SoundGroups, options: PlayOptions) {
    this.groups[groupName]?.play(options)
  }

  stop(groupName: SoundGroups, options: StopOptions) {
    this.groups[groupName]?.stop(options)
  }

  setVolume(groupName: SoundGroups, options: VolumeOptions) {
    this.groups[groupName]?.setVolume(options)
  }

  unloadGroup(groupName: SoundGroups) {
    this.groups[groupName]?.unloadAll()
    delete this.groups[groupName]
  }

  unloadAll() {
    for (const group of Object.values(this.groups)) {
      group.unloadAll()
    }
    this.groups = {}
  }

  pauseGroup(groupName: SoundGroups) {
    this.groups[groupName]?.pauseAll()
  }

  resumeGroup(groupName: SoundGroups) {
    this.groups[groupName]?.resumeAll()
  }

  stopAllInGroup(groupName: SoundGroups) {
    this.groups[groupName]?.stopAll()
  }

  /** Stops all currently playing gameplay sounds (effects, monsters, voices). Call when leaving the game. */
  stopAllGameSounds() {
    this.stopAllInGroup(SoundGroups.Effects)
    this.stopAllInGroup(SoundGroups.Monsters)
    this.stopAllInGroup(SoundGroups.Voices)
  }

  public getGroupVolume(groupName: SoundGroups) {
    return this.groups[groupName]?.volume
  }

  public setGroupVolume(
    groupName: SoundGroups,
    volume: number,
    save: boolean = true
  ) {
    this.groups[groupName]?.setGroupVolume(volume)

    if (save) saveGroupVolume(groupName, volume)
  }

  public setMasterVolume(volume: number) {
    Howler.volume(volume)
    this.volume = volume
    saveMasterVolume(volume)
  }
}

const SoundLayer = new SoundLayerEntity()

export default SoundLayer
export * from './sound.types'
