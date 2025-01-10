// spec: https://huggingface.co/docs/safetensors/en/index
var RES_CONTAINER = document.getElementById("result_container");
var HF_URL_INPUT = document.getElementById("input_url");

function _extend_buf(buf, chunk){
	const res = new Uint8Array(buf.length + chunk.length);
	res.set(buf);
	res.set(chunk, buf.length);
	return res
}

// --------------------------------------------------

function clean_safetensors_header(header){
	// TODO
	// format like model.layer{0-23}.{attn_w, attn_q, attn_k} etc?
}

// --------------------------------------------------

async function fetch_header(url){
	const response = await fetch(url);

	if (!response.ok || url.length == 0){
		return {"err": "url not valid"};
	}
	const reader = response.body.getReader();

	// setup
	let buf = new Uint8Array(0)
	const curr = await reader.read();
	let done = curr.done;
	let chunk = curr.value

	const header_bytes = chunk.slice(0, 8);
	const dv = new DataView(header_bytes.buffer);
	const header_size = dv.getBigUint64(0, true);
	buf = _extend_buf(buf, chunk);
	
	// keep extending buffer if header can't fit
	while (!done && BigInt(buf.length) < header_size){

		console.log("buf extended", BigInt(buf.length), "target:", header_size);
		const curr = await reader.read();
		done = curr.done;
		chunk = curr.value;

		buf = _extend_buf(buf, chunk);
	}

	// slice header json
	const raw = new TextDecoder().decode(buf.slice(8, 8+Number(header_size)));
	const header = JSON.parse(raw);
	return header;
}


async function view_from_url(){
	RES_CONTAINER.innerHTML = "Loading..."
	try{
		const safetensors_header = await fetch_header(HF_URL_INPUT.value);
		RES_CONTAINER.innerHTML = JSON.stringify(safetensors_header, undefined, 2);
	}
	catch(err){
		RES_CONTAINER.innerHTML = `Couldn't parse: ${err}`
	}
}


document.getElementById("view_btn").addEventListener("click", view_from_url);


