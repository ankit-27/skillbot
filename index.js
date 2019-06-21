const express = require('express')
const bodyParser = require('body-parser')
var request = require("request");

const app = express() 
const port = 5000 
app.use(bodyParser.json()) 

var url, apiKey, dbResponse, cont;
var memSkill, memProf, memName, memEmpid;


app.post('/', (req, res) => {
  console.log(req.body)
  url = 'https://skillsdb-13fb.restdb.io/rest/skill';
  apiKey = '5541eadc9a1186f89fecb4cb4ec64b436b0dc'; 
  
  memSkill = req.body.conversation.memory.skill.skill;
  memProf = req.body.conversation.memory.proficiency.proficiency;

  if(req.body.conversation.skill == 'update-skill'){

    memName = req.body.conversation.memory.name.value;
    memEmpid = req.body.conversation.memory.empid.value;

    var options = { method: 'POST',
      url: 'https://skillsdb-13fb.restdb.io/rest/skill',
      headers: 
       { 'cache-control': 'no-cache',
         'x-apikey': '5541eadc9a1186f89fecb4cb4ec64b436b0dc',
         'content-type': 'application/json' },
      body: { name: memName, empid: memEmpid, skill: memSkill, proficiency: memProf },
      json: true };


    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      console.log("Updated");

      res.send({
        replies: [{
          type: 'text',
          content: 'Record Updated',
        }], 
        conversation: {
          memory: { key: 'value' }
        }
      })
    });
    

  }
  else{
    // createURL(memSkill,memProf);

    if(memProf == "all"){
      url = url + '?q={"skill": "' + memSkill + '"}';
    }
    else{
      url = url + '?q={"skill": "' + memSkill + '", "proficiency": "' + memProf + '"}'; 
    }
    console.log("url:",url);

    // connecting with restdb.io
    var options = { method: 'GET',
      url: url,
      headers: 
       { 'cache-control': 'no-cache',
         'x-apikey': apiKey } };

    //sending request to restdb.io 
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log("db",body);
      dbResponse = JSON.parse(body);
      console.log("len",dbResponse.length);
      cont = 'Number of employees who know ' + memSkill + ' with proficiency ' + memProf + ' are ' + dbResponse.length + '.';
      
      res.send({
        replies: [{
          type: 'text',
          content: cont,
        }], 
        conversation: {
          memory: { key: 'value' }
        }
      })

    });

  }

})

  
app.post('/errors', (req, res) => {
  console.log(req.body) 
  res.send() 
}) 


app.listen(port, () => { 
  console.log('Server is running on port 5000') 
})