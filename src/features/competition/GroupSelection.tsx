import { Group, GroupDisplay } from '@/types';

interface GroupSelectionProps {
  onSelectGroup: (group: Group) => void;
}

export default function GroupSelection({ onSelectGroup }: GroupSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          திருக்குறள் போட்டி
        </h1>
        <p className="text-center text-gray-600 mb-12">
          உங்கள் பிரிவைத் தேர்ந்தெடுக்கவும்
        </p>

        <div className="space-y-4">
          {/* Group II */}
          <button
            onClick={() => onSelectGroup(Group.II)}
            className="w-full p-6 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors text-left"
          >
            <div className="text-2xl font-bold text-blue-700 mb-2">
              {GroupDisplay[Group.II].tamil}
            </div>
            <div className="text-gray-600">
              {GroupDisplay[Group.II].english}
            </div>
          </button>

          {/* Group III */}
          <button
            onClick={() => onSelectGroup(Group.III)}
            className="w-full p-6 bg-white border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors text-left"
          >
            <div className="text-2xl font-bold text-green-700 mb-2">
              {GroupDisplay[Group.III].tamil}
            </div>
            <div className="text-gray-600">
              {GroupDisplay[Group.III].english}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
