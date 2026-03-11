import { useGameStore } from '@/Game/common/stores/state'
import { Button } from '@/common/ui'
import i18n from '@/common/providers/i18n'

export function StartButton() {
  const gameController = useGameStore(state => state.gameController)
  const currentHorde = useGameStore(state => state.currentHorde)
  const pause = useGameStore(state => state.pause)

  return (
    <Button
      fontWeight="bold"
      kind="warning"
      size="small"
      onClick={() => gameController?.togglePause()}
    >
      {pause
        ? currentHorde === 0
          ? i18n.t('start')
          : i18n.t('resume')
        : i18n.t('pause')}
    </Button>
  )
}
