// Funcionalidade do Menu Hambúrguer
const menuToggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.menu')
const menuLinks = document.querySelectorAll('.menu a')
const logo = document.querySelector('.logo')

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active')
})

// Fecha o menu em diferentes situações
function closeMenu() {
  menu.classList.remove('active')
}

// Fecha o menu ao clicar em um link (com rolagem suave)
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault()
    closeMenu()

    const targetId = link.getAttribute('href')
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const headerOffset = document.querySelector('header').offsetHeight
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  })
})

// Fecha o menu ao clicar fora dele
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu()
  }
})

// Fecha o menu ao rolar para uma seção
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section')
  const scrollPosition = window.scrollY + 100

  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      closeMenu()
    }
  })
})

// Voltar ao Início ao Clicar na Logo
logo.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

// Rolagem Suave para as Âncoras (com ajuste para o header fixo)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    const targetId = this.getAttribute('href')
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const headerOffset = document.querySelector('header').offsetHeight
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Fecha o menu após a rolagem (se estiver aberto)
      if (menu.classList.contains('active')) {
        menu.classList.remove('active')
      }
    }
  })
})

// Rolagem para a seção de contato ao clicar no botão
const orcamentoBtn = document.querySelector('.btn')

orcamentoBtn.addEventListener('click', event => {
  event.preventDefault() // Impede o comportamento padrão do link

  const targetId = orcamentoBtn.getAttribute('href') // Obtém o ID da seção de contato
  const targetElement = document.querySelector(targetId)

  if (targetElement) {
    const headerOffset = document.querySelector('header').offsetHeight
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
})

const form = document.getElementById('contact-form')

form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    form.classList.add('was-validated')
  }
})

// Dados específicos para Salvador
const dadosSalvador = {
  irradiacao: 5.36, // kWh/m2.dia
  potenciaPico: 91.45, // kWh
  quantidadeModulos: 229
}

// Função principal da calculadora
function calcularEconomiaSolar() {
  const consumoMensal = parseFloat(
    document.getElementById('consumo-mensal').value
  )
  const tarifaKwh = parseFloat(document.getElementById('tarifa-kwh').value)

  if (isNaN(consumoMensal) || isNaN(tarifaKwh)) {
    alert('Por favor, insira valores numéricos válidos.')
    return
  }

  // Limpa os resultados anteriores
  limparResultados()

  // Desabilita o botão e mostra a barra de progresso
  document.getElementById('calcular-btn').disabled = true
  document.getElementById('progress-bar').style.display = 'block'
  document.getElementById('loading-message').textContent = 'Calculando...'

  // Simula um cálculo demorado
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    document.getElementById('progress').style.width = `${progress}%`
    if (progress >= 100) {
      clearInterval(interval)
      mostrarResultados(consumoMensal, tarifaKwh)
    }
  }, 200)
}

// Função para mostrar os resultados
function mostrarResultados(consumoMensal, tarifaKwh) {
  const gastoMensalAtual = consumoMensal * tarifaKwh

  // Cálculo mais preciso baseado nos dados de Salvador
  const producaoDiaria =
    (dadosSalvador.irradiacao * dadosSalvador.potenciaPico) / 1000
  const producaoMensal = producaoDiaria * 30 // Assumindo 30 dias por mês

  const economiaMensal = Math.min(gastoMensalAtual, producaoMensal * tarifaKwh)
  const economiaAnual = economiaMensal * 12

  // Cálculo do tamanho do sistema solar necessário (mais conservador)
  const potenciaSistema = consumoMensal / 120 // Assumindo 120 kWh/kWp/mês em Salvador
  const custoSistema = potenciaSistema * 5000 // Assumindo R$ 5000/kWp

  // Cálculo do tempo de retorno do investimento (considerando manutenção e perdas)
  const tempoRetorno = custoSistema / (economiaAnual * 0.9) // 10% para manutenção e perdas

  // Cálculo da quantidade de módulos necessários
  const potenciaModulo = 0.4 // Assumindo módulos de 400W
  const modulosNecessarios = Math.ceil(potenciaSistema / potenciaModulo)

  // Atualiza os resultados na página
  document.getElementById('economia-mensal').textContent =
    economiaMensal.toFixed(2)
  document.getElementById('economia-anual').textContent =
    economiaAnual.toFixed(2)
  document.getElementById('tempo-retorno').textContent = tempoRetorno.toFixed(1)

  // Adiciona informações extras
  const resultadosDiv = document.getElementById('resultados')
  resultadosDiv.innerHTML += `
      <p>Tamanho do sistema recomendado: ${potenciaSistema.toFixed(2)} kWp</p>
      <p>Quantidade estimada de módulos: ${modulosNecessarios}</p>
      <p>Produção mensal estimada: ${producaoMensal.toFixed(2)} kWh</p>
      <p>Redução de emissões de CO2: ${(economiaAnual * 0.084).toFixed(
        2
      )} kg/ano</p>
  `

  // Mostra os resultados e reabilita o botão
  document.getElementById('progress-bar').style.display = 'none'
  document.getElementById('resultados').style.display = 'block'
  document.getElementById('calcular-btn').disabled = false

  // Adiciona animação de fade-in aos resultados
  resultadosDiv.classList.add('show')
}

