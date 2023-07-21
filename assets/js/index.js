
// Get references to the password input and the eye button
const password = document.getElementById('floatingPassword');
const passwordRepeat = document.getElementById('floatingPasswordRepeat')
const togglePasswordBtn = document.getElementById('togglePassword');
const togglePasswordRptBtn = document.getElementById('togglePasswordRpt');
const emoji = document.getElementById('emoji')
// Add an event listener to the eye button to toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        togglePasswordBtn.innerHTML = `<i  class="fas fa-eye fs-5"></i>`;
    } else {
        password.type = 'password';
        togglePasswordBtn.innerHTML = `<i class="fas fa-eye-slash fs-5"></i>`;
    }
});

togglePasswordRptBtn.addEventListener('click', () => {
    if (passwordRepeat.type === 'password') {
        passwordRepeat.type = 'text';
        togglePasswordRptBtn.innerHTML = `<i  class="fas fa-eye fs-5"></i>`;
    } else {
        passwordRepeat.type = 'password';
        togglePasswordRptBtn.innerHTML = `<i class="fas fa-eye-slash fs-5"></i>`;
    }
});

function validateForm() {
    let username = document.getElementById('floatingname').value;
    let email = document.getElementById('floatingInput').value;
    let password = document.getElementById('floatingPassword').value;
    let passwordRepeat = document.getElementById('floatingPasswordRepeat').value;
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const firstLetter = username.charAt(0);

    // Check if username is not empty
    if (username.trim() === '') {
        displayFeedback('Username cannot be empty.');
        emoji.innerHTML = `<img src="assets/images/sticker_5.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    // Check if username starts with capital letter
    if (!/[A-Z]/.test(firstLetter)) {
        displayFeedback('Username must start with a capital letter.');
        emoji.innerHTML = `<img src="assets/images/sticker_10.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }
    // Check if username is more than 8 letters
    if (username.length < 5) {
        displayFeedback('Username must be at least 5 characters.');
        emoji.innerHTML = `<img src="assets/images/sticker_21.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }
    // Check if username contains forbidden characters
    if (/[\(\){}\[\]\|`¬¦!"£$%^&*"<>\:\;#~_\-+=,@\.]/.test(username)) {
        displayFeedback('Username contains forbidden characters.');
        emoji.innerHTML = `<img src="assets/images/sticker_23.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }
    // Check if email pattern match
    if (!email.match(emailPattern)) {
        displayFeedback('Email pattern does not match email addresses');
        emoji.innerHTML = `<img src="assets/images/sticker_9.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }
    // Check if password contains consecutive letters or numbers
    if (/(.)\1/.test(password)) {
        displayFeedback('Password cannot contain consecutive letters or numbers.');
        emoji.innerHTML = `<img src="assets/images/sticker_6.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    // Check if password is not empty
    if (password.trim() === '') {
        displayFeedback('Password cannot be empty.');
        emoji.innerHTML = `<img src="assets/images/sticker_4.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    // Check if password contains capital letters, numbers, and characters
    if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
        displayFeedback('Password must include a combination of capital letters, numbers, and characters.');
        emoji.innerHTML = `<img src="assets/images/sticker_27.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    // Check if password is more than 8 letters
    if (password.length < 8) {
        displayFeedback('Password must be more than 8 characters.');
        emoji.innerHTML = `<img src="assets/images/sticker_13.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    // Check if password and repeat password match
    if (password !== passwordRepeat) {
        displayFeedback('Passwords do not match.');
        emoji.innerHTML = `<img src="assets/images/sticker_14.png" alt="" style="width:  80%; margin: auto;">`;
        return false;
    }

    displayFeedback('Everything Looks Good');
    emoji.innerHTML = `<img src="assets/images/sticker_1.png" alt="" style="width:  80%; margin: auto;">`;
    // If all validations pass, the form can be submitted.
    return true;

}

function checkFormError() {
    // Clear previous feedback when the user is typing.
    document.getElementById('feedbackArea').innerHTML = `<p class="p-3 border text-center">Observing your input with interest... Hmmm...</p>`;
    emoji.innerHTML = `<img src="assets/images/sticker_7.png" alt="" style="width:  80%; margin: auto;">`;
    setTimeout(validateForm, 2000);
    // Implement any real-time feedback during password input (if required).
}

function displayFeedback(message) {
    document.getElementById('feedbackArea').innerHTML = `<p class="text-danger p-3 border text-center rounded"> ${message}</p>`;
}