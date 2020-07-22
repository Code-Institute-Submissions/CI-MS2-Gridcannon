/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
/* eslint linebreak-style: ["error", "windows"] */

// CLASSES
/* Base Grid Slot Class -Each slot on the grid can hold a stack of cards and has ui elements which
  show the top card of the stack as well as an overlay for
  highlight valid moves and giving user info. It has functions for adding cards to the stack as
   well
  update the visuals when a new card has been added.
*/
class gridSlot {
  constructor() {
    (this.cards = []),
      (this.element = null),
      (this.topCardElement = null),
      (this.overlayElement = null);
  }

  addCardToSlot(cardToAdd) {
    this.cards.unshift(cardToAdd);
    this.topCardElement.setAttribute('data-card-type', this.cards[0].cardType);
    this.updateCardVisuals();
  }

  updateCardVisuals() {
    // if (this.id === 'deck') {
    // }
    const numberOfCardsText = this.overlayElement.getElementsByClassName('number-of-cards')[0];

    if (numberOfCardsText) {
      numberOfCardsText.textContent = this.cards.length;
    }

    if (this.topCardElement != null) {
      if (this.cards.length > 0) {
        this.topCardElement.classList.remove('hide-element');
        const cardValueText = this.topCardElement.getElementsByClassName('card-value')[0];

        if (this.cards[0].cardValue === 0) {
          cardValueText.textContent = 'J';
        } else if (this.cards[0].cardValue === 1) {
          cardValueText.textContent = 'A';
        } else if (this.cards[0].cardValue === 11) {
          cardValueText.textContent = 'J';
        } else if (this.cards[0].cardValue === 12) {
          cardValueText.textContent = 'Q';
        } else if (this.cards[0].cardValue === 13) {
          cardValueText.textContent = 'K';
        } else {
          cardValueText.textContent = this.cards[0].cardValue;
        }

        const suitIcon = this.topCardElement.getElementsByClassName('suit-icon')[0];
        const slotLabel = this.topCardElement.getElementsByClassName('slot-label')[0];

        suitIcon.classList.remove('club');
        suitIcon.classList.remove('spade');
        suitIcon.classList.remove('heart');
        suitIcon.classList.remove('diamond');
        suitIcon.classList.remove('joker');
        suitIcon.classList.remove('red');
        suitIcon.classList.remove('black');
        slotLabel.classList.remove('red');
        slotLabel.classList.remove('black');

        this.topCardElement.classList.remove('black');
        this.topCardElement.classList.remove('red');

        if (this.cards[0].suit === 'clubs') {
          suitIcon.classList.add('club');
          this.topCardElement.classList.add('red');
          slotLabel.classList.add('red');
        } else if (this.cards[0].suit === 'spades') {
          suitIcon.classList.add('spade');
          this.topCardElement.classList.add('red');
          slotLabel.classList.add('red');
        } else if (this.cards[0].suit === 'hearts') {
          suitIcon.classList.add('heart');
          this.topCardElement.classList.add('black');
          slotLabel.classList.add('black');
        } else if (this.cards[0].suit === 'diamonds') {
          suitIcon.classList.add('diamond');
          this.topCardElement.classList.add('black');
          slotLabel.classList.add('black');
        } else if (this.cards[0].suit === 'joker') {
          suitIcon.classList.add('joker');
          this.topCardElement.classList.add('black');
          slotLabel.classList.add('black');
        }

        if (this.cards[0].cardValue > 10) {
          const armorLabel = this.topCardElement.getElementsByClassName('armour-label');
          if (armorLabel[0]) {
            armorLabel[0].getElementsByTagName('text')[0].textContent = `${this.cards[0].armour}`;
          }
        }
      } else {
        this.topCardElement.classList.add('hide-element');
      }
    }
  }

  shuffleCardsIntoDeck() {
    while (this.cards.length > 0) {
      deck.cards.push(this.cards.shift());
    }
    deck.shuffle();
    this.updateCardVisuals();
  }
}

// Royal Grid slot adds the functionality to take damage.
class royalCardGridSlot extends gridSlot {
  applyDamage(damage) {
    if (damage >= this.cards[0].cardValue + this.cards[0].armour) {
      this.element.classList.add('flipped');
      this.cards[0].isDefeated = true;
      numberOfRoyalsDefeated++;
    }
  }
}

// Numbered Grid Slot adds the functionality store opposite and adjacent royal slots 
// as well as the ability to attack royal slots.
class numberedCardGridSlot extends gridSlot {
  constructor() {
    super();
    (this.oppositeRoyalCardGridSlots = []),
      (this.adjacentRoyalGridSlots = []),
      (this.verticalAttackSlots = []),
      (this.horizontalAttackSlots = []);
  }

  addCardToSlot(cardToAdd) {
    this.cards.unshift(cardToAdd);
    this.topCardElement.setAttribute('data-card-type', this.cards[0].cardType);
    this.updateCardVisuals();
    if (gameManager.state === 'game-active') {
      this.attackRoyals();
    }
  }

