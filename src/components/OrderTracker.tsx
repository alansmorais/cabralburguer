import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Clock, Check, Star, Bike, ChevronRight, Utensils, ThumbsUp, ShieldCheck, X } from 'lucide-react';

interface OrderTrackerProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderTracker({ orderId, onClose }: OrderTrackerProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    const unsub = onSnapshot(doc(db, 'orders', orderId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setOrder({ id: snapshot.id, ...data });
        if (data.feedback) {
          setFeedbackSent(true);
        }
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching order for tracking:', error);
      setLoading(false);
    });

    return unsub;
  }, [orderId]);

  const handleSendFeedback = async () => {
    if (!orderId) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        feedback: {
          rating,
          comment: comment.trim(),
          submittedAt: serverTimestamp()
        }
      });
      setFeedbackSent(true);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-brand-low border border-brand-highest/30 p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-brand-text-secondary">Carregando status do seu pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-brand-low border border-brand-highest/30 p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
          <p className="text-sm font-semibold text-red-400">Pedido não encontrado ou removido.</p>
          <button 
            onClick={onClose}
            className="w-full bg-brand-primary text-brand-bg py-2.5 rounded-xl font-bold text-xs"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Recebido', desc: 'Na fila de preparo', icon: Clock },
    { key: 'preparing', label: 'Em Preparo', desc: 'Grelhando seu burguer', icon: Utensils },
    { key: 'ready', label: 'Pronto', desc: order.orderType === 'entrega' ? 'Aguardando despacho' : 'Pronto para retirada', icon: ShieldCheck },
    ...(order.orderType === 'entrega' ? [{ key: 'dispatched', label: 'A Caminho', desc: 'Saiu para entrega', icon: Bike }] : []),
    { key: 'completed', label: 'Concluído', desc: 'Entregue com sucesso', icon: ThumbsUp }
  ];

  const currentStepIdx = steps.findIndex(step => step.key === order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-brand-low border border-brand-highest/30 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative my-8 animate-fade-in text-brand-text-primary">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-highest/30 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-1">
          <div className="text-brand-primary font-display font-black text-xl tracking-tight uppercase">Acompanhe seu Pedido</div>
          <div className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">ID: #{order.id.slice(-6)}</div>
        </div>

        {/* Live Progress Tracker */}
        <div className="space-y-4 bg-brand-bg p-4 rounded-xl border border-brand-highest/15">
          <div className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest border-b border-brand-highest/10 pb-2">Status em Tempo Real</div>
          
          <div className="relative pl-6 space-y-6 border-l border-brand-highest/20 ml-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture = idx > currentStepIdx;

              return (
                <div key={step.key} className="relative flex items-start gap-3">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-8 top-1 flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
                    isPast ? 'bg-brand-primary border-brand-primary text-brand-bg' :
                    isCurrent ? 'bg-brand-bg border-brand-primary text-brand-primary ring-4 ring-brand-primary/25' :
                    'bg-brand-low border-brand-highest/30 text-brand-text-muted'
                  }`}>
                    {isPast ? <Check size={10} className="stroke-[3]" /> : <span className="w-1.5 h-1.5 bg-current rounded-full"></span>}
                  </span>

                  <div>
                    <div className={`text-xs font-bold uppercase flex items-center gap-1.5 ${
                      isCurrent ? 'text-brand-primary' : isPast ? 'text-brand-text-primary' : 'text-brand-text-muted'
                    }`}>
                      <Icon size={14} />
                      {step.label}
                    </div>
                    <div className="text-[11px] text-brand-text-muted leading-tight mt-0.5">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motoboy Information if Dispatched */}
        {order.status === 'dispatched' && order.motoboy && (
          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl space-y-2 animate-fade-in">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Bike size={14} /> Informações do seu Entregador
            </div>
            <div className="space-y-1">
              <div className="text-sm font-extrabold">{order.motoboy.name}</div>
              <div className="text-xs text-brand-text-secondary">🏍️ {order.motoboy.vehicle}</div>
              {order.motoboy.phone && order.motoboy.phone !== '-' && (
                <a 
                  href={`https://wa.me/55${order.motoboy.phone.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-brand-primary font-bold hover:underline pt-1.5"
                >
                  Falar no WhatsApp ➔
                </a>
              )}
            </div>
          </div>
        )}

        {/* Feedback Option when Completed */}
        {order.status === 'completed' && (
          <div className="bg-brand-container border border-brand-primary/20 p-4 rounded-xl space-y-4 animate-fade-in">
            <div className="text-center space-y-1">
              <h4 className="font-display font-extrabold text-sm">O que achou do seu pedido?</h4>
              <p className="text-[11px] text-brand-text-muted">Sua avaliação é extremamente importante para mantermos a qualidade Cabral!</p>
            </div>

            {feedbackSent ? (
              <div className="bg-green-500/15 border border-green-500/20 p-3 rounded-lg text-center text-xs font-semibold text-green-400 flex items-center justify-center gap-2">
                <Check size={16} /> Avaliação enviada com sucesso! Obrigado!
              </div>
            ) : (
              <div className="space-y-3">
                {/* Stars Selector */}
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          size={28} 
                          className={starVal <= (hoverRating ?? rating) ? 'fill-yellow-500 text-yellow-500' : 'text-brand-highest/40'} 
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Comment Area */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Deixe seu comentário (opcional)</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Ex: Hambúrguer maravilhoso, chegou super rápido!"
                    className="w-full bg-brand-bg p-2 text-xs rounded-lg border border-brand-highest/30 focus:border-brand-primary focus:outline-none text-brand-text-primary"
                  />
                </div>

                <button
                  onClick={handleSendFeedback}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  Enviar Avaliação
                </button>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full bg-brand-highest/30 hover:bg-brand-highest/50 text-brand-text-primary py-2.5 rounded-xl font-bold text-xs transition-all"
        >
          {order.status === 'completed' ? 'Fechar' : 'Fechar e Continuar Navegando'}
        </button>
      </div>
    </div>
  );
}
