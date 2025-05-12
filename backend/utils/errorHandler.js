const errorHandler = (err, req, res, next) => {
  console.log('Ошибка: ', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if(err.code) {
    switch(err.code) {
    case '23505':
      statusCode = 400;
      message = 'Дублирование данных: запись с таким значенем уже существует';
      break;
    case '22P02':
      statusCode = 400;
      message = 'Некорректный формат данных';
      break;
    case '23503':
      statusCode = 400;
      message = 'Нарушение ссылочной целостности';
      break;
    case '42P01':
      statusCode = 500;
      message = 'Внутренняя оишбка сервера: таблица не существует';
      break;
    default:
      if(err.code.startsWith('42')) {
        statusCode = 500;
        message = 'Внутренняя ошибка сервера: таблица не существует';
      } else {
        statusCode = 403;
        message = 'Ошибка доступа к базе данных';
      }
    }
  }

  if(err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Неверный формат ID';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
}

module.exports = errorHandler;