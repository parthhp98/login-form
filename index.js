const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const port = 9012;
var created_time=require('./created_time'); 
const md5 = require('md5');



app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "registration"
  });
  
  conn.connect((err) => {
    if (err) throw err;
    console.log('Connected to the  database!');
  });
  

app.get('/',(req,res)=>{
res.render('register.ejs')
})


app.get('/checkemail/:email',(req,res)=>{
  console.log(req.params.email);
  var q17=`select count(*) as counter from user_info where email='${req.params.email}'`
  conn.query(q17, (err, result) => {
    console.log(q17);
    if (err) throw err;
    else{
      console.log('result[0].counter',result[0].counter);
      const emailExists=result[0].counter>=1
        res.send({emailExists});
    }
  })

})

app.post('/submit/:code', async(req,res)=>{
  var code=req.params.code;
    var formData=req.body;
    var data=req.body;
    console.log(formData);



    var q = `insert into user_info(fname,lname,email,phone,activation,status)
  values('${formData.first_name}','${formData.last_name}','${formData.email}','${formData.phone}','${code}','Deactive');`;

  res.send(code);

conn.query(q, (err, result) => {
  console.log(q);
  if (err) throw err;
})
})

app.get('/created_time',created_time);


//  Salt Creation....
function salt(){
  let len=4;
  let res="";
  const charc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const total=charc.length;
  let count=0;
  while(count<len){
      res +=charc.charAt(Math.floor(Math.random()* total));
      count +=1;
  }
  return res;
}

app.get('/passwd/:actcode',(req,res)=>{
  q15=`select count(*) as counter from user_info where activation='${req.params.actcode}'`
  conn.query(q15, (err, result) => {
    console.log(q15);
    if (err) throw err;
    else{
      if(result[0].counter==1){
        res.render('password.ejs')}
        else{
          res.send('invalid url');
        }

    }
  })
})

app.post('/passwd/:actcode', async(req,res)=>{

  var actcode=req.params.actcode;
    var formData=req.body;
    var data=req.body;
    var pass=formData.create_passwd;
    console.log(actcode);
    console.log(formData);
    res.json();
   
    var newsalt=salt();
    var newpass=pass+newsalt;
    console.log(newpass);
    let updatedpassword=md5(newpass);
    console.log(updatedpassword);


  q4= `UPDATE user_info
  SET password ='${updatedpassword}', salt = '${newsalt}',status='active'
  WHERE activation='${actcode}'; `
  conn.query(q4, (err, result) => {
    console.log(q4);
    if (err) throw err;
  })
})


//  Login..

app.get('/login',(req,res)=>{
res.render('login.ejs')
})

app.post('/login',(req,res)=>{
    let formData=req.body;
    let flag=true;
    console.log(formData);
    let mix;
    let passnew;
    q7=`select * from user_info`;
    conn.query(q7,(err,result)=>{
      if(err) throw err;
      result.forEach(data => {
        if(data.email==formData.email){
          // console.log('email found');
          mix=formData.password+data.salt;
          // console.log('mixxxx',mix);
          passnew=md5(mix);

          if(passnew== data.password){
            console.log('succesfull');
            flag=true;
          }
          else{
            flag=false;
          }
        }
        else{
          flag=false;
        }
      });
      res.json(flag);
      console.log('flaffggg',flag);

    })

})


// forget passwd.

app.get('/forget/:email',(req,res)=>{
  console.log('forgetemail', req.params.email);
  q17=`select count(*) as counter from user_info where email='${req.params.email}'`
  console.log(q17);
  conn.query(q17, (err, result) => {
    console.log(q17);
    if (err) throw err;
    else{
      console.log('result[0].counter',result[0].counter);
      if(result[0].counter>=1){
        console.log('result[0].counter',result[0].counter);
        res.render('password.ejs')
      }
        else{
          res.send('invalid gmail');
        }

    }
  })
})

app.post('/forget/:email', async(req,res)=>{
  var email=req.params.email;
    var formData=req.body;
    var pass=formData.create_passwd;
    // console.log(formData);
    res.json();

    var newsalt=salt();
    var newpass=pass+newsalt;
    console.log(newpass);
    let updatedpassword=md5(newpass);
    console.log(updatedpassword);


  q8= `UPDATE user_info
  SET password ='${updatedpassword}', salt = '${newsalt}',status='active'
  WHERE email='${email}'; `
  conn.query(q8, (err, result) => {
    console.log(q8);
    if (err) throw err;
  })
    
})

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})