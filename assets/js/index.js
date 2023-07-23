const password = document.getElementById('floatingPassword');
const passwordRepeat = document.getElementById('floatingPasswordRepeat')
const togglePasswordBtn = document.getElementById('togglePassword');
const togglePasswordRptBtn = document.getElementById('togglePasswordRpt');
const emoji = document.getElementById('emoji')

// Event listener to the eye button to toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        togglePasswordBtn.innerHTML = `<i  class="fas fa-eye fs-5 text-white"></i>`;
    } else {
        password.type = 'password';
        togglePasswordBtn.innerHTML = `<i class="fas fa-eye-slash fs-5 text-white"></i>`;
    }
});

togglePasswordRptBtn.addEventListener('click', () => {
    if (passwordRepeat.type === 'password') {
        passwordRepeat.type = 'text';
        togglePasswordRptBtn.innerHTML = `<i  class="fas fa-eye fs-5 text-white"></i>`;
    } else {
        passwordRepeat.type = 'password';
        togglePasswordRptBtn.innerHTML = `<i class="fas fa-eye-slash fs-5 text-white"></i>`;
    }
});

function validateForm() {
    let username = document.getElementById('floatingname').value;
    let email = document.getElementById('floatingInput').value;
    let password = document.getElementById('floatingPassword').value;
    let passwordRepeat = document.getElementById('floatingPasswordRepeat').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const firstLetter = username.charAt(0);
    let submitBtn = document.getElementById('submit-btn');

    // Check if username is not empty
    if (username.trim() === '') {
        displayFeedback('Username cannot be empty.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_5.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if username starts with capital letter
    if (!/[A-Z]/.test(firstLetter)) {
        displayFeedback('Username must start with a capital letter.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_10.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if username is more than 8 letters
    if (username.length < 5) {
        displayFeedback('Username must be at least 5 characters.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_21.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if username contains forbidden characters
    if (/[\(\){}\[\]\|`¬¦!"£$%^&*"<>\:\;#~_\-+=,@\.]/.test(username)) {
        displayFeedback('Usernames cannot contain forbidden characters.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_23.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if username contains spaces
    if (/\s/.test(username)) {
        displayFeedback('Username cannot contain spaces.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_16.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if email pattern match
    if (!email.match(emailPattern)) {
        displayFeedback('Email pattern does not match email addresses', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_9.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }
    // Check if password contains consecutive letters or numbers
    if (/(.)\1/.test(password)) {
        displayFeedback('Password cannot contain consecutive letters or numbers.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_6.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }

    // Check if password is not empty
    if (password.trim() === '') {
        displayFeedback('Password cannot be empty.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_4.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }

    // Check if password contains capital letters, numbers, and characters
    if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
        displayFeedback('Password must include a combination of capital letters, numbers, and characters.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_27.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }

    // Check if password is more than 8 letters
    if (password.length < 8) {
        displayFeedback('Password must be more than 8 characters.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_13.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }

    // Check if password and repeat password match
    if (password !== passwordRepeat) {
        displayFeedback('Passwords do not match.', '#E80000');
        emoji.innerHTML = `<img src="assets/images/sticker_14.png" alt="" style="width:  80%; margin: auto;">`;
        submitBtn.style.backgroundColor = "#E80000";
        return false;
    }

    displayFeedback('Everything Looks Good', '#69aa22');
    emoji.innerHTML = `<img src="assets/images/sticker_1.png" alt="" style="width:  80%; margin: auto;">`;
    submitBtn.style.backgroundColor = "#69aa22";
    // submit form if validation is true
    return true;

}

function checkFormError() {
    let password = document.getElementById('floatingPassword').value;
    const strength = calcPasswordStrength(password);
    displayPasswordStrength(strength);
    // This clears previous feedback when the user is typing.
    document.getElementById('feedbackArea').innerHTML = `<p class="p-3 border text-black text-center rounded bg-light message">Observing your input with interest... Hmmm...</p>`;
    emoji.innerHTML = `<img src="assets/images/sticker_7.png" alt="" style="width:  80%; margin: auto;">`;
    setTimeout(validateForm, 1000);
    updateDots(strength);
}

function calcPasswordStrength(password) {
    // Checks password strength against different parameters.
    const minLength = 8;
    const maxLength = 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(password);
    const hasConsecutiveChars = /(.)\1/.test(password);

    let score = 0;

    if (password.length === 0) {
        score = 0;
    } else if (password.length >= minLength && password.length <= maxLength) {
        score += 25;
    }
    
    if (hasUpperCase && hasLowerCase) {
        score += 20;
    }
    
    if (hasNumbers) {
        score += 20;
    }
    
    if (hasSpecialChars) {
        score += 25;
    }
    
    if (!hasConsecutiveChars) {
        score += 10;
    }
    
    score = Math.max(0, Math.min(100, score));

    return score;
}


function updateDots(strength) {
    const maxDots = 10;
    const dotsContainer = document.getElementById('dotsContainer');

    // This will Calculate the number of dots to show based on password strength
    const numDotsDisplayed = Math.ceil((strength / 100) * maxDots);

    // This will Clear existing dots
    dotsContainer.innerHTML = '';

    // This Creates and append new dots
    for (let i = 0; i < numDotsDisplayed; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
}
function displayPasswordStrength(strength) {
    const passwordStrength = document.getElementById('passwordStrength');
    passwordStrength.textContent = `${strength}%`;
  }
function displayFeedback(message, color) {
    let feedbackArea = document.getElementById('feedbackArea');
    feedbackArea.innerHTML = `<p class="p-3 border text-center rounded bg-light message"> ${message}</p>`;
    feedbackArea.style.color = color;
}
