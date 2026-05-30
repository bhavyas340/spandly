import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/roast")({
  component: RoastPage,
  head: () => ({ meta: [{ title: "Spendly — Roast Me" }] }),
});

const ROASTS = [
  "Bhai, itna Swiggy? Ghar pe khana banana seekh le.",
  "Auto pe ₹500? Tu toh Ola ka sabse bada shareholder ban gaya.",
  "Chai pe ₹800 mahine mein? Khud banao yaar.",
  "Tera wallet ro raha hai bhai. Seriously.",
  "Itne subscriptions? Tu sab dekh bhi leta hai kya?",
  "Shopping pe itna? Wardrobe full hai ya aur jagah chahiye?",
  "Bhai savings kab karenge? Retirement mein Maggi khaoge kya?",
];

function pick(prev?: string) {
  let next = ROASTS[Math.floor(Math.random() * ROASTS.length)];
  let tries = 0;
  while (next === prev && tries++ < 5) next = ROASTS[Math.floor(Math.random() * ROASTS.length)];
  return next;
}

function RoastPage() {
  const [roast, setRoast] = useState<string | null>(null);
  const share = () =>
    window.open(
      "https://wa.me/?text=Spandly%20ne%20mujhe%20roast%20kar%20diya%20%F0%9F%94%A5%20Try%20karo%3A%20https%3A%2F%2Fspandly.lovable.app",
      "_blank"
    );

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col px-5 pb-12">
        <div className="flex items-center gap-3 pt-6 pb-4">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[22px] font-bold text-black">🔥 Roast Me</h1>
        </div>

        <div
          className="rounded-[28px] p-6 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
          style={{ background: "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)" }}
        >
          <div className="text-5xl mb-3">🔥</div>
          <div className="text-[22px] font-bold text-black/90">Ready to get roasted?</div>
          <div className="text-[13px] text-black/60 mt-1">We looked at your spending. It's... something.</div>
          <button
            onClick={() => setRoast(pick(roast ?? undefined))}
            className="mt-5 w-full h-12 rounded-full bg-black text-white font-bold text-[15px] shadow-md"
          >
            Roast My Spending 🔥
          </button>
        </div>

        {roast && (
          <>
            <div className="mt-5 rounded-[24px] bg-white p-5 border border-black/5 shadow-sm">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40 mb-2">Roast #{Math.floor(Math.random() * 99) + 1}</div>
              <div className="text-[17px] font-semibold text-black leading-snug">{roast}</div>
            </div>

            <button
              onClick={share}
              className="mt-4 w-full h-12 rounded-full bg-[#25D366] text-white font-bold text-[14px] shadow-md"
            >
              Share to WhatsApp
            </button>
            <button
              onClick={() => setRoast(pick(roast))}
              className="mt-3 w-full h-12 rounded-full bg-white text-black font-bold text-[14px] border border-black/10 shadow-sm"
            >
              Roast Me Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
