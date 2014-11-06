/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

IMPORTANTEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!
EL TAMAÑO DE TRABAJO DE IMAGEN, FORMATO DE DESCARGA Y MODO DE IMAGEN VIENEN DADOS POR EL FICHERO DE CONFIGURACION, PARA USARLOS
	-window.maxHeight
	-window.maxWidth
	-window.modoImagen
	-window.formatoDescarga
*/

var imagen;
var nombre;
var output = [];
var objetosBogui = [];
var objetoActual = 0;
//var posicionObjetoActual = 0;
var numeroObjetos = 0;
var altoHistograma = 470;
var anchoHistograma = 500;

$(document).ready(function() {
	//Añadimos el evento para las imagenes
	$("#fileSelector").on("change", readImage);
	
	// Hover para los botones de la barra
	$( "#tools li" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);	
	//Habilitamos tooltips del menu
	$( "#bars" ).tooltip();	
	
	//Añadimos la opciones del menu
	$("#fileButton, #fileMenu").click(function() {
		$("#fileSelector").click();
	});	

	$("#ajusteBrilloContraste").click(function() {
		var dialog, form;
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
			title: "Ajuste lineal de brillo y contraste:",
			height: 250,
			width: 350,
			modal: true,
			buttons: {
			Ok:function(ui) {
				  //COGEMOS LOS VALORES
				  var newBrillo =  $( this ).find( '#sliderBrillo' ).slider( "value" );
				  var newContraste = $( this ).find( '#sliderContraste' ).slider( "value" );
				  //EJECUTAR BRILLO Y CONTRASTE
				  cambiarBrilloContraste(objetosBogui[ obtenerPosArray( objetoActual) ], newBrillo, newContraste);
				  $(this).dialog( "close" );
				  $(this).remove();
			},
			Cancel: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
			}
			},
			dialogClass: 'no-close' 
		});
		
		dialog.append("<form><fieldset><p><label for=\"brilloSpinner\">Brillo:</label><input id=\"brilloSpinner\" name=\"brightValue\" type=\"text\"></p><div id=\"sliderBrillo\"></div><p><label for=\"contrasteSpinner\">Contraste:</label><input id=\"contrasteSpinner\" name=\"contrastValue\" type=\"text\"></p><div id=\"sliderContraste\"></div></fieldset></form>");;

		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});		
		
		var brilloSpinner = $( "#brilloSpinner" ).spinner({
			min: -255,
			max: 255,
			step: 1,
			start: 0,
			stop: (function (event, ui) {
				$( "#sliderBrillo" ).slider( "value", $(this).spinner('value') );
			}),
			spin: (function(event, ui ){
			$( "#sliderBrillo" ).slider( "value", ui.value );
			})
		}).on('input', function () {
			 var val = this.value,
				 $this = $(this),
				 max = $this.spinner('option', 'max'),
				 min = $this.spinner('option', 'min');
				 if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
			 this.value = val > max ? max : val < min ? min : val;
		 });	
			
		$( "#sliderBrillo" ).slider({
		  range: "min",
		  value: 0,
		  min: -255,
		  autofocus: "autofocus",
		  max: 255,
		  slide: function( event, ui ) {
			brilloSpinner.spinner( "value", ui.value );
		  }
		});
		brilloSpinner.spinner( "value", $( "#sliderBrillo" ).slider( "value" ));

		var contrasteSpinner = $( "#contrasteSpinner" ).spinner({
			min: 0,
			max: 255,
			step: 1,
			start: 0,
			stop: (function (event, ui) {
				$( "#sliderContraste" ).slider( "value", $(this).spinner('value') );
			}),
			spin: (function(event, ui ){
			$( "#sliderContraste" ).slider( "value", ui.value );
			})
		}).on('input', function () {
			 var val = this.value,
				 $this = $(this),
				 max = $this.spinner('option', 'max'),
				 min = $this.spinner('option', 'min');
				 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
			 this.value = val > max ? max : val < min ? min : val;
		 });	
	
		$( "#sliderContraste" ).slider({
		  range: "min",
		  value: 0,
		  min: 0,
		  autofocus: "autofocus",
		  max: 255,
		  slide: function( event, ui ) {
			contrasteSpinner.spinner( "value", ui.value );
		  }
		});
		contrasteSpinner.spinner( "value", $( "#sliderContraste" ).slider( "value" ));
		

		dialog.dialog();
	});		

	$("#transformacionTramos").click(function() {
		var dialog, form;
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
			title: "Transformacion lineal por tramos:",
			height: 200,
			width: 350,
			modal: true,
			buttons: {
			Ok:function() {
				  //COGEMOS LOS VALORES
				  var numTramos =  $( this ).find( '#tramosSlider' ).slider( "value" );
				  $(this).dialog( "close" );
				  $(this).remove();
				  transformacionLinealTramosDialog(numTramos);
			},
			Cancel: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
			}
			},
			dialogClass: 'no-close' 	
		});
		
		dialog.append("<form><fieldset><p><label for=\"tramosSpinner\">Numero de tramos:</label><input id=\"tramosSpinner\" name=\"tramosValue\" type=\"text\"></p><div id=\"tramosSlider\"></div></fieldset></form>");;

		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});		
		
		var tramosSpinner = $( "#tramosSpinner" ).spinner({
			min: 1,
			max: 254,
			step: 1,
			start: 1,
			stop: (function (event, ui) {
				$( "#tramosSlider" ).slider( "value", $(this).spinner('value') );
			}),
			spin: (function(event, ui ){
			$( "#tramosSlider" ).slider( "value", ui.value );
			})
		}).on('input', function () {
			 var val = this.value,
				 $this = $(this),
				 max = $this.spinner('option', 'max'),
				 min = $this.spinner('option', 'min');
				 if (!val.match(/^\d*$/)) val = 1; //we want only number, no alpha
			 this.value = (val > max) ? max : val;
		 });	
			
		$( "#tramosSlider" ).slider({
		  range: "min",
		  value: 1,
		  min: 1,
		  autofocus: "autofocus",
		  max: 254,
		  slide: function( event, ui ) {
			tramosSpinner.spinner( "value", ui.value );
		  }
		});
		tramosSpinner.spinner( "value", $( "#tramosSlider" ).slider( "value" ));

		dialog.dialog();
	});		
	
	$("#instaDownloadButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
		}else{
			descargar(window.formatoDescarga);
		}	
	});		
});

