let captcha;

export const generateCaptcha = () => {
    const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    let randomString = "";
    const stringLength = 8;

    for (let i = 0; i < stringLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomString += chars[randomIndex];
    }

    captcha = randomString;
    return randomString;
};

export const verifyCaptcha = (input) => {
    if (captcha === input) return true;

    return false
};
