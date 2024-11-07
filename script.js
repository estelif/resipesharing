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
    header.appendChild(authContainer); 
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


/*submit recipe admin panel*/





function recipesubmit(event) {
  event.preventDefault();

  let username = loggedInUser ? loggedInUser.username : null;
  let recipeName = document.getElementById('recipe-name').value;
  let category = document.getElementById('category').value;
  let ingredients = document.getElementById('ingredients').value;
  let cookingTime = document.getElementById('cooking-time').value;
  let difficulty = document.getElementById('difficulty').value;
  let instructions = document.getElementById('instructions').value;
  let recipeImage = document.getElementById('recipe-image').files[0]; 

  if (!username) {
      alert("Please log in first.");
      return;
  }

  if (recipeImage) {
      let reader = new FileReader();
      reader.onloadend = function () {
          let recipeData = {
              username: username,
              recipeName: recipeName,
              category: category,
              ingredients: ingredients,
              cookingTime: cookingTime,
              difficulty: difficulty,
              instructions: instructions,
              image: reader.result
          };

          let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
          recipes.push(recipeData);
          localStorage.setItem('recipes', JSON.stringify(recipes));

          alert("Recipe submitted successfully!");
          event.target.reset();

          
      };
      reader.readAsDataURL(recipeImage); 
  } else {
      alert("Please upload an image.");
  }
}



window.onload = function () {
  let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  let tableBody = document.getElementById('recipeTableBody');

  recipes.forEach(function (recipe, index) {
      let row = document.createElement('tr');

      row.innerHTML = `
          <td>${recipe.username}</td>
          <td>${recipe.recipeName}</td>
          <td>${recipe.category}</td>
          <td>${recipe.ingredients}</td>
          <td>${recipe.cookingTime} minutes</td>
          <td>${recipe.difficulty}</td>
          <td>${recipe.instructions}</td>
          <td><img src="${recipe.image}" alt="${recipe.recipeName}" width="100" height="100">
</td>
          <td><button onclick="deleteRecipe(${index})" class="btn btn-danger">Delete</button></td>
      `;

      tableBody.appendChild(row);
  });
};

function deleteRecipe(index) {
  let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  recipes.splice(index, 1); 
  localStorage.setItem('recipes', JSON.stringify(recipes));

  
  window.location.reload();
}


