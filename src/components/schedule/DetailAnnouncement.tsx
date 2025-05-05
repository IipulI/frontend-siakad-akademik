import React from "react";

const DetailAnnouncement = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div>
        <img src="/img/header_announcement.png" alt="Berita Pengumuman" className="w-full object-cover" />
        <div className="p-8 bg-white rounded-b-lg shadow-md">
            <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                <div className="col-span-2 flex items-start">
                  <span className="text-primary-green font-bold text-lg">Judul</span>
                </div>
                <div className="col-span-10 flex items-start">
                  <span className="text-primary-brown text-base">{data.judul}</span>
                </div>
                <div className="col-span-2 flex items-start">
                  <span className="text-primary-green font-bold text-lg">Pengumuman</span>
                </div>
                <div className="col-span-10 flex flex-col items-start space-y-2">
                  <span className="text-primary-brown text-base">
                    Hi mahasiswa/i Universitas Ibn Khaldun 👋👋<br/>
                    Yay kini pembayaran biaya pendidikan dapat dilakukan melalui EduFin x Shopee👋👋<br/><br/>
                    Tata cara pembayarannya mudah. Untuk info! Ikuti langkah-langkah berikut :<br/>
                    1. Mahasiswa login ke aplikasi Siakad Kampus<br/>
                    2. Klik Profil Tab → Riwayat Keuangan<br/>
                    3. Cek tagihan yang akan dibayarkan<br/>
                    4. Pilih Metode Pembayaran : Shopee, untuk Checkout Pembayaran<br/>
                    5. Klik Bayar Tagihan<br/>
                    6. Salin Virtual Account yang didapatkan, pastikan tidak melebihi batas expired VA<br/>
                    7. Lakukan pembayaran melalui channel Shopee<br/><br/>
                    [Klik Video Panduan]<br/>
                    <a href="https://www.youtube.com/watch?v=Hc6tyv1lPpA" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=Hc6tyv1lPpA</a><br/>
                    [Klik panduan pembayaran]<br/>
                    <a href="https://drive.google.com/file/d/1Oz4Yfhsve2PhL9tS4sBaE6o3b6r2nViw/view?usp=sharing" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://drive.google.com/file/d/1Oz4Yfhsve2PhL9tS4sBaE6o3b6r2nViw/view?usp=sharing</a><br/><br/>
                    Selamat Mencoba👋👋
                  </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DetailAnnouncement
