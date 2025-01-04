const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 32000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2009.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2003.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

let statistikaNekretnina=StatistikaNekretnina();
statistikaNekretnina.init(listaNekretnina,listaKorisnika);

document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('generisiProsjecnaKvadratura').addEventListener('click',()=>{
        document.getElementById('prosjecnaKvadraturaRezultat').innerHTML=``;
         //moramo kreirati objekat zbog filtriraneNekretnine da proslijedis
        let kriterij={};
        let tipNekretnine=document.getElementById('tip_nekretnine_input').value;
        let minKvad=parseInt(document.getElementById('min_kvadratura').value);
        let maxKvad=parseInt(document.getElementById('max_kvadratura').value);
        let minCijena=parseInt(document.getElementById('min_cijena').value);
        let maxCijena=parseInt(document.getElementById('max_cijena').value);

        kriterij.tip_nekretnine=tipNekretnine;
        kriterij.min_kvadratura=minKvad;
        kriterij.max_kvadratura=maxKvad;
        kriterij.min_cijena=minCijena;
        kriterij.max_cijena=maxCijena;
        let prosjecnaKvadratura=statistikaNekretnina.prosjecnaKvadratura(kriterij);
        if(typeof prosjecnaKvadratura==='string') 
        {
            document.getElementById('prosjecnaKvadraturaRezultat').innerHTML=prosjecnaKvadratura;
        } 
        else 
        {
            document.getElementById('prosjecnaKvadraturaRezultat').innerHTML=`Prosječna kvadratura iznosi ${prosjecnaKvadratura} m2.`;
        }
    });
    document.getElementById('generisiOutlier').addEventListener('click',()=>{
        document.getElementById('outlierRezultat').innerHTML = ``;
        let kriterij={}; 
        let tipNekretnine=document.getElementById('tip_nekretnine_input').value;
        let minKvad=parseInt(document.getElementById('min_kvadratura').value);
        let maxKvad=parseInt(document.getElementById('max_kvadratura').value);
        let minCijena=parseInt(document.getElementById('min_cijena').value);
        let maxCijena=parseInt(document.getElementById('max_cijena').value);
    
        kriterij.tip_nekretnine=tipNekretnine;
        kriterij.min_kvadratura=minKvad;
        kriterij.max_kvadratura=maxKvad;
        kriterij.min_cijena=minCijena;
        kriterij.max_cijena=maxCijena;

        let nazivSvojstva=document.getElementById('naziv-svojstva').value;
        let outlierNekretnina=statistikaNekretnina.outlier(kriterij, nazivSvojstva);
        if (outlierNekretnina) 
        {
            let upitiOutlier='';
            if(outlierNekretnina.upiti.length>0)
            {
                upitiOutlier='<strong>Upiti:</strong><ul>';
                outlierNekretnina.upiti.forEach(upit=>{
                    let korisnik=listaKorisnika.find(k => k.id === upit.korisnik_id);
                    let korisnikInfo='Nulti korisnik';
                    if (korisnik && korisnik.ime && korisnik.prezime) 
                    {
                        korisnikInfo=korisnik.ime+' '+korisnik.prezime;
                    }
                    upitiOutlier+= `
                        <li>
                            <strong>Korisnik:</strong> ` + korisnikInfo + ` <br>
                            <strong>Tekst upita:</strong> ` + upit.tekst_upita + `
                        </li>`;
                });
                upitiOutlier+='</ul>';
            }
            else 
            {
                upitiOutlier='<strong>Upiti:</strong> Ne postoje upiti za ovu nekretninu.';
            }
            document.getElementById('outlierRezultat').innerHTML=`
                <span style="font-size: 19px; font-weight: bold;">${outlierNekretnina.naziv}</span> <br> <br>
            <strong>ID:</strong> ${outlierNekretnina.id} <br>
            <strong>Tip nekretnine:</strong> ${outlierNekretnina.tip_nekretnine} <br>
            <strong>Kvadratura:</strong> ${outlierNekretnina.kvadratura} m^2 <br>
            <strong>Cijena:</strong> ${outlierNekretnina.cijena} KM <br>
            <strong>Tip grijanja:</strong> ${outlierNekretnina.tip_grijanja} <br>
            <strong>Lokacija:</strong> ${outlierNekretnina.lokacija} <br>
            <strong>Godina izgradnje:</strong> ${outlierNekretnina.godina_izgradnje} <br>
            <strong>Datum objave:</strong> ${outlierNekretnina.datum_objave} <br>
            <strong>Opis:</strong> ${outlierNekretnina.opis} <br>
            ${upitiOutlier}
        `;
        }
        else 
        {
            document.getElementById('outlierRezultat').innerHTML = 'Nema rezultata za unesene kriterije.';
        }
    });

    const korisnikDropdown=document.getElementById("korisnik-dropdown");
    korisnikDropdown.innerHTML=listaKorisnika.map(korisnik=> 
        `<option value="${korisnik.id}">${korisnik.ime} ${korisnik.prezime}</option>`
    ).join('');

    document.getElementById("generisiMojeNekretnine").addEventListener("click", () => {
        document.getElementById("mojeNekretnineRezultat").innerHTML=``;
        const korisnikDropdown=document.getElementById("korisnik-dropdown");
        const korisnikID=parseInt(korisnikDropdown.value);
        const korisnik=listaKorisnika.find(k => k.id === korisnikID);
        const mojeNekretnine=statistikaNekretnina.mojeNekretnine(korisnik);
    
        if (mojeNekretnine.length>0) 
        {
            let rez="";
            mojeNekretnine.forEach(nekretnina => {
                let upitiMojeNekr="";
                if(nekretnina.upiti.length>0) 
                {
                    upitiMojeNekr="<strong>Upiti:</strong><ul>";
                    nekretnina.upiti.forEach(upit =>{
                        const korisnikUpita=listaKorisnika.find(k => k.id === upit.korisnik_id);
                        let korisnikInfo="Nulti korisnik";
                        if(korisnikUpita && korisnikUpita.ime && korisnikUpita.prezime)
                        {
                            korisnikInfo=korisnikUpita.ime+" "+korisnikUpita.prezime;
                        }
                        upitiMojeNekr+=`
                            <li>
                                <strong>Korisnik:</strong> ${korisnikInfo} <br>
                                <strong>Tekst upita:</strong> ${upit.tekst_upita}
                            </li>`;
                    });
                    upitiMojeNekr+="</ul>";
                } 
                else 
                {
                    upitiMojeNekr="<strong>Upiti:</strong> Ne postoje upiti za ovu nekretninu.";
                }
    
                rez+= `
                    <span style="font-size: 19px; font-weight: bold;">${nekretnina.naziv}</span> <br><br>
                    <strong>ID:</strong> ${nekretnina.id} <br>
                    <strong>Tip nekretnine:</strong> ${nekretnina.tip_nekretnine} <br>
                    <strong>Kvadratura:</strong> ${nekretnina.kvadratura} m^2 <br>
                    <strong>Cijena:</strong> ${nekretnina.cijena} KM <br>
                    <strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja} <br>
                    <strong>Lokacija:</strong> ${nekretnina.lokacija} <br>
                    <strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje} <br>
                    <strong>Datum objave:</strong> ${nekretnina.datum_objave} <br>
                    <strong>Opis:</strong> ${nekretnina.opis} <br>
                    ${upitiMojeNekr}
                    <hr>`;
            });
            document.getElementById("mojeNekretnineRezultat").innerHTML=rez;
        } 
        else 
        {
            document.getElementById("mojeNekretnineRezultat").innerHTML="Nema nekretnina za unesenog korisnika.";
        }
    });
    
    
    document.getElementById('dodajPeriod').addEventListener('click',()=>{
        let periodCont=document.getElementById('periodiContainer');
        let i=periodCont.children.length+1;
        let novi=document.createElement('div');
        novi.classList.add('period');
        novi.innerHTML = `
            <label for="periodOd${i}">Period od (godina):</label>
            <input type="number" id="periodOd${i}">
            <label for="periodDo${i}">Period do (godina):</label>
            <input type="number" id="periodDo${i}">
        `;
        periodCont.appendChild(novi);
    });

    document.getElementById('dodajRasponCijena').addEventListener('click',()=>{
        let rasponiCijenaCont=document.getElementById('rasponiCijenaContainer');
        let i=rasponiCijenaCont.children.length + 1;
        let novi=document.createElement('div');
        novi.classList.add('raspon-cijena');
        novi.innerHTML = `
            <label for="rasponOd${i}">Cijena od:</label>
            <input type="number" id="rasponOd${i}">
            <label for="rasponDo${i}">Cijena do:</label>
            <input type="number" id="rasponDo${i}">
        `;
        rasponiCijenaCont.appendChild(novi);
    });

    function resetProsjecnaKvadraturaF() {
        let odabirKriterija=document.getElementById("kvadraturaKriterij");
        let tipNekretnineContainer=document.getElementById("kvadraturaTipNekrCont");
        let kvadraturaContainer=document.getElementById("kvadraturaContainer");
        let cijenaContainer=document.getElementById("cijenaCont");
        let ostaliKriterijiContainer=document.getElementById("ostaliKriterijiContainer");

        odabirKriterija.value="tip_nekretnine";
        tipNekretnineContainer.style.display="block";
        kvadraturaContainer.style.display="none";
        cijenaContainer.style.display="none";
        ostaliKriterijiContainer.style.display="none";
        document.getElementById('prosjecnaKvadraturaRezultat').innerHTML='';
        document.getElementById('tip_nekretnine_input').value='';
        document.getElementById('min_kvadratura').value='';
        document.getElementById('max_kvadratura').value='';
        document.getElementById('min_cijena').value='';
        document.getElementById('max_cijena').value='';
    }
    
    function resetOutlierF() {
        let outlierOdabirKriterija=document.getElementById("outlierKriterij");
        let oTipNekretnineContainer=document.getElementById("outlierTipNekrCont");
        let outlierKvadraturaContainer=document.getElementById("outlierKvadraturaCont");
        let outlierCijenaContainer=document.getElementById("outlierCijenaCont");
        let outlierOstaliKriterijiContainer=document.getElementById("outlierOstaliKritCont");
        outlierOdabirKriterija.value="tip_nekretnine";
        oTipNekretnineContainer.style.display="block";
        outlierKvadraturaContainer.style.display="none";
        outlierCijenaContainer.style.display="none";
        outlierOstaliKriterijiContainer.style.display="none";
        document.getElementById('outlierRezultat').innerHTML='';
        document.getElementById('outlier_tip_nekretnine_input').value='';
        document.getElementById('min_outlier_kvadratura').value='';
        document.getElementById('max_outlier_kvadratura').value='';
        document.getElementById('min_outlier_cijena').value='';
        document.getElementById('max_outlier_cijena').value='';
        document.getElementById('outlier_ostali_kriteriji_input').value='';
    }
    function resetMojeNekrentineF(){
        document.getElementById("mojeNekretnineRezultat").innerHTML='';
        document.getElementById("korisnik-dropdown").value='';
    }
        

    function resetHistogramF() {
        document.getElementById('histogrami').innerHTML='';
        let periodi=document.querySelectorAll('.period input');
        periodi.forEach(unos=>{
            unos.value='';
        });
        let cijene=document.querySelectorAll('.raspon-cijena input');
        cijene.forEach(unos=>{
            unos.value='';
        });

        let periodiCont=document.querySelectorAll('.period');
        periodiCont.forEach((div,i)=>{
            if(i>0) 
            { 
                div.remove();
            }
        });
        let cijeneCont=document.querySelectorAll('.raspon-cijena');
        cijeneCont.forEach((div,i)=>{
            if(i>0)
            {
                div.remove();
            }
        });
    }

    document.getElementById('resetProsjecnaKvadratura').addEventListener('click', resetProsjecnaKvadraturaF);
    document.getElementById('resetOutlier').addEventListener('click', resetOutlierF);
    document.getElementById('resetHistogram').addEventListener('click', resetHistogramF);
    document.getElementById('resetMojeNekretnine').addEventListener('click',resetMojeNekrentineF);

    document.getElementById('generisiHistogram').addEventListener('click',()=>{
        let periodi=[];
        let sviPeriodi=document.querySelectorAll('.period');
        sviPeriodi.forEach((periodEl,i)=>{
            let periodOd=parseInt(document.getElementById(`periodOd${i+1}`).value);
            let periodDo=parseInt(document.getElementById(`periodDo${i+1}`).value);
            if(!isNaN(periodOd) && !isNaN(periodDo)) 
            {
                periodi.push({od: periodOd,
                              do: periodDo});
            }
            
        });
        let cijene=[];
        let sveCijene=document.querySelectorAll('.raspon-cijena');
        sveCijene.forEach((cijenaEl,i)=>{
            let rasponOd=parseInt(document.getElementById(`rasponOd${i+1}`).value);
            let rasponDo=parseInt(document.getElementById(`rasponDo${i+1}`).value);
            if(!isNaN(rasponOd) && !isNaN(rasponDo))
            {
                cijene.push({od: rasponOd,
                             do: rasponDo});
            }
            
        });
    
        let hist=statistikaNekretnina.histogramCijena(periodi,cijene);
        let boje=[
            'plum',
            'peachpuff',
            'lightcoral',  
            'lightgreen',   
            'khaki',        
            'lightskyblue',
        ];
    
        let podacizaHistogram=[];
        for(let i=0;i<periodi.length;i++)
        {
            let period=periodi[i];
            let kolor=boje[i%boje.length];
    
            let data=[];
            for(let j=0;j<hist.length;j++)
            {
                data.push(hist[j].brojNekretnina);
            }
    
            podacizaHistogram.push({
                label:`Period ${period.od} - ${period.do}`,
                data:data,
                backgroundColor:kolor
            });
        }
    
        let histogramCont=document.getElementById('histogrami');
        histogramCont.innerHTML='';
        let grafik=document.createElement('canvas');
        histogramCont.appendChild(grafik);
    
        let nazivi=[];
        for(let i=0;i<cijene.length;i++)
        {   
            let raspon=cijene[i];
            nazivi.push(`Raspon ${i+1}: ${raspon.od} - ${raspon.do} KM`);
        }
        new Chart(grafik,{
            type:'bar',
            data:{
                labels:nazivi,
                datasets:podacizaHistogram
            },
            options:{
                scales:{
                    y:{
                        beginAtZero:true,
                        title: {
                            display: true,
                            text:'Broj nekretnina'
                        }
                    },
                    x:{
                        title: {
                            display: true,
                            text:'Raspon cijena'
                        }
                    }
                }
            }
        });
    });
    
});


/*Moja nekretnina*/