const topics = [
  { id: 'cloud', name: 'Describe cloud concepts', short: 'Cloud concepts', weight: '25–30%', icon: '☁', tone: '#eaf3ed', description: 'Cloud models, benefits & service types' },
  { id: 'architecture', name: 'Describe Azure architecture and services', short: 'Architecture & services', weight: '35–40%', icon: '⌘', tone: '#eeedf7', description: 'Regions, resources, compute & storage' },
  { id: 'management', name: 'Describe Azure management and governance', short: 'Management & governance', weight: '30–35%', icon: '▦', tone: '#f9f0e8', description: 'Cost, tools, identity & governance' }
];

const fallbackQuestions = [
  { topic: 'cloud', question: 'A small company wants to avoid buying servers before it knows how much computing capacity it will need. Which cloud benefit best addresses this?', answers: ['High availability', 'Consumption-based pricing', 'Disaster recovery', 'Resource tagging'], correct: 1, explanation: 'With consumption-based pricing, a company pays for the resources it uses. It can start small and adjust capacity as demand becomes clearer.' },
  { topic: 'cloud', question: 'A team needs to run its own operating system and install custom software, while the cloud provider manages the physical hardware. Which service model fits best?', answers: ['Software as a Service (SaaS)', 'Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'Function as a Service'], correct: 2, explanation: 'IaaS provides virtualized infrastructure such as virtual machines. The customer manages the operating system and applications, while the provider manages the physical datacenter infrastructure.' },
  { topic: 'cloud', question: 'An organization uses a public cloud but keeps a sensitive database in its own datacenter. What type of cloud model is this?', answers: ['Private cloud', 'Hybrid cloud', 'Community cloud', 'Public cloud only'], correct: 1, explanation: 'A hybrid cloud combines public cloud services with private infrastructure, allowing an organization to use both environments.' },
  { topic: 'cloud', question: 'A video-streaming service gets sudden traffic spikes during major events. Which cloud benefit lets it increase resources to meet demand and reduce them later?', answers: ['Governance', 'Elasticity', 'Fault tolerance', 'Capital expenditure'], correct: 1, explanation: 'Elasticity is the ability to scale resources up or down as demand changes. This helps a service handle busy periods without keeping peak capacity running all the time.' },
  { topic: 'cloud', question: 'A startup wants to use a complete email application over the internet without managing its servers or installing the software. Which cloud service type is this?', answers: ['IaaS', 'PaaS', 'SaaS', 'Private cloud'], correct: 2, explanation: 'Software as a Service (SaaS) provides a ready-to-use application over the internet. The provider manages the application and underlying infrastructure.' },
  { topic: 'architecture', question: 'A company wants its application to remain available if one Azure datacenter in a region becomes unavailable. Which design choice helps?', answers: ['Use availability zones', 'Create more resource groups', 'Use a management group', 'Apply a resource lock'], correct: 0, explanation: 'Availability zones are physically separate locations within an Azure region, each with independent power, cooling, and networking.' },
  { topic: 'architecture', question: 'Which Azure resource provides scalable object storage for files such as images, backups, and documents?', answers: ['Azure Virtual Network', 'Azure Blob Storage', 'Azure Functions', 'Azure DNS'], correct: 1, explanation: 'Azure Blob Storage is designed to store large amounts of unstructured object data, such as images, documents, and backups.' },
  { topic: 'architecture', question: 'A developer wants to run a small piece of code when a file is uploaded, without managing a server. Which service is a good fit?', answers: ['Azure Virtual Machines', 'Azure Functions', 'Azure ExpressRoute', 'Azure Resource Manager'], correct: 1, explanation: 'Azure Functions is a serverless compute service that can run code in response to events, such as a file being uploaded.' },
  { topic: 'architecture', question: 'A business wants to organize several Azure subscriptions so that access rules can be applied consistently across them. Which structure should it use?', answers: ['Availability zones', 'Management groups', 'Virtual networks', 'Storage accounts'], correct: 1, explanation: 'Management groups let an organization organize subscriptions into a hierarchy. Policies and access controls can be applied at a management group and inherited by subscriptions beneath it.' },
  { topic: 'management', question: 'An administrator wants to estimate the monthly cost of Azure resources before deploying them. Which tool should they use?', answers: ['Azure Service Health', 'Azure Pricing calculator', 'Azure Monitor', 'Microsoft Defender for Cloud'], correct: 1, explanation: 'The Azure Pricing calculator helps estimate costs for Azure products and services before deployment, based on planned usage.' },
  { topic: 'management', question: 'A team needs to prevent a critical resource from being accidentally deleted. What can an administrator apply?', answers: ['A resource lock', 'A service-level agreement', 'A region pair', 'A network security group'], correct: 0, explanation: 'Resource locks can prevent resources from being deleted or modified, even when a user has the necessary permissions.' },
  { topic: 'management', question: 'Which Azure service provides recommendations to improve reliability, security, performance, and cost?', answers: ['Azure Advisor', 'Azure Policy', 'Azure Arc', 'Azure Marketplace'], correct: 0, explanation: 'Azure Advisor analyzes deployed resources and provides personalized recommendations across cost, security, reliability, operational excellence, and performance.' },
  { topic: 'management', question: 'A user should verify their identity with a password and a phone prompt before signing in. Which security practice is being used?', answers: ['Single sign-on', 'Multifactor authentication', 'Role-based access control', 'Conditional formatting'], correct: 1, explanation: 'Multifactor authentication (MFA) requires more than one verification method, adding a layer of protection beyond a password.' },
  { topic: 'management', question: 'An organization wants to grant employees only the permissions needed for their jobs. Which principle should guide access?', answers: ['Shared responsibility', 'Least privilege', 'High availability', 'Elasticity'], correct: 1, explanation: 'The principle of least privilege means users receive only the access they need to do their work, which limits the impact of compromised accounts.' },
  { topic: 'management', question: 'Which Azure service helps protect cloud workloads by assessing security posture and detecting threats?', answers: ['Microsoft Defender for Cloud', 'Azure Cost Management', 'Azure Advisor', 'Azure Policy'], correct: 0, explanation: 'Microsoft Defender for Cloud helps improve security posture and provides threat protection for resources across cloud environments.' },
  { topic: 'management', question: 'A company wants to require all new resources to include a cost-center tag. Which Azure capability can enforce this rule?', answers: ['Azure Policy', 'Azure Service Health', 'Azure Functions', 'Azure Monitor'], correct: 0, explanation: 'Azure Policy helps create, assign, and manage rules that enforce organizational standards, such as requiring tags on resources.' }
];

let questions = fallbackQuestions.map((question, index) => ({ ...question, id: `local-${index + 1}` }));

const STORAGE_KEY = 'cloudwise-az900-progress-v1';
let progress = loadProgress();
let supabaseClient = null;
let currentUser = null;
let authMode = 'signin';
let currentSet = [];
let questionIndex = 0;
let selectedAnswer = null;
let answered = false;
let sessionCorrect = 0;
let quizMode = 'mixed';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
function topicStats(id) { return progress[id] || { correct: 0, total: 0 }; }
function accuracy(stat) { return stat.total ? Math.round(stat.correct / stat.total * 100) : null; }

function setAccountStatus(message, isError = false) {
  const status = document.querySelector('#account-status');
  status.textContent = message;
  status.classList.toggle('status-error', isError);
}

function updateAuthButton() {
  const button = document.querySelector('#auth-button');
  button.textContent = currentUser ? 'Sign out' : 'Sign in';
  button.setAttribute('aria-label', currentUser ? `Sign out ${currentUser.email}` : 'Sign in to sync progress');
  setAccountStatus(currentUser ? `Synced to ${currentUser.email}` : 'Your progress is saved on this device');
}

function mapQuestion(row) {
  return {
    id: row.id,
    topic: row.domain,
    question: row.prompt,
    answers: row.options,
    correct: row.correct_index,
    explanation: row.explanation,
    objective: row.objective,
    sourceUrl: row.source_url
  };
}

async function loadQuestionsFromSupabase() {
  const { data, error } = await supabaseClient
    .from('questions')
    .select('id, domain, prompt, options, correct_index, explanation')
    .eq('is_published', true);
  if (error) throw error;
  if (!data?.length) throw new Error('The published question bank is empty. Run supabase/seed.sql first.');
  questions = data.map(mapQuestion);
  renderQuizPicker();
}

async function loadAccountProgress() {
  if (!supabaseClient || !currentUser) return false;
  const { data, error } = await supabaseClient
    .from('attempts')
    .select('question_id, is_correct, attempted_at, questions!inner(domain)')
    .eq('user_id', currentUser.id)
    .order('attempted_at', { ascending: true });
  if (error) {
    setAccountStatus('Could not sync progress. Check your connection.', true);
    return false;
  }
  const accountProgress = { missed: [] };
  const latestAnswers = new Map();
  for (const attempt of data) {
    const domain = attempt.questions.domain;
    const stat = accountProgress[domain] || { correct: 0, total: 0 };
    accountProgress[domain] = {
      correct: stat.correct + Number(attempt.is_correct),
      total: stat.total + 1
    };
    latestAnswers.set(attempt.question_id, attempt.is_correct);
  }
  accountProgress.missed = [...latestAnswers]
    .filter(([, isCorrect]) => !isCorrect)
    .map(([questionId]) => questionId);
  progress = accountProgress;
  updateAuthButton();
  renderTopics();
  if (!document.querySelector('#progress-view').classList.contains('hidden')) renderReadiness();
  return true;
}

async function applySession(session) {
  currentUser = session?.user || null;
  updateAuthButton();
  if (currentUser) {
    await loadAccountProgress();
  } else {
    progress = loadProgress();
    renderTopics();
    if (!document.querySelector('#progress-view').classList.contains('hidden')) renderReadiness();
  }
}

async function initializeSupabase() {
  const config = window.CLOUDWISE_SUPABASE;
  if (!window.supabase?.createClient || !config?.url || !config?.publishableKey) return;
  supabaseClient = window.supabase.createClient(config.url, config.publishableKey);
  try {
    await loadQuestionsFromSupabase();
    setAccountStatus('Connected to the shared question bank');
  } catch (error) {
    setAccountStatus(`Question bank unavailable: ${error.message}`, true);
    supabaseClient = null;
    return;
  }
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) setAccountStatus('Could not restore your sign-in. Try signing in again.', true);
  await applySession(data?.session || null);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    queueMicrotask(() => applySession(session));
  });
  renderTopics();
}

