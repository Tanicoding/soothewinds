// ------------------ THEME TOGGLE ------------------
const toggleBtn = document.querySelector('.theme-toggle');
const body = document.body;

toggleBtn?.addEventListener('click', () => {
  body.classList.toggle('dark');
  toggleBtn.textContent = body.classList.contains('dark') ? '🌙' : '☀';
});

// ------------------ HOTLINE POPUP ------------------
document.addEventListener('DOMContentLoaded', () => {
  const hotlineBtn = document.querySelector('.hotline-btn');
  const hotlinePopup = document.querySelector('.hotline-popup');

  hotlineBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    hotlinePopup.style.display = hotlinePopup.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    hotlinePopup && (hotlinePopup.style.display = 'none');
  });
});

// ------------------ CHATBOX ------------------
document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  sendBtn?.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.classList.add('message', 'user');
    userMsg.textContent = text;
    chatBox.appendChild(userMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    messageInput.value = '';

    setTimeout(() => {
      const reply = document.createElement('div');
      reply.classList.add('message');
      reply.textContent = "This is an anonymous response.";
      chatBox.appendChild(reply);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
  });

  messageInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });
});

// ------------------ MEMORY MATCH ------------------
const gameBoard = document.getElementById('game-board');
if (gameBoard) {
  const messageDisplay = document.getElementById('message');
  const cardSymbols = ['🧠', '🧘‍♀️', '🌸', '🌳', '🌟', '✨', '🌈', '💧'];
  const cards = [...cardSymbols, ...cardSymbols];
  let flippedCards = [];
  let matchedPairs = 0;
  let lockBoard = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createCards() {
    shuffle(cards);
    cards.forEach(symbol => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${symbol}</div>
      `;
      card.addEventListener('click', () => flipCard(card, symbol));
      gameBoard.appendChild(card);
    });
  }

  function flipCard(card, symbol) {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flippedCards.push({ card, symbol });
    if (flippedCards.length === 2) {
      lockBoard = true;
      checkForMatch();
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.symbol === card2.symbol) {
      card1.card.classList.add('matched');
      card2.card.classList.add('matched');
      matchedPairs++;
      if (matchedPairs === cardSymbols.length) messageDisplay.textContent = 'You won! 🎉';
      resetFlippedCards();
    } else {
      setTimeout(() => {
        card1.card.classList.remove('flipped');
        card2.card.classList.remove('flipped');
        resetFlippedCards();
      }, 1000);
    }
  }

  function resetFlippedCards() {
    flippedCards = [];
    lockBoard = false;
  }

  createCards();
}

// ------------------ MUSICAL CHIMES ------------------
const chimeCanvas = document.getElementById('chime-canvas');
if (chimeCanvas) {
  const ctxChime = chimeCanvas.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  chimeCanvas.width = 800;
  chimeCanvas.height = 600;
  let chimes = [];
  const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

  function playNote(freq) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.6);
  }

  function drawChimes() {
    ctxChime.clearRect(0, 0, chimeCanvas.width, chimeCanvas.height);
    chimes.forEach(c => {
      ctxChime.save();
      ctxChime.translate(c.x, c.y);
      ctxChime.rotate(c.rotation);
      ctxChime.fillStyle = `rgba(144,202,249,${c.opacity})`;
      ctxChime.fillRect(-c.width/2, -c.height/2, c.width, c.height);
      ctxChime.restore();
    });
  }

  function updateChimes() {
    chimes = chimes.filter(c => c.opacity > 0.01);
    chimes.forEach(c => {
      c.rotation = Math.sin(c.y * 0.01) * 0.1;
      c.opacity -= 0.005;
    });
  }

  function gameLoopChimes() {
    updateChimes();
    drawChimes();
    requestAnimationFrame(gameLoopChimes);
  }

  chimeCanvas.addEventListener('click', (e) => {
    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
    playNote(freq);
    chimes.push({
      x: e.offsetX,
      y: e.offsetY,
      width: 10 + Math.random() * 5,
      height: 60 + Math.random() * 20,
      rotation: 0,
      opacity: 1
    });
  });

  gameLoopChimes();
}

// ------------------ SAND GARDEN ------------------
const sandCanvas = document.getElementById('sand-canvas');
if (sandCanvas) {
  const ctxSand = sandCanvas.getContext('2d');
  sandCanvas.width = 800;
  sandCanvas.height = 600;
  let isDrawing = false;
  let lastX = 0, lastY = 0;

  function drawSand(e) {
    if (!isDrawing) return;
    ctxSand.fillStyle = 'rgba(252,232,168,0.05)';
    ctxSand.fillRect(0,0,sandCanvas.width,sandCanvas.height);
    ctxSand.beginPath();
    ctxSand.strokeStyle = '#5d4037';
    ctxSand.lineWidth = 2;
    ctxSand.lineCap = 'round';
    ctxSand.moveTo(lastX,lastY);
    ctxSand.lineTo(e.offsetX,e.offsetY);
    ctxSand.stroke();
    [lastX,lastY] = [e.offsetX,e.offsetY];
  }

  sandCanvas.addEventListener('mousedown', e => { isDrawing=true; [lastX,lastY]=[e.offsetX,e.offsetY]; });
  sandCanvas.addEventListener('mousemove', drawSand);
  sandCanvas.addEventListener('mouseup', () => isDrawing=false);
  sandCanvas.addEventListener('mouseout', () => isDrawing=false);
  ctxSand.fillStyle = '#fce8a8';
  ctxSand.fillRect(0,0,sandCanvas.width,sandCanvas.height);
}

// ------------------ WHACK-A-MOLE ------------------
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
if(holes.length && scoreDisplay && timerDisplay && startBtn) {
  let score = 0, timer = 30, lastHole, timeUp=false;

  function randomTime(min,max){ return Math.round(Math.random()*(max-min)+min);}
  function randomHole(holes){
    const idx = Math.floor(Math.random()*holes.length);
    const hole = holes[idx];
    if(hole===lastHole) return randomHole(holes);
    lastHole=hole;
    return hole;
  }

  function peep(){
    const time=randomTime(500,1500);
    const hole=randomHole(holes);
    const mole=document.createElement('div');
    mole.classList.add('mole');
    hole.appendChild(mole);
    hole.classList.add('up');
    setTimeout(()=>{
      hole.classList.remove('up');
      hole.removeChild(mole);
      if(!timeUp) peep();
    },time);
  }

  function startGame(){
    score=0; timer=30; timeUp=false;
    scoreDisplay.textContent='Score: 0';
    startBtn.style.display='none';
    peep();
    const gameTimer = setInterval(()=>{
      timer--;
      timerDisplay.textContent=`Time: ${timer}`;
      if(timer<=0){
        clearInterval(gameTimer);
        timeUp=true;
        setTimeout(gameOver,500);
      }
    },1000);
  }

  function bonk(e){
    if(!e.isTrusted || !this.classList.contains('up')) return;
    score++;
    this.classList.remove('up');
    scoreDisplay.textContent=`Score: ${score}`;
  }

  function gameOver(){
    alert(`Game Over! Your final score is: ${score}`);
    startBtn.style.display='block';
  }

  holes.forEach(hole=>hole.addEventListener('click',bonk));
  startBtn.addEventListener('click',startGame);
