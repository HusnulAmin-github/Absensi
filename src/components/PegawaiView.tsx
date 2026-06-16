import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  X, 
  Check, 
  Sparkles,
  Award,
  IdCard
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';

interface PegawaiViewProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onAddEmployee: (employee: Omit<Employee, 'id' | 'totalCutiDiambil' | 'totalIzinSakit'>) => void;
  userRole: 'pegawai' | 'admin';
}

export default function PegawaiView({
  employees,
  attendanceRecords,
  onAddEmployee,
  userRole
}: PegawaiViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states to create employee
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('Staf Keuangan');
  const [sisaCuti, setSisaCuti] = useState(12);

  const matchedEmployees = employees.filter((emp) => {
    return (
      emp.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nip.includes(searchQuery) ||
      emp.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nip) {
      alert('Nama dan NIP wajib diisi!');
      return;
    }

    onAddEmployee({
      nama,
      nip,
      jabatan,
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      sisaCuti: Number(sisaCuti)
    });

    // Reset and close
    setNama('');
    setNip('');
    setSisaCuti(12);
    setShowModal(false);
    alert(`Data Pegawai ${nama} berhasil ditambahkan! Total pegawai kini bertambah.`);
  };

  return (
    <div className="space-y-6" id="pegawai-view-main">
      {/* Header wrapper */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4" id="pegawai-header-wrap">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Direktori Perangkat Desa</h2>
          <p className="text-sm text-slate-500 mt-1">
            {userRole === 'admin' 
              ? 'Kelola staf pegawai, alokasikan jatah cuti, dan tambahkan administrator baru.' 
              : 'Informasi data diri rekan kerja perangkat desa di Kantor Desa.'}
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            id="add-pegawai-trigger-btn"
            className="bg-[#2c7a2c] hover:bg-[#205b20] text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-xs flex items-center gap-2 self-start"
          >
            <UserPlus className="h-4.5 w-4.5" />
            <span>Tambah Pegawai Baru</span>
          </button>
        )}
      </div>

      {/* Directory filters / search */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl" id="pegawai-filters-box">
        <div className="relative" id="pegawai-search-wrap">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Cari perangkat desa berdasarkan nama, jabatan, NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="pegawai-search-field"
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489] transition-all"
          />
        </div>
      </div>

      {/* Grid of employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="pegawai-cards-grid">
        {matchedEmployees.map((emp) => {
          // Check if employee clocked in today (16 June 2026)
          const loggedInToday = attendanceRecords.some(
            rec => rec.pegawaiId === emp.id && 
            (rec.tanggal.toLowerCase().includes('16 june') || rec.tanggal.toLowerCase().includes('16 juni'))
          );

          return (
            <div key={emp.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xs transition-all flex flex-col justify-between" id={`pegawai-card-${emp.id}`}>
              <div>
                {/* Header profile status */}
                <div className="flex items-start justify-between" id={`profile-header-${emp.id}`}>
                  <div className="flex items-center gap-3.5" id={`profile0-${emp.id}`}>
                    <img
                      src={emp.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                      alt={emp.nama}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-slate-100 object-cover"
                      id={`profile-pic-${emp.id}`}
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{emp.nama}</h4>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{emp.jabatan}</p>
                    </div>
                  </div>

                  {/* Active attendance dot status */}
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                    loggedInToday 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`} id={`active-status-badge-${emp.id}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${loggedInToday ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span>{loggedInToday ? 'Hadir' : 'Belum Absen'}</span>
                  </span>
                </div>

                {/* Body info */}
                <div className="mt-5 space-y-2 text-xs border-t border-slate-50 pt-4" id={`profile-body-${emp.id}`}>
                  <div className="flex justify-between items-center" id={`p-nip-${emp.id}`}>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <IdCard className="h-3.5 w-3.5" />
                      <span>NIP Staf</span>
                    </span>
                    <span className="font-semibold text-slate-800 text-right">{emp.nip}</span>
                  </div>
                  
                  <div className="flex justify-between items-center" id={`p-cuti-${emp.id}`}>
                    <span className="text-slate-400 font-medium">Sisa Cuti Tahunan</span>
                    <span className="font-bold text-slate-800 text-right">{emp.sisaCuti} Hari</span>
                  </div>
                </div>
              </div>

              {/* Stats footer badges */}
              <div className="grid grid-cols-2 gap-2 mt-5 border-t border-slate-100 pt-4 text-center text-[10px]" id={`profile-footer-${emp.id}`}>
                <div className="bg-slate-50 p-2 rounded-lg" id={`profile-cs-${emp.id}`}>
                  <span className="text-slate-400 font-medium block uppercase tracking-wider">Cuti Diambil</span>
                  <span className="text-slate-800 font-extrabold text-xs block mt-1">{emp.totalCutiDiambil} Hari</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg" id={`profile-cis-${emp.id}`}>
                  <span className="text-slate-400 font-medium block uppercase tracking-wider">Izin Sakit</span>
                  <span className="text-slate-800 font-extrabold text-xs block mt-1">{emp.totalIzinSakit} Hari</span>
                </div>
              </div>
            </div>
          );
        })}

        {matchedEmployees.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400 italic" id="pegawai-empty-state">
            Tidak ditemukan data staf dengan parameter tersebut.
          </div>
        )}
      </div>

      {/* Add Employee Modal Dialogue */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-employee-modal-overlay">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 shadow-xl" id="add-employee-modal">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4" id="modal-header">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Users className="h-5 w-5 text-[#2c7a2c]" />
                <span>Tambah Perangkat Desa</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                id="close-modal-btn"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="modal-form">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Supriadi Wijaya"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  id="modal-input-name"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                />
              </div>

              {/* Nomor Induk Pegawai NIP */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nomor Induk Pegawai (NIP)</label>
                <input
                  type="text"
                  required
                  placeholder="Format: 19xxxxxxxxxxxx"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  id="modal-input-nip"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                />
              </div>

              {/* Jabatan Staf */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jabatan Desa</label>
                <select
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  id="modal-input-jabatan"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                >
                  <option value="Kepala Desa">Kepala Desa</option>
                  <option value="Sekretaris Desa">Sekretaris Desa</option>
                  <option value="Bendahara Desa">Bendahara Desa</option>
                  <option value="Kepala Seksi Pelayanan">Kepala Seksi Pelayanan</option>
                  <option value="Staf Administrasi">Staf Administrasi</option>
                  <option value="Staf Kesejahteraan">Staf Kesejahteraan</option>
                  <option value="Kepala Dusun I">Kepala Dusun I</option>
                  <option value="Kepala Dusun II">Kepala Dusun II</option>
                </select>
              </div>

              {/* Jatah Kuota Cuti Tahunan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kuota Cuti Tahunan (Hari)</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={sisaCuti}
                  onChange={(e) => setSisaCuti(Number(e.target.value))}
                  id="modal-input-quota"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#89e489]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100" id="modal-footer-btns">
                <button
                  type="button"
                  id="modal-cancel-btn"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="modal-save-btn"
                  className="px-4 py-2 bg-[#2c7a2c] hover:bg-[#205b20] text-white font-semibold text-xs rounded-lg transition-all"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
