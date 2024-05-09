const textLeftElement = document.getElementById('textLeft');
const textRightElement = document.getElementById('textRight');
const optionActButtons = document.getElementById('actionControls');
const resetBtn = document.getElementsByClassName('btnReset')[0];
let hp = document.getElementById("hp-bar");
let mp = document.getElementById("mp-bar");
let xp = document.getElementById("xp-bar");
let level = document.getElementById('level');
let potionSlot = document.getElementById('potion-slot');
let hpfirstChild = hp.firstChild;
let mpfirstChild = mp.firstChild;
let xpfirstChild = xp.firstChild;
let hpFirstGrandChild = hpfirstChild.firstChild;
let mpFirstGrandChild = mpfirstChild.firstChild;
let xpFirstGrandChild = xpfirstChild.firstChild;
let history = [];
let historyState = {};
let state = {};

function startGame(num) {
  state = {
    name: '',
    level: 1,
  };
  showTextNode(num);
};

function loadGameState() {
  const savedState = JSON.parse(localStorage.getItem('gameState'));
  const savedPages = localStorage.getItem('gamePage');
  if (savedState) {
    hpFirstGrandChild.style.width = savedState.hp ? `${savedState.hp}%` : 100 + '%';
    mpFirstGrandChild.style.width = savedState.mp ? `${savedState.mp}%` : 100 + '%';
    xpFirstGrandChild.style.width = savedState.xp ? `${savedState.xp}%` : 0 + '%';
  } else {
    hpFirstGrandChild.style.width = 100 + '%';
    mpFirstGrandChild.style.width = 100 + '%';
    xpFirstGrandChild.style.width = 0 + '%';
  }
  if (savedState !== null || savedPages !== null) {
    state = savedState;
    level.innerHTML = savedState.level ?? 1;
    showTextNode(JSON.parse(savedPages));
    if (state.HpPotion >= 1) {
      changePotionSlot('on')
    }
    else {
      changePotionSlot('off')
    }
  } else {
    startGame(1);
  }
};

function changePotionSlot(turn) {
  if (potionSlot) {
    if (turn === 'off') {
      potionSlot.classList.add('potion-slot');
      potionSlot.classList.remove('potion-red');
    } else if (turn === 'on') {
      potionSlot.classList.add('potion-red');
      potionSlot.classList.remove('potion-slot');
    }
  } else {
    console.error('Elemento não encontrado!');
  }
};

function restart() {
  history = [];
  state = {};
  historyState = {};
  localStorage.clear();
  startGame(1);
};

resetBtn.addEventListener('click', () => {
  if (isFinished.value) {
    restart();
  } else {
    notification('Por favor espere o texto terminar de ser escrito antes de fazer uma escolha.');
    writeSpeed = 0;
    writeSpeed2 = 0;
  }
});

let backgroundMusic = new Audio('./mp3/Medieval-Renaissance.mp3'); // Composed by Rafael Krux.
let currentMusic = null;
let isBackgroundMusicPlaying = false;
const playPauseBtn = document.getElementById('playPauseBtn');

playPauseBtn.addEventListener('click', playPauseButton);

let stopMusic = false;
function playPauseButton() {
  if (!isBackgroundMusicPlaying) {
    playPauseBtn.innerHTML = '&#x23F8';
    isBackgroundMusicPlaying = true;
    stopMusic = false;
    playBackgroundMusic();
  } else {
    isBackgroundMusicPlaying = false;
    playPauseBtn.innerHTML = '&#x25B6';
    stopMusic = true;
    playBackgroundMusic();
  }
};

function playBackgroundMusic() {
  if (isBackgroundMusicPlaying) {
    backgroundMusic.volume = 0.7; // 1 = 100%
    backgroundMusic.play();
    isBackgroundMusicPlaying = true;
    backgroundMusic.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    });
  } else {
    backgroundMusic.pause();
    isBackgroundMusicPlaying = false;
  }
};

function playAudio(src) {
  if (isBackgroundMusicPlaying) {
    backgroundMusic.pause();
    isBackgroundMusicPlaying = false;
  }

  let newMusic = new Audio(src);
  newMusic.volume = 0.8;
  newMusic.play();

  newMusic.addEventListener('ended', function () {
    if (!stopMusic) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
      isBackgroundMusicPlaying = true;
      playPauseBtn.innerHTML = '&#x23F8';
    }
    this.removeEventListener('ended', arguments.callee);
  });
};

const isFinished = { value: false };
let writeSpeed = 30;
let writeSpeed2 = 35;

function typeWriter(newText, textElement, newText2, textElement2) {
  writeSpeed = 30;
  writeSpeed2 = 35;
  let i = 0;
  let i2 = 0;
  let isH4 = false;
  let isH42 = false;
  textElement.innerHTML = '';
  textElement2.innerHTML = '';

  const h4Index = newText.indexOf('<h4>');
  if (h4Index !== -1) {
    const closeH4Index = newText.indexOf('</h4>', h4Index) + 5;
    textElement.innerHTML = newText.substring(0, closeH4Index);
    i = closeH4Index;
  }
  const h4Index2 = newText2.indexOf('<h4>');
  if (h4Index2 !== -1) {
    const closeH4Index2 = newText2.indexOf('</h4>', h4Index2) + 5;
    textElement2.innerHTML = newText2.substring(0, closeH4Index2);
    i2 = closeH4Index2;
  }

  function write() {
    if (i < newText.length) {
      if (newText.charAt(i) === '<' && newText.slice(i, i + 4) === '<h4>') {
        isH4 = true;
      } else if (newText.charAt(i) === '<' && newText.slice(i, i + 5) === '</h4>') {
        isH4 = false;
        textElement.innerHTML += newText.substring(i, newText.indexOf('</h4>', i) + 5);
        i = newText.indexOf('</h4>', i) + 5;
      } else {
        textElement.innerHTML += newText.charAt(i);
        i += 1;
        if (!isH4) {
          timeoutId = setTimeout(write, writeSpeed);
        }
      }
    } else if (i2 < newText2.length) {
      if (newText2.charAt(i2) === '<' && newText2.slice(i2, i2 + 4) === '<h4>') {
        isH42 = true;
      } else if (newText2.charAt(i2) === '<' && newText2.slice(i2, i2 + 5) === '</h4>') {
        isH42 = false;
        textElement2.innerHTML += newText2.substring(i2, newText2.indexOf('</h4>', i2) + 5);
        i2 = newText2.indexOf('</h4>', i2) + 5;
      } else {
        textElement2.innerHTML += newText2.charAt(i2);
        i2 += 1;
        if (!isH42) {
          timeoutId = setTimeout(write, writeSpeed2);
        }
      }
    }
    if (i2 === newText2.length) {
      isFinished.value = true;
    }
  }

  write();
};

function saveGameState(textNodeIndex) {
  localStorage.setItem('gameState', JSON.stringify(state));
  localStorage.setItem('gamePage', JSON.stringify(textNodeIndex));
};

function showTextNode(textNodeIndex) {
  if (state.hp && state.hp <= 0) {
    notification('Sua barra de vida chegou a 0%, você morreu.');
    return restart();
  }
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
  isFinished.value = false;
  typeWriter(`${textNode.textLeft}`, textLeftElement, `${textNode.textRight}`, textRightElement);
  const imgs = document.getElementById('imgs')
  while (imgs.firstChild) {
    imgs.removeChild(imgs.firstChild);
  }
  if (textNode.imgSrc1 !== "") {
    createImage(textNode.imgSrc1);
  }
  if (textNode.imgSrc2 !== "") {
    createImage(textNode.imgSrc2);
  }

  while (optionActButtons.firstChild) {
    optionActButtons.removeChild(optionActButtons.firstChild);
  }
  if (textNodeIndex === 1) {
    hpFirstGrandChild.style.width = 100 + '%';
    mpFirstGrandChild.style.width = 100 + '%';
    xpFirstGrandChild.style.width = 0 + '%';
    level.innerHTML = 1;
  }
  if (textNodeIndex === 7) {
    return addInputText(7, 'name', 'Escreva seu nome');
  }

  optionActButtons.innerHTML = '';

  textNode.options.forEach(option => { // Para cada options dentro do Id cria seus botões com o text.
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('btnAct');

      const a = document.createElement('a');
      a.setAttribute('href', '#book-container');

      a.appendChild(button);
      optionActButtons.appendChild(a);

      button.addEventListener('click', () => {
        if (isFinished.value) {
          if (state.hp && state.hp <= 0) {
            notification('Sua barra de vida chegou a 0%, você morreu.');
            return restart();
          } else {
            selectOption(option);
          }
        } else {
          notification('Por favor espere o texto terminar de ser escrito antes de fazer uma escolha.');
          writeSpeed = 0;
          writeSpeed2 = 0;
        }
      });
    };
  });
  saveGameState(textNodeIndex, level);
  fillStateSelect();
};

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}; // Se a opção não pedir nada /\     ou se a opção pedir algo /\, executa a função.

function selectOption(option) {
  let nextTextNodeId;
  if (option.rollTheDice) {
    nextTextNodeId = rollDice(option.rollTheDice[0], option.rollTheDice[1], option.rollTheDice[2]);
  } else {
    nextTextNodeId = option.nextText;
  }
  if (option.useHPPotion) {
    controllProgress("hp", 'up', 100);
    playAudio('./mp3/swallow.mp3');
    changePotionSlot('off');
  }
  if (option.getPotion) {
    changePotionSlot('on')
  }
  history.push(nextTextNodeId);
  historyState = Object.assign({}, state);
  backButtonClicked = false;
  if (nextTextNodeId === 5.4 || nextTextNodeId === 13.15
    || nextTextNodeId === 13.163 || nextTextNodeId === 13.7
    || nextTextNodeId === 13.5 || nextTextNodeId === 14.164
    || nextTextNodeId === 14.161 || nextTextNodeId === 14.74) {
    controllProgress("hp", 'down', 10);
    playAudio('./mp3/hit30.mp3.flac');
  }
  if (nextTextNodeId === 13.162 || nextTextNodeId === 13.81 || nextTextNodeId === 14.162 || nextTextNodeId === 14.73) {
    controllProgress("hp", 'down', 5);
    playAudio('./mp3/hit30.mp3.flac');
  }
  if (nextTextNodeId === 5.2 || nextTextNodeId === 5.3) {
    controllProgress("xp", 'up', 10);
    playAudio('./mp3/up.wav');
  }
  if (nextTextNodeId === 13.14) {
    playAudio('./mp3/up.wav');
  }
  if (nextTextNodeId === 13.15) {
    playAudio('./mp3/hit30.mp3.flac');
  }
  if (nextTextNodeId === 14.72) {
    controllProgress('hp', 'down', 15);
    playAudio('./mp3/hit30.mp3.flac');
  }
  if (nextTextNodeId === 12 || nextTextNodeId === 4) {
    playAudio('./mp3/medieval_loop.wav');
  }
  if (nextTextNodeId === 13.91) {
    controllProgress('xp', 'up', 30);
    playAudio('./mp3/up.wav')
  }
  if (nextTextNodeId === 14.78) {
    controllProgress('xp', 'up', 50);
    playAudio('./mp3/up.wav')
  }
  if (nextTextNodeId === 14.166) {
    controllProgress('xp', 'up', 20);
    playAudio('./mp3/up.wav')
  }
  if (nextTextNodeId <= 0) {
    return restart();
  };
  state = Object.assign(state, option.setState); // Pega o state atual e adiciona tudo do setState clicado.
  showTextNode(nextTextNodeId);
};

function controllProgress(name, operador, hit) { // name = "hp" or "mp" or "xp" // oprd = up or down // hit = valorporcentagem
  let progress = document.getElementById(name + "-bar");
  let firstChild = progress.firstChild;
  let firstGrandChild = firstChild.firstChild;

  let currentWidth = parseInt(firstGrandChild.style.width);
  let newWidth;

  if (operador === 'up') {
    newWidth = currentWidth + hit;
    if (newWidth >= 100) {
      newWidth = 100;
    }
  } else if (operador === 'down') {
    newWidth = currentWidth - hit;
    if (newWidth <= 0) {
      newWidth = 0;
    }
  } else {
    return;
  };

  firstGrandChild.style.width = newWidth + '%';
  state[name] = newWidth;
  dieOrUp(name);
};

function dieOrUp(name) {
  let progress = document.getElementById(name + "-bar");
  let firstChild = progress.firstChild;
  let firstGrandChild = firstChild.firstChild;
  let level = document.getElementById('level');
  if (name === 'hp' && parseInt(firstGrandChild.style.width) <= 0) {
    notification('Sua barra de vida chegou a 0%, você morreu.');
    return restart();
  };
  if (name === 'xp' && parseInt(firstGrandChild.style.width) >= 100) {
    state.level += 1;
    let currentlvl = parseInt(level.innerHTML);
    let newLvl = currentlvl + 1;
    level.innerHTML = newLvl;
    notification('Sua barra de experiência chegou a 100%! Você upou 1 level!');
    xpFirstGrandChild.style.width = 0 + '%';
  };

};

