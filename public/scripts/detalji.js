document.addEventListener("DOMContentLoaded",()=>{
    const link=document.getElementById("lokacija");
    const rez=document.getElementById("rezultat");

    const upitiDiv=document.getElementById("upiti");
    const dugmeDalje=document.querySelector(".btn-sljedeci");
    const dugmeVrati=document.querySelector(".btn-preth");

    const wls=window.location.search;
    const nekretninaId=wls.split("=")[1];

    let sviUpiti=[];
    let pozicija=0;
    let str=1;
    let istina=false;

    if(!nekretninaId)
    {
        alert("Nije naveden ID nekretnine.");
        return;
    }

    PoziviAjax.getNekretnina(nekretninaId,(err,data)=>{
        if(err)
        {
            console.error("Greska pri ucitavanju nekretnine:", err);
            document.body.innerHTML='Nekretnina nije pronadjena.';
        }
        else
        {
            const nekr=JSON.parse(data);
            document.getElementById("naziv").textContent=nekr.naziv;
            document.getElementById("kvadratura").textContent=nekr.kvadratura;
            document.getElementById("cijena").textContent=nekr.cijena;
            document.getElementById("tip-grijanja").textContent=nekr.tip_grijanja;
            document.getElementById("lokacija").textContent=nekr.lokacija;
            document.getElementById("godina-izgradnje").textContent=nekr.godina_izgradnje;
            document.getElementById("datum-objave").textContent=nekr.datum_objave;
            document.getElementById("opis-nekretnine").textContent=nekr.opis;
            document.getElementById("slika").src=`../Resources/${nekr.id}.jpg`;

            if(nekr.upiti && nekr.upiti.length>0)
            {
                for (let i=0;i<nekr.upiti.length;i++)
                {
                    const upit=nekr.upiti[i];
                    const upitDiv=document.createElement("div");
                    upitDiv.classList.add("upit");
                    upitDiv.innerHTML=`<p><strong>Korisnik ${upit.korisnik_id}:</strong></p>
                    <p>${upit.tekst_upita}</p>`;
                    sviUpiti.push(upitDiv);
                }
                if(sviUpiti.length>0)
                {
                    upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
                }
                else
                {
                    upitiDiv.innerHTML='<p>Trenutno nema dostupnih upita.</p>';
                }
            }
            else
            {
                upitiDiv.innerHTML='<p>Trenutno nema upita za ovu nekretninu.</p>';
            }
        }
    });

    dugmeDalje.addEventListener("click",()=>{
        pozicija++;
        if(pozicija>=sviUpiti.length)
        {
            if(!istina)
            {
                PoziviAjax.getNextUpiti(nekretninaId,str,(err,data)=>{
                    if (!err && data)
                    {
                        const noviUpiti=JSON.parse(data);
                        if (noviUpiti.length>0)
                        {
                            str++;
                            noviUpiti.forEach((upit)=>{
                                const upitDiv=document.createElement("div");
                                upitDiv.classList.add("upit");
                                upitDiv.innerHTML=`<p><strong>Korisnik ${upit.korisnik_id}:</strong></p>
                                <p>${upit.tekst_upita}</p>`;
                                sviUpiti.push(upitDiv);
                            });
                            pozicija=sviUpiti.length-noviUpiti.length;
                            upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
                        }
                        else
                        {
                            istina=true;
                            pozicija=0;
                            upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
                        }
                    }
                    else
                    {
                        istina=true;
                        pozicija=0;
                        upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
                    }
                });
            }
            else
            {
                pozicija=0;
                upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
            }
        }
        else
        {
            upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
        }
    });

    dugmeVrati.addEventListener("click",()=>{
        pozicija--;
        if(pozicija<0)
        {
            pozicija=sviUpiti.length-1;
        }
        upitiDiv.innerHTML=sviUpiti[pozicija].outerHTML;
    });

    link.addEventListener("click", (event)=>{
        event.preventDefault();
        const lokacija=link.textContent.trim();

        if (rez.style.display!=="none")
        {
            rez.style.display="none"; 
            return; 
        }
        PoziviAjax.getTop5Nekretnina(lokacija,(err,data)=>{
            if(err)
            {
                rez.innerHTML=`<p>Greska: ${err.statusText}</p>`;
            }
            else
            {
                const nekr=JSON.parse(data).filter(n=>n.id!=nekretninaId);
                let htmlContent='';
                if(nekr.length>0)
                {
                    htmlContent+=`<h2>Top 5 nekretnina za lokaciju: ${lokacija}</h2>`;
                    for(let i=0;i<nekr.length;i++)
                    {
                        const nekretnina=nekr[i];
                        htmlContent+=`
                            <div class="nekretnina">
                            <h3>${nekretnina.naziv}</h3>
                            <p><strong>Tip nekretnine:</strong> ${nekretnina.tip_nekretnine}</p>
                            <p><strong>Kvadratura:</strong> ${nekretnina.kvadratura} m2</p>
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
                rez.style.display="block";
            }
        });
    });
});
