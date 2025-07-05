"use client";

import { Dialog } from "@headlessui/react";
import { Fragment } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Xác nhận hành động",
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Dialog.Panel className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600">
            {message}
          </Dialog.Description>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Đồng ý
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