function renderTopics() {
  const grid = document.querySelector('#topic-grid');
  grid.innerHTML = topics.map(topic => {
    const stat = topicStats(topic.id);
    const score = accuracy(stat);
    return `<button class="topic-card" data-topic="${topic.id}"><div class="topic-top"><span class="topic-icon" style="background:${topic.tone}">${topic.icon}</span><span class="topic-weight">${topic.weight}</span></div><h3>${topic.name}</h3><p>${stat.total ? `${score}% accuracy · ${stat.total} answered` : topic.description}</p><div class="topic-mini-track"><span style="width:${score || 0}%"></span></div></button>`;
  }).join('');
  grid.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => startQuiz(button.dataset.topic)));
  const total = topics.reduce((sum, topic) => sum + topicStats(topic.id).total, 0);
  const correct = topics.reduce((sum, topic) => sum + topicStats(topic.id).correct, 0);
  const explored = topics.filter(topic => topicStats(topic.id).total).length;
  document.querySelector('#stat-answered').textContent = total;
  document.querySelector('#stat-accuracy').textContent = total ? Math.round(correct / total * 100) : '—';
  document.querySelector('#accuracy-suffix').textContent = total ? '%' : '';
  document.querySelector('#stat-topics').textContent = explored;
  document.querySelector('#stat-topics').nextElementSibling.textContent = ' of 3';
}

