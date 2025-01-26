function postaviCarousel(glavniElement,sviElementi,indeks=0) {
  if (indeks<0 || indeks>=sviElementi.length || !glavniElement || !sviElementi || sviElementi.length===0) {
    return null;
  }
  glavniElement.innerHTML='';
  glavniElement.appendChild(sviElementi[indeks]);
  function fnLijevo()
  {
    indeks--;
    if(indeks<0) {
      indeks=sviElementi.length-1;
    }
    glavniElement.innerHTML='';
    glavniElement.appendChild(sviElementi[indeks]);
  }
  function fnDesno()
  {
    indeks++;
    if(indeks>=sviElementi.length){
      indeks=0;
    }
    glavniElement.innerHTML='';
    glavniElement.appendChild(sviElementi[indeks]);
  }

  return {fnLijevo,fnDesno};
}
