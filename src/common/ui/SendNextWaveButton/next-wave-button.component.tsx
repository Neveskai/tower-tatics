import { useGameStore, usePauseState } from "@/Game/common/stores/state";
import i18n from "@/common/providers/i18n";
import { Button, Icon } from "@/common/ui";
import { WAVE_BUTTON_TITLE } from "./next-wave-button.constants";

export const SendNextWaveButton = () => {
  const { waveButtonMode, pause, currentHorde, hasActiveMonsters } =
    usePauseState();
  const isSending = useGameStore((state) => state.isSending);
  const gameController = useGameStore((state) => state.gameController);

  const handleClick = () => {
    if (!gameController) return;

    if (currentHorde === 0 && pause) {
      gameController.togglePause();
      gameController.sendNextWave();
      return;
    }

    if (pause && currentHorde > 0) {
      gameController.togglePause();
      return;
    }

    if (!pause && hasActiveMonsters) {
      gameController.togglePause();
      return;
    }

    if (!isSending && !pause && !hasActiveMonsters) {
      gameController.sendNextWave();
    }
  };

  const disabled = isSending || waveButtonMode === null;
  const title = waveButtonMode ? i18n.t(WAVE_BUTTON_TITLE[waveButtonMode]) : "";
  const isPause = waveButtonMode === "pause";

  return (
    <Button
      size="small"
      variant="solid"
      fontWeight="bold"
      onClick={handleClick}
      disabled={disabled}
      style={{ height: 28, width: 28, borderRadius: '28px', padding: 0, flexShrink: 0, background: 'linear-gradient(180deg, #f4d050 0%, #d4a017 45%, #a07810 100%)' }}
      title={title}
      aria-label={title}
    >
      <Icon name={isPause ? "pause" : "play"} size={18} />
    </Button>
  );
};
