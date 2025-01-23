const {DataTypes}=require('sequelize');
const sequelize=require('../database');
const Upit=require('./Upit');
const Zahtjev=require('./Zahtjev');
const Ponuda=require('./Ponuda');

const Nekretnina=sequelize.define('Nekretnina',{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    tip_nekretnine:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    naziv:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    kvadratura:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    cijena:{
      type:DataTypes.FLOAT,
      allowNull:false,
    },
    tip_grijanja:{
      type:DataTypes.STRING,
      allowNull:true,
    },
    lokacija:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    godina_izgradnje:{
      type:DataTypes.INTEGER,
      allowNull:true,
    },
    datum_objave:{
      type:DataTypes.DATEONLY,
      allowNull:false,
    },
    opis:{
      type:DataTypes.TEXT,
      allowNull:true,
    },
  },
  {
    freezeTableName: true,
  });
  Nekretnina.prototype.getInteresovanja=async function(){
    const upiti=await Upit.findAll({where:{nekretnina_id:this.id}});
    const zahtjevi=await Zahtjev.findAll({where:{nekretnina_id:this.id}});
    const ponude=await Ponuda.findAll({where:{nekretnina_id:this.id}});
    return
    {
        upiti,
        zahtjevi,
        ponude
    };
};
module.exports = Nekretnina;
  