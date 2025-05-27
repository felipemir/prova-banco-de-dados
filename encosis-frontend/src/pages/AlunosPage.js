// src/pages/AlunosPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Box, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, Edit, Delete, Search, Add } from '@mui/icons-material';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

const ALUNOS_STORAGE_KEY = 'alunos';
const initialAlunosData = [ // Default data if localStorage is empty
    { id: 1674150000001, nome: 'Gabriela da Silva', email: 'gabriela.silva@email.com', telefone: '(11) 99999-0006', dataCadastro: '19/01/2024' },
    { id: 1674063600002, nome: 'Bruna Otas', email: 'bruna.otas@email.com', telefone: '(11) 99999-0005', dataCadastro: '18/01/2024' },
    { id: 1673977200003, nome: 'Kethellen Hiroiaque', email: 'kethellen.h@email.com', telefone: '(11) 99999-0004', dataCadastro: '17/01/2024' },
];

function AlunosPage() {
  const [alunos, setAlunos] = useState(() => getLocalStorage(ALUNOS_STORAGE_KEY, initialAlunosData));
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalStorage(ALUNOS_STORAGE_KEY, alunos);
  }, [alunos]);

  const filteredAlunos = alunos.filter(aluno =>
    (aluno.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (aluno.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => {
    navigate(`/alunos/editar/${id}?view=true`); // Or a dedicated view page
  };

  const handleEdit = (id) => {
    navigate(`/alunos/editar/${id}`);
  };

  const openDeleteDialog = (aluno) => {
    setAlunoToDelete(aluno);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setAlunoToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (alunoToDelete) {
      setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoToDelete.id));
      closeDeleteDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Alunos
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Gerencie os alunos participantes do ENCOSIS
          </Typography>
        </Box>
        <Button component={Link} to="/alunos/novo" variant="contained" startIcon={<Add />} sx={{ backgroundColor: '#0D1B2A', '&:hover': { backgroundColor: '#1E3A5F' }}}>
          Novo Aluno
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
                Lista de Alunos
            </Typography>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                    ),
                }}
                sx={{ width: '300px' }}
            />
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
            Total de {filteredAlunos.length} aluno(s) cadastrado(s)
        </Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de alunos">
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data de Cadastro</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlunos.length > 0 ? filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id} hover>
                  <TableCell component="th" scope="row">{aluno.nome}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell>{aluno.telefone}</TableCell>
                  <TableCell>{aluno.dataCadastro}</TableCell>
                  <TableCell align="center">
                    <IconButton title="Visualizar" size="small" onClick={() => handleView(aluno.id)} sx={{color: 'primary.main'}}><Visibility /></IconButton>
                    <IconButton title="Editar" size="small" onClick={() => handleEdit(aluno.id)} sx={{color: 'secondary.main', ml: 0.5}}><Edit /></IconButton>
                    <IconButton title="Excluir" size="small" onClick={() => openDeleteDialog(aluno)} sx={{color: 'error.main', ml: 0.5}}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Nenhum aluno encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir o aluno "{alunoToDelete?.nome}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AlunosPage;