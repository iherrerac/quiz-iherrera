        var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');


var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // only SQLite (.env)
    omitNull: true      // only Postgres
  }      
);

//importar definicion de la tabla quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));


exports.Quiz = Quiz;//exportar la definicion de la tabla quiz 


// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // sucess(..) ejecuta el manejador una vez creada la tabla
  
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create({id:1,pregunta: 'Capital de Italia',respuesta: 'Roma'})
      Quiz.create({id:2,pregunta: 'Capital de portugal',respuesta: 'lisboa'})
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});