function renderQuizPicker() {
  const grid = document.querySelector('#quiz-picker-grid');
  grid.innerHTML = topics.map(topic => {
    const count = questions.filter(question => question.topic === topic.id).length;
    return `<button class="quiz-picker-card" type="button" data-start-quiz="${topic.id}"><span class="picker-icon" style="background:${topic.tone}">${topic.icon}</span><span class="picker-card-copy"><b>${topic.name}</b><small>${count} practice questions · ${topic.weight} of exam</small></span><span class="picker-arrow">→</span></button>`;
  }).join('');
  grid.querySelectorAll('[data-start-quiz]').forEach(button => button.addEventListener('click', () => startQuiz(button.dataset.startQuiz)));
}

function renderReadiness() {
  const total = topics.reduce((sum, topic) => sum + topicStats(topic.id).total, 0);
  const correct = topics.reduce((sum, topic) => sum + topicStats(topic.id).correct, 0);
  const score = total ? Math.round(correct / total * 100) : null;
  document.querySelector('#progress-accuracy').textContent = score ?? '—';
  document.querySelector('#progress-accuracy-suffix').textContent = score === null ? '' : '%';
  document.querySelector('#ring-percent').textContent = score === null ? '—' : `${score}%`;
  document.querySelector('#ring-value').style.strokeDashoffset = score === null ? 308 : 308 - (308 * score / 100);
  document.querySelector('#readiness-message').textContent = score === null ? 'Answer a few questions to see your learning snapshot.' : total < 10 ? `${total} question${total === 1 ? '' : 's'} answered so far. Keep practicing to build a broader picture.` : 'A snapshot of your practice so far. Keep exploring all three exam domains.';
  const unpracticed = topics.filter(topic => topicStats(topic.id).total === 0);
  const candidates = unpracticed.length ? unpracticed : [...topics].sort((first, second) => {
    const difference = accuracy(topicStats(first.id)) - accuracy(topicStats(second.id));
    return difference || parseInt(second.weight) - parseInt(first.weight);
  });
  const focus = candidates[0];
  const focusStat = topicStats(focus.id);
  document.querySelector('#focus-title').textContent = focus.name;
  document.querySelector('#focus-description').textContent = focusStat.total
    ? `${accuracy(focusStat)}% accuracy across ${focusStat.total} answered. A few more questions can help clarify this signal.`
    : `Not practiced yet. This domain represents ${focus.weight} of the exam skills outline.`;
  document.querySelector('#focus-button').onclick = () => startQuiz(focus.id);
  const missed = Array.isArray(progress.missed) ? progress.missed : [];
  document.querySelector('#review-title').textContent = missed.length ? `${missed.length} question${missed.length === 1 ? '' : 's'} to revisit` : 'No questions to revisit';
  document.querySelector('#review-description').textContent = missed.length
    ? 'Take another look, learn from the explanation, and clear questions by answering them correctly.'
    : 'Questions you miss are saved here automatically for another try.';
  const reviewButton = document.querySelector('#review-button');
  reviewButton.disabled = missed.length === 0;
  reviewButton.onclick = () => startQuiz('review');
  const rows = document.querySelector('#readiness-topics');
  rows.innerHTML = topics.map(topic => {
    const stat = topicStats(topic.id);
    const value = accuracy(stat);
    return `<div class="readiness-topic"><div class="readiness-topic-name">${topic.name} <span class="domain-weight">${topic.weight} of exam</span></div><div class="readiness-topic-score ${value === null ? 'new' : ''}">${value === null ? 'Not started' : `${value}% accuracy`}</div><div class="readiness-topic-track"><span style="width:${value || 0}%"></span></div><div class="readiness-topic-meta">${stat.total} answered</div></div>`;
  }).join('');
}

