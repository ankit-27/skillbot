const express = require('express')
const bodyParser = require('body-parser')
var request = require("request");

const app = express() 
const port = 5000 
app.use(bodyParser.json()) 

var url, apiKey, dbResponse, cont;
var memSkill, memProf, memName, memEmpid;


app.post('/', (req, res) => {
  // console.log(req.body)
  url = 'https://skillsdb-13fb.restdb.io/rest/sample-data';
  apiKey = '5541eadc9a1186f89fecb4cb4ec64b436b0dc'; 
  
  //memSkill = req.body.conversation.memory.skill.skill;
  //memProf = req.body.conversation.memory.proficiency.proficiency;

  //console.log("response",req.body);

  if(req.body.conversation.skill == 'empnocheck'){
    memEmpid = req.body.nlp.source;

    console.log("empno");
    console.log(memEmpid);

    url = url + '?q={"Employee_No": ' + memEmpid + '}'; 
    console.log("url:",url);

    // connecting with restdb.io
    var options = { method: 'GET',
      url: url,
      headers: 
       { 'cache-control': 'no-cache',
         'x-apikey': apiKey } };


    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      console.log("Updated");


      dbResponse = JSON.parse(body);
      console.log("dbres",dbResponse[0].Employee_Name);
      // var reply = dbResponse[0].Employee_Name

      var reslist = "[";

      for(var i = 0 ; i < dbResponse.length ; i++){
        reslist = reslist + '{"subtitle":"' +  dbResponse[i].Skill + '"},';
      }

      reslist = reslist + ']';

      console.log("reslist: ",reslist);
      // cont = 'Number of employees who know ' + memSkill + ' with proficiency ' + memProf + ' are ' + dbResponse.length + '.';

      res.send({
        replies: [
        {
          type: 'text',
          content: "Name of the employee for " + memEmpid + " is " + reply + " and skills are :",
        },

        {
          type: 'list',
          // content: "Name of the employee for " + memEmpid + " is " + reply ,
          content: {
            "elements": [
             {
                "title": "",
                "imageUrl": "",
                "subtitle": "Java - Beginner",
                "buttons": []
             },
             {
                "title": "",
                "imageUrl": "",
                "subtitle": "Python - Expert",
                "buttons": []
             },
            ]
          }
        }], 
        conversation: {
          memory: { key: 'value' }
        }
      })

    });
  }

  if(req.body.conversation.skill == 'employee-name'){
    memName = req.body.nlp.source;

    url = url + '?q={"Employee_Name":{"$regex":"' + memName + '"}}';

    var options = { method: 'GET',
      url: url,
      headers: 
       { 'cache-control': 'no-cache',
         'x-apikey': apiKey } };


    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      // console.log("Updated");


      dbResponse = JSON.parse(body);
      // console.log("dbres",dbResponse);
      var v1 = [];
      

      for(var i = 1 ; i < dbResponse.length ; i++){
        v1.push(dbResponse[i].Employee_No);
      }

      const distinct = (value,index,self) => {
        return self.indexOf(value) === index;
      }

      // var v2 = v1.filter(distinct);

      // console.log(v2);

      var reslist = "[";

      for(var i = 0 ; i < dbResponse.length ; i++){
        reslist = reslist + '{"title":"","imageUrl":"",';
        reslist = reslist + '"subtitle":"' +  dbResponse[i].Employee_Name + ' - ' + dbResponse[i].Skill + '",';
        if(i == (dbResponse.length-1) )
          reslist = reslist + '"buttons":[]}';
        else 
          reslist = reslist + '"buttons":[]},';
      }

      reslist = reslist + ']';

      // console.log("reslist: ",reslist);
      // cont = 'Number of employees who know ' + memSkill + ' with proficiency ' + memProf + ' are ' + dbResponse.length + '.';
      console.log(reslist);


      var h1 = '[{"title":"","imageUrl":"","subtitle":"Hello","buttons":[]}]';

      res.send({
        replies: [
        {
          type: 'list',
          // content: h1,
          content: {
            "elements": JSON.parse(reslist)
          }
        }
        ], 
        conversation: {
          memory: { key: 'value' }
        }
      })

    });
  }

  // if(req.body.conversation.skill == 'update-skill'){

  //   memName = req.body.conversation.memory.name.value;
  //   memEmpid = req.body.conversation.memory.empid.value;

  //   var options = { method: 'POST',
  //     url: 'https://skillsdb-13fb.restdb.io/rest/sample-data',
  //     headers: 
  //      { 'cache-control': 'no-cache',
  //        'x-apikey': '5541eadc9a1186f89fecb4cb4ec64b436b0dc',
  //        'content-type': 'application/json' },
  //     body: { name: memName, empid: memEmpid, skill: memSkill, proficiency: memProf },
  //     json: true };


  //   request(options, function (error, response, body) {
  //     if (error) throw new Error(error);

  //     console.log(body);
  //     console.log("Updated");

  //     res.send({
  //       replies: [{
  //         type: 'text',
  //         content: 'Record Updated',
  //       }], 
  //       conversation: {
  //         memory: { key: 'value' }
  //       }
  //     })
  //   });
    

  // }
  // else if(skill & proficiency){
  //   // createURL(memSkill,memProf);

  //   if(memProf == "all"){
  //     url = url + '?q={"skill": "' + memSkill + '"}';
  //   }
  //   else{
  //     url = url + '?q={"skill": "' + memSkill + '", "proficiency": "' + memProf + '"}'; 
  //   }
  //   console.log("url:",url);

  //   // connecting with restdb.io
  //   var options = { method: 'GET',
  //     url: url,
  //     headers: 
  //      { 'cache-control': 'no-cache',
  //        'x-apikey': apiKey } };

  //   //sending request to restdb.io 
  //   request(options, function (error, response, body) {
  //     if (error) throw new Error(error);

  //     // console.log("db",body);
  //     dbResponse = JSON.parse(body);
  //     console.log("len",dbResponse.length);
  //     cont = 'Number of employees who know ' + memSkill + ' with proficiency ' + memProf + ' are ' + dbResponse.length + '.';
      
  //     res.send({
  //       replies: [{
  //         type: 'text',
  //         content: cont,
  //       }], 
  //       conversation: {
  //         memory: { key: 'value' }
  //       }
  //     })

  //   });

  // }
  // else if(empoyee_no){
    
  //   url = url + '?q={"Employee_No": "' + memSkill + '"}'; 
  //   console.log("url:",url);

  //   // connecting with restdb.io
  //   var options = { method: 'GET',
  //     url: url,
  //     headers: 
  //      { 'cache-control': 'no-cache',
  //        'x-apikey': apiKey } };

  // }
  // else if(employee_name){

  //   url = url + '?q={"Employee_Name": "' + memSkill + '"}'; 
  //   console.log("url:",url);

  //   // connecting with restdb.io
  //   var options = { method: 'GET',
  //     url: url,
  //     headers: 
  //      { 'cache-control': 'no-cache',
  //        'x-apikey': apiKey } };
  // }

})

  
app.post('/errors', (req, res) => {
  console.log(req.body) 
  res.send() 
}) 


app.listen(port, () => { 
  console.log('Server is running on port 5000') 
})