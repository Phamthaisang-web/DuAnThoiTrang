"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <p className="text-sm text-gray-600">{message}</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onCancel?.();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onConfirm();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Xác nhận
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
