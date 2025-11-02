import { generateCaptcha, verifyCaptcha } from "../scripts/captcha.js";

const registrationForm = document.getElementById("registration-form");
const loginForm = document.getElementById("login-form");
const notification = document.getElementById("notification");

const captchaForm = document.getElementById("captcha-form");
const captchaDisplay = document.getElementById("captcha-display");
const captchaInput = document.getElementById("captcha-input");
const captchaNotification = document.getElementById("captcha-notification");

let firstName, lastName, email, password;

const nameRegex = /^[A-Za-z]{1,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const checkCaptcha = async (input, action) => {
	if (verifyCaptcha(input)) {
		if (action === "login") {
			captchaNotification.innerText = "Logging in...";
			await attemptLogin();

			captchaForm.hidden = true;
			loginForm.hidden = false;
		} else if (action === "register") {
			captchaNotification.innerText = "Registering...";
			await attemptRegister();

			captchaForm.hidden = true;
			registrationForm.hidden = false;
		}

		captchaInput.value = "";
	} else {
		captchaNotification.innerText = "Incorrect attempt";
	}
};

const validateRegistration = (e) => {
	e.preventDefault();

	const formData = new FormData(registrationForm);
	firstName = formData.get("first-name");
	lastName = formData.get("last-name");
	email = formData.get("email");
	password = formData.get("password");
	const confirmPassword = formData.get("confirm-password");

	if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
		notification.innerHTML = "Invalid name";
		return;
	}
	if (!email.match(emailRegex)) {
		notification.innerHTML = "Invalid email";
		return;
	}
	if (!password.match(passwordRegex)) {
		notification.innerHTML = "Invalid password";
		return;
	}
	if (password !== confirmPassword) {
		notification.innerHTML = "Mismatching passwords";
		return;
	}

	captchaForm.hidden = false;
	registrationForm.hidden = true;
	captchaDisplay.value = generateCaptcha();

	captchaNotification.innerText = "";
	captchaInput.addEventListener("input", () => checkCaptcha(captchaInput.value, "register"));
};

const attemptRegister = async () => {
	try {
		const response = await fetch("http://localhost:3000/api/user/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ firstName, lastName, email, password }),
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(response.status);
		}

		window.location.replace("/home.html");
	} catch (error) {
		const { message } = error;
		if (message === '400') {
			notification.innerHTML = "User already exists";
		} else {
			console.error(message);
			notification.innerHTML = "Server error. Registration failed";
		}        
	}
};

const validateLogin = (e) => {
	e.preventDefault();

	const formData = new FormData(loginForm);
	email = formData.get("email");
	password = formData.get("password");

	if (!email.match(emailRegex)) {
		notification.innerHTML = "Invalid email";
		return;
	}
	if (!password.match(passwordRegex)) {
		notification.innerHTML = "Invalid password";
		return;
	}

	captchaForm.hidden = false;
	loginForm.hidden = true;
	captchaDisplay.value = generateCaptcha();
	
	captchaNotification.innerText = "";
	captchaInput.addEventListener("input", () => checkCaptcha(captchaInput.value, "login"));
};

const attemptLogin = async () => {
	try {
		const response = await fetch("http://localhost:3000/api/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
			credentials: "include"
		});

		if (!response.ok) {
			throw new Error(response.status);
		}

		window.location.replace("/home.html");
	} catch (error) {
		const { message } = error;
		if (message === '400') {
			notification.innerHTML = "Incorrect password";
		} else if (message === '404') {
			notification.innerHTML = "User not found";
		} else {
			console.error(message);
			notification.innerHTML = "Server error. Login failed";
		}        
	}
}

if (registrationForm) {
	registrationForm.addEventListener("submit", validateRegistration);
} else if (loginForm) {
	loginForm.addEventListener("submit", validateLogin);
}

const captchaButton = document.getElementById("captcha-button");
captchaButton.addEventListener("click", () => { 
	captchaDisplay.value = generateCaptcha();
});
