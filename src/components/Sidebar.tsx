import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  CalendarDays, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'pegawai' | 'admin';
  setUserRole: (role: 'pegawai' | 'admin') => void;
  resetAllData: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  setUserRole,
  resetAllData 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'cuti', label: 'Cuti', icon: CalendarDays },
    { id: 'pegawai', label: 'Pegawai', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <aside className="w-68 bg-white border-r border-slate-200 h-screen flex flex-col justify-between sticky top-0 shrink-0 text-slate-800" id="app-sidebar">
      <div>
        {/* Logo / Header */}
        <div className="p-6 border-b border-slate-100" id="sidebar-logo-container">
          <h1 className="text-xl font-bold text-navy-brand tracking-tight font-display" id="sidebar-brand-name">
            Kantor Desa
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5" id="sidebar-brand-subtitle">
            Sistem Absensi
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1" id="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#c6f0c6] text-[#2c7a2c] font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#2c7a2c]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 space-y-4" id="sidebar-footer">
        {/* Role Switcher Widget - for premium interactive control */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2" id="role-switcher-widget">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode Demonstrasi</p>
          <div className="grid grid-cols-2 gap-1" id="role-switcher-buttons">
            <button
              onClick={() => setUserRole('pegawai')}
              id="switch-pegawai-btn"
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center border transition-all ${
                userRole === 'pegawai'
                  ? 'bg-navy-brand text-white border-navy-brand'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <UserCheck className="h-4 w-4 mb-1" />
              <span className="text-[10px] font-semibold">Pegawai</span>
            </button>
            <button
              onClick={() => setUserRole('admin')}
              id="switch-admin-btn"
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center border transition-all ${
                userRole === 'admin'
                  ? 'bg-navy-brand text-white border-navy-brand'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4 mb-1" />
              <span className="text-[10px] font-semibold">Admin</span>
            </button>
          </div>
        </div>

        <div className="space-y-1" id="sidebar-subfooter-links">
          <button
            onClick={() => setActiveTab('pengaturan')}
            id="sidebar-item-pengaturan"
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pengaturan'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="h-5 w-5 text-slate-400" />
            <span>Pengaturan</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Apakah Anda ingin merestore semua data simulasi ke awal?')) {
                resetAllData();
              }
            }}
            id="sidebar-item-keluar"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <span>Reset / Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
