
const TRANSLATE = {
	s: "string",
	p: "plus",
	m: "minus",
	c: "category",
	uint: "unsigned",
	sint: "signed",
	hex: "hex",
};

document.onreadystatechange = function(){
	document.querySelectorAll("input[type=text]").forEach(input => {
		input.addEventListener("input", function(){
			this.value = this.value.trim().toUpperCase();
		});
	});

	document.querySelector("input[name=category]").addEventListener("input", function(){
		document.querySelectorAll("input.output_category").forEach(input => input.value = this.value.trim().toUpperCase());
	});

	document.querySelector("form[name=joaat]").addEventListener("submit", function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		document.querySelectorAll(".result").forEach(x => x.innerHTML = "");

		let xhr = new XMLHttpRequest();

		xhr.open("POST", "joaat.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Accept", "application/json");
		xhr.send(`string=${this.string.value.trim()}&category=${this.category.value}`);
		xhr.onreadystatechange = function(){
			if(this.readyState === 4) {
				let response;

				try {
					response = JSON.parse(this.response);
				} catch(_){
					response = false;
				}

				if(response){
					document.querySelectorAll(".result").forEach(x => {
						let t = x.id.split('_');
						x.innerHTML = response[TRANSLATE[t[1]]][TRANSLATE[t[0]]];
					});
				} else {
					document.querySelectorAll(".result").forEach(x => x.innerHTML = "");
				}
			}
		}
	});
}