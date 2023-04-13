const myModule = (() => {
  "use strict";

  // Creamos el maso de cartas
  let deck = [];
  const types = ["C", "D", "H", "S"],
        especials = ["A", "J", "Q", "K"];

  // Variables para los puntos de los jugadores
  let pointsPlayers = [];

  /*Referencias del html*/
  // Botones
  const btnNuevo = document.querySelector("#btnNuevo"),
        btnPedir = document.querySelector("#btnPedir"),
        btnDetener = document.querySelector("#btnDetener");
        
        // variables para almacenar las cartas
  const divCardsPlayers = document.querySelectorAll('.divCartas'),
        pointsHtml = document.querySelectorAll("small");


  // LLamamos la funcion para crear deck
  const initGame = (numPlayers = 2) => {
    deck = makeDeck();

    pointsPlayers = [];
    for(let i = 0; i< numPlayers; i++){
      pointsPlayers.push(0);
    }

    pointsHtml.forEach(elem => elem.innerText = 0);
    divCardsPlayers.forEach(elem => elem.innerHTML ='');

    btnPedir.disabled = false;
    btnDetener.disabled = false;

  };


  // Crea una baraja completa
  const makeDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }
    for (let type of types) {
      for (let esp of especials) {
        deck.push(esp + type);
      }
    }
    shuffleDeck();
    
    return deck;
  };

  // Revuelve la baraja creada
  const shuffleDeck = () => {
    deck.sort(() => Math.random() - 0.5);
  };
  
  // Funcion para tomar carta y retirarla del deck
  const takeCard = () => {
      if (deck.length === 0) {
        throw "No hay cartas en el deck";
      }
      return deck.pop();
  };

  // Funcion para saber el valor de la carta
  const valorCard = (card) => {
    const valor = card.substring(0, card.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  const accumulatePoints = (card, turn) =>{
    // Asigno los puntos al jugador de la carta tomada
    pointsPlayers[turn] = pointsPlayers[turn] + valorCard(card);
    pointsHtml[turn].innerText = pointsPlayers[turn];
    return pointsPlayers[turn];
  }

  const makeCard = (card, turn) =>{
    // Creo la imagen de la carta
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${card}.png`;
    imgCard.classList.add("carta");
    divCardsPlayers[turn].append(imgCard);
  }

  const determineWinner = () =>{

    const [pointsMinimus, pointsCPU] = pointsPlayers
    setTimeout(() => {
      if (pointsCPU === pointsMinimus) {
        alert("No gano nadie :(");
      } else if (pointsMinimus > 21) {
        alert(`CPU gana con ${pointsCPU} puntos`);
      } else if (pointsCPU > 21) {
        alert(`Jugador gana con ${pointsMinimus} puntos`);
      } else {
        alert(`CPU gana con ${pointsCPU} puntos`);
      }
    }, 400);  
  }

  
  //Funcion para el Turno cpu
  const turnCPU = (pointsMinimus) => {
    let pointsCPU = 0;
    do {
        const turn = pointsPlayers.length - 1;
        const card = takeCard(); //tomo la carta del deck
        pointsCPU = accumulatePoints(card, turn);
        makeCard(card, turn);

      
    } while (pointsCPU <= pointsMinimus && pointsMinimus <= 21);
    
    determineWinner();
  };

  /* Evetos del juego*/

  // Evento para carta el jugador
  btnPedir.addEventListener("click", function () {
    const card = takeCard(); //tomo la carta del deck
    const pointsPlayer = accumulatePoints(card,0);
    makeCard(card, 0);

    if (pointsPlayer > 21) {
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnCPU(pointsPlayer);
    } else if (pointsPlayer === 21) {
      btnDetener.disabled = true;
      btnPedir.disabled = true;
      turnCPU(pointsPlayer);
    }
  });

  btnDetener.addEventListener("click", () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnCPU(pointsPlayers[0]);
  });

  btnNuevo.addEventListener("click", () => {
    initGame();
  });

  return  {
    newGame: initGame
  };

})();
