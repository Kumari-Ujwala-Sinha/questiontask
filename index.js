const express = require("express");
const bodyParser = require("body-parser"); /* deprecated */

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "ques"
});



const app = express();



app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

})
app.get("/", (req, res) => {
  
  res.sendFile(__dirname + '/main.html')
  })


app.get("/questions",(req,res)=>{
    
  var sql= "SELECT * FROM Questionsts"
  con.query(sql,(error,result)=>{
      if(error) console.log(error)
    
      
      
      res.render(__dirname + "/questions",{questions:result});
  })
})


app.post("/insert", (req, res) => {
    console.log(req.body)
    
     
        var sql = "INSERT INTO  Questionsts (Question,Statement1,Statement2,Statement3,Statement4,Option1,Option2,Option3,Option4,Correct) VALUES ?";
        var {question,name1,name2,name3,name4,option1,option2,option3,option4,checkbox}=req.body
        
       var values = [
          [question,name1,name2,name3,name4,option1,option2,option3,option4,checkbox]
        ];
        //var values=[['q3','["st1","st2","st3","st4"]','["op1","op2","op3","op4"]','option2']]
        con.query(sql, [values], function (err, result) {
          if (err) throw err;
          res.redirect("/questions")
          console.log("Number of records inserted: " + result.affectedRows);
         
        });
        
      });


 






  app.get("/delete",(req,res)=>{
 
        var sql= "DELETE FROM Questionsts where qID=?";
        var ids=req.query.id
        con.query(sql,[ids],(error,result)=>{
            if(error) console.log(error)
          
            
            
            res.redirect("/questions")
        })
    })
 
  app.get("/update",(req,res)=>{
   
        var sql= "select * FROM Questionsts where qID=?";
        var ids=req.query.id
        con.query(sql,[ids],(error,result)=>{
            if(error) console.log(error)
          
            
            
            res.render(__dirname + "/updatequestion",{questions:result});
        })
    })

  app.post("/updatequ", (req, res) => {
   
    
    
        var {qID,question,Statement1,Statement2,Statement3,Statement4,Option1,Option2,Option3,Option4}=req.body
        const qIDs=Number(req.body.qID)
        
        var sql = "UPDATE Questionsts SET Question=?, Statement1=?, Statement2=?, Statement3=?, Statement4=?, Option1=?, Option2=?, Option3=?, Option4=? WHERE qID=?";
        
        con.query(sql, [question,Statement1,Statement2,Statement3,Statement4,Option1,Option2,Option3,Option4,qIDs], function (err, result) {
          if (err) throw err;
         
          res.redirect("/questions")
        })
    });
  

  


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
