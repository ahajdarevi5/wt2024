document.addEventListener("DOMContentLoaded",function (){
    const odabirKriterija=document.getElementById("kvadraturaKriterij");
    const tipNekretnineContainer=document.getElementById("kvadraturaTipNekrCont");
    const kvadraturaContainer=document.getElementById("kvadraturaContainer");
    const cijenaContainer=document.getElementById("cijenaCont");
    const ostaliKriterijiContainer=document.getElementById("ostaliKriterijiContainer");

    const outlierOdabirKriterija=document.getElementById("outlierKriterij");
    const oTipNekretnineContainer=document.getElementById("outlierTipNekrCont");
    const outlierKvadraturaContainer=document.getElementById("outlierKvadraturaCont");
    const outlierCijenaContainer=document.getElementById("outlierCijenaCont");
    const outlierOstaliKriterijiContainer=document.getElementById("outlierOstaliKritCont");

    odabirKriterija.value="tip_nekretnine";
    tipNekretnineContainer.style.display="block";
    kvadraturaContainer.style.display="none";
    cijenaContainer.style.display="none";
    ostaliKriterijiContainer.style.display="none";

    odabirKriterija.addEventListener("change",function (){
        const odabranaVrijednost=odabirKriterija.value;

        tipNekretnineContainer.style.display="none";
        kvadraturaContainer.style.display="none";
        cijenaContainer.style.display="none";
        ostaliKriterijiContainer.style.display="none";

        if (odabranaVrijednost==="tip_nekretnine")
        {
            tipNekretnineContainer.style.display="block";
        } 
        else if (odabranaVrijednost==="kvadratura") 
        {
            kvadraturaContainer.style.display="block";
        } 
        else if (odabranaVrijednost==="cijena") 
        {
            cijenaContainer.style.display="block";
        } 
        else 
        {
            ostaliKriterijiContainer.style.display="block";
        }
    });

    outlierOdabirKriterija.value="tip_nekretnine";
    oTipNekretnineContainer.style.display="block";
    outlierKvadraturaContainer.style.display="none";
    outlierCijenaContainer.style.display="none";
    outlierOstaliKriterijiContainer.style.display="none";

    outlierOdabirKriterija.addEventListener("change",function(){
        const odabranaVrijednost=outlierOdabirKriterija.value;

        oTipNekretnineContainer.style.display="none";
        outlierKvadraturaContainer.style.display="none";
        outlierCijenaContainer.style.display="none";
        outlierOstaliKriterijiContainer.style.display="none";

        if (odabranaVrijednost==="tip_nekretnine") 
        {
            oTipNekretnineContainer.style.display="block";
        } 
        else if (odabranaVrijednost==="kvadratura")
        {
            outlierKvadraturaContainer.style.display="block";
        } 
        else if (odabranaVrijednost==="cijena") 
        {
            outlierCijenaContainer.style.display="block";
        } 
        else 
        {
            outlierOstaliKriterijiContainer.style.display="block";
        }
    });
});