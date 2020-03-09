'use strict';


const LIIO = 3.6;
const LIPO = 3.7;
const LIFE = 3.2;
const R = 0.00003728226;

const getId = (x='') => document.getElementById(x);
const getIdNumVal = (x='') => Number(document.getElementById(x).value);
const getTagName = (x='') => document.getElementsByTagName(x);


let App = {
	IDs: [
		'battQuantity', 'motorKV', 'motorEff',
		'motorPT', 'wheelPT', 'wheelSize'
	],
	Names: [
		'Battery Quantity', 'Motor KV', 'Motor Efficiency',
		'Motor Pulley Teeth', 'Wheel Pulley Teeth', 'Wheel Size'
	],
	Wheel: () => {
		let img = new Image(256,256);
		let canvas = getId('wheel');
		let ctx = canvas.getContext('2d');
		
		img.src = 'images/wheel.jpg';
		ctx.drawImage(img, 10, 10);
		console.log('img', img.width, img.height);
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
		// console.log('Km/h',topSpeed);
	},
	Set: () => {
		let x = getTagName('input');
		for (let i = 0; i < x.length; i++) {
			x[i].setAttribute('type', 'number');
			x[i].id = App.IDs[i];
			x[i].maxLength = 5;
			x[i].addEventListener('input',App.Calculate);
			switch (i) {
				case 0:
					x[i].min = 3;
					x[i].max = 12;
					x[i].value = 6;
					break;
				case 1:
					x[i].min = 1;
					x[i].max = Infinity;
					x[i].value = 170;
					break;
				case 2:
					x[i].min = 1;
					x[i].max = 100;
					x[i].value = 85;
					break;
				case 3:
					x[i].min = 12;
					x[i].max = 100;
					x[i].value = 16;
					break;
				case 4:
					x[i].min = 12;
					x[i].max = 100;
					x[i].value = 36;
					break;
				case 5:
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