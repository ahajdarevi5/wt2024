function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const gridlista=divReferenca.querySelector('.grid-lista-nekretnina');
    gridlista.innerHTML='';
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    if (filtriraneNekretnine.length === 0){
        divReferenca.innerHTML = '<p>Trenutno nema dostupnih nekretnina ovoga tipa.</p>';
    } else {
        filtriraneNekretnine.forEach(nekretnina => {
            const nekretninaElement = document.createElement('div');
            if(tip_nekretnine==="Stan"){
                nekretninaElement.classList.add('nekretnina');
            }
            else if(tip_nekretnine==="Kuća"){
                nekretninaElement.classList.add('nekretnina','kuca');
            }
            else{
                nekretninaElement.classList.add('nekretnina','pp');
            }
            
            const slikaElement = document.createElement('img');
            slikaElement.classList.add('slika-nekretnine');
            slikaElement.src = `../Resources/${nekretnina.id}.jpg`;
            slikaElement.alt = nekretnina.naziv;
            nekretninaElement.appendChild(slikaElement);

            const detaljiElement = document.createElement('div');
            detaljiElement.classList.add('detalji-nekretnine');
            detaljiElement.innerHTML = `
                <h3>${nekretnina.naziv}</h3>
                <p>Kvadratura: ${nekretnina.kvadratura} m^2</p>
            `;
            nekretninaElement.appendChild(detaljiElement);

            const cijenaElement = document.createElement('div');
            cijenaElement.classList.add('cijena-nekretnine');
            cijenaElement.innerHTML = `<p>Cijena: ${nekretnina.cijena} BAM</p>`;
            nekretninaElement.appendChild(cijenaElement);

            const detaljiDugme = document.createElement('a');
            detaljiDugme.href = '../HTML/detalji.html'; // hardkodiran html
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';
            nekretninaElement.appendChild(detaljiDugme);


            // Dodavanje kreiranog elementa u divReferenci
            divReferenca.appendChild(nekretninaElement);
        });
    }
}


const listaNekretnina = []

const listaKorisnika = []

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

// Instanciranje modula
let nekretnine = SpisakNekretnina();

// Pozivamo funkciju za dohvat nekretnina sa servera
PoziviAjax.getNekretnine((error, listaNekretnina) => {
    if (error) {
        console.error("Greška prilikom dohvatanja nekretnina sa servera:", error);
    } else {
        // Inicijalizacija modula sa dobavljenim podacima
        nekretnine.init(listaNekretnina, listaKorisnika);

        // Pozivamo funkciju za prikaz nekretnina
        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuća");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    }
});
