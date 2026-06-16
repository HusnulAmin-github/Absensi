import React, { useState } from 'react';
import { Settings as SettingsIcon, MapPin, Clock, Sliders, ShieldCheck, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Settings } from '../types';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  resetAllData: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  resetAllData
}: SettingsViewProps) {
  const [lat, setLat] = useState(String(settings.officeLatitude));
  const [lng, setLng] = useState(String(settings.officeLongitude));
  const [radius, setRadius] = useState(String(settings.maxRadius));
  const [startTime, setStartTime] = useState(settings.officeStartTime);

  // New states for Google Sheets Configuration
  const [clientId, setClientId] = useState(settings.googleClientId || '');
  const [spreadsheetId, setSpreadsheetId] = useState(settings.googleSpreadsheetId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng || !radius || !startTime) {
      alert('Semua parameter pengaturan wajib diisi!');
      return;
    }

    onUpdateSettings({
      ...settings,
      officeLatitude: Number(lat),
      officeLongitude: Number(lng),
      maxRadius: Number(radius),
      allowOverrideLocation: true,
      officeStartTime: startTime
    });

    alert('Parameter Sistem Absensi Kantor Desa berhasil diperbarui!');
  };

  const handleSheetsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      googleClientId: clientId.trim(),
      googleSpreadsheetId: spreadsheetId.trim()
    });
    alert('Konfigurasi integrasi Google Sheets & Drive API berhasil diperbarui!');
  };

  return (
    <div className="space-y-6" id="settings-view-main">
      {/* Header section */}
      <div className="border-b border-slate-100 pb-5" id="settings-header">
        <h2 className="text-2xl font-bold font-display text-slate-900">Pengaturan Sistem Absensi</h2>
        <p className="text-sm text-slate-500 mt-1">Sesuaikan koordinat batas wilayah kantor desa, batas toleransi akurasi GPS, dan integrasi Google Sheets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="settings-grid">
        {/* Left Form: Parameter Controls (Col Span 8) */}
        <div className="lg:col-span-8 space-y-6" id="settings-left-col">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6" id="settings-form">
            <div className="flex items-center gap-2 mb-2" id="settings-section-title">
              <Sliders className="h-5 w-5 text-navy-brand" />
              <h3 className="font-bold text-slate-800 text-base">Parameter Kebijakan Absensi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="settings-parameters-grid">
              {/* Latitude Coordinates */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Latitude Kantor Desa</label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  id="setting-input-lat"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-brand"
                />
              </div>

              {/* Longitude Coordinates */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Longitude Kantor Desa</label>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  id="setting-input-lng"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-brand"
                />
              </div>

              {/* Max Allowable Radius Range */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Batas Jangkauan Radius (Meter)</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={5000}
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  id="setting-input-radius"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-brand"
                />
              </div>

              {/* Office start entry time */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Jam Masuk Toleransi (HH:MM)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08:00"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  id="setting-input-time"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-brand"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end" id="settings-form-submit">
              <button
                type="submit"
                id="settings-save-button"
                className="bg-navy-brand hover:bg-[#071f37] text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>

          {/* Google Sheets Integration Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 animate-fade-in" id="google-sheets-card">
            <div className="flex items-center gap-2" id="sheets-section-title">
              <FileSpreadsheet className="h-5 w-5 text-[#2c7a2c]" />
              <h3 className="font-bold text-slate-800 text-base">Integrasi Google Sheets & Drive</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed md:max-w-2xl">
              Gunakan Google Sheets secara langsung di aplikasi ini. Anda dapat mengekspor rekapitulasi data presensi dan sejarah cuti perangkat desa secara real-time ke dalam spreadsheets Google Drive pribadi Anda.
            </p>

            <form onSubmit={handleSheetsSubmit} className="space-y-4" id="sheets-config-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Google OAuth Client ID</label>
                  <input
                    type="text"
                    placeholder="Masukkan Google Client ID dari GCP Console..."
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    id="setting-input-client-id"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Spreadsheet ID Default (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1szYm... (Kosongkan untuk membuat sheet baru)"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    id="setting-input-spreadsheet-id"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 text-xs text-slate-600 font-medium" id="google-sheets-instruction">
                <h4 className="font-extrabold text-slate-700 uppercase tracking-wide text-[10px]">Panduan Konfigurasi API Google Sheets & Drive:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-500 leading-relaxed">
                  <li>Kunjungi <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#2c7a2c] font-bold hover:underline">Google Cloud Console</a> dan gunakan/buka project Anda.</li>
                  <li>Aktifkan <strong>Google Sheets API</strong> dan <strong>Google Drive API</strong> di bagian &ldquo;APIs & Services Library&rdquo;.</li>
                  <li>Buka bagian &ldquo;Credentials&rdquo;, buat <strong>Web OAuth Client ID</strong>.</li>
                  <li>Tambahkan alamat origin ini di bawah <strong>Authorized JavaScript origins</strong>:<br />
                    <code className="bg-slate-200 px-2 py-0.5 rounded text-slate-700 inline-block font-mono mt-1 text-[11px] leading-none select-all">{window.location.origin}</code>
                  </li>
                  <li>Salin Client ID yang Anda dapatkan di sana, lalu tempel pada field &ldquo;Google OAuth Client ID&rdquo; di atas dan simpan konfigurasi ini.</li>
                </ol>
                {settings.googleClientId ? (
                  <div className="pt-2 flex items-center gap-1.5 text-[#2c7a2c] font-bold text-[10px] uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Client ID Terpasang & Siap Digunakan</span>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Menunggu Konfigurasi Client ID</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  id="google-sheets-save-btn"
                  className="bg-[#2c7a2c] hover:bg-[#205b20] text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs"
                >
                  Simpan Integrasi Google Sheets
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info: Server Stats Panel (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="settings-sidebar">
          {/* Server Info Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl" id="server-status-card">
            <div className="flex items-center gap-2 mb-3" id="server-heading">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h4 className="font-bold text-slate-800 text-sm">Status Server</h4>
            </div>
            
            <div className="space-y-3 pt-2 text-xs" id="server-meta">
              <div className="flex justify-between" id="serv-status">
                <span className="text-slate-400">Status Gateway</span>
                <span className="font-bold text-emerald-600">Terbuka & Sinkron</span>
              </div>
              <div className="flex justify-between" id="serv-db">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-bold text-slate-700">HTML5 LocalDB Storage</span>
              </div>
              <div className="flex justify-between" id="serv-ssl">
                <span className="text-slate-400">Kriptografi SSL</span>
                <span className="font-bold text-slate-700">SHA-256 Validated</span>
              </div>
            </div>
          </div>

          {/* Hard Reset Card */}
          <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl flex flex-col justify-between" id="hard-reset-card">
            <div>
              <h4 className="font-bold text-rose-900 text-sm mb-1.5 flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-rose-700" />
                <span>Reset Semua Simulasi</span>
              </h4>
              <p className="text-xs text-rose-700 leading-relaxed">
                Menghapus semua penambahan pegawai baru, status absen masuk/pulang hari ini, serta riwayat cuti tambahan, mengembalikannya ke data default bawaan.
              </p>
            </div>
            <button
              onClick={() => {
                if(confirm('Apakah Anda yakin ingin melakukan factory reset instan pada aplikasi ini? Semua data baru Anda akan hilang.')) {
                  resetAllData();
                }
              }}
              id="danger-factory-reset-btn"
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all block text-center"
            >
              Factory Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
