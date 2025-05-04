//Coloque o id do elemento que será o container do Editor de Código na constante
const containerEditorDeCodigo = "rightPanel";

function toggleEditorDeCodigo() {
	const codeDiv = document.getElementById(containerEditorDeCodigo);
	codeDiv.style.display = codeDiv.style.display === "none" ? "block" : "none";
}

function runUserCode(){
	const code = document.getElementById('code-input').value;
	console.log("Executando código js:\n" + code);

	// "resetando" instancia PIXI.Aplication
	const container = document.getElementById('gameViewContainer');
	const canvas = document.getElementById('gameCanvas');

	window.app = new PIXI.Application({
		view: canvas,
		width: container.offsetWidth,
		height: container.offsetHeight,
		backgroundColor: 0x2f333f
	});

	// executando código do usuário
	const runCode = new Function(code);
	runCode();
	// eval(code)
}

function stopUserCode(){
	window.app.stage.removeChildren();
}

function criarEditorDeCodigo(containerId) {
	const container = document.getElementById(containerId);
	if (!container) {
		console.error(`Elemento com id "${containerId}" não encontrado.`);
		return;
	}

	container.innerHTML = `
		<div class="code-editor">
			<div id="line-numbers" class="line-numbers">1</div>
			<div class="code-container">
				<textarea id="code-input" class="code-input" spellcheck="false">// Digite seu código aqui
function exemplo() {
  return "Olá, mundo!";
}</textarea>
				<pre id="code-highlight" class="code-highlight"><code class="language-javascript"></code></pre>
			</div>
		</div>
	`;

	const codeInput = container.querySelector('#code-input');
	const codeHighlight = container.querySelector('#code-highlight');
	const codeElement = codeHighlight.querySelector('code');
	const lineNumbers = container.querySelector('#line-numbers');

	const lineHeight = 21;
	const paddingTop = 10;

	function updateEditor() {
		codeElement.textContent = codeInput.value;
		hljs.highlightElement(codeElement);

		const lineCount = codeInput.value.split('\n').length;
		let numbersText = '';
		for (let i = 1; i <= lineCount; i++) {
			numbersText += i + '\n' ;
		}
		lineNumbers.textContent = numbersText.slice(0, -1);
	}

	codeInput.addEventListener('input', updateEditor);

	codeInput.addEventListener('scroll', () => {
		requestAnimationFrame(() => {
			codeHighlight.scrollTop = codeInput.scrollTop;
			codeElement.scrollLeft = codeInput.scrollLeft;
			lineNumbers.scrollTop = codeInput.scrollTop;
		});
	});

	function adjustInitialHeight() {
		const containerHeight = container.querySelector('.code-editor').offsetHeight;
		codeInput.style.height = containerHeight + 'px';
	}

	adjustInitialHeight();
	updateEditor();
	window.addEventListener('resize', adjustInitialHeight);
}

document.addEventListener("DOMContentLoaded", function () {
	criarEditorDeCodigo(containerEditorDeCodigo);

	const codeButton = document.getElementById("codeButton");
	const playButton = document.getElementById("playButton");
	const stopButton = document.getElementById("stopButton");

	if (codeButton) codeButton.addEventListener("click", toggleEditorDeCodigo);
	if (playButton) playButton.addEventListener("click", runUserCode);
	if (stopButton) stopButton.addEventListener("click", stopUserCode);
});