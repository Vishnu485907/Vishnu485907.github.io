import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import CredfixLogo from "@/components/CredfixLogo";
import { isPreviewBuild } from "@/lib/runtime";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  if (!kimiAuthUrl || !appID) {
    return "";
  }
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

type AuthMode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreviewBuild) {
      setError("Sign in is disabled in this preview deployment.");
      return;
    }
    setError("");
    if (!loginForm.username || !loginForm.password) {
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreviewBuild) {
      setError("Registration is disabled in this preview deployment.");
      return;
    }
    setError("");
    if (
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    registerMutation.mutate(registerForm);
  };

  return (
    <div className="min-h-screen bg-[#ededed] flex items-center justify-center p-4 font-primary">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-pitch-black mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 sm:p-8">
          {/* Logo */}
          <div className="mb-6">
            <CredfixLogo className="h-9" />
          </div>

          <h1 className="text-2xl font-semibold text-pitch-black mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            {mode === "login"
              ? "Sign in to access your financial dashboard"
              : "Get started with your financial planning journey"}
          </p>

          {isPreviewBuild && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-700">
                Authentication is disabled in this GitHub Pages preview. Use the
                live app deployment with backend environment variables to enable
                login and registration.
              </p>
            </div>
          )}

          {/* OAuth */}
          <button
            onClick={() => {
              if (isPreviewBuild) return;
              const url = getOAuthUrl();
              if (url) {
                window.location.href = url;
              }
            }}
            disabled={isPreviewBuild}
            className="w-full flex items-center justify-center gap-2 bg-pitch-black text-white rounded-full py-3 text-sm font-medium hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={16} />
            Sign in with Kimi
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 bg-neutral-100 rounded-full p-1 mb-5">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                mode === "login"
                  ? "bg-white shadow-sm text-pitch-black"
                  : "text-neutral-500"
              }`}
            >
              <LogIn size={14} />
              Login
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                mode === "register"
                  ? "bg-white shadow-sm text-pitch-black"
                  : "text-neutral-500"
              }`}
            >
              <UserPlus size={14} />
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-brand-orange text-white rounded-full py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Username *
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      username: e.target.value,
                    })
                  }
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Email *
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={registerForm.displayName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      displayName: e.target.value,
                    })
                  }
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  placeholder="How should we call you?"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-700 mb-1 block">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all pr-10"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-brand-orange text-white rounded-full py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
