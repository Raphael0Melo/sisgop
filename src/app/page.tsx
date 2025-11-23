'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import LogoBPA from '../assets/brasao.png';

export default function SignIn() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf) {
      toast.error('Digite o seu CPF.');
      return;
    }
    if (!password) {
      toast.error('Digite a sua senha.');
      return;
    }
    await signIn(cpf, password);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5">
      {/* Coluna esquerda - Login */}
      <div className="lg:col-span-2 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src={LogoBPA} alt="Logo BPA" width={50} height={50} />
            <div>
              <h1 className="text-2xl font-bold text-green-700">SISGOP</h1>
              <p className="text-sm text-gray-600">Batalhão de Polícia Ambiental</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold">Acesse sua conta</h2>
          <p className="text-gray-500">
            Entre com seu CPF e senha para acessar o sistema
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">CPF</Label>
              <Input
                id="email"
                type="text"
                placeholder="Digite seu cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>

      {/* Coluna direita - Background estilo MongoDB */}
      <div className="lg:col-span-3 hidden lg:flex relative items-center justify-center overflow-hidden">
        {/* Background SVG */}
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

        {/* Texto sobreposto */}
        <div className="relative z-10 text-center text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao SISGOP</h2>
          <p className="text-lg max-w-md mx-auto">
            Conecte-se com o sistema e tenha acesso às funcionalidades de gestão
            do Batalhão de Polícia Ambiental.
          </p>
        </div>
      </div>
    </div>
  );
}
