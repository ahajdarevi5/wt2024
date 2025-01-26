const {DataTypes}=require('sequelize');
const sequelize=require('../database');
const Upit=sequelize.define('Upit',{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    tekst:{
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
    nekretnina_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Nekretnina',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    freezeTableName: true,
  });

module.exports=Upit;
