// Importamos el módulo 'models' para poder acceder a las tablas de la BBDD
var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res, next) {

	var numpreguntas = 0, numcomentarios = 0, mediacomentarios = 0,
		numpreguntassincomentarios = 0, numpreguntasconcomentarios = 0;

	// Función que construirá la respuesta en caso de que ocurriese algún error
	var errorResponse = function(error) {
		return res.render('quizes/statistics', { 
			numpreguntas: numpreguntas,
			numcomentarios: numcomentarios,
			mediacomentarios: mediacomentarios,
			numpreguntassincomentarios: numpreguntassincomentarios,
			numpreguntasconcomentarios: numpreguntasconcomentarios,
			errors: [error]
		});
	};

	// Calcular el número de preguntas
	models.Quiz.count()
	.then( function(num) {
		numpreguntas = num;

		// Calcular el número de comentarios
		models.Comment.count()
		.then( function(num) {
			numcomentarios = num;

			// Calcular la media de comentarios por pregunta
			if (numpreguntas > 0) {
				mediacomentarios = numcomentarios / numpreguntas;
			}

			// Calcular el número de preguntas con comentarios
			models.Quiz.findAll({
				include: [{ 
					model: models.Comment,
					required: true 
				}]
			})
			.then( function(quizes) {
				numpreguntasconcomentarios = quizes.length;

				// Calcular el número de preguntas sin comentarios
				models.Quiz.findAll()
				.then( function(quizes) {
					numpreguntassincomentarios = quizes.length - numpreguntasconcomentarios;

					// Construimos la respuesta
					res.render('quizes/statistics', { 
						numpreguntas: numpreguntas,
						numcomentarios: numcomentarios,
						mediacomentarios: mediacomentarios,
						numpreguntassincomentarios: numpreguntassincomentarios,
						numpreguntasconcomentarios: numpreguntasconcomentarios,
						errors: []
					});
				})
				.catch( function(error) { errorResponse(new Error('Error al obtener el número de preguntas sin comentarios.')); });
			})
			.catch( function(error) { errorResponse(new Error('Error al obtener el número de preguntas con comentarios.')); });
		})
		.catch( function(error) { errorResponse(new Error('Error al obtener el número de comentarios.')); });
	})
	.catch( function(error) { errorResponse(new Error('Error al obtener el número de preguntas.')); });

};
