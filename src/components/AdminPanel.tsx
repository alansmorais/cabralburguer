import { useState, useEffect } from 'react';
import { db, auth, signInWithGoogle, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Save, LogOut, Database } from 'lucide-react';
import { seedDatabase } from '../lib/seed';

export default function AdminPanel() {
  const [user, setUser] = useState(auth.currentUser);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'products'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const qCats = query(collection(db, 'categories'));
    onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, name: d.data().name })));
    });

    return unsub;
  }, [user]);

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

  // Check if admin (simple check for preview, rules enforce real security)
  const isAdmin = user.email === 'alanpkmorais@gmail.com';
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-brand-text-primary">Você não tem permissão de administrador.</p>
          <button onClick={() => auth.signOut()} className="text-brand-primary underline">Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl">Gerenciar Cardápio</h1>
            <p className="text-brand-text-muted text-sm">Adicione produtos, altere preços e imagens em tempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            {products.length === 0 && (
              <button
                onClick={async () => {
                  setIsSeeding(true);
                  await seedDatabase();
                  setIsSeeding(false);
                }}
                disabled={isSeeding}
                className="bg-brand-low hover:bg-brand-highest/40 text-brand-text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-brand-highest/30 disabled:opacity-50"
              >
                <Database size={18} /> {isSeeding ? 'Semeando...' : 'Semear Dados Iniciais'}
              </button>
            )}
            <button
              onClick={() => { setIsAdding(true); setEditForm({}); }}
              className="bg-brand-primary hover:bg-brand-primary-hover text-brand-bg px-4 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={18} /> Novo Produto
            </button>
            <button onClick={() => auth.signOut()} className="p-2 hover:bg-brand-low rounded-xl text-brand-text-muted">
              <LogOut size={18} />
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
      </div>
    </div>
  );
}
