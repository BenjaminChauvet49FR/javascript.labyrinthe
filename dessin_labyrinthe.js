/*
Définit le dessin d'un labyrinthe
*/

/*
paramPx : {terrH,terrD,terrB,terrG,caseH,caseD,caseB,caseG,caseLarg,caseHaut,offsetX,offsetY} 
terrH/D/G/B : épaisseur des murs sur les côtés du terrain
caseH/D/G/B : épaisseur des murs sur chaque côté d'une case
caseLarg/Haut : largeur/hauteur d'une case en pixels
offsetX/Y : offset du labyrinthe par rapport au contexte
terrain : tableau de cases {murB,murD}
couleurs : {couleurMurG, }

*/
function dessinLabyrinthe(contexte,terrain,paramPx,couleurs,personnage){
	//console.log("Salut");
	contexte.clearRect(0, 0, paramPx.canvasWidth, paramPx.canvasHeight);
	
	const hauteur = terrain.length;
	const largeur = terrain[0].length;	
	const hauteurPxTotale = paramPx.caseHaut*hauteur+paramPx.terrH+paramPx.terrB-paramPx.caseH-paramPx.caseB; //Note : on retire le mur de case du haut et celui du bas
	const largeurPxTotale = paramPx.caseLarg*largeur+paramPx.terrG+paramPx.terrD-paramPx.caseG-paramPx.caseD;
	const departY = paramPx.offsetX+paramPx.terrH+paramPx.caseHaut-paramPx.caseB-paramPx.caseH; //Départ de pinceauY //Note : c'est l'origine du piton. Le "-caseH" est dû au fait qu'on retire le premier mur du haut qui se confond avec celui du bas
	const departX = paramPx.offsetY+paramPx.terrG+paramPx.caseLarg-paramPx.caseD-paramPx.caseG; //Départ de pinceauX
	const epaisseurHautPx = paramPx.caseD+paramPx.caseG;
	const epaisseurLargPx = paramPx.caseB+paramPx.caseH;
	const allongeHautPx = paramPx.caseHaut-epaisseurHautPx;
	const allongeLargPx = paramPx.caseLarg-epaisseurLargPx;
	
	var ix, iy;
	var laCase;
	var pinceauY = departY; //Abscisse de dessin du mur du bas de la case
	var pinceauX = departX; //Abscisse du dessin du mur de droite de la case
	
	contexte.fillStyle = couleurs.mursCase;
	
	//Murs des cases
	for(iy = 0;iy < hauteur; iy++){
		pinceauX = departX;
		for(ix = 0;ix < largeur; ix++){
			laCase = terrain[iy][ix];
			//Dessiner murs bas/droite
			contexte.fillStyle = etatMurToCouleur(couleurs,laCase.murB);
			contexte.fillRect(pinceauX-allongeLargPx,pinceauY,allongeLargPx,epaisseurHautPx);
			contexte.fillStyle = etatMurToCouleur(couleurs,laCase.murD);
			contexte.fillRect(pinceauX,pinceauY-allongeHautPx,epaisseurLargPx,allongeHautPx);
			//Dessiner un piton en bas à droite
			contexte.fillStyle = couleurs.ferme;
			contexte.fillRect(pinceauX,pinceauY,epaisseurLargPx,epaisseurHautPx);
			pinceauX += paramPx.caseLarg;
		}
		pinceauY += paramPx.caseHaut;
	}

	//Murs des bords
	contexte.fillStyle = couleurs.mursBord;
	contexte.fillRect(paramPx.offsetX,paramPx.offsetY,largeurPxTotale,paramPx.terrH);
	contexte.fillRect(paramPx.offsetX,paramPx.offsetY,paramPx.terrG,hauteurPxTotale);
	contexte.fillRect(paramPx.offsetX,paramPx.offsetY+hauteurPxTotale-paramPx.terrB,largeurPxTotale,paramPx.terrB);
	contexte.fillRect(paramPx.offsetX+largeurPxTotale-paramPx.terrD,paramPx.offsetY,paramPx.terrD,hauteurPxTotale);

	//Personnage
	contexte.fillStyle = couleurs.personnage;
	contexte.fillRect(paramPx.offsetX+paramPx.terrG+personnage.x*paramPx.caseLarg,
					  paramPx.offsetY+paramPx.terrH+personnage.y*paramPx.caseHaut,
					  allongeLargPx,
					  allongeHautPx);
	
}

/*
Donne la couleur (code hexadécimal) de l'état du mur
*/
function etatMurToCouleur(couleurs,etatMur){
	switch(etatMur){
		case (MUR_OUVERT):
			return (couleurs.ouvert);break;
		case (MUR_FERME):
			return (couleurs.ferme);break;
		case (MUR_INDEFINI):
			return (couleurs.indefini);break;
		case(MUR_SUSPENS):
			return (couleurs.suspens);break;	
	}
	return "";
}