function transformacionLinealTramosDialog(numTramos){
		var dialog, form;
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
			title: "Especifique los tramos:",
			height: 360,
			width: 285,
			modal: true,
			buttons: {
			Ok:function() {
				    var error = false;
					var puntoAnterior = -1;
					var counter = 0;
					var puntos = [];
									
					while(error == false && counter < numTramos)
					{
						var a =  $( this ).find( '#a'+counter ).spinner( "value" );
						var b =  $( this ).find( '#b'+counter ).spinner( "value" );			
						if(a == null || b == null || b <= a || a < puntoAnterior )
						{
							puntos = null;
							error = true;							
						}else{
							puntoAnterior = b;
							counter = counter+1;
							puntos.push([a,b]);	
						}
					}
					
					if(error == false)
					{
						//MOSTRAMOS GRAFICA CON LOS PUNTOS Y DECIDIMOS SI APLICAR
						//APLICAR Y CERRAR
							//FUNCION TRANSFORMACION
							//CIERRE
							$(this).dialog( "close" );
							$(this).remove();
					}else
					{
						mostrarError("Introduzca el número correcto de parametros");
					}

			},
			Cancel: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
			}
			},
			dialogClass: 'no-close' 	
		});
		
		var tramos = "<form><fieldset><table><tbody>";
		
		for(i=0; i <= numTramos; i++){
				tramos = tramos + "<tr><td><label>Punto "+(i+1)+":</label></td><td><input id=\"a"+i+"\" name=\"a"+i+"\" type=\"text\"></td><td><input id=\"b"+i+"\" name=\"b"+i+"\" type=\"text\"></td></tr>";
		}
		
		dialog.append(tramos+"</tbody></table></form>");;

		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});			

		for(i=0; i <= numTramos; i++){
			var tramoASpinner = $( "#a"+i ).spinner({
				min: 0,
				max: 255,
				step: 1,
				start: 0
			}).on('input', function () {
				 var val = this.value,
					 $this = $(this),
					 max = $this.spinner('option', 'max'),
					 min = $this.spinner('option', 'min');
					 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
				 this.value = (val > max) ? max : val;
			 });	
			 
			var tramoBSpinner = $( "#b"+i ).spinner({
				min: 0,
				max: 255,
				step: 1,
				start: 0
			}).on('input', function () {
				 var val = this.value,
					 $this = $(this),
					 max = $this.spinner('option', 'max'),
					 min = $this.spinner('option', 'min');
					 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
				 this.value = (val > max) ? max : val;
			 });				 
			 
		}
		
		if(form.height() <= 274){
			var newHeigth = form.height() + 110;
			dialog.dialog("option", "height", newHeigth); 
		}

		dialog.dialog();
}


