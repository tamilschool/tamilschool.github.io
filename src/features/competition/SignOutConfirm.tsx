interface SignOutConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SignOutConfirm({ onConfirm, onCancel }: SignOutConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          வெளியேற்றத்தை உறுதிப்படுத்தவும்
        </h2>
        <p className="text-gray-600 mb-6">
          நீங்கள் வெளியேற விரும்புகிறீர்களா? உங்கள் எல்லா மதிப்பெண்களும் நீக்கப்படும்.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
          >
            இல்லை
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
          >
            ஆம், வெளியேறவும்
          </button>
        </div>
      </div>
    </div>
  );
}
