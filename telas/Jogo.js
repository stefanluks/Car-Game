import Tela from '../componentes/Tela.js';

const jogo = new Tela("Jogo", false);

jogo.objetivo = 0;
jogo.nivel = 0;
jogo.liberarEnimigos = false;

jogo.faixas = [
    { y: 0, largura: 25, altura: 80 },
    { y: 120, largura: 25, altura: 80 },
    { y: 240, largura: 25, altura: 80 },
    { y: 360, largura: 25, altura: 80 },
    { y: 480, largura: 25, altura: 80 }
];

jogo.blocos = [
    { y: 0, largura: 50, altura: 80 },
    { y: 120, largura: 180, altura: 80 },
    { y: 240, largura: 200, altura: 80 },
    { y: 360, largura: 130, altura: 80 },
    { y: 480, largura: 60, altura: 80 }
];

let img = new Image();
img.src = "./assets/carro.png";

jogo.carro = {
    img: img,
    img_w: 260,
    img_h: 550,
    largura: 50,
    altura: 100,
    x: 537,
    y: 600,
    virandoEsq: false,
    virandoDir: false,
}

let posicoes = [-75, 25];

jogo.enimigos = [
    { x: 537, y: -100, largura: 50, altura: 100 }
];

function Controlefaixas(faixas, altura) {
    faixas.forEach((faixa, index) => {
        faixa.y += 5;
        if (faixa.y > altura + faixa.altura) faixas.splice(index, 1);
    });
    let ult = faixas[faixas.length - 1];
    if (ult.y >= ult.altura) faixas.push({ y: -80, largura: 25, altura: 80 })
}

function Cenario(blocos, altura) {
    blocos.forEach((bloco, index) => {
        bloco.y += 5;
        if (bloco.y < -bloco.altura) blocos.splice(index, 1);
    });
    let ult = blocos[blocos.length - 1];
    if (ult.y > ult.altura) blocos.push({ y: -80, largura: Math.floor(Math.random() * 280), altura: 80 })
}

function controlePontos() {
    if (jogo.game.pontos >= jogo.objetivo + (jogo.nivel * 2) * 5) {
        jogo.nivel++;
        jogo.objetivo = (jogo.nivel * 2) * 5;
        jogo.game.nextLevel();
    }
}

function colidio(carro, enimigos) {
    let colidiu = false;
    enimigos.forEach(enimigo => {
        if (carro.x < enimigo.x + enimigo.largura &&
            carro.x + carro.largura > enimigo.x &&
            carro.y < enimigo.y + enimigo.altura &&
            carro.y + carro.altura > enimigo.y) {
            colidiu = true;
        }
    });
    return colidiu;
}

jogo.Atualizar = (dimensao) => {
    if (!jogo.game.pause) {
        Controlefaixas(jogo.faixas, dimensao.y);
        Cenario(jogo.blocos, dimensao.y);
        controlePontos();

        if (jogo.carro.y > dimensao.y - (jogo.carro.altura + 20)) jogo.carro.y -= 3;
        else jogo.liberarEnimigos = true;

        if (jogo.carro.virandoEsq && jogo.carro.x > 437) jogo.carro.x -= 5;
        if (jogo.carro.virandoDir && jogo.carro.x < 537) jogo.carro.x += 5;

        if (jogo.liberarEnimigos) {
            jogo.enimigos.forEach((enimigo, index) => {
                enimigo.y += jogo.nivel * 2;
                if (enimigo.y > dimensao.y + 10) {
                    jogo.enimigos.splice(index, 1);
                    jogo.game.pontos++;
                }
            });
            let ult = jogo.enimigos[jogo.enimigos.length - 1];
            if (ult.y > dimensao.y / 2) jogo.enimigos.push({ x: dimensao.x / 2 + posicoes[(Math.floor(Math.random() * 2))], y: -100, largura: 50, altura: 100 });
        }

        if (colidio(jogo.carro, jogo.enimigos)) {
            jogo.game.gameOver();
        }
    }
};

let enimigoImg = new Image();
enimigoImg.src = "./assets/carro2.png";

jogo.Draw = (ctx, dimensao) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, dimensao.x, dimensao.y);
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, dimensao.x / 4, dimensao.y);
    ctx.fillRect(dimensao.x - dimensao.x / 4, 0, dimensao.x / 4, dimensao.y);
    // Pista!!
    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(dimensao.x / 2 - ((dimensao.x / 5) / 2), 0, dimensao.x / 5, dimensao.y);
    // Faixas!!
    jogo.faixas.forEach(faixa => {
        ctx.fillStyle = 'white';
        ctx.fillRect(dimensao.x / 2 - (faixa.largura / 2), faixa.y, faixa.largura, faixa.altura);
    });
    // Cenario!!
    jogo.blocos.forEach(bloco => {
        ctx.fillStyle = '#053105';
        ctx.fillRect(0, bloco.y, bloco.largura, bloco.altura);
        ctx.fillRect(dimensao.x - bloco.largura, bloco.y, bloco.largura, bloco.altura);
    });
    // Carro!! Player
    // ctx.fillStyle = 'red';
    // ctx.fillRect(jogo.carro.x, jogo.carro.y, jogo.carro.largura, jogo.carro.altura);
    ctx.drawImage(jogo.carro.img, 0, 0, jogo.carro.img_w, jogo.carro.img_h, jogo.carro.x, jogo.carro.y, jogo.carro.largura, jogo.carro.altura);

    // Enimigos!!
    jogo.enimigos.forEach(enimigo => {
        // ctx.fillStyle = 'blue';
        // ctx.fillRect(enimigo.x, enimigo.y, enimigo.largura, enimigo.altura);
        ctx.drawImage(enimigoImg, 0, 0, 260, 550, enimigo.x, enimigo.y, enimigo.largura, enimigo.altura);
    });

    // Pontos!!
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Nivel: " + jogo.nivel, 10, 30);
    ctx.fillText("Pontos: " + jogo.game.pontos, 10, 60);
    ctx.font = '20px Arial';
    if (jogo.game.pause) ctx.fillText("pause", 10, 90);
};

jogo.teclasDown = {
    ArrowLeft: () => {
        jogo.carro.virandoEsq = true;
    },
    ArrowRight: () => {
        jogo.carro.virandoDir = true;
    },
    p: () => {
        jogo.game.pause = !jogo.game.pause;
    }
}

jogo.teclasUp = {
    ArrowLeft: () => {
        jogo.carro.virandoEsq = false;
    },
    ArrowRight: () => {
        jogo.carro.virandoDir = false;
    }
}

export default jogo;