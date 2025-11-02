const setUserInfo = async () => {
    const emailP = document.getElementById("email");
    const firstNameP = document.getElementById("first-name");
    const lastNameP = document.getElementById("last-name");

    try {
        const response = await fetch("http://localhost:3000/api/user/me", { credentials: "include" });
        if (!response.ok) {
            throw new Error(response.status);
        }

        const { email, firstName, lastName } = await response.json();
        emailP.innerHTML = email;
        firstNameP.innerHTML = firstName;
        lastNameP.innerHTML = lastName;
    } catch (error) {
        console.error(error.message); 
    }
};

setUserInfo();
