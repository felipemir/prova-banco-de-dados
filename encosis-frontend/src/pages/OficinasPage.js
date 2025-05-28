// src/pages/OficinasPage.js
// src/pages/OficinasPage.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, TextField, Box,
  InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete, Search, Add } from '@mui/icons-material';
import axios from 'axios';
// import { getLocalStorage, setLocalStorage } from '../utils/localStorage'; // Remover localStorage

// const OFICINAS_STORAGE_KEY = 'oficinas'; // Não é mais necessário

const API_URL = 'http://localhost:3000';

function OficinasPage() {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Para a oficina a ser excluída
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOficinas = async () => {
      setLoading(true);
      try {
        // A rota GET /oficinas já retorna id, titulo, vagas_disponiveis
        const response = await axios.get(`${API_URL}/oficinas`); //
        // Para exibir mais detalhes (como nome do professor), a API GET /oficinas precisaria ser ajustada
        // para fazer um JOIN com a tabela de professores e retornar professor_nome, por exemplo.
        // Exemplo de como a resposta pode ser:
        // [{ id: 1, titulo: 'Oficina de React', vagas_disponiveis: 10, professor_nome: 'Dr. Silva' }]
        setOficinas(response.data);
      } catch (error) {
        console.error('Erro ao buscar oficinas:', error);
        alert('Erro ao carregar oficinas.');
      } finally {
        setLoading(false);
      }
    };
    fetchOficinas();
  }, []);

  // Remover useEffect para localStorage
  /*
  useEffect(() => {
    if (!loading) { // Apenas salva se não estiver carregando e localStorage não foi usado para popular
      // setLocalStorage(OFICINAS_STORAGE_KEY, oficinas);
    }
  }, [oficinas, loading]);
  */

  const filteredOficinas = oficinas.filter(oficina =>
    (oficina.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    // Adicionar mais campos ao filtro se necessário, ex: oficina.professor_nome
  );

  const handleView = (id) => navigate(`/oficinas/editar/${id}?view=true`);
  const handleEdit = (id) => navigate(`/oficinas/editar/${id}`);

  const openDeleteDialog = (oficina) => {
    setItemToDelete(oficina);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        // Você precisará de uma rota DELETE /oficinas/:id no backend
        await axios.delete(`${API_URL}/oficinas/${itemToDelete.id}`);
        setOficinas(prev => prev.filter(o => o.id !== itemToDelete.id));
        alert('Oficina excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir oficina:', error);
        alert(`Erro ao excluir oficina: ${error.response?.data?.error || 'Verifique o console.'}`);
      } finally {
        closeDeleteDialog();
      }
    }
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Oficinas</Typography>
        <Button component={Link} to="/oficinas/nova" variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#0D1B2A', '&:hover': { backgroundColor: '#1E3A5F' }}}>
          Nova Oficina
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Lista de Oficinas</Typography>
          <TextField
            variant="outlined" size="small" placeholder="Buscar oficinas..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>), }}
            sx={{ width: '300px' }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>Total de {filteredOficinas.length} oficina(s) cadastrada(s)</Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de oficinas">
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                {/* Se quiser mostrar o professor, precisará que a API GET /oficinas retorne essa info */}
                <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Vagas Disponíveis</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Data Início</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Data Fim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOficinas.length > 0 ? filteredOficinas.map((oficina) => (
                <TableRow key={oficina.id} hover>
                  <TableCell component="th" scope="row">{oficina.titulo}</TableCell>
                  {/* Exemplo: <TableCell>{oficina.professor_nome || 'N/A'}</TableCell> */}
                  <TableCell>{oficina.professor_nome || 'A definir'}</TableCell> {/* Ajuste aqui */}
                  <TableCell align="right">{oficina.vagas_disponiveis !== null ? oficina.vagas_disponiveis : 'N/A'}</TableCell>
                  <TableCell align="center">{oficina.data_inicio ? new Date(oficina.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                  <TableCell align="center">{oficina.data_fim ? new Date(oficina.data_fim).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
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
        <DialogContent><DialogContentText>Tem certeza que deseja excluir a oficina "{itemToDelete?.titulo}"?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OficinasPage;