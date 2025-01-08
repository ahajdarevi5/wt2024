document.addEventListener('DOMContentLoaded', () => {
    const cont=document.getElementById('divUpiti');

    PoziviAjax.getMojiUpiti((error, data) => {
        if(error) 
        {
            cont.innerHTML=`<p>Greska!</p>`;
        }
        else
        {
            const upiti=JSON.parse(data);
            if (upiti.length===0)
            {
                cont.innerHTML='<p style="font-style: italic;">Nemate upita.</p>';
            } 
            else
            {
                const naslov=document.createElement('h1');
                naslov.textContent='Vaši upiti';
                naslov.classList.add('vasiUpitiNaslov');
                cont.appendChild(naslov);

                const nekretnineDiv=document.createElement('div');
                nekretnineDiv.style.display='flex';
                nekretnineDiv.style.flexDirection='column';
                nekretnineDiv.style.gap='15px';

                upiti.forEach((upit)=>{
                    const divNekretnina=document.createElement('div');
                    divNekretnina.classList.add('kartica');
                
                    const nekrId=document.createElement('h3');
                    nekrId.textContent=`ID nekretnine: ${upit.id_nekretnine}`;
                    nekrId.classList.add('naslov-nekretnine'); 
                
                    const tekst=document.createElement('p');
                    tekst.textContent=`Vaš upit: ${upit.tekst_upita}`;
                    tekst.classList.add('tekst-upita'); 
                
                    divNekretnina.appendChild(nekrId);
                    divNekretnina.appendChild(tekst);
                    nekretnineDiv.appendChild(divNekretnina);
                });                
                cont.appendChild(nekretnineDiv);
            }
        }
    });
});
