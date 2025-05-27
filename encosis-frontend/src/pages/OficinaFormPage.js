// src/pages/OficinaFormPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const OFICINAS_STORAGE_KEY = 'oficinas';

function OficinaFormPage() {
  const navigate = useNavigate();
  const { id: itemId } = useParams();
  const location = useLocation();
  const isViewMode = new URLSearchParams(location.search).get('view') === 'true';
  const isEditMode = Boolean(itemId) && !isViewMode;

  const pageTitle = isViewMode ? 'Visualizar Oficina' : (isEditMode ? 'Editar Oficina' : 'Nova Oficina');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Oficina';

  const [formData, setFormData] = useState({
    nome: '', professor: '', cargaHoraria: '', vagas: ''
  });
  const [dataCriacao, setDataCriacao] = useState('');

  useEffect(() => {
    if (itemId) {
      const items = getLocalStorage(OFICINAS_STORAGE_KEY);
      const itemToLoad = items.find(i => String(i.id) === String(itemId));
      if (itemToLoad) {
        setFormData({
            nome: itemToLoad.nome,
            professor: itemToLoad.professor,
            cargaHoraria: itemToLoad.cargaHoraria,
            vagas: itemToLoad.vagas,
        });
        setDataCriacao(itemToLoad.dataCriacao || '');
      } else {
        alert('Oficina não encontrada!'); navigate('/oficinas');
      }
    }
  }, [itemId, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    const items = getLocalStorage(OFICINAS_STORAGE_KEY);
    let updatedItems;

    if (isEditMode) {
      updatedItems = items.map(item =>
        String(item.id) === String(itemId) ? { ...item, ...formData, dataCriacao } : item
      );
      alert('Oficina atualizada!');
    } else {
      const newItem = { id: Date.now(), ...formData, dataCriacao: new Date().toLocaleDateString('pt-BR') };
      updatedItems = [...items, newItem];
      alert('Oficina criada!');
    }
    setLocalStorage(OFICINAS_STORAGE_KEY, updatedItems);
    navigate('/oficinas');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: '500px' }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>{pageTitle}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
            {isViewMode ? 'Detalhes da oficina.' : (isEditMode ? 'Atualize os dados da oficina.' : 'Preencha os dados para uma nova oficina.')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nome da Oficina" name="nome" fullWidth margin="normal" value={formData.nome} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          <TextField label="Professor" name="professor" fullWidth margin="normal" value={formData.professor} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          <TextField label="Carga Horária" name="cargaHoraria" fullWidth margin="normal" value={formData.cargaHoraria} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          <TextField label="Vagas" name="vagas" fullWidth margin="normal" value={formData.vagas} onChange={handleChange} required={!isViewMode} disabled={isViewMode} InputLabelProps={{ shrink: true }} />
          {itemId && <TextField label="Data de Criação" name="dataCriacao" fullWidth margin="normal" value={dataCriacao} disabled InputLabelProps={{ shrink: true }} />}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/oficinas')} sx={{ mr: 2, textTransform: 'none' }}>{isViewMode ? 'Voltar' : 'Cancelar'}</Button>
            {!isViewMode && <Button type="submit" variant="contained" sx={{backgroundColor: '#0D1B2A', '&:hover': {backgroundColor: '#1E3A5F'}, textTransform: 'none'}}>{submitButtonText}</Button>}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default OficinaFormPage;