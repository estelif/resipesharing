/*лайк buttons */
document.addEventListener('DOMContentLoaded', function () {
    let likedRecipes = [];
  
    function toggleLike(element, recipeName, recipeImageSrc) {
        element.classList.toggle('liked');
  
        if (element.classList.contains('liked')) {
            element.style.color = 'red'; 
            if (!likedRecipes.find(recipe => recipe.name === recipeName)) {
                likedRecipes.push({ name: recipeName, imageUrl: recipeImageSrc });
            }
        } else {
            element.style.color = 'gray'; 
            likedRecipes = likedRecipes.filter(recipe => recipe.name !== recipeName);
        }
    }
  
    const recipeCards = document.querySelectorAll('.col-md-6.mb-4');
    recipeCards.forEach((card) => {
        const recipeImage = card.querySelector('.recipe-image');
        const recipeName = card.querySelector('span').textContent;
  
        const likeBtnContainer = document.createElement('div');
        likeBtnContainer.style.position = 'absolute';
        likeBtnContainer.style.top = '10px';
        likeBtnContainer.style.right = '140px';
        likeBtnContainer.style.cursor = 'pointer';
        likeBtnContainer.style.zIndex = '30'; 
        likeBtnContainer.style.width = '50px';
        likeBtnContainer.style.height = '50px';
        likeBtnContainer.style.borderRadius = '50%';
        likeBtnContainer.style.display = 'flex';
        likeBtnContainer.style.alignItems = 'center';
        likeBtnContainer.style.justifyContent = 'center';
        likeBtnContainer.style.backgroundColor = 'white';
        likeBtnContainer.style.boxShadow = '0px 2px 6px rgba(0, 0, 0, 0.1)';
  
        const likeBtn = document.createElement('span');
        likeBtn.innerHTML = '&#9829;'; 
        likeBtn.style.fontSize = '40px';
        likeBtn.style.color = 'gray';
        likeBtn.classList.add('like-btn');
        likeBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleLike(likeBtn, recipeName, recipeImage.src);
        });
  
        likeBtnContainer.appendChild(likeBtn);
  
        card.style.position = 'relative';
  
        card.appendChild(likeBtnContainer);
    });
  //liked recipes
    const viewLikedBtn = document.createElement('button');
    viewLikedBtn.textContent = 'View Liked Recipes';
    viewLikedBtn.classList.add('btn', 'btn-primary', 'mb-4');
    viewLikedBtn.style.display = 'block';
    viewLikedBtn.style.margin = '20px auto';
    document.body.insertBefore(viewLikedBtn, document.querySelector('main'));
  
    function displayLikedRecipes() {
        if (likedRecipes.length === 0) {
            alert('No liked recipes available.');
            return;
        }
  
        const modal = document.createElement('div');
        modal.classList.add('liked-recipes-modal');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
  
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('btn', 'btn-danger', 'mb-3');
        closeButton.addEventListener('click', () => modal.remove());
        modal.appendChild(closeButton);
  
        likedRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.style.marginBottom = '20px';
            recipeDiv.style.textAlign = 'center';
  
            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.imageUrl;
            recipeImage.alt = recipe.name;
            recipeImage.style.width = '150px';
            recipeImage.style.marginBottom = '10px';
  
            const recipeName = document.createElement('h4');
            recipeName.textContent = recipe.name;
            recipeName.style.color = 'white';
  
            recipeDiv.appendChild(recipeImage);
            recipeDiv.appendChild(recipeName);
            modal.appendChild(recipeDiv);
        });
  
        document.body.appendChild(modal);
    }
  
    viewLikedBtn.addEventListener('click', displayLikedRecipes);
  });
  
  //search 
  function filterRecipes() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase(); 
    const recipeItems = document.querySelectorAll('#recipeContainer .col-md-6'); 
  
    recipeItems.forEach(item => {
        const recipeName = item.querySelector('span').innerText.toLowerCase(); 
        if (recipeName.includes(filter)) { 
            item.style.display = 'block'; 
        } else {
            item.style.display = 'none'; 
        }
    });
  }
  
  const ratings = {};
  /*creating rating */
  function createStarRating(recipeName) {
    const starRatingContainer = document.querySelector(`.star-rating[data-recipe-name="${recipeName}"]`);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.setAttribute('data-value', i);
        star.innerHTML = '&#9733;';
        star.addEventListener('click', () => handleStarClick(recipeName, i, starRatingContainer));
        starRatingContainer.appendChild(star);
    }
  }
  
  function handleStarClick(recipeName, ratingValue, starRatingContainer) {
    const stars = starRatingContainer.querySelectorAll('.star');
  
    stars.forEach((s, index) => {
        if (index < ratingValue) {
            s.classList.add('rated');
        } else {
            s.classList.remove('rated');
        }
    });
  
    if (!ratings[recipeName]) {
        ratings[recipeName] = [];
    }
    ratings[recipeName].push(ratingValue);
    
    const average = calculateAverageRating(ratings[recipeName]);
    document.getElementById(`average-${recipeName}`).innerText = `Average Rating: ${average.toFixed(1)}`;
  }
  
  function calculateAverageRating(ratingArray) {
    const sum = ratingArray.reduce((a, b) => a + b, 0);
    return sum / ratingArray.length;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const recipeNames = ['Alfredo', 'Manty', 'Besbarmak', 'Pie', 'Fettuccine', 'Tom Yam', 'Rice', 'Caesar'];
    recipeNames.forEach(recipeName => createStarRating(recipeName));
  });