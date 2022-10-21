export default class Game {
    constructor({ nome, dimensao, telas = [] }) {
        this.nome = nome;
        this.dimensao = dimensao;
        this.telas = telas;
        this.frames = 0;
        this.telaAtiva = null;
        this.pontos = 0;
    }

    AdicionarTela(tela) {
        tela.game = this;
        this.telas.push(tela);
    }

    proxTela() {
        let indice = 0;
        this.telas.forEach((tela, index) => {
            if (tela == this.telaAtiva) indice = index;
        });
        this.telaAtiva.ativo = false;
        this.telaAtiva = this.telas[indice + 1];
        this.telaAtiva.ativo = true;
    }

    teclasPressionada(tecla) {
        this.telaAtiva.teclaPressionada(tecla);
    }

    teclasSolta(tecla) {
        this.telaAtiva.teclaSolta(tecla);
    }

    Atualizar() {
        this.frames++;
        if (this.telas.length > 0) {
            this.telas.forEach(tela => {
                if (tela.ativo) this.telaAtiva = tela;
            });
        }

        if (this.telaAtiva != null) this.telaAtiva.Atualizar(this.dimensao);
    }

    Desenhar(ctx) {
        if (this.telaAtiva != null) {
            this.telaAtiva.Draw(ctx, this.dimensao);
        }
    }
}