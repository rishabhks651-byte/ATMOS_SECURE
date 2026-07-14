const display = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const generateBtn = document.getElementById('generate-btn');

// Lists of Characters
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// Live update length text
lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = e.target.value;
});

// Main Generate Event Listener
generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    let characterPool = '';
    
    if (lowercaseEl.checked) characterPool += lowercaseChars;
    if (uppercaseEl.checked) characterPool += uppercaseChars;
    if (numbersEl.checked) characterPool += numberChars;
    if (symbolsEl.checked) characterPool += symbolChars;

    if (characterPool === '') {
        display.value = '';
        updateStrength(0);
        alert('Please check at least one character type.');
        return;
    }

    let password = '';
    const length = parseInt(lengthSlider.value);

    // Modern cryptographic random values
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomArray[i] % characterPool.length;
        password += characterPool[randomIndex];
    }

    display.value = password;
    evaluateStrength(password, length);
}

// Simple logic to evaluate strength and adjust Atmos neon color bars
function evaluateStrength(password, length) {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    updateStrength(score);
}

function updateStrength(score) {
    // strength scaling (max potential is 7 points)
    let percentage = (score / 7) * 100;
    strengthBar.style.width = `${percentage}%`;

    if (score === 0) {
        strengthBar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        strengthText.innerText = 'Strength: Empty';
    } else if (score < 3) {
        strengthBar.style.backgroundColor = '#ff3b30'; // red
        strengthText.innerText = 'Strength: Weak';
        strengthText.style.color = '#ff3b30';
    } else if (score < 5) {
        strengthBar.style.backgroundColor = '#ffcc00'; // yellow
        strengthText.innerText = 'Strength: Medium';
        strengthText.style.color = '#ffcc00';
    } else {
        strengthBar.style.backgroundColor = 'var(--atmos-blue)'; // Neon Dolby Cyan
        strengthText.innerText = 'Strength: Strong (Spatial Secure)';
        strengthText.style.color = 'var(--atmos-blue)';
    }
}

// Smooth Copy Action with temporary visual cue
copyBtn.addEventListener('click', () => {
    if (!display.value) return;
    
    navigator.clipboard.writeText(display.value).then(() => {
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span style="font-size: 0.8rem; color: var(--atmos-blue); font-weight: bold;">Copied!</span>`;
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 1500);
    });
});
