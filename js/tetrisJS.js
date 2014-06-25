(function(){

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
        {
            img:"img/cobrinha.png",
            matriz:[
                [0, 1, 1],
                [1, 1, 0]
            ]
        },
        {
            img:"img/nave.png",
            matriz:[
                [0, 1, 0],
                [1, 1, 1]
            ]
        },
        {
            img:"img/quadrado.png",
            matriz:[
                [1, 1],
                [1, 1]
            ]
        },
        {
            img:"img/retangulo.png",
            matriz:[
                [1, 0, 0],
                [1, 1, 1]
            ]
        }],
        keys = { }, 
        //Peça atual
        currentPeca,
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
    
    function addPeca() {
        //Randomiza a peça que vai entrar
        indicePeca = Math.floor(Math.random() * 4);        
        //Pega a peça atual
        currentPeca = new Image();
        currentPeca.src = pecas[indicePeca].img;
        //Onload da imagem
        currentPeca.onload = function(){
            //Adiciona no stage
            document.getElementById('pecas').appendChild(currentPeca);
            //Eventos
            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("keyup", onKeyUp);
            //Onde ele vai iniciar
            currentPeca.style.top = "0px";
            currentPeca.style.left = "75px";
            //Não sei se vou deixar
            pecas[indicePeca].elem = currentPeca;
            //Enter frame
            //idInterval = setInterval(function(){ 
            //    move(0, 1); 
            //}, 150);
        };
    }
    
    function removePeca () {
        //Pega a posicao atual do role
        var X = parseInt(currentPeca.style.left)/25,
            Y = parseInt(currentPeca.style.top)/25,
            peca = pecas[indicePeca].matriz;
        //Altera a matriz, com os espaços ocupados pela ultima peça
        for(var row = Y, lenRow = Y + peca.length; row < lenRow; row++)
            for(var col = X, lenCol = X + peca[0].length; col < lenCol; col++)
                if(peca[row - Y][col - X] == 1) matriz[row][col] = 1;
        //Eventos
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        //Limpa o setInverval
        clearInterval(idInterval);
        //Adiciona uma peca
        addPeca();
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
    
    
    function montarPeca() {
        
    }
    function girarPeca() {
        //var angulo = Math.floor(Math.random() * 3);
        //$(currentPeca).css("WebkitTransform", 'rotate(' + (angulo * 90) + 'deg)');
        var m0 = [
            [1, 0, 0],
            [1, 1, 1]
        ],
        m1 = [            
            [1, 1],
            [1, 0],
            [1, 0]
        ],
        m2 = [            
            [1, 1, 1],
            [0, 0, 1]
        ],
        m3 = [            
            [1, 0],
            [1, 0],
            [1, 1]
        ];
        
        //A matriz que vou usar pra inverter
        var m = [];
       //Transformo a linha
        for(var r = 0; r < m0[0].length; r++ ) {
            //Adiciona uma linha
            m[r] = [];
            for(var c = m0.length-1, cont = 0; c > -1; cont++, c--) {                
                m[r][cont] = m0[c][r];
            }
        }
        
        console.log(m);
    }
    
    /*
     * 
     * @param {type} x Direcao em X
     * @param {type} y Direcao em Y
     */
    function move(x, y) {
        //Pega a posicao atual do role
        var left = parseInt(currentPeca.style.left),
            top = parseInt(currentPeca.style.top),
            destX = (left/25) + x,
            destY = (top/25) + y;        
        if(checkCollision(destX, destY, [x, y]) ) {
            //Move a peça para a região desejada
            currentPeca.style.left = left + (x * 25) + "px";
            currentPeca.style.top = top + (y * 25) + "px";
        }
    }
    
    /**
     * Verifica se posso me mover
     * @param {type} x Ponto X na matriz que eu quero ir
     * @param {type} y Ponto Y na matriz que eu quero ir
     * @param {type} dir Array com a direção que quero ir
     */
    function checkCollision(x, y, dir) {
        var col = 0, 
            row = 0,
            len, 
            peca = pecas[indicePeca].matriz;
        //Teste para não deixar ele sair das paredas do tetris
        if((x + peca[0].length > matriz[0].length) || x < 0 || y + peca.length > matriz.length || y < 0){
            //Se encostou no fundo, adiciona outra peça
            if(dir[1] === 1) removePeca();
            return false;
        } 
        //Movimentando no eixo X
        if(dir[1] === 0) { // row++
            col = dir[0] === -1 ? 0 : peca[0].length - 1;
            len = peca.length;
        } 
        //Movimentando no eixo Y
        else { // col++
            row = dir[1] === -1 ? 0 : peca.length - 1;
            len = peca[0].length;
        }
        //Varro a coluna ou a linha da direção que vou morrer a peça, comparando com a matriz de colisão
        for(var cont = 0; cont < len; cont++, dir[0] === 0 ? col++ : row++){            
            //Se for 0, verifico diferente a colisa, vejo no proximo ponto se existe colisao
            if(peca[row][col] === 0) {
                //Verifico se no lugar onde existe um espaço vazio na matriz da peça, possui uma peça com colisão
                if(matriz[row + y + (dir[1]*-1)][col + x + (dir[0]*-1)] !== 1) continue;
                else { 
                    if(dir[1] === 1) removePeca();
                    return false;
                }
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










