const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rota para listar alunos
app.get('/alunos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alunos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
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

// Rota para inscrever aluno em minicurso
app.post('/alunos/minicursos/inscrever', async (req, res) => {
  // Os IDs do aluno e do minicurso viriam no corpo da requisição
  const { aluno_id, minicurso_id } = req.body;
  // A data de inscrição pode ser gerada automaticamente no momento da inserção
  // presenca e certificado_emitido podem ser definidos como NULL ou um valor padrão (ex: false) inicialmente

  // Validação básica para garantir que os IDs foram fornecidos
  if (!aluno_id || !minicurso_id) {
    return res.status(400).json({ error: 'ID do aluno e ID do minicurso são obrigatórios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO alunos_minicursos (aluno_id, minicurso_id, data_inscricao) VALUES (?, ?, NOW())',
      [aluno_id, minicurso_id]
    );
    // Retorna o ID da inscrição criada e os dados inseridos
    res.status(201).json({
      inscricao_id: result.insertId,
      aluno_id,
      minicurso_id,
      data_inscricao: new Date().toISOString(), // Aproximação da data inserida com NOW()
      presenca: null, // Valor inicial padrão
      certificado_emitido: null // Valor inicial padrão
    });
  } catch (err) {
    console.error(err); // É bom logar o erro no servidor para debugging
    // Verifica erros comuns como chave estrangeira não encontrada
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Aluno ou Minicurso não encontrado com o ID fornecido.' });
    }
    res.status(500).json({ error: 'Erro ao inscrever aluno no minicurso' });
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


// Rota para cadastrar minicurso
app.post('/minicursos/cadastro', async (req, res) => {
  const {
    titulo,
    descricao,
    carga_horaria,
    data_inicio,
    data_fim,
    vagas_total,
    // vagas_disponiveis geralmente é igual a vagas_total no cadastro inicial
    local,
    pre_requisitos,
    professor_id // ID do professor que virá da tabela 'professores'
  } = req.body;

  // Validação básica
  if (!titulo || !descricao || !carga_horaria || !data_inicio || !data_fim || !vagas_total || !local || !professor_id) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios, incluindo professor_id, devem ser fornecidos.' });
  }

  try {
    // Assumindo que vagas_disponiveis será igual a vagas_total no momento do cadastro
    const vagas_disponiveis = vagas_total;

    const [result] = await pool.query(
      'INSERT INTO minicursos (titulo, descricao, carga_horaria, data_inicio, data_fim, vagas_total, vagas_disponiveis, local, pre_requisitos, professor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, carga_horaria, data_inicio, data_fim, vagas_total, vagas_disponiveis, local, pre_requisitos, professor_id]
    );
    res.status(201).json({
      id: result.insertId, // ID do minicurso recém-criado
      titulo,
      descricao,
      carga_horaria,
      data_inicio,
      data_fim,
      vagas_total,
      vagas_disponiveis,
      local,
      pre_requisitos,
      professor_id // Retornando o ID do professor associado
    });
  } catch (err) {
    console.error(err);
    // Tratamento de erro para chave estrangeira (se professor_id não existir na tabela professores)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ error: 'Professor com o ID fornecido não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar minicurso' });
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