function addInputText(numID, names, placeholder) { // Id que será add / name&id do input / placeholder
  const textNode = textNodes.find(textNode => textNode.id === numID);
  const input = document.createElement('input');
  input.type = 'text';
  input.name = names;
  input.placeholder = placeholder;
  input.id = names;

  input.addEventListener('change', () => {
    const inputName = document.getElementById(names);
    state[names] = inputName.value;
    playAudio('./mp3/task.mp3');
  });

  input.setAttribute('required', 'required');
  optionActButtons.appendChild(input);

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('btnAct');
      button.addEventListener('click', () => {
        if (isFinished.value) {
          selectOption(option);
        } else {
          notification('Por favor espere o texto terminar de ser escrito antes de fazer uma escolha.');
          writeSpeed = 0;
          writeSpeed2 = 0;
        }
      });
      optionActButtons.appendChild(button);
    }
  })
};

function tradePageContent() {
  const objId8 = textNodes.find((obj) => obj.id === 8);
  if (objId8) {
    objId8.textLeft = `O orc encara você com curiosidade, seus olhos amarelados brilhando com uma intensidade que demonstra um misto de surpresa e desconfiança. Com a caneca em mãos, ele aperta com mais força e se dirige a você: "Interessante... ${state.name}"`;
  }
};

function createImage(src) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('rpgui-container', 'framed');

  img.addEventListener('click', () => {
    const zoomContainer = document.createElement('div');
    zoomContainer.classList.add('zoom-container');

    const zoomImg = document.createElement('img');
    zoomImg.src = src;
    zoomImg.classList.add('zoom-img', 'rpgui-container', 'framed');
    zoomContainer.appendChild(zoomImg);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      zoomContainer.remove();
    });
    zoomContainer.appendChild(closeButton);

    document.body.appendChild(zoomContainer);
  });

  const imgs = document.getElementById('imgs');
  imgs.appendChild(img);
}