  attackRoyals() {
    let verticalRoyalGridSlot;
    let verticalRoyalCard;
    let horizontalRoyalGridSlot;
    let horizontalRoyalCard;
    const verticalAttackCards = [];
    const horizontalAttackCards = [];
    let verticalRoyalIndex;
    let verticalDamage = 0;
    let horizontalRoyalIndex;
    let horizontalDamage = 0;

    if (this.oppositeRoyalCardGridSlots[0] != null) {
      horizontalRoyalIndex = this.oppositeRoyalCardGridSlots[0];
      if (royalCardGrid[horizontalRoyalIndex]) {
        horizontalRoyalGridSlot = royalCardGrid[horizontalRoyalIndex];
        if (royalCardGrid[horizontalRoyalIndex].cards.length > 0) {
          horizontalRoyalCard = royalCardGrid[horizontalRoyalIndex].cards[0];
        }
      }
    }
    if (this.oppositeRoyalCardGridSlots[1] != null) {
      verticalRoyalIndex = this.oppositeRoyalCardGridSlots[1];
      if (royalCardGrid[verticalRoyalIndex]) {
        verticalRoyalGridSlot = royalCardGrid[verticalRoyalIndex];
        if (royalCardGrid[verticalRoyalIndex].cards.length > 0) {
          verticalRoyalCard = royalCardGrid[verticalRoyalIndex].cards[0];
        }
      }
    }

    if (this.verticalAttackSlots.length !== 0) {
      verticalAttackCards.unshift(
        gameManager.numberCardGrid[this.verticalAttackSlots[0]].cards[0]
      );
      verticalAttackCards.unshift(
        gameManager.numberCardGrid[this.verticalAttackSlots[1]].cards[0]
      );
      let verticalDamage_01 = 0;
      let verticalDamage_02 = 0;

      if (
        gameManager.numberCardGrid[this.verticalAttackSlots[0]].cards.length > 0
      ) {
        verticalDamage_01 =
          gameManager.numberCardGrid[this.verticalAttackSlots[0]].cards[0]
            .cardValue;
      }
      if (
        gameManager.numberCardGrid[this.verticalAttackSlots[1]].cards.length > 0
      ) {
        verticalDamage_02 =
          gameManager.numberCardGrid[this.verticalAttackSlots[1]].cards[0]
            .cardValue;
      }

      verticalDamage = verticalDamage_01 + verticalDamage_02;
    }

    if (this.horizontalAttackSlots.length != 0) {
      horizontalAttackCards.unshift(
        gameManager.numberCardGrid[this.horizontalAttackSlots[0]].cards[0]
      );
      horizontalAttackCards.unshift(
        gameManager.numberCardGrid[this.horizontalAttackSlots[1]].cards[0]
      );
      let horizontalDamage_01 = 0;
      let horizontalDamage_02 = 0;

      if (
        gameManager.numberCardGrid[this.horizontalAttackSlots[0]].cards.length >
        0
      ) {
        horizontalDamage_01 =
          gameManager.numberCardGrid[this.horizontalAttackSlots[0]].cards[0]
            .cardValue;
      }
      if (
        gameManager.numberCardGrid[this.horizontalAttackSlots[1]].cards.length >
        0
      ) {
        horizontalDamage_02 =
          gameManager.numberCardGrid[this.horizontalAttackSlots[1]].cards[0]
            .cardValue;
      }
      horizontalDamage = horizontalDamage_01 + horizontalDamage_02;
    }

    // Check if Royal is a Jack, King Queen or empty
    // If it's a Jack then then the attack power must be greater or equal to the value + armour
    // If it's a Queen then the two attack cards must equal the Queens colour
    // If it's a Kind then the two attack cards must equal the Kings suit.
    if (verticalRoyalCard) {
      if (verticalAttackCards[0] && verticalAttackCards[1]) {
        if (verticalRoyalCard.royalType === 'jack') {
          verticalRoyalGridSlot.applyDamage(verticalDamage);
        } else if (verticalRoyalCard.royalType === 'queen') {
          if (
            verticalRoyalCard.cardColour ===
              verticalAttackCards[0].cardColour &&
            verticalRoyalCard.cardColour === verticalAttackCards[1].cardColour
          ) {
            verticalRoyalGridSlot.applyDamage(verticalDamage);
          } else {
          }
        } else if (
          verticalRoyalCard.suit === verticalAttackCards[0].suit &&
          verticalRoyalCard.suit === verticalAttackCards[1].suit
        ) {
          verticalRoyalGridSlot.applyDamage(verticalDamage);
        } else {
        }
      } else {
      }
    } else {
    }

    if (horizontalRoyalCard) {
      if (horizontalAttackCards[0] && horizontalAttackCards[1]) {
        if (horizontalRoyalCard.royalType === 'jack') {
          horizontalRoyalGridSlot.applyDamage(horizontalDamage);
        } else if (horizontalRoyalCard.royalType === 'queen') {
          if (horizontalAttackCards[0] && horizontalAttackCards[1]) {
            if (
              horizontalRoyalCard.cardColour ===
                horizontalAttackCards[0].cardColour &&
              horizontalRoyalCard.cardColour ===
                horizontalAttackCards[1].cardColour
            ) {
              horizontalRoyalGridSlot.applyDamage(horizontalDamage);
            }
          }
        } else if (
          horizontalRoyalCard.suit === horizontalAttackCards[0].suit &&
          horizontalRoyalCard.suit === horizontalAttackCards[1].suit
        ) {
          horizontalRoyalGridSlot.applyDamage(horizontalDamage);
        }
      } else {
      }
    } else {
    }
  }
}

// Deck grid slot adds the functionality to create a deck of cards, shuffle a deck of 
// cards as well as draw a card.
class deckGridSlot extends gridSlot {
  // Ficher Yates shuffle.
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const firstCard = this.cards[i];
      const secondCard = this.cards[randomIndex];
      this.cards[i] = secondCard;
      this.cards[randomIndex] = firstCard;
    }
  }

  drawCard() {
    return this.cards.shift();
    deck.updateCardVisuals();
  }

  // Create a deck of 54 cards including Jokers.
  initialise() {
    let cardInstance;
    for (let i = 0; i < cardSuits.length; i++) {
      for (let j = 1; j < 14; j++) {
        if (j === 1) {
          cardInstance = new card();
          cardInstance.cardValue = j;
          cardInstance.suit = cardSuits[i];
          cardInstance.cardType = 'ace';
        } else if (j > 1 && j < 11) {
          cardInstance = new card();
          cardInstance.cardValue = j;
          cardInstance.suit = cardSuits[i];
          cardInstance.cardType = 'numbered';
        } else {
          cardInstance = new royalCard();
          cardInstance.cardValue = j;
          cardInstance.suit = cardSuits[i];
          cardInstance.cardType = 'royal';
          if (j === 11) {
            cardInstance.royalType = 'jack';
          } else if (j === 12) {
            cardInstance.royalType = 'queen';
          } else {
            cardInstance.royalType = 'king';
          }
        }

        if (cardSuits[i] === 'clubs' || cardSuits[i] === 'spades') {
          cardInstance.cardColour = 'black';
        } else {
          cardInstance.cardColour = 'red';
        }
        this.cards.unshift(cardInstance);
      }
    }

    for (let i = 0; i < numberOfJokers; i++) {
      cardInstance = new card();
      cardInstance.suit = 'joker';
      cardInstance.cardType = 'joker';
      cardInstance.cardValue = 0;
      this.cards.unshift(cardInstance);
    }
  }
}

