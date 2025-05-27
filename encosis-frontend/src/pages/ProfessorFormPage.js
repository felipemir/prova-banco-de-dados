// src/pages/ProfessorFormPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const PROFESSORES_STORAGE_KEY = 'professores';

function ProfessorFormPage() {
  const navigate = useNavigate();
  const { id: itemId } = useParams();
  const location = useLocation();
  const isViewMode = new URLSearchParams(location.search).get('view') === 'true';
  const isEditMode = Boolean(itemId) && !isViewMode;

  const pageTitle = isViewMode ? 'Visualizar Professor' : (isEditMode ? 'Editar Professor' : 'Novo Professor');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Professor';

  const [formData, setFormData] = useState({
    nome: '', email: '', especialidade: ''
  });
  const [dataCadastro, setDataCadastro] = useState('');

  useEffect(() => {
    if (itemId) {
      const items = getLocalStorage(PROFESSORES_STORAGE_KEY);
      const itemToLoad = items.find(i => String(i.id) === String(itemId));
      if (itemToLoad) {
        setFormData({
            nome: itemToLoad.nome,
            email: itemToLoad.email,
            especialidade: itemToLoad.especialidade,
        });
        setDataCadastro(itemToLoad.dataCadastro || '');
      } else {
        alert('Professor não encontrado!'); navigate('/professores');
      }
    }
  }, [itemId, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    const items = getLocalStorage(PROFESSORES_STORAGE_KEY);
    let updatedItems;

    if (isEditMode) {
      updatedItems = items.map(item =>
        String(item.id) === String(itemId) ? { ...item, ...formData, dataCadastro } : item
      );
      alert('Professor atualizado!');
    } else {
      const newItem = { id: Date.now(), ...formData, dataCadastro: new Date().toLocaleDateString('pt-BR') };
      updatedItems = [...items, newItem];
      alert('Professor criado!');
    }
    setLocalStorage(PROFESSORES_STORAGE_KEY, updatedItems);
    navigate('/professores');
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