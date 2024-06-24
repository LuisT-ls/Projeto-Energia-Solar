const menuToggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.menu')
const dropdowns = document.querySelectorAll('.dropdown')
const menuLinks = document.querySelectorAll('.menu a')
const logo = document.querySelector('.logo')

// Função para fechar o menu
function closeMenu() {
  menu.classList.remove('active')
}

// Função para rolar suavemente para uma seção
function scrollToSection(targetId) {
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
}

// Abre/fecha o menu ao clicar no botão
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active')
})

// Adiciona evento de clique para fechar o menu dropdown ao clicar fora dele
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    menu.classList.remove('active')
  }
})

// Adiciona evento de mouseover e mouseout para abrir e fechar o submenu dropdown
dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mouseover', () => {
    dropdown.querySelector('.submenu').style.display = 'block'
  })

  dropdown.addEventListener('mouseout', () => {
    dropdown.querySelector('.submenu').style.display = 'none'
  })
})

// Trata os cliques nos links do menu
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault()
    const targetId = link.getAttribute('href')

    // Fecha o menu imediatamente
    closeMenu()

    // Espera um pouco antes de rolar, para dar tempo do menu fechar
    setTimeout(() => {
      scrollToSection(targetId)
    }, 300)
  })
})

// Trata o clique na logo
logo.addEventListener('click', event => {
  event.preventDefault()

  // Se o menu estiver aberto, apenas fecha o menu
  if (menu.classList.contains('active')) {
    closeMenu()
  } else {
    // Se o menu já estiver fechado, rola para o topo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
})

// Fecha o menu ao clicar fora dele
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu()
  }
})

// Fecha o menu ao redimensionar a janela para telas maiores
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMenu()
  }
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

// Chatbot
const chatbotToggle = document.getElementById('chatbot-toggle')
const chatbotContainer = document.getElementById('chatbot-container')
const faqSection = document.getElementById('faq')

chatbotToggle.addEventListener('click', () => {
  chatbotContainer.classList.toggle('active')

  // Alterna o aria-label do botão para indicar o estado atual
  if (chatbotContainer.classList.contains('active')) {
    chatbotToggle.setAttribute('aria-label', 'Fechar chat')
  } else {
    chatbotToggle.setAttribute('aria-label', 'Abrir chat')
  }
})

chatbotContainer.classList.remove('active')

let faqData

fetch('faq.json')
  .then(response => response.json())
  .then(data => {
    faqData = data
  })
  .catch(error => console.error('Erro ao carregar o FAQ:', error))

const chatbotMessages = document.getElementById('chatbot-messages')
const chatbotInput = document.getElementById('chatbot-input')
const chatbotSend = document.getElementById('chatbot-send')

function addMessage(
  message,
  isUser = false,
  isInitial = false,
  container = chatbotMessages
) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('chatbot-message')
  messageElement.classList.add(isUser ? 'chatbot-user' : 'chatbot-bot')

  // Adiciona a classe 'initial-message' se for a mensagem inicial
  if (isInitial) {
    messageElement.classList.add('initial-message')
  }

  messageElement.textContent = message
  container.appendChild(messageElement) // Adiciona ao container especificado

  // Rola para o final apenas se a mensagem não for adicionada ao container de boas-vindas
  if (container === chatbotMessages) {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight
  }
}

function similarity(s1, s2) {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  const longerLength = longer.length
  if (longerLength === 0) {
    return 1.0
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  )
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  const costs = new Array()
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j
      else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

function findAnswer(question) {
  const normalizedQuestion = normalizeQuestion(question)
  // Verifica se há uma correspondência exata
  for (const item of faqData) {
    if (question.toLowerCase() === item.question.toLowerCase()) {
      return item.answer // Retorna a resposta correta
    }
  }

  // Se não houver correspondência exata, calcula a similaridade
  const threshold = 0.7 // Limiar de similaridade ajustável
  let bestMatch = null
  let bestSimilarity = 0

  for (const item of faqData) {
    const questionSimilarity = similarity(question, item.question)
    const answerSimilarity = similarity(question, item.answer)
    const maxSimilarity = Math.max(questionSimilarity, answerSimilarity)

    if (maxSimilarity > bestSimilarity) {
      bestMatch = item
      bestSimilarity = maxSimilarity
    }
  }

  if (question.toLowerCase().includes('quanto custa instalar')) {
    return 'Hmm, essa é uma boa pergunta. Para obter uma resposta mais precisa, sugiro entrar em contato diretamente com nossa equipe.'
  }

  if (bestMatch && bestSimilarity >= threshold) {
    return bestMatch.answer
  } else {
    return generateFallbackResponse(question)
  }
}

function generateFallbackResponse(question) {
  const fallbackResponses = [
    'Desculpe, não tenho uma resposta específica para essa pergunta. Posso ajudar com algo mais?',
    'Essa é uma pergunta interessante, mas não tenho informações suficientes para respondê-la. Que tal tentar reformular?',
    'Não tenho certeza sobre isso. Que tal perguntar sobre nossos serviços de energia solar ou instalações elétricas?',
    'Hmm, essa é uma boa pergunta. Para obter uma resposta mais precisa, sugiro entrar em contato diretamente com nossa equipe.',
    'Não tenho uma resposta exata para isso. Gostaria de saber mais sobre nossos projetos de energia solar?'
  ]

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
}

function handleUserInput() {
  const userMessage = chatbotInput.value.trim()
  if (userMessage) {
    addMessage(userMessage, true) // Adiciona a pergunta do usuário
    chatbotInput.value = '' // Limpa o campo de entrada

    // Cria a animação de loading
    const loadingElement = createLoadingAnimation()

    // Remove as sugestões após a primeira interação do usuário
    const suggestionsContainer = document.querySelector('.chatbot-suggestions')
    if (suggestionsContainer) {
      chatbotMessages.removeChild(suggestionsContainer)
    }

    const botResponse = findAnswer(userMessage)
    setTimeout(() => {
      chatbotMessages.removeChild(loadingElement) // Remove a animação
      addMessage(botResponse) // Adiciona a resposta do chatbot
    }, 1000) // Simula um tempo de resposta de 1 segundo
  }
}

chatbotSend.addEventListener('click', handleUserInput)
chatbotInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    handleUserInput()
  }
})

