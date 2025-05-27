
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
//import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import axios from 'axios';

//const ALUNOS_STORAGE_KEY = 'alunos';
const API_URL = 'http://localhost:3000';

function AlunoFormPage() {
  const navigate = useNavigate();
  const { id: alunoId } = useParams(); // Renomeie para alunoId para clareza se estiver usando para edição
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isViewMode = queryParams.get('view') === 'true';

  const isEditMode = Boolean(alunoId) && !isViewMode; // Se tiver alunoId e não for view mode, é edit mode
  const pageTitle = isViewMode ? 'Visualizar Aluno' : (isEditMode ? 'Editar Aluno' : 'Novo Aluno');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Aluno';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    instituicao: '', // Adicionado o campo instituição
  });
  //const [dataCadastro, setDataCadastro] = useState('');


   useEffect(() => {
    // Lógica para buscar dados do aluno se estiver no modo de edição ou visualização
    if (alunoId && (isEditMode || isViewMode)) {
      const fetchAluno = async () => {
        try {
          const response = await axios.get(`${API_URL}/alunos/${alunoId}`);
          setFormData({
            nome: response.data.nome,
            email: response.data.email,
            telefone: response.data.telefone || '',
            instituicao: response.data.instituicao || '', // Adicionado instituição
          });
        } catch (error) {
          console.error('Erro ao buscar dados do aluno:', error);
          alert('Aluno não encontrado!');
          navigate('/alunos');
        }
      };
      fetchAluno();
    }
    // Se for modo de criação (sem alunoId), o formulário começa vazio como definido no useState.
  }, [alunoId, isEditMode, isViewMode, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (event) => { // Transforma a função em async
    event.preventDefault();
    if (isViewMode) return; // Não faz nada se estiver em modo de visualização

    // Dados a serem enviados para o backend
    const alunoData = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      instituicao: formData.instituicao, // Inclua o campo instituição
    };

    try {
      if (isEditMode) {
        // LÓGICA DE EDIÇÃO (UPDATE) - Você precisará de uma rota PUT/PATCH no backend
        // await axios.put(`${API_URL}/alunos/${alunoId}`, alunoData);
        // alert('Aluno atualizado com sucesso!');
        // Por enquanto, vamos focar na criação. A edição exigirá uma rota de backend correspondente.
        console.warn('Funcionalidade de edição ainda não implementada completamente com backend.');
        alert('Edição via API ainda não implementada.');
      } else {
        // MODO DE CRIAÇÃO (POST)
        // A rota no seu backend é '/alunos/cadastro'
        const response = await axios.post(`${API_URL}/alunos/cadastro`, alunoData);
        console.log('Aluno cadastrado:', response.data); // response.data deve conter o aluno criado com o ID
        alert('Aluno cadastrado com sucesso!');
      }
      navigate('/alunos'); // Redireciona para a lista de alunos após sucesso
    } catch (error) {
      console.error('Erro ao salvar aluno:', error.response ? error.response.data : error.message);
      alert(`Erro ao salvar aluno: ${error.response?.data?.error || error.message}`);
      // Adicione um tratamento de erro mais sofisticado se necessário
    }
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
          {/* Campo Instituição */}
          <TextField
            label="Instituição"
            name="instituicao"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.instituicao}
            onChange={handleChange}
            required={!isViewMode} // Defina como obrigatório se necessário
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
          />
          {/* Data de Cadastro não é mais preenchida manualmente no formulário de criação,
              o backend irá gerar ou o banco de dados terá um valor padrão.
              Pode ser exibida no modo de edição/visualização se retornada pela API. */}
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