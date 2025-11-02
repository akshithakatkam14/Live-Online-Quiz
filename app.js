// Storage Keys
const USERS_KEY = 'quizUsers.v1';
const CURRENT_USER_KEY = 'quizCurrentUser.v1';

// Authentication Manager
class AuthManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  }

  loadCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return false;
    }
    this.currentUser = user;
    this.saveCurrentUser();
    return true;
  }

  signup(name, email, password) {
    if (this.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    this.saveCurrentUser();
    return true;
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser();
  }
}

// Local Storage Manager for Quiz
class LocalStorageManager {
  constructor() { this.initializeStorage(); }
  initializeStorage() {
    const defaultQuestions = [
      { id: 1, question: "What is 2+2?", options: ["3","4","5","6"], answer: "4", topic: "math" },
      { id: 2, question: "What is Capital of France?", options: ["Berlin","Madrid","Paris","London"], answer: "Paris", topic: "general" },
      { id: 3, question: "HTML stands for?", options: ["HyperText Markup Language","Home Tool","Hyperlinks and Text","High Tech"], answer: "HyperText Markup Language", topic: "programming" },
      { id: 4, question: "What is Red Planet?", options: ["Venus","Mars","Jupiter","Saturn"], answer: "Mars", topic: "science" },
      { id: 5, question: "Which mammal is called Largest mammal?", options: ["Elephant","Blue Whale","Giraffe","Hippo"], answer: "Blue Whale", topic: "science" },
      { id: 6, question: "In which year did WW2 end?", options: ["1942","1945","1948","1950"], answer: "1945", topic: "history" },
      { id: 7, question: "What is Fastest land animal?", options: ["Cheetah","Lion","Horse","Greyhound"], answer: "Cheetah", topic: "sports" },
      { id: 8, question: "Which movie won Best Picture (2020)?", options: ["Joker","1917","Parasite","Ford v Ferrari"], answer: "Parasite", topic: "movies" },
      { id: 9, question: "What is Largest ocean?", options: ["Atlantic","Indian","Pacific","Arctic"], answer: "Pacific", topic: "geography" },
      { id: 10, question: "Value of π (approx)?", options: ["2.71","3.14","1.62","1.41"], answer: "3.14", topic: "math" },
      { id: 11, question: "HTTP stands for?", options: ["HyperText Transfer Protocol","High Tech Transfer Program","Hyperlink Text Transport","Host Transfer Type"], answer: "HyperText Transfer Protocol", topic: "technology" },
      { id: 12, question: "How many states are there in India?", options: ["28","29","30","31"], answer: "28", topic: "general" },
      { id: 13, question: "Expansion of CPU?", options: ["Central Process Unit","Central Processing Unit","Computer Personal Unit","Control Processing Unit"], answer: "Central Processing Unit", topic: "technology" },
      { id: 14, question: "What are arithemetic operators?", options: ["+ - * / %","= == ===","&& || !","< > <= >="], answer: "+ - * / %", topic: "programming" },
    ];

    const existing = JSON.parse(localStorage.getItem('quizQuestions') || '[]');
    if (existing.length === 0) {
      localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
    } else {
      const merged = [...existing];
      defaultQuestions.forEach(seed => {
        const alreadyPresent = merged.some(q => q.question === seed.question);
        if (!alreadyPresent) merged.push(seed);
      });
      localStorage.setItem('quizQuestions', JSON.stringify(merged));
    }
    if (!localStorage.getItem('quizScores')) localStorage.setItem('quizScores', JSON.stringify([]));
    if (!localStorage.getItem('quizSettings')) localStorage.setItem('quizSettings', JSON.stringify({ questionsPerQuiz: 5, pointsPerAnswer: 20 }));
  }
  getQuestions(topic = 'all') {
    const questions = JSON.parse(localStorage.getItem('quizQuestions') || '[]');
    return topic === 'all' ? questions : questions.filter(q => q.topic === topic);
  }
  addQuestion(q) {
    const questions = this.getQuestions();
    const newId = Math.max(...questions.map(x => x.id), 0) + 1;
    const newQ = { ...q, id: newId };
    questions.push(newQ);
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
    return newQ;
  }
  getScores(topic = 'all', limit = 10) {
    let scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    if (topic !== 'all') scores = scores.filter(s => s.topic === topic);
    return scores.sort((a,b) => b.score - a.score).slice(0, limit);
  }
  addScore(s) {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const newScore = { ...s, id: Date.now(), timestamp: new Date().toISOString() };
    scores.push(newScore);
    localStorage.setItem('quizScores', JSON.stringify(scores));
    return newScore;
  }
  clearScores() { localStorage.setItem('quizScores', JSON.stringify([])); }
  getSettings() { return JSON.parse(localStorage.getItem('quizSettings') || '{}'); }
  updateSettings(s) { localStorage.setItem('quizSettings', JSON.stringify({ ...this.getSettings(), ...s })); }
  getStats() {
    const questions = this.getQuestions();
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const settings = this.getSettings();
    const topicStats = {};
    questions.forEach(q => topicStats[q.topic] = (topicStats[q.topic] || 0) + 1);
    const averageScore = scores.length ? Math.round(scores.reduce((a,s)=>a+s.score,0) / scores.length) : 0;
    return { totalQuestions: questions.length, totalScores: scores.length, averageScore, topicStats, settings };
  }
  exportData() { return { questions: this.getQuestions(), scores: JSON.parse(localStorage.getItem('quizScores')||'[]'), settings: this.getSettings(), exportDate: new Date().toISOString() }; }
}

