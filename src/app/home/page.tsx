'use client';

import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Table, Lock, LogOut, FilePenLine, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoBPA from '../../assets/brasao.png'

export default function Home() {
  const { user, signOut, hasPermission } = useAuth();
  const router = useRouter();

  // console.log('user', user);


  // const user = localStorage.getItem('user');

  const handleNavigation = (route: string) => {
    router.push(`/${route}`);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background igual ao login */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          <g fill="#052e16" opacity="0.65">
            <rect x="-100" y="0" width="400" height="400" rx="120" />
            <rect x="200" y="200" width="300" height="300" rx="80" />
            <rect x="550" y="50" width="350" height="350" rx="100" />
            <rect x="100" y="450" width="400" height="400" rx="150" />
          </g>
        </svg>

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-6xl px-4 py-8 text-white">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-42 h-42 rounded-full flex items-center justify-center mb-6">
              <Image src={LogoBPA} alt="Logo BPA" className="w-32 h-32 ml-2" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              BATALHÃO DE POLÍCIA AMBIENTAL
            </h1>
            <p className="text-lg">
              Sistema de Gestão Operacional
            </p>
          </div>

          {/* Menu Cards */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hasPermission("sistema:gerenciar") && (
                <>
                  <Card className="bg-white/10 backdrop-blur-md border border-white/50 
                      hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleNavigation('bookday')}>
                    <CardHeader className="text-center">
                      <Book className="w-12 h-12 mx-auto text-white mb-2" />
                      <CardTitle className="text-lg text-white">LIVRO DO DIA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-200 text-center">
                        Gerenciar registros diários de ocorrências
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-md border border-white/50
                    hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleNavigation('productivity')}>
                    <CardHeader className="text-center">
                      <Table className="w-12 h-12 mx-auto text-white mb-2" />
                      <CardTitle className="text-lg text-white">PRODUTIVIDADE</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-200 text-center">
                        Acompanhar métricas de produtividade
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card className="bg-white/10 backdrop-blur-md border border-white/50 
             hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"  onClick={() => handleNavigation('controlcar')}>
                <CardHeader className="text-center">
                  <Lock className="w-12 h-12 mx-auto text-white mb-2" />
                  <CardTitle className="text-lg text-white">CONTROLE DE ACESSO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 text-center">
                    Controlar entrada e saída de veículos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/50 
             hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"  onClick={() => handleNavigation('mapforce')}>
                <CardHeader className="text-center">
                  <Table className="w-12 h-12 mx-auto text-white mb-2" />
                  <CardTitle className="text-lg text-white">MAPA FORÇA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 text-center">
                    Visualizar distribuição de forças
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/50 
             hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"  onClick={() => handleNavigation('assessments')}>
                <CardHeader className="text-center">
                  <FilePenLine className="w-12 h-12 mx-auto text-white mb-2" />
                  <CardTitle className="text-lg text-white">AUTUAÇÕES</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 text-center">
                    Gerenciar registros de autuações
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border border-white/50 
             hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleNavigation('managepeople')}>
                <CardHeader className="text-center">
                  <UserCog className="w-12 h-12 mx-auto text-white mb-2" />
                  <CardTitle className="text-lg text-white">CONTROLE DE EFETIVO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 text-center">
                    Visualizar e gerenciar o efetivo
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Logout Button */}
            <div className="text-center">
              <Button
                onClick={handleLogout}
                size="lg"
                className="w-full max-w-md bg-red-600 hover:bg-red-700 
             transition-transform duration-300 hover:scale-105 
             hover:shadow-xl hover:shadow-red-500/40"
              >
                <LogOut className="w-5 h-5 mr-2" />
                SAIR
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-200">
              Logado como: {user?.graduacao?.sigla_graduation} {user?.graduacao?.group} {user?.nome_guerra}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
