$(document).ready(function() {
    


    var secretWordStuff = {
      wordBank : ['tacos', 'watermelon', 'banana', 'javascript', 'array', 'wolf', 'fox', 'shark'],
      generateRandomSecretWord : function () {
        var randomIndexNumber = Math.floor(secretWordStuff.wordBank.length*(Math.random()));
        secretWord = secretWordStuff.wordBank[randomIndexNumber];
        return secretWord;
      },
      getSecretWordFromUser : function (){
        secretWord = prompt ("Enter your secret word here. Make sure your opponent doesn't see what you are typing.");
        if (secretWord.length < 3) {
          secretWord = prompt("That's too easy. Try entering a secret word with at least 3 letters.");
        }
        for (var i=0; i< secretWord.length; i++) { //secret word should be one word only, no spaces
          if (secretWord[i] === " ") {
            secretWord = prompt ('Try entering one word only, without any spaces.');
          }
        }
        return secretWord;
      },
      showHiddenLetterList : function() {
        var hiddenLetterArray = [];
        for (var i=0; i<game.secretWord.length; i++) {
          hiddenLetterArray.push('_ ');
          $('#hiddenLetterList').append('<span id=letter-'+i+'>'+hiddenLetterArray[i]+'</span>');
        }
      }
    };
  
  
    var game = {
        isOngoing: false,
        startGame: function (tp=0, word='', id_word=NaN) {
          var hangmanImageSrc = '../static/images/Hangman-easy-6.png'; // Default image source
          if (tp) {
              game.secretWord = word;
          } else {
              game.secretWord = secretWordStuff.generateRandomSecretWord();
              // Modify the hangmanImageSrc if not a two-player game
              if (difficulty.difficultyLevel !== 'two-player') {
                  hangmanImageSrc = '../static/images/Hangman-begin.gif'; // Or any other default image
              }
          }
        game.isOngoing = true;
        secretWordStuff.showHiddenLetterList();
        letterBoard.showLetters();
        $('#startButton').remove();
        $('#resetButtonContainer').html('<button id="resetButton" class="button">Reset Game</button>');
        $('#letterBoard').prop('disabled', false);
      },
      numberOfGuessesRemaining : 6,
      numberOfCorrectGuesses: 0,
      secretWord : secretWordStuff.generateRandomSecretWord(),
      evaluateGuess : function (theClickedLetter, theSecretWord) {
        var numberLettersTheGuessDoesNotMatch = 0;
        for (var i=0; i<theSecretWord.length; i++) {
          if(theClickedLetter === (theSecretWord[i]).toUpperCase()){
             $('#letter-'+i).html(theSecretWord[i]);
             game.numberOfCorrectGuesses ++;
             if (game.numberOfCorrectGuesses === theSecretWord.length) {
               game.endGame("You Win!");
               scoreBoard.incrementWinScore();
              }
            }
          else if (theClickedLetter !== (theSecretWord[i]).toUpperCase()){
            numberLettersTheGuessDoesNotMatch ++;
          }
        }
        if (numberLettersTheGuessDoesNotMatch === theSecretWord.length) {
          if (game.numberOfGuessesRemaining > 0) { // Check if there is at least one guess remaining
              game.numberOfGuessesRemaining--;
      
              // Update the number of guesses remaining display
              $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
      
              if (game.numberOfGuessesRemaining === 0) {
                  // Use the GIF for the last try
                  $('#hangman-display').attr('src', '../static/images/Hangman-' + difficulty.difficultyLevel + '-0.gif');
                } else {
                  // Use the PNG for other tries
                  $('#hangman-display').attr('src', '../static/images/Hangman-' + difficulty.difficultyLevel + '-' + game.numberOfGuessesRemaining + '.png');
                }
              }
            }
      
      
        if (game.numberOfGuessesRemaining === 0) {
          game.endGame('You Lose');
          scoreBoard.incrementLoseScore();
        }
        if (difficulty.difficultyLevel === 'easy' && game.numberOfGuessesRemaining === 3 && $('#containerForHintButton').children().length === 0) {
          //add a hint button here
          $('#containerForHintButton').append('<button id="hintButton" class="button">Need a hint?</button>');
        }
      },
      endGame : function (winOrLossMessage) {
        game.isOngoing = false;
        $('#hintButton').prop('disabled', true);
        $('#hintButton').addClass('disabled');
        $('#letterBoard').prop('disabled', true);
        if (winOrLossMessage === 'You Lose') {
          $('#letterBoard').html('<span class="winOrLossMessage loseMessage">'+winOrLossMessage+'</span>');
        } else {
          $('#letterBoard').html('<span class="winOrLossMessage">'+winOrLossMessage+'</span>');
        }
        $('#hiddenLetterList').html(game.secretWord);
        $('#resetButton').html('Play Again');
      },
      
      resetGame : function () {
        //called by reset/play again button click or difficulty level change
        $('#containerForHint').empty(); //if there was a hint, delete it
        $('#containerForHintButton').empty(); //if there was a hint button, delete it
        if (difficulty.difficultyLevel === 'two-player') {
          game.secretWord = secretWordStuff.getSecretWordFromUser();
        } else {
          game.secretWord = secretWordStuff.generateRandomSecretWord();
        }
        $('#hiddenLetterList').empty();
        $('#letterBoard').empty();
        if (difficulty.difficultyLevel === 'easy' || difficulty.difficultyLevel ==='two-player') {
          game.numberOfGuessesRemaining = 6;
        } else if (difficulty.difficultyLevel === 'hard') {
          game.numberOfGuessesRemaining = 4;
        }
        $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
        $('#hangman-display').attr('src', "../static/images/Hangman-easy-6.png");
        game.numberOfCorrectGuesses = 0;
        game.isOngoing = true;
        secretWordStuff.showHiddenLetterList();
        letterBoard.showLetters();
        $('#startButton').remove();
        $('#resetButtonContainer').html('<button id="resetButton" class="button">Reset Game</button>');
        $('#letterBoard').prop('disabled', false);
        // game.startGame(); //this could be more dry but I ended up repeating some of the stateGame function in resetGame after I broke everything when I added difficulty modes
      }
    };
  
  
  
    var letterBoard = {
      lettersArray : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      showLetters : function() {
        for (var i=0; i<letterBoard.lettersArray.length; i++) {
          $('#letterBoard').append('<button class="letter">'+letterBoard.lettersArray[i]+'</button>');
        }
        $('#letterBoard').prop('disabled', false);
      },
      disableGuessedLetters : function (theClickedLetter) {
          theClickedLetter.addClass('disabled');
          theClickedLetter.prop('disabled', true);
      }
    };
  
  
  
    var difficulty = {
      difficultyLevel : 'easy',
      setDifficulty : function(theClickedDifficulty) {
        //only change difficulty if game is not ongoing, or if player confirms game reset
        if (game.isOngoing === true) {
          if (confirm("Are you sure? This will reset your game.") === true) {
            theClickedDifficulty.addClass('clicked');
            if (theClickedDifficulty.attr('id') === 'hard') {
              difficulty.difficultyLevel = 'hard';
              $('#easy').removeClass('clicked');
              $('#two-player').removeClass('clicked');
            } else if (theClickedDifficulty.attr('id') === 'easy') {
              difficulty.difficultyLevel = 'easy';
              $('#hard').removeClass('clicked');
              $('#two-player').removeClass('clicked');
            } else if (theClickedDifficulty.attr('id') === 'two-player') {
              difficulty.difficultyLevel = 'two-player';
              $('#hard').removeClass('clicked');
              $('#easy').removeClass('clicked');
            }
            game.resetGame();
          }
        } else if (game.isOngoing === false) {
          theClickedDifficulty.addClass('clicked');
          if (theClickedDifficulty.attr('id') === 'hard') {
            difficulty.difficultyLevel = 'hard';
            $('#easy').removeClass('clicked');
            $('#two-player').removeClass('clicked');
            //don't change the number of guesses remaining if you are on the win/lose screen
            if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length)
              {game.numberOfGuessesRemaining = 4;
            }
          } else if (theClickedDifficulty.attr('id') === 'easy') {
            difficulty.difficultyLevel = 'easy';
            $('#hard').removeClass('clicked');
            $('#two-player').removeClass('clicked');
            if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length) {
              game.numberOfGuessesRemaining = 6;
            }
          } else if (theClickedDifficulty.attr('id') === 'two-player') {
            difficulty.difficultyLevel = 'two-player';
            $('#hard').removeClass('clicked');
            $('#easy').removeClass('clicked');
            if (game.numberOfGuessesRemaining !==0 && game.numberOfCorrectGuesses !== game.secretWord.length) {
              game.numberOfGuessesRemaining = 6;
            }
          }
          $('#numberOfGuessesRemaining').html(game.numberOfGuessesRemaining);
        }
      }
    }
  
  
    var scoreBoard = {
      gamesWon : 0,
      gamesLost : 0,
      incrementWinScore : function() {
        scoreBoard.gamesWon++;
        $('#number-of-games-won').html(scoreBoard.gamesWon);
      },
      incrementLoseScore : function() {
        scoreBoard.gamesLost++;
        $('#number-of-games-lost').html(scoreBoard.gamesLost);
      },
      resetScore : function() {
        scoreBoard.gamesWon = 0;
        scoreBoard.gamesLost = 0;
        $('#number-of-games-won').html(scoreBoard.gamesWon);
        $('#number-of-games-lost').html(scoreBoard.gamesLost);
      }
    };
  
  
  
    var hintThings = {
      getHint: function () {
        for (var i=0; i < secretWordStuff.wordBank.length; i++) {
          if (game.secretWord === secretWordStuff.wordBank[i]) {
            if (i <= 2) {
              hintThings.hint = 'food';
            } else if (i >2 && i <= 4) {
              hintThings.hint = 'developer terms';
            } else if (i > 4) {
              hintThings.hint = 'animals';
            }
            hintThings.showHint();
          }
        }
      },
      showHint: function() {
        $('#containerForHint').append("The hint is: "+hintThings.hint); //show the hint below the hidden letter list
      }
    };
  
    var buttonHandlers = {
      startClickHandler : function(event) {
        //  if (difficulty.difficultyLevel === 'easy' || difficulty.difficultyLevel ==='hard') {
        //   game.secretWord = secretWordStuff.generateRandomSecretWord();
        // } else if (difficulty.difficultyLevel === 'two-player') {
        //   game.secretWord = secretWordStuff.getSecretWordFromUser();
        // }
        game.startGame();
        // Change the Hangman display image source after the game starts
        $('#hangman-display').attr('src', '../static/images/Hangman-easy-6.png');
    },
      letterClickHandler : function (event) {
        event.stopPropagation();
        var $theClickedLetter = $(event.target);
        if (game.isOngoing === true && $theClickedLetter.attr('id') !== 'letterBoard') { //so nothing happens if user clicks on letterBoard parent div instead of letter button
          game.evaluateGuess($theClickedLetter.html(), game.secretWord);
          letterBoard.disableGuessedLetters($theClickedLetter);
        }
      },
      resetClickHandler : function (event) {
        if (game.isOngoing === true){
          if (confirm('Are you sure you want to reset the game?') === true) {
            game.resetGame();
          } else {
            return;
          }
        } else if (game.isOngoing === false) {
          game.resetGame();
        }
      },
      resetScoreBoardHandler : function(event) {
        scoreBoard.resetScore();
      },
      difficultyButtonHandler : function(event) {
        event.preventDefault();
        event.stopPropagation();
        var $theClickedDifficultyButton = $(event.target);
        //only change the difficulty if different from the current difficulty
        if ($theClickedDifficultyButton.attr('id') === difficulty.difficultyLevel) {
          return;
        } else if ($theClickedDifficultyButton.attr('id') !== difficulty.difficultyLevel) {
          difficulty.setDifficulty($theClickedDifficultyButton);
        }
      },
      hintButtonHandler : function (event){
        event.stopPropagation();
        hintThings.getHint();
        $('#hintButton').prop('disabled', true);
        $('#hintButton').addClass('disabled');
      }
    };
  
  
    $('#startButton').on('click', buttonHandlers.startClickHandler);
    $('#letterBoard').on('click', buttonHandlers.letterClickHandler);
    $('#resetButtonContainer').on('click', '#resetButton', buttonHandlers.resetClickHandler);
    $('#reset-score-board').on('click', buttonHandlers.resetScoreBoardHandler);
    $('.difficulty-button').on('click', buttonHandlers.difficultyButtonHandler);
    $('#containerForHiddenLetterList').on('click', '#hintButton', buttonHandlers.hintButtonHandler);
  
  
  });
  