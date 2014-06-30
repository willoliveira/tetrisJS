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
                    quadrado.className = "square";
                    //quadrado.className = "square " + row + "_" + col;
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
            Y = parseInt(currentPeca.elem.style.top)/25,
            m, cont = 0,
            pecas = currentPeca.elem.childNodes;
        //Rotaciona a matriz
        m = rotateMatriz(currentPeca.matriz);
        //Reposiciona a peça, se houver colisão com a parede
        if(Y + m.length > matriz.length)
            Y  = matriz.length - m.length;
        if(X + m[0].length > matriz[0].length)
            X = matriz[0].length - m[0].length;
        //Verifica se no lugar que a peça irá ocupar existe colisão, se não, quebra a função
        for(var r = Y, rLen = Y + m.length; r < rLen; r++) {
            for(var c = X, cLen = X + m[0].length; c < cLen; c++) {
                if(m[r - Y][c - X] == 1 && matriz[r][c] == m[r - Y][c - X])
                    return false;
            }
        }
        //Move as peças
        for(var r = 0, rLen = m.length; r < rLen; r++) {
            for(var c = 0, cLen = m[0].length; c < cLen; c++) {
                if(m[r][c] == 1) {
                    //Seta a posição dele dentro do container
                    pecas[cont].style.left = (c * 25) + "px";
                    pecas[cont].style.top  = (r * 25) + "px"; 
                    //Contador
                    cont++;
                }
            }
        }
        //Coloca a matriz alterada no objeto da peça atual
        currentPeca.matriz = m;
        //Reajusta o tamanho do container e a posição
        currentPeca.elem.style.left = (X * 25) + "px";
        currentPeca.elem.style.top  = (Y * 25) + "px";        
        currentPeca.elem.style.width  = (currentPeca.matriz[0].length * 25) + "px";
        currentPeca.elem.style.height = (currentPeca.matriz.length * 25) + "px";  
        
    }
    
    function rotateMatriz(eMatriz) {
        //A matriz que vou usar pra inverter
        var m = [];
        //Rotaciona a matriz da peça | TODO: Colocar isso em uma função depois, deixar mais top a rotação da matriz
        for(var r = 0; r < eMatriz[0].length; r++ ) {
            //Adiciona uma linha na matriz
            m[r] = [];
            for(var c = eMatriz.length-1, cont = 0; c > -1; cont++, c--) {
                m[r][cont] = eMatriz[c][r];
            }
        }
        return m;
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
        currentPeca.elem.style.top = "-" + ((currentPeca.matriz.length) * 25) + "px";
        currentPeca.elem.style.left = "75px";
        //Enter frame
//        idInterval = setInterval(function(){ 
//            move(0, 1); 
//        }, 450);
    }
    
    function removePeca () {
        //Pega a posicao atual do role
        var X = parseInt(currentPeca.elem.style.left)/25,
            Y = parseInt(currentPeca.elem.style.top)/25,
            peca,
            pecas,
            cont = 0;
        //Se a peça tiver ficado pra fora do container do jogo, GAME OVER
        if(Y < 0) {
            console.log("GAME OVER!!!");
            endGame();
            return false;
        }
        //Matriz da peça atual
        peca = currentPeca.matriz;
        //Childs do container da peça
        pecas = $(currentPeca.elem).children();
        //Altera a matriz, com os espaços ocupados pela ultima peça
        for(var row = Y, lenRow = Y + peca.length; row < lenRow; row++) {
            for(var col = X, lenCol = X + peca[0].length; col < lenCol; col++) {
                if(peca[row - Y][col - X] == 1) {
                    //Coloca a colisao que a peça ocupou na matriz
                    matriz[row][col] = 1;
                    //Remove ela do container e adiciona no seu pai
                    $(pecas[cont]).remove();
                    $("#pecas").append($(pecas[cont]));
                    //Reposiciono a peça e troco seu Class CSS, que é sua identificação
                    $(pecas[cont])
                        .css({top :(row * 25) + "px", left : (col * 25) + "px"})
                        .addClass(row + "_" + col);
                    cont++;
                }
            }
        }
        //Removo o container vazio da peça
        $(currentPeca.elem).remove();
        //Verifica se eu preenchi uma linha
        verifyPoint(Y);
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Adiciona uma peca
        addPeca();
    }
    function endGame() {
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Remove todas as peças
        $("#pecas").html("");
        //
        tetrisJS.init();
    }
    /**
     * 
     * @param {type} linha
     */
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
    
    /**
     * 
     * @param {type} row
     */
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
            contador = 0,
            len, 
            peca = currentPeca.matriz;
        //Teste para não deixar ele sair das paredas do tetris
        if ((x + peca[0].length > matriz[0].length) || x < 0 || y + peca.length > matriz.length ) {
            //Se encostou no fundo, adiciona outra peça
            if(dir[1] === 1) {
                removePeca();
            }
            return false;
        }         
        //Movimentando no eixo X
        if (dir[1] === 0) { // row++    
            col = dir[0] === -1 ? 0 : peca[0].length - 1;
            len = peca.length;
            //TODO: Ver isso ainda, foda :/
            if(y < 0){
                col += Math.abs(y);
                contador = Math.abs(y);
                y = 0;
            }
        } 
        //Movimentando no eixo Y
        else { // col++

            row = dir[1] === -1 ? 0 : peca.length - 1;
            len = peca[0].length;
            //if(y < 0) row += Math.floor(y)
        }
        //Varro a coluna ou a linha da direção que vou morrer a peça, comparando com a matriz de colisão
        // dir[0] => Movimentação em X => (-1 LEFT | 1 RIGHT)
        // dir[1] => Movimentação em Y
        for (var contador = 0; contador < len; contador++, dir[0] === 0 ? col++ : row++) {
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
                        if(rowTop > 0 && matriz[rowTop + y][col + x] === 1 && peca[rowTop][col] === 1) {
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
        
    tetrisJS.init();
});