function setView(view) {
  document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
  document.querySelector(`#${view}-view`).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  document.querySelector('#crumb').textContent = view === 'home' ? 'Overview' : view === 'quiz' ? 'Practice quiz' : 'My readiness';
  if (view === 'home') renderTopics();
  if (view === 'progress') renderReadiness();
  window.scrollTo(0, 0);
}

function startQuiz(topicId = 'mixed') {
  if (!document.querySelector('#question-count')) restoreQuizMain();
  quizMode = topicId;
  const missed = Array.isArray(progress.missed) ? progress.missed : [];
  const pool = topicId === 'review'
    ? questions.filter(question => missed.includes(question.id) || missed.includes(question.question))
    : topicId === 'mixed' ? [...questions] : questions.filter(question => question.topic === topicId);
  currentSet = pool.sort(() => Math.random() - .5).slice(0, topicId === 'review' ? pool.length : Math.min(5, pool.length));
  if (!currentSet.length) {
    renderReadiness();
    setView('progress');
    return;
  }
  questionIndex = 0;
  sessionCorrect = 0;
  document.querySelector('#quiz-picker').classList.add('hidden');
  document.querySelector('#quiz-layout').classList.remove('hidden');
  document.querySelector('#quiz-topic-label').textContent = topicId === 'review' ? 'Missed question review' : topicId === 'mixed' ? 'Mixed practice' : topics.find(topic => topic.id === topicId).short;
  document.querySelector('#round-topic').innerHTML = topics.map(topic => `<div><span>${topic.short}</span><b>${topicId === 'mixed' || currentSet.some(question => question.topic === topic.id) ? 'Included' : '—'}</b></div>`).join('');
  setView('quiz');
  renderQuestion();
}

