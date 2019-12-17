/**
Ce fichier contient des fonctions qui renvoient des modèles de labyrinthe
*/

function genererTerrainVierge(parametres){
	var ix,iy;
	var terrain = [];
	for(iy=0;iy<parametres.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<parametres.largeur;ix++){
			terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
		}
	}
	return terrain;
}

/*
{hauteur,largeur,offset{h,d,g,b},isHorizontal}
*/
/*function genererTerrainPointilles(p){
	var ix,iy;
	var terrain = [];
	for(iy=0;iy<p.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<p.largeur;ix++){
			if(iy >= p.offset.h && iy < p.hauteur-p.offset.b - (p.isHorizontal ? 0 : 1) && 
			   ix >= p.offset.g && ix < p.largeur-p.offset.d - (p.isHorizontal ? 1 : 0) && 
				(ix%2) == (iy%2)){
					if(p.isHorizontal){
						terrain[iy].push({murD:MUR_OUVERT,murB:MUR_INDEFINI});
					}
					else{
						terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_OUVERT});
					}
				}
			else{
				terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
			}
		}
	}
	return terrain;
}*/

function filtreRectangulaireOuvert(p,ix,iy){
	if (iy >= p.offset.h && iy <= p.hauteur-p.offset.b - 1 && ix >= p.offset.g && ix <= p.largeur-p.offset.d - 1)
		return 1;
	else
		return p.illusion ? 2 : 0;
}

function filtreRectangulaireFerme(p,ix,iy){
	if (iy >= p.offset.h && iy <= p.hauteur-p.offset.b - 2 && ix >= p.offset.g && ix <= p.largeur-p.offset.d - 2)
		return 1;
	else
		return p.illusion ? 2 : 0;
}

/*
	Modifie l'état du mur situé à gauche/en haut/en bas/à droite de !!
*/
function modifierMur(terrain,direction,ix,iy,etat){
	switch (direction){
		case GAUCHE :
			terrain[ix-1][iy]
	}
}

/*
{hauteur,largeur,offset{h,d,g,b},isHorizontal}
*/
function distribuerTerrainPointilles(terrain,p,filtre){
	var ix,iy;
	var terrain2 = terrain;
	var valeurFiltre;
	for(iy=0;iy<p.hauteur;iy++){
		for(ix=0;ix<p.largeur;ix++){
			valeurFiltre = filtre(p,ix,iy);
			if ((ix%2) == (iy%2)){
				if (valeurFiltre == 1){
					console.log("Filtre 1 : "+ix+" "+iy);
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_OUVERT,murB:MUR_INDEFINI};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_OUVERT};
					}
				}
				if (valeurFiltre == 2){
					console.log("Filtre 2 : "+ix+" "+iy);
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_OUVERT};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_OUVERT,murB:MUR_INDEFINI};
					}
				}
			}	
		}
	}
	return terrain2;
}

function distribuerTerrainMuraille(terrain,p,filtre){
var ix,iy;
	var terrain2 = terrain;
	var valeurFiltre;
	for(iy=0;iy<p.hauteur;iy++){
		for(ix=0;ix<p.largeur;ix++){
			valeurFiltre = filtre(p,ix,iy);
			if ((ix%2) == (iy%2)){
				if (valeurFiltre == 1){
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
					}
				}
				if (valeurFiltre == 2){
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
					}
				}
			}	
		}
	}
	return terrain2;
}

