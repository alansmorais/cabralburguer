import React, { useState } from 'react';
import { Search, ShoppingBag, User, MapPin, Clock, MessageSquare, Menu, X, Info, Flame, History, Bike } from 'lucide-react';
import { CATEGORIES } from '../data';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onCartClick: () => void;
  onSearchChange: (text: string) => void;
  activeCategory: string;
  onCategorySelect: (id: string) => void;
  onHistoryClick: () => void;
  trackingOrderId?: string | null;
  onTrackClick?: () => void;
}

export default function Header({
  cartCount,
  cartTotal,
  onCartClick,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  onHistoryClick,
  trackingOrderId,
  onTrackClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    onSearchChange(val);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-brand-bg/95 backdrop-blur-xl border-b border-brand-highest/40 shadow-2xl">
      {/* Top Banner */}
      <div className="bg-brand-low px-4 sm:px-6 lg:px-16 py-1.5 flex items-center justify-between text-xs font-semibold text-brand-text-secondary border-b border-brand-highest/20">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-tertiary"></span>
            </span>
            <span className="text-brand-tertiary font-bold tracking-wider uppercase">Aberto Agora</span>
            <span className="text-brand-text-muted hidden sm:inline">(18h30 às 23h45)</span>
          </div>
          <span className="text-brand-text-muted hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-brand-text-muted">
            <MapPin size={13} className="text-brand-primary" />
            <span>Centro • São Sebastião/SP</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-brand-text-muted">
            <Clock size={13} className="text-brand-secondary" />
            <span>Entrega / Retirada: <strong className="text-brand-secondary font-bold">40-45 min</strong></span>
          </div>
          <a
            href="https://wa.me/551221036706"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand-tertiary hover:text-brand-tertiary-light transition-colors"
          >
            <MessageSquare size={13} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-brand-primary/20 flex items-center justify-center bg-black relative shadow-[0_0_16px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-all shrink-0">
              <img 
                src="/webapp_logomarca_256.png" 
                alt="Cabral Burguer" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover absolute inset-0 z-10"
              />
              <Flame size={20} className="text-brand-text-primary relative z-0" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl text-brand-text-primary tracking-tight leading-none group-hover:text-brand-primary transition-colors">
                CABRAL
              </span>
              <span className="font-body text-[10px] font-bold text-brand-primary tracking-[0.2em] uppercase leading-none mt-1">
                Burguer Artesanal
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Buscar burguer na brasa, smash, molhos..."
              className="w-full bg-brand-highest/40 text-brand-text-primary placeholder:text-brand-text-muted text-sm font-body pl-10 pr-4 py-2.5 rounded-xl border border-brand-highest/50 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Controls: Search icon (mobile), Cart, History button, User badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {trackingOrderId && onTrackClick && (
            <button
              onClick={onTrackClick}
              className="flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-primary-light font-bold transition-all bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 px-3.5 py-2 rounded-xl shadow-[0_0_12px_rgba(255,230,0,0.15)] animate-pulse"
            >
              <span className="w-2 h-2 bg-brand-primary rounded-full animate-ping"></span>
              <span>Acompanhar Pedido</span>
            </button>
          )}

          <button
            onClick={onHistoryClick}
            className="hidden sm:flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-primary transition-colors bg-brand-highest/20 hover:bg-brand-highest/40 px-3 py-2 rounded-xl border border-brand-highest/30"
          >
            <History size={13} className="text-brand-text-muted" />
            <span>Histórico</span>
          </button>

          {/* Cart Widget */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-3 bg-brand-highest/50 hover:bg-brand-highest hover:border-brand-primary/40 text-brand-text-primary px-4 py-2 rounded-xl border border-brand-highest/30 hover:border-brand-primary/40 transition-all shadow-md group"
          >
            <div className="relative">
              <ShoppingBag size={20} className="text-brand-primary group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-brand-primary text-brand-bg text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider leading-none">Minha Sacola</span>
              <span className="text-sm font-bold text-brand-secondary mt-0.5 leading-none">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </button>

          {/* Profile Badge */}
          <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary shrink-0 hidden sm:flex">
            <User size={16} />
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-brand-text-primary p-2 hover:bg-brand-highest/50 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <div className="w-full bg-brand-low/95 border-t border-brand-highest/40 overflow-x-auto no-scrollbar">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 sm:gap-8 whitespace-nowrap py-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`text-xs font-semibold py-1 border-b-2 transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'text-brand-primary border-brand-primary font-bold'
                    : 'text-brand-text-secondary border-transparent hover:text-brand-text-primary hover:border-brand-text-muted/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => onCategorySelect('historia')}
              className={`text-xs font-semibold py-1 border-b-2 transition-all cursor-pointer ${
                activeCategory === 'historia'
                  ? 'text-brand-primary border-brand-primary font-bold'
                  : 'text-brand-text-secondary border-transparent hover:text-brand-text-primary hover:border-brand-text-muted/40'
              }`}
            >
              Nossa História
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-bg border-t border-brand-highest/40 p-4 space-y-4 shadow-xl">
          {/* Mobile search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" size={16} />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Buscar no cardápio..."
              className="w-full bg-brand-highest/30 text-brand-text-primary placeholder:text-brand-text-muted text-xs pl-9 pr-4 py-2 rounded-lg border border-brand-highest/40 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {trackingOrderId && onTrackClick && (
              <button
                onClick={() => {
                  onTrackClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-bold text-brand-primary p-2 rounded-lg hover:bg-brand-low transition-all border border-brand-primary/20 animate-pulse"
              >
                <Bike size={14} className="text-brand-primary" />
                <span>Acompanhar Meu Pedido</span>
              </button>
            )}

            <button
              onClick={() => {
                onHistoryClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-brand-text-secondary hover:text-brand-primary p-2 rounded-lg hover:bg-brand-low transition-all"
            >
              <History size={14} className="text-brand-text-secondary" />
              <span>Histórico de Pedidos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
