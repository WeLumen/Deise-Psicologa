import { client, urlFor } from '/src/js/sanity.js'
import { toHTML } from 'https://esm.sh/@portabletext/to-html'

const query = `*[_type == "post"] | order(publishedAt desc){
  title,
  slug,
  mainImage,
  publishedAt,
  body
}`

function bodyToText(body) {
  if (!body) return ''

  return body
    .map(block => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map(child => child.text).join('')
    })
    .join(' ')
}

async function loadPosts() {
  const posts = await client.fetch(query)

  const container = document.getElementById('blog-posts')
  container.innerHTML = ''

  posts.forEach(post => {
    const article = document.createElement('article')
    article.classList.add('blog-post')

    const text = bodyToText(post.body)
    const htmlContent = toHTML(post.body)

    article.innerHTML = `
      <div class="blog-card">

        <img 
          src="${urlFor(post.mainImage).width(900).auto('format').quality(80).url()}" 
          alt="${post.title}"
        />

        <div class="blog-info">

          <div class="date">
            ${new Date(post.publishedAt).toLocaleDateString('pt-BR')}
          </div>

          <h2>${post.title}</h2>

          <div class="content preview">
            ${text.slice(0, 220)}...
          </div>

          <div class="content full-content" style="display:none;">
            ${htmlContent}

            <a
              class="blog-whatsapp-cta"
              href="https://wa.me/5511952808637?text=Ol%C3%A1%2C%20Deise%21%20Conheci%20seu%20site%20e%20gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20seu%20trabalho."
              target="_blank"
              rel="noopener noreferrer"
              onclick="if (window.gtag) gtag('event', 'conversion', {'send_to': 'AW-17739277352/bdclCLyQhuQbEKjI34pC'});"
            >
              Falar no WhatsApp
            </a>
          </div>

          <button class="read-more">
            Ler artigo
          </button>

        </div>

      </div>
    `

    container.appendChild(article)

    const button = article.querySelector('.read-more')
    const preview = article.querySelector('.preview')
    const fullContent = article.querySelector('.full-content')

    button.addEventListener('click', () => {
      const isOpen = fullContent.style.display === 'block'
      const allArticles = container.querySelectorAll('.blog-post')

      if (isOpen) {
        article.classList.remove('expanded')
        fullContent.style.display = 'none'
        preview.style.display = 'block'
        button.textContent = 'Ler artigo'
        allArticles.forEach(postArticle => {
          postArticle.style.display = ''
        })
      } else {
        article.classList.add('expanded')
        fullContent.style.display = 'block'
        preview.style.display = 'none'
        button.textContent = 'Ler menos'
        allArticles.forEach(postArticle => {
          if (postArticle !== article) {
            postArticle.style.display = 'none'
          }
        })
      }
    })
  })
}

loadPosts()
