import { Plus, Flame, Award, HelpCircle } from 'lucide-react';
import { Combo } from '../types';

interface ComboCardProps {
  key?: string | number;
  combo: Combo;
  onAdd: (combo: Combo) => void;
}

export default function ComboCard({ combo, onAdd }: ComboCardProps) {
  return (
    <div className="bg-brand-low/90 rounded-2xl p-4 flex flex-col justify-between border border-brand-highest/40 shadow-lg hover:bg-brand-low transition-all duration-300">
      <div className="flex gap-4 items-start flex-col sm:flex-row">
        {/* Combo Image */}
        <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl bg-brand-high shrink-0 overflow-hidden border border-brand-highest/30 shadow-inner relative">
          <img
            src={combo.image}
            alt={combo.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-brand-bg/80 backdrop-blur-sm p-1 rounded-lg">
            <Flame size={12} className="text-brand-primary" />
          </div>
        </div>

        {/* Combo Meta */}
        <div className="flex flex-col flex-1">
          {combo.badge && (
            <span className="font-display text-[9px] font-extrabold text-brand-primary uppercase tracking-widest leading-none mb-1">
              {combo.badge}
            </span>
          )}
          <h3 className="font-display font-bold text-sm sm:text-base text-brand-text-primary leading-snug">
            {combo.title}
          </h3>
          <p className="font-body text-xs text-brand-text-secondary mt-1 leading-relaxed line-clamp-3">
            {combo.description}
          </p>
          <span className="font-display font-extrabold text-lg text-brand-secondary mt-2">
            R$ {combo.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Button to Purchase Combo */}
      <div className="mt-4 pt-3 border-t border-brand-highest/15 flex justify-end">
        <button
          onClick={() => onAdd(combo)}
          className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg py-2.5 rounded-xl font-body text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/10"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Adicionar Combo</span>
        </button>
      </div>
    </div>
  );
}
