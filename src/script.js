document.addEventListener("DOMContentLoaded", function () {
	const destino = document.getElementById("rightPanel");
	const codeDiv = document.getElementById("code");
	codeDiv.classList.add("code-container");

	const wrapper = document.createElement("div");
	wrapper.classList.add("code-wrapper");

	const lineNumbers = document.createElement("div");
	lineNumbers.classList.add("line-numbers");

	const scrollWrapper = document.createElement("div");
	scrollWrapper.classList.add("scroll-wrapper");

	const textarea = document.createElement("textarea");
	textarea.classList.add("code-textarea");
	textarea.setAttribute("wrap", "off");

	const highlightDiv = document.createElement("pre");
	const highlightCode = document.createElement("code");
	highlightCode.className = "language-javascript";
	highlightDiv.classList.add("highlight-div");
	highlightDiv.appendChild(highlightCode);

	scrollWrapper.appendChild(highlightDiv);
	scrollWrapper.appendChild(textarea);

	function updateLineNumbers() {
		const lines = textarea.value.split("\n").length;
		lineNumbers.innerHTML = "";
		for (let i = 1; i <= lines; i++) {
			lineNumbers.innerHTML += i + "\n";
		}
	}

	function updateHighlight() {
		highlightCode.textContent = textarea.value;
		hljs.highlightElement(highlightCode);
	}

	textarea.addEventListener("input", () => {
		updateLineNumbers();
		updateHighlight();
	});

	textarea.addEventListener("scroll", () => {
		lineNumbers.scrollTop = textarea.scrollTop;
		highlightDiv.scrollTop = textarea.scrollTop;
		highlightDiv.scrollLeft = textarea.scrollLeft;
	});

	updateLineNumbers();
	updateHighlight();

	wrapper.appendChild(lineNumbers);
	wrapper.appendChild(scrollWrapper);
	codeDiv.appendChild(wrapper);
	destino.appendChild(codeDiv);
});

export function toggleCode() {
	const codeDiv = document.getElementById("code");
	codeDiv.style.display = codeDiv.style.display === "none" ? "block" : "none";
}
