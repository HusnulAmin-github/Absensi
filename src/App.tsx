import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  HelpCircle, 
  AlertCircle,
  Menu,
  ChevronDown
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardPegawai from './components/DashboardPegawai';
import DashboardAdmin from './components/DashboardAdmin';
import ManajemenCuti from './components/ManajemenCuti';
import RiwayatView from './components/RiwayatView';
import PegawaiView from './components/PegawaiView';
import LaporanView from './components/LaporanView';
import SettingsView from './components/SettingsView';

import { Employee, AttendanceRecord, LeaveRequest, Settings } from './types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES, 
  DEFAULT_SETTINGS 
} from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'pegawai' | 'admin'>('pegawai');

  // Core synchronized State engines
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('absensi_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('absensi_records');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('absensi_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('absensi_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('absensi_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('absensi_records', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('absensi_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('absensi_settings', JSON.stringify(settings));
  }, [settings]);

  // Current active employee (Budi Santoso)
  const currentEmployee = employees.find(emp => emp.id === 'emp-budi') || employees[0];

  // Restores simulation to factory standards
  const resetAllData = () => {
    localStorage.removeItem('absensi_employees');
    localStorage.removeItem('absensi_records');
    localStorage.removeItem('absensi_leaves');
    localStorage.removeItem('absensi_settings');
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setSettings(DEFAULT_SETTINGS);
    setActiveTab('dashboard');
    setUserRole('pegawai');
  };

  // Helper to count calendar days requested
  const countDays = (start: string, end: string): number => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  // Handle Budi's Clocking-In Action
  const handleClockIn = (gpsStatus: 'Dalam Radius Kantor' | 'Luar Radius Kantor', accuracy: number) => {
    const now = new Date();
    
    // time formatted to HH:mm
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStrToday = `${hh}:${mm}`;

    // evaluate status cutoff
    const [cutoffH, cutoffM] = settings.officeStartTime.split(':').map(Number);
    const isLate = now.getHours() > cutoffH || (now.getHours() === cutoffH && now.getMinutes() > cutoffM);
    const finalPresensiStatus = isLate ? 'TERLAMBAT' : 'TEPAT WAKTU';

    // date formatted to DD Mei YYYY (Indonesian)
    const formattedTanggal = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newRecord: AttendanceRecord = {
      id: `att-live-${Date.now()}`,
      pegawaiId: currentEmployee.id,
      nama: currentEmployee.nama,
      nip: currentEmployee.nip,
      jabatan: currentEmployee.jabatan,
      tanggal: formattedTanggal,
      jamMasuk: timeStrToday,
      jamPulang: null,
      status: finalPresensiStatus,
      akurasi: accuracy,
      radiusStatus: gpsStatus
    };

    setAttendance([newRecord, ...attendance]);
  };

  // Handle Budi's Clocking-Out Action
  const handleClockOut = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStrToday = `${hh}:${mm}`;

    const formattedTanggal = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setAttendance(prev => prev.map(rec => {
      // Find today's checkin to update check-out
      if (rec.pegawaiId === currentEmployee.id && 
         (rec.tanggal === formattedTanggal || 
          rec.tanggal.toLowerCase().includes(now.toLocaleDateString('id-ID', { month: 'long' }).toLowerCase()))) {
        return {
          ...rec,
          jamPulang: timeStrToday
        };
      }
      return rec;
    }));
  };

  // Submit new leave request (by Employee profile)
  const handleSubmitLeave = (requestData: Omit<LeaveRequest, 'id' | 'namaPegawai' | 'nipPegawai' | 'jabatanPegawai' | 'tanggalPengajuan' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const newRequest: LeaveRequest = {
      id: `leave-live-${Date.now()}`,
      pegawaiId: requestData.pegawaiId,
      namaPegawai: currentEmployee.nama,
      nipPegawai: currentEmployee.nip,
      jabatanPegawai: currentEmployee.jabatan,
      tipe: requestData.tipe as any,
      tanggalMulai: requestData.tanggalMulai,
      tanggalSelesai: requestData.tanggalSelesai,
      alasan: requestData.alasan,
      status: 'Menunggu',
      tanggalPengajuan: today
    };

    setLeaves([newRequest, ...leaves]);
  };

  // Admin approves leave request -> updates employee stats of leave/sick days
  const handleApproveLeave = (reqId: string) => {
    setLeaves(prev => prev.map(req => {
      if (req.id === reqId && req.status === 'Menunggu') {
        const days = countDays(req.tanggalMulai, req.tanggalSelesai);
        
        // Update associated employee leave metrics
        setEmployees(prevEmp => prevEmp.map(emp => {
          if (emp.id === req.pegawaiId) {
            if (req.tipe === 'Izin Sakit') {
              return {
                ...emp,
                totalIzinSakit: emp.totalIzinSakit + days
              };
            } else {
              return {
                ...emp,
                sisaCuti: Math.max(0, emp.sisaCuti - days),
                totalCutiDiambil: emp.totalCutiDiambil + days
              };
            }
          }
          return emp;
        }));

        // create custom attendance record block marking CUTI or EXEMPT status
        const now = new Date();
        const formattedTanggal = now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        const leaveAttendance: AttendanceRecord = {
          id: `att-leave-ex-${Date.now()}`,
          pegawaiId: req.pegawaiId,
          nama: req.namaPegawai,
          nip: req.nipPegawai,
          jabatan: req.jabatanPegawai,
          tanggal: formattedTanggal,
          jamMasuk: '--:--',
          jamPulang: '--:--',
          status: 'CUTI',
          akurasi: 0,
          radiusStatus: 'Dalam Radius Kantor'
        };
        setAttendance(prevAttendance => [leaveAttendance, ...prevAttendance]);

        return { ...req, status: 'Disetujui' };
      }
      return req;
    }));
  };

  // Admin rejects leave request
  const handleRejectLeave = (reqId: string) => {
    setLeaves(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Ditolak' };
      }
      return req;
    }));
  };

  // Admin adds new employee profile
  const handleAddEmployee = (newEmpData: Omit<Employee, 'id' | 'totalCutiDiambil' | 'totalIzinSakit'>) => {
    const newEmp: Employee = {
      id: `emp-live-${Date.now()}`,
      nama: newEmpData.nama,
      nip: newEmpData.nip,
      jabatan: newEmpData.jabatan,
      foto: newEmpData.foto,
      sisaCuti: newEmpData.sisaCuti,
      totalCutiDiambil: 0,
      totalIzinSakit: 0
    };
    setEmployees([...employees, newEmp]);
  };

  // Sync settings modifications
  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  // Routing render helpers
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return userRole === 'pegawai' ? (
          <DashboardPegawai
            currentEmployee={currentEmployee}
            attendanceRecords={attendance}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            settings={settings}
            switchToTab={setActiveTab}
          />
        ) : (
          <DashboardAdmin
            employees={employees}
            attendanceRecords={attendance}
            leaveRequests={leaves}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            switchToTab={setActiveTab}
          />
        );
      case 'riwayat':
        return (
          <RiwayatView
            attendanceRecords={attendance}
            userRole={userRole}
            currentEmployeeId={currentEmployee.id}
            settings={settings}
          />
        );
      case 'cuti':
        return (
          <ManajemenCuti
            currentEmployee={currentEmployee}
            leaveRequests={leaves}
            onSubmitRequest={handleSubmitLeave}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
            userRole={userRole}
          />
        );
      case 'pegawai':
        return (
          <PegawaiView
            employees={employees}
            attendanceRecords={attendance}
            onAddEmployee={handleAddEmployee}
            userRole={userRole}
          />
        );
      case 'laporan':
        return <LaporanView />;
      case 'pengaturan':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            resetAllData={resetAllData}
          />
        );
      default:
        return (
          <div className="p-8 text-center" id="routing-fallback">
            Konten tidak ditemukan.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800" id="application-layout-core">
      {/* 1. Sidebar Panel (Left) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        setUserRole={setUserRole}
        resetAllData={resetAllData}
      />

      {/* 2. Main Workspace Content (Right) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto" id="workspace-container">
        {/* Top Header Bar Layout */}
        <header className="bg-white border-b border-slate-200 sticky top-0 px-6 sm:px-8 py-4 flex items-center justify-between shrink-0 z-20" id="workspace-topbar">
          {/* Left Title section of top bar */}
          <div className="flex items-center gap-3" id="topbar-left">
            <h1 className="text-base sm:text-lg font-bold font-display text-navy-brand" id="topbar-title">
              {userRole === 'pegawai' ? 'Dashboard Pegawai' : 'Sistem Absensi Desa'}
            </h1>
            
            {userRole === 'admin' && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-150">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Status Server: Stabil</span>
              </span>
            )}
          </div>

          {/* Right profile detail section */}
          <div className="flex items-center gap-4 sm:gap-6" id="topbar-right">
            {/* Notification bell */}
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition-all hover:bg-slate-50 relative" id="header-notif-bell">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            {userRole === 'admin' && (
              <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition-all hover:bg-slate-50" id="header-help-icon">
                <HelpCircle className="h-5 w-5" />
              </button>
            )}

            {/* Vertical Split Line */}
            <div className="h-6 w-px bg-slate-200" id="header-divider"></div>

            {/* Profile Avatar Widget */}
            <div className="flex items-center gap-3" id="header-profile-box">
              {userRole === 'pegawai' ? (
                <>
                  <div className="text-right hidden sm:block" id="profile-names">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{currentEmployee.nama}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">{currentEmployee.jabatan}</p>
                  </div>
                  <img
                    src={currentEmployee.foto}
                    alt={currentEmployee.nama}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl border border-slate-200 object-cover"
                    id="header-profile-avatar"
                  />
                </>
              ) : (
                <>
                  <div className="text-right hidden sm:block" id="profile-names-admin">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">Admin Utama</h4>
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Sistem Administrator</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-[#89e489] font-bold flex items-center justify-center border border-slate-700 font-display text-sm" id="header-admin-avatar">
                    AD
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic component viewport workspace */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto" id="workspace-main-viewport">
          {renderTabContent()}
        </main>

        {/* Universal footer */}
        <footer className="py-6 border-t border-slate-200 text-center text-xs font-medium text-slate-400 bg-white" id="workspace-global-footer">
          &copy; {new Date().getFullYear()} Kantor Desa Digital. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  );
}
