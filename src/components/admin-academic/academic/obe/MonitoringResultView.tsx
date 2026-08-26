import React from "react";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Radar } from "react-chartjs-2";
import { MonitoringJenis, MonitoringRawResult } from "../../../../hooks/academic/useObeMonitoring";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  jenis: MonitoringJenis;
  result: MonitoringRawResult;
}

const JENIS_LABEL: Record<MonitoringJenis, string> = {
  "cpl-prodi": "CPL per Program Studi",
  "cpl-mahasiswa": "CPL per Mahasiswa",
  "cpl-mata-kuliah": "CPL per Mata Kuliah",
  "mk-mahasiswa": "Mata Kuliah per Mahasiswa",
  "transkrip-obe": "Transkrip OBE Mahasiswa",
  "cpmk-mahasiswa": "CPMK per Mahasiswa",
};

const INFO_LABELS: Record<string, string> = {
  tahunKurikulum: "Tahun Kurikulum",
  programStudi: "Program Studi",
  angkatan: "Angkatan",
  totalMahasiswa: "Total Mahasiswa",
  metodePerhitungan: "Metode Perhitungan",
  mataKuliah: "Mata Kuliah",
  nim: "NIM",
  nama: "Nama Mahasiswa",
  semester: "Semester",
};

function statusBadgeClass(status: string) {
  if (status === "Tercapai" || status === "Sudah Memenuhi") return "bg-green-100 text-green-700 border border-green-300";
  if (status === "Belum Tercapai" || status === "Belum Memenuhi") return "bg-red-100 text-red-700 border border-red-300";
  return "bg-gray-100 text-gray-500 border border-gray-300";
}

const LOGO_URL = "/img/logo_uika.png";

function KopHeader() {
  return (
    <div className="mb-4 pb-3 border-b-4 border-double border-gray-400">
      <div className="flex items-center justify-center gap-4">
        <img src={LOGO_URL} alt="Logo UIKA" className="w-16 h-16 object-contain flex-shrink-0" />
        <div className="text-center">
          <p className="font-bold text-lg">UNIVERSITAS IBN KHALDUN BOGOR</p>
          <p className="text-xs text-gray-600">Jl KH Sholeh Iskandar KM 2 Kedung Badak Bogor</p>
          <p className="text-xs text-gray-600">Website: uika-bogor.ac.id | e-Mail: mail@uika-bogor.ac.id | Telepon: 0251-8356884</p>
        </div>
      </div>
    </div>
  );
}

