import Link from "next/link";

export default function Home() {
  return (
    <div className="indexHeader">
      <img src="/og-image.png" alt="HouseHive.ai" className="w-40 mb-6" />
      <h1 className="text-5xl font-bold text-yellow-400 mb-4">HouseHive.ai</h1>
      <p className="text-zinc-300 max-w-lg">
        Your AI-powered property assistant — manage rentals, maintenance, and
        guests all in one place.
      </p>

      <div className="flex space-x-4 mt-8">
        <Link
          href="/register"
          className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-300 transition"
        >
          Get Started
        </Link>

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
                alert("Demo account unavailable.");
              }
            } catch {
              alert("Error connecting to demo account.");
            }
          }}
          className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded hover:bg-yellow-400 hover:text-black transition"
        >
          Demo Dashboard
        </button>
      </div>
    </div>
  );
}
