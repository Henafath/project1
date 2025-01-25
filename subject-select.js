document.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.dataset.subject;
      localStorage.setItem('selectedSubject', subject);
      window.location.href = '/game.html';
    });
  });