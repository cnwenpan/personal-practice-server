const mysql = require('mysql');
const  {v4 } =require('uuid') ;
const {mysqlConfig} =require('./config');
const connection=mysql.createConnection(mysqlConfig);

connection.connect();

exports.exec=(sql,values)=>{
    return new Promise((resolve,reject)=>{
        if(sql.indexOf('insert')>-1){
            values.unshift(v4())
        }
        connection.query(sql,values,(error, results)=>{
            if(error) reject(error)
            resolve(results)
        })
    })
}


