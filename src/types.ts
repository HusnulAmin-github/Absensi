export interface Employee {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  foto: string;
  sisaCuti: number;
  totalCutiDiambil: number;
  totalIzinSakit: number;
}

export interface AttendanceRecord {
  id: string;
  pegawaiId: string;
  nama: string;
  nip: string;
  jabatan: string;
  tanggal: string; // Format: "YYYY-MM-DD" or "DD Mei YYYY"
  jamMasuk: string | null; // Format: "HH:mm" or "HH:mm:ss"
  jamPulang: string | null; // Format: "HH:mm" or "HH:mm:ss"
  status: 'TEPAT WAKTU' | 'TERLAMBAT' | 'ALPA' | 'MENUNGGU IZIN' | 'CUTI';
  akurasi: number; // in meters
  radiusStatus: 'Dalam Radius Kantor' | 'Luar Radius Kantor';
}

export interface LeaveRequest {
  id: string;
  pegawaiId: string;
  namaPegawai: string;
  nipPegawai: string;
  jabatanPegawai: string;
  tipe: 'Cuti Tahunan' | 'Izin Sakit' | 'Izin Keperluan';
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
  tanggalPengajuan: string;
}

export interface Settings {
  officeLatitude: number;
  officeLongitude: number;
  maxRadius: number; // in meters
  allowOverrideLocation: boolean;
  officeStartTime: string; // "08:00"
  googleClientId?: string;
  googleSpreadsheetId?: string;
}
