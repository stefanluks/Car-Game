export default class Tela {
    constructor(nome, ativo) {
        this.nome = nome;
        this.ativo = ativo;
        this.teclasDown = {};
        this.teclasUp = {};
    }

    Atualizar() {
        console.log("Atualizando tela " + this.nome);
    }

    teclaPressionada(tecla) {
        let btn = this.teclasDown[tecla];
        if (btn) btn();
    }

    teclaSolta(tecla) {
        let btn = this.teclasUp[tecla];
        if (btn) btn();
    }

    Draw(ctx, dimensao) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, dimensao.x, dimensao.y);
        ctx.fillStyle = 'white';
        ctx.font = '70px Arial';
        ctx.fillText(this.nome, dimensao.x / 2 - 70, dimensao.y / 2);
    }
}