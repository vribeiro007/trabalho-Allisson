// ==========================================================
// Raio-X do Tempo de Tela - Simulador de Redes Sociais
// ==========================================================

// Base de dados pronta para os alunos usarem no script
const dadosPesquisa = {
  mediaNacionalDiaria: 4, // Média de horas que o brasileiro passa nas redes
  alertaSaude: 6,         // Limite recomendado por especialistas
  sugestoes: [
    { limite: 2, mensagem: "Parabéns! Seu uso está equilibrado. Você tem mais tempo livre para hobbies e descanso." },
    { limite: 5, mensagem: "Atenção. Você está na média nacional, mas já gasta quase um dia inteiro da sua semana olhando para a tela." },
    { limite: 24, mensagem: "Cuidado! Seu uso é considerado muito alto. Isso pode afetar seu sono, foco e saúde mental. Que tal um detox digital?" }
  ]
};

// Pegando os elementos do HTML
const campoHoras = document.getElementById("horas");
const regua = document.getElementById("regua");
const botao = document.getElementById("botaoCalcular");
const resultado = document.getElementById("resultado");

// 1. Capturar o clique no botão
botao.addEventListener("click", calcular);

// Extra: Enter no campo também calcula
campoHoras.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    calcular();
  }
});

// Extra: a régua e o campo ficam sincronizados
regua.addEventListener("input", function () {
  campoHoras.value = regua.value;
});
campoHoras.addEventListener("input", function () {
  regua.value = campoHoras.value;
});

