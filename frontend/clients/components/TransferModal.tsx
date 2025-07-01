import React from "react";
import { Dialog } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  qrUrl: string;
};

export default function TransferModal({
  isOpen,
  onClose,
  onConfirm,
  qrUrl,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-xl shadow-xl p-6 z-10 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Quét mã để chuyển khoản</h2>
        <img src={qrUrl} alt="QR Code" className="w-full rounded-lg mb-4" />
        <button
          onClick={onConfirm}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Tôi đã chuyển khoản
        </button>
      </div>
    </Dialog>
  );
}