function InfoTable({ info, title }: { info: Record<string, any>; title: string }) {
  const entries = Object.entries(INFO_LABELS).filter(([key]) => info[key] !== undefined && info[key] !== null && info[key] !== "");
  return (
    <div className="flex border border-gray-200 mb-6">
      <div className="w-40 flex-shrink-0 flex items-center justify-center p-4 border-r border-gray-200">
        <img src={LOGO_URL} alt="Logo UIKA" className="w-full h-auto object-contain" />
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th colSpan={2} className="bg-primary-blueDark text-white p-2 text-center">{title.toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, label]) => (
            <tr key={key} className="border-t border-gray-200">
              <td className="p-2 border-r border-gray-200 font-semibold w-56">{label}</td>
              <td className="p-2">{String(info[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryBoxes({ title, summary }: { title: string; summary: any }) {
  if (!summary) return null;
  return (
    <div className="mb-6">
      <h5 className="font-semibold text-sm mb-2">{title}</h5>
      <div className="inline-flex bg-gray-50 border border-gray-200 rounded-md divide-x divide-gray-200">
        {summary.tertinggi && (
          <div className="px-8 py-3">
            <p className="text-xs text-gray-500 font-semibold">{summary.tertinggi.label ? "CPL Tertinggi" : `Tertinggi (${summary.tertinggi.kode})`}</p>
            <p className="text-2xl font-bold text-green-600">{summary.tertinggi.nilai}</p>
            {summary.tertinggi.label && <p className="text-xs text-gray-500">{summary.tertinggi.label}</p>}
          </div>
        )}
        {summary.terendah && (
          <div className="px-8 py-3">
            <p className="text-xs text-gray-500 font-semibold">{summary.terendah.label ? "CPL Terendah" : `Terendah (${summary.terendah.kode})`}</p>
            <p className="text-2xl font-bold text-red-600">{summary.terendah.nilai}</p>
            {summary.terendah.label && <p className="text-xs text-gray-500">{summary.terendah.label}</p>}
          </div>
        )}
        {summary.rataKeseluruhan && (
          <div className="px-8 py-3">
            <p className="text-xs text-gray-500 font-semibold">Rata-rata Keseluruhan</p>
            <p className="text-2xl font-bold text-primary-blueDark">{summary.rataKeseluruhan}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartSummaryPanel({ jenisLabel, chart, summary }: { jenisLabel: string; chart: any; summary: any }) {
  if (!chart?.labels?.length && !summary) return null;
  const labels = (chart?.labels || []).map((l: any) => (Array.isArray(l) ? l[0] : l));
  const data = {
    labels,
    datasets: (chart?.datasets || []).map((d: any, idx: number) => ({
      label: d.label || (idx === 0 ? "Capaian" : "Target"),
      data: d.data,
      backgroundColor: idx === 0 ? "rgba(16, 83, 163, 0.25)" : "rgba(232, 183, 58, 0.1)",
      borderColor: idx === 0 ? "#1053a3" : "#e8b73a",
      borderWidth: 1.5,
      pointRadius: 0,
    })),
  };

  const deskripsi =
    summary?.tertinggi && summary?.terendah
      ? `${jenisLabel} mencatat rerata tertinggi sebesar ${summary.tertinggi.nilai} (${summary.tertinggi.kode || summary.tertinggi.label}), dengan batas terendah pada angka ${summary.terendah.nilai} (${summary.terendah.kode || summary.terendah.label}).`
      : null;

  return (
    <div className="border border-gray-200 rounded-md p-6 mb-6 flex flex-col md:flex-row gap-8 items-start">
      {chart?.labels?.length > 0 && (
        <div className="w-full md:w-80 flex-shrink-0">
          <h5 className="font-semibold text-sm mb-2">Spiderchart {jenisLabel}</h5>
          <Radar
            data={data}
            options={{
              animation: false,
              plugins: { legend: { position: "bottom" } },
              scales: { r: { beginAtZero: true, max: 100, ticks: { display: false, stepSize: 20 } } },
            }}
          />
        </div>
      )}
      <div className="flex-1">
        <h5 className="font-semibold text-sm mb-2">Performa {jenisLabel}</h5>
        {summary && (
          <div className="inline-flex bg-gray-50 border border-gray-200 rounded-md divide-x divide-gray-200 mb-3">
            {summary.tertinggi && (
              <div className="px-8 py-3">
                <p className="text-xs text-gray-500 font-semibold">CPL Tertinggi</p>
                <p className="text-2xl font-bold text-green-600">{summary.tertinggi.nilai}</p>
                <p className="text-xs text-gray-500">{summary.tertinggi.label || `di posisi ${summary.tertinggi.kode}`}</p>
              </div>
            )}
            {summary.terendah && (
              <div className="px-8 py-3">
                <p className="text-xs text-gray-500 font-semibold">CPL Terendah</p>
                <p className="text-2xl font-bold text-red-600">{summary.terendah.nilai}</p>
                <p className="text-xs text-gray-500">{summary.terendah.label || `di posisi ${summary.terendah.kode}`}</p>
              </div>
            )}
          </div>
        )}
        {deskripsi && <p className="text-sm text-gray-600 italic">{deskripsi}</p>}
      </div>
    </div>
  );
}

// ---- cpl-prodi / transkrip-obe: tabel detail Kode/Deskripsi/Target/Capaian/Status[/Belum/Sudah] ----
function DetailCplTable({ rows }: { rows: any[] }) {
  const hasBelumSudah = rows.length > 0 && rows[0].mhsBelum !== undefined;
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm">
      <table className="min-w-full bg-white border-collapse text-sm">
        <thead>
          <tr className="bg-primary-blueDark text-white text-xs uppercase font-bold text-center">
            <th className="p-2 border border-gray-300 w-24">Kode</th>
            <th className="p-2 border border-gray-300 text-left">Deskripsi</th>
            <th className="p-2 border border-gray-300 w-24">Target</th>
            <th className="p-2 border border-gray-300 w-24">{rows[0]?.capaian !== undefined ? "Capaian" : "Rerata"}</th>
            <th className="p-2 border border-gray-300 w-32">Status</th>
            {hasBelumSudah && (
              <>
                <th className="p-2 border border-gray-300 w-20">Belum</th>
                <th className="p-2 border border-gray-300 w-20">Sudah</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2 border border-gray-200 text-center font-semibold">{row.kode}</td>
              <td className="p-2 border border-gray-200">{row.deskripsi}</td>
              <td className="p-2 border border-gray-200 text-right">{row.target}</td>
              <td className="p-2 border border-gray-200 text-right">
                {row.capaian !== undefined ? row.capaian : (typeof row.rerata === "number" ? row.rerata.toFixed(2) : row.rerata)}
              </td>
              <td className="p-2 border border-gray-200 text-center">
                <span className={`px-2 py-0.5 rounded text-xs ${statusBadgeClass(row.status)}`}>{row.status}</span>
              </td>
              {hasBelumSudah && (
                <>
                  <td className="p-2 border border-gray-200 text-center">{row.mhsBelum}</td>
                  <td className="p-2 border border-gray-200 text-center">{row.mhsSudah}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- cpl-mahasiswa / cpl-mata-kuliah: pivot rows x daftarCpl (kolom dinamis, flat) ----
function PivotCplTable({
  rows,
  daftarCpl,
  rowLabel,
}: {
  rows: any[];
  daftarCpl: Array<{ kode: string; deskripsi?: string }>;
  rowLabel: (row: any) => React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm">
      <table className="min-w-full bg-white border-collapse text-sm">
        <thead>
          <tr className="bg-primary-blueDark text-white text-xs uppercase font-bold text-center">
            <th className="p-2 border border-gray-300 text-left">Identitas</th>
            {daftarCpl.map((c) => (
              <th key={c.kode} className="p-2 border border-gray-300 min-w-[60px]" title={c.deskripsi}>{c.kode}</th>
            ))}
            {rows.length > 0 && rows[0].status !== undefined && <th className="p-2 border border-gray-300">Status</th>}
          </tr>
        </thead>
        <tbody className="text-center text-gray-700">
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2 border border-gray-200 text-left">{rowLabel(row)}</td>
              {daftarCpl.map((c) => (
                <td key={c.kode} className="p-2 border border-gray-200">{row[c.kode] === null || row[c.kode] === undefined ? "-" : row[c.kode]}</td>
              ))}
              {row.status !== undefined && (
                <td className="p-2 border border-gray-200">
                  <span className={`px-2 py-0.5 rounded text-xs ${statusBadgeClass(row.status)}`}>{row.status}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- mk-mahasiswa: pivot rows x mkList tergroup semester, sel dari row.scores[mkId] ----
function PivotMkMahasiswaTable({ result }: { result: MonitoringRawResult }) {
  const semesters: Array<{ semester: string; mks: Array<{ id: string; kode: string; nama: string }> }> = result.semesters || [];
  const rows: any[] = result.dataMahasiswa || [];
  return (
    <div>
      {result.cpl && (
        <p className="text-sm text-gray-600 mb-3">
          CPL: <span className="font-semibold">{result.cpl.kode}</span> — {result.cpl.deskripsi}
        </p>
      )}
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full bg-white border-collapse text-sm">
          <thead>
            <tr className="bg-primary-blueDark text-white text-xs uppercase font-bold text-center">
              <th className="p-2 border border-gray-300" rowSpan={2}>NPM</th>
              <th className="p-2 border border-gray-300 text-left" rowSpan={2}>Nama</th>
              {semesters.map((s) => (
                <th key={s.semester} className="p-2 border border-gray-300" colSpan={s.mks.length}>Semester {s.semester}</th>
              ))}
              <th className="p-2 border border-gray-300" rowSpan={2}>Rerata</th>
            </tr>
            <tr className="bg-primary-blueDark text-white text-xs uppercase font-bold text-center">
              {semesters.flatMap((s) =>
                s.mks.map((mk) => (
                  <th key={mk.id} className="p-1 border border-gray-300 min-w-[70px]" title={mk.nama}>{mk.kode}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="text-center text-gray-700">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 border border-gray-200">{row.npm}</td>
                <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                {semesters.flatMap((s) =>
                  s.mks.map((mk) => (
                    <td key={mk.id} className="p-2 border border-gray-200">
                      {row.scores?.[mk.id] === undefined ? "-" : Number(row.scores[mk.id]).toFixed(2)}
                    </td>
                  ))
                )}
                <td className="p-2 border border-gray-200 font-semibold">{Number(row.rerata || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- cpmk-mahasiswa: pivot rows x daftarCpmk, sel dari row.cpmk[kode] ----
function PivotCpmkTable({ result }: { result: MonitoringRawResult }) {
  const daftarCpmk: Array<{ kode: string; deskripsi: string }> = result.daftarCpmk || [];
  const rows: any[] = result.dataMahasiswa || [];
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-sm">
      <table className="min-w-full bg-white border-collapse text-sm">
        <thead>
          <tr className="bg-primary-blueDark text-white text-xs uppercase font-bold text-center">
            <th className="p-2 border border-gray-300">NPM</th>
            <th className="p-2 border border-gray-300 text-left">Nama</th>
            {daftarCpmk.map((c) => (
              <th key={c.kode} className="p-2 border border-gray-300 min-w-[70px]" title={c.deskripsi}>{c.kode}</th>
            ))}
            <th className="p-2 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody className="text-center text-gray-700">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2 border border-gray-200">{row.npm}</td>
              <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
              {daftarCpmk.map((c) => (
                <td key={c.kode} className="p-2 border border-gray-200">{row.cpmk?.[c.kode] === null || row.cpmk?.[c.kode] === undefined ? "-" : row.cpmk[c.kode]}</td>
              ))}
              <td className="p-2 border border-gray-200">
                <span className={`px-2 py-0.5 rounded text-xs ${statusBadgeClass(row.status)}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MonitoringResultView({ jenis, result }: Props) {
  const info = result.info || {};
  const showKop = info.useKop !== false;

  return (
    <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
      {showKop && <KopHeader />}
      <InfoTable info={info} title={JENIS_LABEL[jenis]} />

      {(jenis === "cpl-prodi" || jenis === "transkrip-obe") && (
        <>
          <ChartSummaryPanel jenisLabel={JENIS_LABEL[jenis]} chart={result.chart} summary={result.summary} />
          <h5 className="font-semibold text-sm mb-2">Detail Deskripsi dan Hasil Setiap {JENIS_LABEL[jenis]}</h5>
          <DetailCplTable rows={result.tabel || []} />
        </>
      )}

      {(jenis === "cpl-mahasiswa" || jenis === "cpl-mata-kuliah") && (
        <>
          <SummaryBoxes title={`Performa ${JENIS_LABEL[jenis]}`} summary={result.summary} />
          <PivotCplTable
            rows={jenis === "cpl-mahasiswa" ? result.dataMahasiswa || [] : result.dataMataKuliah || []}
            daftarCpl={result.daftarCpl || []}
            rowLabel={(row) => (jenis === "cpl-mahasiswa" ? `${row.npm} - ${row.nama}` : `${row.nama} (Sem. ${row.semester}, ${row.sks} SKS)`)}
          />
        </>
      )}

      {jenis === "mk-mahasiswa" && <PivotMkMahasiswaTable result={result} />}
      {jenis === "cpmk-mahasiswa" && <PivotCpmkTable result={result} />}
    </div>
  );
}