function renderQuestion() {
  selectedAnswer = null;
  answered = false;
  const question = currentSet[questionIndex];
  const topic = topics.find(item => item.id === question.topic);
  document.querySelector('#question-count').textContent = `QUESTION ${questionIndex + 1} OF ${currentSet.length}`;
  document.querySelector('#question-percent').textContent = `${Math.round((questionIndex + 1) / currentSet.length * 100)}%`;
  document.querySelector('#quiz-progress-fill').style.width = `${(questionIndex + 1) / currentSet.length * 100}%`;
  document.querySelector('#question-category').textContent = topic.name.toUpperCase();
  document.querySelector('#question-text').textContent = question.question;
  document.querySelector('#feedback-source').classList.add('hidden');
  document.querySelector('#answers').innerHTML = question.answers.map((answer, index) => `<button class="answer-option" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span></button>`).join('');
  document.querySelectorAll('.answer-option').forEach(button => button.addEventListener('click', () => {
    if (answered) return;
    selectedAnswer = Number(button.dataset.answer);
    document.querySelectorAll('.answer-option').forEach(option => option.classList.toggle('selected', option === button));
    document.querySelector('#next-button').disabled = false;
  }));
  document.querySelector('#explanation').classList.add('hidden');
  const next = document.querySelector('#next-button');
  next.disabled = true;
  next.innerHTML = 'Check answer <span>→</span>';
}

