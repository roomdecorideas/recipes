// js/admin.js

document.getElementById('add-recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Ambil data dari form
    const title = document.getElementById('recipe-title').value;
    const imageUrl = document.getElementById('recipe-image-link').value;
    const contentMarkdown = document.getElementById('recipe-content').value;

    // Mengubah Markdown menjadi HTML
    const contentHtml = marked.parse(contentMarkdown);

    // 2. Buat objek resep baru
    const newRecipe = {
        id: Date.now(), // ID unik berdasarkan waktu
        title: title,
        imageUrl: imageUrl,
        content: contentHtml,
        // Menyimpan versi Markdown untuk diedit nanti (opsional)
        // markdown: contentMarkdown 
    };

    // 3. Ambil data resep yang sudah ada dari localStorage
    // Jika tidak ada, mulai dengan array kosong
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // 4. Tambahkan resep baru ke array
    recipes.unshift(newRecipe); // unshift() agar resep baru selalu di atas

    // 5. Simpan kembali array yang sudah diupdate ke localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // 6. Beri notifikasi dan kosongkan form
    alert('Resep berhasil ditambahkan!');
    e.target.reset();
});
