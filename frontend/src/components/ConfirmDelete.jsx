import React from "react";

export default function ConfirmDeletePopup({
  open,
  onClose,
  onConfirm,
  password,
  setPassword,
  requiresPassword = true, // default to true
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
        <h2 className="text-lg font-semibold text-[#aa5a44] mb-3">
          Confirm Account Deletion
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          {requiresPassword
            ? "Enter your password to permanently delete your account, posts, and products."
            : "Are you sure you want to permanently delete your account, posts, and products?"}
        </p>

        {requiresPassword && (
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-md mb-4"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
