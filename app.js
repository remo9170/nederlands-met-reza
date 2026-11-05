const $ = (id) => document.getElementById(id);
const number = new Intl.NumberFormat('fa-IR');
const storageKey = 'nederlands-met-reza-v1';
const questionsPerLesson = 5;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;
const navButtons = document.querySelectorAll('.nav button');
const pages = ['practice', 'completion', 'lesson-list', 'stats'];

function localDate(now = new Date()) {
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

function readProgress(fallback = null) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved.started) && saved.lessons && Array.isArray(saved.days)) {
      return saved;
    }
  } catch {
    // Practice can still run if browser storage is disabled.
  }
  return fallback ?? { started: localDate(), lessons: {}, days: [] };
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // The current session retains its in-memory progress.
  }
}

function todayIndex() {
  const days = Math.floor((Date.parse(localDate()) - Date.parse(progress.started)) / 86400000);
  return Math.min(lessons.length - 1, Math.max(0, days));
}

function completedCount(index) {
  const count = progress.lessons[index];
  return Number.isInteger(count) ? Math.max(0, Math.min(questionsPerLesson, count)) : 0;
}

let progress = readProgress();
let currentDay = localDate();
let lessonIndex = todayIndex();
let questionIndex = completedCount(lessonIndex);
let activePage = 'today';
let reviewMode = false;
let recognition = null;
let utterance = null;
let pendingInstall = null;
let clip = null;
let playbackId = 0;
let coachAudio = false;
saveProgress();

