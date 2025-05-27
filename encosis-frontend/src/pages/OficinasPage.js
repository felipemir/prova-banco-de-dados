// src/pages/OficinasPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Box, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete, Search, Add } from '@mui/icons-material';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const OFICINAS_STORAGE_KEY = 'oficinas';
const initialOficinasData = [
    { id: 1674150000006, nome: 'Introdução à Programação', professor: 'Alexandre Castro', cargaHoraria: '8h', vagas: '20 vagas', dataCriacao: '11/01/2024' },
    { id: 1674063600007, nome: 'Design de Banco de Dados', professor: 'Andre Marsilio', cargaHoraria: '12h', vagas: '15 vagas', dataCriacao: '12/01/2024' },
];

function OficinasPage() {
  const [oficinas, setOficinas] = useState(() => getLocalStorage(OFICINAS_STORAGE_KEY, initialOficinasData));
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalStorage(OFICINAS_STORAGE_KEY, oficinas);
  }, [oficinas]);

  const filteredOficinas = oficinas.filter(oficina =>
    (oficina.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (oficina.professor?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => navigate(`/oficinas/editar/${id}?view=true`);
  const handleEdit = (id) => navigate(`/oficinas/editar/${id}`);
  const openDeleteDialog = (item) => { setItemToDelete(item); setDeleteDialogOpen(true); };
  const closeDeleteDialog = () => { setItemToDelete(null); setDeleteDialogOpen(false); };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setOficinas(prev => prev.filter(o => o.id !== itemToDelete.id));
      closeDeleteDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Oficinas</Typography>
          <Typography variant="subtitle1" color="textSecondary">Gerencie as oficinas do ENCOSIS</Typography>
        </Box>
        <Button component={Link} to="/oficinas/novo" variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#0D1B2A', '&:hover': { backgroundColor: '#1E3A5F' }}}>
          Nova Oficina
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Lista de Oficinas</Typography>
            <TextField variant="outlined" size="small" placeholder="Buscar oficinas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),}} sx={{ width: '300px' }} />
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>Total de {filteredOficinas.length} oficina(s) cadastrada(s)</Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de oficinas">
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
              {filteredOficinas.length > 0 ? filteredOficinas.map((oficina) => (
                <TableRow key={oficina.id} hover>
                  <TableCell>{oficina.nome}</TableCell>
                  <TableCell>{oficina.professor}</TableCell>
                  <TableCell>{oficina.cargaHoraria}</TableCell>
                  <TableCell>{oficina.vagas}</TableCell>
                  <TableCell>{oficina.dataCriacao}</TableCell>
                  <TableCell align="center">
                    <IconButton title="Visualizar" size="small" onClick={() => handleView(oficina.id)} sx={{color: 'primary.main'}}><Visibility /></IconButton>
                    <IconButton title="Editar" size="small" onClick={() => handleEdit(oficina.id)} sx={{color: 'secondary.main', ml: 0.5}}><Edit /></IconButton>
                    <IconButton title="Excluir" size="small" onClick={() => openDeleteDialog(oficina)} sx={{color: 'error.main', ml: 0.5}}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Nenhuma oficina encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><DialogContentText>Excluir a oficina "{itemToDelete?.nome}"?</DialogContentText></DialogContent>
        <DialogActions><Button onClick={closeDeleteDialog}>Cancelar</Button><Button onClick={handleDeleteConfirm} color="error">Excluir</Button></DialogActions>
      </Dialog>
    </Container>
  );
}

export default OficinasPage;