import { useState, useMemo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import css from './hud.module.css'

import { Button, HealthBar, Icon, SendNextWaveButton } from '@/common/ui'
import { ErrorBoundary } from '@/common/ui/ErrorBoundary'
import { SwitchHud } from "./SwitchHud";
import { BlizzardSkillButton } from './BlizzardSkillButton'
import { NextWaveIndicator } from './NextWaveIndicator'
import { SkillEnergyBar } from './SkillEnergyBar'
import { ConfirmModal } from '@/common/ui/ConfirmModal'
import { useGameStore } from '@/Game/common/stores/state'
import { useSkillProgressStore } from '@/common/stores/skill-progress/skill-progress.store'
import { clampEnabled } from '@/common/stores/skill-progress/skill-progress.storage'
import { DEFAULT_SKILL } from '@/common/enum/skill-ids'
import i18n from '@/common/providers/i18n'
import { HordeStats } from './HordeStats'

const LazyAdminPanel = import.meta.env.DEV
  ? lazy(() => import('@/dev/admin-panel.component'))
  : () => null

export const Hud = () => {
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const gameController = useGameStore((state) => state.gameController)
  const skillProgress = useSkillProgressStore((state) => state.skillProgress)
  const enabledSkills = useMemo(() => {
    if (!skillProgress) return [DEFAULT_SKILL]
    return skillProgress.enabled.length > 0
      ? clampEnabled(skillProgress.enabled, skillProgress.unlocked)
      : [DEFAULT_SKILL]
  }, [skillProgress?.enabled, skillProgress?.unlocked])

  const confirmBack = () => {
    setShowConfirmModal(false)
    navigate('/play', { replace: true })
  }

  const openBackModal = () => {
    gameController?.pauseGame()
    setShowConfirmModal(true)
  }

  const cancelBack = () => {
    gameController?.resumeGame()
    setShowConfirmModal(false)
  }

  return (
    <ErrorBoundary>
      <section className={css.TopHud}>
        <div className={css.TopHudCenter}>
          <Button
            size="small"
            variant="solid"
            fontWeight="bold"
            onClick={openBackModal}
            style={{ height: 28, width: 28, borderRadius: '28px', padding: 0, flexShrink: 0, background: 'transparent' }}
          >
            <Icon name="back" size={18} />
          </Button>

          <HealthBar />

          <HordeStats />
          <SendNextWaveButton />
        </div>
      </section>

      <section className={css.SkillBar}>
        <NextWaveIndicator />
        <div className={css.SkillBarRight}>
          <SkillEnergyBar />
          {enabledSkills.includes('blizzard') && <BlizzardSkillButton />}
        </div>
      </section>

      <section className={css.BottomHud}>
        <SwitchHud />
      </section>

      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyAdminPanel />
        </Suspense>
      )}

      {showConfirmModal && (
        <ConfirmModal
          title={i18n.t('backModalTitle')}
          cancelText={i18n.t('backModalCancel')}
          submitText={i18n.t('backModalSubmit')}
          onConfirm={confirmBack}
          onCancel={cancelBack}
        />
      )}
    </ErrorBoundary>
  )
}
