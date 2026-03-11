import { useGameStore } from "@/Game/common/stores/state";
import { navigate } from "@/common/functions/navigation";
import { usePlayerStore } from "@/common/stores/player/player.store";

export function renderGameOverScreen() {
  const { gameController } = useGameStore.getState();
  const { selectedMapIndex, maps } = usePlayerStore.getState();
  gameController?.pauseGame();

  const style = document.createElement("style");

  style.textContent = `
    @keyframes overlayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    #game-over-overlay {
      animation: overlayFadeIn 0.6s ease-out forwards;
    }

    #game-over-message {
      font-size: 10vw;
      max-font-size: 100px;
      color: #e03000;
      text-align: center;
      margin-bottom: 24px;
    }

    #game-over-button {
      background: rgba(255, 255, 255, 0.1);
      font-size: 5vw;
      max-font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      border: 2px solid #ffffff;
      border-radius: 8px;
      cursor: pointer;
      padding: 12px 24px;
      max-width: 90%;
      text-align: center;
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "game-over-overlay";
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
    opacity: "0",
  });

  const message = document.createElement("h1");
  message.id = "game-over-message";
  message.textContent = "Game Over";

  const restartMap = () => {
    overlay.remove();
    style.remove();

    if (maps.length > 0 && selectedMapIndex >= 0 && selectedMapIndex < maps.length) {
      navigate("/game", { state: { map: maps[selectedMapIndex] } });
    }
  };

  const button = document.createElement("button");
  button.id = "game-over-button";
  button.textContent = "Tentar Novamente";
  button.onclick = restartMap;

  overlay.appendChild(message);
  overlay.appendChild(button);
  document.body.appendChild(overlay);
}
