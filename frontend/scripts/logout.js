const logout = async () => {
    await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        credentials: "include"
    });
};

logout();
