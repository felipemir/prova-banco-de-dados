const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



app.get('/alunos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        a.nome, 
        a.email, 
        a.telefone, 
        a.instituicao, 
        a.data_cadastro,  -- Certifique-se que este campo existe ou ajuste a query
        GROUP_CONCAT(o.titulo SEPARATOR ', ') as oficinas_inscritas
      FROM alunos a
      LEFT JOIN alunos_oficinas ao ON a.id = ao.aluno_id
      LEFT JOIN oficinas o ON ao.oficina_id = o.id
      GROUP BY a.id, a.nome, a.email, a.telefone, a.instituicao, a.data_cadastro  -- Inclua todos os campos selecionados de 'a'
      ORDER BY a.nome;
    `);
    // Mapeia para garantir que oficinas_inscritas seja null se não houver inscrições, em vez de uma string vazia do GROUP_CONCAT
    const alunosComOficinas = rows.map(aluno => ({
      ...aluno,
      oficinas_inscritas: aluno.oficinas_inscritas || null 
    }));
    res.json(alunosComOficinas);
  } catch (err) {
    console.error('Erro ao buscar alunos com oficinas:', err);
    res.status(500).json({ error: 'Erro ao buscar alunos com oficinas' });
  }
});

// Rota para cadastrar aluno
app.post('/alunos/cadastro', async (req, res) => {
  const { nome, email, telefone, instituicao } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO alunos (nome, email, telefone, instituicao) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, instituicao]
    );
    res.status(201).json({ id: result.insertId, nome, email, telefone, instituicao });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});


// Rota para buscar aluno por ID
app.get('/alunos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alunos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Aluno não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});



// Rota para excluir aluno por ID
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  try {
    const [result] = await pool.query('DELETE FROM alunos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      // Se nenhuma linha foi afetada, o aluno com esse ID não foi encontrado
      return res.status(404).json({ error: 'Aluno não encontrado para exclusão' });
    }
    // Se chegou aqui, o aluno foi excluído com sucesso
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
    // Alternativamente, para DELETE, é comum retornar status 204 No Content sem corpo na resposta:
    // res.status(204).send();
  } catch (err) {
    console.error('Erro ao excluir aluno:', err);
    res.status(500).json({ error: 'Erro ao excluir aluno' });
  }
});

//rota para cadastrar professores 

app.post('/professores/cadastro', async(req, res) => {
    const {nome , email, especialidade, biografia, telefone} = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO professores (nome, email, especialidade, biografia, telefone) VALUES (?, ?, ?, ?, ?)',
            [nome, email, especialidade, biografia, telefone]
        );
        res.status(201).json({ id: result.insertId, nome, email, especialidade, biografia, telefone });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao cadastrar professor' });
    }
});


app.delete('/professores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM professores WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professor não encontrado para exclusão' });
    }
    res.status(200).json({ message: 'Professor excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir professor:', err);
    res.status(500).json({ error: 'Erro ao excluir professor' });
  }
});

//rota para buscar os professores cadastrados

app.get('/professores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM professores');
    res.json(rows);
  } catch (err) {
    // É uma boa prática logar o erro no console do servidor também
    console.error('Erro ao buscar professores:', err); 
    res.status(500).json({ error: 'Erro ao buscar professores' });
  }
});


// Rota para inscrever aluno em oficina
app.post('/alunos/oficinas/inscrever', async (req, res) => {
  // Os IDs do aluno e da oficina viriam no corpo da requisição
  const { aluno_id, oficina_id } = req.body;
  // A data de inscrição pode ser gerada automaticamente no momento da inserção
  // presenca e certificado_emitido podem ser definidos como NULL ou um valor padrão (ex: false) inicialmente

  // Validação básica para garantir que os IDs foram fornecidos
  if (!aluno_id || !oficina_id) {
    return res.status(400).json({ error: 'ID do aluno e ID da oficina são obrigatórios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO alunos_oficinas (aluno_id, oficina_id, data_inscricao) VALUES (?, ?, NOW())',
      [aluno_id, oficina_id]
    );
    // Retorna o ID da inscrição criada e os dados inseridos
    res.status(201).json({
      inscricao_id: result.insertId,
      aluno_id,
      oficina_id,
      data_inscricao: new Date().toISOString(), // Aproximação da data inserida com NOW()
      presenca: null, // Valor inicial padrão
      certificado_emitido: null // Valor inicial padrão
    });
  } catch (err) {
    console.error(err); // É bom logar o erro no servidor para debugging
    // Verifica erros comuns como chave estrangeira não encontrada
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Aluno ou Oficina não encontrado com o ID fornecido.' });
    }
    res.status(500).json({ error: 'Erro ao inscrever aluno na oficina' });
  }
});



// ROTA PARA LISTAR TODAS AS OFICINAS (NOVO)
app.get('/oficinas', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id, 
        o.titulo, 
        o.vagas_disponiveis, 
        o.data_inicio, 
        o.data_fim,
        p.nome as professor_nome 
      FROM oficinas o
      LEFT JOIN professores p ON o.professor_id = p.id
      ORDER BY o.titulo
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar oficinas:', err);
    res.status(500).json({ error: 'Erro ao buscar oficinas' });
  }
});

// Em prova-banco-de-dados/index.js
app.delete('/oficinas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // ANTES DE EXCLUIR A OFICINA, VOCÊ PRECISA EXCLUIR AS REFERÊNCIAS A ELA
    // na tabela alunos_oficinas, devido à restrição de chave estrangeira.
    await pool.query('DELETE FROM alunos_oficinas WHERE oficina_id = ?', [id]);
    
    const [result] = await pool.query('DELETE FROM oficinas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Oficina não encontrada para exclusão' });
    }
    res.status(200).json({ message: 'Oficina e inscrições associadas excluídas com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir oficina:', err);
    res.status(500).json({ error: 'Erro ao excluir oficina' });
  }
});


// Rota para inscrever aluno em palestra
app.post('/alunos/palestras/inscrever', async (req, res) => {
  // Os IDs do aluno e da palestra viriam no corpo da requisição
  const { aluno_id, palestra_id } = req.body;
  // A data de inscrição pode ser gerada automaticamente
  // presenca pode ser definida como NULL ou um valor padrão (ex: false) inicialmente

  // Validação básica para garantir que os IDs foram fornecidos
  if (!aluno_id || !palestra_id) {
    return res.status(400).json({ error: 'ID do aluno e ID da palestra são obrigatórios' });
  }

  try {
    // Note que não inserimos 'certificado_emitido' pois não existe na tabela alunos_palestras
    const [result] = await pool.query(
      'INSERT INTO alunos_palestras (aluno_id, palestra_id, data_inscricao, presenca) VALUES (?, ?, NOW(), ?)',
      [aluno_id, palestra_id, null] // Assumindo que 'presenca' pode ser NULL inicialmente ou false
      // Se 'presenca' for para ser false por padrão: [aluno_id, palestra_id, false]
      // Se a coluna 'presenca' no banco tiver um DEFAULT, você pode omiti-la da query:
      // 'INSERT INTO alunos_palestras (aluno_id, palestra_id, data_inscricao) VALUES (?, ?, NOW())'
      // e passar: [aluno_id, palestra_id]
    );
    // Retorna o ID da inscrição criada e os dados inseridos
    res.status(201).json({
      inscricao_id: result.insertId,
      aluno_id,
      palestra_id,
      data_inscricao: new Date().toISOString(), // Aproximação da data inserida com NOW()
      presenca: null // Valor inicial padrão, ajuste conforme a definição da sua tabela
    });
  } catch (err) {
    console.error(err); // É bom logar o erro no servidor para debugging
    // Verifica erros comuns como chave estrangeira não encontrada
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Aluno ou Palestra não encontrado com o ID fornecido.' });
    }
    res.status(500).json({ error: 'Erro ao inscrever aluno na palestra' });
  }
});



// Rota para cadastrar oficina
app.post('/oficinas/cadastro', async (req, res) => {
  const {
    titulo,
    descricao,
    carga_horaria,
    data_inicio,
    data_fim,
    vagas_total,
    local,
    materiais_necessarios,
    professor_id // ID do professor que virá da tabela 'professores'
  } = req.body;

  // Validação básica
  if (!titulo || !descricao || !carga_horaria || !data_inicio || !data_fim || !vagas_total || !local || !professor_id) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios, incluindo professor_id, devem ser fornecidos para a oficina.' });
  }

  try {
    // Assumindo que vagas_disponiveis será igual a vagas_total no momento do cadastro
    const vagas_disponiveis = vagas_total;

    const [result] = await pool.query(
      'INSERT INTO oficinas (titulo, descricao, carga_horaria, data_inicio, data_fim, vagas_total, vagas_disponiveis, local, materiais_necessarios, professor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, carga_horaria, data_inicio, data_fim, vagas_total, vagas_disponiveis, local, materiais_necessarios, professor_id]
    );
    res.status(201).json({
      id: result.insertId, // ID da oficina recém-criada
      titulo,
      descricao,
      carga_horaria,
      data_inicio,
      data_fim,
      vagas_total,
      vagas_disponiveis,
      local,
      materiais_necessarios,
      professor_id // Retornando o ID do professor associado
    });
  } catch (err) {
    console.error(err);
    // Tratamento de erro para chave estrangeira (se professor_id não existir na tabela professores)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Professor com o ID fornecido não encontrado para associar à oficina.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar oficina' });
  }
});



// Rota para cadastrar palestras 

app.post('/palestras/cadastro', async (req, res) => {
  const {
    titulo,
    descricao,
    professor_id, // Alterado de 'palestrante' para 'professor_id'
    data_hora,
    local,
    capacidade
  } = req.body;

  // Validação básica - agora verificamos professor_id
  if (!titulo || !descricao || !professor_id || !data_hora || !local || !capacidade) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios, incluindo professor_id, devem ser fornecidos para a palestra.' });
  }

  try {
    // A query SQL agora insere 'professor_id' na coluna 'professor_id'
    const [result] = await pool.query(
      'INSERT INTO palestras (titulo, descricao, professor_id, data_hora, local, capacidade) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao, professor_id, data_hora, local, capacidade]
    );
    res.status(201).json({
      id: result.insertId, // ID da palestra recém-criada
      titulo,
      descricao,
      professor_id, // Retornando o professor_id
      data_hora,
      local,
      capacidade
    });
  } catch (err) {
    console.error(err);
    // Tratamento de erro para chave estrangeira (se professor_id não existir na tabela professores)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Professor com o ID fornecido não encontrado para associar à palestra.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar palestra' });
  }
});
















































































// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
