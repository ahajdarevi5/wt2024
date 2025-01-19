const sequelize=require('./database');
const Korisnik=require('./models/Korisnik');
const Nekretnina=require('./models/Nekretnina');
const Upit=require('./models/Upit');
const Zahtjev=require('./models/Zahtjev');
const Ponuda=require('./models/Ponuda');

Korisnik.hasMany(Upit,{foreignKey:'korisnik_id'});
Upit.belongsTo(Korisnik,{foreignKey:'korisnik_id'});

Korisnik.hasMany(Zahtjev,{foreignKey:'korisnik_id'});
Zahtjev.belongsTo(Korisnik,{foreignKey:'korisnik_id'});

Korisnik.hasMany(Ponuda,{foreignKey:'korisnik_id'});
Ponuda.belongsTo(Korisnik,{foreignKey:'korisnik_id'});

Nekretnina.hasMany(Upit,{foreignKey:'nekretnina_id'});
Upit.belongsTo(Nekretnina,{foreignKey:'nekretnina_id'});

Nekretnina.hasMany(Zahtjev,{foreignKey:'nekretnina_id'});
Zahtjev.belongsTo(Nekretnina,{foreignKey:'nekretnina_id'});

Nekretnina.hasMany(Ponuda,{foreignKey:'nekretnina_id'});
Ponuda.belongsTo(Nekretnina,{foreignKey:'nekretnina_id'});



const express = require('express');
const session = require("express-session");
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

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
  const jsonObj = req.body;

  if (!jsonObj.username || !jsonObj.password) {
    return res.status(400).json({ greska: 'Nedostaju podaci za prijavu' });
  }

  try {
    if (pokusajaPrijava[jsonObj.username]?.blokiran && pokusajaPrijava[jsonObj.username].blokiran > Date.now()) {
      await prijaveZapis(jsonObj.username, 'neuspješno');
      return res.status(429).json({
        greska: 'Previše neuspješnih pokušaja. Pokušajte ponovo za 1 minutu.'
      });
    }

    const data=await fs.readFile(path.join(__dirname,'data','korisnici.json'), 'utf-8');
    const korisnici = JSON.parse(data);

    const korisnik = korisnici.find((k) => k.username === jsonObj.username);
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
    req.session.user = { id: korisnik.id, username: jsonObj.username };

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

app.get('/korisnik', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const username = req.session.username;

  try {
    const users = await fs.readFile(path.join(__dirname, 'data', 'korisnici.json'), 'utf-8');
    const user = JSON.parse(users).find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*radi*/
app.get('/korisnik', async (req, res) => {
  // Check if the username is present in the session
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // User is logged in, fetch additional user data
  const username = req.session.username;

  try {
    // Read user data from the JSON file
    const users = await readJsonFile('korisnici');

    // Find the user by username
    const user = users.find((u) => u.username === username);

    if (!user) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Send user data
    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password // Should exclude the password for security reasons
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});


/*RADI*/
app.post('/upit', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { nekretnina_id, tekst_upita } = req.body;

  try {
    /*postojeci kod*/
    const users=await readJsonFile('korisnici');
    const nekretnine=await readJsonFile('nekretnine');
    const loggedInUser=users.find((user) => user.username === req.session.user.username);
    const nekretnina=nekretnine.find((property) => property.id === nekretnina_id);

    if (!nekretnina) 
    {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
    }

    const sviUpiti=nekretnina.upiti.filter(
      (query) => query.korisnik_id === loggedInUser.id
    );

    if (sviUpiti.length>=3) {
      return res.status(429).json({ greska: 'Previse upita za istu nekretninu.' });
    }

    nekretnina.upiti.push({
      korisnik_id: loggedInUser.id,
      tekst_upita: tekst_upita
    });

    // Save the updated properties data back to the JSON file
    await saveJsonFile('nekretnine', nekretnine);

    res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } 
  catch (error) 
  {
    console.error('Error processing query:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});


/*NEZ*/
app.put('/korisnik', async (req, res) => {
  // Check if the user is authenticated
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

/*
Returns all properties from the file.
*/
app.get('/nekretnine', async (req, res) => {
  try {
    const nekretnineData=await Nekretnina.findAll();
    res.json(nekretnineData);
  } catch (error) {
    console.error('Error fetching properties data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
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
app.get('/nekretnine/top5',async (req,res) => {
  const {lokacija}=req.query;

  if (!lokacija) 
  {
    return res.status(400).json({ greska: 'Niste postavili parametar za lokaciju.' });
  }

  try 
  {
    const izDatoteke=await fs.readFile(path.join(__dirname,'data','nekretnine.json'),'utf-8');
    const sveNekretnine=JSON.parse(izDatoteke);

    const filtriraneNekr=sveNekretnine.filter((nekretnina)=>nekretnina.lokacija.toLowerCase() === lokacija.toLowerCase()
    );

    const sortNekr=filtriraneNekr.sort((a,b)=>
        new Date(b.datum_objave.split('.').reverse().join('-')) -
        new Date(a.datum_objave.split('.').reverse().join('-'))
    );

    const rez=sortNekr.slice(0,5);

    res.status(200).json(rez);
  } 
  catch (error) 
  {
    console.error('Greška pri čitanju datoteke!',error);
    res.status(500).json({ greska: 'Interna greška servera.' });
  }
});


app.get('/upiti/moji', async (req, res) => {
  if (!req.session.user) 
    {
      return res.status(401).json({ greska:'Neautorizovan pristup' });
    }

  try {
    const izDatoteke=await fs.readFile(path.join(__dirname,'data','nekretnine.json'),'utf-8');
    const nekretnine=JSON.parse(izDatoteke);
    const korisnikId=req.session.user.id;
    const rez=[];

    for (const nekretnina of nekretnine) 
    {
      for (const upit of nekretnina.upiti) 
      {
        if (upit.korisnik_id === korisnikId) 
        {
          rez.push({
            id_nekretnine: nekretnina.id,
            tekst_upita: upit.tekst_upita,
          });
        }
      }
    }

    if (rez.length===0) 
    {
      return res.status(404).json([]); 
    }

    res.status(200).json(rez);
  } 
  catch (error)
  {
    console.error('Greška pri čitanju datoteke:', error);
    res.status(500).json({ greska: 'Interna greška servera.' });
  }
});


app.get('/nekretnina/:id',async (req, res) => {
  const idNekretnine=parseInt(req.params.id); 

  try {
    const izDatoteke=await fs.readFile(path.join(__dirname,'data','nekretnine.json'),'utf-8');
    const sveNekretnine=JSON.parse(izDatoteke);
    const nekr=sveNekretnine.find((n) => n.id===idNekretnine);

    if (!nekr) 
    {
      return res.status(404).json({greska:'Nekretnina nije pronađena.' });
    }

    nekr.upiti=nekr.upiti.slice(-3);

    res.status(200).json(nekr);
  } 
  catch (error)
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
          tekst_upita: nekr.upiti[i].tekst_upita,
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


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
