// src/pages/ProfessorFormPage.js
import  { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

//const PROFESSORES_STORAGE_KEY = 'professores';

const API_URL = 'backend-banco-de-dados-production.up.railway.app';

function ProfessorFormPage() {
  const navigate = useNavigate();
  const { id: itemId } = useParams(); // 'itemId' é usado aqui, pode ser renomeado para 'professorId' para clareza
  const location = useLocation();
  const isViewMode = new URLSearchParams(location.search).get('view') === 'true';
  const isEditMode = Boolean(itemId) && !isViewMode;

  const pageTitle = isViewMode ? 'Visualizar Professor' : (isEditMode ? 'Editar Professor' : 'Novo Professor');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Professor';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    especialidade: '',
    biografia: '', // Adicionado campo biografia
    telefone: ''   // Adicionado campo telefone
  });
  const [dataCadastro] = useState(''); // Mantido para exibição, mas não enviado na criação

  useEffect(() => {
    if (itemId && (isEditMode || isViewMode)) { // Apenas se for editar ou visualizar
      const fetchProfessor = async () => {
        try {
          // Você precisará de uma rota GET /professores/:id no backend para popular o formulário para edição/visualização
          const response = await axios.get(`${API_URL}/professores/${itemId}`); // Supondo que essa rota exista
          setFormData({
            nome: response.data.nome,
            email: response.data.email,
            especialidade: response.data.especialidade,
            biografia: response.data.biografia || '', // Adicionado
            telefone: response.data.telefone || ''    // Adicionado
          });
          // Se o backend retornar data_cadastro, você pode armazená-la também para exibição
          // setDataCadastro(new Date(response.data.data_cadastro).toLocaleDateString('pt-BR'));
        } catch (error) {
          console.error('Erro ao buscar dados do professor:', error);
          alert('Professor não encontrado!');
          navigate('/professores');
        }
      };
      fetchProfessor();
    }
    // Para o modo de criação, o formulário começa com os valores iniciais de useState
  }, [itemId, isEditMode, isViewMode, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => { // Transforme a função em async
    e.preventDefault();
    if (isViewMode) return; // Não faz nada se estiver em modo de visualização

    // Dados a serem enviados para o backend, incluindo os novos campos
    const professorData = {
      nome: formData.nome,
      email: formData.email,
      especialidade: formData.especialidade,
      biografia: formData.biografia, // Inclua o campo biografia
      telefone: formData.telefone    // Inclua o campo telefone
    };

    try {
      if (isEditMode) {
        // LÓGICA DE EDIÇÃO (UPDATE) - Você precisará de uma rota PUT/PATCH no backend
        // await axios.put(`${API_URL}/professores/${itemId}`, professorData);
        // alert('Professor atualizado com sucesso!');
        console.warn('Funcionalidade de edição de professor ainda não implementada completamente com backend.');
        alert('Edição de professor via API ainda não implementada.');
      } else {
        // MODO DE CRIAÇÃO (POST)
        // A rota no seu backend é '/professores/cadastro'
        const response = await axios.post(`${API_URL}/professores/cadastro`, professorData);
        console.log('Professor cadastrado:', response.data);
        alert('Professor criado com sucesso!');
      }
      navigate('/professores'); // Redireciona para a lista de professores após sucesso
    } catch (error) {
      console.error('Erro ao salvar professor:', error.response ? error.response.data : error.message);
      alert(`Erro ao salvar professor: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: '500px' }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>{pageTitle}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
            {isViewMode ? 'Detalhes do professor.' : (isEditMode ? 'Atualize os dados do professor.' : 'Preencha os dados para um novo professor.')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nome Completo" name="nome" fullWidth margin="normal" value={formData.nome} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          <TextField label="Especialidade" name="especialidade" fullWidth margin="normal" value={formData.especialidade} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          {/* Adicionado TextField para Biografia */}
          <TextField
            label="Biografia"
            name="biografia"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.biografia}
            onChange={handleChange}
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
            // required={!isViewMode} // Defina como obrigatório se necessário
          />
          {/* Adicionado TextField para Telefone */}
          <TextField
            label="Telefone"
            name="telefone"
            fullWidth
            margin="normal"
            value={formData.telefone}
            onChange={handleChange}
            disabled={isViewMode}
            InputLabelProps={{ shrink: true }}
            // required={!isViewMode} // Defina como obrigatório se necessário
          />
          {/* A Data de Cadastro é gerenciada pelo backend (ou localStorage no exemplo original)
              Se for exibir no modo de edição/visualização, deve vir da API */}
          {itemId && <TextField label="Data de Cadastro" name="dataCadastro" fullWidth margin="normal" value={dataCadastro} disabled InputLabelProps={{ shrink: true }} />}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/professores')} sx={{ mr: 2, textTransform: 'none' }}>{isViewMode ? 'Voltar' : 'Cancelar'}</Button>
            {!isViewMode && <Button type="submit" variant="contained" sx={{backgroundColor: '#0D1B2A', '&:hover': {backgroundColor: '#1E3A5F'}, textTransform: 'none'}}>{submitButtonText}</Button>}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default ProfessorFormPage;