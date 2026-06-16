import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock, 
  Users, 
  FileDown, 
  Percent 
} from 'lucide-react';

export default function LaporanView() {
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Juni 2026');

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Berkas rekapitulasi kehadiran untuk bulan ${selectedMonth} berhasil digenerate dan dikompresi ke dalam berkas ZIP!`);
    }, 1500);
  };

  const widgets = [
    {
      title: 'Tingkat Ketepatan Waktu',
      value: '91.8%',
      desc: 'Meningkat 2.4% dari bulan lalu',
      icon: Percent,
      color: 'bg-emerald-500 text-white',
      badge: 'TERTINGGI',
      badgeColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Rata-rata Jam Kerja / Hari',
      value: '8j 12m',
      desc: 'Sesuai UU ketenagakerjaan',
      icon: Clock,
      color: 'bg-navy-brand text-white',
      badge: 'STABIL',
      badgeColor: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Total Akurasi Toleransi GPS',
      value: '99.1%',
      desc: 'Dalam batas radius kerja kantor',
      icon: Award,
      color: 'bg-purple-500 text-white',
      badge: 'OPTIMAL',
      badgeColor: 'bg-purple-50 text-purple-700'
    }
  ];

  const breakdownData = [
    { label: 'Hadir Tepat Waktu', count: 182, pct: '91.8%', color: 'bg-emerald-500' },
    { label: 'Terlambat Melapor', count: 11, pct: '5.5%', color: 'bg-amber-500' },
    { label: 'Sakit / Izin Sah', count: 4, pct: '2.0%', color: 'bg-indigo-500' },
    { label: 'Alpa / Tanpa Keterangan', count: 1, pct: '0.7%', color: 'bg-rose-500' }
  ];

  return (
    <div className="space-y-6" id="laporan-view-main">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4" id="laporan-header-wrap">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Laporan & Analisis Presensi</h2>
          <p className="text-sm text-slate-500 mt-1">Audit berkas rekap kehadiran bulanan, total jam lembur, dan tingkat kepatuhan.</p>
        </div>

        <div className="flex items-center gap-3 self-start" id="laporan-header-actions">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            id="laporan-select-month"
            className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="Juni 2026">Juni 2026</option>
            <option value="Mei 2026">Mei 2026</option>
            <option value="April 2026">April 2026</option>
          </select>
          <button
            onClick={handleExport}
            disabled={downloading}
            id="laporan-download-zip"
            className="bg-navy-brand hover:bg-[#071f37] text-white px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            <span>{downloading ? 'Mengekstrak...' : 'Unduh Laporan Bulanan'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Bento Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-analytics-row">
        {widgets.map((w, idx) => {
          const Icon = w.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl relative" id={`bento-card-${idx}`}>
              <div className="flex justify-between items-start" id={`bento-head-${idx}`}>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{w.title}</h4>
                  <p className="text-3xl font-extrabold text-[#092c4c] mt-2 font-display">{w.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${w.color}`} id={`bento-icon-box-${idx}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex justify-between items-center text-xs" id={`bento-footer-${idx}`}>
                <span className="text-slate-400 text-xs">{w.desc}</span>
                <span className={`px-2 py-0.5 rounded-sm font-extrabold tracking-wide text-[9px] uppercase ${w.badgeColor}`} id={`bento-badge-${idx}`}>
                  {w.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="laporan-breakdown-row">
        {/* Left Card: Attendance Breakdown Progress (Col Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between" id="report-breakdown-card">
          <div className="mb-4" id="report-breakdown-header">
            <h3 className="font-bold text-slate-800 text-base">Rasio Status Presensi Staf</h3>
            <p className="text-xs text-slate-400 mt-0.5">Analisis proporsi kehadiran dari total 198 penginputan bulan ini.</p>
          </div>

          <div className="space-y-4" id="report-breakdown-meters">
            {breakdownData.map((item, idx) => (
              <div key={idx} id={`breakdown-status-${idx}`}>
                <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-900 font-mono">{item.count} hari ({item.pct})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden" id={`breakdown-bg-${idx}`}>
                  <div 
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: item.pct }}
                    id={`breakdown-fill-${idx}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-400 font-medium" id="report-breakdown-notice">
            <span>Metode Sensus: Kearsipan Digital Terbuka</span>
            <span>Update: {selectedMonth}</span>
          </div>
        </div>

        {/* Right Card: Punctual Winner Award Card (Col Span 5) */}
        <div className="lg:col-span-5 bg-navy-brand text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]" id="punctual-winner-card">
          <div>
            <div className="p-3 bg-slate-800/60 rounded-xl mb-4 inline-flex text-white" id="winner-tag">
              <Award className="h-6 w-6 text-[#89e489]" />
            </div>
            <h3 className="text-lg font-bold font-display tracking-tight text-white" id="winner-title">
              Pegawai Paling Disiplin Bulan Ini
            </h3>
            
            <div className="mt-4 flex items-center gap-3.5" id="winner-profile">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Budi Santoso"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-[#89e489] object-cover"
                id="winner-pic"
              />
              <div>
                <h4 className="font-bold text-sm text-white">Budi Santoso</h4>
                <p className="text-xs text-slate-300 font-medium">Staf Administrasi &bull; NIP: 19930412...</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 mt-4 leading-relaxed italic" id="winner-notice">
              &ldquo;Budi Santoso berhasil mempertahankan tingkat ketepatan waktu sebesar 100% dari 22 hari kerja komitmen tanpa ada catatan keterlambatan ataupun mangkir.&rdquo;
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.05] pointer-events-none select-none">
            <Award className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
