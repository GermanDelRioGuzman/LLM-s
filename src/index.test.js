const index = require('./index');

test('Funcion 1: guardar mensaje en la base de datos', () => {
    const resultado = index.saveMessage('input', 'input');
    expect(resultado).toBe('mensaje guardado');
    });

test('Funcion 2: main', () => {
    const resultado = index.main();
    expect(resultado).toBe('Server is running on port http://localhost:3000');
    });
    