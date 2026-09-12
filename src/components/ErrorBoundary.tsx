import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Database } from 'lucide-react';
import { seedDatabase } from '../lib/seed';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  seeding: boolean;
  seeded: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    seeding: false,
    seeded: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, seeding: false, seeded: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    (this as any).setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleSeed = async () => {
    (this as any).setState({ seeding: true });
    try {
      await seedDatabase();
      (this as any).setState({ seeded: true, seeding: false });
      alert('Banco de dados inicializado com sucesso!');
      window.location.reload();
    } catch (err) {
      console.error('Seeding database failed:', err);
      alert('Ocorreu um erro ao inicializar o banco de dados. Verifique a sua conexão ou se as regras do Firestore foram aplicadas.');
      (this as any).setState({ seeding: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      const isFirestoreError = this.state.error?.message.includes('authInfo') || this.state.error?.message.includes('PermissionDenied') || this.state.error?.message.includes('permissions');

      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-body selection:bg-white/10">
          <div className="max-w-md w-full bg-[#0d0d0d] border border-neutral-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center">
            
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <AlertTriangle size={32} />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl tracking-tight uppercase text-white">
                Algo deu errado
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFirestoreError 
                  ? 'Não foi possível conectar com o banco de dados Firestore ou você não tem as permissões necessárias.'
                  : 'Ocorreu um erro inesperado ao renderizar a página. Isso pode ser devido a dados corrompidos na sessão anterior.'
                }
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-[#171717] p-4 rounded-xl border border-neutral-800 text-left overflow-auto max-h-48 no-scrollbar">
              <p className="text-[10px] font-mono text-red-400 break-all leading-normal whitespace-pre-wrap">
                {this.state.error?.toString() || 'Erro desconhecido'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-white hover:bg-neutral-200 text-black py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Limpar Cache e Recarregar</span>
              </button>

              {isFirestoreError && (
                <button
                  onClick={this.handleSeed}
                  disabled={this.state.seeding || this.state.seeded}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white py-2.5 px-4 rounded-xl font-bold text-xs border border-neutral-700 transition-all flex items-center justify-center gap-2"
                >
                  <Database size={14} className={this.state.seeding ? 'animate-spin' : ''} />
                  <span>
                    {this.state.seeding ? 'Inicializando...' : this.state.seeded ? 'Inicializado!' : 'Popular Banco de Dados (Seed)'}
                  </span>
                </button>
              )}
            </div>

            {/* Helpful Notice */}
            <p className="text-[10px] text-neutral-500 leading-normal">
              Se o problema persistir, por favor verifique se a sua conexão está ativa e se as credenciais do Firebase no arquivo <code className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-400 font-mono">firebase-applet-config.json</code> estão configuradas de forma válida.
            </p>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
