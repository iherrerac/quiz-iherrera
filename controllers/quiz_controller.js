var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
  where: { id: Number(quizId) },
  include: [{ model: models.Comment }]
    }).then(
    function(quiz) {
      if (quiz) {
  req.quiz = quiz;
  next();
      } else { next(new Error('No existe quizId= ' + quizId)); }
    } 
  ).catch(function(error) { next(error); } );
};

// GET /quizes         (Variable filtro para la busqueda)  
exports.index = function(req, res) {
  var filtro = { };
  if(req.query.search){
    search = req.query.search;
    search = search.split(" ").join("%");
    search = "%" + search + "%";
    filtro = {
      where: ["lower(pregunta) like lower(?)", search],
      order: [["pregunta", "ASC"]]
    };
  }

  models.Quiz.findAll(filtro).then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, errors: []});
  }).catch(function(error) { next(error);})
};


/*//GET/quizes/
exports.index= function(req,res){
    models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes});
  })
 };*/  


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