async function checkAnswer() {
  if (selectedAnswer === null) return;
  const question = currentSet[questionIndex];
  let isCorrect = selectedAnswer === question.correct;
  if (supabaseClient && currentUser) {
    const { data, error } = await supabaseClient.rpc('record_attempt', {
      p_question_id: question.id,
      p_selected_index: selectedAnswer
    });
    if (error) {
      setAccountStatus('Could not save this answer. Check your connection and try again.', true);
      return;
    }
    isCorrect = data;
  }
  answered = true;
  if (isCorrect) sessionCorrect++;
  const stat = topicStats(question.topic);
  progress[question.topic] = { correct: stat.correct + Number(isCorrect), total: stat.total + 1 };
  if (!Array.isArray(progress.missed)) progress.missed = [];
  if (isCorrect) progress.missed = progress.missed.filter(missedQuestion => missedQuestion !== question.id && missedQuestion !== question.question);
  else if (!progress.missed.includes(question.id)) progress.missed.push(question.id);
  if (supabaseClient && currentUser) {
    await loadAccountProgress();
  } else {
    saveProgress();
  }
  document.querySelectorAll('.answer-option').forEach((button, index) => {
    button.disabled = true;
    button.classList.remove('selected');
    if (index === question.correct) button.classList.add('correct');
    if (index === selectedAnswer && !isCorrect) button.classList.add('incorrect');
  });
  const explanation = document.querySelector('#explanation');
  explanation.classList.remove('hidden', 'wrong');
  if (!isCorrect) explanation.classList.add('wrong');
  document.querySelector('#feedback-title').textContent = isCorrect ? 'That’s right — nice work!' : 'Good try. Here’s the key idea';
  document.querySelector('#feedback-text').textContent = question.explanation;
  const source = document.querySelector('#feedback-source');
  if (question.sourceUrl) {
    source.href = question.sourceUrl;
    source.classList.remove('hidden');
  } else {
    source.classList.add('hidden');
  }
  const next = document.querySelector('#next-button');
  next.disabled = false;
  next.innerHTML = questionIndex === currentSet.length - 1 ? 'See your results <span>→</span>' : 'Next question <span>→</span>';
}

function nextQuestion() {
  if (!answered) return checkAnswer();
  if (questionIndex < currentSet.length - 1) {
    questionIndex++;
    renderQuestion();
    return;
  }
  showResults();
}

function showResults() {
  const pct = Math.round(sessionCorrect / currentSet.length * 100);
  const main = document.querySelector('.quiz-main');
  const roundTitle = quizMode === 'review' ? 'Review round complete.' : 'You showed up.';
  const roundSubtitle = quizMode === 'review' ? 'That’s how learning sticks.' : 'That’s progress.';
  const remaining = Array.isArray(progress.missed) ? progress.missed.length : 0;
  const roundCopy = quizMode === 'review' ? `${remaining} question${remaining === 1 ? '' : 's'} remain in your review queue.` : 'Every question is another step toward understanding the cloud.';
  main.innerHTML = `<div class="result-card"><div class="result-spark">✦</div><div class="eyebrow result-eyebrow">ROUND COMPLETE</div><h2>${roundTitle}<br><span>${roundSubtitle}</span></h2><p class="result-copy">You answered ${sessionCorrect} of ${currentSet.length} correctly. ${roundCopy}</p><div class="result-score"><span>${pct}%</span><small>round accuracy</small></div><div class="result-actions"><button class="primary-button" id="result-again">Try another round <span>→</span></button><button class="result-secondary" id="result-progress">See my readiness</button></div><p class="result-disclaimer">Practice scores are learning signals, not exam predictions.</p></div>`;
  document.querySelector('#result-again').addEventListener('click', () => startQuiz('mixed'));
  document.querySelector('#result-progress').addEventListener('click', () => { restoreQuizMain(); setView('progress'); });
}

function restoreQuizMain() {
  const section = document.querySelector('#quiz-view');
  section.querySelector('.quiz-layout').innerHTML = `<div class="quiz-main"><div class="quiz-progress-line"><span id="question-count"></span><span id="question-percent"></span></div><div class="progress-track"><div id="quiz-progress-fill"></div></div><div class="question-card"><div class="question-kicker"><span class="question-spark">✦</span><span id="question-category"></span></div><h2 id="question-text"></h2><div class="answers" id="answers"></div><div class="explanation hidden" id="explanation"><div class="explanation-icon">✦</div><div><b id="feedback-title"></b><p id="feedback-text"></p><a id="feedback-source" class="learn-link hidden" target="_blank" rel="noreferrer">Review the official skills outline ↗</a></div></div><div class="quiz-actions"><span class="keyboard-hint">Choose the best answer</span><button class="primary-button" id="next-button" disabled>Check answer <span>→</span></button></div></div></div><aside class="quiz-aside"><div class="aside-illustration">✦</div><h3>Think it through</h3><p>Take your time. The explanation after each answer is where the learning sticks.</p><div class="aside-divider"></div><div class="aside-label">THIS ROUND</div><div class="round-topic" id="round-topic"></div></aside>`;
  document.querySelector('#next-button').addEventListener('click', nextQuestion);
}

