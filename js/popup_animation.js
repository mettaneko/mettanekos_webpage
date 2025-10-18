// Исправленный скрипт для modal
const modal = document.getElementById('choiceModal');
const closeModal = document.getElementById('closeModal');

// Функция для открытия popup
function openPopup(songName) {
  const modalSongName = document.querySelector('.modal-song-name');
  if (modalSongName) {
    modalSongName.textContent = songName || 'Select where to open';
  }
  modal.classList.add('active');
  modal.classList.remove('hide');
}

// Закрыть popup
closeModal.addEventListener('click', () => {
  modal.classList.add('hide');
  setTimeout(() => {
    modal.classList.remove('active');
  }, 10);
});

// Закрытие по клику вне модального окна
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hide');
    setTimeout(() => {
      modal.classList.remove('active');
    }, 10);
  }
});