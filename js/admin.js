// js/admin.js

// --- Konfigurasi API ---
// !!! PENTING: Ganti dengan kunci API Anda.
// JANGAN bagikan kunci ini secara publik.
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// --- Elemen DOM ---
const generateBtn = document.getElementById('generate-btn');
const keywordInput = document.getElementById('keyword-input');
const loader = document.getElementById('loader');
const recipeForm = document.getElementById('add-recipe-form');
const titleInput = document.getElementById('recipe-title');
const imageUrlInput = document.getElementById('recipe-image-link');
const contentInput = document.getElementById('recipe-content');

// --- Event Listeners ---
generateBtn.addEventListener('click', handleGenerateClick);
recipeForm.addEventListener('submit', handleFormSubmit);

// --- Fungsi-fungsi ---

/**
 * Menangani klik pada tombol 'Generate'
 */
async function handleGenerateClick() {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
        alert('Please enter a food keyword.');
        return;
    }
    
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY' || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
        alert('ERROR: Please set your API keys in js/admin.js file.');
        return;
    }

    // Tampilkan loader dan nonaktifkan tombol
    setLoading(true);

    try {
        // 1. Panggil Gemini AI untuk membuat konten
        const aiContent = await getAiGeneratedContent(keyword);

        // 2. Gunakan query gambar dari AI untuk mencari gambar di Unsplash
        const imageUrl = await getImageUrl(aiContent.image_search_query);

        // 3. Isi form dengan hasil dari AI dan Unsplash
        titleInput.value = aiContent.title;
        contentInput.value = aiContent.article_markdown;
        imageUrlInput.value = imageUrl;

    } catch (error) {
        console.error('Error during generation process:', error);
        alert(`An error occurred: ${error.message}`);
    } finally {
        // Sembunyikan loader dan aktifkan kembali tombol
        setLoading(false);
    }
}

/**
 * Menangani submit form untuk menyimpan resep
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const newRecipe = {
        id: Date.now(),
        title: titleInput.value,
        imageUrl: imageUrlInput.value,
        content: marked.parse(contentInput.value) // Konversi Markdown ke HTML
    };

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.unshift(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));

    alert('Recipe saved successfully!');
    e.target.reset();
    keywordInput.value = '';
}

/**
 * Mengatur status loading UI
 * @param {boolean} isLoading 
 */
function setLoading(isLoading) {
    if (isLoading) {
        loader.style.display = 'block';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
    } else {
        loader.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    }
}

/**
 * Memanggil Gemini API untuk mendapatkan konten resep
 * @param {string} keyword 
 * @returns {Promise<object>} Objek dengan title, image_search_query, dan article_markdown
 */
async function getAiGeneratedContent(keyword) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        You are a professional recipe writer for a blog called "Nice Recipes". 
        Based on the keyword "${keyword}", generate a complete recipe in English.
        Provide the output ONLY in a valid JSON format, with no other text or markdown formatting before or after the JSON object.
        The JSON object must have these exact keys:
        - "title": A catchy, SEO-friendly title for the recipe.
        - "image_search_query": A concise, descriptive phrase of 2-4 words to find a high-quality photo of the finished dish. For example: "spicy chicken curry bowl".
        - "article_markdown": The full recipe content in English Markdown. It must include "## Ingredients" and "## Instructions" sections with detailed lists.
    `;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const jsonString = data.candidates[0].content.parts[0].text;

    // Membersihkan string JSON dari kemungkinan markdown code block
    const cleanJsonString = jsonString.replace(/```json\n|```/g, '').trim();

    try {
        return JSON.parse(cleanJsonString);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", cleanJsonString);
        throw new Error("AI returned an invalid response format.");
    }
}

/**
 * Memanggil Unsplash API untuk mendapatkan URL gambar
 * @param {string} query 
 * @returns {Promise<string>} URL gambar
 */
async function getImageUrl(query) {
    const API_URL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Unsplash API Error: Failed to fetch image.');
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular; // URL gambar kualitas standar
    } else {
        // Fallback jika tidak ada gambar ditemukan
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
    }
}
