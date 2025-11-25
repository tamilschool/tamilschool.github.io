interface SignOutConfirmProps {
  onExit: () => void;
  onRestart: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showRestart?: boolean;
}

export default function SignOutConfirm({
  onExit,
  onRestart,
  onCancel,
  title = "வெளியேற்றத்தை உறுதிப்படுத்தவும்",
  description = "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
  confirmText = "வெளியேறு",
  cancelText = "ரத்து செய்",
  showRestart = true
}: SignOutConfirmProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}thiruvalluvar.jpg`}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <div className="flex flex-row gap-3 justify-end flex-wrap">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
          >
            {cancelText}
          </button>
          {showRestart && (
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              அடுத்த போட்டியாளர்
            </button>
          )}
          <button
            onClick={onExit}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