function readImage() {
    if ( this.files && this.files[0] ) {
        var FR = new FileReader();
        nombre = this.files[0].name;
        FR.onload = function(e) {    
		imagen = new Image();  
	    imagen.src = e.target.result;
		imagen.onload = function() {
		     objetosBogui.push(new Bogui(imagen, numeroObjetos-1, nombre));
		     cambiarFoco(numeroObjetos-1);
		   };
        };    
        FR.readAsDataURL( this.files[0] );
	numeroObjetos++;
    }
}

function quitarFormato(cadena){
	var exp = /(.*)(\..*)/g
	var res = exp.exec(cadena);
	return res[1];

}

function Bogui(img, id, name) {

	//ATRIBUTOS
	this.ident = id;
	this.modo = window.modoImagen;
	this.imagen = img;
	this.formato = "";
	this.nombre = quitarFormato(name);
	this.imgCanvas;
	this.regCanvas;
	this.ctx;
	this.regctx;
	this.click = false;
	this.histograma = new Array(256);
	this.histogramaAcumulativo = new Array(256);
	this.dialogoHistograma;
	this.contenedorHistograma;
	this.dialogoHistogramaAcumulativo;
	this.contenedorHistogramaAcumulativo;
	this.mouseXini = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYini = 0;
	this.mouseXfin = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYfin = 0;
	
	//METODOS

	
	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvas"+this.ident);
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	this.imgCanvas.setAttribute("class", "capaCanvas");

	
	//Crear ventana con el canvas
	this.dialogo = $('<div/>', {
	    id: "dialogo" + this.ident,
		title: this.nombre,
	   	height: maxHeight,
		width: maxWidth
	}).appendTo('#workspace');

	var canvasContainer = $("<div id=\"canvasContainer"+this.ident+"\" class=\"canvasContainer\"></div>");
	canvasContainer.append(this.imgCanvas);

	this.dialogo.dialog({ resizable: false });
	
	this.dialogo.on("dialogclose",function(e){			
		var exp = /dialogo(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];
		borrarObjetoBogui(idActual);
		
 	});
	
	this.dialogo.on( "dialogfocus", function( e, ui ) {
						var exp = /dialogo(\d+)/i
						var res = exp.exec(e.target.id);
						var idActual = res[1];

						cambiarFoco(idActual);
						} );

	//Dibujar imagen en el canvas
	this.ctx = this.imgCanvas.getContext('2d');
	this.ctx.drawImage(this.imagen, 0, 0);

	//Reducir imagen y ponerla en blanco y negro
	obtenerFormato(this);
	reducirImagen(this);
	RGBA2BW(this);



	this.regCanvas = document.createElement("canvas");
	this.regCanvas.setAttribute("id", "canvasreg"+this.ident);
	this.regCanvas.setAttribute("height", this.imgCanvas.height);
	this.regCanvas.setAttribute("width", this.imgCanvas.width);
	this.regCanvas.setAttribute("z-index", 1);
	this.regCanvas.setAttribute("class", "capaCanvas");

	
	canvasContainer.append(this.regCanvas);
	canvasContainer.append("<div style=\"clear:both\"></div>");
	canvasContainer.css("height",this.imgCanvas.height+"px");
	canvasContainer.css("width",this.imgCanvas.width+"px");
	
	$('.ui-dialog :button').blur();//REMOVE FOCUS
	
	this.dialogo.append(canvasContainer);
	this.dialogo.append("<div id=\"position"+this.ident+"\"><span id=\"coordinates"+this.ident+"\">x= - y= - value= - </span></div>");
	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width + 24); 
	this.dialogo.css("overflow","hidden");

	
	//Listeners del canvas
	$(this.regCanvas).mousedown(function(e){
		e.target.click = true;
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];
		var pos = findPos(this);
                objetosBogui[obtenerPosArray(idActual)].mouseXini = e.pageX - pos.x;
                objetosBogui[obtenerPosArray(idActual)].mouseYini = e.pageY - pos.y;
	});

	//MOUSE MOVE??
	

	$(this.regCanvas).mouseup(function(e){
		e.target.click = false;
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		var pos = findPos(this);
        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
		dibujarRegionInteres(objetosBogui[obtenerPosArray(idActual)]);
	});

	$(this.regCanvas).mousemove(function(e) {

        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;

        var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

        if(e.target.click == true){
	        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
	        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
	        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
        	objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
			dibujarRegionInteres(objetosBogui[obtenerPosArray(idActual)]);
		}

		

                var p = objetosBogui[obtenerPosArray(idActual)].ctx.getImageData(x, y, 1, 1).data;
                var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
				if(x >= 0 && y >= 0){
					$("#coordinates"+ objetosBogui[obtenerPosArray(idActual)].ident).html("x=" + x + " y=" + y + " value=" + hex);
				}
                

        });		
}

