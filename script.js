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
  const logoutButton = document.createElement('a');
  logoutButton.href = 'javascript:void(0)';
  logoutButton.id = 'logoutButton';
  logoutButton.className = 'btn btn-dark-green me-2';
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
  const nav = document.createElement('nav');
  
  const loginButton = document.createElement('a');
  loginButton.href = 'javascript:void(0)';
  loginButton.id = 'loginButton';
  loginButton.className = 'btn btn-dark-green me-2';
  loginButton.textContent = 'Login';

  const signupButton = document.createElement('a');
  signupButton.href = 'javascript:void(0)';
  signupButton.id = 'signupButton';
  signupButton.className = 'btn btn-dark-green me-2';
  signupButton.textContent = 'Sign Up';

  nav.appendChild(loginButton);
  nav.appendChild(signupButton);

  const header = document.querySelector('header .container');
  if (header) {
    header.appendChild(nav);
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
      .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10;
      }
      .modal-content {
          background: #fff;
          padding: 20px;
          width: 90%;
          max-width: 400px;
          border-radius: 8px;
          text-align: center;
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
          width: 100%;
          margin-top: 10px;
      }
      .welcome-message {
          font-size: 1.2em;
          color: #333;
          margin-top: 10px;
      }
      .logout-message {
          font-size: 1em;
          color: red;
          margin-top: 10px;
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

document.addEventListener("DOMContentLoaded", function () {
  const photo = document.getElementById('photo');
  photo.addEventListener("mouseenter", () => {
      photo.style.width = "100px";
      photo.style.length = "100px";
      photo.style.backgroundColor = "red";
      photo.style.borderRadius = "50%";
  });
  photo.addEventListener("mouseleave", () =>{
     
  });
});
