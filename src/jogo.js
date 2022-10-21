import Game from '../componentes/Game.js';
import menu from '../telas/Menu.js';
import jogo from '../telas/Jogo.js';

window.onload = () => {
    const canvas = document.getElementById('jogo');
    const ctx = canvas.getContext('2d');

    const game = new Game({
        nome: "Car game",
        dimensao: { x: canvas.width, y: canvas.height },
    });

    const saveGame = {
        nome: "SaveGame",
        urlPost: 'https://cargameranking.herokuapp.com/api/Saves/',
        PostSave(nome, pontos) {
            fetch(this.urlPost, {
                method: "POST",
                cors: "no-cors",
                dataType: "json",
                Accept: "application/json",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    pontos: pontos
                })
            }).then(res => res.json());
        }
    }

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

        let caixa = document.createElement('div');
        caixa.className = "caixa";

        let h1 = document.createElement('h1');
        h1.innerHTML = "Game Over";

        let p = document.createElement('p');
        p.innerHTML = `Você fez ${game.pontos} pontos`;

        let input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Digite seu nome:";
        input.className = "inputNome";

        let btnSave = document.createElement('button');
        btnSave.innerHTML = "Salvar";
        btnSave.className = "btnSave";
        btnSave.addEventListener('click', () => {
            if (input.value != "") {
                saveGame.PostSave(input.value, game.pontos);
                input.remove()
                btnSave.remove();
                p.innerHTML = "Salvo com sucesso!";
            }
        });

        let btn = document.createElement('button');
        btn.innerHTML = "Reiniciar";
        btn.onclick = () => {
            window.location.reload();
        };
        caixa.appendChild(h1);
        caixa.appendChild(p);
        caixa.appendChild(input);
        caixa.appendChild(btnSave);
        caixa.appendChild(btn);
        msg.appendChild(caixa);

        document.querySelector("body").appendChild(msg);
    };

    game.AdicionarTela(menu);
    game.AdicionarTela(jogo);

    Loop();

    function Loop() {
        game.Atualizar();
        game.Desenhar(ctx);
        requestAnimationFrame(Loop);
    }
}