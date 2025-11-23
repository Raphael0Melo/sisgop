'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Menu, LogOut, Home, Book, Table, Lock, FilePenLine, UserCog, ServerCog, ChartLine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LogoBPA from '../../assets/brasao.png';
// import { SidebarContent } from './SidebarContent'; // opcional: separar conteúdo do Sidebar

export function Sidebar() {
  const { user, signOut, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const handleNavigation = (route: string) => {
    router.push(route);
    setOpenDrawer(false); // fecha drawer no mobile
  };

  const handleLogout = () => {
    signOut();
  };

  // Permissões
  const isBookDay = hasPermission('sistema:gerenciar');
  const isProductivity = hasPermission('sistema:gerenciar');
  const isControlCar = hasPermission('sistema:gerenciar');
  const isMapForce = hasPermission('sistema:gerenciar');
  const isAssessments = hasPermission('sistema:gerenciar');
  const isManagePeople = hasPermission('sistema:gerenciar');

  const menuItems = [
    { icon: Home, label: 'Início', route: '/home', show: true },
    { icon: Book, label: 'Livro do Dia', route: '/bookday', show: isBookDay },
    { icon: ChartLine, label: 'Produtividade', route: '/productivity', show: isProductivity },
    { icon: Lock, label: 'Controle de Acesso', route: '/controlcar', show: isControlCar },
    { icon: Table, label: 'Mapa Força', route: '/mapforce', show: isMapForce },
    { icon: FilePenLine, label: 'Autuações', route: '/assessments', show: isAssessments },
    { icon: UserCog, label: 'Efetivo', route: '/managepeople', show: isManagePeople },
    {
      icon: ServerCog,
      label: 'Sistema',
      show: isManagePeople,
      submenu: [
        { label: 'Permissões', route: '/permissions' },
        { label: 'Funções', route: '/profile' },
        { label: 'Postos/Graduações', route: '/graduation' },
        { label: 'Situações', route: '/situation' },
        { label: 'Unidades', route: '/unity' },
      ]
    },
  ];

  // =======================
  // Sidebar Component
  // =======================
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2">
          <Image src={LogoBPA} alt="Logo BPA" className="w-16 h-16 ml-2" />
        </div>
        <h2 className="text-lg font-semibold text-green-700">SISGOP</h2>
        <h2 className="text-lg font-normal text-green-700">BPA</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (!item.show) return null;

          const Icon = item.icon;
          const isActive = pathname === item.route;

          if (item.submenu) {
            return (
              <div key={index}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setOpenSubmenu(!openSubmenu)}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                  {openSubmenu ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>

                {openSubmenu && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((sub) => {
                      const isSubActive = pathname === sub.route;
                      return (
                        <Button
                          key={sub.route}
                          variant={isSubActive ? 'default' : 'ghost'}
                          className="w-full justify-start text-sm"
                          onClick={() => handleNavigation(sub.route)}
                        >
                          {sub.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Button
              key={item.route}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigation(item.route)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-2 truncate">
          {user?.graduacao?.sigla_graduation} {user?.graduacao?.group} {user?.nome_guerra}
        </div>
        <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  // =======================
  // Render
  // =======================
  return (
    <div className="flex">
      {/* Botão hamburguer no mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-0">
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Sidebar fixa no desktop */}
      <div className="hidden lg:block w-64 h-screen bg-white/90 border-r">
        <SidebarContent />
      </div>
    </div>
  );
}
