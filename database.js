const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('wt24','root','password',{
    host:'mysql-db',
    dialect:'mysql',
});
module.exports=sequelize;