// Função para limpar os resultados
function limparResultados() {
  const resultadosDiv = document.getElementById('resultados')
  resultadosDiv.innerHTML = `
      <h3>Economia Estimada:</h3>
      <p>Economia mensal: R$ <span id="economia-mensal">0</span></p>
      <p>Economia anual: R$ <span id="economia-anual">0</span></p>
      <p>Tempo de retorno do investimento: <span id="tempo-retorno">0</span> anos</p>
  `
  resultadosDiv.style.display = 'none'
  resultadosDiv.classList.remove('show')
  document.getElementById('progress-bar').style.display = 'none'
  document.getElementById('calcular-btn').disabled = false
}

// Adiciona o evento de clique ao botão de calcular
document
  .getElementById('calcular-btn')
  .addEventListener('click', calcularEconomiaSolar)

// Adiciona eventos para limpar os resultados quando os inputs são alterados
document
  .getElementById('consumo-mensal')
  .addEventListener('input', limparResultados)
document
  .getElementById('tarifa-kwh')
  .addEventListener('input', limparResultados)

// Função para enviar o email usando EmailJS
function sendEmail(event) {
  event.preventDefault()

  emailjs
    .sendForm(
      'service_xmwepap',
      'template_tqkspky',
      '#contact-form',
      '1PLc3xymOa3PrKHEX'
    )
    .then(
      response => {
        console.log('SUCCESS!', response.status, response.text)
        showModal()
        form.reset()
      },
      error => {
        console.log('FAILED...', error)
        alert(
          'Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.'
        )
      }
    )
}

// Adiciona o ouvinte de eventos ao formulário
document.getElementById('contact-form').addEventListener('submit', sendEmail)

// Função para mostrar o modal
function showModal() {
  document.getElementById('confirmationModal').style.display = 'block'
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('confirmationModal').style.display = 'none'
}

const titles = document.querySelectorAll('h2') // Seleciona todos os títulos h2

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show') // Adiciona a classe 'show' para acionar a animação
        observer.unobserve(entry.target) // Para de observar o elemento após a animação
      }
    })
  },
  { threshold: 0.5 }
) // Aciona a animação quando 50% do elemento estiver visível

titles.forEach(title => {
  observer.observe(title) // Começa a observar cada título
})

// Carregar dados do FAQ do JSON
fetch('faq.json')
  .then(response => response.json())
  .then(faqData => {
    const faqContainer = document.getElementById('faq-container')

    faqData.forEach(item => {
      const faqItem = document.createElement('div')
      faqItem.classList.add('faq-item')
      faqItem.innerHTML = `
        <h3 class="faq-question">${item.question}</h3>
        <div class="faq-answer">
          <p>${item.answer}</p>
        </div>
      `
      faqContainer.appendChild(faqItem)

      // Oculta a resposta inicialmente
      faqItem.querySelector('.faq-answer').style.display = 'none'
    })

    // Interatividade das perguntas e respostas
    const faqQuestions = document.querySelectorAll('.faq-question')

    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        // Fecha todas as outras respostas abertas
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== question) {
            otherQuestion.parentElement.classList.remove('active')
            otherQuestion.nextElementSibling.style.display = 'none' // Oculta a resposta
          }
        })

        // Abre/fecha a resposta clicada
        question.parentElement.classList.toggle('active')
        const answer = question.nextElementSibling
        answer.style.display =
          answer.style.display === 'block' ? 'none' : 'block'
      })
    })
  })
  .catch(error => console.error('Erro ao carregar o FAQ:', error))
