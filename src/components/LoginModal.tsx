import { useState } from "react";
import { X, ChevronLeft, AlertCircle, Shield, User } from "lucide-react";
import { REGIONS } from "@/data";
import type { AuthUser, UserRole } from "@/types";

const STARTING_WALLET = 5000;

export default function LoginModal({
  onClose,
  onLogin,
  initialMode = "login",
}: {
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  initialMode?: "login" | "register";
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [isFreeAgent, setIsFreeAgent] = useState(false);
  const [club, setClub] = useState("");
  const [region, setRegion] = useState(REGIONS[0]);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mode] = useState<"login" | "register">(initialMode);

  const validateEmail = (value: string): string => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return "";
    if (trimmed.length < 6) return "يجب ألا يقل البريد الإلكتروني عن 6 أحرف";
    if (trimmed.length > 254) return "يجب ألا يزيد البريد الإلكتروني عن 254 حرفاً";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(trimmed)) return "يرجى إدخال بريد إلكتروني صحيح";
    return "";
  };

  const emailValid = validateEmail(email) === "";
  const canStep1 = emailValid && password.trim().length >= 4;
  const canStep2 =
    name.trim().length >= 2 &&
    role !== "" &&
    (role === "president" ? club.trim().length >= 2 : isFreeAgent || club.trim().length >= 2);

  const handleSubmit = () => {
    if (!canStep2) return;
    onLogin({
      name: name.trim(),
      email: email.trim(),
      club: role === "president" ? club.trim() : isFreeAgent ? "لاعب حر" : club.trim(),
      region,
      role: role as UserRole,
      isFreeAgent: role === "player" ? isFreeAgent : false,
      joinStatus: role === "player" && !isFreeAgent ? "pending" : "approved",
      wallet: STARTING_WALLET,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-200 transition-colors">
          <X size={18} />
        </button>

        {step === 1 && (
          <>
            <h2 className="text-lg font-extrabold text-white mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>
              {mode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول / حساب جديد"}
            </h2>
            <p className="text-xs text-slate-400 mb-5">الخطوة 1 من 2 — بيانات الحساب</p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-slate-400 mb-1 block">البريد الإلكتروني</span>
                <input
                  type="email"
                  value={email}
                  maxLength={254}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                  onBlur={() => {
                    setEmailTouched(true);
                    setEmailError(validateEmail(email));
                  }}
                  placeholder="example@email.com"
                  className={`w-full bg-slate-800/60 border rounded-lg px-3 py-2 text-sm text-slate-100 outline-none transition-colors ${
                    emailTouched && emailError ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-cyan-500"
                  }`}
                />
                {emailTouched && emailError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-400">
                    <AlertCircle size={12} />
                    <span className="text-xs">{emailError}</span>
                  </div>
                )}
              </label>
              <label className="block">
                <span className="text-xs text-slate-400 mb-1 block">كلمة المرور</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
            </div>

            <button
              disabled={!canStep1}
              onClick={() => {
                setEmailTouched(true);
                const err = validateEmail(email);
                setEmailError(err);
                if (!err && password.trim().length >= 4) setStep(2);
              }}
              className={`w-full mt-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                canStep1 ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              التالي
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-3">
              <ChevronLeft size={14} />
              رجوع
            </button>

            <h2 className="text-lg font-extrabold text-white mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>
              ملف المستخدم
            </h2>
            <p className="text-xs text-slate-400 mb-5">الخطوة 2 من 2 — أكمل ملفك الشخصي</p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-slate-400 mb-1 block">الاسم</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: Faisal_10"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>

              <div>
                <span className="text-xs text-slate-400 mb-2 block">اختر دورك</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setRole("president"); setIsFreeAgent(false); setClub(""); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-colors ${
                      role === "president" ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/60 hover:border-slate-600"
                    }`}
                  >
                    <Shield size={20} className={role === "president" ? "text-blue-400" : "text-slate-500"} />
                    <span className={`text-xs font-bold ${role === "president" ? "text-blue-300" : "text-slate-400"}`}>رئيس نادي</span>
                  </button>
                  <button
                    onClick={() => setRole("player")}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-colors ${
                      role === "player" ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 bg-slate-800/60 hover:border-slate-600"
                    }`}
                  >
                    <User size={20} className={role === "player" ? "text-cyan-400" : "text-slate-500"} />
                    <span className={`text-xs font-bold ${role === "player" ? "text-cyan-300" : "text-slate-400"}`}>لاعب</span>
                  </button>
                </div>
              </div>

              {role === "player" && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFreeAgent}
                    onChange={(e) => { setIsFreeAgent(e.target.checked); if (e.target.checked) setClub(""); }}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <span className="text-xs text-slate-300">لاعب حر (Free Agent)</span>
                </label>
              )}

              {role === "president" ? (
                <label className="block">
                  <span className="text-xs text-slate-400 mb-1 block">اسم النادي (أنت المشرف)</span>
                  <input
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    placeholder="مثال: نسور الرياض"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                </label>
              ) : role === "player" && !isFreeAgent ? (
                <label className="block">
                  <span className="text-xs text-slate-400 mb-1 block">النادي المترشح له</span>
                  <input
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    placeholder="مثال: نسور الرياض"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-amber-400/80 mt-1">ستكون حالة انضمامك: بانتظار موافقة رئيس النادي</p>
                </label>
              ) : null}

              <label className="block">
                <span className="text-xs text-slate-400 mb-1 block">المنطقة</span>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>

            <button
              disabled={!canStep2}
              onClick={handleSubmit}
              className={`w-full mt-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                canStep2 ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              دخول
            </button>
          </>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-5">
          <div className={`h-1.5 rounded-full transition-colors ${step === 1 ? "w-6 bg-cyan-400" : "w-6 bg-slate-700"}`} />
          <div className={`h-1.5 rounded-full transition-colors ${step === 2 ? "w-6 bg-cyan-400" : "w-6 bg-slate-700"}`} />
        </div>
      </div>
    </div>
  );
}
