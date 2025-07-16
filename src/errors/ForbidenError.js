module.exports = function ValidationError(
  message = 'Este recurso não pertence a este usuario'
) {
  this.name = 'ForbidenError';
  this.message = message;
}
