export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">
      <h1 className="text-4xl md:text-6xl font-bold text-[#FFB400] mb-6 text-center">
        Welcome to HouseHive.ai
      </h1>

      <p className="text-gray-300 text-lg text-center max-w-2xl mb-10">
        Your AI-powered property assistant — manage rentals, guests, and
        maintenance with ease.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/register"
          className="bg-[#FFB400] text-black font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition"
        >
          Get Started
        </a>

        <button
          onClick={async () => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: "demo@househive.ai",
                    password: "demo123",
                  }),
                }
              );
              const data = await res.json();
              if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/dashboard";
              } else {
                alert("Demo account unavailable right now.");
              }
            } catch (err) {
              alert("Error connecting to demo account.");
            }
          }}
          className="bg-black text-[#FFB400] font-bold py-3 px-6 rounded-xl border border-[#FFB400] hover:bg-[#FFB400] hover:text-black transition"
        >
          Demo Dashboard
        </button>
      </div>

      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} HouseHive.ai — AI-Powered Property Assistant
      </footer>
    </div>
  );
}
