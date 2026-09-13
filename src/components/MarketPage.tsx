import { useState, useEffect } from "react";
import { Repeat, Clock, TrendingUp, Search, Wallet, Lock, ArrowRightLeft } from "lucide-react";
import type { AuthUser } from "@/types";

const MERCATO_DAYS = [4, 5, 6]; // Thursday=4, Friday=5, Saturday=6

function isMercatoOpen(): boolean {
  const day = new Date().getDay();
  return MERCATO_DAYS.includes(day);
}

function getNextMercatoOpen(): Date {
  const now = new Date();
  const day = now.getDay();
  const openDate = new Date(now);

  if (day >= 4 && day <= 6) {
    return openDate;
  }

  const daysUntilThursday = (4 - day + 7) % 7 || 7;
  openDate.setDate(now.getDate() + daysUntilThursday);
  openDate.setHours(0, 0, 0, 0);
  return openDate;
}

function getNextMercatoClose(): Date {
  const now = new Date();
  const day = now.getDay();
  if (day >= 4 && day <= 6) {
    const closeDate = new Date(now);
    const daysUntilSunday = (7 - day) % 7 || 7;
    closeDate.setDate(now.getDate() + daysUntilSunday);
    closeDate.setHours(0, 0, 0, 0);
    return closeDate;
  }
  return getNextMercatoOpen();
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tabular-nums" style={{ fontFamily: "Cairo, sans-serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[11px] text-slate-500 font-bold mt-2">{label}</span>
    </div>
  );
}

type Listing = {
  id: number;
  player: string;
  club: string;
  position: string;
  overall: number;
  price: number;
};

const SAMPLE_LISTINGS: Listing[] = [
  { id: 1, player: "Faisal_10", club: "نسور الرياض", position: "مهاجم", overall: 88, price: 1500 },
  { id: 2, player: "Khalid_7", club: "أمجاد جدة", position: "جناح", overall: 85, price: 1200 },
  { id: 3, player: "Saud_5", club: "نسور الرياض", position: "قلب دفاع", overall: 82, price: 900 },
  { id: 4, player: "Omar_99", club: "برق الشرقية", position: "حارس مرمى", overall: 90, price: 2000 },
  { id: 5, player: "Nasser_8", club: "أمجاد جدة", position: "وسط ميدان", overall: 87, price: 1400 },
];

export default function MarketPage({ auth, onRequireLogin }: { auth: AuthUser | null; onRequireLogin: () => void }) {
  const open = isMercatoOpen();
  const [target] = useState(() => (open ? getNextMercatoClose() : getNextMercatoOpen()));
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [query, setQuery] = useState("");
  const [offerListing, setOfferListing] = useState<Listing | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const targetLabel = target.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" });

  const filtered = SAMPLE_LISTINGS.filter(
    (l) => !query || l.player.includes(query) || l.club.includes(query) || l.position.includes(query)
  );

  const handleOffer = () => {
    if (!auth) { onRequireLogin(); return; }
    if (auth.role !== "president") { setOfferError("عرض الانتقالات متاح لرؤساء الأندية فقط."); return; }
    const amount = Number(offerAmount);
    if (!amount || amount <= 0) { setOfferError("يرجى إدخال مبلغ صحيح."); return; }
    if (amount > auth.wallet) { setOfferError("رصيدك لا يكفي لتقديم هذا العرض."); return; }
    if (amount < offerListing!.price * 0.5) { setOfferError("العرض منخفض جداً عن قيمة اللاعب."); return; }
    setOfferError("");
    setOfferSuccess(true);
    setTimeout(() => { setOfferSuccess(false); setOfferListing(null); setOfferAmount(""); }, 2500);
  };

  const tryOffer = (listing: Listing) => {
    if (!auth) { onRequireLogin(); return; }
    setOfferListing(listing);
    setOfferAmount("");
    setOfferError("");
    setOfferSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-4 ${open ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900 border-slate-800"}`}>
          <Repeat size={28} className={open ? "text-emerald-400" : "text-slate-500"} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          {open ? "سوق الانتقالات مفتوح الآن" : "سوق الانتقالات مغلق"}
        </h1>
        <p className="text-slate-400 text-sm">
          {open ? "الميركاتو مفتوح من الخميس إلى السبت — يمكنك التداول والبحث الآن." : "يفتح الميركاتو من الخميس إلى السبت — تابع العداد التنازلي."}
        </p>
      </div>

      <div className={`rounded-2xl border bg-slate-900/60 p-6 sm:p-8 mb-6 ${open ? "border-emerald-500/30" : "border-slate-800"}`}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock size={16} className={open ? "text-emerald-400" : "text-cyan-400"} />
          <span className="text-sm font-bold text-slate-300">
            {open ? "الوقت المتبقي لإغلاق الميركاتو" : "الوقت المتبقي لفتح الميركاتو القادم"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <TimeBox value={timeLeft.days} label="أيام" />
          <span className="text-2xl text-slate-700 font-extrabold">:</span>
          <TimeBox value={timeLeft.hours} label="ساعات" />
          <span className="text-2xl text-slate-700 font-extrabold">:</span>
          <TimeBox value={timeLeft.minutes} label="دقائق" />
          <span className="text-2xl text-slate-700 font-extrabold">:</span>
          <TimeBox value={timeLeft.seconds} label="ثواني" />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/70 text-center">
          <p className="text-xs text-slate-500">{open ? "يغلق يوم" : "يفتح يوم"}</p>
          <p className="text-sm font-bold text-slate-200 mt-1">{targetLabel}</p>
        </div>
      </div>

      {open ? (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search size={16} className="text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن لاعب أو نادي أو مركز..."
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-8">
                  <Search size={24} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-300">لا توجد نتائج مطابقة</p>
                </div>
              ) : (
                filtered.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-300 font-extrabold text-sm">
                        {l.overall}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">{l.player}</p>
                        <p className="text-xs text-slate-500">{l.club} · {l.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                        <Wallet size={14} />
                        {l.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => tryOffer(l)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        <ArrowRightLeft size={13} /> تقديم عرض
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {offerListing && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setOfferListing(null)}>
              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 relative">
                <h2 className="text-lg font-extrabold text-white mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                  تقديم عرض لـ {offerListing.player}
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                  {offerListing.club} · {offerListing.position} · تقييم {offerListing.overall} · القيمة التقديرية {offerListing.price.toLocaleString()}
                </p>

                {offerSuccess ? (
                  <div className="text-center py-6">
                    <TrendingUp size={32} className="mx-auto text-emerald-400 mb-3" />
                    <p className="text-sm font-bold text-emerald-300">تم تقديم عرضك بنجاح!</p>
                    <p className="text-xs text-slate-500 mt-1">سيتم إشعارك برد النادي المالك.</p>
                  </div>
                ) : (
                  <>
                    <label className="block mb-4">
                      <span className="text-xs text-slate-400 mb-1 block">مبلغ العرض</span>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder={`${offerListing.price.toLocaleString()}`}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                      />
                    </label>
                    {offerError && (
                      <p className="text-xs text-red-400 mb-3">{offerError}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Wallet size={13} /> رصيدك الحالي: {auth?.wallet.toLocaleString() || 0}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOfferListing(null)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleOffer}
                        className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        تأكيد العرض
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <Lock size={28} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">سوق الانتقالات مغلق حالياً</p>
          <p className="text-xs text-slate-500 mt-1">عند فتح الميركاتو ستتمكن من التداول بين الأندية مع نظام محفظة افتراضية.</p>
        </div>
      )}
    </div>
  );
}
