document.addEventListener("DOMContentLoaded", () => {

  const link=document.getElementById("lokacija");
  const rez=document.getElementById("rezultat");

  const wls=window.location.search;
  const nekretninaId=wls.split("=")[1];

  const tipInteresovanja=document.getElementById("tip-interesovanja");
  const poljaUpit=document.getElementById("polja-upit");
  const poljaZahtjev=document.getElementById("polja-zahtjev");
  const poljaPonuda=document.getElementById("polja-ponuda");
  const vezanaPonudaId=document.getElementById("vezana-ponuda-id");
  const dugmeDodaj=document.getElementById("dodaj-interesovanje");


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
    }
  });

  PoziviAjax.getPonude(nekretninaId,(err,data)=>{
    if(err) 
    {
      console.error("Greska kod dohvacanja interesovanja:", err);
      return;
    } 
    else 
    {
      const odg=JSON.parse(data);
      const interesovanja=odg.interesovanja;
      const korisnik=odg.korisnik || null;
      const korisnikId=korisnik ? korisnik.id : null;
      const adm=korisnik ? korisnik.admin : false;
  
      const upitiSekcija=document.getElementById("upiti-sekcija");
      const zahtjeviSekcija=document.getElementById("zahtjevi-sekcija");
      const ponudeSekcija=document.getElementById("ponude-sekcija");
  
      if (interesovanja.upiti)
      {
        interesovanja.upiti.forEach((upit)=>{
          const upitDiv=document.createElement("div");
          upitDiv.classList.add("interesovanje");
  
          if (adm || (korisnikId && korisnikId === upit.korisnik_id))
          {
            upitDiv.innerHTML=`
              <p><strong>Upit ID:</strong> ${upit.id}</p>
              <p><strong>Korisnik ID:</strong> ${upit.korisnik_id}</p>
              <p><strong>Tekst:</strong> ${upit.tekst}</p>
            `;
          } 
          else 
          {
            upitDiv.innerHTML=`<p><strong>Upit ID:</strong> ${upit.id}</p>
                              <p><strong>Tekst:</strong> ${upit.tekst}</p>`;
          }
          upitiSekcija.appendChild(upitDiv);
        });
      }

      if(interesovanja.zahtjevi) 
      {
        interesovanja.zahtjevi.forEach((zahtjev)=>{
          const zahtjevDiv=document.createElement("div");
          zahtjevDiv.classList.add("interesovanje");
      
          zahtjevDiv.innerHTML=adm || (korisnikId && korisnikId === zahtjev.korisnik_id)
            ? `<p><strong>Zahtjev ID:</strong> ${zahtjev.id}</p>
               <p><strong>Korisnik ID:</strong> ${zahtjev.korisnik_id}</p>
               <p><strong>ID nekretnine:</strong> ${zahtjev.nekretnina_id}</p>
               <p><strong>Tekst:</strong> <span id="zahtjev-tekst-${zahtjev.id}">${zahtjev.tekst_upita}</span></p>
               <p><strong>Datum:</strong> ${zahtjev.trazeniDatum}</p>
               <p><strong>Status:</strong> ${zahtjev.status}</p>`
            : `<p><strong>Zahtjev ID:</strong> ${zahtjev.id}</p>
               <p><strong>Tekst:</strong> ${zahtjev.tekst_upita}</p>
               <p><strong>Datum:</strong> ${zahtjev.trazeniDatum}</p>
                <p><strong>Status:</strong> ${zahtjev.status}</p>`;
      
          if(adm)
          {
            zahtjevDiv.innerHTML += `
              <div class="admin-kont">
                <label for="status-zahtjev-${zahtjev.id}" class="admin-l">Status:</label>
                <select id="status-zahtjev-${zahtjev.id}" class="admin-select">
                  <option value="true">Odobri</option>
                  <option value="false">Odbij</option>
                </select>
                
                <label for="addToTekst-${zahtjev.id}" class="admin-l">Tekst odgovora:</label>
                <textarea id="addToTekst-${zahtjev.id}" class="admin-tekst1"></textarea>
                <br>
                <button onclick="azurirajZahtjev(${nekretninaId}, ${zahtjev.id})" class="admin-button">
                  Ažuriraj
                </button>
              </div>`;
          }
          zahtjeviSekcija.appendChild(zahtjevDiv);
        });
      }
      
      if(interesovanja.ponude)
      {
        interesovanja.ponude.forEach((ponuda)=>{
          const ponudaDiv = document.createElement("div");
          ponudaDiv.classList.add("interesovanje");
  
          if(adm || (korisnikId && korisnikId === ponuda.korisnik_id))
          {
            ponudaDiv.innerHTML = `
              <p><strong>Ponuda ID:</strong> ${ponuda.id}</p>
              <p><strong>Tekst:</strong> ${ponuda.tekst_upita}</p>
              <p><strong>Status:</strong> ${ponuda.status}</p>
            `;
          } 
          else
          {
            ponudaDiv.innerHTML=`
              <p><strong>Ponuda ID:</strong> ${ponuda.id}</p>
              <p><strong>Tekst:</strong> ${ponuda.tekst_upita}</p>
              <p><strong>Status:</strong> ${ponuda.status}</p>`;
          }
          ponudeSekcija.appendChild(ponudaDiv);
        });
      }
  
      inicijalizujCarousel("upiti-sekcija", ".btn-preth-upiti", ".btn-sljedeci-upiti");
      inicijalizujCarousel("zahtjevi-sekcija", ".btn-preth-zahtjevi", ".btn-sljedeci-zahtjevi");
      inicijalizujCarousel("ponude-sekcija", ".btn-preth-ponude", ".btn-sljedeci-ponude");
    }
  });
  
  

  link.addEventListener("click", (event) => {
    event.preventDefault();
    const lokacija=link.textContent.trim();

    PoziviAjax.getTop5Nekretnina(lokacija,(err,data)=>{
      if(err)
      {
        rez.innerHTML=`<p>Greska: ${err.statusText}</p>`;
      }
      else
      {
        const nekretnine=JSON.parse(data).filter((n) => n.id!=nekretninaId);
        let htmlContent='';

        if (nekretnine.length>0)
        {
          htmlContent+=`<h2>Top 5 nekretnina za lokaciju: ${lokacija}</h2>`;
          nekretnine.forEach((nekretnina)=>{
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
          });
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
  tipInteresovanja.addEventListener("change", () => {
    const tip = tipInteresovanja.value;
    poljaUpit.style.display = tip === "upit" ? "block" : "none";
    poljaZahtjev.style.display = tip === "zahtjev" ? "block" : "none";
    poljaPonuda.style.display = tip === "ponuda" ? "block" : "none";
    if (tip === "ponuda")
    {
      dajVezanePonude();
    }
  });

  dugmeDodaj.addEventListener("click",(event)=>{
    event.preventDefault();
    const tip = tipInteresovanja.value;

    if(tip==="upit") 
    {
      const tekstUpita=document.getElementById("tekst-upita").value;
      if(!tekstUpita)
      {
        alert("Tekst upita je obavezan.");
        return;
      }
      PoziviAjax.postUpit(nekretninaId,tekstUpita,(err)=>{
        if(err) 
        {
          alert("Greska pri dodavanju upita.");
        }
        else
        {
          alert("Upit je dodan");
          location.reload();
        }
      });
    } 
    else if(tip==="zahtjev")
    {
      const tekstZahtjeva=document.getElementById("tekst-zahtjeva").value;
      const trazeniDatum=document.getElementById("datum-zahtjeva").value;
      if(!tekstZahtjeva || !trazeniDatum) 
      {
        alert("Tekst i datum su obavezni.");
        
        return;
      }
      PoziviAjax.postZahtjev(nekretninaId,{tekst:tekstZahtjeva,trazeniDatum},(err)=>{
        if(err) 
        {
          alert("Greska kod dodavanja zahtjeva");
        } 
        else
        {
          alert("Zahtjev dodan");
          location.reload();
        }
      });
    } 
    else if(tip==="ponuda")
      {
        const statusPonude=document.getElementById("status-ponude").value;
        const odbijenaPonuda=statusPonude==="odbij";
        let data={};
        if(odbijenaPonuda)
        {
          data={
            tekst:null, 
            ponudaCijene:null, 
            idVezanePonude:vezanaPonudaId.value || null,
            odbijenaPonuda:true,
          };
        } 
        else 
        {
          const tekstPonude=document.getElementById('tekst-ponude').value;
          const ponudaCijene=document.getElementById('cijena-ponude').value;
          const idVezanePonude=vezanaPonudaId.value || null;
        
          if (!tekstPonude || !ponudaCijene) 
          {
            alert('Tekst i cijena su obavezni za neodbijene ponude.');
            return;
          }
        
          data={
            tekst:tekstPonude,
            ponudaCijene:ponudaCijene,
            idVezanePonude:idVezanePonude,
            odbijenaPonuda:false,
          };
        }
        PoziviAjax.postPonuda(nekretninaId, data, (err, response) => {
            if(err)
            {
                console.error("Greska kod dodavanja ponude:", err);
                alert("Greska kod dodavanja ponude.");
            } 
            else 
            {
                alert(odbijenaPonuda ? "Ponuda je odbijena" : "Ponuda je dodana");
                location.reload();
            }
        });
      }
  });

  function dajVezanePonude()
  {
    vezanaPonudaId.disabled=true;
    PoziviAjax.getVezanePonude(nekretninaId,(err,data)=>{
      if(err) 
      {
        vezanaPonudaId.innerHTML=`<option value="">Nema vezanih ponuda</option>`;
        return;
      }
      const ponude=JSON.parse(data).vezanePonude || [];
      vezanaPonudaId.innerHTML=ponude.length
        ? ponude.map((ponuda) => `<option value="${ponuda.id}">Ponuda ID ${ponuda.id}</option>`).join("")
        : `<option value="">Nema dostupnih ponuda</option>`;
      vezanaPonudaId.disabled=ponude.length===0;
    });
  }

  function inicijalizujCarousel(sekcijaId, btnPrevSelector, btnNextSelector)
  {
    const glavniElement=document.querySelector(`#${sekcijaId}`);
    const sviElementi=Array.from(glavniElement.querySelectorAll(".interesovanje"));
    if(!glavniElement || sviElementi.length===0)
    {
      return null;
    }

    let carousel=postaviCarousel(glavniElement,sviElementi);
    if (carousel)
    {
      document.querySelector(btnPrevSelector).addEventListener("click", carousel.fnLijevo);
      document.querySelector(btnNextSelector).addEventListener("click", carousel.fnDesno);
    }
  }
  window.azurirajZahtjev=(nekretninaId, zahtjevId)=>{
    const odobren=document.getElementById(`status-zahtjev-${zahtjevId}`).value==="true";
    const addToTekst=document.getElementById(`addToTekst-${zahtjevId}`).value;

    if(!odobren && (!addToTekst || addToTekst.trim()===""))
    {
        alert("Odbijate zahtjev i morate unijeti tekst.");
        return;
    }

    const data={odobren, addToTekst: addToTekst ? addToTekst.trim() : "",};
    PoziviAjax.putZahtjev(nekretninaId,zahtjevId,data,(err, response)=>{
        if (err)
        {
            alert("Greska kod azuriranja zahtjeva.");
        } 
        else
        {
            alert("Zahtjev je uspjesno azuriran!");
            location.reload(); 
        }
    });
};
});