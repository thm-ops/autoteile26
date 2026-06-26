"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validatePassword = (pw: string) => {
    const hasMinLength = pw.length >= 12;
    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);

    return hasMinLength && hasLetter && hasNumber;
  };

  const handleLogin = async (e: React.SubmitEvent,) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    },
    );

    if (result?.error) {
      alert("Login fehlgeschlagen");
      return;
    }

    router.push("/");
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) {
      alert("Passwort muss mindestens 12 Zeichen haben und Zahlen + Buchstaben enthalten");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
    );

    if (!res.ok) {
      alert("Registrierung fehlgeschlagen");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Auto-Login fehlgeschlagen");
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Login
        </h1>

        <p className="text-center text-gray-700 mt-1 mb-6">
          Melde dich in deinem Konto an
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              E-Mail
            </label>

            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="name@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Passwort
            </label>

            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg
                         text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600
                       text-white font-semibold py-2 rounded-lg transition"
          >
            Anmelden
          </button>

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full border border-orange-500 text-orange-600
                       hover:bg-orange-50 font-semibold py-2 rounded-lg transition"
          >
            Registrieren
          </button>

        </form>
      </div>
    </div>
  );
}