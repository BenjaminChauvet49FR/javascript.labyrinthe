/*Ce fichier g�re les dessins de la fonction */

window.onload = function()
{
    var canvas = document.getElementById('mon_canvas');
        if(!canvas)
        {
            alert("Impossible de r�cup�rer le canvas");
            return;
        }

    var context = canvas.getContext('2d');
        if(!context)
        {
            alert("Impossible de r�cup�rer le context du canvas");
            return;
        }
		
	canvas.width = paramPx.canvasWidth;
	canvas.height = paramPx.canvasHeight;
		

	document.addEventListener("keydown", keyDownConsommableHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	
	function dessinScene(){
		dessinLabyrinthe(context,terrain,paramPx,couleurs,personnage);
		deplacerPersonnageTimer();		
	}
	setInterval(dessinScene,30);
	
	
}


