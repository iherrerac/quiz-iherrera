var models = require('../models/models.js');


// Autoload - factoriza el código si ruta incluye :quizID
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId= ' + quizId)); }  
    }
  ).catch(function(error) { next(error);});
};


// GET /quizes
exports.index = function(req, res) {
  var options = {};
   
  models.Quiz.findAll(options).then(
    function(quizes) {
      if (req.query.search !== undefined) {
          //console.log("Primero: "+req.query.search);
          req.query.search = req.query.search.replace(/^| |$/g,'%');
          //console.log("Despues: "+req.query.search);
          models.Quiz.findAll({where: [ "lower(pregunta) like ?", req.query.search.toLowerCase()], order: [["pregunta"]]}).then(
            function(quizes){
                    res.render('quizes/index.ejs', {quizes: quizes});
              });
      }else {
          res.render('quizes/index.ejs', {quizes: quizes});          //order: [['name', 'DESC']]
        }
    }
    ).catch(function(error) { next(error)});
 
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET  /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};


/*//GET/quizes/
exports.index= function(req,res){
    models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes});
  })
 };*/  

/*
// GET /quizes/:id
exports.show = function (req,res){
models.Quiz.findById(req.params.quizId).then(function(quiz) {
res.render('quizes/show', {quiz: req.quiz});
  })
};


//GET /quizes/answer
exports.answer = function(req, res){
models.Quiz.findById(req.params.quizId).then(function(quiz){
	if (req.query.respuesta === quiz[0].respuesta) {
       res.render('quizes/answer', {respuesta : 'Cooooorrecto ¡¡'});
       }else{
       res.render('quizes/answer', {respuesta : 'Incorrecto'});
      }
  })
};
*/