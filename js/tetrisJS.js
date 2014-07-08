(function(){
    
    /**
     * TODO: Fazer randomizar as cores e nao trazer a peça duas vezes seguidas
     */
    var tetrisJS = {
        tileSize : 0
    }, 
        linha = 0, 
        coluna = 0,
        matriz,
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
        
        idInterval,
        
        posX = 0, 
        posY = 0;        
    /**
     * 
     * @param {type} row
     * @param {type} col
     */
    tetrisJS.init = function(row, col) {
        //Seta as variaveis
        linha = row  | linha;
        coluna = col | coluna;  
        //Zera a matriz
        zerarMatriz();
        //Monta o grid do jogo
        montarGrid();
        //Adiciona a primeira peça
        addPeca();
    };
    /*
     * Controi o grid do Tetris
     */
    function montarGrid() {
        //Pega o container onde vai as linhas e colunas
        var areaJogo  = document.getElementById("areaJogo"),
            containerRow = document.getElementById("row"),
            containerCol = document.getElementById("col"),
            elem;
        //Limpa as colunas
        containerRow.innerHTML = "";
        containerCol.innerHTML = "";
        //Linha
        for(var r = 0; r < linha; r++ ) {
            //Cria um elemento linha
            elem = document.createElement("div");            
            elem.className = "grid-row";
            containerRow.appendChild(elem);
            //Seta o tamanho da linha
            elem.style.width    = (matriz[0].length * tetrisJS.tileSize) + "px";
            elem.style.height   = (tetrisJS.tileSize - 1) + "px";
            elem.style.top      = (tetrisJS.tileSize * r) + "px";
            //Se for a ultima linha, o height é diferente
            if(r == (linha - 1))
                elem.style.height   = (tetrisJS.tileSize - 2) + "px";
        }
        //Coluna
        for(var c = 0; c < coluna; c++) {
            //Cria um elemento coluna
            elem = document.createElement("div");            
            elem.className = "grid-col";
            containerCol.appendChild(elem);
            //Seta o tamanho da coluna
            elem.style.width  = (tetrisJS.tileSize - 1) + "px";
            elem.style.height = ((matriz.length * tetrisJS.tileSize) - 1) + "px";
            elem.style.left   = (tetrisJS.tileSize * c) + "px";
            //Se for a ultima coluna, o width é diferente
            if(c == (coluna - 1))
                elem.style.width  =  (tetrisJS.tileSize - 2) + "px";
        }
        //Seta o tamanho do container
        areaJogo.style.width  = (matriz[0].length * tetrisJS.tileSize) + "px";
        areaJogo.style.height = (matriz.length * tetrisJS.tileSize) + "px";
    }
    /*
     * Zera a matriz que vou usar
     */
    function zerarMatriz() {
        matriz = [];
        //Linha
        for(var r = 0; r < linha; r++ ) {
            //Linhas
            matriz[r] = [];
            for(var c = 0; c < coluna; c++) {
                matriz[r][c] = 0;
            }
        }
    }
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
            cor = cores[parseInt((cores.length - 1) * Math.random())];
        //Configura o container da peça
        container.style.width  = (matrizPeca[0].length * tetrisJS.tileSize) + "px";
        container.style.height = (matrizPeca.length * tetrisJS.tileSize) + "px";
        container.style.position = 'absolute';
        //Varre a matriz da peca
        for(var row = 0, lenRow = matrizPeca.length; row < lenRow; row++) {
            for(var col = 0, lenCol = matrizPeca[0].length; col < lenCol; col++) {
                //Se tiver um quadrado na matriz
                if(matrizPeca[row][col] == 1) {
                    //Quadrado
                    var quadrado = document.createElement("div");
                    container.appendChild(quadrado);
                    //Configura o quadrado
                    quadrado.className = "square";
                    quadrado.style.backgroundColor = cor;
                    //Seta a posição dos quadrados
                    quadrado.style.width  = (tetrisJS.tileSize - 2) + "px";
                    quadrado.style.height = (tetrisJS.tileSize - 2) + "px";
                    quadrado.style.top  = (row * tetrisJS.tileSize) + "px";
                    quadrado.style.left = (col * tetrisJS.tileSize) + "px";
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
        var X = posX,
            Y = posY,
            m, cont = 0,
            pecas = currentPeca.elem.childNodes;
        //Rotaciona a matriz
        m = rotateMatriz(currentPeca.matriz);
        //Reposiciona as coordenadas, se houver colisão com a parede
        if(Y + m.length > matriz.length)
            Y  = matriz.length - m.length;
        if(X + m[0].length > matriz[0].length)
            X = matriz[0].length - m[0].length;
        /*
         * Verifica se no lugar que a peça irá ocupar existe colisão, se não, quebra a função
         * Do um abs no Y, se ele tiver fora do stage, começo por outra coluna a varrer
         */
        for(var r = Math.abs(Y), rLen = Y + m.length; r < rLen; r++) {
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
                    pecas[cont].style.left = (c * tetrisJS.tileSize) + "px";
                    pecas[cont].style.top  = (r * tetrisJS.tileSize) + "px"; 
                    //Contador
                    cont++;
                }
            }
        }
        //Reajusta a posição
        posX = X;
        posY = Y;
        //Coloca a matriz alterada no objeto da peça atual
        currentPeca.matriz = m;
        //Reajusta o tamanho do container e a posição
        currentPeca.elem.style.left = (X * tetrisJS.tileSize) + "px";
        currentPeca.elem.style.top  = (Y * tetrisJS.tileSize) + "px";        
        currentPeca.elem.style.width  = (currentPeca.matriz[0].length * tetrisJS.tileSize) + "px";
        currentPeca.elem.style.height = (currentPeca.matriz.length * tetrisJS.tileSize) + "px";  
    }
    /**
     * TODO: Fazer a rotação direito, escolhendo o lado inclusive
     * @param {type} eMatriz
     */
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
        //Seta a posição inicia da peça
        posX = Math.floor( matriz[0].length / 2 -  currentPeca.matriz.length / 2), 
        posY = -currentPeca.matriz.length;
        //Onde ele vai iniciar
        currentPeca.elem.style.top  = (posY * tetrisJS.tileSize) + "px";
        currentPeca.elem.style.left = (posX * tetrisJS.tileSize) + "px";
        //Enter frame
        idInterval = setInterval(function(){ 
            move(0, 1); 
        }, 450);
    }
    /**
     * 
     */
    function removePeca () {
        //Pega a posicao atual do role
        var containerPecas = document.getElementById("pecas"),
            peca,
            pecas,
            cont = 0;
        //Se a peça tiver ficado pra fora do container do jogo, GAME OVER
        if(posY < 0) {
            console.log("GAME OVER!!!");
            endGame();
            return false;
        }
        //Matriz da peça atual
        peca = currentPeca.matriz;
        //Childs do container da peça
        pecas = currentPeca.elem.childNodes;
        cont = pecas.length - 1;
        //Altera a matriz, com os espaços ocupados pela ultima peça
        for(var row = posY, lenRow = posY + peca.length; row < lenRow; row++) {
            for(var col = posX, lenCol = posX + peca[0].length; col < lenCol; col++) {
                if(peca[row - posY][col - posX] == 1) {
                    //Faz um cache da peça
                    var elem = pecas[cont];
                    //Coloca a colisao que a peça ocupou na matriz
                    matriz[row][col] = 1;
                    //Remove ela do container e adiciona no seu pai
                    currentPeca.elem.removeChild(elem);
                    containerPecas.appendChild(elem);
                    //Reposiciono a peça e troco seu Class CSS, que é sua identificação
                    elem.style.top  = (row * tetrisJS.tileSize) + "px";
                    elem.style.left = (col * tetrisJS.tileSize) + "px";
                    //Coloca uma identificação no quadrado
                    elem.setAttribute('id', row + "_" + col);
                    //Contador do numero de peças
                    cont--;
                }
            }
        }
        //Removo o container vazio da peça
        containerPecas.removeChild(currentPeca.elem);
        //Verifica se eu preenchi uma linha
        verifyPoint(posY);
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Adiciona uma peca
        addPeca();
    }
    /**
     * 
     */
    function endGame() {
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Remove todas as peças
        document.getElementById("pecas").innerHTML = "";
        //Zera a matriz
        zerarMatriz();
        //Adiciona a primeira peça
        addPeca();
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
            for(var col = 0, lenCol = matriz[0].length; col < lenCol; col++)
                //Se houver um espaço em branco, volto pro for da linha
                if(matriz[row][col] == 0) continue linha;
            //Se chegar aqui, não há espaços vazios na linha, então ela pode ser removida
            removeLinhaMatriz(row);
        }
    }
    /**
     * 
     * @param {type} row
     */
    function removeLinhaMatriz(row) {
        //Container de peças
        var containerPeca = document.getElementById("pecas"),
            pecas;
        //Varre a linha e remove os tiles
        for(var col = 0, lenCol = matriz[0].length; col < lenCol; col++)
            //Remove os tiles fisicos
            containerPeca.removeChild(document.getElementById(row + "_" + col));
        //Removo a linha da matriz
        matriz.splice(row, 1);
        //Adiciona uma linha no começo da matriz
        matriz.unshift([]);
        //Preenche a primeira linha novamente
        for(var col = 0, lenCol = matriz[1].length; col < lenCol; col++)
            matriz[0][col] = 0;
        //Pega as peças do container
        pecas = containerPeca.childNodes;
        //Varre as peças que estão nos stage, e confiram elas
        for(var cont = 0; cont < pecas.length; cont++) {
            //Pega a coordenada pela posição de cada quadrado
            var elem    = pecas[cont],
                colTop  = parseInt(elem.style.left)/tetrisJS.tileSize,
                rowTop  = parseInt(elem.style.top)/tetrisJS.tileSize;
            //Se a linha da peça for menor que a da linha removida, então eu preciso reposicionar essas peças
            if(rowTop < row) {
                //Seto a novo id
                elem.setAttribute("id", (rowTop + 1) + "_" + colTop );
                //Reposiciono a peça e troco seu Class CSS, que é sua identificação
                elem.style.top  = ((rowTop + 1) * tetrisJS.tileSize) + "px";
                elem.style.left = (colTop * tetrisJS.tileSize) + "px";
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
            destX = (left / tetrisJS.tileSize) + x,
            destY = (top / tetrisJS.tileSize) + y;
        //Verifica se posso me mover
        if(checkCollision(destX, destY, [x, y])) {
            //Seta a posição
            posX = destX;
            posY = destY;
            //Move a peça para a região desejada
            currentPeca.elem.style.left = (posX * tetrisJS.tileSize) + "px";
            currentPeca.elem.style.top  = (posY * tetrisJS.tileSize) + "px";
        }
    }
    /**
     * Verifica se posso me mover
     * 
     * dir[0] => Movimentação em X => (-1 LEFT | 1 RIGHT)
     *    Varro apena uma coluna, da direção que a peça está indo
     *               _                    _
     * EX:   LEFT   |X|_ _      RIGHT    |_|_ X
     *              |X|_|_|              |_|_|X|
     *          
     * dir[1] => Movimentação em Y
     *    Varro apenas uma linha, da direção que a peça está indo
     *               _                _
     * EX:   DOWN   |_|_ _     UP*   |X|X X 
     *              |X|X|X|          |_|_|_| 
     * 
     * Se houver um espaço em branco, verifico no espaço vazio tem colisão com o mapa, por exemplo
     * se estou indo para a direita (como no exemplo abaixo), e existe um espaço vazio, varro a 
     * coluna também, para verificar se naquele espaço vazio, vai ter colisão como o mapa
     *                _
     * EX:   RIGHT   |X|X X  <=
     *               |_|_|_|
     * 
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
        if (dir[1] === 0) {
            //Coluna que vou varrer, dependendo da colisão
            col = dir[0] === -1 ? 0 : peca[0].length - 1;
            len = peca.length;
            //Se a peça ainda estiver fora do stage, não varro a coluna inteira, pois, a que esta fora do stage não haverá colisão
            if(y < 0) {
                contador = Math.abs(y);
                row += Math.abs(y);
            }
        } 
        //Movimentando no eixo Y
        else {
            //Linha que vou varrer, Sempre irá varrer a linha debaixo, pois no tetris a peça não sobe (pelo menos não nesse...)
            row = peca.length - 1;
            len = peca[0].length;
        }
        // Varro a coluna ou a linha da direção que vou morrer a peça, comparando com a matriz de colisão 
        for (contador; contador < len; contador++, dir[0] === 0 ? col++ : row++) {
            //Se for 0, a maneira como verifico muda
            if( peca[row][col] === 0) {
                rowTop = row;
                colTop = col;
                if(dir[1] === 0) {
                    //Varre a linha da peça, procurando por alguma colisão
                    for (var i = 0, lenTop = peca[0].length; i < lenTop;i++, dir[0] == -1 ? colTop++ : colTop--) {
                        //compara pra ver ser vai colidir
                        if(matriz[row + y][colTop + x] === 1 && peca[row][colTop] === 1)
                            return false;
                    }
                } else if(dir[0] === 0) {
                    //Varre a coluna da peça, procurando por alguma colisão
                    for (var i = 0, lenTop = peca.length; i < lenTop;i++, dir[1] == -1 ? rowTop++ : rowTop--) {
                        /**
                         * Se rowTop mais a coordenada de Y for menor que ZERO, quer dzer que a peça esta ainda um pouco fora da tela
                         * então, não podemos (nem precisamos), verificar mais
                         */
                        if(rowTop + y > -1 && matriz[rowTop + y][col + x] === 1 && peca[rowTop][col] === 1) {
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


window.onload = function() {
    tetrisJS.tileSize = 25;
    tetrisJS.init(20, 10);
};