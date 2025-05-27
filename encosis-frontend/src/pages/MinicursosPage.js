// src/pages/MinicursosPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Box, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete, Search, Add } from '@mui/icons-material';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const MINICURSOS_STORAGE_KEY = 'minicursos';
const initialMinicursosData = [
    { id: 1674150000004, nome: 'Python para Iniciantes', professor: 'Alexandre Castro', cargaHoraria: '20h', vagas: '30 vagas', dataCriacao: '09/01/2024' },
    { id: 1674063600005, nome: 'Desenvolvimento Web Moderno', professor: 'Adriana Anthony', cargaHoraria: '25h', vagas: '25 vagas', dataCriacao: '10/01/2024' },
];

function MinicursosPage() {
  const [minicursos, setMinicursos] = useState(() => getLocalStorage(MINICURSOS_STORAGE_KEY, initialMinicursosData));
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalStorage(MINICURSOS_STORAGE_KEY, minicursos);
  }, [minicursos]);

  const filteredMinicursos = minicursos.filter(minicurso =>
    (minicurso.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (minicurso.professor?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => navigate(`/minicursos/editar/${id}?view=true`);
  const handleEdit = (id) => navigate(`/minicursos/editar/${id}`);
  const openDeleteDialog = (item) => { setItemToDelete(item); setDeleteDialogOpen(true); };
  const closeDeleteDialog = () => { setItemToDelete(null); setDeleteDialogOpen(false); };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setMinicursos(prev => prev.filter(m => m.id !== itemToDelete.id));
      closeDeleteDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Minicursos</Typography>
          <Typography variant="subtitle1" color="textSecondary">Gerencie os minicursos do ENCOSIS</Typography>
        </Box>
        <Button component={Link} to="/minicursos/novo" variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#0D1B2A', '&:hover': { backgroundColor: '#1E3A5F' }}}>
          Novo Minicurso
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Lista de Minicursos</Typography>
            <TextField variant="outlined" size="small" placeholder="Buscar minicursos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),}} sx={{ width: '300px' }}/>
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>Total de {filteredMinicursos.length} minicurso(s) cadastrado(s)</Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de minicursos">
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Carga Horária</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Vagas</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data de Criação</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMinicursos.length > 0 ? filteredMinicursos.map((minicurso) => (
                <TableRow key={minicurso.id} hover>
                  <TableCell>{minicurso.nome}</TableCell>
                  <TableCell>{minicurso.professor}</TableCell>
                  <TableCell>{minicurso.cargaHoraria}</TableCell>
                  <TableCell>{minicurso.vagas}</TableCell>
                  <TableCell>{minicurso.dataCriacao}</TableCell>
                  <TableCell align="center">
                    <IconButton title="Visualizar" size="small" onClick={() => handleView(minicurso.id)} sx={{color: 'primary.main'}}><Visibility /></IconButton>
                    <IconButton title="Editar" size="small" onClick={() => handleEdit(minicurso.id)} sx={{color: 'secondary.main', ml: 0.5}}><Edit /></IconButton>
                    <IconButton title="Excluir" size="small" onClick={() => openDeleteDialog(minicurso)} sx={{color: 'error.main', ml: 0.5}}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Nenhum minicurso encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><DialogContentText>Excluir o minicurso "{itemToDelete?.nome}"?</DialogContentText></DialogContent>
        <DialogActions><Button onClick={closeDeleteDialog}>Cancelar</Button><Button onClick={handleDeleteConfirm} color="error">Excluir</Button></DialogActions>
      </Dialog>
    </Container>
  );
}

export default MinicursosPage;