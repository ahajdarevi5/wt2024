const {DataTypes}=require('sequelize');
const sequelize=require('../database');

const Ponuda=sequelize.define('Ponuda',{
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
    cijenaPonude:{
        type:DataTypes.FLOAT,
        allowNull:false,
    },
    datumPonude:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    odbijenaPonuda:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
});

Ponuda.prototype.getVezanePonude=async function (){
    return await Ponuda.findAll({where:{nekretnina_id:this.nekretnina_id},});
};

module.exports=Ponuda;