// Card base class.
class card {
  constructor() {
    (this.suit = ''),
      (this.cardValue = 0),
      (this.cardType = ''),
      (this.cardColour = '');
  }
}

// Royal card adds armour and the ability to be defeated.
class royalCard extends card {
  constructor() {
    super();
    (this.royalType = ''), (this.armour = 0), (this.isDefeated = false);
  }
}

// VARIABLES

const cardSuits = ['clubs', 'spades', 'hearts', 'diamonds']; // Parameters for generating the deck of cards.
const numberOfJokers = 2; // Parameters for generating the deck of cards.
let royalCardGrid = [];
let cardInHand;
let cardInHandSlotType;
let lastCardPlayed;
const jokerDeck = new gridSlot();
const acesDeck = new gridSlot();
const discardDeck = new gridSlot();
let deck = new deckGridSlot();
let hand = {};
let numberOfRoyalsDefeated = 0;
let dragging = false; // Used to prevent draggable elements from calling the click event when dragged.
let lastSlotClicked;

const gameManager = {
  state: 'start',

  numberCardGrid: [],
  deckSetup() {
    deck.initialise();
    deck.shuffle();
    deck.element = Array.from($('#deck'))[0];
    deck.topCardElement = deck.element.getElementsByClassName('card')[0];
    deck.overlayElement = deck.element.getElementsByClassName(
      'slot-highlight'
    )[0];
    deck.updateCardVisuals();
  },
  handSetup() {
    hand = new gridSlot();
    hand.element = Array.from($('#hand'))[0];
    hand.topCardElement = hand.element.getElementsByClassName('card')[0];
    hand.overlayElement = hand.element.getElementsByClassName(
      'slot-highlight'
    )[0];
    hand.updateCardVisuals();
  },
  acesDeckSetup() {
    acesDeck.element = Array.from($('#aces'))[0];
    acesDeck.topCardElement = acesDeck.element.getElementsByClassName(
      'card'
    )[0];
    acesDeck.overlayElement = acesDeck.element.getElementsByClassName(
      'slot-highlight'
    )[0];
    acesDeck.updateCardVisuals();
  },
  jokerDeckSetup() {
    jokerDeck.element = Array.from($('#jokers'))[0];
    jokerDeck.topCardElement = jokerDeck.element.getElementsByClassName(
      'card'
    )[0];
    jokerDeck.overlayElement = jokerDeck.element.getElementsByClassName(
      'slot-highlight'
    )[0];
    jokerDeck.updateCardVisuals();
  },
  discardDeckSetup() {
    discardDeck.element = Array.from($('#discard'))[0];
    discardDeck.topCardElement = discardDeck.element.getElementsByClassName(
      'card'
    )[0];
    discardDeck.overlayElement = discardDeck.element.getElementsByClassName(
      'slot-highlight'
    )[0];
    discardDeck.updateCardVisuals();
  },
  generateNumberedCardGrid() {
    const numberedCardGridSlotElements = $('.card-slot.numbered');

    for (let i = 0; i < numberedCardGridSlotElements.length; i++) {
      this.numberCardGrid[i] = new numberedCardGridSlot();
      this.numberCardGrid[i].element = numberedCardGridSlotElements[i];
      this.numberCardGrid[i].topCardElement = this.numberCardGrid[
        i
      ].element.getElementsByClassName('card')[0];
      this.numberCardGrid[i].overlayElement = this.numberCardGrid[
        i
      ].element.getElementsByClassName('slot-highlight')[0];
    }

    this.numberCardGrid[0].oppositeRoyalCardGridSlots = [7, 2];
    this.numberCardGrid[0].adjacentRoyalGridSlots = [11, 8];
    this.numberCardGrid[0].verticalAttackSlots = [3, 6];
    this.numberCardGrid[0].horizontalAttackSlots = [1, 2];

    this.numberCardGrid[1].oppositeRoyalCardGridSlots = [null, 1];
    this.numberCardGrid[1].adjacentRoyalGridSlots = [10];
    this.numberCardGrid[1].verticalAttackSlots = [4, 7];

    this.numberCardGrid[2].oppositeRoyalCardGridSlots = [8, 0];
    this.numberCardGrid[2].adjacentRoyalGridSlots = [7, 9];
    this.numberCardGrid[2].verticalAttackSlots = [5, 8];
    this.numberCardGrid[2].horizontalAttackSlots = [0, 1];

    this.numberCardGrid[3].oppositeRoyalCardGridSlots = [5, null];
    this.numberCardGrid[3].adjacentRoyalGridSlots = [6];
    this.numberCardGrid[3].horizontalAttackSlots = [4, 5];

    this.numberCardGrid[5].oppositeRoyalCardGridSlots = [6, null];
    this.numberCardGrid[5].adjacentRoyalGridSlots = [5];
    this.numberCardGrid[5].horizontalAttackSlots = [3, 4];

    this.numberCardGrid[6].oppositeRoyalCardGridSlots = [3, 11];
    this.numberCardGrid[6].adjacentRoyalGridSlots = [2, 4];
    this.numberCardGrid[6].verticalAttackSlots = [0, 3];
    this.numberCardGrid[6].horizontalAttackSlots = [7, 8];

    this.numberCardGrid[7].oppositeRoyalCardGridSlots = [null, 10];
    this.numberCardGrid[7].adjacentRoyalGridSlots = [1];
    this.numberCardGrid[7].verticalAttackSlots = [1, 4];

    this.numberCardGrid[8].oppositeRoyalCardGridSlots = [4, 9];
    this.numberCardGrid[8].adjacentRoyalGridSlots = [0, 3];
    this.numberCardGrid[8].verticalAttackSlots = [2, 5];
    this.numberCardGrid[8].horizontalAttackSlots = [6, 7];
  },
  generateRoyalCardGrid() {
    const cardsSlotRoyalElements = $('.card-slot.royal');
    for (let i = 0; i < cardsSlotRoyalElements.length; i++) {
      const newRoyalCardGridSlot = new royalCardGridSlot();
      newRoyalCardGridSlot.element = cardsSlotRoyalElements[i];
      newRoyalCardGridSlot.topCardElement = newRoyalCardGridSlot.element.getElementsByClassName(
        'card royal'
      )[0];
      newRoyalCardGridSlot.overlayElement = newRoyalCardGridSlot.element.getElementsByClassName(
        'slot-highlight'
      )[0];
      newRoyalCardGridSlot.updateCardVisuals();
      royalCardGrid.unshift(newRoyalCardGridSlot);
    }
  },
  populateNumberedCardGrid() {
    for (let i = 0; i < this.numberCardGrid.length; i++) {
      while (this.numberCardGrid[i].cards.length === 0) {
        const cardToPlace = deck.drawCard();
        if (cardToPlace.cardValue === 0) {
          jokerDeck.addCardToSlot(cardToPlace);
        } else if (cardToPlace.cardValue === 1) {
          acesDeck.addCardToSlot(cardToPlace);
        } else if (cardToPlace.cardValue > 10) {
          console.log('1');
          hand.addCardToSlot(cardToPlace);
        } else {
          this.numberCardGrid[i].addCardToSlot(cardToPlace);
        }
      }
    }
    // If no royals were drawn in the initial board setup cycle for royal
    if (hand.cards.length === 0) {
      console.log('Inital cycling');
      cycleForRoyal();
    }

    deck.updateCardVisuals();
  },

  findValidMoves() {
    if (cardInHand) {
      if (cardInHand.cardType === 'royal') {
        let highestValueMatchingSlot = new numberedCardGridSlot();
        for (let i = 0; i < this.numberCardGrid.length; i++) {
          if (i === 4) {
            continue;
          }

          let royalSlotAvailable = false;

          for (
            let j = 0;
            j < this.numberCardGrid[i].adjacentRoyalGridSlots.length;
            j++
          ) {
            if (
              royalCardGrid[this.numberCardGrid[i].adjacentRoyalGridSlots[j]]
                .cards.length === 0
            ) {
              royalSlotAvailable = true;
            }
          }

          if (royalSlotAvailable === false) {
            continue;
          }
          // Don't check for matching suit if slot is empty
          if (this.numberCardGrid[i].cards.length > 0) {
            if (this.numberCardGrid[i].cards[0].suit === cardInHand.suit) {
              if (highestValueMatchingSlot.cards.length > 0) {
                if (
                  this.numberCardGrid[i].cards[0].cardValue >
                  highestValueMatchingSlot.cards[0].cardValue
                ) {
                  highestValueMatchingSlot = this.numberCardGrid[i];
                }
              } else {
                highestValueMatchingSlot = this.numberCardGrid[i];
                // check if adjacent royal slots are filled if the are continue
              }
            } else {
              continue;
            }
          } else {
            const emptySlot = this.numberCardGrid[i];
            for (let j = 0; j < emptySlot.adjacentRoyalGridSlots.length; j++) {
              if (
                royalCardGrid[emptySlot.adjacentRoyalGridSlots[j]].cards
                  .length === 0
              ) {
                royalCardGrid[
                  emptySlot.adjacentRoyalGridSlots[j]
                ].element.classList.add('dropzone');
              }
            }
            continue;
          }
        }
        if (highestValueMatchingSlot.cards.length === 0) {
          for (let i = 0; i < this.numberCardGrid.length; i++) {
            if (i === 4) {
              continue;
            }

            let royalSlotAvailable = false;

            for (
              let j = 0;
              j < this.numberCardGrid[i].adjacentRoyalGridSlots.length;
              j++
            ) {
              if (
                royalCardGrid[this.numberCardGrid[i].adjacentRoyalGridSlots[j]]
                  .cards.length === 0
              ) {
                royalSlotAvailable = true;
              }
            }

            if (royalSlotAvailable === false) {
              continue;
            }

            if (this.numberCardGrid[i].cards.length > 0) {
              if (
                this.numberCardGrid[i].cards[0].cardColour ===
                cardInHand.cardColour
              ) {
                if (highestValueMatchingSlot.cards.length > 0) {
                  if (
                    this.numberCardGrid[i].cards[0].cardValue >
                    highestValueMatchingSlot.cards[0].cardValue
                  ) {
                    highestValueMatchingSlot = this.numberCardGrid[i];
                  }
                } else {
                  highestValueMatchingSlot = this.numberCardGrid[i];
                }
              } else {
                continue;
              }
            } else {
              continue;
            }
          }
        }
        if (highestValueMatchingSlot.cards.length === 0) {
          for (let i = 0; i < this.numberCardGrid.length; i++) {
            if (i === 4) {
              continue;
            }

            let royalSlotAvailable = false;

            for (
              let j = 0;
              j < this.numberCardGrid[i].adjacentRoyalGridSlots.length;
              j++
            ) {
              if (
                royalCardGrid[this.numberCardGrid[i].adjacentRoyalGridSlots[j]]
                  .cards.length === 0
              ) {
                royalSlotAvailable = true;
              }
            }

            if (royalSlotAvailable === false) {
              continue;
            }
            if (this.numberCardGrid[i].cards.length > 0) {
              if (highestValueMatchingSlot.cards.length > 0) {
                if (
                  this.numberCardGrid[i].cards[0].cardValue >
                  highestValueMatchingSlot.cards[0].cardValue
                ) {
                  highestValueMatchingSlot = this.numberCardGrid[i];
                }
              } else {
                highestValueMatchingSlot = this.numberCardGrid[i];
              }
            } else {
              continue;
            }
          }
        }

        for (
          let i = 0;
          i < highestValueMatchingSlot.adjacentRoyalGridSlots.length;
          i++
        ) {
          if (
            royalCardGrid[highestValueMatchingSlot.adjacentRoyalGridSlots[i]]
              .cards.length === 0
          ) {
            royalCardGrid[
              highestValueMatchingSlot.adjacentRoyalGridSlots[i]
            ].element.classList.add('dropzone');
          }
        }
      } else if (cardInHand.cardType === 'numbered') {
        if (gameManager.state === 'game-active') {
          let matchFound = false;
          for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
            if (gameManager.numberCardGrid[i].cards.length > 0) {
              if (
                gameManager.numberCardGrid[i].cards[0].cardValue <=
                  cardInHand.cardValue &&
                gameManager.numberCardGrid[i].cards[0] != cardInHand
              ) {
                gameManager.numberCardGrid[i].element.classList.add('dropzone');
                matchFound = true;
              }
            } else {
              gameManager.numberCardGrid[i].element.classList.add('dropzone');
            }
          }

          if (matchFound === false) {
            // Find the lowest royal of matching suit
            let lowestMatchingRoyalSlot;
            for (let i = 0; i < royalCardGrid.length; i++) {
              if (royalCardGrid[i].cards != 0) {
                if (
                  royalCardGrid[i].cards[0].suit === cardInHand.suit &&
                  royalCardGrid[i].cards[0].isDefeated === false
                ) {
                  if (lowestMatchingRoyalSlot) {
                    if (
                      royalCardGrid[i].cards[0].cardValue <
                      lowestMatchingRoyalSlot.cards[0].cardValue
                    ) {
                      lowestMatchingRoyalSlot = royalCardGrid[i];
                    }
                  } else {
                    lowestMatchingRoyalSlot = royalCardGrid[i];
                  }
                }
              }
            }
            // Find the lowest royal of matching colour
            if (!lowestMatchingRoyalSlot) {
              for (let i = 0; i < royalCardGrid.length; i++) {
                if (royalCardGrid[i].cards != 0) {
                  if (
                    royalCardGrid[i].cards[0].cardColour ===
                      cardInHand.cardColour &&
                    royalCardGrid[i].cards[0].isDefeated === false
                  ) {
                    if (lowestMatchingRoyalSlot) {
                      if (
                        royalCardGrid[i].cards[0].cardValue <
                        lowestMatchingRoyalSlot.cards[0].cardValue
                      ) {
                        lowestMatchingRoyalSlot = royalCardGrid[i];
                      }
                    } else {
                      lowestMatchingRoyalSlot = royalCardGrid[i];
                    }
                  }
                }
              }
            }
            // Find the lowest value royal.
            if (!lowestMatchingRoyalSlot) {
              for (let i = 0; i < royalCardGrid.length; i++) {
                if (royalCardGrid[i].cards != 0) {
                  if (royalCardGrid[i].cards[0].isDefeated === false) {
                    if (lowestMatchingRoyalSlot) {
                      if (
                        royalCardGrid[i].cards[0].cardValue <
                        lowestMatchingRoyalSlot.cards[0].cardValue
                      ) {
                        lowestMatchingRoyalSlot = royalCardGrid[i];
                      }
                    } else {
                      lowestMatchingRoyalSlot = royalCardGrid[i];
                    }
                  }
                }
              }
            }
            lowestMatchingRoyalSlot.element.classList.add('dropzone');
          }
        } else if (gameManager.state === 'taking-a-mulligan') {
          deck.element.classList.add('dropzone');
        }
      } else if (cardInHand.cardType === 'ace') {
        if (cardInHandSlotType === 'hand') {
          acesDeck.element.classList.add('dropzone');
          for (let i = 0; i < this.numberCardGrid.length; i++) {
            if (this.numberCardGrid[i].cards.length > 0) {
              this.numberCardGrid[i].element.classList.add('dropzone');
            }
          }
        } else if (cardInHandSlotType === 'aceDeck') {
          for (let i = 0; i < this.numberCardGrid.length; i++) {
            if (this.numberCardGrid[i].cards.length > 0) {
              this.numberCardGrid[i].element.classList.add('dropzone');
            }
          }
        }
      } else if (cardInHand.cardType === 'joker') {
        if (cardInHandSlotType === 'hand') {
          jokerDeck.element.classList.add('dropzone');
        }
        for (let i = 0; i < this.numberCardGrid.length; i++) {
          this.numberCardGrid[i].element.classList.add('dropzone');
        }
      }
    }
  },
};