function fillStateSelect() {
  const stateSelect = document.querySelector('#stateSelect');
  while (stateSelect.firstChild) {
    stateSelect.removeChild(stateSelect.firstChild);
  }
  for (const key in state) {
    if (state.hasOwnProperty(key) && state[key] !== false) {
      const option = document.createElement('option');
      option.value = key;
      if (state[key] === true) {
        option.text = key.charAt(0).toUpperCase() + key.slice(1);
      } else {
        option.text = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${state[key]}`;
      }
      stateSelect.appendChild(option);
    }
  }
};

let backButtonClicked = false;
const backButton = document.getElementsByClassName('btnBack')[0];
backButton.addEventListener('click', () => {
  if (isFinished.value) {
    if (!backButtonClicked) {
      returnBackwards();
      backButtonClicked = true;
    } else {
      notification('Você já voltou uma vez, não pode voltar mais.');
    }
  } else {
    notification('Por favor espere o texto terminar de ser escrito antes de fazer uma escolha.');
    writeSpeed = 0;
    writeSpeed2 = 0;
  }
});

function returnBackwards() {
  if (history.length > 1) {
    history.pop();
    const lastPage = history[history.length - 1];
    state = Object.assign({}, historyState);
    returnLocalStorageBackwards(lastPage)
    showTextNode(lastPage);
  } else {
    notification('Você não pode voltar ainda.');
  }
};

function returnLocalStorageBackwards(lastPage) {
  localStorage.setItem('gameState', JSON.stringify(state));
  localStorage.setItem('gamePage', JSON.stringify(lastPage));
};

function notification(mensagem) {
  const popUp = document.createElement('div');
  popUp.classList.add('popup');
  popUp.classList.add('rpgui-container', 'framed-golden');

  const text = document.createElement('p');
  text.textContent = mensagem;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Fechar';
  closeBtn.classList.add('rpgui-button');

  closeBtn.addEventListener('click', () => {
    popUp.remove();
  });

  popUp.appendChild(text);
  popUp.appendChild(closeBtn);

  document.body.appendChild(popUp);
};

function rollDice(id1_2, id3_4, id5_6) {
  playAudio('./mp3/dice.mp3');
  const result = Math.floor(Math.random() * 6) + 1;
  let nextTextId;
  if (result <= 2) {
    nextTextId = id1_2;
  } else if (result <= 4) {
    nextTextId = id3_4;
  } else {
    nextTextId = id5_6;
  }

  return nextTextId;
};

const textNodes = [
  {
    id: 1,
    imgSrc1: "./imgs/night-tavern.png",
    imgSrc2: "./imgs/tablefull.png",
    textLeft: 'A noite caiu e você sente sede.. A taverna da cidade está sempre agitada, com música alta e um clima agradável. Ao entrar, você senta e se depara com um grupo de aventureiros em uma mesa próxima ao bar.',
    textRight: 'É possível escutar que eles estão discutindo os detalhes de sua próxima expedição. Eles haviam sido contratados para encontrar um artefato místico que esta escondido nas profundezas de uma masmorra. Você poder perceber que eles ainda não planejaram uma estratégia para a jornada.',
    options: [
      {
        text: 'Pegar uma bebida',
        setState: { mead: 1 },
        nextText: 2
      },
      {
        text: 'Conversar com os exploradores',
        nextText: 3.2
      }
    ]
  },
  {
    id: 2,
    imgSrc1: "./imgs/bartender.png",
    imgSrc2: "./imgs/clargoth.png",
    textLeft: `Ao se aproximar do balcão, você pede uma bebida ao bartender, ele então enche uma caneca com hidromel e a desliza suavemente na sua direção. O aroma adocicado da bebida envolve o seu nariz enquanto você se refresca com um belo gole. O barulho alto das conversas e risadas se misturam com a musica de fundo.`,
    textRight: `Quando um guerreiro de aparência imponente ergue sua taça e chama a atenção dos outros membros. Com um sorriso malicioso no rosto, Clargoth, o líder orc do grupo, diz: 
    "Companheiros, devemos nos preparar para a jornada! Mas antes.. Vamos aproveitar a noite e beber em honra do nosso sucesso futuro!"`,
    options: [
      {
        text: 'Oferecer um brinde aos exploradores',
        requiredState: (currentState) => currentState.mead === 1,
        setState: { mead: false, dignity: true },
        nextText: 3.1
      },
      {
        text: 'Conversar com Clargoth',
        nextText: 3.2
      },
      {
        text: 'Ignorar e beber sozinho',
        setState: { skipClargoth: true },
        nextText: 3.51
      }
    ]
  },
  {
    id: 3.51,
    imgSrc1: "",
    imgSrc2: "./imgs/clargoth.png",
    textLeft: 'Você ignora o grupo de aventureiros e continua bebendo sozinho, mas não consegue deixar de ouvir a conversa animada que vem da mesa ao lado.',
    textRight: 'Clargoth, o líder orc, olha em sua direção com um olhar curioso, mas logo volta a conversar com seus companheiros.',
    options: [
      {
        text: 'Conversar com Clargoth',
        nextText: 3.2
      }
    ]
  },
  {
    id: 3.1,
    imgSrc1: "",
    imgSrc2: "./imgs/clargHappy.png",
    textLeft: `Ao oferecer uma bebida para Clargoth e seu grupo, ele ergue a sobrancelha em surpresa, mas logo aceita com um sorriso largo no rosto, e diz:
    "Muito obrigado, meu amigo. Iremos comemorar a vitória juntos!", levantando a caneca de hidromel em um brinde.`,
    textRight: '"Com este seu gesto imagino que você goste de aventuras, hmmm... Deseja se juntar à nossa caçada?" Exclama Clargoth.',
    options: [
      {
        text: 'Sim! Estou sedento por ação',
        nextText: 4
      },
      {
        text: 'Não, obrigado',
        setState: { skipClargoth: true },
        nextText: 12
      }
    ]
  },
  {
    id: 3.2,
    imgSrc1: "",
    imgSrc2: "./imgs/clargoth.png",
    textLeft: '"Ei, meu amigo. Algum problema? Meu grupo precisa se preparar para a jornada que virá em breve.", diz Clargoth, sorrindo de forma amistosa.',
    textRight: 'Clargoth é um líder Orc, leal e forte, que sempre terá o interesse de seus amigos em primeiro lugar.',
    options: [
      {
        text: 'Dizer que também deseja ir atrás do artefato',
        nextText: 4
      },
      {
        text: 'Oferecer um brinde aos exploradores',
        requiredState: (currentState) => currentState.mead === 1,
        setState: { mead: false, dignity: true },
        nextText: 3.1
      },
      {
        text: 'Nada não',
        setState: { skipClargoth: true },
        nextText: 12
      }
    ]
  },
  {
    id: 4,
    imgSrc1: "./imgs/guitar.png",
    imgSrc2: "",
    textLeft: `Clargoth bebe sua bebida em um gole só, mostrando ter habilidade em consumir grandes quantidades de álcool. Depois de terminar, Clargoth bate na mesa com força e grita:
     "Mais um pro time!" e então ele começa a cantar uma música de sua terra natal. Os outros frequentadores da taverna param para ouvir, enquanto o orc entoa a canção com uma voz potente e rouca..`,
    textRight: `Você e os outros membros da mesa juntam-se todos na cantoria, criando uma atmosfera animada na taverna. Depois de alguns minutos, a música termina e Clargoth se volta para você, com um olhar de cumplicidade,
    "Pensando bem... Eu estou bêbado e meu discernimento está fraco.. Se você quer ser um membro deste grupo, você deve provar seu valor."`,
    options: [
      {
        text: 'Eu acabei de pagar uma rodada de bebida pra vocês...',
        requiredState: (currentState) => currentState.dignity,
        setState: { dignity: false },
        nextText: 6
      },
      {
        text: 'Sou forte e posso provar à você',
        nextText: 5
      },
      {
        text: 'Provar para você? Não preciso disso',
        setState: { skipClargoth: true },
        nextText: 12
      }
    ]
  },
  {
    id: 5,
    imgSrc1: "./imgs/radiant-orc.png",
    imgSrc2: "",
    textLeft: `Ele se vira para você com uma expressão séria.
    "Vou fazer algumas perguntas para testar suas habilidades. Você está pronto?".
    Clargoth diz, encarando você com um olhar desafiador.`,
    textRight: 'Você pode sentir a pressão aumentar, mas sabe que é importante provar sua habilidade para ganhar o seu respeito.',
    options: [
      {
        text: 'Estou pronto',
        nextText: 5.1
      },
    ]
  },
  {
    id: 5.1,
    imgSrc1: "",
    imgSrc2: "./imgs/stone-troll.png",
    textLeft: `"Qual é a melhor arma para se usar contra um troll de pedra?"`,
    textRight: '"Pense bem, amigo. Se o troll perceber que estamos planejando atacá-lo, ele pode ficar ainda mais feroz e nos dar um problema ainda maior."',
    options: [
      {
        text: 'Uma arma que possa causar danos por esmagamento, como um martelo de guerra ou uma clava',
        nextText: 5.4
      },
      {
        text: 'Uma lança ou uma flecha, seria capaz de penetrar na pele dura do troll de pedra',
        nextText: 5.2
      },
      {
        text: 'Usar um feitiço de congelamento, pode retardar seus movimentos tornando-o mais fácil de acertar',
        nextText: 5.2
      }
    ]
  },
  {
    id: 5.2,
    imgSrc1: "",
    imgSrc2: "./imgs/fire-dragon.png",
    textLeft: `<h4>Você ganhou 10% de experiência.</h4>
    "Certo! E como você lidaria com um dragão que cospe fogo?"`,
    textRight: `"Os dragões são extremamente inteligentes e podem antecipar nossos movimentos. Precisamos pensar em algo que possa enganá-lo, algo que ele não espera."`,
    options: [
      {
        text: 'Usar uma arma mágica que cause danos adicionais a criaturas mágicas',
        nextText: 5.3
      },
      {
        text: 'Atacar o dragão com uma arma inflamável, para criar uma explosão e causar mais dano',
        nextText: 5.4
      },
      {
        text: `Usar um escudo mágico ou feitiço de proteção para se proteger do fogo do dragão
        `,
        nextText: 5.3
      }
    ]
  },
  {
    id: 5.3,
    imgSrc1: "./imgs/goblins.png",
    imgSrc2: "",
    textLeft: `<h4>Você ganhou 10% de experiência.</h4>
    "Parabéns, acertou. E agora em uma batalha contra um grupo de goblins, como você faria com sua equipe para obter a vitória?"`,
    textRight: `"Ahh os goblins... Nossos inimigos mais frequentes, eles são ágeis e imprevisíveis, e isso pode ser um problema para nós. É necesssário ser astuto e não subestimá-los."`,
    options: [
      {
        text: 'Convencê-los a se renderem em troca de ouro e tesouros, usando o poder da persuasão',
        nextText: 5.4
      },
      {
        text: 'Manter a equipe unida e criar uma formação defensiva para proteger os membros mais fracos',
        nextText: 6
      },
      {
        text: 'Dividir a equipe em grupos menores para cobrir mais terreno e atacar os goblins por trás',
        nextText: 6
      }
    ]
  },
  {
    id: 5.4,
    imgSrc1: "",
    imgSrc2: "./imgs/clargHappy.png",
    textLeft: '<h4>Você perde 10% da sua vida.</h4> "Você errou feio, amigo. Isso é inaceitável em nossa tribo. Você deveria estar mais bem preparado. Como punição, tirei 10 pontos de vida de você"',
    textRight: `"Você precisa treinar mais em vez de gastar todo seu tempo em tavernas bebendo hidromel!"`,
    options: [
      {
        text: 'Tentar novamente',
        nextText: 5.1,
        requiredState: (currentState) => currentState.hp > 0,
      }
    ]
  },
  {
    id: 6,
    imgSrc1: "",
    imgSrc2: "./imgs/clargHappy.png",
    textLeft: `"Muito bem, meu amigo! Você provou ser habilidoso, e estou feliz em ter você em nosso grupo. Mas não se engane, o caminho que temos pela frente é cheio de perigos, monstros que desafiam a lógica e a própria natureza habitam a masmorra em que estamos prestes a entrar."`,
    textRight: `"Nossas habilidades e forças serão testadas além do que podemos suportar, e muitos dos que começam essa jornada não voltam". Clargoth para por um segundo, e com um olhar vibrante ele diz: "Saiba que a morte é um destino certo e horrível que aguarda aqueles que são fracos e imprudentes."`,
    options: [
      {
        text: 'Eu entendo os perigos que nos aguardam e estou aqui para enfrentá-los',
        nextText: 7
      },
      {
        text: 'Irei lutar até o fim por nosso objetivo',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    imgSrc1: "",
    imgSrc2: "./imgs/clargoth.png",
    textLeft: `Clargoth olhou fixamente para você. "Antes de partirmos, preciso saber mais sobre você", disse ele franzindo os olhos em sua direção.`,
    textRight: `Não consigo ver bem seu rosto, além de sua capa, aqui está escuro.
     Me diga, qual o seu nome?`,
    options: [
      {
        text: 'Certo',
        nextText: 8
      },
      {
        text: 'Hmm... Que tal mais uma caneca de hidromel?',
        requiredState: (currentState) => currentState.mead === 1,
        setState: { mead: false, skipClargoth: true },
        nextText: 12
      }
    ]
  },
  {
    id: 8,
    imgSrc1: "",
    imgSrc2: "./imgs/radiant-orc.png",
    textLeft: `O orc encara você com curiosidade, seus olhos amarelados brilhando com uma intensidade que demonstra um misto de surpresa e desconfiança. Com a taça em suas mãos, ele a aperta com mais força e se dirige a você: "Interessante... `,
    textRight: `"Seu nome é tão incomum quanto o seu rosto. Mas mesmo assim, não consigo identificar sua origem apenas por ele." Ele solta um grunhido de insatisfação e volta a tomar um gole do hidromel. A expressão em seu rosto demonstra que ele está pensando sobre o assunto.`,
    options: [
      {
        text: 'Sou um Humano',
        setState: { human: true },
        nextText: 9
      },
      {
        text: 'Sou um Elfo',
        setState: { elf: true },
        nextText: 9.3
      },
      {
        text: 'Sou um Gnomo',
        setState: { gnome: true },
        nextText: 9.6
      },
      {
        text: 'Sou um Goblin!',
        setState: { goblin: true },
        nextText: 9.9
      }
    ]
  },
  {
    id: 9, //human
    imgSrc1: "./imgs/clargoth.png",
    imgSrc2: "",
    textLeft: `Clargoth olha para você com um desgosto no rosto.
    "Ah, um humano... Sem dúvidas, como pude não reconhecer? Vocês são bem comuns por aqui.
    Hmm, humanos..."`,
    textRight: '"Não tenho uma opinião muito boa sobre vocês, mas sei que muitos dos melhores guerreiros que já vi também eram humanos... Então espero que você possa se provar útil em nossa missão. Me diga humano, o que você é capaz de fazer?"',
    options: [
      {
        text: 'Sou uma arqueira habilidosa, capaz de acertar facilmente alvos grande como você',
        setState: { archer: true },
        nextText: 9.1
      },
      {
        text: 'Sou um domador de animais, inclusive de bestas selvagens como você',
        setState: { beastMaster: true },
        nextText: 9.12
      },
      {
        text: 'Sou uma ladina esperta e ágil, posso roubar seus pertences sem você nem mesmo perceber',
        setState: { rogue: true },
        nextText: 9.2
      }
    ]
  },
  {
    id: 9.1, //archer
    imgSrc1: "./imgs/archer.png",
    imgSrc2: "",
    textLeft: `Clargoth parece levemente impressionado, ele cruza os braços avaliando você.
    "Uma arqueira habilidosa, hein? Não duvido mesmo que seja capaz de acertar um alvo grande, mas será que tem precisão suficiente para não acertar seus companheiros em meio à uma batalha?"`,
    textRight: '"Vamos ver durante nossa missão do que você é realmente capaz. Prove seu valor e talvez eu possa reconsiderar minha opinião sobre os humanos."',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.12, //beastMaster
    imgSrc1: "./imgs/Beastmaster.png",
    imgSrc2: "",
    textLeft: `Clargoth arqueia as sobrancelhas, curioso, ele diz: "Domador de animais, é? Se isso for verdade, poderá ser bastante útil para a nossa missão. Mas tenha cuidado, amigo, as bestas selvagens podem ser as mais imprevisíveis." Clargoth diz, ao dar uma risada`,
    textRight: '"E certifique-se de que seus animais estejam bem treinados e sob controle. Não queremos que eles se voltem contra nós ou nos atrapalhem em nossa missão... E deixando as brincadeiras à parte, vamos tratar do que interessa."',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.2, //rogue
    imgSrc1: "./imgs/rogue.png",
    imgSrc2: "",
    textLeft: `Clargoth dá um sorriso irônico e uma leve risada. "Uma ladina esperta, hein? Bom, eu consigo manter meus pertences bem guardados, mas quem sabe você não possa me ensinar alguns truques interessantes."`,
    textRight: 'Enquanto te olha fixamente nos olhos, ele diz: "Só não se esqueça de quem são nossos verdadeiros inimigos e amigos aqui... Então não tente me roubar, se não você terá grandes problemas."',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.3, //elf
    imgSrc1: "./imgs/radiant-orc.png",
    imgSrc2: "",
    textLeft: `Com um olhar desconfiado, Clargoth encara você por um instante. Enquanto pensativo ele diz:
    "Você é um elfo? Bom, em muitas partes deste mundo os outros não são acolhedores com a sua raça, posso dizer que é igual a minha, meu amigo."`,
    textRight: '"Antes de seguirmos, precisamos traçar um plano cuidadoso para a nossa expedição. Mas, me diga, que tipo de elfo você é?" Pergunta Clargoth.',
    options: [
      {
        text: 'Um Elfo aquático',
        setState: { aquaticElf: true },
        nextText: 9.31
      },
      {
        text: 'Uma Elfa das florestas antigas',
        setState: { forestElf: true },
        nextText: 9.4
      },
      {
        text: 'Sou um Elfo Monge',
        setState: { monkElf: true },
        nextText: 9.5
      }
    ]
  },
  {
    id: 9.31, //waterElf
    imgSrc1: "./imgs/water-elf.png",
    imgSrc2: "",
    textLeft: `Clargoth abre um sorriso e te encara com um olhar de duvida.
    "Um elfo da água, hein? Ouvi dizer que vocês vivem nas profundezas dos rios e mares, e são capaz de controlar a água a seu favor.. Interessante, me pergunto o que te levou a vir à terra firme."`,
    textRight: '"Sempre admirei a habilidade dos seus ancestrais em dominar o elemento mais poderoso da natureza. Imagino que você também tenha alguns truques na manga." Conclui, Clargoth.',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.4, //forestElf
    imgSrc1: "./imgs/forestElf.png",
    imgSrc2: '',
    textLeft: `Clargoth chama a atenção de todos e diz: "Uma elfa da floresta! Temos aqui conosco uma mestre na arte de esconder-se, rapazes. E além disso, parece que também ganhamos uma curandeira natural, que vai poder usar as ervas e plantas que encontrarmos em nosso caminho para nos curar!"`,
    textRight: 'Todos ficam mais seguros ao ouvir sobre suas habilidades. Clargoth se pergunta se acabou pressionando você.. Ele parece confiar em sua capacidade.',
    options: [
      {
        text: 'Agradecer a saudação',
        nextText: 11
      }
    ]
  },
  {
    id: 9.5, //monkElf
    imgSrc1: "./imgs/monkElf.png",
    imgSrc2: "",
    textLeft: `Clargoth fica intrigado ao ouvir, "Um elfo monge? Incrível, nunca ouvi falar de um fora do monastério. Admiro a habilidade dos monges em se movimentar rapidamente e desferir golpes precisos. Imagino que você seja um guerreiro habilidoso.`,
    textRight: '"Eu conheço bem a arte da guerra.. Humm.. Mas vocês estudam filosofia e espiritualidade, né?" Clargoth coça a cabeça antes de concluir, "Err.. Estou sempre aberto a aprender novas técnicas. Seja bem vindo!"',
    options: [
      {
        text: 'Agradecer a saudação',
        nextText: 11
      }
    ]
  },
  {
    id: 9.6, //gnome
    imgSrc1: "./imgs/clargHappy.png",
    imgSrc2: "",
    textLeft: `Clargoth olha para você com um olhar intrigado. "Um gnomo, hein? Nunca tive um gnomo em meu grupo, estou ainda mais curioso em você."`,
    textRight: '"Para que dinastia ou nação você pertence, gnomo? É importante que conheçamos os antecedentes de nossos companheiros para que possamos trabalhar em harmonia."',
    options: [
      {
        text: 'Sou do Vale da Prata',
        setState: { valleyGnome: true },
        nextText: 9.61
      },
      {
        text: 'Venho da dinastia Girassol',
        setState: { daisyGnome: true },
        nextText: 9.7
      },
      {
        text: 'Sou um Gnomo renegado',
        setState: { renegadeGnome: true },
        nextText: 9.8
      }
    ]
  },
  {
    id: 9.7, // gnome sunflower
    imgSrc1: "./imgs/sunflowerGnome.png",
    imgSrc2: "",
    textLeft: `"Dinastia Girassol, hein? Nunca conheci nenhum guerreiro desse grupo, mas já ouvi rumores de que são capazes de manipular as sombras para controlar seus inimigos...`,
    textRight: 'Clargoth fica um pouco mais cauteloso.. Pensa e diz: "Interessante, bem vindo ao grupo."',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.61, //gnome valley
    imgSrc1: "./imgs/gnomevalley.png",
    imgSrc2: "",
    textLeft: `"Ah, conheço bem o Vale da Prata. Guerreiros ágeis e magos astutos, hein? Certamente você tem habilidades valiosas para nossa missão."`,
    textRight: 'Ele parece refletir por um instante antes de continuar...',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.8, //gnome creepy
    imgSrc1: "./imgs/gnomecreepy.png",
    imgSrc2: "",
    textLeft: `"Renegado? O que te levou a deixar sua comunidade, amigo? Não precisa me contar se não quiser, mas saiba que estou aqui com você. Afinal, isso que é liderar." Diz Clargoth.`,
    textRight: '"E não, eu não tenho preconceitos em relação a isso. Se você é bom em combate e pode nos ajudar a chegar à masmorra, é tudo o que importa para mim."',
    options: [
      {
        text: 'Contar um pouco de sua história',
        nextText: 9.81
      },
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.81, //gnome creepy
    imgSrc1: "./imgs/gnomecreepy.png",
    imgSrc2: "",
    textLeft: `Você conta que nasceu em uma família de gnomos de boa aparência e habilidades surpreendentes, mas sempre se destacou por sua aparência medonha e sua aptidão por feitiçaria, algo que não era bem visto em sua família. Conta que tentou se encaixar, mas foi rejeitado e acabou se isolando, e desde então, vive sozinho.`,
    textRight: 'Clargoth ouve a sua história com empatia e diz: "Eu entendo como é se sentir diferente e ser julgado por isso, amigo. Mas saiba que aqui em nosso grupo, valorizamos as habilidades de cada um, independentemente de sua aparência ou origem. Se você se juntar a nós, terá um lugar onde será aceito e valorizado pelo que é."',
    options: [
      {
        text: 'Avançar',
        nextText: 11
      }
    ]
  },
  {
    id: 9.9, //goblin
    imgSrc1: "./imgs/clargoth.png",
    imgSrc2: "",
    textLeft: `Clargoth arregalou os olhos com surpresa ao ouvir que você é um goblin. Ele levou alguns segundos para se recuperar do choque, mas logo perguntou com cautela: "Qual a sua nação, meu jovem?`,
    textRight: '"Eu não gostaria de ter um espião em nosso grupo." Ele cruzou os braços e esperou sua resposta, mantendo um olhar atento e desconfiado em você.',
    options: [
      {
        text: 'Sou da nação dos goblins do espaço.',
        setState: { spaceGoblin: true },
        nextText: 10
      },
      {
        text: 'Faço parte da nação dos goblins do pântano.',
        setState: { swampGoblin: true },
        nextText: 10.1
      },
      {
        text: 'Nascido e criado na nação goblins do sorvete.',
        setState: { iceCreamGoblin: true },
        nextText: 10.2
      },
    ]
  },
  {
    id: 10, //spacegoblin
    imgSrc1: "",
    imgSrc2: "imgs/space-goblins.png",
    textLeft: `<h4>Você conta um resumo de sua história para Clargoth</h4>
    "Um goblin do espaço, hein? Nunca ouvi falar de algo assim antes.. Então quer dizer que você sofreu uma pane em sua nave que acabou te levando a cair na Terra."`,
    textRight: `"Então você diz que artefatos místicos são úteis para consertar a sua nave? Entendo, isso pode ser útil para nós também. Nosso principal objetivo é encontrar o artefato ZoMo. Caso você apenas o utilize para consertar a sua nave, e eu fique com ele, podemos chegar a um acordo."`,
    options: [
      {
        text: 'É somente isso que preciso',
        nextText: 11
      }
    ]
  },
  {
    id: 10.1, //swamp-goblin
    imgSrc1: "",
    imgSrc2: "./imgs/swampgoblin.png",
    textLeft: 'Clargoth dá uma risada. "Goblins do pântano, hein? Já encontrei alguns deles em minhas viagens. Vocês são astutos e perigosos..',
    textRight: '"Mas se você está com a gente, então.. Tudo certo! Só tome cuidado para não trair a nossa confiança."',
    options: [
      {
        text: 'Certo',
        nextText: 11
      }
    ]
  },
  {
    id: 10.2, //icecream-goblin
    imgSrc1: "./imgs/icecream-goblin.png",
    imgSrc2: "",
    textLeft: 'Clargoth coça a cabeça, um tanto confuso. "Goblins da terra dos sorvetes? Eu nunca ouvi falar disso... Bem, não importa, desde que você seja útil.',
    textRight: '"Mas lembre-se, não vamos estar caçando sobremesa na masmorra, estamos atrás de um artefato místico."',
    options: [
      {
        text: 'HA HA',
        nextText: 11
      }
    ]
  },
  {
    id: 11, //geral
    imgSrc1: "",
    imgSrc2: "./imgs/base.jpg",
    textLeft: '"Bom, agora que sabemos um pouco mais sobre você, vamos nos concentrar em nossa missão. Estamos indo para uma masmorra antiga em busca de um artefato místico, e precisamos nos preparar bem para enfrentar os perigos que nos esperam lá dentro". Ele toma um gole de sua bebida antes de continuar...',
    textRight: 'Clargoth se levanta da mesa e indica para você segui-lo. "Vamos até a nossa base de operações, onde vamos nos preparar para a jornada que nos aguarda". Ele caminha em direção à porta da taverna. O grupo de aventureiros que estava sentado próximo ao bar também se levanta e começa a seguir Clargoth em direção à base de operações.',
    options: [
      {
        text: 'Ir junto',
        nextText: 13
      }
    ]
  },
  {
    id: 13,
    imgSrc1: "./imgs/map.jpg",
    imgSrc2: "",
    textLeft: 'Ao chegarem, Clargoth puxa um mapa de sua mochila e mostra as diferentes rotas que levam à entrada da masmorra. "Aqui estão nossas opções: a trilha na floresta, ir pela margem do rio e o caminho do deserto. Qual você prefere?"',
    textRight: 'Enquanto você pensa na escolha, Clargoth aponta para o mapa. "Veja só, esta é a montanha em que precisamos chegar. A masmorra está localizada no seu interior, e dizem que o artefato místico está guardado por uma Tarascona. Uma espécie de dragão com carapaça de tartaruga, com espinhos e uma cauda venenosa..."',
    options: [
      {
        text: 'Trilha na floresta',
        requiredState: (currentState) => !currentState.skipForest,
        nextText: 13.1
      },
      {
        text: 'Pelo rio',
        requiredState: (currentState) => !currentState.skipRiver,
        nextText: 13.2
      },
      {
        text: 'Caminho do deserto',
        requiredState: (currentState) => !currentState.skipDesert,
        nextText: 13.3
      },
    ]
  },
  {
    id: 13.1, //Trilha na floresta
    imgSrc1: "",
    imgSrc2: "./imgs/door.jpg",
    textLeft: 'Conforme vocês seguem pela trilha, a paisagem se torna cada vez mais íngreme e acidentada. Em certo ponto, vocês se deparam com um grande portão de pedra que bloqueia o caminho. O portão parece antigo e reforçado, e não há nenhuma alavanca ou mecanismo visível para abri-lo.',
    textRight: 'Clargoth coça a barba, pensativo. "Parece que tem uma aura mágica em torno desse portão que não nos deixa contorna-lo", diz ele, olhando para o portão com desconfiança. "Talvez haja alguma pista que possamos encontrar para abri-lo."',
    options: [
      {
        text: 'Avançar',
        nextText: 13.12
      },
    ]
  },
  {
    id: 13.12,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você começa a examinar o portão mais de perto e nota que há algumas inscrições em uma língua estranha esculpidas na pedra. Clargoth observa por cima do seu ombro. "Não reconheço essa língua. Parece que precisamos decifrar isso antes de podermos passar."',
    textRight: 'Ao examinar as inscrições com mais cuidado você nota que cada letra parece estar ligada a um símbolo ou figura...  Role o dado para determinar se você consegue decifrar este enigma.',
    options: [
      {
        text: 'Rolar o dado',
        rollTheDice: [13.11, 13.114, 13.114],
      }
    ]
  },
  {
    id: 13.11,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou menos de 3. Com esse resultado, você não consegue decifrar o enigma e o portão permanece fechado.',
    textRight: 'Clargoth olha para você e diz: "Parece que não temos conhecimento mágico suficiente para resolver isto... Melhor voltarmos e tentar por outro caminho"',
    options: [
      {
        text: 'Voltar',
        nextText: 13,
        setState: { skipForest: true },
      },
    ]
  },
  {
    id: 13.114,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou mais de 3. Com esse resultado, você consegue decifrar o primeiro enigma e palavras começam a surgir flutuando em frente ao portão.',
    textRight: `Clargoth olha para você e diz: "Parece que você é mais habilidoso do que eu pensava, continue assim! Vamos ver o que acontece..."`,
    options: [
      {
        text: 'Continuar',
        nextText: 13.13,
      },
    ]
  },
  {
    id: 13.13,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: `<h4>Eu sou uma criatura mágica que habita na masmorra, sou capaz de voar e tenho um corpo brilhante translúcido.</h4>`,
    textRight: `<h4>Alguns me veem como uma bênção, outros como uma maldição.</h4>
   "O que sou eu?"`,
    options: [
      {
        text: 'Dragão',
        nextText: 13.15,
        setState: { skipForest: true }
      },
      {
        text: 'Fada',
        nextText: 13.15,
        setState: { skipForest: true }
      },
      {
        text: 'Fantasma',
        nextText: 13.14
      },
    ]
  },
  {
    id: 13.15,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: `<h4>Você errou!</h4>
  De repente, ouvem-se um estrondo seguido de uma nuvem de poeira que toma todo o ar, ofuscando a visão de todos.`,
    textRight: `<h4>Você perde 10% da sua vida.</h4>
  Os portões somem restando apenas as grandes paredes de pedra. "Não temos escolha, temos que ir por outro caminho agora." Diz Clargoth.`,
    options: [
      {
        text: 'Pelo rio',
        nextText: 13.2,
        setState: { skipForest: true }
      },
      {
        text: 'Caminho do deserto',
        nextText: 13.3,
        setState: { skipForest: true }
      },
    ]
  },
  {
    id: 13.14,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: `<h4>Fantasma! você diz.</h4>
    O portão mágico treme e começa a se mover, revelando uma passagem. Com isso, vocês conseguem passar pela porta mágica e continuar pela trilha. No caminho, vocês encontram uma ponte suspensa sobre um grande abismo. A ponte parece bastante instável e pode desabar a qualquer momento.`,
    textRight: `Clargoth se aproxima de você, e diz: "Precisamos passar pela ponte, mas ela me parece perigosa. Tenho uma ideia, vamos atravessar juntos, segurando um ao outro para garantir que ninguém caia. O que acha?"`,
    options: [
      {
        text: 'Boa ideia!',
        nextText: 13.16
      }, {
        text: 'Acho melhor um por vez',
        nextText: 13.17
      }
    ]
  },
  {
    id: 13.16,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você concorda com a ideia e com cuidado e determinação, vocês começam a caminhar pela ponte. Durante o caminho a ponte começa a balançar violentamente, Clargoth, que está no meio, começa a cantar uma música de guerra dos orcs para manter a concentração e a coragem do bando.',
    textRight: `<h4>Role um dado de seis lados para determinar se você consegue atravessar a ponte com segurança ou não.</h4>
    Agora é hora de testar a sua sorte.`,
    options: [
      {
        text: 'Jogar o dado',
        rollTheDice: [13.163, 13.162, 13.161],
      }
    ]
  },
  {
    id: 13.161,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou 6. Com esse resultado, você consegue atravessar a ponte sem problemas e chegar ao outro lado em segurança.',
    textRight: 'Parabéns pela travessia bem-sucedida!',
    options: [
      {
        text: 'Avançar',
        nextText: 13.18
      }
    ]
  },
  {
    id: 13.162,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou 4. No meio da travessia, um forte vento repentinamente sacode a ponte com violência. Vocês se seguram com ainda mais força, mas um dos degraus se solta, colocando em risco a estabilidade da passagem.',
    textRight: 'Apesar dos contratempos, e com mais alguns novos arranhões, você conseguiu chegar ao outro lado.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.18
      }
    ]
  },
  {
    id: 13.163,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou 1. Vocês começam a caminhar com cuidado sobre a estrutura instável. No entanto, a combinação dos fortes ventos e a deterioração dos suportes da ponte provoca um colapso súbito. A estrutura cede sob o peso de vocês, e a ponte desaba, lançando todos em direção ao abismo.',
    textRight: 'Por um golpe de sorte, vocês conseguem se segurar nas bordas da ravina, evitando uma queda fatal. No entanto, a queda brusca causa alguns ferimentos entre os membros do grupo. Vocês percebem que precisam buscar uma rota alternativa para alcançar o artefato mágico. Clargoth, mesmo ferido, lidera a discussão sobre o próximo passo a ser tomado.',
    options: [
      {
        text: 'Iremos pelo rio',
        nextText: 13.2,
        setState: { skipForest: true }
      },
      {
        text: 'Vamos no caminho do deserto',
        nextText: 13.3,
        setState: { skipForest: true }
      },
    ]
  },
  {
    id: 13.17,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você expressa sua preocupação com a instabilidade da ponte e sugere que atravessar um por vez pode ser mais seguro. Clargoth hesita por um momento, mas acaba concordando com a sua abordagem cautelosa.',
    textRight: 'Clargoth inicia a travessia com cuidado, testando cada degrau antes de avançar. Apesar de enfrentar alguns momentos de tensão com o balanço da ponte, ele consegue chegar ao outro lado em segurança!',
    options: [
      {
        text: 'Avançar',
        nextText: 13.171
      }
    ]
  },
  {
    id: 13.171,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Agora, é a sua vez de enfrentar o desafio. Com o coração acelerado, você começa a atravessar a ponte, concentrando-se em seguir os passos de Clargoth. Cada passo é uma batalha contra o medo e a incerteza, mas a sua determinação e foco o ajudam a superar o desafio.',
    textRight: 'Finalmente, você alcança o outro lado, onde Clargoth o recebe com um sorriso de alívio.',
    options: [
      {
        text: 'Continuar',
        nextText: 13.18
      }
    ]
  },
  {
    id: 13.18,
    imgSrc1: "./imgs/dungeonCave.jpg",
    imgSrc2: "",
    textLeft: 'Após atravessarem a ponte com sucesso, vocês continuam pela trilha, adentrando cada vez mais nas profundezas da montanha. A atmosfera ao redor parece carregada de mistério e energia ancestral, aumentando a tensão entre o grupo.',
    textRight: 'Enquanto avançam, vocês se deparam com uma imponente estrutura de pedra, com arcos antigos e ornamentos misteriosos esculpidos nas paredes, coberta pelas rochas há uma pequena passagem...  Clargoth, ao se aproximar, ativa o selo mágico do portão, que então se abre revelando um caminho guiado pelas tochas.',
    options: [
      {
        text: 'Avançar',
        nextText: 14
      }
    ]
  },
  {
    id: 13.2, // Pelo Rio
    imgSrc1: "",
    imgSrc2: "./imgs/river.jpg",
    textLeft: 'Decidindo seguir pelo rio, vocês encontram um pequeno barco de madeira na margem do rio e votam que o melhor é navegar. O rio serpenteia entre as árvores, refletindo os raios de sol que atravessam a densa folhagem.',
    textRight: 'Enquanto remam silenciosamente, vocês avistam uma série de pedras afiadas emergindo das águas turbulentas à frente. Parece haver um caminho estreito entre elas, mas é difícil de navegar.',
    options: [
      {
        text: 'Continuar remando com cautela',
        nextText: 13.21
      },
      {
        text: 'Parar e tentar encontrar um caminho alternativo',
        nextText: 13.22
      }
    ]
  },
  {
    id: 13.22,
    imgSrc1: "",
    imgSrc2: "./imgs/riverTrail.jpg",
    textLeft: 'Optando por encontrar um caminho alternativo, vocês desembarcam do barco e começam a explorar a margem do rio em busca de uma rota mais segura.',
    textRight: 'Role o dado para determinar se vocês conseguem encontrar um caminho seguro.',
    options: [
      {
        text: 'Rolar o dado',
        rollTheDice: [13.222, 13.221, 13.223],
      }
    ]
  },
  {
    id: 13.221,
    imgSrc1: "",
    imgSrc2: "./imgs/riverFoot2.jpg",
    textLeft: 'Você jogou o dado e tirou 3. Com esse resultado, vocês conseguem encontrar uma pequena trilha que percorre pela margem do rio.',
    textRight: '"Olhem ali! Parece que há uma trilha maior. Vamos por ali, será mais seguro." Clargoth aponta para uma passagem estreita que se abre entre as árvores.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.23
      }
    ]
  },
  {
    id: 13.222,
    imgSrc1: "",
    imgSrc2: "./imgs/riverFalls.jpg",
    textLeft: 'Você jogou o dado e tirou 1. Infelizmente, a busca por um caminho alternativo não dá frutos e vocês acabam perdendo tempo. Em contra partida, um de seus companheiros, responsável por ficar de olho no barco, acaba se descuidando e deixa a correnteza levar o barco embora.',
    textRight: 'Enquanto o barco desaparece rio abaixo, não lhes resta outra opção a não ser desistir desta rota. "Seguir o resto do caminho a pé sem uma trilha vai ser muito cansativo, podemos nos perder... E este rio não me parece muito amigável, mesmo se construíssemos uma jangada." Diz Clargoth.',
    options: [
      {
        text: 'Voltar',
        nextText: 13,
        setState: { skipRiver: true }
      }
    ]
  },
  {
    id: 13.223,
    imgSrc1: "",
    imgSrc2: "./imgs/riverFoot.jpg",
    textLeft: 'Você jogou o dado e tirou 6. Com esse resultado, vocês encontram um desvio seguro que os leva além das pedras afiadas, evitando o perigo iminente.',
    textRight: '"Uau, que sorte encontrarmos essa passagem tão segura! Parece que estamos destinados a chegar à masmorra sem grandes obstáculos." Diz Clargoth, aliviado.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.23
      }
    ]
  },
  {
    id: 13.21, // continuar remando
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Vocês remam com determinação, mas uma correnteza repentina arrasta o barco em direção a uma das rochas. Vocês precisam agir rápido para evitar uma colisão perigosa!',
    textRight: 'Role o dado para determinar se vocês conseguem desviar da rocha com sucesso.',
    options: [
      {
        text: 'Rolar o dado',
        rollTheDice: [13.222, 13.221, 13.223],
      }
    ]
  },
  {
    id: 13.221,
    imgSrc1: "",
    imgSrc2: "./imgs/riverGood.jpg",
    textLeft: 'Você jogou o dado e tirou 4. Com esse resultado, vocês conseguem desviar da rocha a tempo, evitando um desastre iminente. O barco continua sua jornada pelo rio, agora mais consciente dos perigos que enfrentam.',
    textRight: '"Ufa, por pouco não colidimos com aquela rocha! Vamos manter a atenção, pessoal, ainda temos um longo caminho pela frente." Diz Clargoth, alertando o grupo.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.23
      }
    ]
  },
  {
    id: 13.222,
    imgSrc1: "",
    imgSrc2: "./imgs/riverFalls.jpg",
    textLeft: 'Você jogou o dado e tirou 2. Infelizmente, vocês não conseguem desviar a tempo e o barco colide com a rocha, lançando todos para a água. Com esforço, vocês conseguem sair do rio, mas estão molhados e cansados.',
    textRight: '"Parece que a sorte não está ao nosso lado desta vez... Mas não desanimem, a masmorra está próxima." Diz Clargoth, tentando manter o ânimo do grupo.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.23,
        setState: { fatigued: true }
      }
    ]
  },
  {
    id: 13.223,
    imgSrc1: "",
    imgSrc2: "./imgs/riverGood.jpg",
    textLeft: 'Você jogou o dado e tirou 6. Com esse resultado, vocês desviam habilmente da rocha, mantendo o controle sobre o barco. A aventura pelo rio continua sem contratempos, enquanto vocês se aproximam cada vez mais da entrada da masmorra.',
    textRight: '"Olhem ali! Parece que tem um desvio no rio que contorna as pedras. Vamos por ali, será mais seguro." Clargoth aponta para uma passagem estreita que se abre em um rio calmo e tranquilo.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.23
      }
    ]
  },
  {
    id: 13.23,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Após uma jornada cheia de desafios, vocês finalmente avistam a porta da masmorra. O local é sombrio e imponente, com sinais de antigos confrontos gravados em suas paredes de pedra.',
    textRight: 'Clargoth observa com um olhar sério e determinado. Ele se aproxima do grupo e diz: "Chegamos ao nosso destino final. Vamos desembarcar e nos preparar. Rápido! O artefato nos espera, eu posso ouvir o chamado dele."',
    options: [
      {
        text: 'Avançar',
        nextText: 14
      }
    ]
  },
  {
    id: 13.3, // Caminho do Deserto
    imgSrc1: "",
    imgSrc2: "./imgs/desert.jpg",
    textLeft: 'Decidindo seguir pelo caminho do deserto, vocês deixam a vegetação densa da floresta para trás e adentram um vasto e árido deserto. O sol escaldante brilha impiedosamente sobre a paisagem desolada, criando ilusões de água no horizonte distante.',
    textRight: 'Enquanto avançam pelas dunas de areia, vocês avistam uma série de ruínas antigas erguendo-se das areias douradas à frente. Parece haver uma passagem estreita entre as estruturas, mas é difícil de navegar.',
    options: [
      {
        text: 'Continuar com cautela',
        nextText: 13.31
      },
      {
        text: 'Parar e procurar por uma rota alternativa',
        nextText: 13.32
      }
    ]
  },
  {
    id: 13.32,
    imgSrc1: "",
    imgSrc2: "./imgs/desertAway.jpg",
    textLeft: 'Optando por procurar uma rota alternativa, vocês desviam do caminho principal e começam a explorar os arredores do deserto em busca de uma passagem mais segura.',
    textRight: 'Role o dado para determinar se vocês conseguem encontrar uma rota segura.',
    options: [
      {
        text: 'Rolar o dado',
        rollTheDice: [13.322, 13.321, 13.323],
      }
    ]
  },
  {
    id: 13.321,
    imgSrc1: "",
    imgSrc2: "./imgs/desert1.jpg",
    textLeft: 'Você jogou o dado e tirou 4. Com esse resultado, vocês descobrem um antigo caminho de caravanas que contorna as ruínas, oferecendo uma rota mais segura através do deserto.',
    textRight: '"Olhem ali! Parece que há uma trilha antiga que nos levará ao redor das ruínas. Vamos por ali, será mais seguro." Clargoth aponta para um caminho sinuoso que se abre entre as dunas de areia.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.33
      }
    ]
  },
  {
    id: 13.322,
    imgSrc1: "",
    imgSrc2: "./imgs/desert3.jpg",
    textLeft: 'Você jogou o dado e tirou 1. Infelizmente, a busca por uma rota alternativa não dá frutos e vocês acabam perdendo tempo. Em contra partida, as areias movediças do deserto começam a engolir suas pegadas, tornando a jornada ainda mais difícil.',
    textRight: 'Enquanto as provisões desaparecem nas areias traiçoeiras, vocês percebem que precisam retornar ao caminho principal ou correm o risco de se perderem no deserto. "Não podemos nos dar ao luxo de desperdiçar mais tempo aqui. Vamos voltar ao caminho principal antes que seja tarde demais." Diz Clargoth, preocupado.',
    options: [
      {
        text: 'Voltar',
        nextText: 13,
        setState: { skipDesert: true }
      }
    ]
  },
  {
    id: 13.323,
    imgSrc1: "",
    imgSrc2: "./imgs/desert1.jpg",
    textLeft: 'Você jogou o dado e tirou 6. Com esse resultado, vocês encontram uma rota alternativa que os leva além das ruínas, evitando o perigo iminente.',
    textRight: '"Uau, que sorte encontrarmos esse desvio tão seguro! Parece que estamos destinados a chegar à masmorra sem grandes obstáculos." Diz Clargoth, aliviado.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.33
      }
    ]
  },
  {
    id: 13.31,
    imgSrc1: "",
    imgSrc2: "./imgs/desert1.jpg",
    textLeft: 'Vocês avançam com cautela pelas ruínas, desviando dos destroços e dos perigos ocultos sob a areia. A cada passo, a sensação de que estão sendo observados cresce, alimentando a tensão entre o grupo.',
    textRight: 'Enquanto exploram as ruínas, vocês se deparam com uma passagem estreita entre as estruturas, que parece levar em direção ao coração do deserto. Parece ser a única opção viável para continuar a jornada.',
    options: [
      {
        text: 'Avançar',
        nextText: 13.33
      }
    ]
  },
  {
    id: 13.33, // luta
    imgSrc1: "./imgs/desert3.jpg",
    imgSrc2: "./imgs/desertMonster.jpg",
    textLeft: 'Após atravessarem a passagem com sucesso, vocês continuam a jornada pelo deserto, adentrando cada vez mais nas profundezas da vastidão árida. A atmosfera ao redor parece carregada de mistério e perigo, aumentando a tensão entre o grupo.',
    textRight: 'Quando menos esperam, um rugido ecoa pelas dunas de areia, seguido por um tremor no solo. Diante de vocês, emerge uma criatura colossal, com um corpo humanoide, sua aura pulsa uma magia antiga e uma fome primordial, diante de vocês, pronta para se saciar!',
    options: [
      {
        text: 'Avançar',
        nextText: 13.4
      }
    ]
  },
  {
    id: 13.4,
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'O monstro avança com fúria implacável, seus olhos brilhando com uma intensidade sobrenatural. Vocês se preparam para o confronto iminente, cada músculo tenso e alerta para o perigo iminente.',
    textRight: 'Agora é hora de decidir como enfrentar essa ameaça. Escolha sua ação com sabedoria:',
    options: [
      {
        text: 'Atacar',
        nextText: 13.5,
        setState: { hitDesertMonster: 1 }
      },
      {
        text: 'Defender',
        nextText: 13.6
      },
      {
        text: 'Recuar',
        nextText: 13.7
      }
    ]
  },
  {
    id: 13.5, // atk
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Você decide atacar, lançando-se contra o monstro com bravura e determinação. Seus golpes encontram seu alvo, causando dano significativo ao adversário, mas não sem sofrer ferimentos em troca.',
    textRight: 'O monstro retalha com suas garras afiadas, desferindo golpes poderosos contra você e seus companheiros. O confronto é intenso e implacável, cada lado lutando ferozmente pela supremacia. Você perde 10 pontos de vida',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 13.8
      }
    ]
  },
  {
    id: 13.6, // defende
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Você opta por adotar uma postura defensiva, preparando-se para resistir aos ataques do monstro. Sua estratégia mostra-se eficaz, permitindo-lhe mitigar parte do dano infligido pelo inimigo.',
    textRight: 'O monstro investe com ferocidade, mas sua defesa firme e calculada impede que a maioria dos golpes cause danos graves. Vocês conseguem manter-se firmes diante da investida do adversário.',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 13.8
      }
    ]
  },
  {
    id: 13.7, // recuar
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Você tenta recuar para uma posição mais segura, mas o monstro bloqueia seu caminho, determinado a não deixar nenhum de vocês escapar. Suas garras afiadas brilham perigosamente, prontas para desferir golpes mortais.',
    textRight: 'Antes que possam recuar, o monstro avança, atacando com fúria selvagem. Vocês são pegos desprevenidos, sofrendo ferimentos enquanto lutam para se defenderem. Você perde 10 pontos de vida',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 13.8
      }
    ]
  },
  {
    id: 13.8, // luta continua
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonster.jpg",
    textLeft: 'A batalha se intensifica, com ambos os lados trocando golpes brutais e investidas ousadas. Vocês lutam com todas as suas forças, determinados a derrotar o monstro e proteger uns aos outros.',
    textRight: 'Seu esforço conjunto começa a dar frutos, com o monstro mostrando sinais de fadiga após sofrer uma série de golpes poderosos. É hora de pressionar o ataque e acabar com essa ameaça de uma vez por todas.',
    options: [
      {
        text: 'Atacar',
        nextText: 13.81,
        requiredState: (currentState) => !currentState.hitDesertMonster,
        setState: { hitDesertMonster: 1 }
      },
      {
        text: 'Atacar',
        nextText: 13.81,
        requiredState: (currentState) => currentState.hitDesertMonster <= 2,
        setState: { hitDesertMonster: 2 }
      },
      {
        text: 'Defender',
        nextText: 13.82,
      }
    ]
  },
  {
    id: 13.81, // atk
    imgSrc1: "",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Você avança com coragem, concentrando seus ataques no monstro fatigado. Seus golpes encontram seu alvo com precisão, causando danos significativos ao adversário.',
    textRight: 'O monstro solta um rugido de dor, seu corpo cambaleando sob o impacto dos seus ataques. Vocês estão perto de derrotar a criatura, unidos pela coragem e pela determinação de enfrentar o perigo juntos. Você perde 5 pontos de vida',
    options: [
      {
        text: 'Dar o golpe final',
        nextText: 13.9,
        requiredState: (currentState) => currentState.hitDesertMonster >= 2,
        setState: { hitDesertMonster: false }
      },
      {
        text: 'Continuar atacando',
        nextText: 13.8,
        requiredState: (currentState) => currentState.hitDesertMonster < 2,
      }
    ]
  },
  {
    id: 13.82, // def
    imgSrc1: "./imgs/desertMonster.jpg",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Você decide adotar uma postura defensiva, preparando-se para resistir aos ataques do monstro. No entanto, ele aproveita a oportunidade para recuperar o fôlego.',
    textRight: 'O monstro então emite um rugido desafiador, sua ferocidade renovada pela pausa na batalha. Vocês precisam agir com rapidez e determinação para superar essa ameaça.',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 13.8
      }
    ]
  },
  {
    id: 13.9,
    imgSrc1: "./imgs/desertMonster.jpg",
    imgSrc2: "./imgs/desertMonsterBattle.jpg",
    textLeft: 'Com determinação renovada, vocês avançam com uma ferocidade renovada, concentrando seus ataques no monstro fatigado. Seus esforços conjuntos finalmente rendem frutos, e o monstro cai, derrotado, diante de vocês.',
    textRight: 'A criatura solta um rugido final, seu corpo desmoronando no chão da areia. Vocês triunfaram sobre o desafio, unidos pela coragem e pela determinação de enfrentar o perigo juntos.',
    options: [
      {
        text: 'Continuar',
        nextText: 13.91,
      }
    ]
  },
  {
    id: 13.91,
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Com o monstro derrotado, vocês recuperam o fôlego e avaliam os danos sofridos durante a batalha. Apesar dos ferimentos e da fadiga, vocês permanecem firmes e determinados a continuar a jornada.',
    textRight: 'Clargoth se aproxima do grupo, um sorriso de alívio no rosto. "Vocês foram incríveis! Juntos, somos capazes de superar qualquer desafio que a masmorra nos apresentar!". Você ganhou 30 pontos de experiência.',
    options: [
      {
        text: 'Avançar',
        nextText: 14
      }
    ]
  },
  {
    id: 14, // A MASMORRA!
    imgSrc1: "",
    imgSrc2: "./imgs/clargoth.png",
    textLeft: 'Ao se aproximarem ainda mais da entrada da masmorra, vocês sentem uma aura de mistério e perigo envolvendo o local. A entrada é escura e sinistra, com um ar de abandono e desolação que ecoa pelas paredes de pedra.',
    textRight: 'Clargoth olha para você e para os outros membros do grupo, com uma expressão séria e determinada, ele diz: "Chegamos ao nosso destino final. A masmorra onde o artefato mágico está guardado... Será que estamos prontos para enfrentar os desafios que nos aguardam lá dentro?"',
    options: [
      {
        text: 'Avançar',
        nextText: 14.1
      }
    ]
  },
  {
    id: 14.1,
    imgSrc1: "",
    imgSrc2: "./imgs/clargHappy.png",
    textLeft: 'Clargoth ri alto, empolgado pela iminente batalha. "HAHAHA! É claro que estamos! Vamos mostrar a esses monstros quem são as verdadeiras feras aqui!", ele exclama enquanto ergue seu machado com confiança.',
    textRight: 'Um calafrio percorre sua espinha enquanto você engole em seco. A escuridão da masmorra é palpável, apenas o som dos seus passos ecoando nas paredes de pedra... O grupo avança com cautela, prontos para enfrentar qualquer desafio.',
    options: [
      {
        text: 'Continuar',
        nextText: 14.2
      }
    ]
  },
  {
    id: 14.2,
    imgSrc1: "",
    imgSrc2: "./imgs/cavernTorch.jpg",
    textLeft: 'A luzes das tochas tremem, lançando sombras dançantes nas paredes úmidas da masmorra. Vocês avançam por corredores estreitos e câmaras escuras, sempre atentos a cada ruído.',
    textRight: 'De repente, vocês se deparam com uma bifurcação. À esquerda, um corredor estreito e sombrio. À direita, uma porta de madeira carcomida. Qual caminho vocês escolhem?',
    options: [
      {
        text: 'Seguir pela esquerda',
        nextText: 14.3,
        requiredState: (currentState) => !currentState.trollEncounter,
      },
      {
        text: 'Investigar a porta à direita',
        nextText: 14.4,
        requiredState: (currentState) => !currentState.skipMiniBoss,
      },
    ]
  },
  {
    id: 14.3, // esquerda
    imgSrc1: "./imgs/endlessCave.png",
    imgSrc2: "./imgs/altar.jpg",
    textLeft: 'O corredor estreito parece se estender infinitamente na escuridão. Vocês avançam com cautela, ouvindo apenas o som dos próprios passos e o eco distante de algo desconhecido.',
    textRight: 'Após alguns minutos de caminhada, vocês se deparam com uma sala iluminada por uma fraca luz azul. No centro, um altar antigo parece ser o foco da luminosidade. O que vocês fazem?',
    options: [
      {
        text: 'Investigar o altar',
        nextText: 14.5
      },
      {
        text: 'Continuar explorando o corredor',
        nextText: 14.6
      }
    ]
  },
  {
    id: 14.4, // direita
    imgSrc1: "./imgs/cavePool.png",
    imgSrc2: "./imgs/miniBossCalm.png",
    textLeft: "A porta range quando é aberta, uma atmosfera sinistra os envolve. O ambiente é úmido, com um grande lago refletindo a luz fraca que entra pelo teto, estalactites e estalagmites pontuam do teto ao chão. Uma sensação de presságio paira no ar, como se algo estivesse à espreita nas profundezas sombrias.",
    textRight: 'De repente, de uma das águas escuras, surge um monstro aquático do submundo. Sua forma é uma mescla de sapo e lagarto, com grandes olhos verdes que parecem perfurar sua alma... Ao perceber a presença de seu grupo, o monstro emite um rugido de guerra que ecoa pelas paredes da sala, fechando todas as possíveis saídas.',
    options: [
      {
        text: 'Lutar contra a criatura',
        nextText: 14.7
      },
      {
        text: 'Fugir pela porta',
        rollTheDice: [14.8, 14.8, 14.81]
      }
    ]
  },
  {
    id: 14.7,
    imgSrc1: "./imgs/miniBossCalm.png",
    imgSrc2: "./imgs/miniBoss.png",
    textLeft: 'Com coragem, vocês decidem enfrentar a criatura monstruosa que emerge das profundezas do lago. Armas são sacadas, livros mágicos são abertos, e o grupo se prepara para a batalha. Clargoth diz: "Vamos mostrar a esse monstro o por quê de estarmos aqui!"',
    textRight: "O monstro começa a se contorcer e se transformar diante de vocês. Espinhos e cabelos verdes irrompem de sua pele, enquanto seus olhos adquirem uma tonalidade psicótica, seus dentes continuam crescendo de tamanho, tornando-se uma ameaça ainda maior.",
    options: [
      {
        text: 'Continuar',
        nextText: 14.71
      }
    ]
  },
  {
    id: 14.71,
    imgSrc1: "./imgs/miniBoss.png",
    imgSrc2: "./imgs/miniBossAtk.png",
    textLeft: "A transformação da criatura continua enquanto ela assume uma forma cada vez mais grotesca. Seu corpo se alonga e se torce, adquirindo uma forma de serpente, enquanto sua pele cria escamas brilhantes e roxas, cobrindo-a em uma armadura natural.",
    textRight: "Um cristal de poder emerge de sua testa, liberando grandes chifres que se erguem em direção ao teto da caverna. Seu olho verde é tomado por um brilho amarelo sinistro, que parece extinguir qualquer vestígio de humanidade que ainda possa restar na criatura. Pronta para atacar, ela parte para cima de vocês!",
    options: [
      {
        text: 'Atacar com tudo',
        nextText: 14.72,
        requiredState: (currentState) => !currentState.hitMiniBoss,
        setState: { hitMiniBoss: 1 }
      },
      {
        text: 'Defender-se',
        nextText: 14.73,
      }
    ]
  },
  {
    id: 14.72, // atacar com tudo - apanha 15
    imgSrc1: "",
    imgSrc2: "./imgs/miniBossAtk.png",
    textLeft: "Sem hesitar, vocês atacam a criatura com toda a força que têm. No entanto, antes que possam causar qualquer dano significativo, a criatura desvia com tudo, pegando-os de surpresa. Vocês mal conseguem se defender enquanto ela desfere golpes devastadores, causando uma perda significativa de 15 pontos de vida.",
    textRight: 'Clargoth grita para o grupo: "Rápido, nos defendam! Não podemos deixar que ela nos pegue desprevenidos novamente!"',
    options: [
      {
        text: 'Atacar novamente',
        nextText: 14.74,
        requiredState: (currentState) => currentState.hitMiniBoss === 1,
        setState: { hitMiniBoss: 2 }
      },
      {
        text: 'Defender-se',
        nextText: 14.73,
      },
      {
        text: 'Gastar um turno para carregar uma magia em grupo',
        nextText: 14.75,
        requiredState: (currentState) => !currentState.magicCharged,
        setState: { magicCharged: true }
      }
    ]
  },
  {
    id: 14.73, // defender-se apanha 5
    imgSrc1: "./imgs/miniBossAtk.png",
    imgSrc2: "",
    textLeft: "Agindo rápido, vocês conseguem minimizar o dano sofrido durante o ataque da criatura. Embora ainda sintam o impacto dos golpes, conseguem evitar os piores danos, sofrendo apenas uma perda de 5 pontos de vida.",
    textRight: 'Clargoth sorri para o grupo e diz: "Bom trabalho, pessoal! Agora é nossa chance de contra-atacar e derrotar essa criatura de uma vez por todas!"',
    options: [
      {
        text: 'Atacar',
        nextText: 14.74,
        requiredState: (currentState) => !currentState.hitMiniBoss,
        setState: { hitMiniBoss: 1 }
      },
      {
        text: 'Atacar',
        nextText: 14.74,
        requiredState: (currentState) => currentState.hitMiniBoss === 1,
        setState: { hitMiniBoss: 2 }
      },
      {
        text: 'Defender-se novamente',
        nextText: 14.73,
      },
      {
        text: 'Gastar um turno para carregar uma magia em grupo',
        nextText: 14.75,
        requiredState: (currentState) => !currentState.magicCharged,
        setState: { magicCharged: true }
      }
    ]
  },
  {
    id: 14.74, // atacar normal, apanha 10
    imgSrc1: "",
    imgSrc2: "./imgs/miniBossAtk.png",
    textLeft: "Apesar dos golpes recebidos, vocês mantêm sua determinação e continuam a lutar contra a criatura. Golpes e feitiços são trocados, enquanto a batalha se intensifica. No entanto, a criatura é rápida e feroz, desferindo golpes poderosos contra vocês.",
    textRight: 'Clargoth grita para o grupo: "Vamos mostrar a ela do que somos capazes! Não desistam agora!" Ambos os lados estão feridos, você sofre uma perda de 10 pontos de vida.',
    options: [
      {
        text: 'Dar o golpe final',
        nextText: 14.77,
        requiredState: (currentState) => currentState.hitMiniBoss === 2,
        setState: { hitMiniBoss: false }
      },
      {
        text: 'Tentar atacar novamente',
        nextText: 14.74,
        requiredState: (currentState) => currentState.hitMiniBoss === 1,
        setState: { hitMiniBoss: 2 }
      },
      {
        text: 'Defender-se',
        nextText: 14.73
      },
      {
        text: 'Finalizar a criatura',
        nextText: 14.755,
        requiredState: (currentState) => currentState.hitMiniBoss >= 1 && currentState.magicCharged,
        setState: { magicCharged: false, hitMiniBoss: false }
      },
      {
        text: 'Utilizar a magia em grupo',
        nextText: 14.76,
        requiredState: (currentState) => currentState.magicCharged,
        setState: { magicCharged: false, hitMiniBoss: 2 }
      },
      {
        text: 'Gastar um turno para carregar uma magia em grupo',
        nextText: 14.75,
        requiredState: (currentState) => !currentState.magicCharged,
        setState: { magicCharged: true }
      }
    ]
  },
  {
    id: 14.75, // magia em grupo
    imgSrc1: "",
    imgSrc2: "./imgs/miniBossAtk.png",
    textLeft: "Vocês se concentram e canalizam sua energia mágica, preparando um feitiço poderoso para lançar contra a criatura. A magia brilha intensamente, envolvendo o grupo em uma aura de poder e proteção.",
    textRight: 'A criatura recua momentaneamente, surpresa pela intensidade da magia que vocês conjuraram. É hora de aproveitar a vantagem e pressionar o ataque contra o monstro.',
    options: [
      {
        text: 'Finalizar a criatura',
        nextText: 14.755,
        requiredState: (currentState) => currentState.hitMiniBoss >= 1 && currentState.magicCharged,
        setState: { magicCharged: false, hitMiniBoss: false }
      },
      {
        text: 'Utilizar a magia em grupo',
        nextText: 14.76,
        requiredState: (currentState) => currentState.magicCharged,
        setState: { magicCharged: false, hitMiniBoss: 2 }
      },
      {
        text: 'Atacar',
        nextText: 14.74,
        requiredState: (currentState) => currentState.hitMiniBoss === 1,
        setState: { hitMiniBoss: 2 }
      },
      {
        text: 'Dar o golpe final',
        nextText: 14.77,
        requiredState: (currentState) => currentState.hitMiniBoss === 2,
        setState: { hitMiniBoss: false }
      },
      {
        text: 'Defender-se',
        nextText: 14.73
      }
    ]
  },
  {
    id: 14.76, // magia em grupo sem bater na criatura antes
    imgSrc1: "",
    imgSrc2: "./imgs/miniBossAtk.png",
    textLeft: "",
    textRight: '',
    options: [
      {
        text: 'Dar o golpe final',
        nextText: 14.77,
        requiredState: (currentState) => currentState.hitMiniBoss === 2,
        setState: { hitMiniBoss: false }
      },
      {
        text: 'Defender-se',
        nextText: 14.73
      }
    ]
  },
  {
    id: 14.755, // finalizar a criatura ferida com sua magia em grupo
    imgSrc1: "./imgs/miniBossAtk.png",
    imgSrc2: "./imgs/cavePool.png",
    textLeft: "Com um golpe certeiro e o poder da magia conjurada em grupo, vocês conseguem atingir o ponto fraco da criatura, o cristal em sua cabeça. O cristal se parte em estilhaços, fazendo com que a criatura comece a se contorcer e agonizar de dor.",
    textRight: "Arrastando-se em direção à lagoa, a criatura desaparece nas águas escuras. Logo em seguida uma luz branca intensa emana da superfície do lago, envolvendo a criatura. Quando a luz se dissipa, ela começa a recuperar sua forma original",
    options: [
      {
        text: 'Prosseguir',
        nextText: 14.78,
        setState: { HpPotion: 1 },
        getPotion: true
      }
    ]
  },
  {
    id: 14.77,
    imgSrc1: "./imgs/miniBossAtk.png",
    imgSrc2: "./imgs/cavePool.png",
    textLeft: "Com uma série de golpes precisos, vocês conseguem atacar o ponto fraco da criatura, o cristal em sua cabeça. Com um esforço conjunto, o cristal se parte em estilhaços, fazendo com que a criatura comece a se contorcer e agonizar de dor.",
    textRight: "Arrastando-se em direção à lagoa, a criatura desaparece nas águas escuras. Logo em seguida uma luz branca intensa emana da superfície do lago, envolvendo a criatura. Quando a luz se dissipa, ela começa a recuperar sua forma original.",
    options: [
      {
        text: 'Prosseguir',
        nextText: 14.78,
        setState: { HpPotion: 1 },
        getPotion: true
      }
    ]
  },
  {
    id: 14.78,
    imgSrc1: "",
    imgSrc2: "./imgs/miniBossCalm.png",
    textLeft: "A criatura, agora em sua forma original, emerge das águas do lago. Seus olhos verdes brilham com gratidão e alívio, enquanto ela caminha em direção ao grupo com cautela, ela se ajoelha diante de vocês, agradecendo por terem libertado sua alma da corrupção do cristal. ",
    textRight: "Ela se aproxima ainda mais do grupo, e os recompensa com uma poção de cura e 50 pontos de experiência.",
    options: [
      {
        text: 'Agradecer e continuar',
        nextText: 14.9,
      }
    ]
  },
  {
    id: 14.8,
    imgSrc1: "./imgs/miniBossCalm.png",
    imgSrc2: "./imgs/miniBoss.png",
    textLeft: "Percebendo que a batalha seria uma luta desesperada pela sobrevivência, vocês optam por buscar uma rota de fuga. Correm desesperadamente em direção à porta pela qual entraram, esperando encontrar uma saída para a ameaça que os persegue. No entanto, para a frustração do grupo, a porta continua trancada e não cede aos seus esforços.",
    textRight: "Enquanto vocês tentam desesperadamente abrir a porta trancada, a criatura monstruosa continua sua transformação, espinhos e cabelos verdes irrompem de sua pele, enquanto seus olhos adquirem uma tonalidade psicótica. A esperança de uma fuga fácil desaparece rapidamente, e vocês percebem que não terão escolha senão enfrentar a criatura de frente.",
    options: [
      {
        text: 'Continuar',
        nextText: 14.71
      }
    ]
  },
  {
    id: 14.81,
    imgSrc1: "./imgs/cavePool.png",
    imgSrc2: "./imgs/miniBossCalm.png",
    textLeft: "Desesperados para encontrar uma saída, vocês correm em direção à porta na esperança de escapar da criatura monstruosa que os persegue. Para a surpresa e alívio do grupo, a porta está destrancada e se abre facilmente, permitindo que vocês escapem a tempo.",
    textRight: "Enquanto vocês fogem pela porta, a criatura continua atrás de vocês. Vocês podem sentir a presença sinistra da criatura se fortalecendo enquanto se afastam, mas pelo menos conseguiram evitar um confronto imediato.",
    options: [
      {
        text: 'Retornar e enfrentar a criatura',
        nextText: 14.7
      },
      {
        text: 'Voltar e tentar pegar outra rota',
        nextText: 14.2,
        setState: { skipMiniBoss: true }
      },
      {
        text: 'Continuar explorando em frente',
        nextText: 14.9
      }
    ]
  },
  {
    id: 14.5, // esquerda Investigar o altar
    imgSrc1: "",
    imgSrc2: "./imgs/altar.jpg",
    textLeft: 'Ao se aproximar do altar, você sente uma energia antiga e poderosa emanando dele. No entanto, antes que possam investigar mais a fundo, o chão começa a tremer e as paredes da sala começam a se fechar!',
    textRight: 'Com pouco tempo para reagir, vocês precisam correr em direção à saída, na tentativa de escapar antes que a sala se feche completamente. Será que a sorte está ao seu lado?',
    options: [
      {
        text: 'Rolar o dado',
        rollTheDice: [14.51, 14.51, 14.52]
      }
    ]
  },
  {
    id: 14.51, // tentativa de escapar do altar
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou 1. Com esse resultado, você não consegue escapar a tempo e as paredes se fecham, prendendo vocês na sala. A escuridão envolve vocês, e o ar começa a ficar escasso...',
    textRight: 'Por alguma sorte ou benção do acaso, parece que ninguém está ferido, há apenas pedras e mais pedras bloqueando as saídas... E agora? O que vocês fazem?',
    options: [
      {
        text: 'Forçar uma saída',
        rollTheDice: [14.511, 14.511, 14.512]
      },
      {
        text: 'Gritar por socorro',
        nextText: 14.53
      }
    ]
  },
  {
    id: 14.511, // tentativa de forçar a saída com falha
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você tenta mover as pedras que bloqueiam a saída, mas elas são pesadas e resistentes. Apesar dos seus esforços, você não consegue abrir caminho para fora da sala.',
    textRight: 'A situação parece cada vez mais desesperadora, com o ar ficando mais rarefeito e a escuridão se fechando ao seu redor...',
    options: [
      {
        text: 'Gritar por socorro',
        nextText: 14.53
      }
    ]
  },
  {
    id: 14.512, // tentativa de forçar a saída com sucesso
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Vocês se concentram e canalizam todas as suas forças e determinação para mover as pedras que bloqueiam a saída. Com um esforço hercúleo, um pequeno espaço se abre, por onde vocês podem escapar.',
    textRight: 'Com a respiração ofegante e os músculos doloridos, vocês emergem da sala e continuam sua jornada pela masmorra, prontos para enfrentar o que quer que venha a seguir.',
    options: [
      {
        text: 'Continuar explorando a masmorra',
        nextText: 14.6,
        setState: { fatigued: true }
      }
    ]
  },
  {
    id: 14.52, // tentativa de escapar da trap do altar com sucesso
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você jogou o dado e tirou 4. Com esse resultado, vocês conseguem escapar a tempo, correndo pela passagem estreita antes que as paredes se fechem completamente.',
    textRight: 'Com a respiração ofegante, vocês emergem da sala e continuam sua jornada pela masmorra, prontos para enfrentar o que quer que venha a seguir.',
    options: [
      {
        text: 'Continuar explorando a masmorra',
        nextText: 14.6
      }
    ]
  },
  {
    id: 14.53, // gritar por socorro
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Vocês gritam por socorro, na esperança de que alguém ouça e venha em seu auxílio. No entanto, o som ecoa pelas paredes de pedra, sem resposta.',
    textRight: 'A situação parece cada vez mais desesperadora, com o ar ficando mais rarefeito e a escuridão se fechando ao seu redor...',
    options: [
      {
        text: 'Continuar gritando',
        nextText: 14.54
      }
    ]
  },
  {
    id: 14.54, // troll da montanha
    imgSrc1: "",
    imgSrc2: "./imgs/mountain-troll.png",
    textLeft: 'Vocês continuam gritando por socorro, quando de repente, uma voz responde de volta. "Quem está aí? O que aconteceu?"',
    textRight: 'Um troll da montanha surge das sombras, olhando para vocês com curiosidade. "Vocês estão presos? Eu posso ajudar, mas em troca, quero algo em retribuição..."',
    options: [
      {
        text: 'Oferecer uma garrafa de hidromel',
        nextText: 14.541,
        requiredState: (currentState) => currentState.mead === 1,
        setState: { mead: false },
      },
      {
        text: 'Negociar com o troll',
        rollTheDice: [14.55, 14.55, 14.551]
      }
    ]
  },
  {
    id: 14.541, // oferecer hidromel ao troll
    imgSrc1: "",
    imgSrc2: "",
    textLeft: 'Você entrega sua garrafa de hidromel ao troll, que a aceita com um sorriso de satisfação. "Obrigado, a bebida é boa! Agora, eu posso ajudá-los a sair daqui."',
    textRight: 'O troll empurra as pedras que bloqueiam a saída com facilidade, abrindo um caminho para fora da sala. Logo após ele bebe toda a garrafa e sai andando, deixando vocês sozinhos na masmorra.',
    options: [
      {
        text: 'Continuar',
        nextText: 14.6
      }
    ]
  },
  {
    id: 14.551, // negociar com o troll com exito, leva para 14.6
    imgSrc1: "",
    imgSrc2: "./imgs/mountain-troll.png",
    textLeft: 'Vocês tentam negociar com o troll, oferecendo o que podem em troca de sua ajuda. O troll parece interessado na oferta e aceita ajudá-los a sair da sala.',
    textRight: 'Com um sorriso amigável, o troll empurra as pedras que bloqueiam a saída, abrindo um caminho para fora da sala. Ele se despede de vocês e sai andando, deixando vocês sozinhos na masmorra.',
    options: [
      {
        text: 'Continuar explorando a masmorra',
        nextText: 14.6
      }
    ]
  },
  {
    id: 14.55, // negociar com o troll, não há nada que ele quer, ele lança uma magia que os expele de volta ao início da masmorra
    imgSrc1: "",
    imgSrc2: "./imgs/mountain-troll.png",
    textLeft: 'Vocês tentam negociar com o troll, oferecendo o que podem em troca de sua ajuda. No entanto, o troll não parece interessado em nada que vocês têm a oferecer.',
    textRight: 'Com um sorriso malicioso, o troll lança uma magia que os expele de volta ao início da masmorra, deixando vocês desorientados e confusos.',
    options: [
      {
        text: 'Tentar enfrentar a masmorra novamente',
        nextText: 14,
        setState: { trollEncounter: true }
      }
    ]
  },
  {
    id: 14.6, // esquerda Continuar explorando o corredor
    imgSrc1: "./imgs/endlessCave.png",
    imgSrc2: "./imgs/rockDoor.jpg",
    textLeft: 'O corredor continua se estendendo, levando vocês a uma série de câmaras escuras e sinistras. Porém, após uma longa caminhada, vocês se encontram diante de uma porta de ferro maciço.',
    textRight: 'Ela não parece estar trancada, diz Clargoth. Vocês conseguem abrir a porta, revelando um vasto salão com pilares de pedra e novamente um altar no centro. Mas dessa vez, parece ser um altar diferente... Antes que possam avançar, uma voz feminina ecoa pelo salão, chamando-os para o centro...',
    options: [
      {
        text: 'Seguir a voz',
        nextText: 14.11
      },
      {
        text: 'Ignorar a voz e avançar para o altar',
        nextText: 14.12
      }
    ]
  },
  {
    id: 14.11, // desafio do altar com a voz
    imgSrc1: "",
    imgSrc2: "./imgs/orc-female.png",
    textLeft: 'Encantados pela profundez de sua voz, vocês caminham em direção ao centro da sala, no entanto, à medida que se aproximam, uma sombra se materializa diante de vocês, assumindo a forma do seu maior desejo.',
    textRight: 'Para Clargoth, a sombra se transforma em uma orc guerreira sedutora, prometendo-lhe poder e glória em troca de sua lealdade. O que vocês fazem?',
    options: [
      {
        text: 'Tentar seduzir a sombra para obter informações',
        rollTheDice: [14.112, 14.112, 14.113]
      }
    ]
  },
  {
    id: 14.112, // Tentar seduzir a sombra
    imgSrc1: "",
    imgSrc2: "./imgs/orc-female.png",
    textLeft: 'Você tenta seduzir a sombra, oferecendo-lhe palavras doces e promessas de lealdade. No entanto, a sombra parece desconfiada e não é facilmente persuadida.',
    textRight: 'Apesar de seus esforços, a sombra se mantém firme em suas exigências. Parece que vocês terão que recorrer a outras estratégias para obter o que desejam.',
    options: [
      {
        text: 'Lutar contra a sombra',
        nextText: 14.1121
      },
      {
        text: 'Tentar negociar novamente',
        rollTheDice: [14.1122, 14.1123, 14.1123]
      }
    ]
  },
  {
    id: 14.1122, // Tentar negociar novamente com sucesso
    imgSrc1: "",
    imgSrc2: "./imgs/orc-female.png",
    textLeft: 'Decidindo tentar uma abordagem mais diplomática, vocês negociam novamente com a sombra, oferecendo-lhe algo que ela deseja em troca de informações ou passagem segura.',
    textRight: 'Desta vez, a sombra parece mais receptiva e concorda com suas condições. Ela apenas lhes dá permissão para prosseguir.',
    options: [
      {
        text: 'Continuar',
        nextText: 14.9
      }
    ]
  },
  {
    id: 14.1123, // Tentar negociar novamente sem sucesso
    imgSrc1: "",
    imgSrc2: "./imgs/orc-female.png",
    textLeft: 'Apesar de seus esforços, a sombra ainda parece hesitante em ceder. Parece que vocês terão que encontrar outra maneira de convencê-la.',
    textRight: 'Talvez seja hora de considerar outras opções ou buscar ajuda em outro lugar.',
    options: [
      {
        text: 'Lutar contra a sombra',
        nextText: 14.1121
      },
      {
        text: 'Dar a volta e ignorá-la',
        nextText: 14.9
      }
    ]
  },
  {
    id: 14.12, // desafio do altar ignorando a voz
    imgSrc1: "",
    imgSrc2: "./imgs/dark-magit-goblin.png",
    textLeft: 'Ignorando a voz feminina, vocês avançam para o altar, determinados a alcançar seu objetivo. No entanto, à medida que se aproximam, uma sombra se materializa diante de vocês.',
    textRight: 'A sombra se transforma em um mago sombrio, oferecendo-lhe riquezas e tesouros inimagináveis em troca de sua lealdade. O que vocês fazem?',
    options: [
      {
        text: 'Tentar enganar a sombra para obter informações',
        rollTheDice: [14.121, 14.121, 14.122]
      }
    ]
  },
  {
    id: 14.121, // Tentar enganar a sombra
    imgSrc1: "",
    imgSrc2: "./imgs/dark-magit-goblin.png",
    textLeft: 'Você tenta enganar a sombra, fazendo-lhe falsas promessas e mentindo sobre suas intenções. No entanto, a sombra parece perceber sua tentativa de manipulação e fica ainda mais desconfiada.',
    textRight: 'Parece que suas palavras não convenceram a sombra. Vocês precisarão tentar outra abordagem para obter o que desejam.',
    options: [
      {
        text: 'Lutar contra a sombra',
        nextText: 14.1121
      },
      {
        text: 'Tentar negociar novamente',
        rollTheDice: [14.1212, 14.1212, 14.1213]
      }
    ]
  },
  {
    id: 14.1212, // Tentar negociar novamente com sucesso
    imgSrc1: "",
    imgSrc2: "./imgs/dark-magit-goblin.png",
    textLeft: 'Decidindo adotar uma abordagem mais diplomática, vocês tentam negociar novamente com a sombra, oferecendo-lhe algo que ela deseja em troca de informações ou passagem segura.',
    textRight: 'Desta vez, a sombra parece mais receptiva e concorda com suas condições. Ela lhes dá apenas a permissão para prosseguir.',
    options: [
      {
        text: 'Continuar',
        nextText: 14.9
      }
    ]
  },
  {
    id: 14.1213, // Tentar negociar novamente sem sucesso
    imgSrc1: "",
    imgSrc2: "./imgs/dark-magit-goblin.png",
    textLeft: 'Apesar de seus esforços, a sombra ainda parece hesitante em ceder. Parece que vocês terão que encontrar outra maneira de convencê-la.',
    textRight: 'Talvez seja hora de considerar outras opções ou buscar ajuda em outro lugar.',
    options: [
      {
        text: 'Lutar contra a sombra',
        nextText: 14.1121
      },
      {
        text: 'Dar a volta e ignorá-la',
        nextText: 14.9
      }
    ]
  },
  {
    id: 14.1121, // Lutar contra a sombra
    imgSrc1: "./imgs/shadow.jpg",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'A sombra percebe a sede de sangue em seus olhos, sua intenção de lutar, e rapidamente se afasta, receitando com uma voz baixa e grave, ela começa a absorver a energia mágica ao seu redor. Em um piscar de olhos, a sombra se transforma em uma fera endemoniada, com uma forma distorcida ela irradia uma aura sinistra.',
    textRight: 'Vocẽs precisam agir rápido, a fera se aproxima com garras afiadas e seus olhos brilhando com uma luz sombria. O que vocês fazem?',
    options: [
      {
        text: 'Atacar a sombra',
        rollTheDice: [14.1612, 14.161, 14.161]
      },
      {
        text: 'Recuar e preparar uma estratégia',
        nextText: 14.162
      }
    ]
  },
  {
    id: 14.161, // Atacar a sombra
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'Vocês decidem em não hesitar diante da ameaça e avançar para o ataque. Com as armas na mão, você e seus companheiros investem contra a fera endemoniada, determinados a derrotá-la e proteger uns aos outros.',
    textRight: 'A fera, por sua vez, responde com ferocidade, suas garras afiadas desferindo golpes poderosos contra vocês. A batalha é feroz e intensa, com cada lado lutando com todas as suas forças pela supremacia. Você perde 10 pontos de vida',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 14.163,
        setState: { hitShadowMonster: 1 }
      }
    ]
  },
  {
    id: 14.1612, // Atacar a sombra e ela desvia
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'Vocês decidem não hesitar diante da ameaça e avançar para o ataque. Cada membro do grupo empunha suas armas com determinação, prontos para enfrentar a fera endemoniada. Entretanto, no calor da batalha, um dos membros do grupo se atrapalha, perdendo momentaneamente o equilíbrio e desviando seu golpe. A fera, aproveitando-se dessa brecha, se esquiva habilmente do ataque, demonstrando uma agilidade surpreendente.',
    textRight: 'A batalha continua, mas agora vocês precisam redobrar a atenção e a coordenação para enfrentar a fera, pois ela mostrou que não será uma oponente fácil de derrotar.',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 14.163,
      }
    ]
  },
  {
    id: 14.162, // Recuar e preparar uma estratégia
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'Vocês decidem que é melhor recuar e preparar uma estratégia para lidar com a fera endemoniada. Vocês se afastam lentamente, mantendo os olhos fixos na sombra enquanto conseguem discutir um plano de ação.',
    textRight: 'Enquanto recuam, a fera endemoniada avança com uma fúria implacável, determinada a não deixar nenhum de vocês escapar, suas garras afiadas acertam alguns de seus companheiros, graças ao movimento rápido, ninguém é ferido gravemente. Você perde 5 pontos de vida',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 14.163,
        setState: { strategy: true }
      }
    ]
  },
  {
    id: 14.163,
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'A batalha contra a fera endemoniada continua, com ambos os lados trocando golpes brutais e investidas ousadas. Vocês lutam com todas as suas forças.',
    textRight: 'Seu esforço conjunto começa a dar frutos, com a fera mostrando sinais de fadiga após sofrer uma série de golpes poderosos. É hora de pressionar o ataque e acabar com essa ameaça de uma vez por todas.',
    options: [
      {
        text: 'Atacar',
        nextText: 14.164,
        requiredState: (currentState) => !currentState.hitShadowMonster,
        setState: { hitShadowMonster: 1 }
      },
      {
        text: 'Atacar novamente',
        nextText: 14.166,
        requiredState: (currentState) => currentState.hitShadowMonster <= 1,
        setState: { hitShadowMonster: false }
      },
      {
        text: 'Usar a estratégia preparada',
        nextText: 14.165,
        requiredState: (currentState) => currentState.strategy,
        setState: { strategy: false }
      }
    ]
  },
  {
    id: 14.164, // Fera contra-ataca
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'Você e seus companheiros continuam a investir contra a fera endemoniada, determinados a derrotá-la de uma vez por todas. No entanto, em um movimento surpreendente, a fera contra-ataca com uma investida poderosa, desferindo golpes devastadores contra vocês.',
    textRight: 'O golpe da fera é rápido e brutal, pegando vocês desprevenidos. Você perde 10 pontos de vida. Agora você está em uma encruzilhada, o que você faz?',
    options: [
      {
        text: 'Continuar lutando',
        nextText: 14.163,
      },
      {
        text: 'Recuar e preparar uma estratégia',
        nextText: 14.162,
        requiredState: (currentState) => !currentState.strategy
      }
    ]
  },
  {
    id: 14.165, // Usar a estratégia preparada
    imgSrc1: "",
    imgSrc2: "./imgs/shadowMonster.jpg",
    textLeft: 'Lembrando da estratégia preparada anteriormente, você e seus companheiros começam a executar o plano com precisão e coordenação. Cada movimento é calculado, visando explorar as fraquezas da fera e maximizar os pontos fortes do grupo.',
    textRight: 'A fera se vê encurralada pela astúcia e determinação do grupo, incapaz de lidar com a estratégia elaborada contra ela. Com cada movimento calculado, vocês ganham vantagem na batalha, aproximando-se cada vez mais da vitória.',
    options: [
      {
        text: 'Continuar a execução da estratégia',
        nextText: 14.166,
      }
    ]
  },
  {
    id: 14.166,
    imgSrc1: "",
    imgSrc2: "./imgs/shadow.jpg",
    textLeft: 'Com uma última investida, você e seus companheiros conseguem enfraquecer a sombra o suficiente para derrubá-la. Sua forma endemoniada treme e se desfaz lentamente, a magia que a compõe se dissipa pelo ar, ela grita de dor enquanto seus olhos perdem o brilho sombrio e suas garras se enfraquecem...',
    textRight: 'Em poucos momentos, ela se transforma em uma silhueta espectral que se dissolve nas sombras da masmorra. O perigo foi eliminado, mas a presença das sombras permanece perto de você. Você ganhou 20 pontos de experiência pela vitória.',
    options: [
      {
        text: 'Avançar',
        nextText: 14.9,
        setState: { shadowBless: true }
      }
    ]
  },
  {
    id: 14.9, // Final de todos os caminhos
    imgSrc1: "",
    imgSrc2: "./imgs/tarasconaDoor.png",
    textLeft: 'Enquanto avançam mais ainda pelas sombras da masmorra, vocês sentem a adrenalina pulsar em suas veias. Cada passo traz a promessa de novas descobertas e desafios. Clargoth, com olhos brilhantes de excitação, exclama: "Estamos cada vez mais perto da Tarascona! A batalha promete ser épica, meus amigos!"',
    textRight: 'Ao chegar à entrada da lendária Tarascona, a porta maciça se destaca diante de vocês. Antes mesmo que possam reagir, um rugido ensurdecedor ecoa dos recessos do corredor e a própria Tarascona emerge das sombras, pronta para atacar pra cima de vocês com fúria!',
    options: [
      {
        text: 'Iniciar a batalha contra Tarascona',
        nextText: 15
      },
      {
        text: 'Usar a poção de cura',
        useHPPotion: true,
        nextText: 15,
        requiredState: (currentState) => currentState.HpPotion >= 1,
        setState: { HpPotion: false }
      }
    ]
  },
  {
    id: 15, // Batalha final
    imgSrc1: "",
    imgSrc2: "./imgs/tarasqueStand.jpg",
    textLeft: 'A batalha final contra Tarascona está prestes a começar. O destino de vocês e do artefato mágico depende do resultado deste confronto épico.',
    textRight: 'Preparem-se para a batalha final e enfrentem o dragão tartaruga com coragem e determinação. O destino do reino está em suas mãos!',
    options: [
      {
        text: 'Este caminho ainda está em construção',
        nextText: 15.1,
      }
    ]
  },
  {
    id: 15.1,
    imgSrc1: "",
    imgSrc2: "./imgs/tarasque.jpg",
    textLeft: 'Parabéns e obrigado por ter jogado até aqui, no momento esta batalha ainda não está pronta, ela está em construção para ser uma batalha final épica. Espero que tenha gostado da aventura e que tenha se divertido. Até breve!',
    textRight: 'O jogo utiliza um armazenamento temporário para salvar o progresso, então você pode continuar de onde parou na próxima vez que jogar. Se tiver alguma sugestão ou feedback, por favor, me avise. Obrigado!',
    options: [
      {
        text: 'Em breve',
      }
    ]
  },
  {
    id: 12, // sem Clargoth
    imgSrc1: "./imgs/bard.png",
    imgSrc2: "",
    textLeft: 'As horas passam... Os exploradores beberam mais do que deveriam. Garrick, o bardo, cantava canções antigas em voz alta, enquanto Clargoth, batia em sua mesa com a caneca, rindo das piadas sujas que seus outros parceiros contavam.',
    textRight: 'Você acabou bebendo mais do que aguentava. A última coisa de que se lembra é de ter acabado de tomar um grande gole de hidromel e depois tudo ficou escuro.',
    options: [
      {
        text: 'Este caminho ainda está em construção',
        requiredState: (currentState) => currentState.skipClargoth,
      }
    ]
  }
];

loadGameState()
