const {
  typeWriter,
  addInputText,
  restart,
  tradePageContent,
  playAudio,
  playBackgroundMusic,
  playPauseButton,
  selectOption,
  showOption,
  showTextNode,
  startGame,
  dieOrUp,
  fillStateSelect,
  loadGameState,
  controlProgress,
  createImage
} = require('./script');

describe('StartGame', () => {
  test('startGame should set the initial state and call showTextNode with the given number', () => {
    const showTextNode = jest.fn();
    const num = 1;

    startGame(num);

    expect(state).toEqual({ name: '', level: 1 });
    expect(showTextNode).toHaveBeenCalledWith(num);
  });
})

describe('loadGameState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should load the saved state from localStorage if it exists', () => {
    const savedState = { name: 'John', level: 2 };
    const savedPages = 3;
    const savedHp = '50%';
    const savedMp = '25%';
    const savedXp = '75%';
    const savedLevel = '3';
    localStorage.setItem('gameState', JSON.stringify(savedState));
    localStorage.setItem('gamePage', JSON.stringify(savedPages));
    localStorage.setItem('hp', JSON.stringify(savedHp));
    localStorage.setItem('mp', JSON.stringify(savedMp));
    localStorage.setItem('xp', JSON.stringify(savedXp));
    localStorage.setItem('level', JSON.stringify(savedLevel));

    loadGameState();

    expect(state).toEqual(savedState);
    expect(level.innerHTML).toEqual(savedLevel);
    expect(hpFirstGrandChild.style.width).toEqual(savedHp);
    expect(mpFirstGrandChild.style.width).toEqual(savedMp);
    expect(xpFirstGrandChild.style.width).toEqual(savedXp);
    expect(showTextNode).toHaveBeenCalledWith(savedPages);
  });

  test('should start a new game if no saved state exists in localStorage', () => {
    const startGameSpy = jest.spyOn(window, 'startGame');
    localStorage.clear();

    loadGameState();

    expect(startGameSpy).toHaveBeenCalled();
  });
});

// Teste para a função restart()
describe('Restart', () => {
  test('Testando a função restart()', () => {
    localStorage.setItem('gameState', JSON.stringify({ name: 'Alice', level: 2 }));
    localStorage.setItem('gamePage', JSON.stringify(2));
    localStorage.setItem('hp', JSON.stringify('60%'));
    localStorage.setItem('mp', JSON.stringify('30%'));
    localStorage.setItem('xp', JSON.stringify('40%'));
    localStorage.setItem('level', JSON.stringify(2));
    restart();
    expect(state).toEqual({ name: '', level: 1 });
    expect(level.innerHTML).toBe('1');
    expect(hpFirstGrandChild.style.width).toBe('0%');
    expect(mpFirstGrandChild.style.width).toBe('0%');
    expect(xpFirstGrandChild.style.width).toBe('0%');
  });
});

// Teste para a função playPauseButton()
describe('playPauseButton', () => {
  test('Testando a função playPauseButton()', () => {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const audio = new Audio();
    audio.src = './mp3/Medieval-Renaissance.mp3';
    expect(isBackgroundMusicPlaying).toBe(false);
    playPauseBtn.click();
    expect(isBackgroundMusicPlaying).toBe(true);
    expect(playPauseBtn.innerHTML).toBe('&#x23F8');
    audio.pause();
    playPauseBtn.click();
    expect(isBackgroundMusicPlaying).toBe(false);
    expect(playPauseBtn.innerHTML).toBe('&#x25B6');
  });
})

// Teste para a função playBackgroundMusic()
describe('playBG', () => {
  test('Testando a função playBackgroundMusic()', () => {
    const audio = new Audio();
    audio.src = './mp3/Medieval-Renaissance.mp3';
    playBackgroundMusic();
    expect(isBackgroundMusicPlaying).toBe(true);
    audio.pause();
    expect(isBackgroundMusicPlaying).toBe(false);
  });
})

// Teste para a função playAudio()
describe('playAudio', () => {
  test('Testando a função playAudio()', () => {
    const audio = new Audio();
    audio.src = './mp3/Medieval-Renaissance.mp3';
    playAudio('./mp3/Medieval-Renaissance.mp3');
    expect(isBackgroundMusicPlaying).toBe(false);
  });
});