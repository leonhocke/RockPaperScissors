import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
      this.load.image('logo', 'assets/phaser3-logo.png');
      this.load.image('scissors', 'assets/scissors.png');
      this.load.image('paper', 'assets/paper.png');
      this.load.image('rock', 'assets/rock.png');
      this.load.image('bg', 'assets/bg.png');
      this.load.image('reset', 'assets/reset.png');
      this.load.image('bar', 'assets/bar.png');
      this.load.spritesheet('winAnim', "assets/winAnim.png", { frameWidth: 800, frameHeight: 600 });
      this.load.spritesheet('loseAnim', "assets/loseAnim.png", { frameWidth: 800, frameHeight: 600 });
  }

    //these need to be accessible in multiple functions and persistent between rounds
    playerScore: number = 0;
    oppScore: number = 0;

    create() {
        //setup of a timer used later on to delay actions
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        //creates a background image underneath all other objects
        var bg = this.add.sprite(400, 300, 'bg');
        var bar = this.add.sprite(400, 55, 'bar');

        //creates the player and opponents score texts with the current scores - empty strings added for third and fourth text to be read as a string and not a number
        var playerScoreText = this.add.text(10, 10, "Player").setFontSize(22);
        var oppScoreText = this.add.text(680, 10, "Opponent").setFontSize(22);
        var playerScoreNumber = this.add.text(35, 40, "" + this.playerScore).setFontSize(40);
        var oppScoreNumber = this.add.text(720, 40, "" + this.oppScore).setFontSize(40);

        //the values that are compared later to determine the outcome, initialized as the string "none"
        var playerChoice: string = "none";
        var opponentCoice: string = "none";

        //clickable choices for the player
        const paper = this.add.image(400, 450, 'paper');
        const rock = this.add.image(200, 250, 'rock');
        const scissors = this.add.image(600, 250, 'scissors');
        const reset = this.add.image(70, 560, 'reset');

        //first header that displays prompt to chose an option
        const header = this.add.text(220, 20, "Please Start by selecting what to play!");

        //an array that holds the possible options for the opponent
        const choices: string[] = ["Rock", "Paper", "Scissors"];

        //sets the opponents choice equal to a randomly generated value between 0 & 2 ib the choices[] array
        opponentCoice = choices[Math.floor(Math.random() * 3)];
        console.log("Opponent chose " + opponentCoice); //for checking the console

        //this makes the images interactive
        paper.setInteractive();
        rock.setInteractive();
        scissors.setInteractive();
        reset.setInteractive();

        //resets the scores and restarts the round in the case that the round is in progress
        reset.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.playerScore = 0;
            this.oppScore = 0;

            playerScoreText.destroy();
            oppScoreText.destroy();
            paper.destroy();
            rock.destroy();
            scissors.destroy();
            header.destroy();
            reset.destroy();
            bg.destroy();
            bar.destroy();
            playerScoreNumber.destroy();
            oppScoreNumber.destroy();
            this.create();
        })

        //this determines what happens when the player clicks on the paper icon - comments are the same for all three choices
        paper.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            //adds a new, non-clickable image of the players chosen item
            const playerPaper = this.add.image(400, 450, 'paper');

            //destroys the old icons and the header prompt
            paper.destroy();
            rock.destroy();
            scissors.destroy();
            header.destroy();

            //sets the playerChoice string to chosen item
            playerChoice = "Paper";

            //displays a new text that tells the player what they chose
            var playerChoiceText = this.add.text(220, 20, "You selected " + playerChoice + "!");

            //if statements that determine what each of the possible opponents choices do - they only vary in their order, depending on what the player chose
            if (opponentCoice == "Paper") {
                //displays the result as text under the players choice text
                var resultText = this.add.text(220, 40, "It's a tie. You both chose " + playerChoice);
                //calls a function that makes the opponents chosen item fly in
                this.oppPap()
            }
            else if (opponentCoice == "Rock") {
                var resultText = this.add.text(220, 40, "You win!!! Your opponent chose " + opponentCoice);               
                this.oppRock();
                //delays for 2 seconds, then calls a function that displays a win screen and animation
                setTimeout(() => {
                    this.winAnim();
                }, 2000);
                //adds one to the players score
                this.scoreTracker(1, 0);
            }
            else if (opponentCoice == "Scissors") {
                var resultText = this.add.text(220, 40, "You lose! Your opponent chose " + opponentCoice);
                this.oppSciss();
                //delays for 2 seconds, then calls a function that displays a lose screen and animation
                setTimeout(() => {
                    this.loseAnim();
                }, 2000);
                //adds one to the opponents score
                this.scoreTracker(0, 1);
            }

            //makes the players chosen item move to a position on the left
            this.tweens.add({
                targets: playerPaper,
                y: 250,
                x: 200,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });

            //delays for 5 seconds (3 + the 2 seconds delay of win and lose animations), then destroys all items of the current round and calls the create() function again to restart
            setTimeout(() => {
                bg.destroy();
                playerScoreText.destroy();
                oppScoreText.destroy();
                resultText.destroy();
                playerChoiceText.destroy();
                playerPaper.destroy();
                bg.destroy();
                bar.destroy();
                playerScoreNumber.destroy();
                oppScoreNumber.destroy();
                this.create();
            }, 5000);
        });

        //same as before, except the rock choice has no tween to move the item to the left as it is already in that position
        rock.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            const PlayerRock = this.add.image(200, 250, 'rock');

            paper.destroy();
            rock.destroy();
            scissors.destroy();
            header.destroy();

            playerChoice = "Rock";

            var playerChoiceText = this.add.text(220, 20, "You selected " + playerChoice + "!");

            if (opponentCoice == "Paper") {
                var resultText = this.add.text(220, 40, "You lose! Your opponent chose " + opponentCoice);
                this.oppPap()
                setTimeout(() => {
                    this.loseAnim();
                }, 2000);
                this.scoreTracker(0, 1);
            }
            else if (opponentCoice == "Rock") {
                var resultText = this.add.text(220, 40, "It's a tie. You both chose " + playerChoice);                
                this.oppRock();
            }
            else if (opponentCoice == "Scissors") {
                var resultText = this.add.text(220, 40, "You win!!! Your opponent chose " + opponentCoice);               
                this.oppSciss();
                setTimeout(() => {
                    this.winAnim();
                }, 2000);
                this.scoreTracker(1, 0);
            }

            setTimeout(() => {
                playerScoreText.destroy();
                oppScoreText.destroy();
                resultText.destroy();
                playerChoiceText.destroy();
                PlayerRock.destroy();
                bg.destroy();
                bar.destroy();
                playerScoreNumber.destroy();
                oppScoreNumber.destroy();
                this.create();
            }, 5000);
        });

        scissors.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            const PlayerScissors = this.add.image(600, 250, 'scissors');

            paper.destroy();
            rock.destroy();
            scissors.destroy();
            header.destroy();

            playerChoice = "Scissors";

            var playerChoiceText = this.add.text(220, 20, "You selected " + playerChoice + "!");

            if (opponentCoice == "Paper") {                
                var resultText = this.add.text(220, 40, "You win!!! Your opponent chose " + opponentCoice);
                this.oppPap()
                setTimeout(() => {
                    this.winAnim();
                }, 2000);
                this.scoreTracker(1, 0);
            }
            else if (opponentCoice == "Rock") {
                var resultText = this.add.text(220, 40, "You lose! Your opponent chose " + opponentCoice);                
                this.oppRock();
                setTimeout(() => {
                    this.loseAnim();
                }, 2000);
                this.scoreTracker(0, 1);
            }
            else if (opponentCoice == "Scissors") {
                var resultText = this.add.text(220, 40, "It's a tie. You both chose " + playerChoice);
                this.oppSciss();
            }

            this.tweens.add({
                targets: PlayerScissors,
                y: 250,
                x: 200,
                duration: 1000,
                ease: 'Sine.inOut',
                yoyo: false,
                repeat: 0
            });  

            setTimeout(() => {
                playerScoreText.destroy();
                oppScoreText.destroy();
                resultText.destroy();
                playerChoiceText.destroy();
                PlayerScissors.destroy();
                bg.destroy();
                bar.destroy();
                playerScoreNumber.destroy();
                oppScoreNumber.destroy();
                this.create();
            }, 5000);
        });
    }

    //moves the scissors item icon from outside of the screen into a position on the right of the screen
    oppSciss() {
        const oppscissors = this.add.image(900, 250, 'scissors');

        //initialized so it can be used in this function
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        //moves the icon
        this.tweens.add({
            targets: oppscissors,
            y: 250,
            x: 600,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: false,
            repeat: 0
        });

        //waits and destroys the icon at the same time as the game restarts
        setTimeout(() => {
            oppscissors.destroy();
        }, 5001);
    }

    oppRock() {
        const opprock = this.add.image(900, 250, 'rock');
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        this.tweens.add({
            targets: opprock,
            y: 250,
            x: 600,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: false,
            repeat: 0
        });

        setTimeout(() => {
            opprock.destroy();
        }, 5001);
    }

    oppPap() {       
        const opppaper = this.add.image(900, 250, 'paper');
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        this.tweens.add({
            targets: opppaper,
            y: 250,
            x: 600,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: false,
            repeat: 0
        });

        setTimeout(() => {
            opppaper.destroy();
        }, 5001);
    }

    //takes the values from the create function whenever it isn't a tie and adds them to the values for the players and opponents scores
    scoreTracker(playerIncr: integer, oppIncr: integer) {
        this.playerScore = this.playerScore += playerIncr;
        this.oppScore = this.oppScore += oppIncr;
    }

    loseAnim() {
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        //adds a background image over the game
        var bg = this.add.sprite(400, 300, 'bg');

        //creates an animation from a preloaded spritesheet
        this.anims.create({
            key: 'loseAnim',
            frames: this.anims.generateFrameNumbers('loseAnim', {start: 0, end: 18}),
            frameRate: 12,
            repeat: -1
        });

        //plays that animation at the center of the screen
        var win = this.add.sprite(350, 300, 'loseAnim').play('loseAnim');

        //waits for the next round and destroys the bg and the animation
        setTimeout(() => {
            bg.destroy();
            win.destroy();
        }, 3001);
    }

    winAnim() {
        const timetoRestart = setTimeout(function callbackFunction() { }, 5000)

        var bg = this.add.sprite(400, 300, 'bg');

        this.anims.create({
            key: 'winAnim',
            frames: this.anims.generateFrameNumbers('winAnim', {start: 0, end: 17}),
            frameRate: 12,
            repeat: -1
        });

        var win = this.add.sprite(400, 300, 'winAnim').play('winAnim');

        setTimeout(() => {
            bg.destroy();
            win.destroy();
        }, 3001);
    }
}
