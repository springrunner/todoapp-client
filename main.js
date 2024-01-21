import './style.css'

const htmls = [
  'todos.html',
];

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Welcome. This is a Todoapp Client Project!</h1>
    <p>Pages</p>
    <ul class="pages">
      ${htmls.map(file => `<li><a href="/pages/${file}">${file}</a></li>`).join('')}
    </ul>
  </div>
`