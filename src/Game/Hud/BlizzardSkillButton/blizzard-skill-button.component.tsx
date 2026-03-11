import classNames from 'classnames'
import { useGameStore } from '@/Game/common/stores/state'
import { Icon } from '@/common/ui'
import { useSkillEnergyStore } from '@/Game/common/stores/skill-energy/skill-energy.store'
import { SKILL_COSTS } from '@/Game/common/constants/skills.constants'
import css from './blizzard-skill-button.module.css'
import { useEffect, useState } from 'react'

export const BlizzardSkillButton = () => {
  const [hasEnergy, setHasEnergy] = useState(false)
  
  const activeSkill = useGameStore((state) => state.activeSkill)
  const segments = useSkillEnergyStore((state) => state.segments)
  const isActive = activeSkill === 'blizzard'

  const setActiveSkill = useGameStore((state) => state.setActiveSkill)
  const canSpend = useSkillEnergyStore((state) => state.canSpend)

  const handleClick = () => {
    if (!hasEnergy && !isActive) return
    setActiveSkill(isActive ? null : 'blizzard')
  }

  useEffect(() => {
    setHasEnergy(canSpend(SKILL_COSTS.blizzard))
  }, [segments])

  return (
    <button
      type="button"
      className={classNames(css.SkillButton, {
        [css.SkillButtonActive]: isActive,
        [css.SkillButtonDisabled]: !hasEnergy
      })}
      onClick={handleClick}
      title="Nevasca"
      aria-label="Nevasca"
      disabled={!hasEnergy}
    >
      <Icon name="blizzard" size={25} />
    </button>
  )
}
