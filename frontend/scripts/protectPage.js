const checkIfAuthorized = async () => {
    const isLoggedIn = await fetch("http://localhost:3000/api/user/me", { credentials: "include" });
    if (!isLoggedIn.ok) {
        window.location.replace("/");
    }
};

checkIfAuthorized();
