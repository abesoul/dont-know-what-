document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Match user
    const matchedUser = storedUsers.find(user =>
      user.username === username && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'index.html'; // Redirect to main NeonDAW
    } else {
      alert('❌ Invalid username or password. Please try again.');
    }
  });
});
