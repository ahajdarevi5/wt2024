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
    allowNull:true,
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
    allowNull:true,
  },
  datumPonude:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  },
  odbijenaPonuda:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  vezanePonude:{
    type:DataTypes.INTEGER,
    allowNull:true,
    references:{
      model:'Ponuda',
      key:'id',
    },
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
  },
  korijenskaPonuda_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
    references:{
      model:'Ponuda',
      key:'id',
    },
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
  },
},
{
  freezeTableName: true,
});

Ponuda.belongsTo(Ponuda, { as: 'VezanaPonuda', foreignKey: 'vezanePonude' });
Ponuda.hasMany(Ponuda, { as: 'Odgovori', foreignKey: 'vezanePonude' });

Ponuda.belongsTo(Ponuda, { as: 'KorijenskaPonuda', foreignKey: 'korijenskaPonuda_id' });
Ponuda.hasMany(Ponuda, { as: 'SveVezanePonude', foreignKey: 'korijenskaPonuda_id' });

Ponuda.prototype.getVezanePonude=async function (){
  return await Ponuda.findAll({where:{korijenskaPonuda_id: this.korijenskaPonuda_id},});
};


module.exports=Ponuda;