function activatePage(section) {
  for (const id of pages) $(id).hidden = id !== section;
  for (const button of navButtons) {
    if (button.dataset.page === activePage) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
}

function stopSpeech() {
  playbackId += 1;
  if (clip) {
    clip.pause();
    clip = null;
  }
  utterance = null;
  synth?.cancel();
}

function resetAnswer() {
  $('answer-actions').hidden = false;
  $('answer-form').hidden = true;
  $('feedback').hidden = true;
  $('status').textContent = '';
  $('answer').value = '';
}

function lessonHeading() {
  if (reviewMode) return 'مرور درس';
  return lessonIndex === todayIndex() ? 'درس امروز' : 'تمرین درس';
}

function showQuestion(focus = false) {
  stopSpeech();
  stopListening();
  if (questionIndex >= questionsPerLesson) {
    showCompletion(focus);
    return;
  }
  const lesson = lessons[lessonIndex];
  const [question, translation] = lesson.questions[questionIndex];
  resetAnswer();
  activatePage('practice');
  $('lesson-title').textContent = lesson.title;
  $('scene-label').textContent = lessonHeading();
  $('day-label').textContent = lessonHeading();
  $('scene-icon').setAttribute('href', '#i-' + lesson.icon);
  $('progress-label').textContent = 'سؤال ' + number.format(questionIndex + 1) + ' از ' + number.format(questionsPerLesson);
  $('segments').replaceChildren(...lesson.questions.map((_, index) => {
    const segment = document.createElement('span');
    segment.classList.toggle('filled', index < questionIndex);
    return segment;
  }));
  $('question').textContent = question;
  $('translation-text').textContent = translation;
  $('translation').open = false;
  if (focus) $('question').focus();
}

function showCompletion(focus) {
  activatePage('completion');
  const lesson = lessons[lessonIndex];
  $('completion-text').textContent = lessonIndex === lessons.length - 1 && !reviewMode
    ? 'پنج سؤال «' + lesson.title + '» را تمرین کردی. همهٔ درس‌های این دوره حالا برای مرور در دسترس‌اند.'
    : 'هر پنج سؤال «' + lesson.title + '» را تمرین کردی.' + (lessonIndex === todayIndex() && !reviewMode ? ' درس تازه فردا باز می‌شود.' : '');
  if (focus) $('completion-title').focus();
}

function updateDay() {
  const date = localDate();
  if (date !== currentDay) {
    currentDay = date;
    return true;
  }
  return false;
}

function navigate(page, focus = true) {
  updateDay();
  stopSpeech();
  stopListening();
  activePage = page;
  if (page === 'today') {
    beginLesson(todayIndex(), 'today', false, focus);
    return;
  }
  if (page === 'lessons') renderLessons();
  else renderStats();
  const section = page === 'lessons' ? 'lesson-list' : 'stats';
  activatePage(section);
  if (focus) $(section).querySelector('h1').focus();
}

function beginLesson(index, page, review = false, focus = true) {
  lessonIndex = index;
  activePage = page;
  reviewMode = review;
  questionIndex = review ? 0 : completedCount(index);
  showQuestion(focus);
}

function renderLessons() {
  const unlocked = todayIndex();
  $('lessons').replaceChildren(...lessons.map((lesson, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const label = document.createElement('span');
    const dutch = document.createElement('small');
    const state = document.createElement('span');
    const count = completedCount(index);
    button.type = 'button';
    button.disabled = index > unlocked;
    label.className = 'lesson-info';
    label.textContent = number.format(index + 1) + ' · ' + lesson.title;
    dutch.dir = 'ltr';
    dutch.lang = 'nl';
    dutch.textContent = lesson.place;
    label.append(dutch);
    state.className = 'lesson-state';
    state.textContent = button.disabled ? 'روز ' + number.format(index + 1) : count === 5 ? 'کامل · مرور' : count ? number.format(count) + ' از ۵ · ادامه' : 'شروع';
    button.append(label, state);
    button.addEventListener('click', () => beginLesson(index, 'lessons', count === questionsPerLesson));
    item.append(button);
    return item;
  }));
}

function renderStats() {
  const counts = lessons.map((_, index) => completedCount(index));
  $('stat-lessons').textContent = number.format(counts.filter((count) => count === questionsPerLesson).length) + ' از ' + number.format(lessons.length);
  $('stat-questions').textContent = number.format(counts.reduce((sum, count) => sum + count, 0));
  $('stat-days').textContent = number.format(progress.days.length);
}

function normalize(input) {
  return input.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/['’]/gu, '').replace(/[^a-z0-9\s*]/gu, ' ').replace(/\s+/gu, ' ').trim();
}

function matches(answer, candidate) {
  const clean = normalize(candidate);
  if (!clean.includes('*')) return clean === answer;
  return new RegExp('^' + clean.replaceAll('*', '[a-z0-9]+(?: [a-z0-9]+)*') + '$').test(answer);
}

function submitAnswer(event) {
  event.preventDefault();
  const value = $('answer').value.trim();
  if (!value) {
    $('status').textContent = 'ابتدا یک پاسخ هلندی بنویس.';
    $('answer').focus();
    return;
  }
  stopSpeech();
  const [, , model, modelTranslation, alternatives = ''] = lessons[lessonIndex].questions[questionIndex];
  const clean = normalize(value).replaceAll('*', '');
  const accepted = [model, ...alternatives.split('|')].some((candidate) => candidate && matches(clean, candidate));
  $('status').textContent = '';
  $('answer-form').hidden = true;
  $('answer-actions').hidden = true;
  $('feedback-title').textContent = accepted ? 'آفرین، پاسخ پذیرفته شد!' : 'یک جواب نمونه را ببین';
  $('feedback-description').textContent = accepted
    ? 'این هم یک شکل طبیعی برای جواب دادن.'
    : 'این پاسخ در الگوهای این تمرین پیدا نشد. نمونه را گوش کن یا دوباره جواب بده.';
  $('model-answer').textContent = model;
  $('model-translation').textContent = modelTranslation;
  $('next-label').textContent = questionIndex === questionsPerLesson - 1 ? 'پایان درس' : 'سؤال بعدی';
  $('feedback').hidden = false;
  $('next').focus();
}

function nextQuestion() {
  if ($('feedback').hidden) return;
  questionIndex += 1;
  if (!reviewMode) {
    progress = readProgress(progress);
    progress.lessons[lessonIndex] = Math.max(completedCount(lessonIndex), questionIndex);
    const date = localDate();
    if (!progress.days.includes(date)) progress.days.push(date);
    saveProgress();
  }
  showQuestion(true);
  if (coachAudio && questionIndex < questionsPerLesson) playQuestion(1);
}

function openAnswer(text = '', fromMic = false) {
  $('answer-form').hidden = false;
  $('answer-label').textContent = fromMic ? 'این چیزی است که شنیدم. می‌توانی ویرایشش کنی.' : 'پاسخت را به هلندی بنویس';
  if (fromMic || text) $('answer').value = text;
  $('answer').focus();
}

function setListening(active) {
  $('mic').setAttribute('aria-pressed', String(active));
  $('mic-icon').setAttribute('href', active ? '#i-stop' : '#i-mic');
  $('mic-label').textContent = active ? 'پایان صحبت' : 'پاسخ صوتی';
}

function stopListening() {
  if (!recognition) return;
  const active = recognition;
  recognition = null;
  setListening(false);
  try { active.abort(); } catch { /* Recognition may have already stopped. */ }
}

function startListening() {
  if (recognition) {
    try { recognition.stop(); } catch { stopListening(); }
    return;
  }
  if (!SpeechRecognition || !window.isSecureContext) {
    $('status').textContent = 'میکروفون در این مرورگر یا صفحه در دسترس نیست. می‌توانی تایپ کنی.';
    openAnswer();
    return;
  }
  stopSpeech();
  let active;
  try {
    active = new SpeechRecognition();
    active.lang = 'nl-NL';
    active.interimResults = false;
    active.maxAlternatives = 1;
    recognition = active;
    let reportedError = false;
    let heardAnswer = false;
    active.onresult = (event) => {
      if (recognition !== active) return;
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      if (transcript) {
        heardAnswer = true;
        $('status').textContent = '';
        openAnswer(transcript, true);
      }
    };
    active.onerror = (event) => {
      if (recognition !== active) return;
      reportedError = true;
      $('status').textContent = ['not-allowed', 'service-not-allowed'].includes(event.error)
        ? 'مرورگر اجازهٔ استفاده از میکروفون را نداد. می‌توانی تایپ کنی.'
        : 'تشخیص صدا انجام نشد. دوباره امتحان کن یا جواب را تایپ کن.';
      openAnswer();
    };
    active.onend = () => {
      if (recognition !== active) return;
      recognition = null;
      setListening(false);
      if (!heardAnswer && !reportedError) $('status').textContent = 'پاسخی شنیده نشد. دوباره صحبت کن یا تایپ کن.';
    };
    active.start();
    setListening(true);
    $('status').textContent = 'به هلندی صحبت کن. ممکن است مرورگر صدا را برای تشخیص به سرویس خودش بفرستد.';
  } catch {
    recognition = null;
    setListening(false);
    $('status').textContent = 'میکروفون آماده نیست. می‌توانی جواب را تایپ کنی.';
    openAnswer();
  }
}

function speak(text, rate = 1, asset = '') {
  stopListening();
  stopSpeech();
  $('status').textContent = '';
  const id = playbackId;
  if (asset) {
    clip = new Audio(asset);
    clip.playbackRate = rate;
    clip.play().catch(() => {
      if (id === playbackId) speak(text, rate);
    });
    return;
  }
  if (!synth || !('SpeechSynthesisUtterance' in window)) {
    $('status').textContent = 'پخش صدای هلندی در این مرورگر در دسترس نیست.';
    return;
  }
  const voices = synth.getVoices();
  const voice = voices.find((item) => item.lang.toLowerCase().replace('_', '-') === 'nl-nl')
    ?? voices.find((item) => item.lang.toLowerCase().startsWith('nl'));
  if (voices.length && !voice) {
    $('status').textContent = 'صدای هلندی روی دستگاه پیدا نشد. زبان Dutch (Netherlands) را در تنظیمات صدا فعال کن.';
    return;
  }
  const next = new SpeechSynthesisUtterance(text);
  next.lang = 'nl-NL';
  if (voice) next.voice = voice;
  next.rate = rate;
  next.onerror = (event) => {
    if (utterance === next && !['canceled', 'interrupted'].includes(event.error)) {
      $('status').textContent = 'پخش صدا انجام نشد. صدای هلندی دستگاه را بررسی کن.';
    }
  };
  utterance = next;
  synth.speak(next);
}

function playQuestion(rate) {
  coachAudio = true;
  const question = lessons[lessonIndex].questions[questionIndex];
  speak(question[0], rate, audioPath('q'));
}

function audioPath(kind) {
  return './assets/audio/' + (lessonIndex + 1) + '-' + (questionIndex + 1) + '-' + kind + '.mp3';
}

for (const button of navButtons) button.addEventListener('click', () => navigate(button.dataset.page));
$('view-progress').addEventListener('click', () => navigate('stats'));
$('back-today').addEventListener('click', () => navigate('today'));
$('review').addEventListener('click', () => beginLesson(lessonIndex, activePage, true));
$('play').addEventListener('click', () => playQuestion(1));
$('slow').addEventListener('click', () => playQuestion(0.75));
$('play-model').addEventListener('click', () => speak(lessons[lessonIndex].questions[questionIndex][2], 1, audioPath('a')));
$('mic').addEventListener('click', startListening);
$('typing').addEventListener('click', () => { stopListening(); $('status').textContent = ''; openAnswer(); });
$('answer-form').addEventListener('submit', submitAnswer);
$('next').addEventListener('click', nextQuestion);
$('retry').addEventListener('click', () => { stopSpeech(); resetAnswer(); openAnswer(); });

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  pendingInstall = event;
});
window.addEventListener('appinstalled', () => { pendingInstall = null; $('install').hidden = true; });
$('install').hidden = window.matchMedia('(display-mode: standalone)').matches || Boolean(navigator.standalone);
$('install').addEventListener('click', async () => {
  const prompt = pendingInstall;
  pendingInstall = null;
  if (prompt) {
    try { await prompt.prompt(); return; } catch { /* Show manual instructions. */ }
  }
  $('install-note').textContent = location.protocol === 'file:' ? 'برای نصب، نسخهٔ آنلاین برنامه را باز کن.' : '';
  $('install-dialog').showModal();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && updateDay() && activePage === 'today' && !reviewMode) navigate('today', false);
});
window.addEventListener('storage', (event) => {
  if (event.key !== storageKey) return;
  progress = readProgress();
  if (activePage === 'stats') renderStats();
  if (!$('lesson-list').hidden) renderLessons();
});
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
navigate('today', false);
