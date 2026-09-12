import { useState, useEffect } from 'react';
import { AlertTriangle, Palette, Check, Phone } from 'lucide-react';
import { Product, Combo, CartItem } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { PRODUCTS } from '../data';
import Header from './Header';
import Hero from './Hero';
import ProductCard from './ProductCard';
import ComboCard from './ComboCard';
import CustomizeModal from './CustomizeModal';
import HistoryModal from './HistoryModal';
import CartDrawer from './CartDrawer';
import UpsellModal from './UpsellModal';
import OrderTracker from './OrderTracker';
import { safeStorage } from '../lib/storage';

export default function CustomerMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, icon: string}[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeStorage.getItem('cabral_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('hamburgueres');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [upsellParentItemName, setUpsellParentItemName] = useState('');
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(() => {
    return safeStorage.getItem('cabral_tracking_order_id');
  });
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Auto open tracker on load if there's an active tracking ID
  useEffect(() => {
    if (trackingOrderId) {
      setIsTrackerOpen(true);
    }
  }, []);

  // Save/remove active order id to/from localStorage
  useEffect(() => {
    if (trackingOrderId) {
      safeStorage.setItem('cabral_tracking_order_id', trackingOrderId);
    } else {
      safeStorage.removeItem('cabral_tracking_order_id');
    }
  }, [trackingOrderId]);

  // Fetch products and categories from Firebase
  useEffect(() => {
    const qProducts = query(collection(db, 'products'));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const qCategories = query(collection(db, 'categories'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setCategories(cats);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    safeStorage.setItem('cabral_cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const basePrice = item.product.price;
    const addonsPrice = item.addedOptions.reduce((sum, o) => sum + o.price, 0);
    return acc + (basePrice + addonsPrice) * item.quantity;
  }, 0);

  const handleAddProduct = (product: Product | Combo) => {
    const defaultId = `${product.id}-default`;
    const existing = cart.find((item) => item.id === defaultId);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === defaultId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: defaultId,
        product,
        quantity: 1,
        ponto: product.category === 'hamburgueres' ? 'Ao Ponto' : undefined,
        addedOptions: [],
        removedIngredients: [],
      };
      setCart([...cart, newItem]);
    }
    
    if (product.category === 'hamburgueres' || product.id.startsWith('c')) {
      setUpsellParentItemName(product.title);
      setIsUpsellOpen(true);
      setIsCartOpen(false);
    } else {
      setIsCartOpen(true);
    }
  };

  const handleCustomizeProduct = (product: Product) => {
    setCustomizeProduct(product);
    setIsCustomizeOpen(true);
  };

  const handleConfirmCustomize = (
    product: Product,
    ponto: string,
    addedOptions: { name: string; price: number }[],
    removedIngredients: string[]
  ) => {
    const addonKeys = addedOptions.map((o) => o.name).sort().join('-');
    const removalKeys = removedIngredients.sort().join('-');
    const uniqueId = `${product.id}-${ponto}-${addonKeys}-${removalKeys}`;

    const existing = cart.find((item) => item.id === uniqueId);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: uniqueId,
        product,
        quantity: 1,
        ponto,
        addedOptions,
        removedIngredients,
      };
      setCart([...cart, newItem]);
    }
    
    setUpsellParentItemName(product.title);
    setIsUpsellOpen(true);
    setIsCartOpen(false);
  };

  const handleAddUpsellItem = (product: Product) => {
    const defaultId = `${product.id}-default`;
    const existing = cart.find((item) => item.id === defaultId);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === defaultId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: defaultId,
        product,
        quantity: 1,
        ponto: undefined,
        addedOptions: [],
        removedIngredients: [],
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    if (confirm('Deseja realmente limpar todos os itens da sua sacola?')) {
      setCart([]);
    }
  };

  const handleRepeatOrder = (items: CartItem[]) => {
    const mappedItems = items.map((item) => ({
      ...item,
      id: `${item.product.id}-repeat-${Date.now()}-${Math.random()}`,
    }));
    setCart([...cart, ...mappedItems]);
    setIsCartOpen(true);
  };

  const filterBySearch = (title: string, desc: string) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  const displayProducts = products.length > 0 ? products : PRODUCTS;

  const filteredProducts = displayProducts.filter(
    (p) => p.category === activeCategory && filterBySearch(p.title, p.description)
  );

  const filteredCombos = displayProducts.filter(
    (p) => p.category === 'combos' && activeCategory === 'combos' && filterBySearch(p.title, p.description)
  );

  const handleCheckout = async (cartOrderData: any) => {
    try {
      const orderData = {
        ...cartOrderData,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      setCart([]);
      setIsCartOpen(false);
      setTrackingOrderId(docRef.id);
      setIsTrackerOpen(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary flex flex-col selection:bg-brand-primary/30 selection:text-brand-primary-light">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        onHistoryClick={() => setIsHistoryOpen(true)}
        trackingOrderId={trackingOrderId}
        onTrackClick={() => setIsTrackerOpen(true)}
      />

      <Hero onHistoryClick={() => setIsHistoryOpen(true)} />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {searchQuery && (
          <div className="mb-6 bg-brand-low/40 p-4 rounded-xl border border-brand-highest/20 text-xs font-semibold text-brand-text-secondary">
            Resultados da busca para: <strong className="text-brand-primary">"{searchQuery}"</strong>
          </div>
        )}

        {activeCategory !== 'historia' ? (
          <div className="space-y-12">
            {activeCategory === 'combos' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-brand-secondary rounded-full"></div>
                  <h2 className="font-display font-extrabold text-xl tracking-tight text-brand-text-primary">
                    Combos Especiais de Costela & Smash
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCombos.map((combo) => (
                    <ComboCard key={combo.id} combo={combo as any} onAdd={(c) => handleAddProduct(c)} />
                  ))}
                  {filteredCombos.length === 0 && (
                    <p className="text-xs text-brand-text-muted">Nenhum combo encontrado.</p>
                  )}
                </div>
              </div>
            )}

            {activeCategory !== 'combos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
                    <h2 className="font-display font-extrabold text-xl tracking-tight text-brand-text-primary capitalize">
                      {activeCategory === 'porcoes' ? 'Porções & Acompanhamentos' : activeCategory}
                    </h2>
                  </div>
                  <span className="text-[10px] text-brand-text-muted font-bold tracking-widest uppercase">
                    {filteredProducts.length} itens disponíveis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAdd={(p) => handleAddProduct(p)}
                      onCustomize={handleCustomizeProduct}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="bg-brand-low/20 p-8 rounded-2xl border border-dashed border-brand-highest/30 text-center space-y-2">
                    <AlertTriangle className="text-brand-primary-light mx-auto" size={24} />
                    <p className="text-xs text-brand-text-muted font-semibold">
                      Não encontramos itens nessa categoria com os termos buscados.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 py-4">
             <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-brand-primary/20 text-brand-primary-light px-3.5 py-1 rounded-full font-display text-[10px] font-extrabold uppercase tracking-widest border border-brand-primary/20">
                NOSSA TRAJETÓRIA
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-text-primary">
                O Sabor da Brasa em São Sebastião
              </h2>
              <div className="w-12 h-1 bg-brand-primary mx-auto rounded-full"></div>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-brand-low border border-brand-highest/40 relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQTKv6xlW_6we0R05tx7LPipXIn8aq6rzh-27aW2X1T7FJZzoMgqg0_wGHa6FzqOQ_XZn_s21sfSEOlRtW_4h0P6U46ihQvqJVuh8CSFzke0Lmef7DpAa7DosuEcYJE3qgRDNQKSrf8kF_jv1Z7uZJX3HzReAzWyLDns4jevXzP3S5WVMwpeHti6s2DIBDuNA8JeKR0CEu4aJzZ04k_s0x7spHuzzx3FveuMEcRRv-eJ-IabEW5ho8eg"
                alt="Cabral Burguer Cozinha"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/95 via-brand-bg/40 to-transparent flex items-end p-6">
                <div>
                  <span className="font-display font-bold text-sm text-brand-secondary">
                    Grelhando com carinho e tradição
                  </span>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">
                    Nossos blends são preparados diariamente com carne Angus certificada.
                  </p>
                </div>
              </div>
            </div>

            <div className="font-body text-sm text-brand-text-secondary leading-relaxed space-y-4">
              <p>
                Fundado no coração de São Sebastião, o <strong className="text-brand-text-primary font-bold">Cabral Burguer Artesanal</strong> nasceu com uma missão clara: revolucionar o conceito de hambúrguer no litoral norte paulista, unindo a técnica clássica de churrasco na brasa com a inovação da charcutaria artesanal.
              </p>
              <p>
                Acreditamos que o segredo de um hambúrguer inesquecível está na pureza de seus ingredientes. Por isso, não utilizamos conservantes artificiais ou aditivos. Nossos pães de brioche e gergelim são assados diariamente por padeiros locais, as cebolas caramelizadas são cozidas lentamente no shoyu, e nossa maionese verde autoral segue uma receita de família que conquistou o coração dos caiçaras e turistas.
              </p>
              <p>
                Seja saboreando o lendário <strong className="text-brand-primary">Burger de Costela Desfiada</strong> ou experimentando nossos inovadores Hot Dogs artesanais e porções crocantes de Coxinha Sem Massa, você sentirá a paixão pelo fogo e pela boa comida em cada mordida.
              </p>
            </div>

            <div className="bg-brand-low p-6 rounded-2xl border border-brand-highest/40 space-y-6">
              <div className="flex items-center gap-2.5">
                <Palette size={20} className="text-brand-text-primary" />
                <h3 className="font-display font-bold text-base text-brand-text-primary">
                  Guia de Cores da Marca (Brand Color Guidelines)
                </h3>
              </div>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Nossa identidade visual foi inteiramente reformulada com base na nossa logomarca oficial. O minimalismo moderno de alto contraste do logo foi traduzido em uma paleta monocromática premium e elegante:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-container p-3 rounded-xl border border-brand-highest/30 space-y-3">
                  <div className="w-full h-12 rounded-lg bg-[#050505] border border-brand-highest flex items-center justify-center">
                    <span className="text-[10px] font-mono text-white font-bold bg-black/40 px-2 py-0.5 rounded">#050505</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-text-primary">Preto Carvão (Carbon)</h5>
                    <p className="text-[10px] text-brand-text-muted mt-0.5 leading-normal">
                      Tom de fundo principal do logo. Representa as brasas de carvão e a grelha quente da hamburgueria.
                    </p>
                  </div>
                </div>

                <div className="bg-brand-container p-3 rounded-xl border border-brand-highest/30 space-y-3">
                  <div className="w-full h-12 rounded-lg bg-white border border-brand-highest flex items-center justify-center">
                    <span className="text-[10px] font-mono text-black font-bold bg-white/40 px-2 py-0.5 rounded">#FFFFFF</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-text-primary">Branco Puro (Pure White)</h5>
                    <p className="text-[10px] text-brand-text-muted mt-0.5 leading-normal">
                      Cores da tipografia e do ícone central. Traz legibilidade perfeita e contraste premium à interface.
                    </p>
                  </div>
                </div>

                <div className="bg-brand-container p-3 rounded-xl border border-brand-highest/30 space-y-3">
                  <div className="w-full h-12 rounded-lg bg-[#262626] border border-brand-highest flex items-center justify-center">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold bg-black/40 px-2 py-0.5 rounded">#262626</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-brand-text-primary">Cinza Brasa (Ashen)</h5>
                    <p className="text-[10px] text-brand-text-muted mt-0.5 leading-normal">
                      Tons neutros de cinza e ardósia para bordas secundárias, delimitadores e textos informativos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-bg p-3.5 rounded-xl border border-brand-highest/30 flex items-start gap-2.5 text-[11px] text-brand-text-secondary leading-normal">
                <Check size={14} className="text-brand-tertiary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-brand-text-primary font-semibold">Aplicação Fiel:</strong> O site inteiro agora se beneficia desta paleta, garantindo consistência impecável com o aplicativo e conformidade com as diretrizes de acessibilidade WCAG.
                </span>
              </div>
            </div>

            <div className="bg-brand-low p-6 rounded-2xl border border-brand-highest/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-bold text-sm text-brand-text-primary">
                  Dúvidas sobre Alérgenos ou Eventos?
                </h4>
                <p className="text-xs text-brand-text-muted">
                  Nossa equipe está pronta para te atender diretamente pelo WhatsApp.
                </p>
              </div>

              <a
                href="https://wa.me/551221036706"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg font-body text-xs font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md"
              >
                <Phone size={14} />
                <span>Falar Conosco</span>
              </a>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-brand-low border-t border-brand-highest/40 py-8 text-center text-xs text-brand-text-muted font-body">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-brand-text-secondary font-semibold">
            <button onClick={() => setActiveCategory('hamburgueres')} className="hover:text-brand-primary transition-colors">Burguers</button>
            <button onClick={() => setActiveCategory('combos')} className="hover:text-brand-primary transition-colors">Combos</button>
            <button onClick={() => setActiveCategory('hotdogs')} className="hover:text-brand-primary transition-colors">Hot Dogs</button>
            <button onClick={() => setActiveCategory('porcoes')} className="hover:text-brand-primary transition-colors">Acompanhamentos</button>
            <button onClick={() => setActiveCategory('historia')} className="hover:text-brand-primary transition-colors">Nossa História</button>
          </div>
          <p>© 2026 Cabral Burguer Artesanal • Todos os direitos reservados.</p>
        </div>
      </footer>

      <CustomizeModal
        product={customizeProduct}
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onConfirm={handleConfirmCustomize}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRepeatOrder={handleRepeatOrder}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      <UpsellModal
        isOpen={isUpsellOpen}
        onClose={() => {
          setIsUpsellOpen(false);
          setIsCartOpen(true);
        }}
        onAddUpsellItem={handleAddUpsellItem}
        addedItemName={upsellParentItemName}
      />

      {isTrackerOpen && trackingOrderId && (
        <OrderTracker
          orderId={trackingOrderId}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}
    </div>
  );
}
