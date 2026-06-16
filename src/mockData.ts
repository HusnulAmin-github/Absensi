import { Employee, AttendanceRecord, LeaveRequest, Settings } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-budi',
    nama: 'Budi Santoso',
    nip: '19930412 201903 1 002',
    jabatan: 'Staf Administrasi',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 8,
    totalCutiDiambil: 8,
    totalIzinSakit: 3
  },
  {
    id: 'emp-ahmad',
    nama: 'Ahmad Dahlan',
    nip: '19820315 201001 1 001',
    jabatan: 'Kepala Seksi Pelayanan',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 10,
    totalCutiDiambil: 2,
    totalIzinSakit: 1
  },
  {
    id: 'emp-siti',
    nama: 'Siti Rahma',
    nip: '19890724 201504 2 003',
    jabatan: 'Bendahara Desa',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 7,
    totalCutiDiambil: 5,
    totalIzinSakit: 2
  },
  {
    id: 'emp-bambang',
    nama: 'Bambang Pamungkas',
    nip: '19751103 199912 1 004',
    jabatan: 'Kepala Dusun I',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 12,
    totalCutiDiambil: 0,
    totalIzinSakit: 0
  },
  {
    id: 'emp-rina',
    nama: 'Rina Herawati',
    nip: '19910814 201808 2 005',
    jabatan: 'Staf Kesejahteraan',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 9,
    totalCutiDiambil: 3,
    totalIzinSakit: 4
  },
  {
    id: 'emp-dedi',
    nama: 'Dedi Kurniawan',
    nip: '19840211 201205 1 006',
    jabatan: 'Sekretaris Desa',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 11,
    totalCutiDiambil: 1,
    totalIzinSakit: 0
  },
  {
    id: 'emp-hartono',
    nama: 'Hartono Widodo',
    nip: '19780512 200304 1 007',
    jabatan: 'Kepala Desa',
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    sisaCuti: 12,
    totalCutiDiambil: 0,
    totalIzinSakit: 0
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Budi's history matching Screenshot 1
  {
    id: 'att-b-1',
    pegawaiId: 'emp-budi',
    nama: 'Budi Santoso',
    nip: '19930412 201903 1 002',
    jabatan: 'Staf Administrasi',
    tanggal: '23 Mei 2024',
    jamMasuk: '07:55',
    jamPulang: '16:05',
    status: 'TEPAT WAKTU',
    akurasi: 5,
    radiusStatus: 'Dalam Radius Kantor'
  },
  {
    id: 'att-b-2',
    pegawaiId: 'emp-budi',
    nama: 'Budi Santoso',
    nip: '19930412 201903 1 002',
    jabatan: 'Staf Administrasi',
    tanggal: '22 Mei 2024',
    jamMasuk: '07:45',
    jamPulang: '16:10',
    status: 'TEPAT WAKTU',
    akurasi: 4,
    radiusStatus: 'Dalam Radius Kantor'
  },
  {
    id: 'att-b-3',
    pegawaiId: 'emp-budi',
    nama: 'Budi Santoso',
    nip: '19930412 201903 1 002',
    jabatan: 'Staf Administrasi',
    tanggal: '21 Mei 2024',
    jamMasuk: '08:15',
    jamPulang: '16:00',
    status: 'TERLAMBAT',
    akurasi: 6,
    radiusStatus: 'Dalam Radius Kantor'
  },
  {
    id: 'att-b-4',
    pegawaiId: 'emp-budi',
    nama: 'Budi Santoso',
    nip: '19930412 201903 1 002',
    jabatan: 'Staf Administrasi',
    tanggal: '20 Mei 2024',
    jamMasuk: '07:50',
    jamPulang: '16:05',
    status: 'TEPAT WAKTU',
    akurasi: 5,
    radiusStatus: 'Dalam Radius Kantor'
  },

  // Other employees attendance for today (Tuesday, 16 June 2026)
  {
    id: 'att-h-1',
    pegawaiId: 'emp-hartono',
    nama: 'Hartono Widodo',
    nip: '19780512 200304 1 007',
    jabatan: 'Kepala Desa',
    tanggal: '16 June 2026',
    jamMasuk: '07:30',
    jamPulang: null,
    status: 'TEPAT WAKTU',
    akurasi: 8,
    radiusStatus: 'Dalam Radius Kantor'
  },
  {
    id: 'att-d-1',
    pegawaiId: 'emp-dedi',
    nama: 'Dedi Kurniawan',
    nip: '19840211 201205 1 006',
    jabatan: 'Sekretaris Desa',
    tanggal: '16 June 2026',
    jamMasuk: '07:40',
    jamPulang: null,
    status: 'TEPAT WAKTU',
    akurasi: 3,
    radiusStatus: 'Dalam Radius Kantor'
  },
  {
    id: 'att-r-1',
    pegawaiId: 'emp-rina',
    nama: 'Rina Herawati',
    nip: '19910814 201808 2 005',
    jabatan: 'Staf Kesejahteraan',
    tanggal: '16 June 2026',
    jamMasuk: '08:12',
    jamPulang: null,
    status: 'TERLAMBAT',
    akurasi: 12,
    radiusStatus: 'Dalam Radius Kantor'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    pegawaiId: 'emp-budi',
    namaPegawai: 'Budi Santoso',
    nipPegawai: '19930412 201903 1 002',
    jabatanPegawai: 'Staf Administrasi',
    tipe: 'Cuti Tahunan',
    tanggalMulai: '2023-10-15',
    tanggalSelesai: '2023-10-18',
    alasan: 'Urusan keluarga mendesak di luar kota',
    status: 'Disetujui',
    tanggalPengajuan: '2023-10-10'
  },
  {
    id: 'leave-2',
    pegawaiId: 'emp-budi',
    namaPegawai: 'Budi Santoso',
    nipPegawai: '19930412 201903 1 002',
    jabatanPegawai: 'Staf Administrasi',
    tipe: 'Izin Sakit',
    tanggalMulai: '2023-10-22',
    tanggalSelesai: '2023-10-23',
    alasan: 'Demam tinggi dan disarankan istirahat dokter',
    status: 'Menunggu',
    tanggalPengajuan: '2023-10-22'
  },
  {
    id: 'leave-3',
    pegawaiId: 'emp-budi',
    namaPegawai: 'Budi Santoso',
    nipPegawai: '19930412 201903 1 002',
    jabatanPegawai: 'Staf Administrasi',
    tipe: 'Izin Keperluan',
    tanggalMulai: '2023-11-05',
    tanggalSelesai: '2023-11-05',
    alasan: 'Acaran adat pernikahan keluarga dekat',
    status: 'Ditolak',
    tanggalPengajuan: '2023-11-01'
  },
  {
    id: 'leave-4',
    pegawaiId: 'emp-siti',
    namaPegawai: 'Siti Rahma',
    nipPegawai: '19890724 201504 2 003',
    jabatanPegawai: 'Bendahara Desa',
    tipe: 'Cuti Tahunan',
    tanggalMulai: '2026-06-18',
    tanggalSelesai: '2026-06-20',
    alasan: 'Acara wisuda anak di Bandung',
    status: 'Menunggu',
    tanggalPengajuan: '2026-06-15'
  }
];

export const DEFAULT_SETTINGS: Settings = {
  officeLatitude: -6.2088,
  officeLongitude: 106.8456,
  maxRadius: 100, // meters
  allowOverrideLocation: true,
  officeStartTime: '08:00'
};

// Weekly summary chart data (Screenshot 2: Rekapitulasi Kehadiran Mingguan)
// We have days: Sen, Sel, Rab, Kam, Jum, Sab. Values for Hadir and Terlambat.
export const WEEKLY_COMMITMENT_DATA = [
  { name: 'Sen', Hadir: 36, Terlambat: 4, Total: 40 },
  { name: 'Sel', Hadir: 38, Terlambat: 2, Total: 40 },
  { name: 'Rab', Hadir: 32, Terlambat: 6, Total: 38 },
  { name: 'Kam', Hadir: 35, Terlambat: 3, Total: 38 },
  { name: 'Jum', Hadir: 37, Terlambat: 1, Total: 38 },
  { name: 'Sab', Hadir: 8, Terlambat: 2, Total: 10 }
];