function calcular() {
  // 2. Pegar o valor digitado
  const horasDia = parseFloat(campoHoras.value);

  // Validação: o dia só tem 24 horas
  if (isNaN(horasDia) || horasDia < 0 || horasDia > 24) {
    resultado.innerHTML = `
      <div class="cartao erro aparecer">
        <p>⚠️ Digite um número de horas entre <strong>0</strong> e <strong>24</strong>.</p>
      </div>`;
    campoHoras.focus();
    return;
  }

  // 3. Fazer as contas
  const horasSemana = horasDia * 7;
  const horasMes = horasDia * 30;
  const horasAno = horasDia * 365;
  const diasPorAno = horasAno / 24;                 // dias inteiros por ano
  const diasNaSemana = horasSemana / 24;            // dias inteiros por semana
  const anosAte80 = (horasDia * 365 * (80 - 15)) / 24 / 365; // dos 15 aos 80 anos
  const percentualAcordado = (horasDia / 16) * 100; // considerando 16h acordado

  // 4. Tomar decisões (condicionais)
  // Comparação com a média nacional
  let comparacao;
  if (horasDia > dadosPesquisa.mediaNacionalDiaria) {
    comparacao = `Isso é <strong>mais</strong> do que a média nacional de ${dadosPesquisa.mediaNacionalDiaria} horas por dia.`;
  } else if (horasDia < dadosPesquisa.mediaNacionalDiaria) {
    comparacao = `Isso é <strong>menos</strong> do que a média nacional de ${dadosPesquisa.mediaNacionalDiaria} horas por dia.`;
  } else {
    comparacao = `Isso é <strong>exatamente</strong> a média nacional de ${dadosPesquisa.mediaNacionalDiaria} horas por dia.`;
  }

  // Mensagem da pesquisa + nível + cor
  let mensagem;
  let nivel;
  let cor;
  if (horasDia <= dadosPesquisa.sugestoes[0].limite) {
    mensagem = dadosPesquisa.sugestoes[0].mensagem;
    nivel = "Uso equilibrado";
    cor = "var(--verde)";
  } else if (horasDia <= dadosPesquisa.sugestoes[1].limite) {
    mensagem = dadosPesquisa.sugestoes[1].mensagem;
    nivel = "Uso moderado";
    cor = "var(--amarelo)";
  } else {
    mensagem = dadosPesquisa.sugestoes[2].mensagem;
    nivel = "Uso muito alto";
    cor = "var(--vermelho)";
  }

  // Alerta extra de saúde
  let alerta = "";
  if (horasDia >= dadosPesquisa.alertaSaude) {
    alerta = `<p>🚨 Você atingiu o <strong>limite de alerta de saúde</strong> (${dadosPesquisa.alertaSaude}h/dia) indicado por especialistas.</p>`;
  }

  // 5. Exibir na tela
  resultado.style.setProperty("--cor-nivel", cor);
  resultado.innerHTML = `
    <div class="cartao veredito aparecer">
      <span class="nivel">${nivel}</span>
      <p>Você passa <strong>${formatar(horasSemana)} horas por semana</strong> nas redes sociais. ${comparacao}</p>
      <p>${mensagem}</p>
      ${alerta}
    </div>

    <div class="numeros">
      <div class="cartao numero aparecer" style="animation-delay:.1s">
        <div class="valor" data-alvo="${horasSemana}">0</div>
        <div class="rotulo">horas por semana</div>
      </div>
      <div class="cartao numero aparecer" style="animation-delay:.2s">
        <div class="valor" data-alvo="${horasMes}">0</div>
        <div class="rotulo">horas por mês</div>
      </div>
      <div class="cartao numero aparecer" style="animation-delay:.3s">
        <div class="valor" data-alvo="${diasPorAno}" data-casas="1">0</div>
        <div class="rotulo">dias inteiros por ano</div>
      </div>
    </div>

    <div class="cartao aparecer" style="animation-delay:.4s">
      <h2>📊 Você x Pesquisa</h2>
      ${barra("Você", horasDia, cor)}
      ${barra("Média nacional", dadosPesquisa.mediaNacionalDiaria, "var(--roxo)")}
      ${barra("Alerta de saúde", dadosPesquisa.alertaSaude, "var(--vermelho)")}
    </div>

    <div class="cartao aparecer" style="animation-delay:.5s">
      <h2>🕐 Seu dia em 24 blocos</h2>
      <div class="relogio">${montarRelogio(horasDia)}</div>
      <div class="legenda">
        <span class="l-sono">Sono (8h)</span>
        <span class="l-tela">Redes sociais (${formatar(horasDia)}h)</span>
        <span class="l-livre">Resto do dia</span>
      </div>
      <p class="dica" style="margin-top:10px">Isso é cerca de <strong>${formatar(percentualAcordado)}%</strong> do tempo em que você está acordado.</p>
    </div>

    <div class="cartao aparecer" style="animation-delay:.6s">
      <h2>💡 Com o tempo de tela de um ano, você poderia...</h2>
      <div class="trocas">
        ${troca("📚", Math.floor(horasAno / 8), "livros lidos (8h cada)")}
        ${troca("🎬", Math.floor(horasAno / 2), "filmes assistidos")}
        ${troca("🚶", Math.floor(horasAno * 5), "km caminhados")}
        ${troca("🎸", Math.floor(horasAno / 100), "instrumentos aprendidos (100h cada)")}
      </div>
    </div>

    <div class="cartao vida aparecer" style="animation-delay:.7s">
      <h2>⏳ A conta da vida</h2>
      <div class="grande">${formatar(anosAte80)} anos</div>
      <p>É o tempo que você passaria nas redes sociais dos 15 aos 80 anos mantendo esse hábito.<br>
      Por semana, são <strong>${formatar(diasNaSemana)}</strong> dia(s) inteiro(s) olhando para a tela.</p>
    </div>
  `;

  // Animações depois que o HTML aparece
  animarNumeros();
  animarBarras();
  resultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Funções auxiliares ----------

// Formata número no padrão brasileiro (ex.: 1.234,5)
function formatar(numero) {
  return numero.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

// Cria uma barra de comparação (a escala máxima é 12h ou o valor do usuário)
function barra(rotulo, horas, cor) {
  const maximo = Math.max(12, parseFloat(campoHoras.value) || 0);
  const largura = (horas / maximo) * 100;
  return `
    <div class="barra-item">
      <div class="barra-topo"><span>${rotulo}</span><span>${formatar(horas)}h/dia</span></div>
      <div class="barra-trilho">
        <div class="barra-preenchida" data-largura="${largura}" style="background:${cor}"></div>
      </div>
    </div>`;
}

// Monta os 24 blocos do dia: 8 de sono, depois as horas de tela, o resto livre
function montarRelogio(horasDia) {
  let blocos = "";
  const horasTela = Math.round(horasDia);
  for (let i = 0; i < 24; i++) {
    let classe = "hora";
    if (i < 8) {
      classe += " sono";
    } else if (i < 8 + horasTela) {
      classe += " tela";
    }
    blocos += `<div class="${classe}" title="${i}h"></div>`;
  }
  return blocos;
}

// Cria um cartão de "troca"
function troca(emoji, quantidade, descricao) {
  return `
    <div class="troca">
      <div class="emoji">${emoji}</div>
      <div class="qtd">${quantidade.toLocaleString("pt-BR")}</div>
      <div class="desc">${descricao}</div>
    </div>`;
}

// Números contando de 0 até o valor final
function animarNumeros() {
  const elementos = document.querySelectorAll(".valor[data-alvo]");
  elementos.forEach(function (el) {
    const alvo = parseFloat(el.dataset.alvo);
    const duracao = 1200;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - progresso, 3);
      el.textContent = formatar(alvo * suave);
      if (progresso < 1) {
        requestAnimationFrame(passo);
      }
    }
    requestAnimationFrame(passo);
  });
}

// Barras crescendo
function animarBarras() {
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.querySelectorAll(".barra-preenchida").forEach(function (b) {
        b.style.width = Math.min(b.dataset.largura, 100) + "%";
      });
    });
  });
}