// Interaction Events

$('#play-button').click(function () {
  gameManager.populateNumberedCardGrid();
  this.classList.add('remove-element');
  allowPlacingOfRoyals();
});

function allowPlacingOfRoyals() {
  $('#reset-icon').removeClass('remove-element');
  gameManager.state = 'placing-royals';
  $('#info-text').text('Now place all royals from your hand onto the board');
  hand.topCardElement.classList.add('draggable');
  $('.deck-name').removeClass('hide-element');
  $('.deck').removeClass('hide-element');
}

$('#mull-button').click(function () {
  this.classList.add('remove-element');
  $('#continue-button').addClass('remove-element');
  for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
    gameManager.numberCardGrid[i].topCardElement.classList.add('draggable');
  }
  $('.deck-name').removeClass('hide-element');
  $('.deck').removeClass('hide-element');
  $('#info-text').text(
    "Drag the card you wish to swap onto the deck and a new card will be put in it's place."
  );
  gameManager.state = 'taking-a-mulligan';
});

$('#continue-button').click(function () {
  this.classList.add('remove-element');
  moveToGameActive();
});

interact('.draggable').draggable({
  listeners: {
    start(event) {
      // event.target.style.transform = "translate(" + -50 + "%, " + -50 + "%)";
    },
    move(event) {
      event.target.style.transform.position.x += event.dx;
      event.target.style.transform.position.y += event.dy;
    },
  },
});

