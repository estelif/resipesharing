let users = JSON.parse(localStorage.getItem("users")) || [
  { username: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: '123456', isAdmin: true }
];

let loggedInUser = null;

document.addEventListener("DOMContentLoaded", function () {
  loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
  addAuthButtons();
  addModalStyles();
  createModal('loginModal', 'Login', `
      <input type="text" id="loginUsername" placeholder="Username" required>
      <input type="password" id="loginPassword" placeholder="Password" required>
      <button type="button" onclick="login()">Login</button>
  `);
  createModal('signupModal', 'Sign Up', `
      <input type="text" id="signupUsername" placeholder="Username" required>
      <input type="text" id="signupFirstName" placeholder="First Name" required>
      <input type="text" id="signupLastName" placeholder="Last Name" required>
      <input type="email" id="signupEmail" placeholder="Email" required>
      <input type="password" id="signupPassword" placeholder="Password" required>
      <button type="button" onclick="signUp()">Sign Up</button>
  `);
  displayUsers();
  if (loggedInUser) {
    removeAuthButtons(); 
    displayWelcomeMessage(loggedInUser); 
    addLogoutButton();
  }
});


function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    loggedInUser = user; 
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    removeAuthButtons();
    addLogoutButton(); 

    if (user.isAdmin) {
      window.location.href = 'admin.html'; 
    } else {
      displayWelcomeMessage(user); 
      closeModal('loginModal'); 
    }
  } else {
    alert('Invalid username or password');
  }
}

function logout() {
  loggedInUser = null; 
  localStorage.removeItem("loggedInUser"); 
  addAuthButtons(); 
  removeLogoutButton(); 
  displayLogoutMessage(); 
  removeWelcomeMessage();
}

function displayWelcomeMessage(user) {
  const header = document.querySelector('header .container');
  if (header) {
    const welcomeMessage = document.createElement('p');
    welcomeMessage.textContent = `Welcome, ${user.firstName}!`;
    welcomeMessage.className = 'welcome-message';
    header.appendChild(welcomeMessage);
  }
}
function removeWelcomeMessage() {
  const welcomeMessage = document.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
}
function displayLogoutMessage() {
  const header = document.querySelector('header .container');
  const logoutMessage = document.createElement('p');
  logoutMessage.textContent = `You have logged out successfully.`;
  logoutMessage.className = 'logout-message';
  header.appendChild(logoutMessage);
  setTimeout(() => {
    logoutMessage.remove();
  }, 3000);
}

function removeAuthButtons() {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  if (loginButton) loginButton.remove();
  if (signupButton) signupButton.remove();
}

function addLogoutButton() {
  const authContainer = document.createElement('div');
  authContainer.className = 'auth-container';
  const logoutButton = document.createElement('a');
  
  logoutButton.href = 'javascript:void(0)';
  logoutButton.id = 'logoutButton';
  logoutButton.className = 'btn btn-auth';
  logoutButton.textContent = 'Logout';
  
  const header = document.querySelector('header .container');
  header.appendChild(logoutButton);
  
  logoutButton.addEventListener('click', logout);
}

function removeLogoutButton() {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) logoutButton.remove();
}

function signUp() {
  const username = document.getElementById('signupUsername').value;
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (users.some(user => user.username === username)) {
    alert('Username already exists. Please choose another.');
    return;
  }

  if (!username || !firstName || !lastName || !email || !password) {
    alert('All fields are required.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const newUser = {
    username,
    firstName,
    lastName,
    email,
    password,
    isAdmin: false  
  };
  users.push(newUser);

  saveUsersToLocalStorage();

  alert('Registration successful! You can now log in.');
  closeModal('signupModal');
  displayUsers(); 
}
function saveUsersToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}
function addAuthButtons() {
  const authContainer = document.createElement('div');
  authContainer.className = 'auth-container';

  const loginButton = document.createElement('a');
  loginButton.href = 'javascript:void(0)';
  loginButton.id = 'loginButton';
  loginButton.className = 'btn btn-auth';
  loginButton.textContent = 'Login';

  const signupButton = document.createElement('a');
  signupButton.href = 'javascript:void(0)';
  signupButton.id = 'signupButton';
  signupButton.className = 'btn btn-auth';
  signupButton.textContent = 'Sign Up';

  authContainer.appendChild(loginButton);
  authContainer.appendChild(signupButton);

  const header = document.querySelector('header .container');
  if (header) {
    header.appendChild(authContainer); // Append buttons after header content
  } else {
    console.error("Container element for header not found");
  }

  loginButton.addEventListener('click', () => openModal('loginModal'));
  signupButton.addEventListener('click', () => openModal('signupModal'));
}


function createModal(id, title, formContent) {
  const modalOverlay = document.createElement('div');
  modalOverlay.id = id;
  modalOverlay.className = 'modal-overlay';

  const modalContent = `
      <div class="modal-content">
          <h3>${title}</h3>
          <form id="${id}Form">${formContent}</form>
          <button onclick="closeModal('${id}')">Close</button>
      </div>
  `;
  modalOverlay.innerHTML = modalContent;
  document.body.appendChild(modalOverlay);
}

function addModalStyles() {
  const styles = `
      
      
      .btn-auth {
        padding: 8px 16px;
        background-color: #4CAF50; 
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        
      }
        .auth-container {
        position: absolute;
        top: 50%;
        right: 20px;  /* Adjust for spacing from the right edge */
        transform: translateY(-1000%);
      }

      .auth-container .btn-auth {
        margin-left: 10px;  /* Space between the buttons */
      }

      #loginButton, #signupButton, #logoutButton{
        display: inline-block;
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      #loginButton:hover, #signupButton:hover {
        background-color: #45a049;
      }

      #loginButton {
        margin-right: 15px;
      }

      .btn-auth:hover {
        background-color: #45a049;
      }

      
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: #fff;
        padding: 20px;
        width: 50%;
        max-width: 400px;
        border-radius: 8px;
        text-align: center;
      }

      .modal-content h3 {
        margin-bottom: 15px;
        color: #8bc34a;
      }

      .modal-content input {
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .modal-content button {
        padding: 10px;
        width: 60%;
        margin-top: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .modal-content button:hover {
        background-color: #45a049;
      }

      .welcome-message, .logout-message {
        font-size: 1.2em;
        color: #333;
        margin-top: 10px;
      }

      .logout-message {
        color: red;
      }

  `;
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function displayUsers() {
  const tableBody = document.getElementById('userTable');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.username}</td>
        <td><input type="text" value="${user.firstName}" /></td>
        <td><input type="text" value="${user.lastName}" /></td>
        <td><input type="email" value="${user.email}" /></td>
        <td><input type="password" value="${user.password}" /></td>
        <td>
          <button class="btn btn-success" onclick="editUser(${index})">Save</button>
          <button class="btn btn-danger" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
function editUser(index) {
  const row = document.querySelectorAll('#userTable tr')[index];
  const inputs = row.querySelectorAll('input');

  users[index] = {
    ...users[index],
    firstName: inputs[0].value,
    lastName: inputs[1].value,
    email: inputs[2].value,
    password: inputs[3].value
  };
  saveUsersToLocalStorage();
  alert('User data updated successfully!');
}

function deleteUser(index) {
  if (confirm('Are you sure you want to delete this user?')) {
    users.splice(index, 1);
    saveUsersToLocalStorage();
    displayUsers();
  }
}
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

// Function to create star rating for each recipe
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



