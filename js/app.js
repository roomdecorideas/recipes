// js/app.js

document.addEventListener('DOMContentLoaded', function() {
    // Ambil data resep dari localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Jika data resep kosong, tambahkan data contoh
    if (recipes.length === 0) {
        const sampleRecipes = [
            {
                id: 1,
                title: "Contoh Resep: Nasi Goreng Spesial",
                imageUrl: "https://images.unsplash.com/photo-1599543331610-8a73a3aa3497?q=80&w=1974&auto=format&fit=crop",
                content: `
                    <h2>Bahan-Bahan</h2>
                    <ul>
                        <li>2 piring nasi putih dingin</li>
                        <li>2 butir telur, kocok lepas</li>
                        <li>100 gr udang, kupas</li>
                        <li>5 buah bakso sapi, iris</li>
                        <li>3 siung bawang putih, cincang halus</li>
                        <li>2 sdm kecap manis</li>
                        <li>1 sdm saus tiram</li>
                        <li>Garam dan merica secukupnya</li>
                    </ul>
                    <h2>Langkah-langkah</h2>
                    <ol>
                        <li>Panaskan minyak, tumis bawang putih hingga harum.</li>
                        <li>Masukkan telur, orak-arik hingga matang.</li>
                        <li>Masukkan udang dan bakso, masak hingga berubah warna.</li>
                        <li>Masukkan nasi, aduk rata.</li>
                        <li>Bumbui dengan kecap manis, saus tiram, garam, dan merica. Aduk hingga semua bahan tercampur rata.</li>
                        <li>Sajikan selagi hangat dengan taburan bawang goreng.</li>
                    </ol>
                `
            },
            {
                id: 2,
                title: "Contoh Resep: Ayam Bakar Madu",
                imageUrl: "https://images.unsplash.com/photo-1598511829037-33b8a3b55816?q=80&w=1964&auto=format&fit=crop",
                content: `
                    <h2>Bahan-Bahan</h2>
                    <ul>
                        <li>1 ekor ayam, potong 4 bagian</li>
                        <li>5 sdm madu</li>
                        <li>3 sdm kecap manis</li>
                        <li>1 buah jeruk nipis</li>
                        <li>Garam secukupnya</li>
                    </ul>
                    <h2>Langkah-langkah</h2>
                    <ol>
                        <li>Lumuri ayam dengan air jeruk nipis dan garam, diamkan 15 menit.</li>
                        <li>Campurkan madu dan kecap manis, aduk rata.</li>
                        <li>Olesi ayam dengan campuran madu, lalu bakar di atas bara api hingga matang sambil terus diolesi sisa bumbu.</li>
                        <li>Sajikan dengan sambal dan lalapan.</li>
                    </ol>
                `
            }
        ];
        localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
        // Muat ulang halaman untuk menampilkan data contoh
        location.reload(); 
    }

    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        displayRecipesOnHomepage(recipes);
    } else if (path === 'artikel.html') {
        displaySingleRecipe(recipes);
    }
});

function displayRecipesOnHomepage(recipes) {
    const grid = document.getElementById('recipe-grid');
    if (!grid) return;
    
    if (recipes.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Belum ada resep. Tambahkan resep baru melalui halaman Control Panel.</p>';
        return;
    }

    grid.innerHTML = recipes.map(recipe => `
        <a href="artikel.html?id=${recipe.id}" class="recipe-card">
            <img src="${recipe.imageUrl}" alt="${recipe.title}" loading="lazy">
            <div class="card-content">
                <h3>${recipe.title}</h3>
            </div>
        </a>
    `).join('');
}

function displaySingleRecipe(recipes) {
    const container = document.getElementById('recipe-article-container');
    const relatedGrid = document.getElementById('related-posts-grid');
    if (!container || !relatedGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    const recipe = recipes.find(r => r.id === recipeId);

    if (recipe) {
        // SEO: Update title dan meta description
        document.title = `${recipe.title} - Nice Recipes`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            // Membuat deskripsi singkat dari konten
            const plainTextContent = recipe.content.replace(/<[^>]+>/g, ' ').substring(0, 155);
            metaDesc.setAttribute('content', `${plainTextContent}...`);
        }

        // Tampilkan konten resep
        container.innerHTML = `
            <header class="article-header">
                <h1>${recipe.title}</h1>
            </header>
            <img src="${recipe.imageUrl}" alt="${recipe.title}" class="article-image">
            <div class="article-content">
                ${recipe.content}
            </div>
        `;

        // Tampilkan Related Posts (semua resep kecuali yang sedang dibuka)
        const relatedRecipes = recipes.filter(r => r.id !== recipeId).slice(0, 3); // Ambil 3 resep terkait
        if (relatedRecipes.length > 0) {
            relatedGrid.innerHTML = relatedRecipes.map(related => `
                <a href="artikel.html?id=${related.id}" class="recipe-card">
                    <img src="${related.imageUrl}" alt="${related.title}" loading="lazy">
                    <div class="card-content">
                        <h3>${related.title}</h3>
                    </div>
                </a>
            `).join('');
        } else {
            document.querySelector('.related-posts').style.display = 'none';
        }

    } else {
        container.innerHTML = '<h1>404 - Resep Tidak Ditemukan</h1><p>Maaf, resep yang Anda cari tidak ada atau telah dihapus.</p>';
        document.querySelector('.related-posts').style.display = 'none';
    }
}
