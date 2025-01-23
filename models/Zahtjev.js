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
      references: {
        model: 'Korisnik',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    nekretnina_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Nekretnina',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    trazeniDatum:{
      type:DataTypes.DATEONLY,
      allowNull:false,
    },
    odobren:{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
  },
  {
    freezeTableName: true,
  });
module.exports=Zahtjev;