let clone = null;
interact('.draggable').draggable({
  listeners: {
    start(event) {
      if (lastSlotClicked) {
        lastSlotClicked.removeClass('clicked');
        lastSlotClicked = null;
      }

      // Prevent Slot Click Event from happening while dragging a card.
      dragging = true;

      clone = event.target.cloneNode(true);
      clone.classList.add('clone');
      clone.classList.remove('draggable');
      event.target.parentNode.appendChild(clone);
      clone = event.target.parentNode.getElementsByClassName('clone')[0];

      event.target.style.zIndex = 10;
      if (event.target.parentNode.getAttribute('data-slot-type') === 'hand') {
        cardInHand = hand.cards[0];
        cardInHandSlotType = 'hand';
      } else if (
        event.target.parentNode.getAttribute('data-slot-type') === 'aceDeck'
      ) {
        cardInHand = acesDeck.cards[0];
        cardInHandSlotType = 'aceDeck';
      } else if (
        event.target.parentNode.getAttribute('data-slot-type') === 'jokerDeck'
      ) {
        cardInHand = jokerDeck.cards[0];
        cardInHandSlotType = 'jokerDeck';
      } else if (
        event.target.parentNode.getAttribute('data-slot-type') === 'numbered'
      ) {
        cardInHand =
          gameManager.numberCardGrid[
            event.target.parentNode.getAttribute('data-grid-index')
          ].cards[0];
        cardInHandSlotType = 'numbered';
      }

      gameManager.findValidMoves();
    },

    move: dragMoveListener,

    end(event) {
      event.target.style.zIndex = 0;
    },
  },
});

