function postaviCarousel(glavniElement,sviElementi,indeks=0) {
    if (indeks<0 || indeks>=sviElementi.length || !glavniElement || !sviElementi || sviElementi.length===0) {
        return null;
    }
    function fnLijevo() 
    {
        indeks--; 
        if(indeks<0) {
            indeks=sviElementi.length-1;
        }
        glavniElement.innerHTML=sviElementi[indeks].outerHTML;
    }
    function fnDesno()
    {
        indeks++;
        if(indeks>=sviElementi.length){
            indeks=0;
        }
        glavniElement.innerHTML=sviElementi[indeks].outerHTML;
    }

    return {fnLijevo,fnDesno};
}
document.addEventListener("DOMContentLoaded",() => {
    let carousel=null;
    const dugmeLijevo=document.querySelector('.btn-preth');
    const dugmeDesno=document.querySelector('.btn-sljedeci');
    const glavniElement=document.querySelector('#upiti');
    const sviElementi=Array.from(document.querySelectorAll('.upit'));
    function CarouselFunc() {
        if (window.innerWidth<=600) 
            {
                if (!carousel) 
                    { 
                        carousel=postaviCarousel(glavniElement,sviElementi);
                        if (carousel) 
                        {
                            dugmeLijevo.addEventListener("click",carousel.fnLijevo);
                            dugmeDesno.addEventListener("click",carousel.fnDesno);
                        } 
                        else 
                        {
                            console.error("Greska!");
                        }
            }
        } 
        else 
        {
            if (carousel) 
            {
                dugmeLijevo.removeEventListener("click",carousel.fnLijevo);
                dugmeDesno.removeEventListener("click",carousel.fnDesno);
                carousel=null;
            }
            glavniElement.innerHTML=sviElementi.map(el=>el.outerHTML).join(""); 
        }
    }
    CarouselFunc();
    window.addEventListener("resize", CarouselFunc);
});