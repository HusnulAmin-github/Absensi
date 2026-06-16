import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  FileDown, 
  FileSpreadsheet, 
  Send, 
  Bell, 
  CalendarDays,
  Check,
  X,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveRequest } from '../types';
import { WEEKLY_COMMITMENT_DATA } from '../mockData';

interface DashboardAdminProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  switchToTab: (tab: string) => void;
}

export default function DashboardAdmin({
  employees,
  attendanceRecords,
  leaveRequests,
  onApproveLeave,
  onRejectLeave,
  switchToTab
}: DashboardAdminProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [whatsappSentUser, setWhatsappSentUser] = useState<string | null>(null);

  // Derive Admin statistics
  const totalEmployeesCount = 42; // standard count from Screenshot 2
  
  // Today's Date
  const todayStr = '16 June 2026';
  
  // Attended today
  const attendedToday = attendanceRecords.filter(
    rec => (rec.tanggal.toLowerCase().includes('16 june') || rec.tanggal.toLowerCase().includes('16 juni')) && 
    rec.jamMasuk !== null && 
    rec.status !== 'ALPA'
  );

  // Late today
  const lateToday = attendedToday.filter(rec => rec.status === 'TERLAMBAT');

  // Active leave today
  const approvedLeavesToday = leaveRequests.filter(
    req => req.status === 'Disetujui' && 
    (req.tanggalMulai <= '2026-06-16' && req.tanggalSelesai >= '2026-06-16')
  );

  const stats = [
    {
      title: 'Total Pegawai',
      value: String(totalEmployeesCount).padStart(2, '0'),
      subtitle: '+0%',
      icon: Users,
      infoColor: 'text-blue-600',
      bgColor: 'bg-slate-50'
    },
    {
      title: 'Hadir Hari Ini',
      value: String(36 + (attendedToday.length > 3 ? attendedToday.length - 3 : 0)).padStart(2, '0'),
      subtitle: `${Math.round(((36 + (attendedToday.length > 3 ? attendedToday.length - 3 : 0)) / totalEmployeesCount) * 100)}%`,
      icon: UserCheck,
      infoColor: 'text-emerald-600 font-bold',
      bgColor: 'bg-emerald-50/50'
    },
    {
      title: 'Terlambat',
      value: String(4 + (lateToday.length > 1 ? lateToday.length - 1 : 0)).padStart(2, '0'),
      subtitle: `${4 + (lateToday.length > 1 ? lateToday.length - 1 : 0)} Orang`,
      icon: Clock,
      infoColor: 'text-rose-600 font-bold',
      bgColor: 'bg-rose-50/50'
    },
    {
      title: 'Izin / Cuti',
      value: String(2 + approvedLeavesToday.length).padStart(2, '0'),
      subtitle: `${2 + approvedLeavesToday.length} Orang`,
      icon: Calendar,
      infoColor: 'text-amber-700 font-bold',
      bgColor: 'bg-amber-50/50'
    }
  ];

  // Quick Action Handler
  const handleExport = (format: 'pdf' | 'excel') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      alert(`Laporan kehadiran berhasil digenerate dalam format ${format.toUpperCase()}! File akan otomatis diunduh ke perangkat Anda.`);
    }, 1500);
  };

  // WhatsApp Alert Simulation
  const handleSendWA = (employeeName: string) => {
    setWhatsappSentUser(employeeName);
    setTimeout(() => {
      setWhatsappSentUser(null);
      alert(`Notifikasi Peringatan WhatsApp berhasil terkirim ke ponsel ${employeeName} agar segera melapor ke Kantor Desa.`);
    }, 1000);
  };

  // Get date for date picker button
  const formattedToday = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6" id="dashboard-admin-main">
      {/* Upper Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="admin-welcome-section">
        <div id="admin-welcome-text">
          <h2 className="text-2xl font-bold font-display text-slate-900 leading-tight">Ringkasan Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Admin. Pantau kehadiran hari ini.</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white border border-slate-200 shadow-xs px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium text-slate-700 self-start" id="admin-date-picker">
          <Calendar className="h-4.5 w-4.5 text-slate-400" />
          <span>{formattedToday}</span>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-stats-row">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl relative" id={`admin-stat-card-${idx}`}>
              <div className="flex justify-between items-start" id={`admin-stat-header-${idx}`}>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.title}</p>
                  <p className="text-3xl font-extrabold text-navy-brand mt-2 tracking-tight">{item.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${item.bgColor || 'bg-slate-50'}`} id={`admin-stat-icon-box-${idx}`}>
                  <Icon className={`h-5 w-5 ${item.infoColor.split(' ')[0]}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs" id={`admin-stat-sub-${idx}`}>
                <span className={`px-1.5 py-0.5 rounded-sm font-semibold ${item.bgColor || 'bg-slate-50'} ${item.infoColor}`} id={`admin-stat-badge-${idx}`}>
                  {item.subtitle}
                </span>
                <span className="text-slate-400">vs target absensi</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Graph & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="admin-charts-actions-row">
        {/* Weekly Attendance Bar Chart (Col Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between" id="admin-weekly-chart-card">
          <div className="flex justify-between items-center mb-6" id="weekly-chart-header">
            <h3 className="font-bold text-slate-800 text-base">Rekapitulasi Kehadiran Mingguan</h3>
            <div className="border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 pointer-events-none" id="weekly-chart-dropdown">
              <span>Minggu Ini</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          {/* Visual Custom Chart rendering using direct responsive SVG/flex grids */}
          <div className="h-64 flex flex-col justify-between" id="weekly-chart-body">
            {/* Grid chart rows */}
            <div className="flex-1 relative flex items-end gap-x-6 sm:gap-x-10 pl-6 border-b border-slate-100 pb-1" id="chart-stage">
              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300 font-mono" id="chart-y-axis">
                <div className="w-full border-b border-slate-100 pb-1 flex justify-between h-0"><span>40</span></div>
                <div className="w-full border-b border-slate-100 pb-1 flex justify-between h-0"><span>30</span></div>
                <div className="w-full border-b border-slate-100 pb-1 flex justify-between h-0"><span>20</span></div>
                <div className="w-full border-b border-slate-100 pb-1 flex justify-between h-0"><span>10</span></div>
              </div>

              {/* Individual Bar Pillars */}
              {WEEKLY_COMMITMENT_DATA.map((day, idx) => {
                // calculate percents (stacked, max 40)
                const totalPossible = 40;
                const hadirPercentage = (day.Hadir / totalPossible) * 100;
                const terlambatPercentage = (day.Terlambat / totalPossible) * 100;
                const unrecordedPercentage = 100 - hadirPercentage - terlambatPercentage;

                return (
                  <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group relative" id={`chart-bar-pillar-${day.name}`}>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                      Hadir: {day.Hadir} | Lambat: {day.Terlambat}
                    </div>

                    {/* Stacked bar cylinder */}
                    <div className="w-8 sm:w-10 bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end h-full relative" id={`pillar-bars-${idx}`}>
                      {/* Empty portion at top */}
                      <div style={{ height: `${unrecordedPercentage}%` }} className="bg-slate-100 w-full" id={`pillar-empty-${idx}`}></div>
                      {/* Terlambat bar (Orange/Red) */}
                      <div style={{ height: `${terlambatPercentage}%` }} className="bg-rose-500 w-full" id={`pillar-late-${idx}`}></div>
                      {/* Hadir bar (Deep Navy) */}
                      <div style={{ height: `${hadirPercentage}%` }} className="bg-navy-brand w-full" id={`pillar-present-${idx}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex pl-6 pr-0 pt-2 text-xs font-semibold text-slate-400 gap-x-6 sm:gap-x-10 text-center" id="chart-x-axis">
              {WEEKLY_COMMITMENT_DATA.map((day, idx) => (
                <span key={idx} className="flex-1" id={`chart-x-label-${day.name}`}>{day.name}</span>
              ))}
            </div>
          </div>

          {/* Legend indicator footer */}
          <div className="flex items-center gap-5 mt-6 border-t border-slate-100 pt-4 text-xs font-semibold" id="chart-legend">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-navy-brand rounded-xs"></span>
              <span className="text-slate-600">Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-rose-500 rounded-xs"></span>
              <span className="text-slate-600">Terlambat</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Actions & Notification (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="admin-quick-actions-column">
          {/* Aksi Cepat Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl" id="quick-actions-card">
            <h3 className="font-bold text-slate-800 text-base mb-4" id="quick-actions-title">Aksi Cepat</h3>
            <div className="space-y-4" id="quick-actions-list">
              {/* Export PDF Button */}
              <button
                onClick={() => handleExport('pdf')}
                disabled={downloadingFormat !== null}
                id="act-export-pdf"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                    <FileDown className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Ekspor Laporan PDF</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Format resmi kearsipan</p>
                  </div>
                </div>
              </button>

              {/* Export Excel Button */}
              <button
                onClick={() => handleExport('excel')}
                disabled={downloadingFormat !== null}
                id="act-export-excel"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <FileSpreadsheet className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Ekspor Laporan Excel</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Data mentah untuk analisis</p>
                  </div>
                </div>
              </button>

              {/* WhatsApp Alert Broadcast Trigger */}
              <button
                onClick={() => {
                  const names = ['Ahmad Dahlan', 'Bambang Pamungkas'];
                  const picked = names[Math.floor(Math.random() * names.length)];
                  handleSendWA(picked);
                }}
                disabled={whatsappSentUser !== null}
                id="act-send-notif"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Smartphone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Kirim Notifikasi</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Kirim peringatan ke WhatsApp</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Deep Blue Quick Info Notice Banner (matching screen exactly) */}
          <div className="bg-navy-brand text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between flex-1 min-h-[140px]" id="admin-notice-banner">
            <div>
              <h4 className="font-bold tracking-wide text-base">Informasi Penting</h4>
              <p className="text-xs opacity-80 leading-relaxed mt-2.5">
                Batas input absen hari ini: 09:00 WIB. Pastikan data tervalidasi sebelum jam pulang agar grafik mingguan terekam dengan akurat.
              </p>
            </div>
            {/* Minimal design lines */}
            <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 select-none">
              <Users className="w-36 h-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Pegawai Belum Absen Hari Ini (Long Card) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl" id="unabsented-employees-card">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4" id="unabsented-header">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Pegawai Belum Absen Hari Ini</h3>
            <p className="text-xs text-slate-400 mt-0.5">Update terakhir: 08:30 WIB</p>
          </div>
          <button 
            onClick={() => switchToTab('pegawai')}
            id="admin-viewall-unabsented"
            className="text-xs font-bold text-navy-brand hover:underline self-start"
          >
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto" id="unabsented-table-container">
          <table className="w-full text-sm text-slate-700" id="unabsented-table">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold text-left">Pegawai</th>
                <th className="pb-3 font-semibold text-left">Jabatan</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Ahmad Dahlan Row */}
              <tr className="hover:bg-slate-50/50 transition-colors" id="unabsented-row-ahmad">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                      AD
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Ahmad Dahlan</h4>
                      <p className="text-xs text-slate-400">NIP: 19820315...</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-slate-500 text-xs font-medium">Kepala Seksi Pelayanan</td>
                <td className="py-4 text-center">
                  <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide uppercase bg-rose-50 text-rose-600 border border-rose-100">
                    Alpa / Belum Hadir
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleSendWA('Ahmad Dahlan')}
                    id="wa-trigger-ahmad"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-navy-brand rounded-lg inline-flex items-center gap-1.5 transition-all text-xs font-semibold"
                    title="Kirim Notifikasi Peringatan WA"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Peringatkan</span>
                  </button>
                </td>
              </tr>

              {/* Siti Rahma Row (Menunggu Izin) */}
              <tr className="hover:bg-slate-50/50 transition-colors" id="unabsented-row-siti">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      SR
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Siti Rahma</h4>
                      <p className="text-xs text-slate-400">NIP: 19890724...</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-slate-500 text-xs font-medium">Bendahara Desa</td>
                <td className="py-4 text-center">
                  <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    Menunggu Izin
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => switchToTab('cuti')}
                    id="manage-cuti-siti"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-cyan-700 rounded-lg inline-flex items-center gap-1.5 transition-all text-xs font-semibold"
                    title="Kelola Pengajuan Cuti"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Kelola Izin</span>
                  </button>
                </td>
              </tr>

              {/* Bambang Pamungkas Row */}
              <tr className="hover:bg-slate-50/50 transition-colors" id="unabsented-row-bambang">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                      BP
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Bambang Pamungkas</h4>
                      <p className="text-xs text-slate-400">NIP: 19751103...</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-slate-500 text-xs font-medium">Kepala Dusun I</td>
                <td className="py-4 text-center">
                  <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide uppercase bg-rose-50 text-rose-600 border border-rose-100">
                    Alpa / Belum Hadir
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => handleSendWA('Bambang Pamungkas')}
                    id="wa-trigger-bambang"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-navy-brand rounded-lg inline-flex items-center gap-1.5 transition-all text-xs font-semibold"
                    title="Kirim Notifikasi Peringatan WA"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Peringatkan</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