// Sugestões de perguntas frequentes
const suggestedQuestions = [
  'Como funciona a energia solar?',
  'Quais são os benefícios da energia solar?',
  'Quanto custa instalar painéis solares?',
  'Vocês fazem manutenção de sistemas solares?'
]

function addSuggestedQuestions() {
  const suggestionsContainer = document.createElement('div')
  suggestionsContainer.classList.add('chatbot-suggestions')

  suggestedQuestions.forEach(question => {
    const suggestionMessage = document.createElement('div')
    suggestionMessage.classList.add('chatbot-message', 'chatbot-bot')
    suggestionMessage.textContent = question

    suggestionMessage.addEventListener('click', () => {
      // Adiciona a pergunta selecionada ao chat como mensagem do usuário
      addMessage(question, true)

      // Cria a animação de loading
      const loadingElement = createLoadingAnimation()

      const botResponse = findAnswer(question) // Busca a resposta
      setTimeout(() => {
        chatbotMessages.removeChild(loadingElement) // Remove a animação
        addMessage(botResponse) // Adiciona a resposta do bot
      }, 1000)
    })

    suggestionsContainer.appendChild(suggestionMessage)
  })

  chatbotMessages.appendChild(suggestionsContainer)
}

addSuggestedQuestions()

const welcomeMessageContainer = document.createElement('div')
welcomeMessageContainer.classList.add('welcome-message-container')
chatbotMessages.appendChild(welcomeMessageContainer)

// Mensagem de boas-vindas
addMessage(
  'Olá! Sou o assistente virtual da Instalações Salvador. Como posso ajudar você hoje?'
)

function createLoadingAnimation() {
  const loadingElement = document.createElement('div')
  loadingElement.classList.add('loading') // Classe para estilizar a animação
  loadingElement.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `
  chatbotMessages.appendChild(loadingElement)
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight // Rola para baixo
  return loadingElement // Retorna o elemento para removê-lo depois
}

let synonymsData // Variável para armazenar os sinônimos

Promise.all([
  fetch('faq.json').then(response => response.json()),
  fetch('synonyms.json').then(response => response.json())
])
  .then(([faq, synonyms]) => {
    faqData = faq
    synonymsData = synonyms
  })
  .catch(error => console.error('Erro ao carregar dados:', error))

function normalizeQuestion(question) {
  const words = question.toLowerCase().split(/\s+/) // Divide em palavras
  const normalizedWords = words.map(word => {
    return synonymsData[word] ? synonymsData[word][0] : word // Substitui por sinônimo principal, se houver
  })
  return normalizedWords.join(' ') // Junta as palavras novamente
}

// Intersection Observer para a seção FAQ
const faqObserver = new IntersectionObserver(
  entries => {
    // Verifica se a seção FAQ está visível e se o topo da seção está acima da metade da janela do navegador
    if (
      entries[0].isIntersecting &&
      entries[0].boundingClientRect.top < window.innerHeight / 2 &&
      !chatbotContainer.classList.contains('active')
    ) {
      chatbotToggle.style.display = 'none'
      chatbotToggle.style.visibility = 'hidden'
    } else {
      chatbotToggle.style.display = 'flex'
    }
  },
  { threshold: 0.1 }
)

// Função para verificar a posição da seção FAQ e ocultar/mostrar o botão
function checkFaqVisibility() {
  const faqRect = faqSection.getBoundingClientRect()
  if (
    faqRect.top < window.innerHeight / 2 &&
    !chatbotContainer.classList.contains('active')
  ) {
    chatbotToggle.style.display = 'none' // Oculta o botão
  } else {
    chatbotToggle.style.display = 'flex' // Mostra o botão
    chatbotToggle.style.visibility = 'visible'
  }
}

// Adiciona os eventos de rolagem e DOMContentLoaded à janela
window.addEventListener('scroll', checkFaqVisibility)
document.addEventListener('DOMContentLoaded', checkFaqVisibility)

// Chama a função checkFaqVisibility() no carregamento inicial da página
checkFaqVisibility()

faqObserver.observe(faqSection)
