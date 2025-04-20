// Handle register form submission
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('new-username').value.trim();
  const password = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Basic field checks
  if (!username || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  // Check if username is taken
  const userExists = storedUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
  if (userExists) {
    alert('Username already exists. Please choose another one.');
    return;
  }

  // Save new user
  storedUsers.push({ username, password });
  localStorage.setItem('users', JSON.stringify(storedUsers));

  // Optional: Log them in immediately
  localStorage.setItem('loggedInUser', username);
  alert('Registration successful! Welcome to NeonDAW.');

  // Redirect to app
  window.location.href = 'index.html';
});
