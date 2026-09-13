import { User, LogOut, Wallet, Settings, Shield } from "lucide-react";
import { TABS } from "@/data";
import type { TabId, AuthUser } from "@/types";

export default function Navbar({
  active, onChange, auth, onOpenLogin, onLogout, onOpenClubSettings,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
  auth: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenClubSettings?: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-slate-950 font-extrabold text-sm">S</div>
          <span className="font-extrabold text-white tracking-tight" style={{ fontFamily: "Cairo, sans-serif" }}>CLUBSA</span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => onChange(t.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
                active === t.id ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {auth ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Wallet size={13} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300 tabular-nums">{auth.wallet.toLocaleString()}</span>
            </div>

            {auth.role === "president" && (
              <button
                onClick={onOpenClubSettings}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                title="إعدادات النادي"
              >
                <Settings size={16} />
              </button>
            )}

            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs font-bold text-slate-100">{auth.name}</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                {auth.role === "president" && <Shield size={9} className="text-blue-400" />}
                {auth.club}
                {auth.joinStatus === "pending" && " · بانتظار الموافقة"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User size={15} />
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-red-400" title="تسجيل الخروج">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenLogin}
            className="px-3.5 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            تسجيل الدخول / حساب جديد
          </button>
        )}
      </div>

      <div className="sm:hidden flex overflow-x-auto gap-1 px-4 pb-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              active === t.id ? "bg-slate-800 text-white" : "text-slate-400"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {auth && (
        <div className="sm:hidden flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Wallet size={13} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tabular-nums">{auth.wallet.toLocaleString()}</span>
          </div>
          <span className="text-xs text-slate-500">{auth.name} · {auth.club}</span>
        </div>
      )}
    </div>
  );
}
