document.addEventListener('DOMContentLoaded', () => {
    const createTeamBtn = document.getElementById('create-team-btn');
    const joinTeamBtn = document.getElementById('join-team-btn');
    const createTeamForm = document.getElementById('create-team-form');
    const joinTeamForm = document.getElementById('join-team-form');
    const generateCodeBtn = document.getElementById('generate-code');
  
    createTeamBtn.addEventListener('click', () => {
      createTeamForm.classList.remove('hidden');
      joinTeamForm.classList.add('hidden');
    });
  
    joinTeamBtn.addEventListener('click', () => {
      joinTeamForm.classList.remove('hidden');
      createTeamForm.classList.add('hidden');
    });
  
    generateCodeBtn.addEventListener('click', () => {
      const teamName = document.getElementById('team-name').value;
      const playerName = document.getElementById('player-name').value;
      
      if (teamName && playerName) {
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Store team details (in a real app, this would use backend storage)
        const teamDetails = {
          name: teamName,
          code: teamCode,
          creator: playerName,
          members: [playerName],
          score: 0
        };
  
        localStorage.setItem('currentTeam', JSON.stringify(teamDetails));
        alert(`Team Code: ${teamCode}. Share this with your teammates!`);
      } else {
        alert('Please enter Team Name and Your Name');
      }
    });
  
    document.getElementById('join-code').addEventListener('click', () => {
      const teamCode = document.getElementById('team-code').value;
      const playerName = document.getElementById('joining-player-name').value;
  
      // In a real app, this would validate against a backend
      const storedTeam = JSON.parse(localStorage.getItem('currentTeam'));
      
      if (storedTeam && storedTeam.code === teamCode) {
        storedTeam.members.push(playerName);
        localStorage.setItem('currentTeam', JSON.stringify(storedTeam));
        alert('Successfully joined the team!');
      } else {
        alert('Invalid team code');
      }
    });
  });