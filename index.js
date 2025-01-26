const listaKorisnika = [
  {
      id: 1,
      ime: "Neko",
      prezime: "Nekic",
      username: "username1",
      password: "$2b$10$OFykzLMWv.wpDk2dXT5C8ObIgy8tlZYbm0ZPN0VTe8I/jXosIX1EG"
  },
  {
      id: 2,
      ime: "Neko2",
      prezime: "Nekic2",
      username: "username2",
      password: "$2b$10$eN2a0Ii0mkjvpSUU.6.S4uASuULIlAspWFc2LkJTmIYPZszB8oyXC"
  },
  {
      id: 3,
      ime: "Novi",
      prezime: "Korisnik",
      username: "noviKorisnik",
      password: "$2b$10$nMwv9btxZJb3WnBIpLgPUeUvYeWKes7mnWlO6f4.5QHeGB5iHIfj2"
  },
  {
      id: 4,
      ime: "Novi",
      prezime: "Korisnik",
      username: "noviKorisnikProba",
      password: "$2b$10$nMwv9btxZJb3WnBIpLgPUeUvYeWKes7mnWlO6f4.5QHeGB5iHIfj2"
  },
  
];

const listaNekretnina = [
  {
      id: 1,
      tip_nekretnine: "Stan",
      naziv: "Useljiv stan Sarajevo",
      kvadratura: 58,
      cijena: 232000,
      tip_grijanja: "plin",
      lokacija: "Novo Sarajevo",
      godina_izgradnje: 2019,
      datum_objave: "2023-10-01",
      opis: "Sociis natoque penatibus.",
      upiti: [
          { korisnik_id: 1, tekst: "Nullam eu pede mollis pretium." },
          { korisnik_id: 2, tekst: "Phasellus viverra nulla." },
          { korisnik_id: 3, tekst: "aaa" },
          { korisnik_id: 3, tekst: "bbbbbbbbbbbbbbb?" },
          { korisnik_id: 3, tekst: "cccccccccccccccccccccccccccc" }
      ]
  },
  {
      id: 2,
      tip_nekretnine: "Poslovni prostor",
      naziv: "Mali poslovni prostor",
      kvadratura: 20,
      cijena: 70000,
      tip_grijanja: "struja",
      lokacija: "Centar",
      godina_izgradnje: 2005,
      datum_objave: "2023-08-20",
      opis: "Magnis dis parturient montes.",
      upiti: [
          { korisnik_id: 2, tekst: "Integer tincidunt." },
          { korisnik_id: 3, tekst: "Da li je nekretnina još dostupna?" }
      ]
  },
  {
      id: 3,
      tip_nekretnine: "Kuća",
      naziv: "Porodična kuća",
      kvadratura: 140,
      cijena: 430000,
      tip_grijanja: "centralno",
      lokacija: "Novi Grad",
      godina_izgradnje: 2015,
      datum_objave: "2023-12-13",
      opis: "Magnis dis parturient montes.",
      upiti: [
          { korisnik_id: 1, tekst: "Nullam eu pede mollis pretium." },
          { korisnik_id: 2, tekst: "Phasellus viverra nulla." }
      ]
  },
  {
      id: 4,
      tip_nekretnine: "Stan",
      naziv: "Useljiv stan Sarajevo",
      kvadratura: 30,
      cijena: 130000,
      tip_grijanja: "struja",
      lokacija: "Novo Sarajevo",
      godina_izgradnje: 2013,
      datum_objave: "2023-12-11",
      opis: "Magnis dis parturient montes.",
      upiti: [
          { korisnik_id: 3, tekst: "Upit pod brojem 1?" },
          { korisnik_id: 2, tekst: "Upit broj 2?" },
          { korisnik_id: 1, tekst: "Jos jedan upit broj 3?" },
          { korisnik_id: 3, tekst: "Dodatni upit korisnika 3?" }
      ]
  }
];

const mysql = require('mysql2/promise'); 
const sequelize = require('./database');
const { Op } = require('sequelize');
const Korisnik = require('./models/Korisnik');
const Nekretnina = require('./models/Nekretnina');
const Upit = require('./models/Upit');
const Zahtjev = require('./models/Zahtjev');
const Ponuda = require('./models/Ponuda');
const bcrypt = require('bcrypt');
const express = require('express');

const app = express();
const PORT = 3000;

