const {DataTypes}=require('sequelize');
const sequelize=require('../database');

const Upit=sequelize.define('Upit',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    tekst_upita:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    korisnik_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    nekretnina_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
});
module.exports=Upit;
