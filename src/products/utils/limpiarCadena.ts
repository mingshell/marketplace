var specialChars = '!@#$^&%*()+=[]/{}|:<>?,.';

export const limpiarCadena = cadena => {
  for (var i = 0; i < specialChars.length; i++) {
    cadena = cadena.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
  }
  return cadena;
};
