// --------------------------- AUTH & USER HANDLING ---------------------------
if (!localStorage.getItem("loggedInUser")) {
  window.location.href = "login.html";
} else {
  document.getElementById("user-name").innerText = localStorage.getItem("loggedInUser");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// --------------------------- AUDIO & PAD HANDLING ---------------------------
const audioElements = {};
const activePads = {};
const padFX = {};
const stockSounds = {
  Q: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  W: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  E: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  A: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  S: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  D: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  Z: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  X: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  C: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
};

function loadAudioPads() {
  for (let key in stockSounds) {
    audioElements[key] = new Audio(stockSounds[key]);
  }
}

function togglePadPlayback(key) {
  const audio = audioElements[key];
  if (!audio) return;

  if (activePads[key]) {
    audio.pause();
    audio.currentTime = 0;
    delete activePads[key];
  } else {
    applyPadFX(audio, key);
    audio.play();
    activePads[key] = true;
    audio.onended = () => delete activePads[key];
  }
}

function setPadFX(key, fxType, value) {
  if (!padFX[key]) padFX[key] = {};
  padFX[key][fxType] = value;
}

function applyPadFX(audio, key) {
  const fx = padFX[key];
  if (!fx) return;
  if (fx.volume !== undefined) audio.volume = fx.volume;
  if (fx.playbackRate !== undefined) audio.playbackRate = fx.playbackRate;
}

// --------------------------- FILE UPLOAD & SAMPLE ASSIGN ---------------------------
const sampleList = document.getElementById("sample-list");
document.getElementById("upload-sample").addEventListener("change", function (event) {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const audio = new Audio(e.target.result);
      const li = document.createElement("li");
      li.textContent = file.name;
      li.onclick = () => assignSampleToPad(audio);
      sampleList.appendChild(li);
    };
    reader.readAsDataURL(file);
  }
});

function assignSampleToPad(audio) {
  console.log("Assigned sample to pad:", audio);
  // Extend: UI to select pad, or auto-assign logic
}

// --------------------------- TRACK FX UI ---------------------------
const trackNames = ['Kick', 'Snare', 'Hi-Hat', 'Bass', 'Synth'];

function loadTrackFXControls() {
  const container = document.getElementById("track-fx-container");
  container.innerHTML = "";

  trackNames.forEach((track, i) => {
    container.innerHTML += `
      <div class="track-fx">
        <h4>🎚️ Track: ${track}</h4>
        <label>Volume: 
          <input type="range" min="0" max="1" step="0.01" value="0.8"
          onchange="updateTrackFX(${i}, 'volume', this.value)" />
        </label>
        <label>Pan: 
          <input type="range" min="-1" max="1" step="0.01" value="0"
          onchange="updateTrackFX(${i}, 'pan', this.value)" />
        </label>
        <label>Delay: 
          <input type="range" min="0" max="1" step="0.01" value="0.3"
          onchange="updateTrackFX(${i}, 'delay', this.value)" />
        </label>
      </div>`;
  });
}

function updateTrackFX(index, effect, value) {
  console.log(`Track ${index} ${effect} set to ${value}`);
}

function savePreset() {
  alert("Preset saved!");
}
function loadPreset() {
  alert("Preset loaded!");
}

// --------------------------- SEQUENCER ---------------------------
const trackKeys = Object.keys(stockSounds);
let tracks = [], currentStep = 0, sequencerInterval;
let tempo = 120;

function addTrack() {
  if (tracks.length >= trackKeys.length) return alert("No more keys to assign!");

  const key = trackKeys[tracks.length];
  const stepToggles = [];

  const trackDiv = document.createElement("div");
  trackDiv.className = "track";
  trackDiv.innerHTML = `<label>${key}</label><div class="step-row"></div>`;
  const row = trackDiv.querySelector(".step-row");

  for (let i = 0; i < 16; i++) {
    const step = document.createElement("div");
    step.className = "step";
    step.onclick = () => step.classList.toggle("active");
    row.appendChild(step);
    stepToggles.push(step);
  }

  document.getElementById("sequencer-tracks").appendChild(trackDiv);
  tracks.push({ key, steps: stepToggles });
}

function startSequencer() {
  stopSequencer();
  const interval = (60 / tempo) * 1000 / 2;
  sequencerInterval = setInterval(() => {
    tracks.forEach(({ key, steps }) => {
      steps.forEach((step, i) => {
        step.classList.toggle("playing", i === currentStep);
      });
      if (steps[currentStep].classList.contains("active")) {
        togglePadPlayback(key);
      }
    });
    currentStep = (currentStep + 1) % 16;
  }, interval);
}

function stopSequencer() {
  clearInterval(sequencerInterval);
  currentStep = 0;
  document.querySelectorAll(".step").forEach(step => step.classList.remove("playing"));
}

function adjustTempo(change) {
  tempo = Math.min(300, Math.max(30, tempo + change));
  document.getElementById("tempo-display").innerText = `BPM: ${tempo}`;
  if (sequencerInterval) startSequencer(); // Restart with new tempo
}

// --------------------------- UI CONTROLS ---------------------------
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const index = ['sequencer', 'pads', 'fx', 'library', 'challenges', 'settings'].indexOf(tabId);
  document.querySelectorAll('.tab-btn')[index]?.classList.add('active');
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

function highlightPad(key) {
  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  pad?.classList.add("active");
  setTimeout(() => pad?.classList.remove("active"), 200);
}

function showDisplay(message) {
  const display = document.getElementById("display-text");
  if (display) display.textContent = message;
}

function saveProject() {
  alert("Project saved!");
}
function loadProject() {
  alert("Project loaded!");
}

// --------------------------- INIT ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAudioPads();
  setupPadListeners();
  loadTrackFXControls();
  showTab("pads");
});

function setupPadListeners() {
  document.querySelectorAll(".drum-pad").forEach(pad => {
    const key = pad.dataset.key;
    pad.onclick = () => {
      togglePadPlayback(key);
      highlightPad(key);
      showDisplay(`Playing: ${key}`);
    };
  });
}

// Keyboard triggers
document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();
  if (stockSounds[key]) {
    togglePadPlayback(key);
    highlightPad(key);
    showDisplay(`Playing: ${key}`);
  }
});
