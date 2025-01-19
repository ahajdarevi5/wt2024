const {DataTypes}=require('sequelize');
const sequelize=require('../database');

const Zahtjev=sequelize.define('Zahtjev',{
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
    trazeniDatum:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    odobren:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
});
module.exports=Zahtjev;
