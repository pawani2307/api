const apiUrls = [
    "https://cosylab.iiitd.edu.in/recipe-search/regions?searchText=Indian%20Subcontinent&pageSize=10",
    "https://cosylab.iiitd.edu.in/recipe-search/sub-regions?searchText=Angolan&pageSize=10",
    "https://cosylab.iiitd.edu.in/recipe-search/continents?searchText=African&pageSize=10"
];

function fetchRecipes() {
    const calorieLimit = document.getElementById("calorieLimit").value;
    
    if (!calorieLimit || isNaN(calorieLimit) || calorieLimit <= 0) {
        alert("Please enter a valid calorie limit.");
        return;
    }

    // Clear previous results
    document.getElementById('result1').innerHTML = '';
    document.getElementById('result2').innerHTML = '';
    document.getElementById('result3').innerHTML = '';

    // Fetch and display recipes for each API
    fetchDataAndDisplay(apiUrls[0], 'result1', calorieLimit);
    fetchDataAndDisplay(apiUrls[1], 'result2', calorieLimit);
    fetchDataAndDisplay(apiUrls[2], 'result3', calorieLimit);
}

function fetchDataAndDisplay(apiUrl, resultId, calorieLimit) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Log the data structure to debug
            console.log(data);

            // Check if the data is in the expected format
            if (data && data.results) {
                const recipes = data.results.filter(recipe => {
                    // Ensure the 'Calories' field exists and is a valid number
                    return recipe.Calories && parseFloat(recipe.Calories) < calorieLimit;
                });
                displayRecipes(recipes, resultId);
            } else {
                throw new Error('Invalid data format');
            }
        })
        .catch(error => {
            document.getElementById(resultId).innerHTML = 'Error fetching data: ' + error.message;
        });
}

function displayRecipes(recipes, resultId) {
    const resultContainer = document.getElementById(resultId);

    if (recipes.length === 0) {
        resultContainer.innerHTML = "<p>No recipes found within the calorie limit.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        
        recipeDiv.innerHTML = `
            <img src="${recipe.img_url}" alt="${recipe.Recipe_title}" />
            <div class="recipe-details">
                <h3>${recipe.Recipe_title}</h3>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Cook Time:</strong> ${recipe.cook_time} minutes</p>
            </div>
        `;

        resultContainer.appendChild(recipeDiv);
    });
}
