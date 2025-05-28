// src/pages/OficinaFormPage.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
// import { getLocalStorage, setLocalStorage, generateUniqueId } from '../utils/localStorage'; // Remover localStorage

// const OFICINAS_STORAGE_KEY = 'oficinas'; // Não é mais necessário

const API_URL = 'http://localhost:3000';

function OficinaFormPage() {
  const navigate = useNavigate();
  const { id: itemId } = useParams(); // ID da oficina para edição/visualização
  const location = useLocation();
  const isViewMode = new URLSearchParams(location.search).get('view') === 'true';
  const isEditMode = Boolean(itemId) && !isViewMode;

  const pageTitle = isViewMode ? 'Visualizar Oficina' : (isEditMode ? 'Editar Oficina' : 'Nova Oficina');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Oficina';

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    carga_horaria: '',
    data_inicio: '', // Formato YYYY-MM-DD para input type="date"
    data_fim: '',    // Formato YYYY-MM-DD para input type="date"
    vagas_total: '',
    local: '',
    materiais_necessarios: '',
    professor_id: '' // Para armazenar o ID do professor selecionado
  });

  const [professores, setProfessores] = useState([]);
  const [loadingProfessores, setLoadingProfessores] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [dataCadastro, setDataCadastro] = useState(''); // Gerenciado pelo backend ou não exibido no form de criação

  useEffect(() => {
    const fetchProfessores = async () => {
      setLoadingProfessores(true);
      try {
        const response = await axios.get(`${API_URL}/professores`);
        setProfessores(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
        alert("Não foi possível carregar a lista de professores.");
      } finally {
        setLoadingProfessores(false);
      }
    };

    fetchProfessores();

    if (itemId && (isEditMode || isViewMode)) {
      const fetchOficinaData = async () => {
        // Para edição/visualização, você precisará de uma rota GET /oficinas/:id
        setIsSubmitting(true); // Reutilizar para indicar carregamento de dados da oficina
        try {
          const response = await axios.get(`${API_URL}/oficinas/${itemId}`); // ROTA A SER CRIADA NO BACKEND
          const oficina = response.data;
          setFormData({
            titulo: oficina.titulo,
            descricao: oficina.descricao,
            carga_horaria: oficina.carga_horaria.toString(), // Ajuste conforme o tipo esperado pelo input
            data_inicio: oficina.data_inicio ? new Date(oficina.data_inicio).toISOString().split('T')[0] : '',
            data_fim: oficina.data_fim ? new Date(oficina.data_fim).toISOString().split('T')[0] : '',
            vagas_total: oficina.vagas_total.toString(),
            local: oficina.local,
            materiais_necessarios: oficina.materiais_necessarios || '',
            professor_id: oficina.professor_id.toString()
          });
          // setDataCadastro(new Date(oficina.dataCadastro).toLocaleDateString('pt-BR'));
        } catch (error) {
          console.error("Erro ao buscar dados da oficina:", error);
          alert("Oficina não encontrada ou erro ao carregar dados.");
          navigate('/oficinas');
        } finally {
          setIsSubmitting(false);
        }
      };
      fetchOficinaData();
    }
  }, [itemId, isEditMode, isViewMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;
    setIsSubmitting(true);

    // Validar se professor_id foi selecionado
    if (!formData.professor_id) {
        alert('Por favor, selecione um professor para a oficina.');
        setIsSubmitting(false);
        return;
    }
    
    // Ajustar tipos de dados se necessário antes de enviar
    const payload = {
        ...formData,
        carga_horaria: parseInt(formData.carga_horaria, 10),
        vagas_total: parseInt(formData.vagas_total, 10),
        professor_id: parseInt(formData.professor_id, 10),
        // data_inicio e data_fim já devem estar no formato YYYY-MM-DD
    };

    try {
      if (isEditMode) {
        // Lógica para ATUALIZAR oficina (precisa da rota PUT /oficinas/:id no backend)
        await axios.put(`${API_URL}/oficinas/${itemId}`, payload);
        alert('Oficina atualizada com sucesso!');
      } else {
        // Lógica para CRIAR nova oficina
        const response = await axios.post(`${API_URL}/oficinas/cadastro`, payload); //
        console.log('Oficina cadastrada:', response.data);
        alert('Oficina criada com sucesso!');
      }
      navigate('/oficinas');
    } catch (error) {
      console.error('Erro ao salvar oficina:', error.response ? error.response.data : error.message);
      alert(`Erro ao salvar oficina: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>{pageTitle}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
          {isViewMode ? 'Detalhes da oficina.' : (isEditMode ? 'Atualize os dados da oficina.' : 'Preencha os dados para uma nova oficina.')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Título da Oficina" name="titulo" value={formData.titulo} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Descrição" name="descricao" value={formData.descricao} onChange={handleChange} disabled={isViewMode} required multiline rows={3} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <TextField label="Carga Horária (horas)" name="carga_horaria" type="number" value={formData.carga_horaria} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Vagas Totais" name="vagas_total" type="number" value={formData.vagas_total} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <TextField label="Data de Início" name="data_inicio" type="date" value={formData.data_inicio} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Data de Fim" name="data_fim" type="date" value={formData.data_fim} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          </Box>

          <TextField label="Local" name="local" value={formData.local} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Materiais Necessários (opcional)" name="materiais_necessarios" value={formData.materiais_necessarios} onChange={handleChange} disabled={isViewMode} multiline rows={2} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

          <FormControl fullWidth margin="normal" required disabled={isViewMode || loadingProfessores}>
            <InputLabel id="professor-select-label">Professor Responsável</InputLabel>
            <Select
              labelId="professor-select-label"
              name="professor_id"
              value={formData.professor_id}
              label="Professor Responsável"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>{loadingProfessores ? 'Carregando professores...' : 'Selecione um professor'}</em>
              </MenuItem>
              {!loadingProfessores && professores.map((prof) => (
                <MenuItem key={prof.id} value={prof.id.toString()}>
                  {prof.nome}
                </MenuItem>
              ))}
            </Select>
            {loadingProfessores && <CircularProgress size={20} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-10px', marginLeft: '-10px' }} />}
          </FormControl>

          {/* {itemId && <TextField label="Data de Cadastro" name="dataCadastro" value={dataCadastro} disabled fullWidth margin="normal" InputLabelProps={{ shrink: true }} />} */}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/oficinas')} sx={{ mr: 2, textTransform: 'none' }}>{isViewMode ? 'Voltar' : 'Cancelar'}</Button>
            {!isViewMode && <Button type="submit" variant="contained" disabled={isSubmitting || loadingProfessores} sx={{backgroundColor: '#0D1B2A', '&:hover': {backgroundColor: '#1E3A5F'}, textTransform: 'none'}}>{isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}</Button>}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default OficinaFormPage;