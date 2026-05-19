import { useNavigate } from "react-router-dom";

const scenes = [
  {
    emoji: "🛒",
    label: "Smart Checkout",
    desc: "Fast & seamless billing at every till",
    color: "bg-green-50",
    border: "border-green-100",
  },
  {
    emoji: "📱",
    label: "MPesa Payments",
    desc: "Accept mobile money instantly",
    color: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    emoji: "🧾",
    label: "Instant Receipts",
    desc: "Printed or digital receipts on the go",
    color: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    emoji: "📦",
    label: "Inventory Control",
    desc: "Track stock levels in real-time",
    color: "bg-purple-50",
    border: "border-purple-100",
  },
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb]">

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .float { animation: floatUp 3s ease-in-out infinite; }
        .float-delay-1 { animation: floatUp 3s ease-in-out 0.5s infinite; }
        .float-delay-2 { animation: floatUp 3s ease-in-out 1s infinite; }
        .float-delay-3 { animation: floatUp 3s ease-in-out 1.5s infinite; }
        .fade-in { animation: fadeSlideIn 0.8s ease-out forwards; }
        .pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
      `}</style>

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-lg pulse-soft">
              🛒
            </div>
            <span className="font-bold text-gray-800 text-base">
              ABIHUB <span className="text-green-600">Mini</span> Farm
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
          >
            Staff Login
          </button>
        </div>
      </nav>

      {/* ANNOUNCEMENT STRIP */}
      <div className="bg-green-600 text-white text-center py-2 text-xs tracking-wide font-medium">
        🎉 Now accepting MPesa & Cash payments at all tills!
      </div>

      {/* HERO */}
      <div className="bg-white py-16 px-6 text-center border-b border-gray-100 fade-in">

        {/* Animated Shopping Scene */}
        <div className="flex justify-center items-end gap-6 mb-8 h-20">
          <span className="text-5xl float" title="Shopping">🧑‍🛒</span>
          <span className="text-4xl float-delay-1" title="Cart">🛒</span>
          <span className="text-5xl float-delay-2" title="Payment">💳</span>
          <span className="text-4xl float-delay-3" title="Receipt">🧾</span>
          <span className="text-5xl float" title="Store">🏪</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Your Neighbourhood{" "}
          <span className="text-green-600">Supermarket</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-7">
          Powered by a smart POS — fast checkouts, live inventory & instant receipts.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-green-700 transition shadow-md"
        >
          Open POS Dashboard →
        </button>
      </div>

      {/* FEATURE SCENE CARDS */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-center text-lg font-bold text-gray-600 mb-8">
            Everything you need to run your store 🏬
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scenes.map((scene, index) => (
              <div
                key={index}
                className={`${scene.color} border ${scene.border} rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-all duration-300`}
              >
                <span
                  className="text-5xl"
                  style={{
                    animation: `floatUp 3s ease-in-out ${index * 0.4}s infinite`,
                  }}
                >
                  {scene.emoji}
                </span>
                <p className="font-bold text-gray-700 text-sm">{scene.label}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{scene.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-xs">
        © 2026 ABIHUB Mini Farm &nbsp;•&nbsp; Built with ❤️ for smart retail
      </footer>

    </div>
  );
}

export default Landing;