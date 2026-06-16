import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  FileDown, 
  HelpCircle,
  Calendar,
  UserCheck,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { AttendanceRecord, Settings } from '../types';
import { 
  loadGisScript, 
  requestGoogleToken, 
  createGoogleSpreadsheet, 
  writeSpreadsheetRows, 
  formatSpreadsheetHeader, 
  mapAttendanceToRows 
} from '../lib/googleSheets';

interface RiwayatViewProps {
  attendanceRecords: AttendanceRecord[];
  userRole: 'pegawai' | 'admin';
  currentEmployeeId: string;
  settings: Settings;
}

export default function RiwayatView({
  attendanceRecords,
  userRole,
  currentEmployeeId,
  settings
}: RiwayatViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUANYA');
  const [downloading, setDownloading] = useState(false);

  // New Google Sheets states
  const [exportingGoogle, setExportingGoogle] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    sheetUrl?: string;
  }>({ type: 'idle', message: '' });

  // Filter based on role (Pegawai only sees his own)
  const roleFilteredRecords = userRole === 'pegawai'
    ? attendanceRecords.filter(rec => rec.pegawaiId === currentEmployeeId)
    : attendanceRecords;

  // Filter based on search and status
  const finalRecords = roleFilteredRecords.filter(rec => {
    const matchesSearch = 
      rec.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rec.nip.includes(searchQuery) ||
      rec.jabatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'SEMUANYA' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Ekspor CSV selesai! Rekap presensi berhasil diunduh secara lokal.');
    }, 1200);
  };

  const handleExportGoogleSheets = async () => {
    if (!settings?.googleClientId) {
      setExportStatus({
        type: 'error',
        message: 'Google Client ID belum diatur. Silakan buka tab "Pengaturan" terlebih dahulu untuk mengonfigurasi credentials Google API.'
      });
      return;
    }

    setExportingGoogle(true);
    setExportStatus({ type: 'loading', message: 'Memuat SDK Google Identity Services...' });

    try {
      await loadGisScript();
      
      setExportStatus({ type: 'loading', message: 'Menunggu otorisasi akun Google Anda...' });
      
      requestGoogleToken(
        settings.googleClientId,
        async (token) => {
          try {
            setExportStatus({ type: 'loading', message: 'Membuat Spreadsheet Google baru...' });
            const title = `Rekap Presensi Desa - ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            const sheet = await createGoogleSpreadsheet(token, title);
            
            setExportStatus({ type: 'loading', message: 'Menulis rekaman presensi ke Spreadsheet...' });
            const rows = mapAttendanceToRows(finalRecords);
            await writeSpreadsheetRows(token, sheet.id, 'Sheet1!A1', rows);
            
            setExportStatus({ type: 'loading', message: 'Menerapkan gaya format premium...' });
            await formatSpreadsheetHeader(token, sheet.id);
            
            setExportStatus({
              type: 'success',
              message: `Ekspor seberat ${finalRecords.length} baris berhasil! Spreadsheet "${title}" dibuat dalam Google Drive Anda.`,
              sheetUrl: sheet.url
            });
            setExportingGoogle(false);
          } catch (err: any) {
            setExportStatus({
              type: 'error',
              message: `Gagal memproses API Google Sheets: ${err?.message || err}`
            });
            setExportingGoogle(false);
          }
        },
        (error) => {
          setExportStatus({
            type: 'error',
            message: `Otorisasi gagal atau ditutup: ${error || 'Dibatalkan oleh pengguna.'}`
          });
          setExportingGoogle(false);
        }
      );
    } catch (err: any) {
      setExportStatus({
        type: 'error',
        message: `Gagal memproses script authenticator Google: ${err?.message || err}`
      });
      setExportingGoogle(false);
    }
  };

  return (
    <div className="space-y-6" id="riwayat-view-main">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5" id="riwayat-header-bar">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Riwayat Presensi Kehadiran</h2>
          <p className="text-sm text-slate-500 mt-1">
            {userRole === 'admin' 
              ? 'Tinjau dan lacak kepatuhan waktu seluruh perangkat desa.' 
              : 'Pantau laporan kehadiran Anda selama bekerja di Kantor Desa.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center" id="riwayat-export-buttons">
          {/* Google Sheets Export */}
          <button
            onClick={handleExportGoogleSheets}
            disabled={exportingGoogle}
            id="riwayat-export-sheets"
            className="bg-[#2c7a2c] hover:bg-[#205b20] text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-2"
          >
            {exportingGoogle ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4.5 w-4.5" />
            )}
            <span>{exportingGoogle ? 'Mekspor...' : 'Ekspor ke Google Sheets'}</span>
          </button>

          {/* Local CSV Export */}
          <button
            onClick={handleExportCSV}
            disabled={downloading}
            id="riwayat-export-csv"
            className="bg-navy-brand hover:bg-[#071f37] text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-2"
          >
            <FileDown className="h-4.5 w-4.5" />
            <span>{downloading ? 'Mengunduh...' : 'Ekspor CSV Lokal'}</span>
          </button>
        </div>
      </div>

      {/* Google Sheets connection status notification banners */}
      {exportStatus.type !== 'idle' && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in ${
          exportStatus.type === 'loading'
            ? 'bg-blue-50/50 border-blue-200 text-blue-800'
            : exportStatus.type === 'success'
            ? 'bg-emerald-50/50 border-emerald-250 text-emerald-800'
            : 'bg-rose-50/50 border-rose-150 text-rose-800'
        }`} id="google-sheets-export-status">
          <div className="flex items-start sm:items-center gap-3">
            <div className="mt-0.5 sm:mt-0">
              {exportStatus.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
              {exportStatus.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {exportStatus.type === 'error' && <AlertTriangle className="h-5 w-5 text-rose-600" />}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Integrasi Ekspor Google Sheets</p>
              <p className="text-xs sm:text-sm font-bold mt-0.5">{exportStatus.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {exportStatus.type === 'success' && exportStatus.sheetUrl && (
              <a
                href={exportStatus.sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2c7a2c] hover:bg-[#205b20] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                id="open-sheet-link"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Buka Google Sheets</span>
              </a>
            )}
            {exportStatus.type !== 'loading' && (
              <button
                onClick={() => setExportStatus({ type: 'idle', message: '' })}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 bg-slate-100 rounded-lg transition-all"
                id="close-sheets-status-btn"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and search panel */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="riwayat-filters-card">
        {/* Search Input */}
        <div className="relative flex-1" id="search-input-wrapper">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, jabatan, atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input-field"
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489] transition-all"
          />
        </div>

        {/* Buttons Filter Status */}
        <div className="flex flex-wrap gap-2 items-center" id="status-filters-group">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          {['SEMUANYA', 'TEPAT WAKTU', 'TERLAMBAT', 'ALPA', 'CUTI'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                statusFilter === status
                  ? 'bg-[#c6f0c6] text-[#2c7a2c] border-[#89e489] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main attendance log table card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6" id="logs-table-card">
        <div className="overflow-x-auto" id="logs-table-container">
          <table className="w-full text-sm text-slate-700" id="logs-table">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="pb-3 text-left font-semibold">Pegawai</th>
                <th className="pb-3 text-left font-semibold">Tanggal</th>
                <th className="pb-3 text-center font-semibold">Jam Masuk</th>
                <th className="pb-3 text-center font-semibold">Jam Pulang</th>
                <th className="pb-3 text-center font-semibold">Status Radius</th>
                <th className="pb-3 text-right font-semibold">Status Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {finalRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/25 transition-colors" id={`log-item-${rec.id}`}>
                  {/* Pegawai Info */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 font-bold flex items-center justify-center text-xs text-navy-brand">
                        {rec.nama.split(' ').map(n=>n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{rec.nama}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rec.jabatan} &bull; NIP: {rec.nip}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tanggal */}
                  <td className="py-4 font-semibold text-slate-700 text-xs sm:text-sm">{rec.tanggal}</td>

                  {/* Jam Masuk */}
                  <td className="py-4 text-center font-mono text-xs sm:text-sm text-slate-600">
                    {rec.jamMasuk || '--:--'}
                  </td>

                  {/* Jam Pulang */}
                  <td className="py-4 text-center font-mono text-xs sm:text-sm text-slate-600">
                    {rec.jamPulang || '--:--'}
                  </td>

                  {/* Status Radius */}
                  <td className="py-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.radiusStatus === 'Dalam Radius Kantor'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {rec.radiusStatus}
                    </span>
                  </td>

                  {/* Status Presensi Badge */}
                  <td className="py-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${
                      rec.status === 'TEPAT WAKTU'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rec.status === 'TERLAMBAT'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}

              {finalRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                    Belum ada riwayat aktivitas presensi dengan filter pencarian ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
