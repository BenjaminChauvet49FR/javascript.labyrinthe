var rightPressed = false;
var upPressed = false;
var leftPressed = false;
var downPressed = false;

/*function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
	if(e.keyCode == 38) {
        upPressed = true;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
}*/

/*
Lié aux inputs in-game.
Chaque fois qu'un déplacement est effectué, il est consommé,
 mais ce système est réservé à un framerate lent.
*/
var rightConsommable = false;
var leftConsommable = false;
var upConsommable = false;
var downConsommable = false;
function keyDownConsommableHandler(e){
	if(e.keyCode != 123){
		e.preventDefault(); //Cette ligne bloque le debugger...
	}
    if(e.keyCode == 39) {
        rightConsommable = true;
		lastInputPasse = DROITE;
		return;
    }
    if(e.keyCode == 37) {
        leftConsommable = true;
		lastInputPasse = GAUCHE;
		return;
	}
	if(e.keyCode == 38) {
        upConsommable = true;
		lastInputPasse = HAUT;
		return;
    }
    if(e.keyCode == 40) {
        downConsommable = true;
		lastInputPasse = BAS;
		return;
	}	
	
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
		lastInputPasse = INDEFINI;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
		lastInputPasse = INDEFINI;
	}
	if(e.keyCode == 38) {
        upPressed = false;
		lastInputPasse = INDEFINI;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
		lastInputPasse = INDEFINI;
    }
}


//ci-dessus, le théorique. Maintenant, place à l'usage en pratique (qu'il faudrait théoriser...)


var dernierInput = -1; //Indique laquelle des 4 touches a été touchée en dernier
var framesAttente = 0; //Indique le nombre de frames à attendre
const nbFramesAttente = 1; 

function deplacerPersonnageTimer(){	
	if (rightConsommable){
		if(terrain[personnage.y][personnage.x].murD == MUR_OUVERT){
			personnage.x++;
		}
		annulerConsommables();
		return;
	}

	if (leftConsommable){
		if(personnage.x > 0 && terrain[personnage.y][personnage.x-1].murD == MUR_OUVERT){
			personnage.x--;
		}
		annulerConsommables();
		return;
	}
	
	if (upConsommable){
		if(personnage.y > 0 && terrain[personnage.y-1][personnage.x].murB == MUR_OUVERT){
			personnage.y--;
		}
		annulerConsommables();
		return;
	}
	
	if (downConsommable){
		if(terrain[personnage.y][personnage.x].murB == MUR_OUVERT){
			personnage.y++;
		}
		annulerConsommables();
		return;
	}
	
}

function annulerConsommables(){
	leftConsommable = false;
	upConsommable = false;
	rightConsommable = false;
	downConsommable = false;
}