function distribuerTerrainPluie(terrain,p,filtre){
	var ix,iy;
	var terrain2 = terrain;
	var valeurFiltre;
	for(iy=0;iy<p.hauteur;iy++){
		for(ix=0;ix<p.largeur;ix++){
			valeurFiltre = filtre(p,ix,iy);
			if (aleatoire(1,10000) <= 10000*p.opacite){
				if (valeurFiltre == 1){
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
					}
				}
				if (valeurFiltre == 2){
					if(p.isHorizontal){
						terrain2[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
					}
					else{
						terrain2[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
					}
				}
			}
		}
	}
	return terrain2;
}

/*
{hauteur,largeur,offset{h,d,g,b},isHorizontal}
Ici, on compte le nombre d'arêtes d'offset horizontales (si p.isHorizontal) sans compter les bords
*/
/*function genererTerrainMuraille(p){
	var ix,iy;
	var terrain = [];
	for(iy=0;iy<p.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<p.largeur;ix++){
			if(
			(iy >= p.offset.h+(p.isHorizontal ? 0 : 0)) && iy < p.hauteur-p.offset.b - (p.isHorizontal ? 1 : 0) && 
			  (ix >= p.offset.g+(p.isHorizontal ? 0 : 0)) && ix < p.largeur-p.offset.d - (p.isHorizontal ? 0 : 1) &&   
				(ix%2) == (iy%2)
				){
					if(p.isHorizontal){
						terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_FERME});
					}
					else{
						terrain[iy].push({murD:MUR_FERME,murB:MUR_INDEFINI});
					}
				}
			else{
				terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
			}
		}
	}
	return terrain;
}*/


function genererTerrainPlus(p){
	var ix,iy;
	var terrain = [];
	for(iy=0;iy<p.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<p.largeur;ix++){
			terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
			if(ix >= p.offset.g && iy >= p.offset.h && iy <= p.hauteur-p.offset.b-1 && ix <= p.largeur-p.offset.d-1){
				//Murs du bas et de droite à mettre
				if ((ix-2*iy)%5==0){
					terrain[iy][ix] = {murD:MUR_FERME,murB:MUR_FERME};
				}
				//en-dessous du centre d'un plus
				if ((ix-2*(iy-1))%5 == 0){
					terrain[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
				}
				//à droite d'un centre de plus
				if (((ix-1)-2*iy)%5==0){
					terrain[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
				}				
			}
		}
	}
	//Cas extrême : laisser les 4 coins indéfinis (et uniquement eux)
	terrain[0][0] = {murD:MUR_INDEFINI,murB:MUR_INDEFINI};
	terrain[0][p.largeur-2].murD = MUR_INDEFINI;
	terrain[0][p.largeur-1].murB = MUR_INDEFINI;
	terrain[p.hauteur-1][0].murD = MUR_INDEFINI;	
	terrain[p.hauteur-2][0].murB = MUR_INDEFINI;
	terrain[p.hauteur-1][p.largeur-2].murD = MUR_INDEFINI;
	terrain[p.hauteur-2][p.largeur-1].murB = MUR_INDEFINI;
	return terrain;
}

/*
{hauteur,largeur,offset{h,d,g,b},isHorizontal,opacite}

*/
/*function genererTerrainPluie(p){
	var ix,iy;
	var terrain = [];
	controlerOpaciteClassique(p);
	
	for(iy=0;iy<p.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<p.largeur;ix++){
			terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
			if(
			(iy >= p.offset.h+(p.isHorizontal ? 0 : 0)) && iy < p.hauteur-p.offset.b - (p.isHorizontal ? 1 : 0) && 
			  (ix >= p.offset.g+(p.isHorizontal ? 0 : 0)) && ix < p.largeur-p.offset.d - (p.isHorizontal ? 0 : 1) &&   
				(aleatoire(1,10000) <= 10000*p.opacite) 
				){
					console.log(10000*p.opacite+" "+iy+" "+ix);
					if(p.isHorizontal){
						terrain[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_FERME};
					}
					else{
						terrain[iy][ix] = {murD:MUR_FERME,murB:MUR_INDEFINI};
					}
				}
		}
	}
	
	//Si par malheur on a tous nos murs d'une même ligne/colonne fermés (ou même trop d'entre eux, disons qu'on en essaie autant que la moitié), on en ouvre un au hasard
		var nbEssais, alea;
		if (p.isHorizontal){
			if (p.offset.g == 0 && p.offset.d == 0){
				for(iy = p.offset.h; iy<= p.hauteur-p.offset.b-2;iy++){
					nbEssais = 1;
					alea = aleatoire(0,p.largeur-1);
					while(nbEssais <= p.largeur/2 && terrain[iy][alea].murB == MUR_FERME){
						alea = aleatoire(0,p.largeur-1);
						nbEssais++;
					}
					if (nbEssais > p.largeur/2){
						terrain[iy][alea].murB == MUR_OUVERT;
					}
				}
			}
		}
		else{
			if (p.offset.h == 0 && p.offset.b == 0){
				for(ix = p.offset.g; ix<= p.largeur-p.offset.d-2;ix++){
					nbEssais = 1;
					alea = aleatoire(0,p.hauteur-1);
					while(nbEssais <= p.hauteur/2 && terrain[alea][ix].murD == MUR_FERME){
						alea = aleatoire(0,p.hauteur-1);
						nbEssais++;
					}
					if (nbEssais > p.hauteur/2){
						terrain[alea][ix].murD == MUR_OUVERT;
					}
				}
			}			
		}
	return terrain;
}*/

/*
{hauteur,largeur,offset{h,d,g,b},isHorizontal}
*/
function genererTerrainPointillesIllusionRectangulaire(p){
	var ix,iy;
	var terrain = [];
	var dansLeCentre;
	for(iy=0;iy<p.hauteur;iy++){
		terrain.push([]);
		for(ix=0;ix<p.largeur;ix++){
			terrain[iy].push({murD:MUR_INDEFINI,murB:MUR_INDEFINI});
			dansLeCentre = (iy >= p.offset.h && iy < p.hauteur-p.offset.b - (p.isHorizontal ? 0 : 1) && 
							ix >= p.offset.g && ix < p.largeur-p.offset.d - (p.isHorizontal ? 1 : 0));
			   
			if ((ix%2) == (iy%2)){
				if(p.isHorizontal == dansLeCentre){
					terrain[iy][ix] = {murD:MUR_OUVERT,murB:MUR_INDEFINI};
				}
				else{
					terrain[iy][ix] = {murD:MUR_INDEFINI,murB:MUR_OUVERT};
				}
			}
		}
	}
	return terrain;
}



/*
Contrôle l'opacité de manière classique, l'empêchant de dépasser un maximum
*/
function controlerOpaciteClassique(p){
	var taille = p.hauteur*p.largeur;
	if (p.opacite < 0){
		p.opacite = 0;		
	}
	if (taille < 100){
		p.opacite = 0.5;
		return;
	}
	p.opacite = Math.min(p.opacite,1-50/taille);
	//taille :
	//100 ou - : 0.5
	//200 : .75
	//300 : .833
	//400 : .875
	//1000 : .95
	//1600 : 31/32
	//3200 : 63/64
}

//Autres fonctions :
//Pluie (horitontal/vertical)
//Spirales (sens horaire/anti horaire) (spires hg/hd/bd/bg) (standard/murailles/pointillés)
//Cercles  (offset interne/externe) (standard/murailles/pointillés)