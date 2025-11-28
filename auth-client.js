const API = 'YOUR_WEBAPP_URL';

export async function register(email, password, nome) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ action: 'register', email, password, nome })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ action: 'login', email, password })
  });
  return res.json();
}
