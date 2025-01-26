const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback({ status: xhr.status, statusText: xhr.statusText }, null);
                }
            }
        };
        xhr.send(data ? JSON.stringify(data) : null);
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback("error", null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/korisnik/", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback)
    {
        if(!req.session || !req.session.user)
        {
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }
        const korisnikId=req.session.user.id;
        const { ime, prezime, username, password } = noviPodaci;
        Korisnik.findByPk(korisnikId)
            .then(korisnik=>{
                if(!korisnik)
                {
                    return fnCallback({status:404,statusText:'Korisnik nije pronadjen.'},null);
                }
                if (ime) korisnik.ime = ime;
                if (prezime) korisnik.prezime = prezime;
                if (username) korisnik.username = username;
                if (password) korisnik.password = password; 

                return korisnik.save();
            })
            .then(azKorisnik => {
                fnCallback(null,{poruka:'Podaci su azurirani',korisnik:azKorisnik});
            })
            .catch(err => {
                console.error('Greska kod azuriranja korisnika:', err);
                fnCallback({status:500,statusText: 'Interna greska servera'},null);
            });
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        const requestBody = {
            nekretnina_id,
            tekst_upita: tekst_upita,
        };
        ajaxRequest("POST", "/upit", requestBody,(err, response)=>{
            if (err)
            {
                fnCallback(err, null);
            } 
            else
            {
                fnCallback(null, JSON.parse(response));
            }
        });
    }

    function impl_getNekretnine(fnCallback) {
        // Koristimo AJAX poziv da bismo dohvatili podatke s servera
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/login", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "username": username,
            "password": password
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/logout", true)
        ajax.send()
    }
    function getTop5Nekretnina(lokacija,fnCallback)
    {
        ajaxRequest('GET',`/nekretnine/top5?lokacija=${encodeURIComponent(lokacija)}`,null,fnCallback);
    }
    function getMojiUpiti(fnCallback) 
    {
        ajaxRequest('GET','/upiti/moji',null,fnCallback);
    }
    function getNekretnina(nekretnina_id,fnCallback) 
    {
        ajaxRequest('GET',`/nekretnina/${nekretnina_id}`,null,fnCallback);
    }
    function getNextUpiti(nekretnina_id,page,fnCallback)
    {
        ajaxRequest('GET',`/next/upiti/nekretnina/${nekretnina_id}?page=${page}`,null,fnCallback);
    }
    function getPonude(nekretninaId, fnCallback)
    {
        ajaxRequest('GET',`/nekretnina/${nekretninaId}/interesovanja`,null,fnCallback);
    }
    function postZahtjev(nekretninaId, data, fnCallback)
    {
        ajaxRequest("POST",`/nekretnina/${nekretninaId}/zahtjev`,data,fnCallback);
    }
    
    function postPonuda(nekretninaId, data, fnCallback)
    {
        ajaxRequest("POST",`/nekretnina/${nekretninaId}/ponuda`,data,fnCallback);
    }

    function getVezanePonude(nekretninaId, fnCallback) 
    {
        ajaxRequest("GET",`/nekretnina/${nekretninaId}/vezane-ponude`,null,fnCallback);
    }
    function putZahtjev(nekretninaId,zahtjevId,data,fnCallback)
    {
        const url = `/nekretnina/${nekretninaId}/zahtjev/${zahtjevId}`;
        ajaxRequest("PUT",url,data,fnCallback);
    }
       
      
      
    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina,
        getMojiUpiti,
        getNekretnina,
        getNextUpiti,
        getPonude,
        postZahtjev,
        postPonuda,
        getVezanePonude,
        putZahtjev
    };
})();