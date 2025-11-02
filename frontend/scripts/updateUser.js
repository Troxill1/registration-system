const nameButton = document.getElementById("name-button");
const passwordButton = document.getElementById("password-button");

const nameForm = document.getElementById("name-form");
const passwordForm = document.getElementById("password-form");

const notificator = document.getElementById("notification");

const nameRegex = /^[A-Za-z]{1,16}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // TODO: remove(at least 8 symbols, at least 1 digit, no special chars)

const displayNameForm = () => {
    nameForm.hidden = false;
    passwordForm.hidden = true;

    const firstName = document.getElementById("first-name").innerText;
    const lastName = document.getElementById("last-name").innerText;
    const firstNameInput = document.getElementById("first-name-input");
    const lastNameInput = document.getElementById("last-name-input");

    firstNameInput.value = firstName;
    lastNameInput.value = lastName;
};

const handleNameUpdate = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").innerText;
    const firstName = document.getElementById("first-name-input").value;
    const lastName = document.getElementById("last-name-input").value;

    if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
        notificator.innerHTML = "Invalid name";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/user/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ email, firstName, lastName }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        window.location.reload();
    } catch (error) {
        console.error(error.message);
        notificator.innerHTML = "Server error. Name update failed";
    }
};

const displayPasswordForm = async () => {
    passwordForm.hidden = false;
    nameForm.hidden = true;
};

const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").innerText;
    const password = document.getElementById("password-input").value;
    const newPassword = document.getElementById("new-password-input").value;

    if (!newPassword.match(passwordRegex) || !password.match(passwordRegex) || password === newPassword) {
        notificator.innerHTML = "Invalid password";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/user/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ email, password, newPassword }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        passwordForm.hidden = true;
        notificator.innerHTML = "Successfully updated password";
    } catch (error) {
        const { message } = error;
        if (message === '400') {
            notificator.innerHTML = "Incorrect password";
        } else {
            console.error(message);
            notificator.innerHTML = "Server error. Password update failed";
        }
    }
};

nameButton.addEventListener("click", displayNameForm);
passwordButton.addEventListener("click", displayPasswordForm);

nameForm.addEventListener("submit", handleNameUpdate);
passwordForm.addEventListener("submit", handlePasswordUpdate);
