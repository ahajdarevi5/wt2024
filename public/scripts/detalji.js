document.addEventListener("DOMContentLoaded",()=>{
    const link=document.getElementById("lokacija-link");
    const rez=document.getElementById("rezultat");
  
    link.addEventListener("click",(event)=>{
        event.preventDefault(); 
        const lokacija=link.textContent.trim(); 

      PoziviAjax.getTop5Nekretnina(lokacija,(err,data)=>{
        if(err) 
        {
            rez.innerHTML=`<p>Greska: ${err.statusText}</p>`;
        } 
        else 
        {
            const nekr=JSON.parse(data);
            let htmlContent='';
  
            if(nekr.length) 
            {
                htmlContent+=`<h2>Top 5 nekretnina za lokaciju: ${lokacija}</h2>`;
                for(let i=0;i<nekr.length;i++) 
                {
                    const nekretnina=nekr[i];
                    htmlContent+=`
                        <div class="nekretnina">
                        <h3>${nekretnina.naziv}</h3>
                        <p><strong>Tip nekretnine:</strong> ${nekretnina.tip_nekretnine}</p>
                        <p><strong>Kvadratura:</strong> ${nekretnina.kvadratura} m²</p>
                        <p><strong>Cijena:</strong> ${nekretnina.cijena} KM</p>
                        <p><strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja}</p>
                        <p><strong>Lokacija:</strong> ${nekretnina.lokacija}</p>
                        <p><strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje}</p>
                        <p><strong>Datum objave:</strong> ${nekretnina.datum_objave}</p>
                        <p><strong>Opis:</strong> ${nekretnina.opis}</p>
                        </div>
                    `;
                }
            } 
          else 
          {
            htmlContent=`<p>Trenutno nemamo nekretnina za ovu lokaciju.</p>`;
          }
          rez.innerHTML=htmlContent;
        }
      });
    });
  });
  