function dragMoveListener(event) {
  const { target } = event;

  const boundingRect = target.getBoundingClientRect();

  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

interact('.dropzone').dropzone({
  accept: '.card',

  overlap: 0.75,

  ondropactivate(event) {
    event.target.classList.add('drop-active');
  },
  ondragenter(event) {
    const draggableElement = event.relatedTarget;
    const draggableElementType = draggableElement.getAttribute(
      'data-card-type'
    );
    const dropzoneElement = event.target;
    const dropSlotGridIndex = dropzoneElement.getAttribute('data-grid-index');
    const dropSlotType = dropzoneElement.getAttribute('data-slot-type');

    /* If the player drags a numbered card into a numbered card slot, turn off the valid moves highlights and
     highlight the royals that will be targeted withe the attack. */

    if (dropSlotType === 'numbered' && draggableElementType === 'numbered') {
      for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
        gameManager.numberCardGrid[i].overlayElement.classList.add('mute');
      }
      const royalSlotIndices =
        gameManager.numberCardGrid[dropSlotGridIndex]
          .oppositeRoyalCardGridSlots;
      for (let i = 0; i < royalSlotIndices.length; i++) {
        if (royalCardGrid[royalSlotIndices[i]] != null) {
          royalCardGrid[royalSlotIndices[i]].overlayElement.classList.add(
            'target'
          );
        }
      }

      const attackSlotIndices = [
        ...gameManager.numberCardGrid[dropSlotGridIndex].verticalAttackSlots,
        ...gameManager.numberCardGrid[dropSlotGridIndex].horizontalAttackSlots,
      ];
      for (let i = 0; i < attackSlotIndices.length; i++) {
        gameManager.numberCardGrid[
          attackSlotIndices[i]
        ].overlayElement.classList.remove('mute');
        gameManager.numberCardGrid[
          attackSlotIndices[i]
        ].overlayElement.classList.add('target');
      }
    }
  },
  ondragleave(event) {
    const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;
    const dropSlotGridIndex = dropzoneElement.getAttribute('data-grid-index');
    const dropSlotType = dropzoneElement.getAttribute('data-slot-type');
    if (dropSlotType === 'numbered') {
      const slotRoyalIndexes =
        gameManager.numberCardGrid[dropSlotGridIndex]
          .oppositeRoyalCardGridSlots;
      for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
        gameManager.numberCardGrid[i].overlayElement.classList.remove('mute');
        gameManager.numberCardGrid[i].overlayElement.classList.remove('target');
      }
      for (let i = 0; i < slotRoyalIndexes.length; i++) {
        if (royalCardGrid[slotRoyalIndexes[i]] != null) {
          royalCardGrid[slotRoyalIndexes[i]].overlayElement.classList.remove(
            'target'
          );
        }
      }
    }
  },
  ondrop(event) {
    const dropSlotGridIndex = event.currentTarget.getAttribute(
      'data-grid-index'
    );
    const dropSlotType = event.currentTarget.getAttribute('data-slot-type');
    const dropItemParentSlotIndex = event.relatedTarget.parentNode.getAttribute(
      'data-grid-index'
    );
    const dropItemParentSlotType = event.relatedTarget.parentNode.getAttribute(
      'data-slot-type'
    );

    clone.remove();
    if (dropSlotType === 'royal') {
      if (dropItemParentSlotType === 'hand') {
        if (royalCardGrid[dropSlotGridIndex].cards.length === 0) {
          royalCardGrid[dropSlotGridIndex].addCardToSlot(hand.cards.shift());
        } else {
          // Add Armour

          const armourValue = hand.cards[0].cardValue;
          royalCardGrid[dropSlotGridIndex].cards[0].armour += armourValue;
          discardDeck.addCardToSlot(hand.cards.shift());
          discardDeck.updateCardVisuals();
        }

        royalCardGrid[dropSlotGridIndex].updateCardVisuals();
        hand.updateCardVisuals();
      }
    } else if (dropSlotType === 'numbered') {
      if (dropItemParentSlotType === 'hand') {
        // Add card to slot
        if (hand.cards[0].cardType === 'ace') {
          discardDeck.addCardToSlot(hand.cards.shift());
          hand.updateCardVisuals();
          gameManager.numberCardGrid[dropSlotGridIndex].shuffleCardsIntoDeck();
        } else if (hand.cards[0].cardType === 'joker') {
          discardDeck.addCardToSlot(hand.cards.shift());
          hand.updateCardVisuals();
          gameManager.numberCardGrid[
            dropSlotGridIndex
          ].topCardElement.classList.add('draggable');
        } else {
          gameManager.numberCardGrid[dropSlotGridIndex].addCardToSlot(
            hand.cards.shift()
          );
        }
      } else if (dropItemParentSlotType === 'aceDeck') {
        discardDeck.addCardToSlot(acesDeck.cards.shift());
        acesDeck.updateCardVisuals();
        gameManager.numberCardGrid[dropSlotGridIndex].shuffleCardsIntoDeck();
      } else if (dropItemParentSlotType === 'jokerDeck') {
        discardDeck.addCardToSlot(jokerDeck.cards.shift());
        jokerDeck.updateCardVisuals();
        gameManager.numberCardGrid[
          dropSlotGridIndex
        ].topCardElement.classList.add('draggable');
      } else if (dropItemParentSlotType === 'numbered') {
        gameManager.numberCardGrid[dropSlotGridIndex].addCardToSlot(
          gameManager.numberCardGrid[dropItemParentSlotIndex].cards.shift()
        );
        gameManager.numberCardGrid[dropItemParentSlotIndex].updateCardVisuals();
        gameManager.numberCardGrid[
          dropItemParentSlotIndex
        ].topCardElement.classList.remove('draggable');
      }
    } else if (dropSlotType === 'aceDeck') {
      if (dropItemParentSlotType === 'hand') {
        acesDeck.cards.unshift(hand.cards.shift());
        acesDeck.updateCardVisuals();
        hand.updateCardVisuals();
      }
    } else if (dropSlotType === 'jokerDeck') {
      if (dropItemParentSlotType === 'hand') {
        jokerDeck.cards.unshift(hand.cards.shift());
        jokerDeck.updateCardVisuals();
        hand.updateCardVisuals();
      }
    } else if (dropSlotType === 'deck') {
      deck.cards.push(
        gameManager.numberCardGrid[dropItemParentSlotIndex].cards.shift()
      );
      let replacementCard = deck.cards.shift();
      while (replacementCard.cardType != 'numbered') {
        if (replacementCard.cardType === 'royal') {
          console.log('3');
          hand.addCardToSlot(replacementCard);
        } else if (replacementCard.cardType === 'ace') {
          acesDeck.addCardToSlot(replacementCard);
        } else if (replacementCard.cardType === 'joker') {
          jokerDeck.addCardToSlot(replacementCard);
        }
        replacementCard = deck.cards.shift();
      }
      gameManager.numberCardGrid[dropItemParentSlotIndex].addCardToSlot(
        replacementCard
      );
      // gameManager.numberCardGrid[dropItemParentSlotIndex].cards.unshift(
      //   replacementCard
      // );
      // gameManager.numberCardGrid[dropItemParentSlotIndex].updateCardVisuals();
      moveToGameActive();
    }

    for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
      gameManager.numberCardGrid[i].overlayElement.classList.remove('mute');
      gameManager.numberCardGrid[i].overlayElement.classList.remove('target');
    }
    for (let i = 0; i < royalCardGrid.length; i++) {
      royalCardGrid[i].overlayElement.classList.remove('target');
    }
    onSuccessfulMoveTaken();
  },
  ondropdeactivate(event) {
    event.relatedTarget.style.transform = 'translate(0,0)';
    clone.remove();
    event.relatedTarget.setAttribute('data-x', 0);
    event.relatedTarget.setAttribute('data-y', 0);
    event.target.classList.remove('dropzone');
    event.target.classList.remove('drop-active');
    setTimeout(() => {
      dragging = false;
    }, 100);
  },
});

