import Tela from '../componentes/Tela.js';

const ranking = {
    nome: "ranking",
    rank: [],
    frame: 0,
    urlTop10: 'https://cargameranking.herokuapp.com/api/GetTop10/',
    draw(ctx, dimensao) {
        this.frame++;
        // console.log(this.rank)
        if (this.rank.length > 0) {
            // ctx.fillStyle = 'gray';
            // ctx.fillRect(30, dimensao.y - (dimensao.y / 2), 150, 100);
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.fillText("Ranking", 30, dimensao.y - (dimensao.y / 2));
            for (let i = 0; i < 10; i++) {
                ctx.font = '15px Arial';
                if (i < this.rank.length) {
                    let item = this.rank[i];
                    ctx.fillText(item.pos + "° lugar: " + item.nome + " com " + item.pontos + " pontos", 30, dimensao.y - (dimensao.y / 2) + ((i + 1) * 20));
                } else {
                    ctx.fillText((i + 1) + "° lugar: -- ", 30, dimensao.y - (dimensao.y / 2) + ((i + 1) * 20));
                }
            }
            this.rank.forEach((item, index) => {});
        } else {
            let titulo = "Carregando ranking.";
            if (this.frame % 100 == 0) {
                titulo += ".";
            };
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.fillText(titulo, 30, dimensao.y - (dimensao.y / 2));
        }
    },
    GetRanking() {
        fetch(this.urlTop10, {
            method: "GET",
            cors: "no-cors",
            dataType: "json",
            Accept: "application/json",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(res => {
            this.rank = res;
        });
    }
}

// ranking.GetRanking();

const menu = new Tela("Menu", true, ranking);

menu.faixas = [
    { y: 0, largura: 25, altura: 80 },
    { y: 120, largura: 25, altura: 80 },
    { y: 240, largura: 25, altura: 80 },
    { y: 360, largura: 25, altura: 80 },
    { y: 480, largura: 25, altura: 80 }
];

let img = new Image();
img.src = "./assets/carro.png";

menu.carro = {
    img: img,
    img_w: 260,
    img_h: 650,
    largura: 50,
    altura: 100,
    x: 537,
    y: 600,
    virandoEsq: true,
    virandoDir: false
}

menu.Atualizar = (dimensao) => {
    menu.faixas.forEach((faixa, index) => {
        faixa.y += 5;
        if (faixa.y > dimensao.y + faixa.altura) menu.faixas.splice(index, 1);
    });
    let ult = menu.faixas[menu.faixas.length - 1];
    if (ult.y >= ult.altura) menu.faixas.push({ y: -80, largura: 25, altura: 80 })

    if (menu.carro.y > dimensao.y - (menu.carro.altura + 25)) menu.carro.y -= 5;
    if (menu.carro.virandoEsq && menu.carro.x > 437) menu.carro.x -= 1;
    if (menu.carro.virandoEsq && menu.carro.x == 437) {
        menu.carro.virandoEsq = false;
        menu.carro.virandoDir = true;
    }
    if (menu.carro.virandoDir && menu.carro.x == 537) {
        menu.carro.virandoDir = false;
        menu.carro.virandoEsq = true;
    }
    if (menu.carro.virandoDir && menu.carro.x < 537) menu.carro.x += 1;
};

menu.Draw = (ctx, dimensao) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, dimensao.x, dimensao.y);
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, dimensao.x / 4, dimensao.y);
    ctx.fillRect(dimensao.x - dimensao.x / 4, 0, dimensao.x / 4, dimensao.y);
    // Pista!!
    ctx.fillStyle = '#3d3d3d';
    ctx.fillRect(dimensao.x / 2 - ((dimensao.x / 5) / 2), 0, dimensao.x / 5, dimensao.y);
    // Faixas!!
    menu.faixas.forEach(faixa => {
        ctx.fillStyle = 'white';
        ctx.fillRect(dimensao.x / 2 - (faixa.largura / 2), faixa.y, faixa.largura, faixa.altura);
    });

    ctx.font = '70px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText("Car Game", dimensao.x / 50, dimensao.y / 4);
    ctx.fillStyle = 'white';
    ctx.fillText("Car Game", dimensao.x / 50 + 5, dimensao.y / 4 + 5);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Aperte enter para jogar!", dimensao.x / 12, dimensao.y / 3 + 10);

    ctx.fillStyle = 'white';
    ctx.font = '35px Arial';
    ctx.fillText("Controles", dimensao.x - 200, dimensao.y - 150);
    ctx.font = '15px Calibri';
    ctx.fillText("< Setas > para mover o carro para", dimensao.x - 220, dimensao.y - 120);
    ctx.fillText("direita e esquerda.", dimensao.x - 220, dimensao.y - 100);
    ctx.fillText("( P ) Pause", dimensao.x - 150, dimensao.y - 80);

    //carro
    // ctx.fillStyle = 'red';
    // ctx.fillRect(menu.carro.x, menu.carro.y, menu.carro.largura, menu.carro.altura);
    ctx.drawImage(menu.carro.img, 0, 0, menu.carro.img_w, menu.carro.img_h, menu.carro.x, menu.carro.y, menu.carro.largura, menu.carro.altura);

    //ranking
    if (menu.adicional != null) menu.adicional.draw(ctx, dimensao);
};

menu.teclasDown = {
    Enter: () => {
        menu.game.proxTela();
    }
}

export default menu;