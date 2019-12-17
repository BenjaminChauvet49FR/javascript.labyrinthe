//var parametres = {hauteur:40,largeur:40,offset:{h:2,d:1,g:1,b:2},isHorizontal:false};
var parametres = {};
var depart = {};
var arrivee = {};
var personnage ={
	x:depart.x,
	y:depart.y
};

var paramPx = {
	terrH:5,terrD:5,terrB:5,terrG:5,
	caseH:1,caseD:1,caseB:1,caseG:1,
	caseLarg:0,caseHaut:0,
	offsetX:0,offsetY:0,
	canvasWidth:920,canvasHeight:560,
	labyrintheWidth:920,labyrintheHeight:560
};
var couleurs = {
	ferme:'#000000',
	ouvert:'#ffffff',
	suspens:'#ccffcc',
	indefini:'#ffcccc',
	mursBord:'#d00000',
	personnage:'#c000ff'
};

//Définition des boutons
var submitGenererLabyrinthe = document.getElementById('submit_generer_labyrinthe');
var submitRedemarrer = document.getElementById('submit_redemarrer');
var texteHauteur = document.getElementById('texte_hauteur');
var texteLargeur = document.getElementById('texte_largeur');
var selectTypeLabyrinthe = document.getElementById('selectionner_type_labyrinthe');
var radioOrientationDiv = document.getElementById('radio_orientation_div');
var selectDistributionDiv = document.getElementById('select_distribution_div');
var selectDistribution = document.getElementById('select_distribution');
var texteOffsetGauche = document.getElementById('texte_offset_gauche');
var texteOffsetHaut = document.getElementById('texte_offset_haut');
var texteOffsetDroite= document.getElementById('texte_offset_droite');
var texteOffsetBas= document.getElementById('texte_offset_bas');
var texteOpacite= document.getElementById('texte_opacite');
var texteOpaciteDiv = document.getElementById('div_texte_opacite');
var inputsOffsetDiv = document.getElementById('textes_offset_div');

//---------------
//Top départ !
submitGenererLabyrinthe.addEventListener('click',reinitialiserLabyrinthe);
submitRedemarrer.addEventListener('click',function(e){
	personnage.x = depart.x;
	personnage.y = depart.y;
});
initialiserLabyrinthe({});


//Attention : mélange forme et fonctions ci-dessous ! (mais pas d'intelligence)

function initialiserLabyrinthe(){
	parametres.hauteur = parseInt(texteHauteur.value);
	parametres.largeur = parseInt(texteLargeur.value);
	depart.x = 0;
	depart.y = 0;
	initialiserLabyrinthe2();
}

function reinitialiserLabyrinthe(e){
	parametres.hauteur = parseInt(texteHauteur.value);
	parametres.largeur = parseInt(texteLargeur.value);
	depart.x = 0;
	depart.y = 0;
	initialiserLabyrinthe2();
}

function initialiserLabyrinthe2(){
	personnage.x = depart.x;
	personnage.y = depart.y;
	calculerPixelsTailleCase();
	genererTerrain();
}


/*
Obtenir le type du labyrinthe
*/
function isTypeUni(){ return (selectTypeLabyrinthe.value == "type_labyrinthe_uni"); }
function isTypeCible(){ return (selectTypeLabyrinthe.value == "type_labyrinthe_cible"); }
function isTypePlus(){ return (selectTypeLabyrinthe.value == "type_labyrinthe_plus"); }
function isTypeLignes(){ return (selectTypeLabyrinthe.value == "type_labyrinthe_lignes_uniformes"); }
function isTypeIllusionR(){ return (selectTypeLabyrinthe.value == "type_labyrinthe_illusion"); }
function isDistPluie(){ return (selectDistribution.value == "distribution_pluie"); }
function isDistPointilles(){ return (selectDistribution.value == "distribution_pointilles"); }
function isDistMuraille(){ return (selectDistribution.value == "distribution_muraille"); }

