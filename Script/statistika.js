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
        document.getElementById('prosjecnaKvadraturaRezultat').innerHTML=`Prosječna kvadratura iznosi ${prosjecnaKvadratura} m^2.`;
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
            document.getElementById('outlierRezultat').innerHTML=`<strong>ID:</strong> ${outlierNekretnina.id} <br>
            <strong>Tip nekretnine:</strong> ${outlierNekretnina.tip_nekretnine} <br>
            <strong>Naziv:</strong> ${outlierNekretnina.naziv} <br>
            <strong>Kvadratura:</strong> ${outlierNekretnina.kvadratura} m^2 <br>
            <strong>Cijena:</strong> ${outlierNekretnina.cijena} KM <br>
            <strong>Tip grijanja:</strong> ${outlierNekretnina.tip_grijanja} <br>
            <strong>Lokacija:</strong> ${outlierNekretnina.lokacija} <br>
            <strong>Godina izgradnje:</strong> ${outlierNekretnina.godina_izgradnje} <br>
            <strong>Datum objave:</strong> ${outlierNekretnina.datum_objave} <br>
            <strong>Opis:</strong> ${outlierNekretnina.opis} <br>
            `;
        } 
        else 
        {
            document.getElementById('outlierRezultat').innerHTML='Nema rezultata za unesene kriterije.';
        }
    });
    document.getElementById('generisiMojeNekretnine').addEventListener('click',()=>{
        document.getElementById('mojeNekretnineRezultat').innerHTML=``;
        let korisnickoIme=document.getElementById('korisnicko-ime').value;
        let mojeNekretnine=statistikaNekretnina.mojeNekretnine(korisnickoIme);
        if(mojeNekretnine.length > 0) 
        {
            document.getElementById('mojeNekretnineRezultat').innerHTML = `
            <strong>ID:</strong> ${mojeNekretnine.id} <br>
            <strong>Tip nekretnine:</strong> ${mojeNekretnine.tip_nekretnine} <br>
            <strong>Naziv:</strong> ${mojeNekretnine.naziv} <br>
            <strong>Kvadratura:</strong> ${mojeNekretnine.kvadratura} m^2 <br>
            <strong>Cijena:</strong> ${mojeNekretnine.cijena} KM <br>
            <strong>Tip grijanja:</strong> ${mojeNekretnine.tip_grijanja} <br>
            <strong>Lokacija:</strong> ${mojeNekretnine.lokacija} <br>
            <strong>Godina izgradnje:</strong> ${mojeNekretnine.godina_izgradnje} <br>
            <strong>Datum objave:</strong> ${mojeNekretnine.datum_objave} <br>
            <strong>Opis:</strong> ${mojeNekretnine.opis} <br>
            `;
        }
        else 
        {
            document.getElementById('mojeNekretnineRezultat').innerHTML='Nema nekretnina za unesenog korisnika.';
        }
    });

});
