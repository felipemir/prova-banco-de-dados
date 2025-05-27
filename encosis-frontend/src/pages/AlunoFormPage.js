// src/pages/AlunoFormPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const ALUNOS_STORAGE_KEY = 'alunos';

function AlunoFormPage() {
  const navigate = useNavigate();
  const { id: alunoId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isViewMode = queryParams.get('view') === 'true'; // For disabling form in view mode

  const isEditMode = Boolean(alunoId) && !isViewMode;
  const pageTitle = isViewMode ? 'Visualizar Aluno' : (isEditMode ? 'Editar Aluno' : 'Novo Aluno');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Aluno';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [dataCadastro, setDataCadastro] = useState('');


  useEffect(() => {
    if (alunoId) { // For both Edit and View mode
      const alunos = getLocalStorage(ALUNOS_STORAGE_KEY);
      const alunoToLoad = alunos.find(a => String(a.id) === String(alunoId));
      if (alunoToLoad) {
        setFormData({
          nome: alunoToLoad.nome,
          email: alunoToLoad.email,
          telefone: alunoToLoad.telefone || '', // Handle if telefone is undefined
        });
        setDataCadastro(alunoToLoad.dataCadastro || '');
      } else {
        alert('Aluno não encontrado!');
        navigate('/alunos');
      }
    }
  }, [alunoId, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isViewMode) return; // Do nothing on submit if in view mode

    const alunos = getLocalStorage(ALUNOS_STORAGE_KEY);
    let updatedAlunos;

    if (isEditMode) {
      updatedAlunos = alunos.map(aluno =>
        String(aluno.id) === String(alunoId) ? { ...aluno, ...formData, dataCadastro } : aluno // Keep original dataCadastro
      );
      alert('Aluno atualizado com sucesso!');
    } else { // Create mode
      const novoAluno = {
        id: Date.now(),
        ...formData,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
      };
      updatedAlunos = [...alunos, novoAluno];
      alert('Aluno cadastrado com sucesso!');
    }

    setLocalStorage(ALUNOS_STORAGE_KEY, updatedAlunos);
    navigate('/alunos');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: '500px' }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
          {pageTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
          {isViewMode ? 'Detalhes do aluno.' : (isEditMode ? 'Atualize os dados do aluno.' : 'Preencha os dados para cadastrar um novo aluno.')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome completo"
            name="nome"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.nome}
            onChange={handleChange}
            required={!isViewMode}
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required={!isViewMode}
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Telefone"
            name="telefone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.telefone}
            onChange={handleChange}
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
          />
          {alunoId && ( // Show Data de Cadastro only in edit or view mode
             <TextField
                label="Data de Cadastro"
                name="dataCadastro"
                variant="outlined"
                fullWidth
                margin="normal"
                value={dataCadastro}
                disabled // Always disabled
                InputLabelProps={{ shrink: true }}
            />
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/alunos')}
              sx={{ mr: 2, textTransform: 'none' }}
            >
              {isViewMode ? 'Voltar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#0D1B2A',
                  '&:hover': { backgroundColor: '#1E3A5F' },
                  textTransform: 'none'
                }}
              >
                {submitButtonText}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default AlunoFormPage;