// Initialize Managers
const auth = new AuthManager();
const storage = new LocalStorageManager();

// Quiz State
let quizData = [];
let currentQuestion = 0;
let score = 0;
let username = "";
let selectedTopic = "";
let totalQuestions = 0;
let settings = storage.getSettings();

// Utility Functions
function showError(message) {
  const authContainer = document.getElementById('auth');
  const appContainer = document.getElementById('app');
  const container = authContainer && !authContainer.classList.contains('hidden') ? authContainer : appContainer;
  
  if (!container) return;
  
  const existingError = container.querySelector('.error');
  if (existingError) existingError.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  container.insertBefore(errorDiv, container.firstChild);
  setTimeout(() => {
    if (errorDiv.parentNode) errorDiv.remove();
  }, 4000);
}

function showMessage(message, type = 'error') {
  const authContainer = document.getElementById('auth');
  const appContainer = document.getElementById('app');
  const container = authContainer && !authContainer.classList.contains('hidden') ? authContainer : appContainer;
  
  if (!container) return;
  
  const existingMessage = container.querySelector('.message');
  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  container.insertBefore(messageDiv, container.firstChild);
  
  setTimeout(() => {
    if (messageDiv.parentNode) messageDiv.remove();
  }, 5000);
}

// Authentication Functions
function switchAuthTab(tabName) {
  try {
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeForm = document.getElementById(`${tabName}Form`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activeForm) activeForm.classList.add('active');
  } catch (error) {
    console.error('Error switching auth tab:', error);
  }
}

function showAuthPage() {
  document.getElementById('auth').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showAppPage() {
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  
  if (auth.currentUser) {
    document.getElementById('currentUserName').textContent = auth.currentUser.name;
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    auth.logout();
    showAuthPage();
    showScreen('home');
  }
}

// Quiz Functions
function startQuiz() {
  username = document.getElementById('username').value.trim();
  selectedTopic = document.getElementById('topic').value;
  if (!username) return showError('Please enter your name!');
  const questions = storage.getQuestions(selectedTopic);
  if (!questions.length) return showError('No questions available for this topic!');
  totalQuestions = Math.min(questions.length, settings.questionsPerQuiz || 5);
  quizData = [...questions].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
  currentQuestion = 0; score = 0;
  showScreen('quiz');
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= quizData.length) return endQuiz();
  const q = quizData[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt, q.answer);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('result').innerHTML = '';
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
  document.getElementById('progress-text').textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function selectAnswer(selected, correct) {
  const options = document.querySelectorAll('.option-btn');
  const resultDiv = document.getElementById('result');
  options.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === selected && selected !== correct) btn.classList.add('incorrect');
  });
  const points = settings.pointsPerAnswer || 20;
  if (selected === correct) { 
    score += points; 
    resultDiv.innerHTML = `<div class="result correct">✅ Correct! +${points} points</div>`; 
  }
  else { 
    resultDiv.innerHTML = `<div class="result incorrect">❌ Wrong! The correct answer was: ${correct}</div>`; 
  }
  setTimeout(() => { currentQuestion++; loadQuestion(); }, 1500);
}

function endQuiz() {
  storage.addScore({ username, score, topic: selectedTopic });
  showScreen('results');
  document.getElementById('final-score').textContent = score;
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('percentage').textContent = Math.round((score / (totalQuestions * (settings.pointsPerAnswer || 20))) * 100) + '%';
}

function showLeaderboard() {
  const scores = storage.getScores(selectedTopic, 10);
  showScreen('leaderboard');
  const scoresDiv = document.getElementById('scores');
  scoresDiv.innerHTML = '';
  if (!scores.length) return scoresDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No scores yet. Be the first to take the quiz!</p>';
  scores.forEach(s => {
    const el = document.createElement('div');
    el.className = 'score-item';
    const ts = new Date(s.timestamp);
    const isValid = !isNaN(ts.getTime());
    const timeStr = isValid ? ts.toLocaleString() : '';
    el.innerHTML = `<span class="score-username">${s.username}${timeStr ? ` • ${timeStr}` : ''}</span><span class="score-value">${s.score} pts</span>`;
    scoresDiv.appendChild(el);
  });
}

function clearLeaderboard() { 
  if (confirm('Clear all scores?')) { 
    storage.clearScores(); 
    showLeaderboard(); 
  } 
}

function restartQuiz() { 
  showScreen('home'); 
  document.getElementById('username').value = username; 
  document.getElementById('topic').value = selectedTopic; 
}

