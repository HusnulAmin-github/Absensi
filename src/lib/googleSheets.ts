import { AttendanceRecord, LeaveRequest } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Dynamically loads the Google Identity Services SDK script
 */
export function loadGisScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

/**
 * Standard trigger to request Google OAuth token using GIS
 */
export function requestGoogleToken(
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError: (err: any) => void
) {
  if (!window.google?.accounts?.oauth2) {
    onError('GSI SDK Google belum sepenuhnya termuat. Coba beberapa saat lagi.');
    return;
  }

  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      // Request spreadsheet reading, editing, and drive file creation scopes
      scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
      callback: (tokenResponse: any) => {
        if (tokenResponse.error_description) {
          onError(tokenResponse.error_description);
        } else if (tokenResponse.access_token) {
          onSuccess(tokenResponse.access_token);
        } else {
          onError('Gagal mendapatkan token akses. Pastikan Anda menyetujui izin yang diminta.');
        }
      },
    });
    client.requestAccessToken();
  } catch (err: any) {
    onError(err?.message || err);
  }
}

/**
 * Creates a brand new spreadsheet in Google Sheets
 */
export async function createGoogleSpreadsheet(
  accessToken: string,
  title: string
): Promise<{ id: string; url: string }> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Gagal membuat Google Sheet baru.');
  }

  const data = await response.json();
  return {
    id: data.spreadsheetId,
    url: data.spreadsheetUrl
  };
}

/**
 * Appends or puts values directly into spreadsheet
 */
export async function writeSpreadsheetRows(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Gagal mengirimkan baris rekapitulasi ke Google Sheets.');
  }

  return await response.json();
}

/**
 * Premium Styling: Formats header row & auto-fits columns widths
 */
export async function formatSpreadsheetHeader(
  accessToken: string,
  spreadsheetId: string
): Promise<any> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          // Row 0 styling: Navy Slate theme
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.035, green: 0.172, blue: 0.298 }, // #092c4c (navy-brand)
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, // white
                    fontSize: 10
                  },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          // Auto width columns
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 10
              }
            }
          }
        ]
      })
    }
  );

  return response;
}

/**
 * Mapping help: converts attendance records list to Google Sheets matrix values
 */
export function mapAttendanceToRows(records: AttendanceRecord[]): any[][] {
  const headers = [
    'Log ID',
    'NIP Pegawai',
    'Nama Pegawai',
    'Jabatan',
    'Tanggal Presensi',
    'Jam Masuk',
    'Jam Pulang',
    'Akurasi Koordinat (Meter)',
    'Raihan Radius Wilayah',
    'Status Presensi Kerja'
  ];

  const bodyRows = records.map(rec => [
    rec.id,
    rec.nip,
    rec.nama,
    rec.jabatan,
    rec.tanggal,
    rec.jamMasuk || '--:--',
    rec.jamPulang || '--:--',
    rec.akurasi,
    rec.radiusStatus,
    rec.status
  ]);

  return [headers, ...bodyRows];
}

/**
 * Mapping help: converts leave request records to Google Sheets matrix values
 */
export function mapLeavesToRows(records: LeaveRequest[]): any[][] {
  const headers = [
    'Request ID',
    'NIP Pegawai',
    'Nama Pegawai',
    'Jabatan',
    'Jenis Ketidakhadiran',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Alasan / Keperluan',
    'Status Verifikasi Atasan',
    'Tanggal Pengajuan'
  ];

  const bodyRows = records.map(rec => [
    rec.id,
    rec.nipPegawai,
    rec.namaPegawai,
    rec.jabatanPegawai,
    rec.tipe,
    rec.tanggalMulai,
    rec.tanggalSelesai,
    rec.alasan,
    rec.status,
    rec.tanggalPengajuan
  ]);

  return [headers, ...bodyRows];
}
