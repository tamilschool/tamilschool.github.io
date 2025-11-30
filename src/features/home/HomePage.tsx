import { useNavigate } from 'react-router-dom';
import { Group, GroupDisplay } from '@/types';
import { trackModeSelection } from '@/lib/analytics';

export default function HomePage() {
    const navigate = useNavigate();

    const handleSelect = (mode: 'practice' | 'competition', group: Group) => {
        // Track the selection
        trackModeSelection(mode, GroupDisplay[group].english);
        // Navigate to /mode/groupId (e.g., /practice/2)
        navigate(`/${mode}/${group}`);
    };

    return (
        <div className="relative min-h-full flex flex-col items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={`${import.meta.env.BASE_URL}thiruvalluvar.jpg`}
                    alt="Thiruvalluvar"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-lg px-6 py-8 flex flex-col items-center gap-8">
                {/* Title with Glassmorphism */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative px-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
                        <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-white text-center drop-shadow-sm tracking-wide whitespace-nowrap">
                            திருக்குறள் திருவிழா
                        </h1>
                    </div>
                </div>

                <div className="w-full space-y-6">
                    {/* Practice Card */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-l-8 border-purple-600 transform transition-all hover:scale-[1.01]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-100 rounded-full text-3xl">🎯</div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">பயிற்சி</h2>
                                <p className="text-base text-gray-600 font-medium">Practice Mode</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSelect('practice', Group.II)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 shadow-md hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-200 group"
                            >
                                <span className="font-bold text-xl text-purple-800 group-hover:text-purple-900">{GroupDisplay[Group.II].tamil}</span>
                                <span className="text-xs font-semibold text-purple-600/80 mt-1">{GroupDisplay[Group.II].english}</span>
                            </button>
                            <button
                                onClick={() => handleSelect('practice', Group.III)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 shadow-md hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition-all duration-200 group"
                            >
                                <span className="font-bold text-xl text-purple-800 group-hover:text-purple-900">{GroupDisplay[Group.III].tamil}</span>
                                <span className="text-xs font-semibold text-purple-600/80 mt-1">{GroupDisplay[Group.III].english}</span>
                            </button>
                        </div>
                    </div>

                    {/* Competition Card */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-l-8 border-blue-600 transform transition-all hover:scale-[1.01]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 rounded-full text-3xl">🏆</div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">போட்டி</h2>
                                <p className="text-base text-gray-600 font-medium">Competition Mode</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSelect('competition', Group.II)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 shadow-md hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 group"
                            >
                                <span className="font-bold text-xl text-blue-800 group-hover:text-blue-900">{GroupDisplay[Group.II].tamil}</span>
                                <span className="text-xs font-semibold text-blue-600/80 mt-1">{GroupDisplay[Group.II].english}</span>
                            </button>
                            <button
                                onClick={() => handleSelect('competition', Group.III)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 shadow-md hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 group"
                            >
                                <span className="font-bold text-xl text-blue-800 group-hover:text-blue-900">{GroupDisplay[Group.III].tamil}</span>
                                <span className="text-xs font-semibold text-blue-600/80 mt-1">{GroupDisplay[Group.III].english}</span>
                            </button>
                        </div>
                    </div>

                    {/* Old App Button */}
                    <a
                        href={`${import.meta.env.BASE_URL}old/index.html`}
                        className="block w-full group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-md p-4 text-left shadow-xl transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] border border-white/20 border-l-8 border-l-yellow-600"
                    >
                        <div className="relative z-10 flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 rounded-full text-2xl">🕰️</div>
                                <div>
                                    <div className="text-lg font-bold text-slate-800">
                                        பழைய செயலி
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium">
                                        Old Version
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
