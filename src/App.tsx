import { useState } from "react";
import { useGoogleFonts } from "@/hooks/useGoogleFonts";
import Navbar from "@/components/Navbar";
import CalculatorPage from "@/components/CalculatorPage";
import TournamentsPage from "@/components/TournamentsPage";
import ChatPage from "@/components/ChatPage";
import MarketPage from "@/components/MarketPage";
import LoginModal from "@/components/LoginModal";
import WelcomeModal from "@/components/WelcomeModal";
import ClubSettingsModal from "@/components/ClubSettingsModal";
import ConsentBanner from "@/components/ConsentBanner";
import Footer from "@/components/Footer";
import LegalModal from "@/components/LegalModal";
import type { LegalPage } from "@/components/LegalModal";
import type { TabId, AuthUser } from "@/types";

export default function App() {
  useGoogleFonts();
  const [tab, setTab] = useState<TabId>("calculator");
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [clubSettingsOpen, setClubSettingsOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);

  const handleLogin = (data: AuthUser) => { setAuth(data); setLoginOpen(false); setWelcomeOpen(false); };
  const handleLogout = () => { setAuth(null); setWelcomeOpen(true); };
  const openLegal = (page: LegalPage) => setLegalPage(page);

  const handleWelcomeSelect = (action: "login" | "register" | "guest") => {
    setWelcomeOpen(false);
    if (action === "login") { setLoginMode("login"); setLoginOpen(true); }
    else if (action === "register") { setLoginMode("register"); setLoginOpen(true); }
  };

  const handleRequireLogin = () => { setLoginMode("login"); setLoginOpen(true); };

  const handleClubSettingsSave = (updates: Partial<AuthUser>) => {
    if (!auth) return;
    setAuth({ ...auth, ...updates });
  };

  return (
    <div dir="rtl" className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col" style={{ fontFamily: "Tajawal, sans-serif" }}>
      <Navbar
        active={tab}
        onChange={setTab}
        auth={auth}
        onOpenLogin={() => { setLoginMode("login"); setLoginOpen(true); }}
        onLogout={handleLogout}
        onOpenClubSettings={() => setClubSettingsOpen(true)}
      />

      <div className="flex-1 px-4 py-8 sm:px-8">
        {tab === "calculator" && <CalculatorPage />}
        {tab === "tournaments" && <TournamentsPage />}
        {tab === "chat" && <ChatPage auth={auth} onRequireLogin={handleRequireLogin} />}
        {tab === "market" && <MarketPage auth={auth} onRequireLogin={handleRequireLogin} />}
      </div>

      <Footer onOpenLegal={openLegal} />

      {welcomeOpen && !auth && (
        <WelcomeModal onClose={() => setWelcomeOpen(false)} onSelect={handleWelcomeSelect} />
      )}
      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} onLogin={handleLogin} initialMode={loginMode} />
      )}
      {clubSettingsOpen && auth && auth.role === "president" && (
        <ClubSettingsModal auth={auth} onClose={() => setClubSettingsOpen(false)} onSave={handleClubSettingsSave} />
      )}
      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
      <ConsentBanner onOpenLegal={openLegal} />
    </div>
  );
}
