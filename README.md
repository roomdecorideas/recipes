# recipes

# Peringatan Penting Mengenai Kunci API:

# Gemini API Key: Anda memerlukan kunci API dari Google AI Studio. Anda bisa mendapatkannya secara gratis.
Kunjungi Google AI Studio.
Klik "Get API key" dan buat kunci API baru.
Unsplash API Key: Untuk mencari gambar secara otomatis, kita akan menggunakan API dari Unsplash, yang gratis untuk penggunaan development.

# Kunjungi Unsplash Developers.
Buat akun, lalu buat aplikasi baru.
Anda akan mendapatkan "Access Key".

# Keamanan: JANGAN PERNAH membagikan kunci API Anda secara publik. Karena kita menggunakan JavaScript sisi klien, kunci ini akan terlihat oleh siapa saja yang memeriksa kode sumber situs Anda. Solusi ini cocok untuk proyek pribadi atau portofolio, tetapi TIDAK AMAN untuk aplikasi produksi skala besar. Untuk produksi, logika API harus berada di sisi server (backend).

# Cara Menggunakan (Versi Baru)
1. Dapatkan Kunci API: Ikuti instruksi di awal untuk mendapatkan kunci API Gemini dan Unsplash.
2. Masukkan Kunci API: Buka file js/admin.js. Ganti YOUR_GEMINI_API_KEY dan YOUR_UNSPLASH_ACCESS_KEY dengan kunci asli Anda.
3. Buka Halaman Admin: Buka file admin.html di browser Anda.
4. Gunakan AI Generator:
   Di bagian "AI Recipe Generator", ketikkan kata kunci makanan dalam Bahasa Inggris (contoh: spaghetti carbonara, vegan chocolate cake, beef rendang).
5. Klik tombol "Generate".
   Tunggu beberapa saat. Anda akan melihat indikator pemuatan berputar. Di belakang layar, aplikasi sedang menghubungi Gemini untuk       membuat artikel, lalu Unsplash untuk mencari gambar.
6. Setelah selesai, form di bawahnya akan terisi secara otomatis dengan judul, URL gambar, dan konten resep dalam format Markdown.
7. Review dan Simpan: Anda bisa meninjau dan mengedit hasil dari AI jika perlu. Setelah puas, klik tombol "Save Recipe".

Lihat Hasil: Buka index.html dan segarkan halaman untuk melihat resep baru Anda muncul di halaman utama.
