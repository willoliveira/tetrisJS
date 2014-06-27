(function(){
    
    /**
     * TODO: Fazer randomizar as cores e nao trazer a peça duas vezes seguidas
     */
    var tetrisJS = { }, 
        matriz = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        pecas = [
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 0, 0],
            [1, 1, 1]
        ],
        [
            [0, 0, 1],
            [1, 1, 1]
        ],
        [
            [1, 1, 1, 1]
        ]],
        cores = ['red', 'green', 'blue', 'yellow', 'orange', 'gray', 'white', 'pink', 'purple'],
        keys = { }, 
        //Peça atual
        currentPeca = { elem:"", matriz:"" },
        indicePeca,
        
        idInterval;
        
    /*
     * Controi o grid do Tetris
     * TODO: Fazer a função que constroi todo o grid do jogo
     */
    function montarGrid() { }
    
    /**
     * Construtor
     */
    tetrisJS.init = function() {
        //Monta o grid do jogo
        //montarGrid();
        addPeca();       
    };
    
    /*
     * KeyDown
     * @param {type} e
     */
    function onKeyDown(e) {
        //Testa se a tecla esta sendo pressionada
        //if(!(e.keyCode in keys)){
            switch (e.keyCode){
                //LEFT
                case 37:
                    move(-1, 0);
                    break;
                //UP Mudar a posicao da peca
                case 38:
                    //move(0, -1);
                    girarPeca();
                    break;
                //RIGHT
                case 39:
                    move(1, 0);
                    break;
                //DOWN
                case 40:
                    move(0, 1);
                    break;
            }
        //}
        keys[e.keyCode] = true;
    }
    
    /*
     * KeyUp
     * @param {type} e
     */
    function onKeyUp(e) {
        delete keys[e.keyCode];
    }
    
    /*
     * Monta uma peça
     * @param {type} matrizPeca
     * @returns {Element}
     */
    function montarPeca(matrizPeca) {        
        //Container
        var container = document.createElement('div'),
        //Sorteia uma cor | Ta na gambs ainda
            cor = cores[parseInt((cores.length - 1) * Math.random())];;
        container.style.width  = (matrizPeca[0].length * 25) + "px";
        container.style.height = (matrizPeca.length * 25) + "px";
        container.style.position = 'absolute';
        //Varre a matriz da peca
        for(var row = 0, lenRow = matrizPeca.length; row < lenRow; row++) {
            for(var col = 0, lenCol = matrizPeca[0].length; col < lenCol; col++) {
                //
                if(matrizPeca[row][col] == 1) {
                    //Quadrado
                    var quadrado = document.createElement("div");
                    container.appendChild(quadrado);
                    //
                    quadrado.className = "square " + row + "_" + col;
                    quadrado.style.backgroundColor = cor;
                    //
                    quadrado.style.top  = (row * 25) + "px";
                    quadrado.style.left = (col * 25) + "px";
                }
            }
        }
        //Retorna a peça
        return container;
    }
    
    /**
     * Gira uma peça
     */
    function girarPeca() {
        //Coordenada em que a peça esta
        var X = parseInt(currentPeca.elem.style.left)/25,
            Y = parseInt(currentPeca.elem.style.top)/25;
        //A matriz que vou usar pra inverter
        var m = [];
       //Transformo a linha
        for(var r = 0; r < currentPeca.matriz[0].length; r++ ) {
            //Adiciona uma linha
            m[r] = [];
            for(var c = currentPeca.matriz.length-1, cont = 0; c > -1; cont++, c--) {
                //Se houver um square nessa posição
                if(currentPeca.matriz[c][r] == 1) {
                    //Pega o elemento pelo class, que é a sua coordenada dentro do container
                    var elem = $("." + c + "_" + r);
                    //Seta a posição dele dentro do container
                    elem.css({top: (r * 25) + "px", left: (cont * 25) + "px"});
                    //Remove a class da posição, pois ela mudou
                    elem.removeClass(c + "_" + r);                   
                }
                m[r][cont] = currentPeca.matriz[c][r];
            }
        }
        //Coloca a matriz alterada no objeto da peça atual
        currentPeca.matriz = m;
        //Reajusta o tamanho do container
        currentPeca.elem.style.width  = (currentPeca.matriz[0].length * 25) + "px";
        currentPeca.elem.style.height = (currentPeca.matriz.length * 25) + "px";        
        //Setar os class nos quadrados de novo
        for(var cont = 0; cont < $(currentPeca.elem).children().length; cont++ ) {
            //Varre os filhos do container, e seta o class novo, pega a coordenada pela posição de cada quadrado
            var elem = $(currentPeca.elem).children()[cont], 
                X = parseInt(elem.style.left)/25,
                Y = parseInt(elem.style.top)/25;
            $(elem).addClass(Y + "_" + X);
        }
    }
    
    /*
     * 
     * Adiciona uma peça na tela
     */
    function addPeca() {
        //Randomiza a peça que vai entrar
        indicePeca = Math.floor(Math.random() * pecas.length);        
        //Pega a peça atual
        currentPeca.elem = montarPeca(pecas[indicePeca]);
        currentPeca.matriz = pecas[indicePeca];
        //Adiciona no stage
        document.getElementById('pecas').appendChild(currentPeca.elem);
        //Eventos
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        //Onde ele vai iniciar
        currentPeca.elem.style.top = "-25px";
        currentPeca.elem.style.left = "75px";
        //Enter frame
        idInterval = setInterval(function(){ 
            move(0, 1); 
        }, 450);
    }
    
    function removePeca () {
        console.log("removePeca()");
        //Pega a posicao atual do role
        var X = parseInt(currentPeca.elem.style.left)/25,
            Y = parseInt(currentPeca.elem.style.top)/25,
            peca = currentPeca.matriz;
        //Altera a matriz, com os espaços ocupados pela ultima peça
        for(var row = Y, lenRow = Y + peca.length; row < lenRow; row++) {
            for(var col = X, lenCol = X + peca[0].length; col < lenCol; col++) {
                if(peca[row - Y][col - X] == 1) {
                    //Coloca a colisao que a peça ocupou na matriz
                    matriz[row][col] = 1;
                    //Faz um cache da peça
                    var elem = $("." + (row - Y) + "_" + (col - X));
                    //Remove ela e adiciona no seu pai
                    elem.remove();
                    //Adiciono a peça no seu pai, tiro ela do container
                    $("#pecas").append(elem);
                    //Reposiciono a peça e troco seu Class CSS, que é sua identificação
                    elem.css({top :(row * 25) + "px", left : (col * 25) + "px"})
                        .removeClass((row - Y) + "_" + (col - X))
                        .addClass(row + "_" + col);
                }
            }
        }
        //Removo o container vazio da peça
        $(currentPeca.elem).remove();
        //
        verifyPoint(Y);
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Adiciona uma peca
        addPeca();
    }
    
    function verifyPoint(linha) {
        //Se houver algum espaço vazio na linha, falo pra voltar no primeiro for
        linha:
        //Varrendo a linha da matriz
        for(var row = linha, lenRow = matriz.length; row < lenRow; row++) {
            //Varrendo a coluna da matriz
            for(var col = 0, lenCol = matriz[0].length; col < lenCol; col++) {
                //Se houver um espaço em branco, volto pro for da linha
                if(matriz[row][col] == 0) continue linha;
            }
            //Se chegar aqui, não há espaços vazios na linha, então ela pode ser removida
            removeLinhaMatriz(row);
        }
    }
    
    function removeLinhaMatriz(row) {
        //Varre a linha e remove os tiles
        for(var col = 0, lenCol = matriz[0].length; col < lenCol; col++)
            //Remove os tiles fisicos
            $("." + row + "_" + col).remove();
        //Removo a linha da matriz
        matriz.splice(row, 1);
        //Adiciona uma linha no começo da matriz
        matriz.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        //Varre as peças que estão nos stage, e confiram elas
        for(var cont = 0; cont < $("#pecas").children().length; cont++) {
            //Pega a coordenada pela posição de cada quadrado
            var elem = $("#pecas").children()[cont],
                colTop = parseInt(elem.style.left)/25,
                rowTop = parseInt(elem.style.top)/25;
            if(rowTop < row) {
                //Reposiciono a peça e troco seu Class CSS, que é sua identificação
                $(elem).css({top :((rowTop + 1) * 25) + "px", left : (colTop * 25) + "px"})
                       .removeClass(rowTop + "_" + colTop)
                       .addClass((rowTop + 1) + "_" + colTop);
           }
        }
    }
    /*
     * 
     * @param {type} x Direcao em X
     * @param {type} y Direcao em Y
     */
    function move(x, y) {
        //Pega a posicao atual do role
        var left = parseInt(currentPeca.elem.style.left),
            top = parseInt(currentPeca.elem.style.top),
            destX = (left/25) + x,
            destY = (top/25) + y;        
        if(checkCollision(destX, destY, [x, y]) ) {
            //Move a peça para a região desejada
            currentPeca.elem.style.left = left + (x * 25) + "px";
            currentPeca.elem.style.top = top + (y * 25) + "px";
        }
    }
    
    /**
     * Verifica se posso me mover
     * @param {type} x Ponto X na matriz que eu quero ir
     * @param {type} y Ponto Y na matriz que eu quero ir
     * @param {type} dir Array com a direção que quero ir
     */
    function checkCollision(x, y, dir) {
        var col = 0, colTop, 
            row = 0, rowTop,
            len, 
            peca = currentPeca.matriz;
        //Teste para não deixar ele sair das paredas do tetris
        if ((x + peca[0].length > matriz[0].length) || x < 0 || y + peca.length > matriz.length || y < 0) {
            //Se encostou no fundo, adiciona outra peça
            if(dir[1] === 1) removePeca();
            return false;
        } 
        //Movimentando no eixo X
        if (dir[1] === 0) { // row++
            col = dir[0] === -1 ? 0 : peca[0].length - 1;
            len = peca.length;
        } 
        //Movimentando no eixo Y
        else { // col++
            row = dir[1] === -1 ? 0 : peca.length - 1;
            len = peca[0].length;
        }       
        //Varro a coluna ou a linha da direção que vou morrer a peça, comparando com a matriz de colisão
        // dir[0] => Movimentação em X => (-1 LEFT | 1 RIGHT)
        // dir[1] => Movimentação em Y
        for (var cont = 0; cont < len; cont++, dir[0] === 0 ? col++ : row++) {            
            //Se for 0, verifico diferente a colisa, vejo no proximo ponto se existe colisao
            if( peca[row][col] === 0) {
                //Varrendo aqui o role ...Nem sei como vou explicar isso aqui...
                if(dir[1] === 0) {
                    //Pega por qual coluna vou começar a varrer
                    colTop = dir[0] == -1 ? 0 : peca[0].length - 1;
                    //Varre a linha da peça, procurando por alguma colisão
                    for (var i = 0, lenTop = peca[0].length; i < lenTop;i++, dir[0] == -1 ? colTop++ : colTop--) {
                        //compara pra ver ser vai colidir
                        if(matriz[row + y][colTop + x] === 1 && peca[row][colTop] === 1)
                            return false;
                    }
                } else if(dir[0] === 0) {
                    //Pega por qual linha vou começar a varrer
                    rowTop = dir[1] == -1 ? 0 : peca.length - 1;
                    //Varre a coluna da peça, procurando por alguma colisão
                    for (var i = 0, lenTop = peca.length; i < lenTop;i++, dir[1] == -1 ? rowTop++ : rowTop--) {
                        //compara pra ver ser vai colidir
                        if(matriz[rowTop + y][col + x] === 1 && peca[rowTop][col] === 1) {
                            //Colidiu com o chão
                            removePeca();
                            return false;
                        }
                    }
                }
                //Se não houver nenhuma colisão, continua o for
                continue;
            }
            //Verifica se é possivel andar, na posição que desejo ir
            if(matriz[row + y][col + x] === 1) {
                //Se encostou no fundo, adiciona outra peça
                if(dir[1] === 1) removePeca();
                return false;
            }
        }
        return true;
    }
    
    window.tetrisJS = tetrisJS;
}());


$(document).ready(function() {
    
    
    
    
    var matrizTop = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],        
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3],
        [3, 3, 3, 3, 3, 3, 3, 3, 3]
    ]
    matrizTop.splice(4, 1)
//    matrizTop.unshift([4, 4, 4, 4, 4, 4, 4, 4, 4]);
    
    console.log(matrizTop)
    
    
    tetrisJS.init();
});