function dibujarRegionInteres(objetoBoguiActual){

	objetoBoguiActual.regCanvas.width = objetoBoguiActual.regCanvas.width;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");

	objetoBoguiActual.regctx.rect(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini, objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini , objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.lineWidth="2";
	objetoBoguiActual.regctx.strokeStyle="#39b1cc";
	objetoBoguiActual.regctx.stroke();
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
 
function rgbToHex(r, g, b){
        if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
}



function obtenerPosArray(id){

	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			return i;	
		}
	}

}

function mostrarError(mensaje){
	$("body").append("<div id=\"dialog-message\"><div class=\"izq\"><img src=\"../images/error.png\" alt=\"Error\"></div><div class=\"dcha\"><p>"+mensaje+"</p></div></div>");
	$("#dialog-message").dialog({
		title: "Error",
		modal: true,
		buttons: {
		Ok: function() {
		  $(this).dialog( "close" );
		  $(this).remove();
		}
		},
		dialogClass: 'no-close' 
	});

}


function cambiarFoco(foco){
	
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == foco ){
			objetoActual = i;	
		}
	}
}

function descargarImagen(objetoBoguiActual, nombreArchivo, formato){

	var dataUrl;
	var link = document.createElement('a');
   	
	switch(formato){
	case "png":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".png";
		break;
	case "jpeg":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/jpeg', 1);
		dataUrl = dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".jpeg";
		break;
	case "webp":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/webp', 1);
		dataUrl = dataUrl.replace("image/webp",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".webp";
		break;
	default:
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL();
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".png";
	}
	link.href = dataUrl;
   	link.click();
}

function obtenerFormato(objetoBoguiActual){
	//var exp = /"data:image/(\w+);.*/i;
	var exp = new RegExp("data:image/(.*);.*","g");
	var res = exp.exec(objetoBoguiActual.imagen.src);
	var cadena = res[1];
	objetoBoguiActual.formato = "." + cadena;
}

function crearHistogramaSimple(objetoBoguiActual){

	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
   	var pixelData = imageData.data;

	//Inicializar Variables
	for(i = 0; i < objetoBoguiActual.histograma.length; i++) {
		objetoBoguiActual.histograma[i] = 0;
	}
	
	//Rellenar histograma Simple
   	for(j = 0; j < pixelData.length; j += 4) {
		objetoBoguiActual.histograma[pixelData[j]]++; 
	}

	//Histograma Simple
	objetoBoguiActual.dialogoHistograma = jQuery('<div/>', {
	    	id: "dialogo" + objetoBoguiActual.ident
	}).appendTo('#workspace');

	objetoBoguiActual.contenedorHistograma = jQuery('<div/>').appendTo(objetoBoguiActual.dialogoHistograma);
	objetoBoguiActual.contenedorHistograma.attr("autofocus", "autofocus");
	
	objetoBoguiActual.contenedorHistograma.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    max: Math.max.apply(Math, objetoBoguiActual.histograma),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Simple',
            data: objetoBoguiActual.histograma,
	    color: "#39b1cc"

        }]
    });
	//APPEND
	objetoBoguiActual.dialogoHistograma.dialog();
	objetoBoguiActual.dialogoHistograma.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistograma.dialog("option", "resizable", false);
	objetoBoguiActual.dialogoHistograma.dialog("option", "width", anchoHistograma); 
	objetoBoguiActual.dialogoHistograma.dialog("option", "height", altoHistograma);

	//Se cierran los histogramas ya que no deben abrirse hasta que el usuario los invoque.
	objetoBoguiActual.dialogoHistograma.dialog( "close" );
}


