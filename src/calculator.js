// 'use strict';


const LIIO = 3.6;
const LIPO = 3.7;
const LIFE = 3.2;
const R = 0.00003728226;
const mmPix = 3.7795275591;

const getId = (x = '') => document.getElementById(x);
const getIdNumVal = (x = '') => Number(document.getElementById(x).value);
const getTagName = (x = '') => document.getElementsByTagName(x);
var handle;

let App = {
	IDs: [
		'battQuantity', 'motorKV', 'motorEff',
		'motorPT', 'wheelPT', 'wheelSize'
	],
	Names: [
		'Battery Quantity', 'Motor KV', 'Motor Efficiency',
		'Motor Pulley Teeth', 'Wheel Pulley Teeth', 'Wheel Size'
	],

	Wheel: function () {
		let img = getId('imgwheel');
		let canvas = getId('wheel');
		let wheelSize = getIdNumVal('wheelSize');
		canvas.width = img.width;
		canvas.height = img.height;
		let ctx = canvas.getContext('2d');

		// Wheel 
		let wheelCirc = Number((wheelSize * Math.PI / 1000).toFixed(4));
		let mpm = Number((App.Calculate().speedKMH / 0.06).toFixed(4));
		let wheelRPM = Number(mpm / wheelCirc);
		let wheelRPS = wheelRPM / 60;
		
		if (handle != null) {
			clearInterval(handle)
		};

		handle = setInterval(Rotate, wheelRPS);
		
		ctx.translate(canvas.width / 2, canvas.height / 2);
		function Rotate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.save();
			ctx.rotate(wheelRPS * Math.PI / 180);
			ctx.drawImage(img, -img.width / 2, -img.width / 2);
			// ctx.restore();
		}

		console.table({wheelCirc, mph: mpm, wheelRPM, wheelRPS});
		console.log('handle', handle);
	},

	Calculate: () => {
		let V = getIdNumVal('battQuantity') * LIIO;
		let motor_rpm = getIdNumVal('motorKV') * V;
		let wheelSize = getIdNumVal('wheelSize');
		let gearRatio = getIdNumVal('motorPT') / getIdNumVal('wheelPT');
		let mph = motor_rpm * wheelSize * Math.PI * R * gearRatio;
		let eff = getIdNumVal('motorEff') / 100;
		let topSpeed = (mph * 1.609344).toFixed(2);
		let kmh = ' Km/h';

		getId('top-speed').innerHTML = topSpeed + kmh;
		getId('top-speed_w').innerHTML = (topSpeed * eff).toFixed(2) + kmh;

		return {
			speedKMH: topSpeed,
			wheelSize: wheelSize,
		}
	},

	Set: () => {
		let x = getTagName('input');
		for (let i = 0; i < x.length; i++) {
			x[i].maxLength = 5;
			x[i].id = App.IDs[i];
			x[i].setAttribute('type', 'number');
			x[i].addEventListener('input', App.Wheel);
			switch (i) {
				case 0: //Battery Quantity
					x[i].min = 3;
					x[i].max = 12;
					x[i].value = 6;
					break;
				case 1: //KV
					x[i].min = 1;
					x[i].max = Infinity;
					x[i].value = 170;
					break;
				case 2: // Motor Efficiency
					x[i].min = 1;
					x[i].max = 100;
					x[i].value = 85;
					break;
				case 3: // Motor Pulley Teeth
					x[i].min = 12;
					x[i].max = 100;
					x[i].value = 16;
					break;
				case 4: // Motor Pulley Teeth
					x[i].min = 12;
					x[i].max = 100;
					x[i].value = 36;
					break;
				case 5: // Wheel Size
					x[i].min = 65;
					x[i].max = 200;
					x[i].value = 83;
					break;
				default:
					break;
			}
		}
	},

	Setup: function () {
		window.onload = () => {
			this.Set();
			this.Calculate();
			this.Wheel();
		}
		console.log('Setup complete!');
	}
}

App.Setup();