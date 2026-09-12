import { useState, useEffect } from 'react';
import { db, auth, signInWithGoogle, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Save, LogOut, Database, ShieldCheck, Users } from 'lucide-react';
import { seedDatabase } from '../lib/seed';

export default function AdminPanel() {
  const [user, setUser] = useState(auth.currentUser);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        setLoadingAdminCheck(true);
        try {
          if (u.email === 'alanpkmorais@gmail.com') {
            setIsAdminUser(true);
          } else {
            const emailDocRef = doc(db, 'admin_emails', u.email || '');
            const emailDocSnap = await getDoc(emailDocRef);
            if (emailDocSnap.exists()) {
              setIsAdminUser(true);
            } else {
              const uidDocRef = doc(db, 'admins', u.uid);
              const uidDocSnap = await getDoc(uidDocRef);
              setIsAdminUser(uidDocSnap.exists());
            }
          }
        } catch (error) {
          console.error('Error verifying admin permissions:', error);
          setIsAdminUser(false);
        } finally {
          setLoadingAdminCheck(false);
        }
      } else {
        setIsAdminUser(false);
        setLoadingAdminCheck(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || !isAdminUser) return;
    
    const q = query(collection(db, 'products'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'products');
      } catch (err) {
        console.error('AdminPanel list products error:', err);
      }
    });

    const qCats = query(collection(db, 'categories'));
    onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, name: d.data().name })));
    });

    return unsub;
  }, [user, isAdminUser]);

  const [adminEmails, setAdminEmails] = useState<{id: string}[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [currentAdminView, setCurrentAdminView] = useState<'menu' | 'admins' | 'motoboys'>('menu');

  useEffect(() => {
    if (!user || !isAdminUser) return;
    
    const qEmails = query(collection(db, 'admin_emails'));
    const unsub = onSnapshot(qEmails, (snapshot) => {
      setAdminEmails(snapshot.docs.map(d => ({ id: d.id })));
    });
    
    return unsub;
  }, [user, isAdminUser]);

  const handleAddAdminEmail = async () => {
    if (!newAdminEmail) return;
    try {
      const emailRef = doc(db, 'admin_emails', newAdminEmail.trim().toLowerCase());
      await setDoc(emailRef, {
        addedBy: user?.email,
        addedAt: serverTimestamp()
      });
      setNewAdminEmail('');
      alert(`O e-mail ${newAdminEmail} agora tem acesso de administrador!`);
    } catch (error) {
      console.error('Error adding admin email:', error);
      alert('Erro ao adicionar e-mail de administrador. Verifique as permissões.');
    }
  };

  const handleRemoveAdminEmail = async (email: string) => {
    if (!confirm(`Remover permissão de administrador de ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'admin_emails', email));
      alert(`Permissão de administrador removida de ${email}.`);
    } catch (error) {
      console.error('Error removing admin email:', error);
      alert('Erro ao remover e-mail de administrador.');
    }
  };

  const [motoboys, setMotoboys] = useState<{ id: string; name: string; phone: string; vehicle: string; status: string }[]>([]);
  const [newMotoboyName, setNewMotoboyName] = useState('');
  const [newMotoboyPhone, setNewMotoboyPhone] = useState('');
  const [newMotoboyVehicle, setNewMotoboyVehicle] = useState('');

  useEffect(() => {
    if (!user || !isAdminUser) return;
    
    const qMotoboys = query(collection(db, 'motoboys'));
    const unsub = onSnapshot(qMotoboys, (snapshot) => {
      setMotoboys(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    
    return unsub;
  }, [user, isAdminUser]);

  const handleAddMotoboy = async () => {
    if (!newMotoboyName || !newMotoboyPhone || !newMotoboyVehicle) {
      alert('Por favor, preencha todos os campos do motoboy!');
      return;
    }
    try {
      await addDoc(collection(db, 'motoboys'), {
        name: newMotoboyName,
        phone: newMotoboyPhone,
        vehicle: newMotoboyVehicle,
        status: 'active',
        createdAt: serverTimestamp()
      });
      setNewMotoboyName('');
      setNewMotoboyPhone('');
      setNewMotoboyVehicle('');
      alert('Entregador/Motoboy registrado com sucesso!');
    } catch (error) {
      console.error('Error adding motoboy:', error);
      alert('Erro ao registrar motoboy.');
    }
  };

  const handleRemoveMotoboy = async (id: string) => {
    if (!confirm('Remover este motoboy?')) return;
    try {
      await deleteDoc(doc(db, 'motoboys', id));
      alert('Motoboy removido com sucesso.');
    } catch (error) {
      console.error('Error removing motoboy:', error);
      alert('Erro ao remover motoboy.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleSave = async () => {
    if (!editingId || !editForm.title || !editForm.price) return;
    try {
      const prodRef = doc(db, 'products', editingId);
      await updateDoc(prodRef, editForm);
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${editingId}`);
    }
  };

  const handleAdd = async () => {
    if (!editForm.title || !editForm.price || !editForm.category) return;
    try {
      await addDoc(collection(db, 'products'), {
        ...editForm,
        available: true,
        image: editForm.image || 'https://via.placeholder.com/300',
        badgeType: editForm.badgeType || 'none'
      });
      setIsAdding(false);
      setEditForm({});
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="bg-brand-low p-8 rounded-2xl border border-brand-highest/40 max-w-sm w-full text-center space-y-6">
          <h2 className="font-display font-extrabold text-2xl text-brand-text-primary">Admin Panel</h2>
          <p className="text-sm text-brand-text-muted">Acesso restrito para administração do Cabral Burguer.</p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg py-3 rounded-xl font-bold transition-all"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  if (loadingAdminCheck) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-brand-text-muted font-semibold">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-brand-text-primary">Você não tem permissão de administrador.</p>
          <p className="text-xs text-brand-text-muted">Solicite acesso ao administrador master do sistema.</p>
          <button onClick={() => auth.signOut()} className="text-brand-primary font-bold underline">Sair da Conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-highest/25 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl">
              {currentAdminView === 'menu' ? 'Gerenciar Cardápio' : currentAdminView === 'admins' ? 'Controle de Acessos' : 'Gerenciamento de Motoboys'}
            </h1>
            <p className="text-brand-text-muted text-sm mt-1">
              {currentAdminView === 'menu' ? 'Adicione produtos, altere preços e imagens em tempo real.' : currentAdminView === 'admins' ? 'Gerencie quais contas do Google têm acesso ao painel.' : 'Cadastre e gerencie os entregadores parceiros da casa.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {currentAdminView === 'menu' && products.length === 0 && (
              <button
                onClick={async () => {
                  setIsSeeding(true);
                  await seedDatabase();
                  setIsSeeding(false);
                }}
                disabled={isSeeding}
                className="bg-brand-low hover:bg-brand-highest/40 text-brand-text-primary px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border border-brand-highest/30 disabled:opacity-50 text-xs"
              >
                <Database size={14} /> {isSeeding ? 'Semeando...' : 'Semeador Inicial'}
              </button>
            )}
            <button
              onClick={() => { setCurrentAdminView('menu'); setIsAdding(false); }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all ${
                currentAdminView === 'menu'
                  ? 'bg-brand-primary text-brand-bg border-brand-primary'
                  : 'bg-brand-low text-brand-text-primary border-brand-highest/20 hover:bg-brand-highest/30'
              }`}
            >
              🍔 Cardápio
            </button>
            <button
              onClick={() => { setCurrentAdminView('admins'); setIsAdding(false); }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                currentAdminView === 'admins'
                  ? 'bg-brand-primary text-brand-bg border-brand-primary'
                  : 'bg-brand-low text-brand-text-primary border-brand-highest/20 hover:bg-brand-highest/30'
              }`}
            >
              <ShieldCheck size={14} /> Acessos
            </button>
            <button
              onClick={() => { setCurrentAdminView('motoboys'); setIsAdding(false); }}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                currentAdminView === 'motoboys'
                  ? 'bg-brand-primary text-brand-bg border-brand-primary'
                  : 'bg-brand-low text-brand-text-primary border-brand-highest/20 hover:bg-brand-highest/30'
              }`}
            >
              🏍️ Motoboys
            </button>
            {currentAdminView === 'menu' && (
              <button
                onClick={() => { setIsAdding(true); setEditForm({}); }}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs"
              >
                <Plus size={14} /> Novo Produto
              </button>
            )}
            <button onClick={() => auth.signOut()} className="p-2 hover:bg-brand-low rounded-xl text-brand-text-muted" title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="bg-brand-low p-6 rounded-2xl border border-brand-primary/30 space-y-4">
            <h3 className="font-bold text-lg">Novo Produto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Título"
                className="bg-brand-bg p-2 rounded-lg border border-brand-highest/30"
                onChange={e => setEditForm({...editForm, title: e.target.value})}
              />
              <input
                placeholder="Preço (Ex: 39.90)"
                type="number"
                className="bg-brand-bg p-2 rounded-lg border border-brand-highest/30"
                onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
              />
              <select
                className="bg-brand-bg p-2 rounded-lg border border-brand-highest/30"
                onChange={e => setEditForm({...editForm, category: e.target.value})}
              >
                <option value="">Categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                placeholder="URL da Imagem"
                className="bg-brand-bg p-2 rounded-lg border border-brand-highest/30"
                onChange={e => setEditForm({...editForm, image: e.target.value})}
              />
              <textarea
                placeholder="Descrição"
                className="bg-brand-bg p-2 rounded-lg border border-brand-highest/30 sm:col-span-2"
                onChange={e => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-brand-text-muted">Cancelar</button>
              <button onClick={handleAdd} className="bg-brand-primary text-brand-bg px-6 py-2 rounded-xl font-bold">Criar</button>
            </div>
          </div>
        )}

        {currentAdminView === 'admins' ? (
          <div className="bg-brand-low p-6 rounded-2xl border border-brand-highest/30 space-y-6 animate-fade-in">
            <div>
              <h3 className="font-display font-extrabold text-xl">Administradores Autorizados</h3>
              <p className="text-brand-text-muted text-sm">Gerencie quais contas de e-mail do Google têm permissão para acessar o painel administrativo e a cozinha.</p>
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Adicionar e-mail (ex: dono@gmail.com)"
                value={newAdminEmail}
                onChange={e => setNewAdminEmail(e.target.value)}
                className="bg-brand-bg p-2.5 rounded-lg border border-brand-highest/30 flex-1 text-sm focus:border-brand-primary focus:outline-none"
              />
              <button
                onClick={handleAddAdminEmail}
                className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                Adicionar
              </button>
            </div>

            <div className="border-t border-brand-highest/20 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Lista de Administradores</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-lg border border-brand-highest/10 text-sm">
                  <span className="font-semibold text-brand-text-primary">alanpkmorais@gmail.com</span>
                  <span className="text-xs bg-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">Master (Você)</span>
                </div>
                {adminEmails.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-lg border border-brand-highest/10 text-sm">
                    <span className="font-medium text-brand-text-primary">{admin.id}</span>
                    <button
                      onClick={() => handleRemoveAdminEmail(admin.id)}
                      className="text-red-400 hover:text-red-500 font-bold text-xs"
                    >
                      Remover Acesso
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : currentAdminView === 'motoboys' ? (
          <div className="bg-brand-low p-6 rounded-2xl border border-brand-highest/30 space-y-6 animate-fade-in">
            <div>
              <h3 className="font-display font-extrabold text-xl">Registrar Motoboy</h3>
              <p className="text-brand-text-muted text-sm">Cadastre novos entregadores para a sua frota própria. Eles poderão ser selecionados para despacho de pedidos de entrega.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl bg-brand-bg p-4 rounded-xl border border-brand-highest/15">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Nome do Entregador</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={newMotoboyName}
                  onChange={e => setNewMotoboyName(e.target.value)}
                  className="w-full bg-brand-low p-2 rounded-lg border border-brand-highest/30 text-sm focus:border-brand-primary focus:outline-none text-brand-text-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Celular / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Ex: (12) 99999-9999"
                  value={newMotoboyPhone}
                  onChange={e => setNewMotoboyPhone(e.target.value)}
                  className="w-full bg-brand-low p-2 rounded-lg border border-brand-highest/30 text-sm focus:border-brand-primary focus:outline-none text-brand-text-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Veículo & Placa</label>
                <input
                  type="text"
                  placeholder="Ex: Honda CG 160 Vermelha"
                  value={newMotoboyVehicle}
                  onChange={e => setNewMotoboyVehicle(e.target.value)}
                  className="w-full bg-brand-low p-2 rounded-lg border border-brand-highest/30 text-sm focus:border-brand-primary focus:outline-none text-brand-text-primary"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end pt-2 border-t border-brand-highest/10 mt-1">
                <button
                  onClick={handleAddMotoboy}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} /> Registrar Motoboy
                </button>
              </div>
            </div>

            <div className="border-t border-brand-highest/20 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Motoboys Cadastrados ({motoboys.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {motoboys.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-xl border border-brand-highest/10 text-sm">
                    <div className="space-y-1">
                      <div className="font-semibold text-brand-text-primary text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {m.name}
                      </div>
                      <div className="text-xs text-brand-text-muted">📞 {m.phone}</div>
                      <div className="text-xs text-brand-text-muted">🏍️ {m.vehicle}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveMotoboy(m.id)}
                      className="text-red-400 hover:text-red-500 font-bold text-xs"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                {motoboys.length === 0 && (
                  <p className="text-xs text-brand-text-muted col-span-2 py-4 italic">Nenhum motoboy registrado no momento.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-brand-low p-4 rounded-xl border border-brand-highest/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <img src={product.image} className="w-16 h-16 rounded-lg object-cover bg-black" />
                  {editingId === product.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <input
                        value={editForm.title || ''}
                        placeholder="Título"
                        className="bg-brand-bg p-1.5 rounded border border-brand-primary/50 text-sm font-semibold"
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                      />
                      <input
                        value={editForm.price ?? ''}
                        placeholder="Preço"
                        type="number"
                        step="0.01"
                        className="bg-brand-bg p-1.5 rounded border border-brand-primary/50 text-sm font-semibold"
                        onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                      />
                      <input
                        value={editForm.image || ''}
                        placeholder="URL da Imagem"
                        className="bg-brand-bg p-1.5 rounded border border-brand-primary/50 text-xs sm:col-span-2"
                        onChange={e => setEditForm({...editForm, image: e.target.value})}
                      />
                      <textarea
                        value={editForm.description || ''}
                        placeholder="Descrição"
                        rows={2}
                        className="bg-brand-bg p-1.5 rounded border border-brand-primary/50 text-xs sm:col-span-2"
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-sm">{product.title}</h4>
                      <p className="text-brand-secondary text-xs font-bold">R$ {product.price.toFixed(2)}</p>
                      <p className="text-[10px] text-brand-text-muted uppercase tracking-widest">{product.category}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingId === product.id ? (
                    <>
                      <button onClick={handleSave} className="p-2 bg-brand-primary text-brand-bg rounded-lg"><Save size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-brand-highest/30 rounded-lg"><X size={16}/></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(product)} className="p-2 hover:bg-brand-highest/30 rounded-lg text-brand-text-muted"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-brand-highest/30 rounded-lg text-red-400"><Trash2 size={16}/></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
