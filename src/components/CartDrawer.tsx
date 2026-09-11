import { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, CreditCard, MessageSquare, AlertTriangle, Sparkles, Receipt, Bike, Store, QrCode, Coins } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (orderData: any) => Promise<void>;
}

const DELIVERY_NEIGHBORHOODS = [
  { name: 'Centro', fee: 5.00 },
  { name: 'Maresias', fee: 12.00 },
  { name: 'Cambury', fee: 12.00 },
  { name: 'Juquey', fee: 12.00 },
  { name: 'Paúba', fee: 12.00 },
  { name: 'Santiago', fee: 12.00 },
  { name: 'Toque Toque', fee: 12.00 },
  { name: 'Una', fee: 12.00 },
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Checkout states
  const [orderType, setOrderType] = useState<'entrega' | 'retirada'>('entrega');
  const [bairro, setBairro] = useState('Centro');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credito' | 'debito' | 'dinheiro'>('pix');
  const [trocoPara, setTrocoPara] = useState('');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const getDeliveryFee = () => {
    if (orderType === 'retirada') return 0;
    const found = DELIVERY_NEIGHBORHOODS.find((n) => n.name === bairro);
    return found ? found.fee : 5.00;
  };

  const getItemsSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const basePrice = item.product.price;
      const addonsPrice = item.addedOptions.reduce((sum, opt) => sum + opt.price, 0);
      return acc + (basePrice + addonsPrice) * item.quantity;
    }, 0);
  };

  const getPixDiscount = () => {
    if (paymentMethod !== 'pix') return 0;
    // 5% discount on Pix
    return getItemsSubtotal() * 0.05;
  };

  const getTotal = () => {
    return getItemsSubtotal() + getDeliveryFee() - getPixDiscount();
  };

  // Build the WhatsApp formatted link
  const handleCheckoutInternal = async () => {
    if (!clientName.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }

    if (orderType === 'entrega' && (!rua.trim() || !numero.trim())) {
      alert('Por favor, informe o endereço de entrega (Rua e Número).');
      return;
    }

    const orderData = {
      customerName: clientName,
      customerPhone: clientPhone,
      items: cartItems.map(item => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        addedOptions: item.addedOptions,
        removedIngredients: item.removedIngredients,
        ponto: item.ponto
      })),
      total: getTotal(),
      orderType,
      address: orderType === 'entrega' ? `${rua}, ${numero} - ${bairro}` : 'Retirada',
      paymentMethod,
      notes,
      trocoPara: paymentMethod === 'dinheiro' ? trocoPara : null
    };

    try {
      await onCheckout(orderData);
      
      let message = `🍔🔥 *NOVO PEDIDO - CABRAL BURGUER* 🔥🍔\n\n`;
      message += `👤 *Cliente:* ${clientName}\n`;
      if (clientPhone) {
        message += `📞 *Telefone:* ${clientPhone}\n`;
      }
      message += `🛵 *Tipo:* ${orderType === 'entrega' ? '🏍️ Entrega' : '🏪 Retirada no Local'}\n\n`;

      if (orderType === 'entrega') {
        message += `📍 *Endereço de Entrega:*\n`;
        message += `Rua: ${rua}, Nº ${numero}\n`;
        message += `Bairro: ${bairro} - São Sebastião/SP\n\n`;
      }

      message += `📝 *Ítens do Pedido:*\n`;
      cartItems.forEach((item, index) => {
        const addons = item.addedOptions.map((o) => `+ ${o.name}`).join(', ');
        const removals = item.removedIngredients.map((i) => `Sem ${i}`).join(', ');
        message += `${item.quantity}x *${item.product.title}* (R$ ${item.product.price.toFixed(2).replace('.', ',')})\n`;
        if (item.ponto) {
          message += `  • Ponto: ${item.ponto}\n`;
        }
        if (addons) {
          message += `  • Extras: ${addons}\n`;
        }
        if (removals) {
          message += `  • Removido: ${removals}\n`;
        }
        message += `\n`;
      });

      if (notes.trim()) {
        message += `💬 *Observações:* ${notes}\n\n`;
      }

      message += `💳 *Forma de Pagamento:* ${
        paymentMethod === 'pix'
          ? 'Pix (Desconto de 5% Aplicado! 🌟)'
          : paymentMethod === 'credito'
          ? 'Cartão de Crédito'
          : paymentMethod === 'debito'
          ? 'Cartão de Débito'
          : `Dinheiro ${trocoPara ? `(Troco para: R$ ${trocoPara})` : '(Sem troco)'}`
      }\n\n`;

      message += `🧾 *Valores:*\n`;
      message += `Subtotal: R$ ${getItemsSubtotal().toFixed(2).replace('.', ',')}\n`;
      if (orderType === 'entrega') {
        message += `Taxa de Entrega (${bairro}): R$ ${getDeliveryFee().toFixed(2).replace('.', ',')}\n`;
      }
      if (paymentMethod === 'pix') {
        message += `Desconto Pix (5%): - R$ ${getPixDiscount().toFixed(2).replace('.', ',')}\n`;
      }
      message += `*Total Geral: R$ ${getTotal().toFixed(2).replace('.', ',')}*\n\n`;
      message += `💡 _Obrigado pela preferência! Nosso tempo médio é de 40-45 minutos._`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=551221036706&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"></div>

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-md bg-brand-bg h-full shadow-2xl flex flex-col z-10 border-l border-brand-highest/40">
        {/* Drawer Header */}
        <div className="p-4 bg-brand-low border-b border-brand-highest/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-primary" size={20} />
            <h3 className="font-display font-extrabold text-base text-brand-text-primary">Minha Sacola</h3>
            <span className="bg-brand-highest/60 text-brand-text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text-primary p-1.5 hover:bg-brand-highest/40 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-brand-highest/60 bg-black relative flex items-center justify-center shadow-inner shrink-0 grayscale opacity-40">
                <img 
                  src="/webapp_logomarca_256.png" 
                  alt="Cabral Burguer" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <ShoppingBag className="text-brand-text-muted relative z-0" size={24} />
              </div>
              <p className="font-display font-semibold text-sm text-brand-text-secondary">Sua sacola está vazia</p>
              <p className="font-body text-xs text-brand-text-muted max-w-xs">
                Selecione seus burgers favoritos e combos na brasa para iniciar o pedido.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Item Cards */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const itemAddonsPrice = item.addedOptions.reduce((s, o) => s + o.price, 0);
                  const itemUnitPrice = item.product.price + itemAddonsPrice;
                  const itemTotalPrice = itemUnitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-brand-low rounded-xl border border-brand-highest/30 space-y-2.5 hover:border-brand-primary/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-brand-highest/40"
                          />
                          <div>
                            <h4 className="font-display font-bold text-xs text-brand-text-primary">
                              {item.product.title}
                            </h4>
                            <p className="text-brand-secondary text-xs font-semibold mt-0.5">
                              R$ {itemUnitPrice.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>

                        {/* Delete item entirely */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-brand-text-muted hover:text-brand-primary p-1 rounded-lg hover:bg-brand-highest/30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Customizations summary */}
                      {(item.ponto || item.addedOptions.length > 0 || item.removedIngredients.length > 0) && (
                        <div className="bg-brand-bg/50 p-2 rounded-lg text-[10px] space-y-1 text-brand-text-secondary border border-brand-highest/20">
                          {item.ponto && (
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
                              <span>Ponto: <strong className="text-brand-text-primary">{item.ponto}</strong></span>
                            </div>
                          )}
                          {item.addedOptions.map((opt) => (
                            <div key={opt.name} className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-brand-secondary rounded-full"></span>
                                <span>Adicional: {opt.name}</span>
                              </span>
                              <span className="text-brand-text-muted">+ R$ {opt.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                          {item.removedIngredients.map((ing) => (
                            <div key={ing} className="flex items-center gap-1 text-brand-text-muted">
                              <span className="w-1 h-1 bg-red-500/50 rounded-full"></span>
                              <span>Removido: Sem {ing}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quantity Selector & Item Total */}
                      <div className="flex items-center justify-between pt-1 border-t border-brand-highest/15">
                        <div className="flex items-center gap-2 bg-brand-highest/30 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="p-1 hover:bg-brand-highest rounded-md text-brand-text-primary hover:text-brand-primary transition-all"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold text-brand-text-primary px-1">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="p-1 hover:bg-brand-highest rounded-md text-brand-text-primary hover:text-brand-primary transition-all"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="font-display font-extrabold text-xs text-brand-text-primary">
                          R$ {itemTotalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery or Pickup selection */}
              <div className="space-y-3.5 pt-4 border-t border-brand-highest/30">
                <span className="font-display text-xs font-extrabold text-brand-secondary uppercase tracking-wider block">
                  Como deseja receber seu pedido?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('entrega')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'entrega'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <Bike size={18} className="text-brand-primary" />
                    <span>Entrega Expressa</span>
                  </button>
                  <button
                    onClick={() => setOrderType('retirada')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'retirada'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <Store size={18} className="text-brand-primary" />
                    <span>Retirada no Local</span>
                  </button>
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3 pt-4 border-t border-brand-highest/15">
                <span className="font-display text-xs font-extrabold text-brand-text-primary uppercase tracking-wider block">
                  Seus Dados
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu Nome Completo (Obrigatório)"
                    className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary placeholder:text-brand-text-muted p-2.5 rounded-xl focus:outline-none focus:border-brand-primary"
                  />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Seu Celular / WhatsApp"
                    className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary placeholder:text-brand-text-muted p-2.5 rounded-xl focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Delivery Address fields */}
              {orderType === 'entrega' && (
                <div className="space-y-3 pt-4 border-t border-brand-highest/15">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-extrabold text-brand-secondary uppercase tracking-wider">
                      Endereço de Entrega
                    </span>
                    <span className="text-[10px] text-brand-text-muted">São Sebastião/SP</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-brand-text-muted font-bold block mb-1">Bairro de Entrega</label>
                      <select
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary p-2.5 rounded-xl focus:outline-none focus:border-brand-primary font-semibold"
                      >
                        {DELIVERY_NEIGHBORHOODS.map((n) => (
                          <option key={n.name} value={n.name}>
                            {n.name} (Taxa R$ {n.fee.toFixed(2).replace('.', ',')})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-text-muted font-bold block mb-1">Rua / Logradouro</label>
                      <input
                        type="text"
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        placeholder="Ex: Av. Guarda-Mor"
                        className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary placeholder:text-brand-text-muted p-2.5 rounded-xl focus:outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-brand-text-muted font-bold block mb-1">Número</label>
                      <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Ex: 145"
                        className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary placeholder:text-brand-text-muted p-2.5 rounded-xl focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3.5 pt-4 border-t border-brand-highest/15">
                <span className="font-display text-xs font-extrabold text-brand-secondary uppercase tracking-wider block">
                  Forma de Pagamento
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'pix'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <QrCode size={16} className="text-brand-primary" />
                    <span className="flex items-center gap-1">
                      Pix <strong className="text-[10px] text-brand-tertiary">(-5%)</strong>
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('credito')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'credito'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <CreditCard size={16} className="text-brand-primary" />
                    <span>Crédito</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('debito')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'debito'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <CreditCard size={16} className="text-brand-primary" />
                    <span>Débito</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'dinheiro'
                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                        : 'bg-brand-low border-brand-highest/30 text-brand-text-secondary hover:bg-brand-container'
                    }`}
                  >
                    <Coins size={16} className="text-brand-primary" />
                    <span>Dinheiro</span>
                  </button>
                </div>

                {/* Dinheiro conditional cash change */}
                {paymentMethod === 'dinheiro' && (
                  <div className="bg-brand-low p-3 rounded-xl border border-brand-highest/40 space-y-2">
                    <label className="text-[10px] text-brand-text-muted font-bold block">
                      Precisa de troco? Informe para quanto:
                    </label>
                    <input
                      type="text"
                      value={trocoPara}
                      onChange={(e) => setTrocoPara(e.target.value)}
                      placeholder="Ex: R$ 100,00"
                      className="w-full bg-brand-bg border border-brand-highest/40 text-xs text-brand-text-primary p-2 rounded-lg focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                )}
              </div>

              {/* Order Notes / Observacoes */}
              <div className="space-y-2 pt-4 border-t border-brand-highest/15">
                <span className="font-display text-xs font-extrabold text-brand-text-primary uppercase tracking-wider block">
                  Alguma Observação?
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Maionese extra, ponto menos passado, tirar guardanapo..."
                  className="w-full bg-brand-low border border-brand-highest/40 text-xs text-brand-text-primary p-2.5 rounded-xl focus:outline-none focus:border-brand-primary min-h-[60px] no-scrollbar resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer summary */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-brand-low border-t border-brand-highest/40 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-brand-text-secondary">
                <span>Subtotal</span>
                <span>R$ {getItemsSubtotal().toFixed(2).replace('.', ',')}</span>
              </div>
              {orderType === 'entrega' && (
                <div className="flex justify-between text-brand-text-secondary">
                  <span>Taxa de Entrega ({bairro})</span>
                  <span>R$ {getDeliveryFee().toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-brand-tertiary font-bold">
                  <span>Desconto Pix (5%)</span>
                  <span>- R$ {getPixDiscount().toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-brand-text-primary pt-1 border-t border-brand-highest/20">
                <span className="font-display">Total do Pedido</span>
                <span className="text-brand-secondary font-display text-base">
                  R$ {getTotal().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Clear sacola shortcut */}
            <div className="flex justify-end">
              <button
                onClick={onClearCart}
                className="text-[10px] text-brand-text-muted hover:text-red-400 font-semibold uppercase tracking-wider underline cursor-pointer"
              >
                Limpar Sacola
              </button>
            </div>

            {/* Submit checkout button */}
            <button
              onClick={handleCheckoutInternal}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg py-3.5 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-brand-primary/10 hover:scale-[1.01]"
            >
              <MessageSquare size={16} />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