function crearHistogramaAcumulativo(objetoBoguiActual){

	crearHistogramaSimple(objetoBoguiActual);
	//Inicializar Variables
	for(i = 0; i < objetoBoguiActual.histograma.length; i++) {
		objetoBoguiActual.histogramaAcumulativo[i] = 0; 
	}

	//Rellenar histograma Acumulativo
	objetoBoguiActual.histogramaAcumulativo[0] = objetoBoguiActual.histograma[0]; 
	for(k = 1; k < objetoBoguiActual.histograma.length; k++) {
		objetoBoguiActual.histogramaAcumulativo[k] = objetoBoguiActual.histograma[k] + objetoBoguiActual.histogramaAcumulativo[k-1]; 
	}

	//Histograma Acumulativo
	
	objetoBoguiActual.dialogoHistogramaAcumulativo = jQuery('<div/>', {
	    	id: "dialogo" + objetoBoguiActual.ident
	}).appendTo('#workspace');

	
	objetoBoguiActual.contenedorHistogramaAcumulativo = jQuery('<div/>').appendTo(objetoBoguiActual.dialogoHistogramaAcumulativo);
	objetoBoguiActual.contenedorHistogramaAcumulativo.attr("autofocus", "autofocus");
	
	objetoBoguiActual.contenedorHistogramaAcumulativo.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma Acumulativo'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    max: Math.max.apply(Math, objetoBoguiActual.histogramaAcumulativo),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Acumulativo',
            data: objetoBoguiActual.histogramaAcumulativo,
	    color: "#39b1cc"

        }]
    });

	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog();
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "resizable", false);
	
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "width", anchoHistograma); 
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "height", altoHistograma);

	//Se cierran los histogramas ya que no deben abrirse hasta que el usuario los invoque.
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog( "close" );
}


function borrarObjetoBogui(id){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			objetosBogui.splice(i, 1);
		}
	}
	if(objetosBogui.length > 0){
		objetosBogui[0].dialogo.dialog( "moveToTop" );
		objetoActual = 0;
	}else{
		objetoActual = null;
	}
}

