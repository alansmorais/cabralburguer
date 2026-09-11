import { Sliders, Plus, Minus, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAdd: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export default function ProductCard({ product, onAdd, onCustomize }: ProductCardProps) {
  const isBurger = product.category === 'hamburgueres';

  // Saborosos badges
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'mais-pedido':
        return 'bg-brand-primary text-brand-bg border border-brand-primary/20 shadow-md shadow-brand-primary/10 font-bold';
      case 'frango-catupiry':
        return 'bg-brand-secondary text-brand-low border border-brand-secondary/20 font-bold';
      case 'linguica':
        return 'bg-brand-tertiary-light/20 text-brand-tertiary-light border border-brand-tertiary-light/35';
      case 'panko':
        return 'bg-amber-700 text-brand-text-primary border border-amber-600/30';
      case 'cheddar':
        return 'bg-yellow-600 text-brand-low border border-yellow-500/30 font-bold';
      case 'duplo':
        return 'bg-orange-800 text-brand-text-primary border border-orange-700/30';
      case 'vegano':
        return 'bg-brand-tertiary text-brand-text-primary border border-brand-tertiary/20';
      case 'chef':
        return 'bg-brand-secondary text-brand-low font-bold shadow-lg';
      default:
        return 'bg-brand-highest text-brand-text-primary';
    }
  };

  return (
    <div
      className={`group bg-brand-low hover:bg-brand-low/80 hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden border border-brand-highest/30 shadow-lg flex flex-col justify-between ${
        !product.available ? 'opacity-55' : ''
      }`}
    >
      {/* Media Cover */}
      <div className="relative w-full h-48 sm:h-52 bg-brand-high overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* linear gradient scrim for overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/85 via-transparent to-transparent"></div>

        {/* Custom Badges */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 font-display text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${getBadgeStyle(
              product.badgeType
            )}`}
          >
            {product.badge}
          </span>
        )}

        {/* Pricing tag floated inside the media layer */}
        <span className="absolute bottom-3 right-3 bg-brand-bg/90 backdrop-blur-md text-brand-secondary font-display text-lg px-2.5 py-0.5 rounded-xl font-extrabold border border-brand-highest/35 shadow-xl">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {/* Description & Interactive Controls */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-base text-brand-text-primary group-hover:text-brand-primary transition-colors leading-tight">
            {product.title}
          </h3>
          <p className="font-body text-xs text-brand-text-secondary mt-1.5 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-brand-highest/20">
          {product.available ? (
            <>
              {isBurger ? (
                <button
                  onClick={() => onCustomize(product)}
                  className="flex-1 bg-brand-highest/30 hover:bg-brand-highest/70 text-brand-text-primary py-2 px-3 rounded-xl font-body text-xs font-semibold border border-brand-highest/40 hover:border-brand-primary/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sliders size={13} className="text-brand-primary" />
                  <span>Personalizar</span>
                </button>
              ) : (
                <div className="flex-1 text-[11px] font-semibold text-brand-text-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-tertiary rounded-full animate-ping"></span>
                  <span>Disponível</span>
                </div>
              )}

              <button
                onClick={() => onAdd(product)}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg p-2.5 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-brand-primary/20 shrink-0 cursor-pointer"
                title="Adicionar à Sacola"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </>
          ) : (
            <div className="w-full bg-brand-highest/10 border border-dashed border-brand-highest/40 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 text-xs text-brand-text-muted font-semibold cursor-not-allowed">
              <AlertTriangle size={13} className="text-brand-primary-light" />
              <span>Esgotado hoje</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
