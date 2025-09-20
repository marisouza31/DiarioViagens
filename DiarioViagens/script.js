// Variável global para armazenar localização
let coords = { lat: null, lon: null };

document.getElementById('btnLocalizacao')?.addEventListener('click', () => {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos => {
      coords.lat = pos.coords.latitude.toFixed(4);
      coords.lon = pos.coords.longitude.toFixed(4);

      // Preenche os campos hidden do formulário
      document.getElementById('lat').value = coords.lat;
      document.getElementById('lng').value = coords.lon;

      // Atualiza status na tela
      document.getElementById('geoStatus').textContent = `${coords.lat}, ${coords.lon}`;
      alert(`Localização capturada: ${coords.lat}, ${coords.lon}`);
    }, err => alert("Não foi possível capturar localização"));
  } else alert("Geolocalização não suportada");
});

// Formulário
document.getElementById('formMemoria').addEventListener('submit', e => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const data = document.getElementById('dataVisita').value;
  const foto = document.getElementById('fotoUrl').value;
  const desc = document.getElementById('descricao').value;
  const avaliacao = document.getElementById('avaliacao').value;

  const novaEntrada = { titulo, data, foto, desc, avaliacao, coords };

  // Recupera entradas do localStorage
  let entradas = JSON.parse(localStorage.getItem('diario')) || [];
  entradas.push(novaEntrada);
  localStorage.setItem('diario', JSON.stringify(entradas));

  // Atualiza a tela
  mostrarEntradas();
  e.target.reset(); // limpa formulário
  coords = { lat:null, lon:null };
  document.getElementById('geoStatus').textContent = "Nenhuma localização";
});


// Função para mostrar entradas
function mostrarEntradas(){
  const container = document.getElementById('entradas');
  container.innerHTML = '';
  const entradas = JSON.parse(localStorage.getItem('diario')) || [];
  entradas.forEach(e => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${e.titulo}</h3>
      <p class="meta">${e.data} - Avaliação: <span class="rating">${e.avaliacao}</span></p>
      ${e.foto ? `<figure><img src="${e.foto}" alt="${e.titulo}"></figure>` : ''}
      <p>${e.desc}</p>
      ${e.coords.lat ? `<p>Localização: ${e.coords.lat}, ${e.coords.lon}</p>` : ''}
    `;
    container.appendChild(article);
  });
}

document.getElementById('btnLimparMemorias')?.addEventListener('click', () => {
  if(confirm("Tem certeza que quer apagar todas as memórias?")){
    localStorage.removeItem('diario'); // apaga do storage
    mostrarEntradas(); // limpa a tela
    document.getElementById('geoStatus').textContent = "Nenhuma localização";
    alert("Memórias apagadas com sucesso!");
  }
});

// Atualiza o valor mostrado ao mover a barra
const avaliacaoInput = document.getElementById('avaliacao');
const valorAvaliacao = document.getElementById('valorAvaliacao');

avaliacaoInput.addEventListener('input', () => {
  valorAvaliacao.textContent = avaliacaoInput.value;
});


// Carrega entradas ao iniciar
window.onload = mostrarEntradas;
