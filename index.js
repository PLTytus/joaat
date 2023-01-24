
const TRANSLATE = {
	s: "string",
	p: "plus",
	m: "minus",
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

function joaat(s, c=null, m=1/*1|-1*/){
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

		let s = this.string.value.trim();
		let c = this.category.value.trim();

		result = {
			string: joaat(s),
			plus: joaat(s, c, 1),
			minus: joaat(s, c, -1),
			category: joaat(c),
		};

		document.querySelectorAll(".result").forEach(x => {
			let t = x.id.split('_');
			x.innerHTML = result[TRANSLATE[t[1]]][TRANSLATE[t[0]]];
		});
	});
}