// js/app.js

document.addEventListener('DOMContentLoaded', function() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Add sample data if local storage is empty
    if (recipes.length === 0) {
        const sampleRecipes = [
            {
                id: 1,
                title: "Sample Recipe: Special Fried Rice",
                imageUrl: "https://images.unsplash.com/photo-1599543331610-8a73a3aa3497?q=80&w=1974&auto=format&fit=crop",
                content: `
                    <h2>Ingredients</h2>
                    <ul>
                        <li>2 plates of cold white rice</li>
                        <li>2 eggs, beaten</li>
                        <li>100g shrimp, peeled</li>
                        <li>5 beef meatballs, sliced</li>
                        <li>3 cloves of garlic, finely chopped</li>
                        <li>2 tbsp sweet soy sauce</li>
                        <li>1 tbsp oyster sauce</li>
                        <li>Salt and pepper to taste</li>
                    </ul>
                    <h2>Instructions</h2>
                    <ol>
                        <li>Heat oil, sauté garlic until fragrant.</li>
                        <li>Add eggs, scramble until cooked.</li>
                        <li>Add shrimp and meatballs, cook until they change color.</li>
                        <li>Add rice, stir well.</li>
                        <li>Season with sweet soy sauce, oyster sauce, salt, and pepper. Stir until all ingredients are well mixed.</li>
                        <li>Serve warm with a sprinkle of fried onions.</li>
                    </ol>
                `
            }
        ];
        localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
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
        grid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No recipes yet. Add a new recipe from the Control Panel.</p>';
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
        document.title = `${recipe.title} - Nice Recipes`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const plainTextContent = recipe.content.replace(/<[^>]+>/g, ' ').substring(0, 155);
            metaDesc.setAttribute('content', `${plainTextContent}...`);
        }

        container.innerHTML = `
            <header class="article-header">
                <h1>${recipe.title}</h1>
            </header>
            <img src="${recipe.imageUrl}" alt="${recipe.title}" class="article-image">
            <div class="article-content">
                ${recipe.content}
            </div>
        `;

        const relatedRecipes = recipes.filter(r => r.id !== recipeId).slice(0, 3);
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
        container.innerHTML = '<h1>404 - Recipe Not Found</h1><p>Sorry, the recipe you are looking for does not exist or has been removed.</p>';
        document.querySelector('.related-posts').style.display = 'none';
    }
}