function reducirImagen(objetoBoguiActual){

	//Hacer un nuevo canvas
	var canvasCopy = document.createElement("canvas");
	var copyContext = canvasCopy.getContext("2d");

	// Determinar el ratio de conversion de la imagen
	var ratio = 1;
	if(objetoBoguiActual.imagen.width > window.maxWidth)
		ratio = window.maxWidth / objetoBoguiActual.imagen.width;
	else if(objetoBoguiActual.imagen.height > window.maxHeight)
		ratio = window.maxHeight / objetoBoguiActual.imagen.height;

	//Dibujar la imagen original en el segundo canvas
	canvasCopy.width = objetoBoguiActual.imagen.width;
	canvasCopy.height = objetoBoguiActual.imagen.height;
	copyContext.drawImage(objetoBoguiActual.imagen, 0, 0);
	//Copiar y cambiar de tamño el segundo canvas en el primer canvas
	objetoBoguiActual.imgCanvas.width = objetoBoguiActual.imagen.width * ratio;
	objetoBoguiActual.imgCanvas.height = objetoBoguiActual.imagen.height * ratio;
	objetoBoguiActual.ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);

}

function RGBA2BW(objetoBoguiActual){

	//Obtener la matriz de datos.
	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imagen.width, objetoBoguiActual.imagen.height);
   	var pixelData = imageData.data;
   	var bytesPerPixel = 4;

	//Modificar los valores RGB para pasarlos a B&W
   	for(var y = 0; y < objetoBoguiActual.imagen.height; y++) {
      		for(var x = 0; x < objetoBoguiActual.imagen.width; x++) {
			 var startIdx = (y * bytesPerPixel * objetoBoguiActual.imagen.width) + (x * bytesPerPixel);

			 var red = pixelData[startIdx];
			 var green = pixelData[startIdx + 1];
			 var blue = pixelData[startIdx + 2];
			 //Cambiar para NTSC Y PAL Y PONER LOS VALORES DEL GUION
			
			 var grayScale;

			 switch(objetoBoguiActual.modo){
				 case "PAL":
					 grayScale = (red * 0.222) + (green * 0.707) + (blue * 0.071);
					 break;
				 case "NTSC":
					 grayScale = (red * 0.2999) + (green * 0.587) + (blue * 0.114);
					 break;
			 }

			 pixelData[startIdx] = grayScale;
			 pixelData[startIdx + 1] = grayScale;
			 pixelData[startIdx + 2] = grayScale;
	      	}
	   }
	//Cargar la matriz de datos en el canvas
	objetoBoguiActual.ctx.putImageData(imageData, 0, 0);

}


function recortar(objetoBoguiActual){ //objetosBogui[obtenerPosArray(objetoActual)]
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada");
	}else{
		var canvasCopy = document.createElement("canvas");
		var copyContext = canvasCopy.getContext("2d");

		var imageData = objetoBoguiActual.ctx.getImageData( objetoBoguiActual.mouseXini,  objetoBoguiActual.mouseYini,  objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini ,  objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini);

		canvasCopy.width = objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini;
		canvasCopy.height = objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini;

		copyContext.putImageData(imageData, 0,0);

		var savedData = new Image();
		savedData.src = canvasCopy.toDataURL("image/png", 1);
		//Cargar la matriz de datos en el canvas
		objetosBogui.push(new Bogui(savedData, numeroObjetos));
		cambiarFoco(numeroObjetos);
		numeroObjetos++;
	}
}

function calcularBrilloContraste(objetoBoguiActual){
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		crearHistogramaSimple(objetoBoguiActual);
		var brillo = 0;
		var contraste = 0;
		var total = 0;
		
		//BRILLO
		for (i = 0; i < objetoBoguiActual.histograma.length; i++) {
			brillo += objetoBoguiActual.histograma[i] * i;
			total = total + objetoBoguiActual.histograma[i];
		}

		brillo = brillo/total;

		//CONTRASTE
		for (i = 0; i < objetoBoguiActual.histograma.length; i++){
			contraste += objetoBoguiActual.histograma[i] * Math.pow( (brillo-i) ,2 );
		}

		contraste = Math.sqrt(contraste/total);
		return [brillo, contraste];
	}
}

