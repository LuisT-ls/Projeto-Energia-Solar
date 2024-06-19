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