function showScreen(id) { 
  ['home','quiz','results','leaderboard','admin'].forEach(x => {
    const el = document.getElementById(x);
    if (el) el.classList.add('hidden');
  }); 
  const targetEl = document.getElementById(id);
  if (targetEl) targetEl.classList.remove('hidden');
}

// Admin Functions
function showAdminPanel() { 
  showScreen('admin'); 
  refreshAdminData(); 
}

function showHome() { 
  showScreen('home'); 
}

function switchTab(name, eventElement) {
  try {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (eventElement) {
      eventElement.classList.add('active');
    } else {
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(t => {
        if (t.textContent.toLowerCase() === name) {
          t.classList.add('active');
        }
      });
    }
    
    const tabEl = document.getElementById(name + '-tab');
    if (tabEl) tabEl.classList.add('active');
    refreshAdminData();
  } catch (error) {
    console.error('Error switching tab:', error);
  }
}

function refreshAdminData() {
  const active = document.querySelector('.tab.active');
  if (!active) return;
  
  const activeText = active.textContent.toLowerCase();
  if (activeText === 'questions') {
    document.getElementById('questions-display').textContent = JSON.stringify(storage.getQuestions(), null, 2);
  } else if (activeText === 'scores') {
    const raw = storage.getScores('all', 50);
    const withoutTimestamps = raw.map(({ timestamp, ...rest }) => rest);
    document.getElementById('scores-display').textContent = JSON.stringify(withoutTimestamps, null, 2);
  }
  else if (activeText === 'statistics') {
    document.getElementById('stats-display').textContent = JSON.stringify(storage.getStats(), null, 2);
  }
}

function addQuestion() {
  const q = document.getElementById('new-question').value.trim();
  const a = document.getElementById('new-answer').value.trim();
  const t = document.getElementById('new-topic').value;
  const optsText = document.getElementById('new-options').value.trim();
  if (!q || !a || !optsText) return showError('Please fill in all fields!');
  const opts = optsText.split(',').map(s => s.trim()).filter(Boolean);
  if (opts.length < 2) return showError('Provide at least 2 options!');
  if (!opts.includes(a)) return showError('Correct answer must be one of the options!');
  storage.addQuestion({ question: q, answer: a, options: opts, topic: t });
  document.getElementById('new-question').value = '';
  document.getElementById('new-answer').value = '';
  document.getElementById('new-options').value = '';
  showMessage('Question added successfully!', 'success');
  refreshAdminData();
}

function clearAllScores() { 
  if (confirm('Clear all scores? This cannot be undone!')) { 
    storage.clearScores(); 
    refreshAdminData(); 
    showMessage('All scores cleared!', 'success'); 
  } 
}

function saveSettings() {
  const qpq = parseInt(document.getElementById('questions-per-quiz').value);
  const ppa = parseInt(document.getElementById('points-per-answer').value);
  if (qpq < 1 || qpq > 20) return showError('Questions per quiz must be between 1 and 20!');
  if (ppa < 1 || ppa > 100) return showError('Points per answer must be between 1 and 100!');
  storage.updateSettings({ questionsPerQuiz: qpq, pointsPerAnswer: ppa });
  settings = storage.getSettings();
  showMessage('Settings saved successfully!', 'success');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  console.log('Quiz app initializing...');
  
  // Authentication Event Listeners
  const tabBtns = document.querySelectorAll('.tab-btn');
  console.log('Found tab buttons:', tabBtns.length);
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Tab button clicked:', btn.dataset.tab);
      switchAuthTab(btn.dataset.tab);
    });
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Login form submitted');
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      if (!email || !password) {
        showMessage('Please fill in all fields.');
        return;
      }
      
      if (auth.login(email, password)) {
        showMessage('Login successful!', 'success');
        setTimeout(() => {
          showAppPage();
          loginForm.reset();
        }, 1000);
      } else {
        showMessage('Invalid email or password. Please try again.');
      }
    });
  } else {
    console.error('Login form not found!');
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Signup form submitted');
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields.');
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage('Passwords do not match.');
        return;
      }
      
      if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.');
        return;
      }
      
      if (auth.signup(name, email, password)) {
        showMessage('Account created successfully!', 'success');
        setTimeout(() => {
          showAppPage();
          signupForm.reset();
        }, 1000);
      } else {
        showMessage('Email already exists. Please login instead.');
      }
    });
  } else {
    console.error('Signup form not found!');
  }

  // Quiz Event Listeners
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.addEventListener('keypress', e => { 
      if (e.key === 'Enter') startQuiz(); 
    });
  }

  settings = storage.getSettings();
  const questionsPerQuiz = document.getElementById('questions-per-quiz');
  const pointsPerAnswer = document.getElementById('points-per-answer');
  if (questionsPerQuiz) questionsPerQuiz.value = settings.questionsPerQuiz || 5;
  if (pointsPerAnswer) pointsPerAnswer.value = settings.pointsPerAnswer || 20;

  // Check if user is logged in
  if (auth.currentUser) {
    console.log('User already logged in:', auth.currentUser.name);
    showAppPage();
  } else {
    console.log('No user logged in, showing auth page');
    showAuthPage();
  }
  
  console.log('Quiz app initialized');
});
