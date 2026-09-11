import { Info, MapPin, Sparkles, ChevronRight, Award, History, Bike, Store } from 'lucide-react';

interface HeroProps {
  onHistoryClick: () => void;
}

export default function Hero({ onHistoryClick }: HeroProps) {
  return (
    <section className="relative w-full bg-gradient-to-b from-brand-low to-brand-bg overflow-hidden pt-36 pb-6">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Condiments / Quick Info Bar */}
      <div className="w-full bg-brand-low/50 border-b border-brand-highest/20 py-3 mb-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-brand-text-secondary text-xs text-center md:text-left">
            <Info size={16} className="text-brand-secondary shrink-0" />
            <span>
              <strong className="text-brand-text-primary font-semibold">Dica:</strong> Caso queira receber mostarda, ketchup e guardanapo, informe na observação final do seu pedido.
            </span>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 bg-brand-highest/30 px-3 py-1 rounded-full text-[11px] font-semibold text-brand-tertiary">
              <Bike size={13} className="text-brand-tertiary" />
              <span>Entrega: <strong className="text-brand-text-primary">40-45 min</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-highest/30 px-3 py-1 rounded-full text-[11px] font-semibold text-brand-secondary">
              <Store size={13} className="text-brand-secondary" />
              <span>Retirada: <strong className="text-brand-text-primary">40-45 min</strong></span>
            </div>
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-1 text-brand-primary hover:text-brand-primary-hover text-[11px] font-bold underline underline-offset-4 transition-colors"
            >
              <History size={12} />
              <span>Repetir Pedido Anterior</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 pt-4 pb-4">
        <div className="max-w-2xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-brand-primary/20 text-brand-primary-light px-3.5 py-1 rounded-full font-display text-[10px] font-extrabold uppercase tracking-widest border border-brand-primary/20">
            <Sparkles size={11} className="text-brand-primary" />
            FOGO DE CHÃO & BRASA LITORÂNEA
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-text-primary tracking-tight leading-tight">
            Hambúrgueres Artesanais <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary-light">
              com Alma de Fogo & Mar
            </span>
          </h1>
          <p className="font-body text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-xl">
            Carnes nobres com blend exclusivo 100% Angus, pães artesanais tostados no ponto certo e molhos autorais preparados diariamente na paradisíaca São Sebastião.
          </p>
        </div>

        {/* Right side container: Large Original Logo Emblem & Badge */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 items-center lg:items-end shrink-0 w-full lg:w-auto">
          {/* Large Original Logo Emblem */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-brand-highest bg-black relative shadow-[0_0_32px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-300 flex items-center justify-center group shrink-0">
            <img 
              src="/webapp_logomarca_256.png" 
              alt="Logo Cabral Burguer Original" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="w-full h-full object-cover absolute inset-0 z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 via-transparent to-brand-secondary/10 mix-blend-overlay z-20 pointer-events-none"></div>
            {/* Fallback back layer icon */}
            <div className="text-center space-y-1 relative z-0">
              <span className="font-display font-extrabold text-lg text-brand-text-primary block leading-none">CABRAL</span>
              <span className="font-body text-[8px] tracking-widest text-brand-primary block">BURGUER</span>
            </div>
          </div>

          {/* Quick Delivery Badge Card */}
          <div className="bg-brand-low/90 backdrop-blur-md p-5 rounded-2xl border border-brand-highest/40 shadow-2xl flex items-center gap-4 max-w-sm w-full">
            <div className="w-12 h-12 rounded-xl bg-brand-tertiary/15 border border-brand-tertiary/20 flex items-center justify-center text-brand-tertiary shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0">
              <Award size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-brand-text-primary">São Sebastião & Região</span>
              <span className="font-body text-xs text-brand-text-muted mt-0.5">Entrega expressa mantendo textura e temperatura</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
