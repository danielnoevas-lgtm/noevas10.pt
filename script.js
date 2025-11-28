// script.js — modo claro/escuro, smooth nav highlight, small animations
document.addEventListener('DOMContentLoaded', function(){
  // theme
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  if(localStorage.theme === 'light') body.classList.add('light');

  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      body.classList.toggle('light');
      localStorage.theme = body.classList.contains('light') ? 'light' : 'dark';
    });
  }

  // smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // simple entry animations
  document.querySelectorAll('.fade-up').forEach((el,i)=>{
    setTimeout(()=> el.classList.add('visible'), 120*i);
    el.style.opacity = 1;
    el.style.transform = 'none';
  });

  // nav active based on URL
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(a=>{
    if(a.getAttribute('href') === path || (path === '' && a.getAttribute('href') === 'index.html')){
      a.classList.add('active');
    }
  });
});
