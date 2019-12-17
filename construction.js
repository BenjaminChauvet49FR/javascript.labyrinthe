/**
Construction d'un labyrinthe dont le terrain est préconfiguré avec certains murs ouverts ou fermés
et les points de départ et d'arrivée sont donnés
*/

function constructionLabyrinthe(terrain,depart,arrivee){
	const hauteur = terrain.length;
	const largeur = terrain[0].length;

	var mursSuspens = []; //Liste des murs auxquels on s'attaque ou s'est attaqué {caseX,caseY,isBas,fait} . Leur index démarre à 0. (cela est important pour la cohérence vis-à-vis de indexMursSuspensNonFaits et de numerosMurs)
	var indexMursSuspensNonFaits = []; //Liste des index des mursSuspens avec fait à false
	var nbMursSuspens = 0; //Variable globale à la fonction qui définit le nombre de murs en suspens ("fait" à false dans mursSuspens)
	var numerosMurs = new Array(hauteur); //Tableau qui donne l'index de chaque mur (bas ou droite) de chaque case dans le tableau mursSuspense (-1 si absent)
	var casesStopCreusage = new Array(hauteur); //Tableau de booléens qui indique sur quelles cases du terrain on s'arrête d'explorer
	var casesExplorees = new Array(hauteur); //Tableau de booléens qui indique quelles cases s'arrêtent
	
	var stopCreusage = false; //Booléen qui vaut true dès qu'on donne l'ordre d'arrêter de creuser. Se remet à false chaque fois qu'on creuse un nouveau chemin aléatoire.
	
	//Variables utilisées en boucle for
	var ix,iy,i;
	var alea;
	
	var indexMurAFermer; //Index du mur que l'on a récupéré dans mursSuspens (quand on tâtonne un mur en suspens)

	/*
	Initialise les tableaux.
	Pas d'intelligence dans cette fonction.
	*/
	function setupGeneral(){
		for(iy=0;iy<hauteur;iy++){
			numerosMurs[iy] = new Array(largeur);
			casesStopCreusage[iy] = new Array(largeur);
			casesExplorees[iy] = new Array(largeur);
			for(ix=0;ix<largeur;ix++){
				numerosMurs[iy][ix] = {murD:-1,murB:-1};
				casesStopCreusage[iy][ix] = false;
				casesExplorees[iy][ix] = false;
			}
		}
	}
	
	/*
	Installer les "cases de stop creusage" qui servent à mettre fin à la fonction "creuserCheminAleatoire"
	*/
	function installerCasesStopCreusage(){
		//var nbCases = Math.floor(Math.sqrt(hauteur*largeur)+0.5);
		var nbCases = 5; //On diminue - 1910545 - les arrêts aléatoires.
		var aleaX,aleaY;
		for(i=0;i<nbCases;i++){
			do{
				aleaX = aleatoire(0,largeur-1);
				aleaY = aleatoire(0,hauteur-1);
			} while (casesStopCreusage[aleaY][aleaX]);
			casesStopCreusage[aleaY][aleaX] = true;
		}
	}
	

	/*
	Déclare tous les murs de la case en suspens (+ ceux alentours).
	Au départ la case est inexplorée.
	*/
	function explorerCase(x,y,directionOrigine){
		casesExplorees[y][x] = true;
		//console.log("On explore "+x+" "+y);
		if (casesStopCreusage[y][x]){
			stopCreusage = true;
			//console.log("Case \"stop creusage\" rencontrée !");
		}
		if (directionOrigine != HAUT && y != 0){
			//console.log("On tatonne en haut");
			testerMurBas(x,y-1,BAS);
		}
		if (directionOrigine != DROITE && x != largeur-1){
			//console.log("On tatonne a droite");
			testerMurDroite(x,y,GAUCHE);
		}
		if (directionOrigine != BAS && y != hauteur-1){
			//console.log("On tatonne en bas");
			testerMurBas(x,y,HAUT);
		}
		if (directionOrigine != GAUCHE && x != 0){
			//console.log("On tatonne a gauche");
			testerMurDroite(x-1,y,DROITE);
		}
	}
	

	
	
	/*
	teste le mur bas d'une case (x,y) alors qu'on a exploré cette case ou celle en-dessous (on tâte au-dessus).	
	x,y : coordonnées de la case dont on tâte le mur
	directionOrigine : HAUT ou BAS en fonction de par où on le tâte
	Précondition : on n'est pas sur la dernière ligne (y maximal) pour ne pas créer de suspense inutile et on est sur une ligne existante (y >= 0)
	*/
	function testerMurBas(x,y,directionOrigine){
		if (terrain[y][x].murB == MUR_SUSPENS){
			finSuspensMur(x,y,true,MUR_FERME);
		}
		if (terrain[y][x].murB == MUR_INDEFINI){
			declarerMurSuspens(x,y,true);
		}
		if (terrain[y][x].murB == MUR_OUVERT){
			if(directionOrigine == HAUT && !casesExplorees[y+1][x]){
				explorerCase(x,y+1,HAUT);
			}
			if(directionOrigine == BAS && !casesExplorees[y][x]){
				explorerCase(x,y,BAS);
			}
		}
	}
	
	/*
	Idem avec le mur de droite et on n'est pas sur la denière colonne (x maximal)
	*/
	function testerMurDroite(x,y,directionOrigine){
		if (terrain[y][x].murD == MUR_SUSPENS){
			finSuspensMur(x,y,false,MUR_FERME);
		}
		if (terrain[y][x].murD == MUR_INDEFINI){
			declarerMurSuspens(x,y,false);
		}
		if (terrain[y][x].murD == MUR_OUVERT){
			if(directionOrigine == GAUCHE && !casesExplorees[y][x+1]){
				explorerCase(x+1,y,GAUCHE);
			}
			if(directionOrigine == DROITE && !casesExplorees[y][x]){
				explorerCase(x,y,DROITE);
			}
		}
	}
	
	/*
	Déclare qu'un mur (de la case x,y) est en suspens
	et apporte les modifications correspondantes sur mursSuspens, indexMursSuspensNonFaits et nbMursSuspens
	A la sortie de la fonction, tous les murs ont des index entre 0 et mursSuspens.length-1 (voilà pourquoi le push n'est fait qu'à la fin).
	*/
	function declarerMurSuspens(x,y,isBas){
		if (isBas){
			terrain[y][x].murB = MUR_SUSPENS;
			numerosMurs[y][x].murB = mursSuspens.length;			
		}
		else{
			terrain[y][x].murD = MUR_SUSPENS;
			numerosMurs[y][x].murD = mursSuspens.length;						
		}
		indexMursSuspensNonFaits.push(mursSuspens.length);
		mursSuspens.push({caseX:x,caseY:y,isMurBas:isBas,fait:false});
		nbMursSuspens++;
		//console.log("On a mis en suspens le mur "+(isBas ? "bas":"droite")+" de "+y+","+x+" ("+(mursSuspens.length-1)+")");
	}
	
	/*
	Déclarer qu'un mur n'est plus en suspens (car ouvert ou fermé)
	et apporte les modifications correspondantes sur mursSuspens, indexMursSuspensNonFaits et nbMursSuspens
	*/
	function finSuspensMur(x,y,isBas,nouvelEtat){
		if (isBas){
			terrain[y][x].murB = nouvelEtat;
		}
		else{
			terrain[y][x].murD = nouvelEtat;
		}
		indexMurAFermer = (isBas ? numerosMurs[y][x].murB : numerosMurs[y][x].murD);
		mursSuspens[indexMurAFermer].fait = true;
		indexMursSuspensNonFaits = supprimerTableauCroissant(indexMursSuspensNonFaits,indexMurAFermer);
		nbMursSuspens--;
		//console.log("On a "+(nouvelEtat == MUR_FERME ? "fermé" : "ouvert")+" le mur "+(isBas ? "bas":"droite")+" de "+y+","+x);
	}
	
	/**
	Renvoie naïvement un indice de mur à casser
	*/
	function choixMurNaif(){
		return aleatoire(0,nbMursSuspens-1);
	}
	
	/**
	Renvoie un indice de mur en favorisant les derniers ainsi explorés. "Je finirai ce que j'ai commencé."
	*/
	function choixMurPondere(probaRelancer){
		var alea = aleatoire(0,nbMursSuspens-1);
		if (alea*100 < nbMursSuspens*probaRelancer){
			return aleatoire(0,nbMursSuspens-1);
		}
		return alea;
	}
	
	
	
	/*
		Prérequis : il y a au moins un mur à casser
	*/
	function creuserCheminAleatoire(){
		stopCreusage = false;
		var premierIndexNouveau;
		var indexDebug = 0; //1910545 à supprimer à terme, pour éviter une boucle while infinie !
		var murCasse; //mur contenu dans mursSuspens

		
		//console.log("Cassure d'un mur au hasard parmi "+indexMursSuspensNonFaits);
		alea = choixMurNaif();//Choix d'un indice entre 0 et nbMursSuspens
		//puisqu'il y a nbMursSuspens éléments de mursSuspens avec fait à false, on prendra le alea-ème d'entre eux.
	    murCasse = mursSuspens[indexMursSuspensNonFaits[alea]]; //Casser un mur aléatoire parmi tous les murs en suspens
		//console.log("Cassure du mur "+indexMursSuspensNonFaits[alea]);
		do{
			finSuspensMur(murCasse.caseX,murCasse.caseY,murCasse.isMurBas,MUR_OUVERT);
			premierIndexNouveau = mursSuspens.length; //Vaut 1 de plus que le dernier index de mursSuspens actuel puisque c'est le premier index du nouveau mur en suspens
			if (murCasse.isMurBas){
				//On a cassé un mur vertical. Mais de quel côté vient-on au fait ? D'au-dessus ou d'en-dessous ?
				if (casesExplorees[murCasse.caseY][murCasse.caseX]){
					explorerCase(murCasse.caseX,murCasse.caseY+1,HAUT);
				}
				else{
					explorerCase(murCasse.caseX,murCasse.caseY,BAS);
				}
			}
			else{
				if (casesExplorees[murCasse.caseY][murCasse.caseX]){
					explorerCase(murCasse.caseX+1,murCasse.caseY,GAUCHE);
				}
				else{
					explorerCase(murCasse.caseX,murCasse.caseY,DROITE);
				}	
			}
			//console.log("Murs en suspens obtenus de "+premierIndexNouveau+" a "+(mursSuspens.length-1));
			if (premierIndexNouveau > mursSuspens.length-1){
				stopCreusage = true;
			}
			if (!stopCreusage){
				//console.log(mursSuspens);
				alea = aleatoire(premierIndexNouveau,mursSuspens.length-1);
				//console.log("On casse le mur "+alea);
				murCasse = mursSuspens[alea]; //Casser un mur aléatoire parmi les derniers tatonnés
			}
			indexDebug++;
		}while (!stopCreusage && indexDebug < 128);
	}
	
	/*
	Fonction principale
	*/
	setupGeneral();
	installerCasesStopCreusage();
	explorerCase(depart.x,depart.y,INDEFINI);
	while(nbMursSuspens > 0){
		creuserCheminAleatoire();
	}
	return terrain;
	
	
}



