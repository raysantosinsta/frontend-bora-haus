// app/admin/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, X } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShake(false);

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    setTimeout(() => {
      if (password === correctPassword) {
        document.cookie =
          "admin-auth=true; path=/; max-age=86400; SameSite=Lax";
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminAuthTime", Date.now().toString());
        router.push("/admin/products");
      } else {
        setError("Senha incorreta. Tente novamente.");
        setPassword("");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* FUNDO — LUZES EM MOVIMENTO RÁPIDO */}
      <div className="absolute inset-0 z-0">
        <div className="light light-1" />
        <div className="light light-2" />
        <div className="light light-3" />
        <div className="light light-4" />
        <div className="light light-5" />

        {/* Vinheta escurecendo as bordas, como na referência */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_55%,rgba(0,0,0,0.97)_100%)]" />
      </div>

      {/* CARD DE LOGIN */}
      <div className="relative z-10 w-full max-w-sm">
        <div
          className={`relative bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-[28px] p-7 shadow-2xl transition-all duration-300 ${
            shake ? "animate-shake" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Fechar"
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-zinc-500 text-xs font-medium mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>ACESSO RESTRITO</span>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Insira sua senha para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-white/[0.06] border border-white/10 focus:border-white/25 rounded-xl px-4 pr-11 py-3.5 text-[15px] text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 focus:bg-white/[0.09]"
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm px-1 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-100 text-black font-medium text-[15px] py-3.5 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verificando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-600 pt-1">
              Conexão criptografada · BORA HAUS © 2026
            </p>
          </form>
        </div>
      </div>

      {/* ESTILOS */}
      <style>{`
        .light {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.6;
          will-change: transform;
        }
        .light-1 {
          top: 10%;
          left: 15%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
          animation: move1 6s ease-in-out infinite;
        }
        .light-2 {
          top: 40%;
          right: 10%;
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, #f97316 0%, transparent 70%);
          animation: move2 7s ease-in-out infinite;
        }
        .light-3 {
          bottom: 5%;
          left: 20%;
          width: 38vw;
          height: 38vw;
          background: radial-gradient(circle, #a3e635 0%, transparent 70%);
          animation: move3 5.5s ease-in-out infinite;
        }
        .light-4 {
          bottom: 15%;
          right: 20%;
          width: 42vw;
          height: 42vw;
          background: radial-gradient(circle, #ec4899 0%, transparent 70%);
          animation: move4 6.5s ease-in-out infinite;
        }
        .light-5 {
          top: 25%;
          left: 45%;
          width: 30vw;
          height: 30vw;
          background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
          animation: move5 5s ease-in-out infinite;
        }
        @keyframes move1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20vw, 10vh) scale(1.2); }
          50% { transform: translate(5vw, 25vh) scale(0.9); }
          75% { transform: translate(-15vw, 5vh) scale(1.1); }
        }
        @keyframes move2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25vw, 15vh) scale(0.85); }
          50% { transform: translate(-10vw, -15vh) scale(1.15); }
          75% { transform: translate(15vw, 10vh) scale(1); }
        }
        @keyframes move3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15vw, -15vh) scale(1.1); }
          50% { transform: translate(30vw, 5vh) scale(0.9); }
          75% { transform: translate(5vw, 15vh) scale(1.05); }
        }
        @keyframes move4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-15vw, -20vh) scale(1.05); }
          50% { transform: translate(-30vw, 0) scale(0.95); }
          75% { transform: translate(-5vw, 15vh) scale(1.1); }
        }
        @keyframes move5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10vw, 20vh) scale(1.15); }
          50% { transform: translate(-20vw, 10vh) scale(0.9); }
          75% { transform: translate(-10vw, -20vh) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .light { animation: none; }
        }
      `}</style>
    </div>
  );
}