$('.card-slot').click(function () {
  if (dragging === false) {
    if (lastSlotClicked) {
      if (lastSlotClicked.is($(this))) {
        $(this).toggleClass('clicked');
        lastSlotClicked = null;
      } else {
        lastSlotClicked.toggleClass('clicked');
        $(this).toggleClass('clicked');
        lastSlotClicked = $(this);
      }
    } else {
      $(this).toggleClass('clicked');
      lastSlotClicked = $(this);
    }
  }
});

$('#reset-icon').click(function () {
  $(this).addClass('remove-element');
  // Cycle through the number grid and push all cards back into the deck.target
  for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
    Array.prototype.push.apply(deck.cards, gameManager.numberCardGrid[i].cards);
    gameManager.numberCardGrid[i].cards = [];
    gameManager.numberCardGrid[i].updateCardVisuals();
    gameManager.numberCardGrid[i].topCardElement.classList.remove('draggable');
  }

  // Cycle through the royal grid and push all cards back into the deck.target
  for (let i = 0; i < royalCardGrid.length; i++) {
    Array.prototype.push.apply(deck.cards, royalCardGrid[i].cards);
    royalCardGrid[i].cards = [];
    royalCardGrid[i].updateCardVisuals();
    royalCardGrid[i].element.classList.remove('flipped');
    // royalCardGrid[i].element.classList.add("hide-element");
  }

  // Push the discard pile into the deck.
  Array.prototype.push.apply(deck.cards, discardDeck.cards);
  discardDeck.cards = [];
  discardDeck.updateCardVisuals();

  // Push the aces pile into the deck.
  Array.prototype.push.apply(deck.cards, acesDeck.cards);
  acesDeck.cards = [];
  acesDeck.updateCardVisuals();

  // Push the joker pile into the deck.
  Array.prototype.push.apply(deck.cards, jokerDeck.cards);
  jokerDeck.cards = [];
  jokerDeck.updateCardVisuals();

  // Push the hand pile into the deck.
  Array.prototype.push.apply(deck.cards, hand.cards);
  hand.cards = [];
  hand.updateCardVisuals();

  deck.shuffle();
  deck.updateCardVisuals();

  $('.deck-name').addClass('hide-element');
  $('.deck').addClass('hide-element');
  $('#play-button').removeClass('remove-element');
  $('#mull-button').addClass('remove-element');
  $('#continue-button').addClass('remove-element');
  $('#info-text').text(
    'Welcome to Gridcannon. Press play to deal a new number grid.'
  );

  acesDeck.topCardElement.classList.remove('draggable');
  jokerDeck.topCardElement.classList.remove('draggable');
  hand.topCardElement.classList.remove('draggable');
  gameManager.state = 'start';
});

