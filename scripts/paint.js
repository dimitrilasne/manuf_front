// Variables :
var color = "#000000";
var painting = false;
var started = false;
var width_brush = 6;
var canvas = document.querySelector("#canvas");
var cursorX, cursorY;
var restoreCanvasArray = [];
var restoreCanvasIndex = 0;

var context = canvas.getContext('2d');
const responseDOM = document.querySelector('#response');
const sendButtonDOM = document.querySelector('#send');

// Trait arrondi
context.lineJoin = 'round';
context.lineCap = 'round';

// Click souris enfoncé sur le canvas, je dessine :
canvas.addEventListener('mousedown', function (e) {
  painting = true;

  // Coordonnées de la souris :
  cursorX = (e.pageX - this.offsetLeft);
  cursorY = (e.pageY - this.offsetTop);
});

// Relachement du Click sur tout le document, j'arrête de dessiner :
document.addEventListener('mouseup', function () {
  painting = false;
  started = false;
});

// Mouvement de la souris sur le canvas :
canvas.addEventListener('mousemove', function (e) {
  // Si je suis en train de dessiner (click souris enfoncé) :
  if (painting) {
    // Set Coordonnées de la souris :
    cursorX = (e.pageX - this.offsetLeft) - 10; // 10 = décalage du curseur
    cursorY = (e.pageY - this.offsetTop) - 10;

    // Dessine une ligne :
    drawLine();
  }
});

// Fonction qui dessine une ligne :
function drawLine() {
  // Si c'est le début, j'initialise
  if (!started) {
    // Je place mon curseur pour la première fois :
    context.beginPath();
    context.moveTo(cursorX, cursorY);
    started = true;
  }
  // Sinon je dessine
  else {
    context.lineTo(cursorX, cursorY);
    context.strokeStyle = color;
    context.lineWidth = width_brush;
    context.stroke();
  }
}

// Clear du Canvas :
function clear_canvas() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Bouton Reset :
document.querySelector("#reset").addEventListener('click', function () {
  // Clear canvas :
  clear_canvas();
  responseDOM.textContent = "";
});

// bouton load modele
/*
document.querySelector("#load_modele").addEventListener('click', function () {
	const apiUrl = document.querySelector('#api-url').value;
	const newapiUrl =  apiUrl.split("/")
	
	const newurl = newapiUrl[0]+'//'+newapiUrl[2]+'/load_new_modele';
	var myHeaders = new Headers();
	myHeaders.append("Origin", "192.168.99.101");
	
	
	fetch(newurl, {
		method: 'post',
		headers: myHeaders,
		body:'0'
	  })
});
*/


// Bouton Save :
document.querySelector("#send").addEventListener('click', function () {
  const apiUrl = document.querySelector('#api-url').value;
  if (!apiUrl) {
    alert('Enter an API url');
    return;
  }

  var canvas_tmp = document.getElementById("canvas");	// Ca merde en pernant le selecteur jQuery
  /*var canvas_tmp_tx = canvas_tmp.getContext("2d");
  const imge = canvas_tmp_tx.getImageData(0, 0, 84, 84)
  const img = imge.data*/

  //const img = canvas_tmp.toDataURL("image/png");

  // console.log(img);

  sendButtonDOM.className = "button orange";
  sendButtonDOM.textContent = 'loading ... ';
  responseDOM.textContent = 'loading ...';

  var myHeaders = new Headers();
  myHeaders.append("Origin", "192.168.99.101");

  canvas_tmp.toBlob(function(blob) {
    fetch(apiUrl, {
      method: 'post',
      headers: myHeaders,
      body: blob
    }).then(response => {
    return response.json();
  }).then(data => {
    const prettyData = formatData(data);
    console.log('data', data)
    responseDOM.innerHTML = prettyData;
  }).catch(e => {
    responseDOM.textContent = e.message
  }).finally(() => {
    sendButtonDOM.className = "button green";
    sendButtonDOM.textContent = 'Send ';
   })
 })


  function formatData(obj) {
    const values = Object.values(obj).map(Number);
    const maxNumber = Math.max(...values);
    const index = values.indexOf(maxNumber);
    const sentence = values.map((e, i) => (
      i === index ?
        `<p class="winner">${i} : ${(e * 100).toFixed(2)}%</p>`
        :
        `<p>${i} : <span class="orange">${(e * 100).toFixed(2)}%</span></p>`
    ));
    return sentence.join('');
    console.log("maxNumber", maxNumber);
  }

});