import { useEffect } from 'react'
import classNames from 'classnames'
import { useSkillEnergyStore } from '@/Game/common/stores/skill-energy/skill-energy.store'
import { usePauseState } from '@/Game/common/stores/state'
import css from './skill-energy-bar.module.css'

export const SkillEnergyBar = () => {
  const { isGameRunning } = usePauseState()
  const segments = useSkillEnergyStore((state) => state.segments)
  const maxSegments = useSkillEnergyStore((state) => state.maxSegments)
  const infiniteMana = useSkillEnergyStore((state) => state.infiniteMana)
  const regenIntervalMs = useSkillEnergyStore((state) => state.regenIntervalMs)
  const progressMs = useSkillEnergyStore((state) => state.progressMs)
  const startRegen = useSkillEnergyStore((state) => state.startRegen)
  const stopRegen = useSkillEnergyStore((state) => state.stopRegen)

  const effectiveSegments = infiniteMana ? maxSegments : segments

  useEffect(() => {
    if (isGameRunning) {
      startRegen()
    } else {
      stopRegen()
    }
    return () => {
      stopRegen()
    }
  }, [isGameRunning, startRegen, stopRegen])

  return (
    <div className={css.Container} aria-label="Skill energy">
      {Array.from({ length: maxSegments }).map((_, index) => {
        const isFull = index < effectiveSegments
        const isCurrent = index === effectiveSegments && effectiveSegments < maxSegments
        const fillRatio = isFull
          ? 1
          : isCurrent
          ? Math.min(1, progressMs / regenIntervalMs)
          : 0

        const trackClass = classNames(css.SegmentTrack, {
          [css.SegmentTrackFull]: isFull,
          [css.SegmentTrackCurrent]: isCurrent
        })

        return (
          <div key={index} className={trackClass}>
            <div
              className={css.SegmentFill}
              style={{ transform: `scaleX(${fillRatio})` }}
            />
          </div>
        )
      })}
    </div>
  )
}