/*Renvoie un entier aléatoire entre a et b inclus. Prérequis : a <= b*/
function aleatoire(a,b){
	return Math.floor(Math.random()*(b-a+1)+a);
}

/*
Supprime un élément d'un tableau. 
Prérequis : tous les éléments du tableau sont distincts et dans l'ordre croissant.
L'élément à supprimer est effectivement présent dans le tableau (puisqu'on l'a répertorié ailleurs)
*/
function supprimerTableauCroissant(tableau,elementASupprimer){
			var indexDebug = 0; //1910545 à supprimer à terme, pour éviter une boucle while infinie !
	var positionMin = 0;
	var positionMax = tableau.length-1;
	var positionActuelle = Math.floor((positionMin+positionMax)/2);
	//Recherche du bon index. On tire profit du fait que le tableau est croissant.
	while(tableau[positionActuelle] != elementASupprimer && indexDebug < 128){
		indexDebug++;
		if (tableau[positionActuelle] < elementASupprimer){
			positionMin = positionActuelle+1;
			positionActuelle = Math.floor((positionMin+positionMax)/2);
			//console.log("ALEA "+positionMin+" "+positionMax+" "+positionActuelle);
			continue;
		}
		else{
			positionMax = positionActuelle-1;
			positionActuelle = Math.floor((positionMin+positionMax)/2);
			//console.log("ALEA "+positionMin+" "+positionMax+" "+positionActuelle);
			continue;
		}
	}
	tableau.splice(positionActuelle,1);
	return tableau;
}