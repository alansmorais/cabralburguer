import { X, History, ShoppingBag, RotateCcw } from 'lucide-react';
import { HISTORY_ORDERS } from '../data';
import { CartItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepeatOrder: (items: any[]) => void;
}

export default function HistoryModal({ isOpen, onClose, onRepeatOrder }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-high w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 border border-brand-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-highest/35 pb-2">
          <div className="flex items-center gap-2 text-brand-primary">
            <History size={20} />
            <h3 className="font-display font-extrabold text-base text-brand-text-primary">
              Pedidos Recentes
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text-primary p-1.5 hover:bg-brand-highest/20 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Orders list */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
          {HISTORY_ORDERS.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-brand-container rounded-xl border border-brand-highest/30 space-y-3 hover:border-brand-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-brand-text-muted">
                <span>Pedido em {order.date}</span>
                <span className="text-brand-tertiary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-tertiary rounded-full"></span>
                  Entregue
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-display font-bold text-xs text-brand-text-primary group-hover:text-brand-primary transition-colors">
                  {order.itemsSummary}
                </p>
                <div className="text-[10px] text-brand-text-muted font-body">
                  Região: Centro • São Sebastião/SP
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-highest/15">
                <span className="text-brand-secondary font-display font-extrabold text-sm">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={() => {
                    onRepeatOrder(order.items);
                    onClose();
                  }}
                  className="bg-brand-primary/15 hover:bg-brand-primary text-brand-primary hover:text-brand-bg px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Repetir Pedido</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* empty helper info */}
        <p className="text-[10px] text-brand-text-muted text-center leading-relaxed">
          * Os pedidos anteriores são salvos localmente para facilitar suas próximas compras.
        </p>
      </div>
    </div>
  );
}
