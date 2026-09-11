import React from 'react';
import { X, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUpsellItem: (product: Product) => void;
  addedItemName: string;
}

const UPSELL_OPTIONS: Product[] = [
  {
    id: 'p3',
    title: 'Batata Tradicional (150g)',
    description: 'Fritas tradicionais super crocantes salpicadas com sal de especiarias.',
    price: 12.90,
    image: 'https://cabralburguer.deeliv.app/uploads/modules/itens/67479_foto_mini.jpg?cfc=20260909200000',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p6',
    title: 'Onion Rings (10 unid)',
    description: 'Anéis de cebola selecionados e empanados super crocantes.',
    price: 16.90,
    image: 'https://cabralburguer.deeliv.app/uploads/modules/itens/90710_foto_mini.jpg?cfc=20260909200000',
    category: 'porcoes',
    available: true
  },
  {
    id: 'b6',
    title: 'Refrigerante Lata (350ml)',
    description: 'Coca-cola, Guaraná Antarctica ou Fanta lata gelados de 350ml.',
    price: 7.50,
    image: 'https://cabralburguer.deeliv.app/uploads/modules/itens/67501_foto_mini.png?cfc=20260909200000',
    category: 'bebidas',
    available: true
  }
];

export default function UpsellModal({ isOpen, onClose, onAddUpsellItem, addedItemName }: UpsellModalProps) {
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleAdd = (item: Product) => {
    onAddUpsellItem(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-brand-container border border-brand-highest/45 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary"></div>

        {/* Header */}
        <div className="p-5 pb-3 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary-light px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-brand-primary/15">
              <Sparkles size={10} />
              <span>Acompanhamento Especial</span>
            </div>
            <h3 className="font-display font-black text-lg text-brand-text-primary tracking-tight leading-snug">
              Companhia Perfeita para seu {addedItemName}!
            </h3>
            <p className="font-body text-xs text-brand-text-muted">
              Que tal aproveitar para adicionar uma bebida gelada ou batatinha por um preço especial?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-high p-1.5 rounded-xl transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 pt-1 space-y-3.5 max-h-[360px] overflow-y-auto no-scrollbar">
          {UPSELL_OPTIONS.map((item) => {
            const isAdded = addedIds[item.id];
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex gap-3.5 items-center bg-brand-bg ${
                  isAdded 
                    ? 'border-brand-primary/50 bg-brand-primary/5' 
                    : 'border-brand-highest/30 hover:border-brand-highest/60'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-brand-high overflow-hidden shrink-0 border border-brand-highest/30 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-extrabold text-xs text-brand-text-primary truncate">
                    {item.title}
                  </h4>
                  <p className="font-body text-[10px] text-brand-text-muted leading-relaxed mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="font-display font-black text-xs text-brand-secondary mt-1 block">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Quick Add CTA */}
                <button
                  disabled={isAdded}
                  onClick={() => handleAdd(item)}
                  className={`h-9 px-3 rounded-xl font-body text-[11px] font-extrabold transition-all flex items-center gap-1.5 ${
                    isAdded
                      ? 'bg-brand-tertiary/10 text-brand-tertiary border border-brand-tertiary/20'
                      : 'bg-brand-primary hover:bg-brand-primary-hover text-brand-bg hover:scale-105 cursor-pointer shadow-md'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={12} strokeWidth={3} />
                      <span>Adicionado</span>
                    </>
                  ) : (
                    <>
                      <Plus size={12} strokeWidth={3} />
                      <span>Adicionar</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-brand-low border-t border-brand-highest/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-brand-highest/40 hover:border-brand-highest text-brand-text-secondary hover:text-brand-text-primary py-2.5 rounded-xl font-body text-xs font-bold transition-all text-center cursor-pointer"
          >
            Não, obrigado
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-brand-bg py-2.5 rounded-xl font-body text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.01] cursor-pointer"
          >
            <span>Ver Minha Sacola</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>
    </div>
  );
}
