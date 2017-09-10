import WebFont from 'webfontloader';
import {Howl} from 'howler';
import timerHTML from '../html/timer.html';

window.simpleIntervalTimer = ( settings={} ) => {
  WebFont.load({
    google: { families: ['Roboto:300,700'] }
  });

  let sounds = new Howl({
  src: [require('../audio/sounds.mp3')],
  sprite: {
    countdownSound: [30, 142],
    doneSound: [209, 509]
  }
});

  // SETUP SETTINGS OR USE DEFAULTS
  const containerClass = settings.containerClass || "simple-interval-timer-container";
  let workSeconds = settings.workSeconds || 30;
  let restSeconds = settings.restSeconds || 15;
  let rewindSeconds = settings.rewindSeconds || 10;
  const editable = !(settings.editable === false);
  const playSounds = !(settings.playSounds === false);
  const showStopButton = !(settings.showStopButton === false);
  const prepareSeconds = Number.isInteger(settings.prepareSeconds) ? settings.prepareSeconds : 10;

  // SETUP & GET DOM NODES
  let parentEl = document.getElementsByClassName(containerClass)[0];
  parentEl.innerHTML = timerHTML;  // IMPORT TIMER HTML
  parentEl = parentEl.getElementsByClassName('simple-interval-timer')[0];
  const playEl = parentEl.getElementsByClassName('simple-interval-timer__play')[0];
  const workInputEl = parentEl.getElementsByClassName('workSeconds')[0];
  const restInputEl = parentEl.getElementsByClassName('restSeconds')[0];
  const stopEl = parentEl.getElementsByClassName('simple-interval-timer__stop')[0];
  const rewindEl = parentEl.getElementsByClassName('simple-interval-timer__rewind')[0];
  const statusEl = parentEl.getElementsByClassName('simple-interval-timer__status')[0];
  const timeEl = parentEl.getElementsByClassName('simple-interval-timer__timer')[0];
  const runningEl = parentEl.getElementsByClassName('simple-interval-timer--running')[0];

  // SET UP INPUTS
  workInputEl.value = workSeconds;
  restInputEl.value = restSeconds;
  if (!editable) {
    workInputEl.setAttribute('readonly',true);
    restInputEl.setAttribute('readonly',true);
  }

  // INITIALIZE STATE VARS
  let interval, timer, state = "stopped";
  let countdownSound, doneSound;

  // ADD CLICK LISTENERS
  playEl.addEventListener("click", ()=>{
    workSeconds = workInputEl.value;
    restSeconds = restInputEl.value;
    parentEl.classList.remove('stopped');
    if (prepareSeconds > 0) {
      state = "preparing";
      timer = prepareSeconds;
    } else {
      state = "working";
      timer = workSeconds;
    }
    parentEl.classList.add(state);
    statusEl.innerText = state.toUpperCase();
    timeEl.innerText = timer;
    interval = setInterval(handleInterval, 1000);
  })

  if (showStopButton) {
    stopEl.addEventListener("click", (e)=>{
      e.stopPropagation();
      state = "stopped";
      timeEl.classList.remove('paused');
      parentEl.classList.remove('preparing');
      parentEl.classList.remove('working');
      parentEl.classList.remove('resting');
      parentEl.classList.add('stopped');
      clearInterval(interval);
      interval = null;
    })
  } else {
    runningEl.classList.add('no-stop');
  }

  rewindEl.addEventListener("click", (e)=>{
    e.stopPropagation();
    timer = timer + rewindSeconds;
    if (state==="working") { timer = Math.min(timer, workSeconds); }
    if (state==="resting") { timer = Math.min(timer, restSeconds); }
    timeEl.innerText = timer;
    clearInterval(interval);
    interval = setInterval(handleInterval, 1000);
  })


  runningEl.addEventListener("click", ()=>{
    if (interval) {
      clearInterval(interval);
      interval = null;
      timeEl.classList.add('paused');
    } else {
      interval = setInterval(handleInterval, 1000);
      timeEl.classList.remove('paused');
    }
  })

  // HANDLE NEW SECOND PASSING
  const handleInterval = () => {
    if (state !== "stopped" ) {
      timer = timer - 1;
      if ( timer <= 3  && timer > 0 && playSounds) {
        sounds.play('countdownSound');
      }
      if (timer < 1) {
        if (playSounds) {
          sounds.play('doneSound');
        }
        if(state === "preparing" || state === "resting" || restSeconds < 1) {
          parentEl.classList.remove('preparing');
          parentEl.classList.remove('resting');
          parentEl.classList.add('working');
          state = 'working';
          statusEl.innerText = "WORKING";
          timer = workSeconds;
        } else {
          parentEl.classList.remove(['working']);
          parentEl.classList.add('resting');
          state = 'resting';
          statusEl.innerText = "RESTING";
          timer = restSeconds;
        }
      }
      timeEl.innerText = timer;
    }
  }
}