Korisnik.hasMany(Upit, { foreignKey: 'korisnik_id' });
Upit.belongsTo(Korisnik, { foreignKey: 'korisnik_id' });

Korisnik.hasMany(Zahtjev, { foreignKey: 'korisnik_id' });
Zahtjev.belongsTo(Korisnik, { foreignKey: 'korisnik_id' });

Korisnik.hasMany(Ponuda, { foreignKey: 'korisnik_id' });
Ponuda.belongsTo(Korisnik, { foreignKey: 'korisnik_id' });

Nekretnina.hasMany(Upit, { foreignKey: 'nekretnina_id' });
Upit.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id' });

Nekretnina.hasMany(Zahtjev, { foreignKey: 'nekretnina_id' });
Zahtjev.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id' });

Nekretnina.hasMany(Ponuda, { foreignKey: 'nekretnina_id' });
Ponuda.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id' });

async function kreirajBazu() {
  try
  {
    const connection=await mysql.createConnection({
      host:'localhost',
      user:'root', 
      password:'password',
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS wt24');
    console.log('Baza podataka je kreirana ili vec postoji.');
    await connection.end();
  }
  catch (error)
  {
    console.error('Greska prilikom kreiranja baze:', error);
    process.exit(1);
  }
}

async function popuniBazu() {
  try {
    for (const korisnik of listaKorisnika) {
      await Korisnik.create(korisnik);
    }
    console.log('Korisnici iz liste dodani.');

    const adminPassword = await bcrypt.hash('admin', 10);
    const userPassword = await bcrypt.hash('user', 10);

    await Korisnik.create({
      ime: 'Admin',
      prezime: 'Admin',
      username: 'admin',
      password: adminPassword,
      admin: true,
    });

    await Korisnik.create({
      ime: 'User',
      prezime: 'User',
      username: 'user',
      password: userPassword,
      admin: false,
    });

    console.log('Admin i user dodani.');

    for (const nekretnina of listaNekretnina) {
      const createdNekretnina = await Nekretnina.create({
        tip_nekretnine: nekretnina.tip_nekretnine,
        naziv: nekretnina.naziv,
        kvadratura: nekretnina.kvadratura,
        cijena: nekretnina.cijena,
        tip_grijanja: nekretnina.tip_grijanja,
        lokacija: nekretnina.lokacija,
        godina_izgradnje: nekretnina.godina_izgradnje,
        datum_objave: nekretnina.datum_objave,
        opis: nekretnina.opis,
      });

      for (const upit of nekretnina.upiti) {
        await Upit.create({
          tekst: upit.tekst,
          korisnik_id: upit.korisnik_id,
          nekretnina_id: createdNekretnina.id,
        });
      }
    }
    console.log('Nekretnine i upiti dodane u bazu.');

    const ponudeData = [
  {
    tekst_upita: "Ponuda za 210 000 KM",
    cijenaPonude: 210000,
    datumPonude: "2025-01-19",
    odbijenaPonuda: false,
    korisnik_id: 1,
    nekretnina_id: 1,
    vezanePonude: null, 
    korijenskaPonuda_id: null, 
  },
  {
    tekst_upita: "Kontra-ponuda za 220 000 KM",
    cijenaPonude: 220000,
    datumPonude: "2025-01-20",
    odbijenaPonuda: false,
    korisnik_id: 2,
    nekretnina_id: 1,
    vezanePonude: null,
    korijenskaPonuda_id: null, 
  },
  {
    tekst_upita: "Ponuda za 310 000 KM",
    cijenaPonude: 310000,
    datumPonude: "2025-01-21",
    odbijenaPonuda: true, 
    korisnik_id: 3,
    nekretnina_id: 1,
    vezanePonude: null,
    korijenskaPonuda_id: null,
  },
];

for(let i=0;i<ponudeData.length;i++)
{
  const ponuda=ponudeData[i];
  if(i===0) 
  {
    const korijenskaPonuda=await Ponuda.create({ ...ponuda,korijenskaPonuda_id:null});
    await korijenskaPonuda.update({korijenskaPonuda_id: korijenskaPonuda.id });
    ponudeData[i]=korijenskaPonuda;
  } 
  else
  {
    const vezanaPonuda=ponudeData[i - 1];
    const novaPonuda=await Ponuda.create({...ponuda,vezanePonude: vezanaPonuda.id,korijenskaPonuda_id: vezanaPonuda.korijenskaPonuda_id,});
    ponudeData[i] = novaPonuda; 
  }
}

  console.log("Ponude dodane u bazu.");


    const listaZahtjeva = [
      {
        tekst_upita: "Htjela bih pogledati stan",
        trazeniDatum: "2025-01-31",
        odobren: true,
        korisnik_id: 1,
        nekretnina_id: 1,
      },
      {
        tekst_upita: "Htjela bih pogledati poslovni prostor",
        trazeniDatum: "2025-01-24",
        odobren: false,
        korisnik_id: 2,
        nekretnina_id: 2,
      },
      {
        tekst_upita: "Htjela bih pogledati kucu",
        trazeniDatum: "2025-01-28",
        odobren: true,
        korisnik_id: 3,
        nekretnina_id: 3,
      },
      {
        tekst_upita: "Htjela bih pogledati stan",
        trazeniDatum: "2025-01-29",
        odobren: false,
        korisnik_id: 4,
        nekretnina_id: 4,
      },
    ];

    for (const zahtjev of listaZahtjeva){
      await Zahtjev.create(zahtjev);
    }
    console.log('Zahtjevi dodani u bazu.');
  } catch (error) {
    console.error('Greska kod popunjavanja baze:', error);
  }
}


(async ()=>{
  await kreirajBazu(); 
  await sequelize.sync({ force: false }); 
  console.log('Sve tabele su kreirane.');

  await popuniBazu();
  console.log('Podaci su dodani.');

  app.listen(PORT,()=>{
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  });
})();


const session = require("express-session");
const path = require('path');
const fs = require('fs').promises;

app.use(
  session({
    secret: 'tajna sifra',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

app.use(express.static(__dirname + '/public'));
app.use(express.json());


const blockVrijeme=60*1000;
const pokusajaPrijava={};

async function prijaveZapis(username,status) 
{
  let vrijeme=new Date().toISOString();
  let poruka=`[${vrijeme}] - username: "${username}" - status: "${status}"\n`;
  try 
  {
    await fs.appendFile(path.join(__dirname,'data','prijave.txt'),poruka);
  } 
  catch (error)
  {
    console.error('Greska!', error);
  }
}

async function serveHTMLFile(req, res, fileName) {
  const htmlPath = path.join(__dirname, 'public/html', fileName);
  try {
    const content = await fs.readFile(htmlPath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error serving HTML file:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
}

const routes = [
  { route: '/nekretnine.html', file: 'nekretnine.html' },
  { route: '/detalji.html', file: 'detalji.html' },
  { route: '/meni.html', file: 'meni.html' },
  { route: '/prijava.html', file: 'prijava.html' },
  { route: '/profil.html', file: 'profil.html' },
];

routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}

/*----------------RUTE------------*/

/* radi */
app.post('/login', async (req, res) => {
  const jsonObj=req.body;

  if(!jsonObj.username || !jsonObj.password) 
  {
    return res.status(400).json({ greska: 'Nedostaju podaci za prijavu' });
  }

  try {
    if (pokusajaPrijava[jsonObj.username]?.blokiran && pokusajaPrijava[jsonObj.username].blokiran > Date.now()) {
      await prijaveZapis(jsonObj.username, 'neuspješno');
      return res.status(429).json({greska: 'Previše neuspješnih pokušaja. Pokušajte ponovo za 1 minutu.'});
    }
    const korisnik=await Korisnik.findOne({
      where: { username: jsonObj.username },
    });
    if (!korisnik) {
      await prijaveZapis(jsonObj.username, 'neuspješno');
      return neuspjesnaPrijava(jsonObj.username, res);
    }

    const isPasswordMatched = await bcrypt.compare(jsonObj.password, korisnik.password);
    if (!isPasswordMatched) {
      await prijaveZapis(jsonObj.username, 'neuspješno');
      return neuspjesnaPrijava(jsonObj.username, res);
    }

    req.session.username = jsonObj.username;
    req.session.user = { id: korisnik.id, username: jsonObj.username, admin: korisnik.admin,};

    await prijaveZapis(jsonObj.username, 'uspješno');

    if (pokusajaPrijava[jsonObj.username])
    {
      delete pokusajaPrijava[jsonObj.username];
    }

    res.json({ poruka: 'Uspješna prijava' });
  }
  catch (error) 
  {
    console.error('Error during login:', error);
    res.status(500).json({ greska: 'Interna greška servera' });
  }
});

function neuspjesnaPrijava(username, res) {
  if (!pokusajaPrijava[username]) {
    pokusajaPrijava[username] = { pokusaja: 0, blokiran: null };
  }

  pokusajaPrijava[username].pokusaja++;

  if (pokusajaPrijava[username].pokusaja >= 3) {
    pokusajaPrijava[username].blokiran = Date.now() + blockVrijeme;
    return res.status(429).json({
      greska: 'Previše neuspješnih pokušaja. Pokušajte ponovo za 1 minutu.'
    });
  }

  return res.status(401).json({ poruka: 'Pogrešno korisničko ime ili lozinka' });
}

/*radi*/

app.post('/logout', (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ greska: 'Internal Server Error' });
    } else {
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    }
  });
});

/* ----------- FETCH CURRENT USER --------------- */
/*vraca iz baze*/
app.get('/korisnik', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  try
  {
    const korisnik = await Korisnik.findOne({where:{username:req.session.username},});
    if(!korisnik)
    {
      return res.status(404).json({greska:'Korisnik nije pronadjen.'});
    }
    const userData={
      id: korisnik.id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      username: korisnik.username,
    };
    res.status(200).json(userData);
  }
  catch(error)
  {
    console.error('Greska kod dohvacanja korisnika:', error);
    res.status(500).json({ greska: 'Interna greška servera' });
  }
});