function moveToGameActive() {
  $('#mull-button').addClass('remove-element');
  $('.deck-name').removeClass('hide-element');
  $('.deck').removeClass('hide-element');
  gameManager.state = 'game-active';
  $('#info-text').text('Kill The Royals');
  console.log('2');
  hand.addCardToSlot(deck.drawCard());
  hand.topCardElement.classList.add('draggable');
  acesDeck.topCardElement.classList.add('draggable');
  jokerDeck.topCardElement.classList.add('draggable');
  for (let i = 0; i < gameManager.numberCardGrid.length; i++) {
    gameManager.numberCardGrid[i].topCardElement.classList.remove('draggable');
  }
}

function cycleForRoyal() {
  do {
    console.log('5');
    hand.addCardToSlot(deck.drawCard());
  } while (hand.cards[0].cardType != 'royal');

  while (hand.cards.length > 1) {
    deck.cards.push(hand.cards.pop());
  }
}

function returnAllRoyalCards(card) {
  return card.cardType === 'royal';
}

function returnAllNonRoyalCards(card) {
  return card.cardType != 'royal';
}

function addAllRoyalsToHand() {
  const royalCards = deck.cards.filter(returnAllRoyalCards);
  deck.cards = deck.cards.filter(returnAllNonRoyalCards);
  hand.cards = hand.cards.concat(royalCards);
}

function addAllAcesToHand() {
  for (let i = 0; i < deck.cards.length; i++) {
    if (deck.cards[i].cardType === 'ace') {
      console.log('6');
      hand.addCardToSlot(deck.cards[i]);
    }
  }
}

function addAllJokersToHand() {
  for (let i = 0; i < deck.cards.length; i++) {
    if (deck.cards[i].cardType === 'joker') {
      console.log('7');
      hand.addCardToSlot(deck.cards[i]);
    }
  }
}

function emptyDeck() {
  for (let i = 0; i < deck.cards.length; i++) {
    if (deck.cards[i].value === 0) {
      jokerDeck.addCardToSlot(deck.cards[i]);
    } else if (deck.cards[i].value === 1) {
      acesDeck.addCardToSlot(deck.cards[i]);
    }
  }

  deck.cards = [];
}

function gameOver() {
  hand.topCardElement.classList.remove('draggable');
  acesDeck.topCardElement.classList.remove('draggable');
  jokerDeck.topCardElement.classList.remove('draggable');
}

function onSuccessfulMoveTaken() {
  /* Check if there are no royals on board, if not cycle through the deck until a royal is drawn, placing all non royal cards on the bottom of the deck.
   */

  /* Check if all royals on board are defeated. If the number of defeated royals is equal to 12, the player wins the game, if not cycle through the deck until
    a royal is drawn, placing all non royals on the bottom of the deck.
  */

  /* If there are undefeated royals on the board check if a royal has armour that brings their health total (value + armour) above 20 ,
  if a royals health is above 20 they can't be defeated and the player loses the game.

  If there are undefeated royals on the board that can still be defeated check if there are cards left in the deck, if there are cards left draw a card,
  if there are no cards left check if the player has any ploys left to play. If there are no ploys left to play, the player loses the game.
  */

  if (gameManager.state === 'placing-royals') {
    if (hand.cards.length === 0) {
      activateMulliganUI();
    }
  } else if (gameManager.state === 'game-active') {
    $('#info-text').text = ' ';
    lastCardPlayed = cardInHand;
    let allRoyalsAreDefeated = true;
    for (let i = 0; i < royalCardGrid.length; i++) {
      if (royalCardGrid[i].cards.length > 0) {
        if (
          royalCardGrid[i].cards[0].cardValue +
            royalCardGrid[i].cards[0].armour >
          20
        ) {
          gameOver();
          $('#info-text').text('A royal has become too powerful, you lose!');
        }
        if (royalCardGrid[i].cards[0].isDefeated === false) {
          allRoyalsAreDefeated = false;
        }
      } else {
        // allRoyalsAreDefeated = false;
      }
    }
    if (allRoyalsAreDefeated) {
      if (numberOfRoyalsDefeated === 12) {
        gameManager.state === 'game-over-win';
        $('#info-text').text('All royals are defeated, you win the game');
      } else {
        console.log('All royals defeated, cycling');
        cycleForRoyal();
      }
    }
    if (hand.cards.length === 0) {
      if (deck.cards.length > 0) {
        const newCard = deck.drawCard();
        console.log('4');
        hand.addCardToSlot(newCard);
      } else {
        // Check if you have any Aces or Jokers left in stash.
        if (
          acesDeck.cards.length > 0 ||
          jokerDeck.cards.length > 0 ||
          lastCardPlayed.suit === 'joker'
        ) {
          $('#info-text').text(
            'Your deck is empty but you still have some ploys left that might allow you to win'
          );
          hand.topCardElement.classList.add('hide-element');
        } else {
          $('#info-text').text(
            'You are out of cards and the royals are not defeated, you lose!'
          );
          gameOver();
          hand.topCardElement.classList.add('hide-element');
        }
      }
    }
  }

  deck.updateCardVisuals();
}

function activateMulliganUI() {
  gameManager.state = 'taking-a-mulligan';
  hand.topCardElement.classList.remove('draggable');
  $('#mull-button').removeClass('remove-element');
  $('#continue-button').removeClass('remove-element');
  $('#info-text').text(
    'Would you like to swap one card on the grid for a new card?'
  );
  $('.deck-name').addClass('hide-element');
  $('.deck').addClass('hide-element');
}

function newGame() {
  gameManager.deckSetup();
  gameManager.handSetup();
  gameManager.acesDeckSetup();
  gameManager.jokerDeckSetup();
  gameManager.discardDeckSetup();
  gameManager.generateNumberedCardGrid();
  gameManager.generateRoyalCardGrid();
}

function onReady() {
  newGame();
}

$(document).ready(onReady);
