const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Function to store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomArbitrary(min, max) {
  let cached = Math.random() * (max - min) + min;
  cached = Math.floor(cached);
  return cached;
}

// Function to clear local storage
function clear() {
  localStorage.clear();
}

// Function to generate SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate and store the SHA256 hash of a random 3-digit number
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  let randomNum = getRandomArbitrary(MIN, MAX);
  cached = await sha256(randomNum.toString());
  store('sha256', cached);
  return cached;
}

// Display the SHA256 hash on the webpage
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Check if entered pin matches the generated hash
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const hasedPin = await sha256(pin);

  if (hasedPin === sha256HashView.innerHTML) {
    resultView.innerHTML = '🎉 Success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Failed';
  }
  resultView.classList.remove('hidden');
}

// Ensure input field only accepts 3-digit numbers
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// Brute-force function to find the original number
async function findOriginalNumber() {
  const targetHash = sha256HashView.innerText;

  for (let num = MIN; num <= MAX; num++) {
    const hash = await sha256(num.toString());
    if (hash === targetHash) {
      alert("✅ The original number is: " + num);
      return;
    }
  }

  alert("❌ No match found. Check your implementation!");
}

// Attach event listeners to buttons
document.getElementById('check').addEventListener('click', test);
document.getElementById('brute-force').addEventListener('click', findOriginalNumber);

// Run main function on page load
main();