/*vraca iz baze*/
app.post('/upit', async (req, res) => {
  if (!req.session || !req.session.user)
  {
    return res.status(401).json({ greska:'Neautorizovan pristup'});
  }

  const { nekretnina_id, tekst } = req.body;
  if (!tekst || !nekretnina_id)
  {
    return res.status(400).json({ greska: 'Tekst upita i ID nekretnine su obavezni.' });
  }

  try
  {
    const nekretnina=await Nekretnina.findByPk(nekretnina_id);
    if(!nekretnina)
    {
      return res.status(404).json({greska:'Nekretnina nije pronadjena.'});
    }

    const brojUpita=await Upit.count({
      where:{
        nekretnina_id,
        korisnik_id: req.session.user.id,
      },
    });

    if (brojUpita >= 3){
      return res.status(429).json({ greska: 'Previše upita za istu nekretninu.' });
    }

    const noviUpit=await Upit.create({
      nekretnina_id,
      korisnik_id: req.session.user.id,
      tekst,
    });

    res.status(200).json({ poruka: 'Upit je uspjesno dodan.', upit:noviUpit});
  } 
  catch(err)
  {
    console.error('Greska kod kreiranja upita:',err);
    res.status(500).json({ greska: 'Interna greška servera' });
  }
});


/*NEZ*/
app.put('/korisnik', async (req, res) => {
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { ime, prezime, username, password } = req.body;

  try {
    // Read user data from the JSON file
    const users = await readJsonFile('korisnici');

    // Find the user by username
    const loggedInUser = users.find((user) => user.username === req.session.username);

    if (!loggedInUser) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Update user data with the provided values
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      loggedInUser.password = hashedPassword;
    }

    // Save the updated user data back to the JSON file
    await saveJsonFile('korisnici', users);
    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*vraca iz baze*/
app.get('/nekretnine', async (req, res) => {
  try {
    const nekretnineData=await Nekretnina.findAll();
    res.json(nekretnineData);
  } catch (error) {
    console.error('Greska kod dohvacanja podataka:', error);
    res.status(500).json({ greska: 'Interna greska servera' });
  }
});

/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
app.post('/marketing/nekretnine', async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile('preferencije');

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error('Neispravan format podataka u preferencije.json.');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile('preferencije', preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find((item) => item.id === parseInt(id, 10));

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile('preferencije', preferencije);

      res.status(200).json({ success: true, message: 'Broj klikova ažuriran.' });
    } else {
      res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/pretrage', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/klikovi', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/*******************************************************/
/*vraca iz baze*/
app.get('/nekretnine/top5',async (req,res) => {
  const {lokacija}=req.query;

  if (!lokacija) 
  {
    return res.status(400).json({ greska: 'Niste postavili parametar za lokaciju.' });
  }

  try
  {
    const rez=await Nekretnina.findAll({
      where:{
        lokacija:{[Op.like]:`%${lokacija}%`},
      },
      order:[['datum_objave','DESC']],
      limit:5 
    });

    if(rez.length===0)
    {
      return res.status(404).json({ poruka:'Za zadanu lokaciju nema nekretnina.'});
    }
    res.status(200).json(rez); 
  } 
  catch (error)
  {
    console.error('Greška pri citanju:',error);
    res.status(500).json({ greska: 'Interna greska servera.' });
  }
});


/*vraca iz baze*/
app.get('/upiti/moji', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  try 
  {
    const korisnik=req.session.user.id;
    const upiti=await Upit.findAll({where:{korisnik_id:korisnik},
                                    include:[{
                                              model: Nekretnina,
                                              attributes: ['id'], 
                                            },
                                          ],
                                    });
    const rez=[];
    for(let i=0;i<upiti.length;i++)
    {
      rez.push({
        id_nekretnine:upiti[i].nekretnina_id, 
        tekst:upiti[i].tekst,
      });
    }
    res.status(200).json(rez);
  }
  catch (error)
  {
    console.error('Greska kod dohvacanja upita', error);
    res.status(500).json({ greska: 'Interna greška servera' });
  }
});


/*vraca iz baze*/
app.get('/nekretnina/:id',async (req, res) => {
  const idNekretnine=parseInt(req.params.id); 

  try
  {
    const nekretnina=await Nekretnina.findByPk(idNekretnine,{include: [
    {
        model: Upit,
        limit:3, 
        order:[['id','DESC']]
    }]});
    if (!nekretnina)
    {
      return res.status(404).json({ greska: 'Nekretnina nije pronađena.'});
    }
    res.status(200).json(nekretnina);
  } 
  catch(error)
  {
    console.error('Greska pri citanju datoteke:', error);
    res.status(500).json({ greska: 'Interna greska servera.' });
  }
});

app.get('/next/upiti/nekretnina/:id',async (req, res)=>{
  const idNekretnine=parseInt(req.params.id);
  const page=parseInt(req.query.page);

  if (page<0)
  {
      return res.status(200).json([]);
  }

  try {
    const izDatoteke=await fs.readFile(path.join(__dirname,'data','nekretnine.json'),'utf-8');
    const sveNekretnine=JSON.parse(izDatoteke);
    const nekr=sveNekretnine.find((n)=>n.id===idNekretnine);
    if (!nekr)
    {
      return res.status(404).json({greska:'Nekretnina nije pronadjena.' });
    }

    const ukupnoUpita=nekr.upiti.length;
    const prvi=Math.max(0,ukupnoUpita-(page+1)*3);
    const zadnji=ukupnoUpita-page*3;
    if (prvi>=ukupnoUpita || prvi===zadnji)
    {
      return res.status(404).json([]);
    }

    const rez=[];
    for (let i=prvi;i<zadnji; i++) 
    {
      if(nekr.upiti[i])
      { 
        rez.push({
          korisnik_id: nekr.upiti[i].korisnik_id,
          tekst: nekr.upiti[i].tekst,
        });
      }
    }
    res.status(200).json(rez);
  }
  catch (error)
  {
    console.error('Greska pri citanju datoteke:', error);
    res.status(500).json({ greska:'Interna greska servera.' });
  }
});


//za prikaz
app.get('/mojiUpiti.html', async (req, res) => {
  await serveHTMLFile(req, res, 'mojiUpiti.html');
});

/********************************************************************* */
app.get('/nekretnina/:id/interesovanja',async(req,res)=>{
  const nekretninaId=parseInt(req.params.id, 10);
  const korisnik=req.session.user || null;
  try
  {
    const nekretnina=await Nekretnina.findByPk(nekretninaId);

    if(!nekretnina)
    {
      return res.status(404).json({greska:'Nekretnina nije pronadjena.'});
    }
    const upiti=await Upit.findAll({
      where:{nekretnina_id:nekretninaId},
      include:[{model:Korisnik,attributes:['id','ime']}],
    });

    const zahtjevi=await Zahtjev.findAll({
      where:{nekretnina_id: nekretninaId},
      attributes:['id','tekst_upita','trazeniDatum','odobren','korisnik_id'],
      include:[{ model: Korisnik,attributes:['id','ime'] }],
    });
    
    const ponude=await Ponuda.findAll({
      where:{nekretnina_id: nekretninaId },
      attributes:['id', 'tekst_upita', 'cijenaPonude', 'odbijenaPonuda', 'vezanePonude', 'korijenskaPonuda_id', 'korisnik_id'], // Dodaj 'korisnik_id'
      include:[{model: Korisnik,attributes: ['id','ime'] }],
    });
    

    const formatiranaInteresovanja={
      upiti:upiti.map((upit)=>{
        const osnovniPodaci={
          id:upit.id,
          tekst:upit.tekst,
        };

        if(korisnik?.admin || korisnik?.id===upit.korisnik_id)
        {
          return{
            ...osnovniPodaci,
            korisnik_id: upit.korisnik_id,
            korisnik_ime: upit.Korisnik?.ime || "Nepoznato",
          };
        }
        return osnovniPodaci;
      }),
      zahtjevi:zahtjevi.map((zahtjev)=>{
        const osnovniPodaci={
          id:zahtjev.id,
          tekst_upita:zahtjev.tekst_upita,
          trazeniDatum:zahtjev.trazeniDatum,
          status:zahtjev.odobren ? "Odobren" : "Odbijen",
        };
        if (korisnik?.admin || korisnik?.id===zahtjev.korisnik_id)
        {
          return {
            ...osnovniPodaci,
            korisnik_id: zahtjev.korisnik_id,
            nekretnina_id: nekretninaId
          };
        }
        return osnovniPodaci;
      }),
      ponude:ponude.map((ponuda)=>{
        const osnovniPodaci={
          id:ponuda.id,
          tekst_upita:ponuda.tekst_upita,
          status:ponuda.odbijenaPonuda ? 'Odbijena' : 'Aktivna',
        };
      
        if (korisnik?.admin || korisnik?.id===ponuda.korisnik_id)
        {
          return {
            ...osnovniPodaci,
            korisnik_id: ponuda.korisnik_id,
            nekretnina_id: nekretninaId,
            cijenaPonude: ponuda.cijenaPonude,
            vezanePonude: ponuda.vezanePonude,
            korijenskaPonuda_id: ponuda.korijenskaPonuda_id,
            odbijenaPonuda: ponuda.odbijenaPonuda,
          };
        }
        return osnovniPodaci;
      }),
      
    };

    res.status(200).json({korisnik,nekretnina,interesovanja: formatiranaInteresovanja,});
  }
  catch (error) 
  {
    console.error('Greska pri dohvacanju interesovanja:', error);
    res.status(500).json({greska:'Interna greska servera.' });
  }
});
app.post('/nekretnina/:id/ponuda', async (req, res)=>{
  const nekretninaId=parseInt(req.params.id);
  const { tekst = null, ponudaCijene = null, idVezanePonude = null, odbijenaPonuda } = req.body;

  if(!req.session.user) 
  {
    return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }
  const korisnikId=req.session.user.id;
  try 
  {
    const nekretnina=await Nekretnina.findByPk(nekretninaId);
    if (!nekretnina)
    {
      return res.status(404).json({ greska: 'Nekretnina nije pronadjena.' });
    }
    let korijenskaPonudaId=null;
    if(idVezanePonude)
    {
      const vezanaPonuda=await Ponuda.findByPk(idVezanePonude);
      if (!vezanaPonuda)
      {
        return res.status(404).json({ greska: 'Vezana ponuda nije pronadjena.' });
      }

      const lanacPonuda=await Ponuda.findAll({where:{korijenskaPonuda_id:vezanaPonuda.korijenskaPonuda_id},});

      const zakljucan=lanacPonuda.some((ponuda) => ponuda.odbijenaPonuda===true);
      if(zakljucan)
      {
        return res.status(400).json({greska: 'Lanac je zakljucan jer sadrzi odbijenu ponudu.',});
      }
      korijenskaPonudaId=vezanaPonuda.korijenskaPonuda_id;
    }

    if (!odbijenaPonuda && (!tekst || !ponudaCijene))
    {
      return res.status(400).json({ greska: 'Tekst i cijena su obavezni za neodbijene ponude.' });
    }
    const datumPonude=new Date();
    const novaPonuda=await Ponuda.create({
      tekst_upita: tekst || 'Ponuda je odbijena',
      cijenaPonude: odbijenaPonuda ? null : ponudaCijene,
      datumPonude,
      odbijenaPonuda: !!odbijenaPonuda,
      korisnik_id: korisnikId,
      nekretnina_id: nekretninaId,
      vezanePonude: idVezanePonude,
      korijenskaPonuda_id: korijenskaPonudaId,
    });
    if(!idVezanePonude)
    {
      await novaPonuda.update({korijenskaPonuda_id:novaPonuda.id });
    }
    res.status(200).json({ poruka: 'Ponuda je kreirana.', ponuda: novaPonuda });
  } 
  catch (error)
  {
    console.error('Greska je u ruti', error);
    res.status(500).json({ greska: 'Interna greska servera.' });
  }
});


app.post('/nekretnina/:id/zahtjev', async (req, res) => {
  const nekretninaId=parseInt(req.params.id);
  const { tekst, trazeniDatum }=req.body;

  if (!req.session.user) 
  {
    return res.status(401).json({greska:'Neautorizovan pristup.' });
  }

  const korisnikId=req.session.user.id;

  try 
  {
    const nekretnina=await Nekretnina.findByPk(nekretninaId);
    if (!nekretnina)
    {
      return res.status(404).json({greska:'Nekretnina nije pronadjena.' });
    }

    if (!tekst || !trazeniDatum) 
    {
      return res.status(400).json({ greska: 'Unesite sve parametre' });
    }

    const danasnjiDatum=new Date().setHours(0,0,0,0);
    const uneseniDatum=new Date(trazeniDatum).setHours(0,0,0,0);

    if(isNaN(uneseniDatum))
    {
      return res.status(400).json({ greska: 'Niste unijeli vlidan datum.' });
    }
    if (uneseniDatum<danasnjiDatum)
    {
      return res.status(400).json({greska:'Trazeni datum ne moze biti u proslosti.' });
    }
    const noviZahtjev=await Zahtjev.create({
      tekst_upita: tekst,
      trazeniDatum: trazeniDatum,
      odobren: false, 
      korisnik_id: korisnikId,
      nekretnina_id: nekretninaId,
    });

    res.status(200).json({poruka: 'Zahtjev je kreiran.',zahtjev: noviZahtjev,});
  } 
  catch (error)
  {
    console.error('Greska kod kreiranja zahtjeva:', error);
    res.status(500).json({ greska: 'Interna greska servera.' });
  }
});


app.get('/nekretnina/:id/vezane-ponude',async(req,res)=>{
  const nekretninaId=parseInt(req.params.id);
  if(!req.session.user)
  {
      return res.status(401).json({greska:'Neautorizovan pristup.' });
  }
  const korisnikId=req.session.user.id;
  const adm=req.session.user.admin;

  try
  {
      const ponude=await Ponuda.findAll({where:{nekretnina_id:nekretninaId}});
      let vezanePonude=[];
      if(adm)
      {
          vezanePonude=ponude;
      } 
      else
      {
          vezanePonude=ponude.filter(ponuda => ponuda.korisnik_id===korisnikId);
      }
      res.status(200).json({ vezanePonude });
  } 
  catch (error)
  {
      console.error('Greska kod dohvacanja vezanih ponuda:', error);
      res.status(500).json({ greska: 'Interna greška servera.' });
  }
});

app.put('/nekretnina/:id/zahtjev/:zid', async (req, res) => {
  const nekretninaId=parseInt(req.params.id);
  const zahtjevId=parseInt(req.params.zid);
  const { odobren, addToTekst }=req.body;
  if (!req.session.user || !req.session.user.admin)
  {
    return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }
  try 
  {
    const zahtjev=await Zahtjev.findOne({
      where:{
        id:zahtjevId,
        nekretnina_id:nekretninaId,
      },
    });

    if(!zahtjev) 
    {
      return res.status(404).json({greska:'Zahtjev nije pronadjen.' });
    }
    if(odobren===false) 
    {
      if (!addToTekst || addToTekst.trim() === '') 
      {
        return res.status(404).json({greska: 'Parametar addToTekst je obavezan kada je odobren postavljen na false.',});
      }
    }
    zahtjev.odobren=odobren;
    if(addToTekst)
    {
      zahtjev.tekst_upita+=` ODGOVOR ADMINA: ${addToTekst.trim()}`;
    }
    await zahtjev.save();
    res.status(200).json({ poruka: 'Zahtjev je azuriran.', zahtjev });
  } 
  catch (error)
  {
    console.error('Greska pri azuriranju zahtjeva:', error);
    res.status(500).json({ greska: 'Interna greska servera.' });
  }
});