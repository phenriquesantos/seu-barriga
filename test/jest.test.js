// Principais funções do Jest

test('Devo conhecer as principais asertivas do jest', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Devo saber trabalhar com objetos', () => {
  const pessoa = {
    nome: 'João',
    idade: 20,
  };
  expect(pessoa).toHaveProperty('nome');
  expect(pessoa).toHaveProperty('idade', 20);
  expect(pessoa.nome).toBe('João');
  expect(pessoa.idade).toEqual(20);
});
