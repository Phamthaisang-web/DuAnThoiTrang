import { useState, useCallback } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => {});

  const confirm = useCallback(
    (message: string, title = "Xác nhận hành động") => {
      return new Promise<boolean>((res) => {
        setMessage(message);
        setTitle(title);
        setResolve(() => res);
        setOpen(true);
      });
    },
    []
  );

  const onConfirm = () => {
    setOpen(false);
    resolve(true);
  };

  const onCancel = () => {
    setOpen(false);
    resolve(false);
  };

  const ConfirmDialogUI = () => (
    <ConfirmDialog
      open={open}
      message={message}
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );

  return {
    confirm,
    ConfirmDialogUI,
  };
};
