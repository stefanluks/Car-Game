import Game from '../componentes/Game.js';
import menu from '../telas/Menu.js';
import jogo from '../telas/jogo.js';

window.onload = () => {
    const canvas = document.getElementById('jogo');
    const ctx = canvas.getContext('2d');

    const game = new Game({
        nome: "Car game",
        dimensao: { x: canvas.width, y: canvas.height },
    });

    window.addEventListener('keydown', (e) => {
        game.teclasPressionada(e.key);
    });

    window.addEventListener('keyup', (e) => {
        game.teclasSolta(e.key);
    });

    game.nextLevel = () => {
        let nextLevel = document.createElement('div');
        nextLevel.className = "nextLevel";
        nextLevel.innerHTML = `Nível ${game.telaAtiva.nivel}`;
        document.querySelector("body").appendChild(nextLevel);
        let timer = setInterval(() => {
            nextLevel.remove();
            clearInterval(timer);
        }, 4000);
    };

    game.gameOver = () => {
        game.pause = true;
        let msg = document.createElement('div');
        msg.classList.add('msg');
        msg.id = "msg-caixa";
        msg.innerHTML = `<div class="caixa"><h1>Game Over</h1><p>Você fez ${game.pontos} pontos</p><button onclick="window.location.reload()">Reiniciar</button></div>`;
        document.querySelector("body").appendChild(msg);
    };

    game.AdicionarTela(menu);
    game.AdicionarTela(jogo);

    let nextLevel = document.createElement('div');
    nextLevel.className = "nextLevel";
    nextLevel.innerHTML = `Nível 01`;

    Loop();

    function Loop() {
        game.Atualizar();
        game.Desenhar(ctx);
        requestAnimationFrame(Loop);
    }
}