function navigate(view) {
  if (view === 'quiz' && !currentSet.length) {
    renderQuizPicker();
    document.querySelector('#quiz-picker').classList.remove('hidden');
    document.querySelector('#quiz-layout').classList.add('hidden');
  }
  setView(view);
}

const authDialog = document.querySelector('#auth-dialog');
document.querySelector('#auth-button').addEventListener('click', async () => {
  if (currentUser && supabaseClient) {
    const { error } = await supabaseClient.auth.signOut();
    if (error) setAccountStatus('Could not sign out. Try again.', true);
    return;
  }
  document.querySelector('#auth-status').textContent = supabaseClient
    ? ''
    : 'Connect your Supabase project first. Follow the Supabase setup in README.md.';
  authDialog.showModal();
});
document.querySelector('#auth-close').addEventListener('click', () => authDialog.close());
authDialog.addEventListener('close', () => {
  document.querySelector('#auth-password').value = '';
  document.querySelector('#auth-status').textContent = '';
  authMode = 'signin';
  document.querySelector('#auth-panel-title').textContent = 'Pick up where you left off.';
  document.querySelector('#auth-submit').innerHTML = 'Sign in <span>→</span>';
  document.querySelector('#auth-mode-toggle').textContent = 'New here? Create an account';
  document.querySelector('#auth-password').autocomplete = 'current-password';
});
document.querySelector('#auth-mode-toggle').addEventListener('click', () => {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  document.querySelector('#auth-panel-title').textContent = authMode === 'signin' ? 'Pick up where you left off.' : 'Create your learner account.';
  document.querySelector('#auth-submit').innerHTML = `${authMode === 'signin' ? 'Sign in' : 'Create account'} <span>→</span>`;
  document.querySelector('#auth-mode-toggle').textContent = authMode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in';
  document.querySelector('#auth-password').autocomplete = authMode === 'signin' ? 'current-password' : 'new-password';
  document.querySelector('#auth-status').textContent = '';
});
document.querySelector('#auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#auth-status');
  const submit = document.querySelector('#auth-submit');
  if (!supabaseClient) {
    status.textContent = 'Connect your Supabase project first. Follow the Supabase setup in README.md.';
    return;
  }
  submit.disabled = true;
  status.textContent = authMode === 'signin' ? 'Signing in…' : 'Creating your account…';
  const email = document.querySelector('#auth-email').value.trim();
  const password = document.querySelector('#auth-password').value;
  const result = authMode === 'signin'
    ? await supabaseClient.auth.signInWithPassword({ email, password })
    : await supabaseClient.auth.signUp({ email, password });
  if (result.error) {
    status.textContent = result.error.message;
  } else if (authMode === 'signup' && !result.data.session) {
    status.textContent = 'Turn off Confirm email in Supabase Auth settings, then try creating your account again.';
  } else {
    status.textContent = authMode === 'signup' ? 'Account created. Your progress will sync to this account.' : 'Signed in. Loading your saved progress…';
    if (result.data.session) {
      await applySession(result.data.session);
      authDialog.close();
      authMode = 'signin';
      document.querySelector('#auth-submit').innerHTML = 'Sign in <span>→</span>';
      document.querySelector('#auth-mode-toggle').textContent = 'New here? Create an account';
    }
  }
  submit.disabled = false;
});
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.go)));
document.querySelectorAll('[data-start-quiz="mixed"]').forEach(button => button.addEventListener('click', () => startQuiz('mixed')));
document.querySelector('#next-button').addEventListener('click', nextQuestion);
renderTopics();
renderQuizPicker();
initializeSupabase();
