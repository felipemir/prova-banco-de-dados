// src/pages/ProfessoresPage.js
import { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Box, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete, Search, Add } from '@mui/icons-material';
import axios from 'axios'; // Importe axio


const API_URL = process.env.REACT_APP_API_URL;

function ProfessoresPage() {
  const [professores, setProfessores] = useState([]); // Inicie com array vazio
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Pode renomear para professorToDelete para clareza
  const navigate = useNavigate();

  // useEffect para buscar professores do backend
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get(`${API_URL}/professores`);
        setProfessores(response.data);
      } catch (error) {
        console.error('Erro ao buscar professores:', error);
      }
    };

    fetchProfessores();
  }, []); 

  const filteredProfessores = professores.filter(prof =>
    (prof.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prof.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prof.especialidade?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => navigate(`/professores/editar/${id}?view=true`);
  const handleEdit = (id) => navigate(`/professores/editar/${id}`);
  const openDeleteDialog = (item) => { setItemToDelete(item); setDeleteDialogOpen(true); };
  const closeDeleteDialog = () => { setItemToDelete(null); setDeleteDialogOpen(false); };

  const handleDeleteConfirm = async () => { // Transforme a função em async
    if (itemToDelete) {
      try {
        // Adicione a chamada para a API de delete do backend para professores
        // Você precisará criar essa rota no backend: DELETE /professores/:id
        await axios.delete(`${API_URL}/professores/${itemToDelete.id}`);

        setProfessores(prev => prev.filter(p => p.id !== itemToDelete.id));
        alert('Professor excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir professor:', error);
        alert('Erro ao excluir professor. Verifique o console para mais detalhes.');
      } finally {
        closeDeleteDialog();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Professores</Typography>
          <Typography variant="subtitle1" color="textSecondary">Gerencie os professores do ENCOSIS</Typography>
        </Box>
        <Button component={Link} to="/professores/novo" variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#0D1B2A', '&:hover': { backgroundColor: '#1E3A5F' }}}>
          Novo Professor
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Lista de Professores</Typography>
            <TextField variant="outlined" size="small" placeholder="Buscar professores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),}} sx={{ width: '300px' }} />
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>Total de {filteredProfessores.length} professor(es) cadastrado(s)</Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de professores">
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Especialidade</TableCell>
                {/* A coluna "Data de Cadastro" foi mantida do seu código original.
                    Se o backend não fornecer essa informação diretamente via GET /professores,
                    você pode precisar removê-la ou buscar essa informação de outra forma
                    (ou o banco de dados pode ter uma coluna como `created_at`).
                    Para este exemplo, vamos assumir que, se existir, virá do backend.
                */}
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProfessores.length > 0 ? filteredProfessores.map((prof) => (
                <TableRow key={prof.id} hover>
                  <TableCell>{prof.nome}</TableCell>
                  <TableCell>{prof.email}</TableCell>
                  <TableCell>{prof.especialidade}</TableCell>
                  {/* Se o backend não retornar 'dataCadastro' ou um campo similar, esta célula ficará vazia ou dará erro.
                      Ajuste conforme os dados que sua API /professores retorna.
                      Pode ser que a data de cadastro seja gerenciada internamente pelo banco
                      e não seja um campo retornado por padrão na listagem geral.
                  */}
            
                  <TableCell align="center">
                    <IconButton title="Visualizar" size="small" onClick={() => handleView(prof.id)} sx={{color: 'primary.main'}}><Visibility /></IconButton>
                    <IconButton title="Editar" size="small" onClick={() => handleEdit(prof.id)} sx={{color: 'secondary.main', ml: 0.5}}><Edit /></IconButton>
                    <IconButton title="Excluir" size="small" onClick={() => openDeleteDialog(prof)} sx={{color: 'error.main', ml: 0.5}}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Nenhum professor encontrado ou carregando...</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><DialogContentText>Excluir o professor "{itemToDelete?.nome}"?</DialogContentText></DialogContent>
        <DialogActions><Button onClick={closeDeleteDialog}>Cancelar</Button><Button onClick={handleDeleteConfirm} color="error">Excluir</Button></DialogActions>
      </Dialog>
    </Container>
  );
}
export default ProfessoresPage;