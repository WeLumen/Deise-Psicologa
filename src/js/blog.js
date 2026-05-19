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

    const text = bodyToText(post.body)
    const htmlContent = toHTML(post.body)

    article.innerHTML = `
      <div class="blog-card">

        <img 
          src="${urlFor(post.mainImage).width(900).url()}" 
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

      if (isOpen) {
        fullContent.style.display = 'none'
        preview.style.display = 'block'
        button.textContent = 'Ler artigo'
      } else {
        fullContent.style.display = 'block'
        preview.style.display = 'none'
        button.textContent = 'Mostrar menos'
      }
    })
  })
}

loadPosts()