/*
Rendre visible et invisible
*/
selectTypeLabyrinthe.addEventListener("change",function(e){
	var orientationDiv = isTypeLignes() || isTypeIllusionR();
	var opaciteDiv = isDistPluie() && !isTypeUni() && !isTypePlus();
	var distributionDiv = !isTypeUni() && !isTypePlus();
	var offsetDiv = !isTypeUni() && !isTypeCible();
	
	radioOrientationDiv.style.visibility = orientationDiv ? "visible":"hidden";
	texteOpaciteDiv.style.visibility = opaciteDiv ? "visible":"hidden";
	selectDistributionDiv.style.visibility = distributionDiv ? "visible":"hidden";
	inputsOffsetDiv.style.visibility = offsetDiv ? "visible":"hidden";
	
	if (isTypeIllusionR()){
		texteOffsetGauche.value = parseInt(texteLargeur.value)/5;
		texteOffsetHaut.value   = parseInt(texteHauteur.value)/5;
		texteOffsetDroite.value = parseInt(texteLargeur.value)/5;
		texteOffsetBas.value    = parseInt(texteHauteur.value)/5;
	}
	
});

selectDistribution.addEventListener("change",function(e){
	texteOpaciteDiv.style.visibility = isDistPluie() ? "visible" : "hidden";
});


/*
Génération du terrain en fonction de la valeur du type (plus certains paramètres, bientôt)
post-condition : terrain est fabriqué.
*/
function genererTerrain(){
	parametres.offset = {
		h:parseInt(texteOffsetHaut.value),
		d:parseInt(texteOffsetDroite.value),
		g:parseInt(texteOffsetGauche.value),
		b:parseInt(texteOffsetBas.value)
	};
	if (isTypeUni()){
		terrain = genererTerrainVierge(parametres);
	}
	if (isTypeLignes()){
		setParametresHorizontal();
		parametres.illusion = false;
		if (isDistPointilles()){
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainPointilles(terrain,parametres,filtreRectangulaireOuvert);
		}
		if (isDistMuraille()){
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainMuraille(terrain,parametres,filtreRectangulaireFerme);
		}
		if (isDistPluie()){
			parametres.opacite = parseFloat(texteOpacite.value);
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainPluie(terrain,parametres,filtreRectangulaireFerme);
		}
	}
	if (isTypePlus()){
		terrain = genererTerrainPlus(parametres);
	}
	if (isTypeCible()){
		// A faire !
	}
	if (isTypeIllusionR()){
		setParametresHorizontal();
		parametres.illusion = true;
		if (isDistPointilles()){
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainPointilles(terrain,parametres,filtreRectangulaireOuvert);
		}
		if (isDistMuraille()){
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainMuraille(terrain,parametres,filtreRectangulaireFerme);
		}
		if (isDistPluie()){
			parametres.opacite = parseFloat(texteOpacite.value);
			terrain = genererTerrainVierge(parametres);
			terrain = distribuerTerrainPluie(terrain,parametres,filtreRectangulaireFerme);
		}
	}
	terrain = constructionLabyrinthe(terrain,depart,arrivee);
}

/*
Tester paramètre horizontal/vertical
*/
function setParametresHorizontal(){
	var radioOrientation = document.getElementsByName("radio_orientation");
	parametres.isHorizontal = radioOrientation[0].checked;	
}




/*
Calcule les pixels en fonctions des valeurs de parametres.hauteur/largeur
Prérequis : ces deux dernières valeurs sont connues
*/
function calculerPixelsTailleCase(){
	var tailleCase = Math.min(
		Math.floor((paramPx.labyrintheWidth-paramPx.terrD-paramPx.terrG)/parametres.largeur),
		Math.floor((paramPx.labyrintheHeight-paramPx.terrH-paramPx.terrB)/parametres.hauteur)
	);
	paramPx.caseLarg = tailleCase;
	paramPx.caseHaut = tailleCase;
	if (tailleCase <= 8){
		paramPx.caseH = 0;
		paramPx.caseD = 0;
	}
	else{
		paramPx.caseH = 1;
		paramPx.caseD = 1;
	}
}
