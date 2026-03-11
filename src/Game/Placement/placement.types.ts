import { MonsterConfig } from '@/Game/common/types/monsters.types'

export type PlacementConfig = {
  id: number
  nome: string
  descricao: string
  dificuldade: string
  hordas: number
  waveIntervalSeconds: number
  imagem: string
  waves: MonsterConfig[]
  gridColor: number
  tileTint: number
  dirtTint: number
}
