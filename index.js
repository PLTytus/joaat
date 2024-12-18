
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

	document.querySelectorAll("input[type=text], textarea").forEach(input => input.addEventListener("input", () => input.value = input.value.toUpperCase()));

	document.querySelectorAll("textarea").forEach(ta => ta.addEventListener("scroll", () => {
		document.querySelectorAll("textarea").forEach(at => {
			if(at !== ta){
				at.scroll(0, ta.scrollTop);
			}
		});
	}));

	document.querySelector("input[name=category]").addEventListener("input", function(){
		Object.entries(joaat(this.value, null, 1, this.form.trim.checked)).forEach(([k, v]) => this.form[k + "_plus"].value = v);
		this.form.input.dispatchEvent(new Event("input"));
	});

	document.querySelectorAll("[type=radio], [type=checkbox]").forEach(input => input.addEventListener("input", () => input.form.input.dispatchEvent(new Event("input"))));

	document.querySelector("[name=input]").addEventListener("input", function(){
		let trim = this.form.trim.checked;
		let plus = this.form.category.value;
		let type = this.form.type.value;
		let input = this.value.split("\n");

		let lines = input.length;
		this.form.querySelectorAll("td:has(textarea)").forEach(td => td.dataset.before = [...Array(lines).keys()].map(x => x + 1).join("\n"));
	
		this.form.output.value = input.map(x => joaat(x, null, 1, trim)[type]).join("\n");
		this.form.output_plus.value = input.map(x => joaat(x, plus, 1, trim)[type]).join("\n");
	});
}