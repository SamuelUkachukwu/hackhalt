const togglePasswordBtn = document.getElementById('togglePassword');

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