import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  LogIn, 
  LogOut, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AttendanceRecord, Employee, Settings } from '../types';

interface DashboardPegawaiProps {
  currentEmployee: Employee;
  attendanceRecords: AttendanceRecord[];
  onClockIn: (gpsStatus: 'Dalam Radius Kantor' | 'Luar Radius Kantor', accuracy: number) => void;
  onClockOut: () => void;
  settings: Settings;
  switchToTab: (tab: string) => void;
}

export default function DashboardPegawai({
  currentEmployee,
  attendanceRecords,
  onClockIn,
  onClockOut,
  settings,
  switchToTab
}: DashboardPegawaiProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  // Simulation States
  const [simulatedRadius, setSimulatedRadius] = useState<'Dalam Radius Kantor' | 'Luar Radius Kantor'>('Dalam Radius Kantor');
  const [simulatedAccuracy, setSimulatedAccuracy] = useState<number>(5);

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // format time: HH.mm.ss
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}.${mm}.${ss}`);

      // format date: SELASA, 16 JUNI 2026 (or dynamic language-appropriate locale)
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formattedDate = now.toLocaleDateString('id-ID', options);
      setDateStr(formattedDate.toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter attendance records to find today's entry for Budi
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }); // e.g., "16 Jun 2026" or similar check
  
  const todayRecord = attendanceRecords.find(
    rec => rec.pegawaiId === currentEmployee.id && 
    (rec.tanggal.toLowerCase().includes('16 juni') || 
     rec.tanggal === todayStr ||
     rec.tanggal.toLowerCase().includes(new Date().toLocaleDateString('id-ID', { month: 'long' }).toLowerCase()))
  );

  // Calculate weekly work hours (Mock standard week 32j 15m + any clock session today if present)
  let weeklyHoursText = '32j 15m';
  let progressPercent = 80; // (32.25 hours / 40 hours) * 100

  if (todayRecord && todayRecord.jamMasuk && todayRecord.jamPulang) {
    // Both entries set -> add 8 hours to the display
    weeklyHoursText = '40j 15m';
    progressPercent = 100;
  } else if (todayRecord && todayRecord.jamMasuk) {
    // Process ongoing work hours
    weeklyHoursText = '36j 30m';
    progressPercent = 91;
  }

  // Get Budi's 7-day attendance logs
  const budiRecords = attendanceRecords
    .filter(rec => rec.pegawaiId === currentEmployee.id)
    .slice(0, 7);

  return (
    <div className="space-y-6" id="dashboard-pegawai-container">
      {/* Simulation Controller Header Box */}
      <div className="bg-[#ebf5fe] border border-blue-200 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between" id="location-simulator-box">
        <div className="flex items-center gap-2.5">
          <Sliders className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Simulator Lokasi GPS Pegawai</h3>
            <p className="text-xs text-blue-700">Gunakan widget ini untuk menyimulasikan apakah Anda sedang berada di dalam kantor atau di luar jangkauan.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSimulatedRadius('Dalam Radius Kantor');
              setSimulatedAccuracy(5);
            }}
            id="sim-k-in-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              simulatedRadius === 'Dalam Radius Kantor'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
            }`}
          >
            Masuk Radius (5m)
          </button>
          <button
            onClick={() => {
              setSimulatedRadius('Luar Radius Kantor');
              setSimulatedAccuracy(180);
            }}
            id="sim-k-out-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              simulatedRadius === 'Luar Radius Kantor'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
            }`}
          >
            Luar Jangkauan (180m)
          </button>
        </div>
      </div>

      {/* Top Section: Clock & Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="pegawai-hero-grid">
        {/* Real-time Clock Card (Col Span 8) */}
        <div className="md:col-span-8 bg-white border border-slate-200 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]" id="live-clock-card">
          <div id="clock-card-header">
            <span className="text-xs font-bold text-slate-400 tracking-wider">
              {dateStr || 'SELASA, 16 JUNI 2026'}
            </span>
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2 font-mono" id="live-clock-tick">
              {timeStr || '07.24.01'}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm mt-4 z-10" id="sync-status">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Sistem Sinkron (Real-time)</span>
          </div>

          {/* Faint design clock icon in the corner */}
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.03] select-none pointer-events-none" id="faint-clock">
            <Clock className="w-56 h-56 text-slate-800" />
          </div>
        </div>

        {/* Location Status Card (Col Span 4) */}
        <div className={`md:col-span-4 bg-white border p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
          simulatedRadius === 'Dalam Radius Kantor' ? 'border-[#89e489] shadow-sm shadow-emerald-50' : 'border-amber-200'
        }`} id="location-status-card">
          <div className="flex flex-col items-center text-center py-4" id="location-center">
            <div className={`p-4 rounded-2xl mb-3 ${
              simulatedRadius === 'Dalam Radius Kantor' ? 'bg-[#ebf9eb] text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`} id="location-pin-icon-box">
              <MapPin className="h-8 w-8" />
            </div>
            
            <span className="text-xs font-semibold text-slate-400">Status Lokasi</span>
            <h4 className={`text-lg font-bold mt-1 ${
              simulatedRadius === 'Dalam Radius Kantor' ? 'text-[#2c7a2c]' : 'text-amber-700'
            }`} id="location-status-value">
              {simulatedRadius}
            </h4>
          </div>

          <div className="space-y-2" id="location-accuracy-stats">
            {/* Visual accuracy bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden" id="accuracy-progress-bar">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  simulatedRadius === 'Dalam Radius Kantor' ? 'bg-[#2c7a2c] w-full' : 'bg-amber-500 w-1/4'
                }`}
                id="accuracy-progress-line"
              ></div>
            </div>
            <p className="text-xs text-slate-500 text-center font-medium font-mono" id="accuracy-text">
              Akurasi: {simulatedAccuracy} meter
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Action Check-In & Check-Out Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="attendance-actions-row">
        {/* ABSEN MASUK CARD */}
        <button
          onClick={() => {
            if (todayRecord && todayRecord.jamMasuk) {
              alert('Anda sudah melakukan absen masuk hari ini!');
              return;
            }
            onClockIn(simulatedRadius, simulatedAccuracy);
          }}
          disabled={!!(todayRecord && todayRecord.jamMasuk)}
          id="absen-masuk-card-button"
          className={`flex items-center justify-between p-6 rounded-2xl text-left transition-all relative ${
            todayRecord && todayRecord.jamMasuk
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-navy-brand hover:bg-[#071f37] text-white shadow-md active:scale-[0.99] group'
          }`}
        >
          <div className="flex items-center gap-5" id="masuk-btn-left">
            <div className={`p-4 rounded-xl flex items-center justify-center ${
              todayRecord && todayRecord.jamMasuk ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-white group-hover:scale-105 transition-transform'
            }`} id="masuk-btn-icon">
              <LogIn className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide uppercase">ABSEN MASUK</h3>
              <p className="text-sm opacity-80 mt-0.5">
                {todayRecord && todayRecord.jamMasuk 
                  ? `Sudah Absen pada ${todayRecord.jamMasuk}` 
                  : 'Mulai jam kerja Anda'}
              </p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 opacity-75 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* ABSEN PULANG CARD */}
        <button
          onClick={() => {
            if (!todayRecord || !todayRecord.jamMasuk) {
              alert('Anda belum melakukan absen masuk hari ini! Silakan melakukan absen masuk terlebih dahulu.');
              return;
            }
            if (todayRecord.jamPulang) {
              alert('Anda sudah melakukan absen pulang hari ini!');
              return;
            }
            onClockOut();
          }}
          disabled={!todayRecord || !todayRecord.jamMasuk || !!todayRecord.jamPulang}
          id="absen-pulang-card-button"
          className={`flex items-center justify-between p-6 rounded-2xl text-left transition-all border ${
            !todayRecord || !todayRecord.jamMasuk
              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
              : todayRecord.jamPulang
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white border-navy-brand hover:bg-slate-50 text-navy-brand shadow-sm active:scale-[0.99] group'
          }`}
        >
          <div className="flex items-center gap-5" id="pulang-btn-left">
            <div className={`p-4 rounded-xl flex items-center justify-center ${
              !todayRecord || !todayRecord.jamMasuk
                ? 'bg-slate-100 text-slate-300'
                : todayRecord.jamPulang
                ? 'bg-slate-200 text-slate-400'
                : 'bg-slate-100 text-navy-brand'
            }`} id="pulang-btn-icon">
              <LogOut className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide uppercase">ABSEN PULANG</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {todayRecord && todayRecord.jamPulang 
                  ? `Sudah Absen Pulang pada ${todayRecord.jamPulang}` 
                  : 'Akhiri jam kerja Anda'}
              </p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-slate-400 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* Row 3: Today's Status & Weekly History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-bottom-grid">
        {/* Bottom Left Card: Status Hari Ini (Col Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between" id="today-status-card">
          <h3 className="font-bold text-slate-800 text-base" id="today-status-title">Status Hari Ini</h3>

          <div className="my-5" id="today-presence-box">
            {/* Presence status highlight box */}
            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 flex items-center justify-between" id="today-presence-subbox">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Kehadiran</span>
                <span className={`text-sm font-extrabold mt-1 inline-block ${
                  todayRecord 
                    ? todayRecord.status === 'TEPAT WAKTU' 
                      ? 'text-emerald-700' 
                      : 'text-amber-700'
                    : 'text-rose-600'
                }`} id="today-presence-label">
                  {todayRecord ? todayRecord.status : 'BELUM ABSEN'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                {todayRecord ? 'SUDAH HADIR' : 'HARUS ABSEN'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed italic" id="attendance-tip text">
              {todayRecord 
                ? todayRecord.status === 'TEPAT WAKTU'
                  ? 'Kehadiran tercatat tepat waktu. Terima kasih atas kedisiplinan Anda!'
                  : 'Kehadiran tercatat terlambat. Silakan jaga kedisiplinan di hari berikutnya.'
                : 'Segera lakukan absen masuk sebelum jam 08:00 WIB agar tidak dianggap terlambat.'}
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4" id="weekly-indicators">
            <div id="weekly-work-hours-container">
              <div className="flex justify-between items-center text-sm mb-1.5">
                <span className="text-slate-600 font-medium">Total Jam Kerja (Minggu ini)</span>
                <span className="font-bold text-slate-900" id="weekly-hours-value">{weeklyHoursText}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden" id="weekly-hours-bg">
                <div 
                  className="h-full bg-navy-brand rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                  id="weekly-hours-fill"
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-sm" id="remaining-leave-container">
              <span className="text-slate-600 font-medium">Sisa Cuti Tahunan</span>
              <span className="font-bold text-slate-950 text-base" id="remaining-leave-value">
                {currentEmployee.sisaCuti} Hari
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right Card: Last 7 Days Attendance History (Col Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between" id="last-7days-card">
          <div className="flex justify-between items-center mb-4" id="last-7days-header">
            <h3 className="font-bold text-slate-800 text-base">Riwayat Absensi 7 Hari Terakhir</h3>
            <button 
              onClick={() => switchToTab('riwayat')}
              id="lihat-semua-history-link"
              className="text-xs font-bold text-navy-brand hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto" id="last-7days-table-container">
            <table className="w-full text-sm" id="last-7days-table">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 font-bold text-[11px] uppercase tracking-wider" id="last-7days-table-head">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold text-center">Jam Masuk</th>
                  <th className="pb-3 font-semibold text-center">Jam Pulang</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" id="last-7days-table-body">
                {budiRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors" id={`last-7days-row-${rec.id}`}>
                    <td className="py-3 font-medium text-slate-800">{rec.tanggal}</td>
                    <td className="py-3 text-center font-mono text-slate-600">{rec.jamMasuk || '--:--'}</td>
                    <td className="py-3 text-center font-mono text-slate-600">{rec.jamPulang || '--:--'}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${
                        rec.status === 'TEPAT WAKTU'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.status === 'TERLAMBAT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`} id={`last-7days-badge-${rec.id}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {budiRecords.length === 0 && (
                  <tr id="last-7days-empty">
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      Belum ada riwayat absensi minggu ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
