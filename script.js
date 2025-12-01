// script.js
// Gestão simples de sessão e perfil usando localStorage
// Keys used:
//  - site_user, site_pass (stored at signup — single-user fake system)
//  - site_session (current logged username)
//  - profile_<username> (JSON string with profile fields)

(function globalInit(){
  // When this file loads, update navbar links visibility if DOM ready later
  document.addEventListener('DOMContentLoaded', function(){
    updateNavbarAuth();
  });
})();

function isLogged() {
  return !!localStorage.getItem('site_session');
}

function currentUser() {
  return localStorage.getItem('site_session') || '';
}

// NAVBAR helper: hide login when logged and show Perfil link
function updateNavbarAuth() {
  try {
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');

    if (isLogged()) {
      if (loginLink) loginLink.style.display = 'none';
      if (profileLink) profileLink.style.display = 'inline-block';
      if (logoutLink) logoutLink.style.display = 'inline-block';
    } else {
      if (loginLink) loginLink.style.display = 'inline-block';
      if (profileLink) profileLink.style.display = 'none';
      if (logoutLink) logoutLink.style.display = 'none';
    }
  } catch (e) {
    // ignore
  }
}

// SIGNUP (fake)
function signupHandler(name, username, pass) {
  // minimal validation
  if (!username || !pass) return { success:false, message: 'Preenche email/username e password.' };

  // Save credentials (single-user fake)
  localStorage.setItem('site_user', username);
  localStorage.setItem('site_pass', pass);

  // create empty profile entry
  const profile = {
    nome: name || '',
    email: username || '',
    telefone: '',
    idade: '',
    profissao: '',
    localidade: '',
    frase: ''
  };
  localStorage.setItem('profile_' + username, JSON.stringify(profile));

  // login
  localStorage.setItem('site_session', username);
  updateNavbarAuth();
  return { success:true };
}

// LOGIN (fake)
function loginHandler(username, pass) {
  const regUser = localStorage.getItem('site_user');
  const regPass = localStorage.getItem('site_pass');

  if (!regUser) return { success:false, message:'Nenhuma conta encontrada. Cria uma conta primeiro.' };
  if (username === regUser && pass === regPass) {
    localStorage.setItem('site_session', username);
    updateNavbarAuth();
    return { success:true };
  } else {
    return { success:false, message:'Credenciais incorretas.' };
  }
}

// LOGOUT
function logoutHandler() {
  localStorage.removeItem('site_session');
  updateNavbarAuth();
  // redirect to home
  window.location.href = 'index.html';
}

// PROFILE functions
function getProfile(username) {
  const raw = localStorage.getItem('profile_' + username);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveProfile(username, profileObj) {
  localStorage.setItem('profile_' + username, JSON.stringify(profileObj));
}

// Utilities for pages
// Called by signup.html
function doSignup() {
  const name = document.getElementById('suNome').value.trim();
  const username = document.getElementById('suEmail').value.trim();
  const pass = document.getElementById('suPass').value;
  const msg = document.getElementById('signup-msg');

  const r = signupHandler(name, username, pass);
  if (r.success) {
    msg.style.color = '#b8ffb8';
    msg.innerText = 'Conta criada. A redirecionar...';
    setTimeout(()=> window.location.href = 'dashboard.html', 900);
  } else {
    msg.style.color = '#ffb3b3';
    msg.innerText = r.message || 'Erro';
  }
}

// Called by login.html
function doLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const msg = document.getElementById('login-msg');
  const r = loginHandler(username, pass);
  if (r.success) {
    window.location.href = 'dashboard.html';
  } else {
    msg.innerText = r.message;
    msg.style.color = '#ffb3b3';
  }
}

// Called by profile.html on submit
function saveProfileFromForm(e) {
  e && e.preventDefault();
  const username = currentUser();
  if (!username) {
    alert('Tem de fazer login para editar o perfil.');
    window.location.href = 'login.html';
    return;
  }
  const p = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    idade: document.getElementById('idade').value.trim(),
    profissao: document.getElementById('profissao').value.trim(),
    localidade: document.getElementById('localidade').value,
    frase: document.getElementById('frase').value.trim()
  };
  saveProfile(username, p);
  document.getElementById('profile-msg').innerText = 'Perfil guardado.';
  document.getElementById('profile-msg').style.color = '#b8ffb8';
  renderProfileDisplay(p);
}

// Render saved profile in display box
function renderProfileDisplay(p) {
  if (!p) return;
  document.getElementById('d_nome').innerText = p.nome || '';
  document.getElementById('d_email').innerText = p.email || '';
  document.getElementById('d_telefone').innerText = p.telefone || '';
  document.getElementById('d_idade').innerText = p.idade || '';
  document.getElementById('d_profissao').innerText = p.profissao || '';
  document.getElementById('d_localidade').innerText = p.localidade || '';
  document.getElementById('d_frase').innerText = p.frase || '';
  document.getElementById('displayArea').style.display = 'block';
}

// Called on profile.html load
function initProfilePage() {
  const username = currentUser();
  if (!username) {
    window.location.href = 'login.html';
    return;
  }
  // hide login, show profile link
  updateNavbarAuth();
  const prof = getProfile(username) || { nome:'', email:username, telefone:'', idade:'', profissao:'', localidade:'', frase:'' };
  // fill inputs
  document.getElementById('nome').value = prof.nome || '';
  document.getElementById('email').value = prof.email || '';
  document.getElementById('telefone').value = prof.telefone || '';
  document.getElementById('idade').value = prof.idade || '';
  document.getElementById('profissao').value = prof.profissao || '';
  document.getElementById('localidade').value = prof.localidade || '';
  document.getElementById('frase').value = prof.frase || '';

  if (prof.nome) renderProfileDisplay(prof);
}

// Called on dashboard.html load
function initDashboardPage() {
  const username = currentUser();
  if (!username) { window.location.href = 'login.html'; return; }
  document.getElementById('welcome').innerText = 'Olá, ' + username + ' — bem-vindo!';
  updateNavbarAuth();
}
