const folder = "/img/gender_indentity/";
const initalWidth = 850;
var resourceCount = 0;

const canvas = document.getElementById("gender-ident");
const ctx = canvas.getContext("2d");

const downloadBtn = document.getElementById("g-download");

ctx.lineCap = "round";
ctx.lineWidth = 4;

function addImage(src) {
	var res = new Image();
	resourceCount += 1;
	res.src = folder + src;

	res.onload = () => {
		resourceCount -= 1;
	};

	return res;
};

const mieps = addImage("Mieps.png");
const stripe = addImage("trans_stripe.png");
const title = addImage("titel.png");
const title_gender = addImage("gender.png");
const title_genderIdent = addImage("gender_ausdruck.png");
const label_gender = addImage("label_gender.png");
const label_sexuality = addImage("label_sexualität.png");
const text_mieps = addImage("mieps_text.png");
const text_tgDe = addImage("tg_de.png");
const title_sexuality = addImage("sexuelle_anziehung.png");
const title_romance = addImage("romantische_anziehung.png");

function checkResourcesLoaded() {
	if (resourceCount == 0) {
		runMain();
	} else {
		setTimeout(checkResourcesLoaded, 50);
	}
}

checkResourcesLoaded();

var mouseOver = false;
var sliders = [];
var factor = 1;

function updateFactor() {
	let rect = canvas.getBoundingClientRect();
	factor = rect.width / initalWidth;
}

updateFactor();

function runMain() {
	const colors = [
		"#DE5757",
		"#DE7B57",
		"#DEB157",
		"#B5DE57",
		"#57DE5D",
		"#57D7DE",
		"#57B6DE",
		"#5C57DE",
		"#8E57DE",
		"#D957DE",
		"#DE579B",
		"#DE5757"
	];

	function draw() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//Draw Card
		ctx.fillStyle = '#383A40';
		ctx.fillRect(392, 0, 458, 550);

		ctx.drawImage(title, 63, 37);
		ctx.drawImage(title_gender, 422, 99);
		ctx.drawImage(title_genderIdent, 422, 203);
		ctx.drawImage(title_sexuality, 422, 308);
		ctx.drawImage(title_romance, 422, 412);

		ctx.drawImage(text_mieps, 76, 497);
		ctx.drawImage(text_tgDe, 637, 534);

		ctx.drawImage(label_gender, 671, 131);
		ctx.drawImage(label_gender, 671, 236);
		ctx.drawImage(label_sexuality, 671, 341);
		ctx.drawImage(label_sexuality, 671, 446);

		ctx.drawImage(mieps, 48, 153);
		ctx.drawImage(stripe, 813, 0);

		sliders.forEach(s => {
			s.draw();
		});
	}

	function frameLoop () {
		draw();

		mouseOver = false;
		sliders.forEach(s => {
			s.update();
		});

		if (mouseOver) {
			canvas.style.cursor = "pointer";
		} else {
			canvas.style.cursor = "default";
		}

		window.requestAnimationFrame(frameLoop);
	}

	const sStart = 139;
	const sStepLarge = 105;
	const sStepSmall = 24.2;

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 3; j++) {
			sliders.push(new Slider(421, sStart + (sStepLarge * i) + (sStepSmall * j), 235, colors[(i * 3) + j]));
		}
	}

	window.requestAnimationFrame(frameLoop);
};

const handle_size = 10;

class Slider {
	constructor(x, y, width, color) {
		this.color = color;
		this.x = x;
		this.y = y;
		this.width = width;
		this.sliderPos = x;
		this.isDraged = false;
	}

	draw() {
		ctx.strokeStyle = '#BFBFBF';
		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.moveTo(this.sliderPos, this.y);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.stroke();

		ctx.strokeStyle = this.color;

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.sliderPos, this.y);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.sliderPos, this.y, handle_size, 0, 2*Math.PI);
		ctx.fill();
	}

	update() {
		if (this.isDraged) {
			this.sliderPos = mouse.x;
			if (this.sliderPos < this.x) this.sliderPos = this.x;
			if (this.sliderPos > this.x + this.width) this.sliderPos = this.x + this.width;
		}

		if (pointBoxCollision(mouse, this.sliderPos, this.y, handle_size, handle_size)) {
			mouseOver = true;
		}
	}

	click() {
		if(pointBoxCollision(mouse, this.sliderPos, this.y, handle_size, handle_size)) {
			this.isDraged = true;
		}
	}

	touch() {
		if(pointBoxCollision(mouse, this.x + (this.width / 2), this.y, this.width / 2, handle_size)) {
			this.isDraged = true;
		}
	}
}

var mouse = {x:0, y:0};

function pointBoxCollision(point, boxX, boxY, boxWidth, boxHeight) {
	return (Math.abs(boxX - point.x) < (boxWidth)
		&&  Math.abs(boxY - point.y) < (boxHeight));
}

function updateMouse(pos) {
	let rect = canvas.getBoundingClientRect();
	mouse.x = pos.x - rect.left;
	mouse.y = pos.y - rect.top;

	mouse.x = mouse.x / factor;
	mouse.y = mouse.y / factor;
}

canvas.addEventListener('mousemove', function(event) {
	updateMouse({x:event.clientX, y:event.clientY});
});

window.onresize = updateFactor;

canvas.addEventListener('mousedown', function(event) {
	sliders.forEach(s => {
		s.click();
	});
});

canvas.addEventListener('touchstart', function(event) {
	if (event.touches.length > 1) {
		return;
	}

	let touch = event.touches[0];
	updateMouse({x:touch.clientX, y:touch.clientY});

	sliders.forEach(s => {
		s.touch();
	});
	event.preventDefault();
});

canvas.addEventListener('touchmove', function(event) {
	if (event.touches.length > 1) {
		return;
	}

	let touch = event.touches[0];

	updateMouse({x:touch.clientX, y:touch.clientY});
	event.preventDefault();
});

canvas.addEventListener('touchend', function(event) {
	if (event.touches.length != 0) {
		return;
	}

	sliders.forEach(s => {
		s.isDraged = false;
	});
});

document.addEventListener('mouseup', function(event) {
	sliders.forEach(s => {
		s.isDraged = false;
	});
});

canvas.addEventListener('mouseup', function(event) {
	var img = canvas.toDataURL("image/png");
	downloadBtn.setAttribute('href', img);
	downloadBtn.setAttribute('download', "meine_gender_identität.png");
});