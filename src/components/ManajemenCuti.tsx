import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  FileText, 
  AlertCircle, 
  Check, 
  X, 
  Sparkles, 
  HeartHandshake, 
  HelpCircle,
  FileDown
} from 'lucide-react';
import { Employee, LeaveRequest } from '../types';

interface ManajemenCutiProps {
  currentEmployee: Employee;
  leaveRequests: LeaveRequest[];
  onSubmitRequest: (request: Omit<LeaveRequest, 'id' | 'namaPegawai' | 'nipPegawai' | 'jabatanPegawai' | 'tanggalPengajuan' | 'status'>) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  userRole: 'pegawai' | 'admin';
}

export default function ManajemenCuti({
  currentEmployee,
  leaveRequests,
  onSubmitRequest,
  onApproveLeave,
  onRejectLeave,
  userRole
}: ManajemenCutiProps) {
  // Form input states
  const [tipe, setTipe] = useState<'Cuti Tahunan' | 'Izin Sakit' | 'Izin Keperluan'>('Cuti Tahunan');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [alasan, setAlasan] = useState('');
  const [downloadingPolicy, setDownloadingPolicy] = useState(false);

  // Filter leave list
  // If Pegawai, only show their own. If Admin, show all.
  const displayRequests = userRole === 'pegawai' 
    ? leaveRequests.filter(req => req.pegawaiId === currentEmployee.id)
    : leaveRequests;

  const pendingCount = leaveRequests.filter(req => req.status === 'Menunggu').length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalMulai || !tanggalSelesai || !alasan) {
      alert('Silakan lengkapi seluruh field pada formulir pengajuan!');
      return;
    }

    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      alert('Tanggal Mulai tidak boleh lebih lambat daripada Tanggal Selesai!');
      return;
    }

    // Call submit handler
    onSubmitRequest({
      pegawaiId: currentEmployee.id,
      tipe,
      tanggalMulai,
      tanggalSelesai,
      alasan
    });

    // Reset Form
    setTanggalMulai('');
    setTanggalSelesai('');
    setAlasan('');
    alert('Pengajuan Cuti / Izin berhasil dikirimkan dan menunggu verifikasi Atasan!');
  };

  const handleDownloadPolicy = () => {
    setDownloadingPolicy(true);
    setTimeout(() => {
      setDownloadingPolicy(false);
      alert('Dokumen PDF Kebijakan Cuti Perangkat Desa v2.1 berhasil diunduh!');
    }, 1200);
  };

  return (
    <div className="space-y-6" id="manajemen-cuti-main">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5" id="cuti-header-wrapper">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Manajemen Izin & Cuti</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola pengajuan istirahat dan ketidakhadiran kerja perangkat desa.</p>
        </div>

        {/* Floating leave quota bubble */}
        <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex flex-col shadow-xs" id="leave-quota-bubble">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sisa Kuota Cuti</span>
          <span className="text-lg font-extrabold text-navy-brand mt-0.5" id="quota-value">
            {currentEmployee.sisaCuti} Hari Kerja
          </span>
        </div>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cuti-split-grid">
        {/* Left Column: Leave Request Form (Col Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between" id="cuti-form-card">
          <div>
            <div className="flex items-center gap-2 mb-4" id="form-cuti-title-box">
              <CalendarDays className="h-5 w-5 text-navy-brand" />
              <h3 className="font-bold text-slate-800 text-base">Formulir Pengajuan Cuti</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="form-pengajuan-cuti">
              {/* Jenis Ketidakhadiran */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Ketidakhadiran</label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value as any)}
                  id="cuti-input-tipe"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-brand transition-all"
                >
                  <option value="Cuti Tahunan">Cuti Tahunan</option>
                  <option value="Izin Sakit">Izin Sakit</option>
                  <option value="Izin Keperluan">Izin Keperluan</option>
                </select>
              </div>

              {/* Start and End date row */}
              <div className="grid grid-cols-2 gap-4" id="cuti-form-dates">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    id="cuti-input-start"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    id="cuti-input-end"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-brand focus:outline-none"
                  />
                </div>
              </div>

              {/* Alasan Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alasan / Keperluan</label>
                <textarea
                  required
                  placeholder="Jelaskan alasan pengajuan Anda secara singkat..."
                  rows={4}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  id="cuti-input-alasan"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 p-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-brand transition-all"
                />
              </div>

              {/* Coordinate notice message box */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-500" id="form-policy-notice">
                <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  Pastikan Anda telah berkoordinasi dengan atasan langsung sebelum mengajukan cuti melalui sistem informasi absensi desa.
                </p>
              </div>

              <button
                type="submit"
                id="form-cuti-submit-btn"
                className="w-full bg-navy-brand hover:bg-[#071f37] text-white py-3 rounded-xl font-bold tracking-wide text-sm shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajukan Sekarang</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between" id="cuti-right-column">
          {/* 1. Pending Verification Alert Panel (Admins Only or has notification) */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between gap-4" id="pending-alert-panel">
            <div className="flex items-center gap-3.5" id="pending-alert-left">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Verifikasi Tertunda</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {pendingCount > 0 
                    ? `Ada ${pendingCount} pengajuan baru yang membutuhkan persetujuan Anda.` 
                    : 'Tidak ada pengajuan cuti baru yang tertunda.'}
                </p>
              </div>
            </div>
            {userRole === 'admin' && pendingCount > 0 && (
              <button
                onClick={() => {
                  const firstPending = leaveRequests.find(r => r.status === 'Menunggu');
                  if (firstPending) {
                    const el = document.getElementById(`leave-item-row-${firstPending.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      el.classList.add('bg-indigo-50/50');
                      setTimeout(() => el.classList.remove('bg-indigo-50/50'), 2500);
                    }
                  }
                }}
                id="lih-semua-antrean-btn"
                className="px-3.5 py-2 bg-[#eaeefb] hover:bg-[#dae1f8] text-indigo-700 font-bold text-xs rounded-lg transition-all"
              >
                Lihat Antrean
              </button>
            )}
          </div>

          {/* 2. Status Pengajuan Terakhir Table / List (Dynamic based on selected Role) */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl flex-1 flex flex-col justify-between" id="history-requests-card">
            <div className="flex justify-between items-center mb-4" id="history-requests-header">
              <h3 className="font-bold text-slate-800 text-base">
                {userRole === 'admin' ? 'Daftar Semua Pengajuan Cuti' : 'Status Pengajuan Terakhir'}
              </h3>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Total: {displayRequests.length} record
              </span>
            </div>

            <div className="overflow-y-auto max-h-[310px] space-y-3 pr-1" id="leaves-scroll-container">
              {displayRequests.map((req) => {
                const dateRangeStr = `${new Date(req.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(req.tanggalSelesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;

                return (
                  <div 
                    key={req.id} 
                    id={`leave-item-row-${req.id}`}
                    className="border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-slate-200 transition-all"
                  >
                    <div className="space-y-1.5" id={`leave-info-left-${req.id}`}>
                      {/* Title / Dates */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1" id={`title-dates-${req.id}`}>
                        <span className="font-bold text-slate-800 text-sm">{req.tipe}</span>
                        <span className="text-[10px] font-mono text-slate-400 inline-block">({dateRangeStr})</span>
                      </div>
                      
                      {/* Reasons */}
                      <p className="text-xs text-slate-500 line-clamp-1 italic" id={`reason-${req.id}`}>
                        &ldquo;{req.alasan}&rdquo;
                      </p>

                      {/* Naming in Admin scope */}
                      {userRole === 'admin' && (
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-slate-400 uppercase" id={`meta-${req.id}`}>
                          <span>Oleh: {req.namaPegawai} ({req.jabatanPegawai})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0" id={`leave-status-right-${req.id}`}>
                      {/* Status Badges */}
                      <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${
                        req.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : req.status === 'Menunggu'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`} id={`leave-badge-${req.id}`}>
                        {req.status}
                      </span>

                      {/* Approval controls - ONLY available for Admin role in pending state */}
                      {userRole === 'admin' && req.status === 'Menunggu' && (
                        <div className="flex items-center gap-1.5" id={`approval-btns-${req.id}`}>
                          <button
                            onClick={() => onApproveLeave(req.id)}
                            id={`approve-btn-${req.id}`}
                            className="bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white p-1.5 rounded-lg transition-all"
                            title="Setujui Pengajuan"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onRejectLeave(req.id)}
                            id={`reject-btn-${req.id}`}
                            className="bg-rose-500 hover:bg-rose-600 hover:scale-105 active:scale-95 text-white p-1.5 rounded-lg transition-all"
                            title="Tolak Pengajuan"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayRequests.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic" id="leaves-empty-state">
                  Belum ada riwayat pengajuan izin/cuti.
                </div>
              )}
            </div>

            {/* Bottom aggregate stat indicators */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4" id="leave-sum-cards">
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between" id="sum-cuti-tahunan">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Cuti Diambil</span>
                  <span className="text-base font-bold text-emerald-950 block mt-0.5">
                    {currentEmployee.totalCutiDiambil} Hari
                  </span>
                </div>
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <HeartHandshake className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 flex items-center justify-between" id="sum-izin-sakit">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Total Izin Sakit</span>
                  <span className="text-base font-bold text-amber-950 block mt-0.5">
                    {currentEmployee.totalIzinSakit} Hari
                  </span>
                </div>
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                  <HeartHandshake className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom informational banner row */}
      <div className="bg-[#f0f4fc] border border-[#d2defc] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6" id="cuti-policy-banner">
        <div id="policy-banner-left">
          <h4 className="font-bold text-slate-800 text-base">Kebijakan Cuti Perangkat Desa</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-4xl">
            Setiap perangkat desa berhak mendapatkan cuti tahunan maksimal 12 hari kerja setiap tahunnya. Pengajuan harus diajukan minimal 3 hari sebelum tanggal pelaksanaan, kecuali untuk keperluan yang mendesak seperti izin kemalangan keluarga atau sakit mendadak.
          </p>
        </div>
        <button
          onClick={handleDownloadPolicy}
          disabled={downloadingPolicy}
          id="download-cuti-policy-btn"
          className="px-4 py-2.5 border border-[#103a61] hover:bg-[#103a61]/5 text-navy-brand text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <FileDown className="h-4 w-4 text-navy-brand" />
          <span>Unduh PDF Kebijakan</span>
        </button>
      </div>
    </div>
  );
}
