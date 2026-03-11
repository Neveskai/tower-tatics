import { useNavigate } from "react-router-dom";
import i18n from "@/common/providers/i18n";
import css from "./play-button.module.css";

export const PlayButton = () => {
  const navigate = useNavigate();

  const onPlayNowClick = () => {
    navigate("/play");
  };

  return (
    <button className={css.playButton} onClick={onPlayNowClick}>
      {i18n.t("playNow")}
    </button>
  );
};
