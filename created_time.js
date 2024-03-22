const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "registration"
  });
  
  conn.connect((err) => {
    if (err) throw err;
    console.log('Connected to the  database! created date');
  });

function created_time(req,res){
  conn.query(`select * from user_info`,async function(err,result,fields){
    if(err) throw err;
    data=await result;
    res.json(data);
  })
};

module.exports=created_time;
