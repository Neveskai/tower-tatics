import { createPortal } from "react-dom";
import { Button } from "../Button";
import { Text } from "../Text";
import css from "./confirm-modal.module.css";

type ConfirmModalProps = {
  title: string;
  cancelText: string;
  submitText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  cancelText,
  submitText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const content = (
    <div className={css.ModalOverlay} onClick={onCancel}>
      <div className={css.Modal} onClick={(e) => e.stopPropagation()}>
        <Text size={20}>{title}</Text>

        <div className={css.ModalButtons}>
          <Button kind="warning" onClick={onCancel} fullWidth>
            {cancelText}
          </Button>

          <Button onClick={onConfirm} fullWidth>
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
