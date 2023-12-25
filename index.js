
const TRANSLATE = {
	s: "string",
	p: "plus",
	c: "category",
	uint: "unsigned",
	sint: "signed",
	hex: "hex",
};

function int32(i){
	return i & 0xFFFFFFFF;
}

function signedInt32(i){
	return i | (-(i & 0x80000000));
}

function signedInt8(i){
	return i | (-(i & 0x80));
}

function unsignedInt(i){
	return i >>> 0;
}

function hex(i){
	return i.toString(16).toUpperCase();
}

function joaat(s, c=null, m=1/*1|-1*/, t=true){
	if(t){
		s = s.trim();
		if(c !== null) c = c.trim();
	}

	s = unescape(encodeURIComponent(s.toLowerCase()));
	
	var hash = 0;

	for(let i = 0; i < s.length; i++){
		hash = int32(hash + signedInt8(s.charCodeAt(i)));
		hash = int32(hash + (hash << 10));
		hash = int32(hash ^ (hash >>> 6));
	}

	hash = int32(hash + (hash << 3));
	hash = int32(hash ^ (hash >>> 11));
	hash = int32(hash + (hash << 15));

	if(c !== null) hash = int32(hash + joaat(c).signed * m);

	let uint = unsignedInt(hash);

	return {
		signed: hash,
		unsigned: uint,
		hex: hex(uint),
	};
}

document.onreadystatechange = function(){
	document.querySelectorAll("input[type=text]").forEach(input => {
		input.addEventListener("input", function(){
			this.value = this.value.toUpperCase();
		});
	});

	document.querySelector("input[name=category]").addEventListener("input", function(){
		document.querySelectorAll("input.output_category").forEach(input => input.value = this.value.toUpperCase());
	});

	document.querySelector("form[name=joaat]").addEventListener("submit", function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		document.querySelectorAll(".result").forEach(x => x.innerHTML = "");

		let t = this.trim.checked
		let s = this.string.value;
		let c = this.category.value;

		result = {
			string: joaat(s, null, 1, t),
			plus: joaat(s, c, 1, t),
			category: joaat(c, null, 1, t),
		};

		document.querySelectorAll(".result").forEach(x => {
			let t = x.id.split('_');
			x.innerHTML = result[TRANSLATE[t[1]]][TRANSLATE[t[0]]];
		});
	});
}