function cambiarBrilloContraste(objetoBoguiActual, nuevoBrillo, nuevoContraste){
	if(typeof objetoBoguiActual == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{

		var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
		var pixelData = imageData.data;
		var bytesPerPixel = 4;
		var valores = calcularBrilloContraste(objetoBoguiActual);
		var brillo = valores[0];
		var contraste = valores[1];

		var a, b;
		var funcionTransferencia = new Array(256);
		if(contraste != 0){
			a = nuevoContraste / contraste; 
		}else{
			a = nuevoContraste / 0.001;
		}
		
		b = nuevoBrillo-a * brillo; 
		for (i = 0; i < funcionTransferencia.length; i++) {
			funcionTransferencia[i] = ((a * i) + b);
			if (funcionTransferencia[i] > 255)
			    funcionTransferencia[i] = 255;
			if (funcionTransferencia[i] < 0)
			    funcionTransferencia[i] = 0;
		}


		for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
			for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
				var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);

				pixelData[startIdx] = funcionTransferencia[pixelData[startIdx]];
				pixelData[startIdx+1] = funcionTransferencia[pixelData[startIdx+1]];
				pixelData[startIdx+2] = funcionTransferencia[pixelData[startIdx+2]];
			}
		}

		objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos));
		objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
		objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData, 0, 0);
		cambiarFoco(numeroObjetos);
		numeroObjetos++;
	}         
}


/////BOTONES INTERFAZ
function abrirHistograma(){

	if(typeof objetosBogui[objetoActual] == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		crearHistogramaSimple(objetosBogui[objetoActual]);
		objetosBogui[objetoActual].dialogoHistograma.dialog("open");
	}
}

function abrirHistogramaAcumulativo(){

	if(typeof objetosBogui[objetoActual] == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		crearHistogramaAcumulativo(objetosBogui[objetoActual]);
		objetosBogui[objetoActual].dialogoHistogramaAcumulativo.dialog("open");
		
	}
}

function descargar(formato){
	if(typeof objetosBogui[objetoActual] == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		descargarImagen(objetosBogui[objetoActual], "foto" + objetosBogui[objetoActual].ident, formato);
	}
}


function setModoImagen(modo){
	//TODO: Mostrar un mensaje al usuario de que se ha actualizado el modo
	if(typeof objetosBogui[objetoActual] == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		objetosBogui[objetoActual].modo = modo;
	}
}


function correcccionGamma(objetoBoguiActual, gamma){
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{

	        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
			var pixelData = imageData.data;
			var bytesPerPixel = 4;
	 
	        crearHistogramaSimple(objetoBoguiActual);
	 
	        var funcionTransferencia = new Array(256);

	        for (i = 0; i < objetoBoguiActual.histograma.length; i++){
	                funcionTransferencia[i] = objetoBoguiActual.histograma[i];
	        }
	        //Normalizar
	        
	        for (i = 0; i < funcionTransferencia.length; i++){
	                funcionTransferencia[i] = i/255
	        }
	        for (i = 0; i < funcionTransferencia.length; i++){
	                funcionTransferencia[i] = Math.pow(funcionTransferencia[i],gamma);
	        }
	        for (i = 0; i < funcionTransferencia.length; i++){
	                funcionTransferencia[i] = 255 * funcionTransferencia[i];
	        }
	 
	        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
				for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
					var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);

					pixelData[startIdx] = funcionTransferencia[pixelData[startIdx]];
					pixelData[startIdx+1] = funcionTransferencia[pixelData[startIdx+1]];
					pixelData[startIdx+2] = funcionTransferencia[pixelData[startIdx+2]];
				}
			}

			objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos));
			objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
			objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData, 0, 0);
			cambiarFoco(numeroObjetos);
			numeroObjetos++;  
	}
 
}

function calcularEntropia(objetoBoguiActual){
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{

		crearHistogramaSimple(objetoBoguiActual);
		var total = 0;
		var entropia = 0;
	 	for (i = 0; i < objetoBoguiActual.histograma.length; i++){
	 		total += objetoBoguiActual.histograma[i];
	 	}

	    for (i = 0; i < objetoBoguiActual.histograma.length; i++){

			probabilidad = objetoBoguiActual.histograma[i] / total;

			if(probabilidad != 0){
			    entropia += probabilidad * Math.log(probabilidad, 2);
			}
		}
		
		return Math.abs(entropia);	
		
	}
}