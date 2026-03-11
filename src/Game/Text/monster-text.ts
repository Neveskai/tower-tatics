import i18n from '@/common/providers/i18n'
import { TextOptions } from 'pixi.js'

export const GOLD_GAINED_TEXT: (gold: number) => TextOptions = gold => ({
  text: `+${gold}`,
  style: {
    fontSize: 16,
    fill: 'gold',
    fontWeight: 'bold',
    align: 'center',
    stroke: '#000'
  }
})

export const STUN_RESIST_TEXT: TextOptions = {
  text: i18n.t('stunResist'),
  style: {
    fontSize: 9,
    fill: 0xffff7f,
    align: 'center'
  }
}

export const SLOW_RESIST_TEXT: TextOptions = {
  text: i18n.t('slowResist'),
  style: {
    fontSize: 9,
    fill: 0xe6e6ff,
    align: 'center'
  }
}

export const IMMUNE_TEXT: TextOptions = {
  text: i18n.t('damageImmune'),
  style: {
    fontSize: 11,
    fill: 0xcccccc,
    fontWeight: 'bold',
    align: 'center',
    stroke: '#333'
  }
}
