<div className="flex space-x-4 mt-6">
  <a
    href="/register"
    className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-300 transition"
  >
    Get Started
  </a>

  <button
    onClick={async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "demo@househive.ai",
            password: "demo123",
          }),
        });
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
    className="bg-black text-yellow-400 font-bold py-2 px-6 rounded border border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
  >
    Demo Dashboard
  </button>
</div>
