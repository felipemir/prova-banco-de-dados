// src/pages/AlunosPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, Edit } from '@mui/icons-material';
import axios from 'axios'; // Importe axios

//const ALUNOS_STORAGE_KEY = 'alunos';
//const initialAlunosData = [ // Default data if localStorage is empty
    //{ id: 1674150000001, nome: 'Gabriela da Silva', email: 'gabriela.silva@email.com', telefone: '(11) 99999-0006', dataCadastro: '19/01/2024' },
    //{ id: 1674063600002, nome: 'Bruna Otas', email: 'bruna.otas@email.com', telefone: '(11) 99999-0005', dataCadastro: '18/01/2024' },
    //{ id: 1673977200003, nome: 'Kethellen Hiroiaque', email: 'kethellen.h@email.com', telefone: '(11) 99999-0004', dataCadastro: '17/01/2024' },
//];

const API_URL = process.env.REACT_APP_API_URL;

function AlunosPage() {
  const [alunos, setAlunos] = useState([]); // Inicie com array vazio
  const [searchTerm] = useState('');
  const navigate = useNavigate();

useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(`${API_URL}/alunos`);
        // Assumindo que sua API retorna um array de alunos como:
        // [{ id: 1, nome: 'João', email: 'joao@example.com', telefone: '123', instituicao: 'ABC', data_cadastro: '...' }]
        // Se o backend retornar campos com snake_case (ex: data_cadastro) e o frontend
        // espera camelCase (ex: dataCadastro), você pode precisar mapear/transformar os dados.
        // Exemplo simples, se o backend já retorna o campo 'dataCadastro' ou um compatível:
        setAlunos(response.data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        // Considere adicionar um estado para feedback de erro na UI
      }
    };

    fetchAlunos();
  }, []);

  const filteredAlunos = alunos.filter(aluno =>
    (aluno.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (aluno.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
     (aluno.instituicao?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => {
    navigate(`/alunos/editar/${id}?view=true`); // Or a dedicated view page
  };

  const handleEdit = (id) => {
    navigate(`/alunos/editar/${id}`);
  };

 return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ... (Box com título e botão Novo Aluno) ... */}

      <Paper elevation={2} sx={{ padding: 3 }}>
        {/* ... (Box com título da lista e campo de busca) ... */}
        <Typography variant="body2" color="textSecondary" gutterBottom>
            Total de {filteredAlunos.length} aluno(s) cadastrado(s)
        </Typography>
        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 750 }} aria-label="tabela de alunos"> {/* Ajuste minWidth se necessário */}
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Instituição</TableCell> {/* NOVA COLUNA */}
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
                  <TableCell>{aluno.instituicao || 'N/A'}</TableCell> {/* EXIBIR INSTITUIÇÃO */}
                  <TableCell>{aluno.data_cadastro || aluno.dataCadastro || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <IconButton title="Visualizar" size="small" onClick={() => handleView(aluno.id)} sx={{color: 'primary.main'}}><Visibility /></IconButton>
                    <IconButton title="Editar" size="small" onClick={() => handleEdit(aluno.id)} sx={{color: 'secondary.main', ml: 0.5}}><Edit /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    {/* Ajuste colSpan para o novo número de colunas */}
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Nenhum aluno encontrado ou carregando...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ... (Dialog de exclusão) ... */}
    </Container>
  );
}
export default AlunosPage;