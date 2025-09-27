class WordleGame {
    constructor() {
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.words = [
            'PYTHON', 'CODIGO', 'JUEGOS', 'LETRAS', 'COLORES', 'NUMEROS',
            'FLORES', 'MUSICA', 'PELOTA', 'CAMINO', 'TIEMPO', 'ESPEJO',
            'LIBROS', 'CIUDAD', 'MONTAÑA', 'OCEANO', 'FUEGO', 'TIERRA'
        ];
        
        this.targetWord = this.getRandomWord();
        this.gameBoard = document.getElementById('game-board');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        
        this.initializeBoard();
        this.initializeKeyboard();
        this.addEventListeners();
    }

    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    initializeBoard() {
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            for (let j = 0; j < 6; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            
            this.gameBoard.appendChild(row);
        }
    }

    initializeKeyboard() {
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];

        rows.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.className = 'key';
                keyElement.textContent = key === 'BACKSPACE' ? '⌫' : key;
                keyElement.dataset.key = key;
                
                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('wide');
                }
                
                keyElement.addEventListener('click', () => this.handleKeyPress(key));
                keyboardRow.appendChild(keyElement);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            const key = e.key.toUpperCase();
            
            if (key === 'ENTER') {
                this.handleKeyPress('ENTER');
            } else if (key === 'BACKSPACE') {
                this.handleKeyPress('BACKSPACE');
            } else if (/^[A-ZÑ]$/.test(key)) {
                this.handleKeyPress(key);
            }
        });
    }

    handleKeyPress(key) {
        if (this.gameOver) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (this.currentCol < 6) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentCol < 6) {
            const cell = document.getElementById(`cell-${this.currentRow}-${this.currentCol}`);
            cell.textContent = letter;
            cell.classList.add('filled');
            this.currentCol++;
        }
    }

    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            const cell = document.getElementById(`cell-${this.currentRow}-${this.currentCol}`);
            cell.textContent = '';
            cell.classList.remove('filled');
        }
    }

    submitGuess() {
        if (this.currentCol !== 6) {
            this.showMessage('¡Completa la palabra!');
            return;
        }

        const guess = this.getCurrentGuess();
        this.evaluateGuess(guess);
        
        if (guess === this.targetWord) {
            this.showMessage('¡Felicitaciones! ¡Ganaste!', 'win');
            this.gameOver = true;
        } else if (this.currentRow === 5) {
            this.showMessage(`¡Perdiste! La palabra era: ${this.targetWord}`, 'lose');
            this.gameOver = true;
        } else {
            this.currentRow++;
            this.currentCol = 0;
        }
    }

    getCurrentGuess() {
        let guess = '';
        for (let i = 0; i < 6; i++) {
            const cell = document.getElementById(`cell-${this.currentRow}-${i}`);
            guess += cell.textContent || '';
        }
        return guess;
    }

    evaluateGuess(guess) {
        const targetArray = this.targetWord.split('');
        const guessArray = guess.split('');
        const result = new Array(6).fill('absent');
        
        // Marcar letras correctas en posición correcta
        for (let i = 0; i < 6; i++) {
            if (guessArray[i] === targetArray[i]) {
                result[i] = 'correct';
                targetArray[i] = '';
                guessArray[i] = '';
            }
        }
        
        // Marcar letras correctas en posición incorrecta
        for (let i = 0; i < 6; i++) {
            if (guessArray[i] && targetArray.includes(guessArray[i])) {
                result[i] = 'present';
                const index = targetArray.indexOf(guessArray[i]);
                targetArray[index] = '';
            }
        }
        
        // Aplicar colores a las celdas
        for (let i = 0; i < 6; i++) {
            const cell = document.getElementById(`cell-${this.currentRow}-${i}`);
            cell.classList.add(result[i]);
            
            // Actualizar teclado
            const keyElement = document.querySelector(`[data-key="${guess[i]}"]`);
            if (keyElement) {
                const currentClass = keyElement.className;
                if (!currentClass.includes('correct') && result[i] === 'correct') {
                    keyElement.classList.remove('present', 'absent');
                    keyElement.classList.add('correct');
                } else if (!currentClass.includes('correct') && !currentClass.includes('present') && result[i] === 'present') {
                    keyElement.classList.remove('absent');
                    keyElement.classList.add('present');
                } else if (!currentClass.includes('correct') && !currentClass.includes('present')) {
                    keyElement.classList.add('absent');
                }
            }
        }
    }

    showMessage(text, className) {
        this.message.textContent = text;
        this.message.className = className || '';
        
        setTimeout(() => {
            this.message.textContent = '';
            this.message.className = '';
        }, 3000);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});