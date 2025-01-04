let StatistikaNekretnina=function () {
    let spisakNekretnina=SpisakNekretnina();
    
    let init = function (listaNekretnina,listaKorisnika) {
        spisakNekretnina.init(listaNekretnina,listaKorisnika);
    };
    //IZBRISI
    const getListaNekretnina = function () {
        return listaNekretnina;
    };
    let prosjecnaKvadratura=function (kriterij) {
        const filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length===0) 
        {
            return 'Nema nekretnina koje zadovoljavaju zadati kriterij.';
        }
        let ukupno=0;
        for (let i=0;i<filtriraneNekretnine.length; i++) 
        {
            ukupno+=filtriraneNekretnine[i].kvadratura;
        }
        return ukupno/filtriraneNekretnine.length;
    };
    

    let outlier=function(kriterij,nazivSvojstva) {
        const filtriraneNekretnine=spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length===0) 
        {
            return null;
        }
        let suma=0;
        for(let i = 0;i<filtriraneNekretnine.length;i++) 
        {
            suma+=filtriraneNekretnine[i][nazivSvojstva];
        }
        const prosjecnaVr=suma/filtriraneNekretnine.length;
        let outlierNekretnina=filtriraneNekretnine[0];
        let maxOdstupanje=Math.abs(filtriraneNekretnine[0][nazivSvojstva]-prosjecnaVr);
        for (let i=1;i<filtriraneNekretnine.length;i++)
        {
            const nekretnina=filtriraneNekretnine[i];
            const odstupanje=Math.abs(nekretnina[nazivSvojstva]-prosjecnaVr);
            if (odstupanje>maxOdstupanje) 
            {
                maxOdstupanje=odstupanje;
                outlierNekretnina=nekretnina;
            }
        }
        return outlierNekretnina;
    };
    
    let mojeNekretnine = function(user) {
        const nekretnine=listaNekretnina.filter(nekretnina =>
            nekretnina.upiti.some(upit => upit.korisnik_id === user.id)
        );
        nekretnine.sort((a,b)=>{
            const prviUpiti=a.upiti.filter(upit => upit.korisnik_id === user.id).length;
            const drugiUpiti=b.upiti.filter(upit => upit.korisnik_id === user.id).length;
            return drugiUpiti-prviUpiti;
        });
        return nekretnine;
    };
    
    
    let histogramCijena = function (periodi,rasponiCijena) {
        const rez=[];
        for(let i=0;i<periodi.length;i++)
        {
            const period=periodi[i];
            const nekretnineLista=listaNekretnina.filter(nekretnina => {
                const godinaObjave=parseInt(nekretnina.datum_objave.split(".")[2]);
                return godinaObjave>=period.od && godinaObjave <= period.do;
            });
            for(let j=0;j<rasponiCijena.length;j++)
            {
                const raspon=rasponiCijena[j];
                const filtriraneNekretnine=nekretnineLista.filter(nekretnina =>
                    nekretnina.cijena>=raspon.od && nekretnina.cijena<=raspon.do
                );
                const brojNekretnina=filtriraneNekretnine.length;
                rez.push({
                    i,
                    j,
                    brojNekretnina,
                    nekretnine: filtriraneNekretnine
                });
            }
        }
        return rez;
    };
    
    return {
        init: init,
        getListaNekretnina: getListaNekretnina,
        prosjecnaKvadratura: prosjecnaKvadratura,
        outlier: outlier,
        mojeNekretnine: mojeNekretnine,
        histogramCijena: histogramCijena,
       
    };
};
