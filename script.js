document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM (com nomes padronizados)
    const gameContainer = document.getElementById('game-container');
    const counterSpan = document.getElementById('counter');
    const modal_overlay = document.getElementById('modal-overlay');
    const modal_title = document.getElementById('modal-title');
    const modal_descricao = document.getElementById('modal-descricao');
    const modal_parasitas = document.getElementById('modal-parasitas');
    const modal_prevencao = document.getElementById('modal-prevencao');
    const close_button = document.getElementById('close-button');
    const winMessage = document.getElementById('win-message');

    // Variáveis do estado do jogo
    let riscosData = [];
    let encontradosCount = 0;
    const totalRiscos = 5;

    // Carregar os dados do JSON
    fetch('./riscos_cozinha.json') // Usando o caminho relativo correto
        .then(response => response.json())
        .then(data => {
            riscosData = data.riscos_parasitoses;
            // Adiciona um estado 'descoberto' para cada risco
            riscosData.forEach(risco => risco.descoberto = false);
            iniciarJogo();
        })
        .catch(error => console.error('Erro ao carregar dados dos riscos:', error));

    function iniciarJogo() {
        gameContainer.addEventListener('click', handleGameClick);
        
        // CORREÇÃO: Usando a variável correta para o botão de fechar
        close_button.addEventListener('click', fecharModal);

        // CORREÇÃO: Usando a variável correta para o overlay
        modal_overlay.addEventListener('click', (e) => {
            // Fecha o modal se o clique for no overlay, mas não no conteúdo do modal
            if (e.target === modal_overlay) {
                fecharModal();
            }
        });
    }

    function handleGameClick(event) {
        // Pega as coordenadas X e Y do clique relativas ao container do jogo
        const clickX = event.offsetX;
        const clickY = event.offsetY;

        // Verifica se o clique acertou alguma área de risco
        for (const risco of riscosData) {
            const { x, y, largura, altura } = risco.coordenadas;

            // Condição para verificar se o clique está dentro do retângulo do risco
            if (!risco.descoberto && clickX >= x && clickX <= x + largura && clickY >= y && clickY <= y + altura) {
                // Risco encontrado!
                risco.descoberto = true;
                encontradosCount++;

                atualizarContador();
                mostrarModal(risco);
                verificarVitoria();
                break; // Para o loop assim que encontrar o primeiro risco
            }
        }
    }

    function mostrarModal(risco) {
        // CORREÇÃO: Usando os nomes corretos das variáveis com underline
        modal_title.textContent = risco.nome;
        modal_descricao.textContent = risco.descricao;
        modal_prevencao.textContent = risco.prevencao;

        // Limpa a lista de parasitas anterior antes de adicionar os novos
        modal_parasitas.innerHTML = '';
        risco.parasitas.forEach(parasita => {
            const li = document.createElement('li');
            li.textContent = parasita;
            modal_parasitas.appendChild(li);
        });

        modal_overlay.classList.remove('hidden');
    }

    function fecharModal() {
        modal_overlay.classList.add('hidden');
    }

    function atualizarContador() {
        counterSpan.textContent = encontradosCount;
    }

    function verificarVitoria() {
        if (encontradosCount === totalRiscos) {
            // Atraso para o jogador poder ler o último modal antes da mensagem de vitória
            setTimeout(() => {
                fecharModal();
                winMessage.classList.remove('hidden');
            }, 1500);
        }
    }
});
