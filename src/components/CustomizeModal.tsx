import { useState, useEffect } from 'react';
import { X, Check, Flame, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface CustomizeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    ponto: string,
    addedOptions: { name: string; price: number }[],
    removedIngredients: string[]
  ) => void;
}

const OPTIONAL_ADDONS = [
  { name: 'Bacon Extra Crocante', price: 6.00 },
  { name: 'Cheddar Cremoso Extra', price: 5.00 },
  { name: 'Pote Extra Maionese Verde (50ml)', price: 4.00 }
];

const REMOVABLE_INGREDIENTS = [
  'Cebola roxa',
  'Fatias de Tomate',
  'Alface americana',
  'Molho autoral'
];

export default function CustomizeModal({ product, isOpen, onClose, onConfirm }: CustomizeModalProps) {
  if (!isOpen || !product) return null;

  const [ponto, setPonto] = useState('Ao Ponto');
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [livePrice, setLivePrice] = useState(product.price);

  useEffect(() => {
    // Calculate total price
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    setLivePrice(product.price + addonsTotal);
  }, [selectedAddons, product]);

  const handleAddonChange = (addon: { name: string; price: number }) => {
    const exists = selectedAddons.some((a) => a.name === addon.name);
    if (exists) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleRemovalChange = (ingredient: string) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(removedIngredients.filter((i) => i !== ingredient));
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };

  const handleConfirm = () => {
    onConfirm(product, ponto, selectedAddons, removedIngredients);
    // Reset local states
    setPonto('Ao Ponto');
    setSelectedAddons([]);
    setRemovedIngredients([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-high w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-brand-primary/20 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8),0_0_20px_0_rgba(230,81,0,0.18)] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-brand-container flex items-center justify-between border-b border-brand-highest/30">
          <div>
            <span className="font-display text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1">
              <Flame size={10} /> Personalização
            </span>
            <h3 className="font-display font-extrabold text-lg text-brand-text-primary mt-1">
              {product.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text-primary p-2 hover:bg-brand-highest/40 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Customization Options Body */}
        <div className="p-5 space-y-6 overflow-y-auto no-scrollbar">
          {/* Ponto da Carne */}
          <div className="space-y-3">
            <span className="font-display text-xs font-extrabold text-brand-secondary block uppercase tracking-wider">
              1. Escolha o Ponto da Carne
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['Mal Passado', 'Ao Ponto', 'Bem Passado'].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer text-xs font-semibold border transition-all ${
                    ponto === opt
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_12px_rgba(230,81,0,0.1)]'
                      : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                  }`}
                >
                  <input
                    type="radio"
                    name="ponto"
                    value={opt}
                    checked={ponto === opt}
                    onChange={(e) => setPonto(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      ponto === opt ? 'border-brand-primary bg-brand-primary/20' : 'border-brand-text-muted'
                    }`}
                  >
                    {ponto === opt && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>}
                  </div>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Adicionais Extras */}
          <div className="space-y-3">
            <span className="font-display text-xs font-extrabold text-brand-secondary block uppercase tracking-wider">
              2. Adicionais Opcionais
            </span>
            <div className="space-y-2">
              {OPTIONAL_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.name === addon.name);
                return (
                  <label
                    key={addon.name}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAddonChange(addon)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? 'border-brand-primary bg-brand-primary' : 'border-brand-text-muted'
                        }`}
                      >
                        {isSelected && <Check size={11} className="text-brand-text-primary" />}
                      </div>
                      <span className="text-xs font-semibold">{addon.name}</span>
                    </div>
                    <span className="text-brand-secondary text-xs font-extrabold">
                      + R$ {addon.price.toFixed(2).replace('.', ',')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Remover Ingredientes */}
          <div className="space-y-3">
            <span className="font-display text-xs font-extrabold text-brand-text-muted block uppercase tracking-wider">
              3. Deseja remover algum ingrediente?
            </span>
            <div className="grid grid-cols-2 gap-2">
              {REMOVABLE_INGREDIENTS.map((ingredient) => {
                const isRemoved = removedIngredients.includes(ingredient);
                return (
                  <label
                    key={ingredient}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                      isRemoved
                        ? 'bg-brand-high/50 border-brand-text-muted/40 text-brand-text-muted line-through'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isRemoved}
                      onChange={() => handleRemovalChange(ingredient)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isRemoved ? 'border-brand-text-muted bg-brand-container' : 'border-brand-text-muted'
                      }`}
                    >
                      {isRemoved && <Check size={11} className="text-brand-text-muted" />}
                    </div>
                    <span className="text-xs font-semibold">Sem {ingredient}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-brand-low border-t border-brand-highest/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider leading-none">
              Total personalizado:
            </span>
            <span className="font-display font-extrabold text-xl text-brand-secondary mt-1">
              R$ {livePrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            onClick={handleConfirm}
            className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg px-6 py-2.5 rounded-xl font-body text-xs font-bold transition-all shadow-lg hover:shadow-brand-primary/20"
          >
            Confirmar e Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
