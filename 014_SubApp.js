var express = require('express');
var port = 8080; 
var fs = require('fs');
var path = require('path');
var catalog = 'data';
var bodyparser = require('body-parser');

// вложенные приложения используются для маршрутизации 
var app = express(); // главное приложение
var login = express(); // вложенное приложение 
var register = express(); 


const par=bodyparser.urlencoded({extended:false,});//не наследуется



// компонент  express.static() указывает на каталог с файлами
app.use('/', express.static(path.join(__dirname ,catalog)));





app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, catalog, 'index.html'));
}); 

register.get('/', function (req, res) {
	console.log(register.mountpath); // /user 
	res.sendFile(path.join(__dirname, catalog, 'register.html'));
}); 


login.get('/', function (req, res) { 
  // свойство mountpath содержить текущий путь маршрутизации(route) 
  console.log(login.mountpath); // /admin
  res.sendFile(path.join(__dirname, catalog, 'login.html'));
}); 


register.post('/', par,function(req, res){
  
	let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let address = req.body.address;
    let age = req.body.age;
    let country = req.body.country;
    let zip = req.body.zip;
    let gender = req.body.gender;
    let languages = req.body.language; 
    let about = req.body.about;
  
	let user = {
        login,
        email,
        password,
        name,
        address,
        age,
        country,
        zip,
        gender,
        languages,
        about
    };
   
    console.log('File writing...');
    fs.writeFile('register.txt', JSON.stringify(user) + '\n', function(err) {
    if(err){
        console.log(err);
        return;
    }
    console.log('File was wrote!');
 });
 res.send('<h1>'+'OK'+'</h1>');
});




login.post('/',par, function(req, res){
	let login=req.body.login;
    
    let password=req.body.password;
  
	if(fs.existsSync(__dirname))
        {
            fs.readFile('register.txt', {encoding : 'utf-8'}, function(err, data){
                if(err){
                    console.log(err);
                    res.send('<h1>404</h1>');
                    return;
                }
                const users = [];

                data.split('\n').forEach(line => {
                    if (line) {
                            users.push(JSON.parse(line));
                       
                    }
                });
    

                let curUser;
            
                for (let i = 0; i < users.length; i++) {
                if (users[i].login === login  && users[i].password === password) {
                curUser = users[i];
                break;
                }
              }

              if (curUser) {
                console.log('User authorized');
				res.send('<h1>'+'OK'+'</h1>');
				console.log('File writing...');
				fs.appendFile('login.txt', `${curUser.login},${curUser.password}\n`, function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('File was wrote!');
                });
              }
              else{
                console.log('User NOT authorized');
                res.send('<h1>'+'Registr first!'+'</h1>');
              }
              
            });
           
        }
        else
        {
            console.log("No file");
        }
});


















// событие mount генерируется, когда происходит привязка дочернего(вложенного) 
// приложения к родительскому 
register.on('mount', function() {
	console.log('user mounted'); 
}); 
login.on('mount', function() {
	console.log('admin mounted'); 
}); 


// связывание главного приложения со вложенным 
app.use('/login', login); 
app.use('/register', register); 

app.get('*', function(req, res){
	res.send('<h1>404</h1>');
});


app.listen(port, function() {
	console.log('app running on port ' + port); 
}); 