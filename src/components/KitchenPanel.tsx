import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Clock, CheckCircle2, Printer, ChevronRight, Package, User } from 'lucide-react';

export default function KitchenPanel() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    return unsub;
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items.map((item: any) => `
      <div style="margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">
        <div style="font-weight: bold; font-size: 1.2em;">${item.quantity}x ${item.title}</div>
        ${item.ponto ? `<div style="font-size: 0.9em; margin-left: 10px;">- Ponto: ${item.ponto}</div>` : ''}
        ${item.addedOptions?.length > 0 ? `<div style="font-size: 0.9em; margin-left: 10px;">- Extras: ${item.addedOptions.map((o: any) => o.name).join(', ')}</div>` : ''}
        ${item.removedIngredients?.length > 0 ? `<div style="font-size: 0.9em; margin-left: 10px;">- S/ ${item.removedIngredients.join(', ')}</div>` : ''}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Pedido #${order.id.slice(-4)}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 10px; color: #000; }
            h1 { text-align: center; font-size: 1.5em; margin: 0 0 10px 0; }
            .meta { margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            .total { text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 15px; }
            @media print { body { width: 80mm; } }
          </style>
        </head>
        <body>
          <h1>CABRAL BURGUER</h1>
          <div class="meta">
            <div>PEDIDO: #${order.id.slice(-4)}</div>
            <div>CLIENTE: ${order.customerName}</div>
            <div>TIPO: ${order.orderType === 'entrega' ? 'ENTREGA' : 'RETIRADA'}</div>
            <div>DATA: ${new Date(order.createdAt?.toDate()).toLocaleString()}</div>
          </div>
          <div class="items">${itemsHtml}</div>
          <div class="total">TOTAL: R$ ${order.total.toFixed(2)}</div>
          <script>window.print(); setTimeout(() => window.close(), 100);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'preparing': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'ready': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-brand-highest/20 text-brand-text-muted border-brand-highest/30';
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-brand-highest/40 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl flex items-center gap-3">
              <Package className="text-brand-primary" /> Painel da Cozinha
            </h1>
            <p className="text-brand-text-muted text-sm mt-1">Gerenciamento de pedidos em tempo real.</p>
          </div>
          <div className="bg-brand-low px-4 py-2 rounded-xl border border-brand-highest/30 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-text-secondary">Conectado</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`bg-brand-low rounded-2xl border transition-all ${
                order.status === 'pending' ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-brand-highest/30'
              } flex flex-col`}
            >
              <div className="p-4 border-b border-brand-highest/20 flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-tighter">Pedido #{order.id.slice(-6)}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <User size={14} className="text-brand-primary-light" />
                    <span className="font-bold text-sm">{order.customerName}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status === 'pending' ? 'Novo' : order.status === 'preparing' ? 'Preparando' : 'Pronto'}
                </span>
              </div>

              <div className="p-4 flex-1 space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="bg-brand-highest/50 text-brand-text-primary text-[10px] font-bold px-1.5 rounded min-w-[24px] text-center">{item.quantity}x</span>
                      <span className="font-bold text-sm leading-tight">{item.title}</span>
                    </div>
                    {(item.ponto || item.addedOptions?.length > 0 || item.removedIngredients?.length > 0) && (
                      <div className="ml-8 text-[11px] text-brand-text-muted space-y-0.5 italic">
                        {item.ponto && <div>• Ponto: {item.ponto}</div>}
                        {item.addedOptions?.map((o: any) => <div key={o.name}>• + {o.name}</div>)}
                        {item.removedIngredients?.map((i: any) => <div key={i}>• Sem {i}</div>)}
                      </div>
                    )}
                  </div>
                ))}

                {order.notes && (
                  <div className="mt-4 bg-brand-primary/10 p-2.5 rounded-lg border border-brand-primary/20">
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">Observações:</div>
                    <p className="text-xs text-brand-text-secondary leading-normal">{order.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-brand-container rounded-b-2xl border-t border-brand-highest/20 space-y-3">
                <div className="flex items-center justify-between text-xs text-brand-text-muted font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {new Date(order.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="capitalize">{order.orderType}</div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePrint(order)}
                    className="flex-1 bg-brand-low hover:bg-brand-highest/40 border border-brand-highest/40 text-brand-text-primary py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    <Printer size={16} /> Imprimir
                  </button>
                  
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className="flex-1 bg-brand-primary text-brand-bg py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-primary-hover transition-all"
                    >
                      <ChevronRight size={16} /> Preparar
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="flex-1 bg-brand-tertiary text-brand-bg py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    >
                      <CheckCircle2 size={16} /> Finalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Package className="mx-auto text-brand-highest/40" size={48} />
              <p className="text-brand-text-muted font-display font-semibold">Nenhum pedido recebido ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
