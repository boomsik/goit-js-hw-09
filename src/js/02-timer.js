import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const daysField = document.querySelector('span[data-days]');
const hoursField = document.querySelector('span[data-hours]');
const minutesField = document.querySelector('span[data-minutes]');
const secondsField = document.querySelector('span[data-seconds]');

const timerInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;

let interval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    initTimerInterval(selectedDates);
  },
};

flatpickr('#datetime-picker', options);

function initTimerInterval(selectedDates) {
  const today = new Date();
  interval = selectedDates[0] - today;

  if (interval <= 0) {
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }

  viewTimer();
  startBtn.disabled = false;
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  timerInput.disabled = true;

  const timer = setInterval(() => {
    interval -= 1000;

    if (interval <= 0) {
      clearInterval(timer);
      Notiflix.Notify.success('Timer is over');
      timerInput.disabled = false;
      return;
    }

    viewTimer();
  }, 1000);
});

function viewTimer() {
  const { days, hours, minutes, seconds } = convertMs(interval);

  daysField.textContent = formatNumber(days);
  hoursField.textContent = formatNumber(hours);
  minutesField.textContent = formatNumber(minutes);
  secondsField.textContent = formatNumber(seconds);
}

function formatNumber(num) {
  return num < 10 ? `0${num}` : num;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}