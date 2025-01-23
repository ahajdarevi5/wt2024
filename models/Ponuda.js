const {DataTypes}=require('sequelize');
const sequelize=require('../database');

const Ponuda=sequelize.define('Ponuda', {
    id: {
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
      references:{
        model: 'Korisnik',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    nekretnina_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: 'Nekretnina',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    vezanaPonuda_id:{
        type:DataTypes.INTEGER,
        allowNull:true, 
    },
  },
  {
    freezeTableName: true,
  });
  
Ponuda.belongsTo(Ponuda, { as: 'VezanaPonuda', foreignKey: 'vezanaPonuda_id' });
Ponuda.hasMany(Ponuda, { as: 'Odgovori', foreignKey: 'vezanaPonuda_id' });

Ponuda.prototype.getVezanePonude=async function (){
    return await Ponuda.findAll({where:{nekretnina_id:this.nekretnina_id},});
};

module.exports=Ponuda;
