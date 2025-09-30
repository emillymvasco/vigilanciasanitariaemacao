document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const gameContainer = document.getElementById('game-container');
    const counterSpan = document.getElementById('counter');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDescricao = document.getElementById('modal-descricao');
    const modalParasitas = document.getElementById('modal-parasitas');
    const modalPrevencao = document.getElementById('modal-prevencao');
    const closeButton = document.getElementById('close-button');
    const winMessage = document.getElementById('win-message');

    // Variáveis do estado do jogo
    let riscosData = [];
    let encontradosCount = 0;
    const totalRiscos = 5;

    // Carregar os dados do JSON
    fetch('riscos_cozinha.json')
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
        closeButton.addEventListener('click', fecharModal);
        modalOverlay.addEventListener('click', (e) => {
             // Fecha o modal se o clique for no overlay, mas não no conteúdo do modal
            if (e.target === modalOverlay) {
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
        modalTitle.textContent = risco.nome;
        modalDescricao.textContent = risco.descricao;
        modalPrevencao.textContent = risco.prevencao;

        // Limpa a lista de parasitas anterior antes de adicionar os novos
        modalParasitas.innerHTML = ''; 
        risco.parasitas.forEach(parasita => {
            const li = document.createElement('li');
            li.textContent = parasita;
            modalParasitas.appendChild(li);
        });

        modalOverlay.classList.remove('hidden');
    }

    function fecharModal() {
        modalOverlay.classList.add('hidden');
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