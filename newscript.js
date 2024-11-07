document.addEventListener('DOMContentLoaded', function () {
    let account = null;

    function openModal(title, onSubmit) {
        const modal = document.createElement('div');
        modal.classList.add('modal-overlay');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
    
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
    
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.marginBottom = '15px';
        titleElement.style.color = '#8bc34a';
    
        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Enter your name';
        nameInput.classList.add('form-control', 'mb-3');
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordInput.classList.add('form-control', 'mb-3');
    
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
    
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.classList.add('btn', 'btn-success');
        submitButton.onclick = () => {
            onSubmit(nameInput.value, passwordInput.value);
            modal.remove();
        };
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('btn', 'btn-success');
        closeButton.onclick = () => modal.remove();
    
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(closeButton);
    
        modalContent.appendChild(titleElement);
        modalContent.appendChild(nameInput);
        modalContent.appendChild(passwordInput);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    

function createAccount() {
    openModal('Sign Up', (name, password) => {
        if (!name || !password) {
            alert("Both name and password are required.");
            return;
        }
        account = { username: name, password: password };
        alert("Account created successfully!");
    });
}

function login() {
    openModal('Log In', (name, password) => {
        if (!account) {
            alert("No account found. Please sign up first.");
            return;
        }
        if (name === account.username && password === account.password) {
            alert("Login successful! Welcome, " + name + "!");
        } else {
            alert("Invalid name or password.");
        }
    });
}

// Add Sign Up and Log In buttons to the header
window.onload = function() {
    const headerContainer = document.querySelector("header .container");

    const clientLoginDiv = document.createElement("div");
    clientLoginDiv.classList.add("client-login");

    const signUpButton = document.createElement("button");
    signUpButton.textContent = "Sign Up";
    signUpButton.classList.add("btn", "btn-outline-dark", "me-2");
    signUpButton.onclick = createAccount;

    const loginButton = document.createElement("button");
    loginButton.textContent = "Log In";
    loginButton.classList.add("btn", "btn-outline-dark");
    loginButton.onclick = login;

    clientLoginDiv.appendChild(signUpButton);
    clientLoginDiv.appendChild(loginButton);

    headerContainer.appendChild(clientLoginDiv);
};

});