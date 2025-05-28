// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, List, ListItem, ListItemText, Box, CircularProgress } from '@mui/material';
import { PersonOutline, SchoolOutlined, EventNoteOutlined, BusinessCenterOutlined, GroupAddOutlined, PostAddOutlined, LibraryAddOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importe o axios
// Remova a importação de localStorage se não for mais usada para o dashboard
// import { getLocalStorage } from '../utils/localStorage';

const API_URL = 'http://localhost:3000'; // URL do seu backend

// Componente SummaryCard Refinado (permanece o mesmo)
function SummaryCard({ title, count, icon, color, iconColor, linkTo }) {
  return (
    <Paper elevation={2} sx={{ padding: 2.5, backgroundColor: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle1" color="textSecondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{title}</Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', mt: 0.5, mb: 1 }}>{count}</Typography>
        </Box>
        <Box sx={{ backgroundColor: color, borderRadius: '50%', padding: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
          {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 30 } })}
        </Box>
      </Box>
      <Button component={Link} to={linkTo} size="small" sx={{ textTransform: 'none', padding: 0, marginTop: 'auto', alignSelf: 'flex-start', fontWeight: '500', '&:hover': {textDecoration: 'underline'} }}>
        Ver todos &rarr;
      </Button>
    </Paper>
  );
}

function DashboardPage() {
  const [counts, setCounts] = useState({ alunos: 0, professores: 0, oficinas: 0 });
  const [recentAlunos, setRecentAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Faz chamadas paralelas para as diferentes rotas do backend
        const [alunosRes, professoresRes, oficinasRes] = await Promise.all([
          axios.get(`${API_URL}/alunos`),
          axios.get(`${API_URL}/professores`),
          axios.get(`${API_URL}/oficinas`)
          // Se você tivesse minicursos e quisesse a contagem, adicionaria aqui:
          // axios.get(`${API_URL}/minicursos`)
        ]);

        const alunosData = alunosRes.data || [];
        const professoresData = professoresRes.data || [];
        const oficinasData = oficinasRes.data || [];
        // const minicursosData = minicursosRes.data || []; // Se minicursos fossem buscados

        setCounts({
          alunos: alunosData.length,
          professores: professoresData.length,
          oficinas: oficinasData.length,
          // minicursos: minicursosData.length, // Se minicursos fossem buscados
        });

        // Ordenar alunos por data de cadastro (do mais recente para o mais antigo)
        // Assumindo que seu backend retorna 'data_cadastro' no formato que pode ser ordenado diretamente
        // ou um timestamp. Se for uma string de data, a ordenação pode precisar de parsing.
        // O ideal é que o backend retorne a data em um formato ISO (ex: "2024-05-27T10:00:00.000Z")
        // ou que a query SQL já ordene por data de cadastro DESC.
        const sortedAlunos = [...alunosData].sort((a, b) => {
            // Tenta converter para data, se o formato não for diretamente comparável
            // Ajuste esta lógica de ordenação conforme o formato da data retornado pela sua API
            const dateA = new Date(a.data_cadastro || 0).getTime();
            const dateB = new Date(b.data_cadastro || 0).getTime();
            return dateB - dateA; // Mais recente primeiro
        });
        setRecentAlunos(sortedAlunos.slice(0, 3)); // Pega os 3 mais recentes

      } catch (error) {
        console.error("Erro ao buscar dados para o dashboard:", error);
        // Tratar o erro, talvez mostrando uma mensagem na UI
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // A estrutura de summaryData agora usa os valores do estado `counts`
   const summaryData = [
    { title: 'Alunos', count: counts.alunos, icon: <PersonOutline />, color: '#e3f2fd', iconColor: '#1976d2', linkTo: '/alunos' },
    { title: 'Professores', count: counts.professores, icon: <SchoolOutlined />, color: '#e8f5e9', iconColor: '#388e3c', linkTo: '/professores' },
    { title: 'Oficinas', count: counts.oficinas, icon: <BusinessCenterOutlined />, color: '#fff3e0', iconColor: '#ef6c00', linkTo: '/oficinas' },
    // Removido o item de Minicursos conforme solicitado anteriormente
  ];


  const quickActions = [
    { label: 'Cadastrar Novo Aluno', path: '/alunos/novo', icon: <GroupAddOutlined sx={{ mr: 1.5, color: '#1976d2' }} /> },
    { label: 'Cadastrar Novo Professor', path: '/professores/novo', icon: <SchoolOutlined sx={{ mr: 1.5, color: '#388e3c' }} /> },
    // Removido o item de Minicurso conforme solicitado anteriormente
    { label: 'Criar Nova Oficina', path: '/oficinas/nova', icon: <LibraryAddOutlined sx={{ mr: 1.5, color: '#ef6c00' }} /> },
  ];


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard ENCOSIS
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Sistema de gerenciamento do evento acadêmico ENCOSIS
      </Typography>

      <Grid container spacing={3}>
        {summaryData.map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <SummaryCard title={item.title} count={item.count} icon={item.icon} color={item.color} iconColor={item.iconColor} linkTo={item.linkTo} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 9}}> {/* Ajustado o espaçamento */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ padding: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>👥 Alunos Recentes</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>Últimos alunos cadastrados no sistema</Typography>
            <Box sx={{ flexGrow: 1, minHeight: recentAlunos.length === 0 ? '80px' : 'auto' }}>
              {recentAlunos.length > 0 ? (
                <List sx={{padding: 0}}>
                  {recentAlunos.map((student) => (
                    <ListItem key={student.id} divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                      <Box>
                        <ListItemText primary={student.nome} secondary={student.email} primaryTypographyProps={{fontWeight: '500'}}/>
                      </Box>
                      {/* Ajuste para exibir a data de cadastro corretamente */}
                      <Typography variant="body2" color="textSecondary">{student.data_cadastro ? new Date(student.data_cadastro).toLocaleDateString('pt-BR') : 'Data não disponível'}</Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{mt: 2, textAlign: 'center', py: 2}}>Nenhum aluno cadastrado recentemente.</Typography>
              )}
            </Box>
            <Button component={Link} to="/alunos" variant="outlined" fullWidth sx={{ mt: 'auto', textTransform: 'none' }}>
              Ver todos os alunos
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ padding: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>⚡ Ações Rápidas</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>Acesso rápido às principais funcionalidades</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <List sx={{padding: 0}}>
                {quickActions.map((action, index) => (
                    <ListItem key={index} button component={Link} to={action.path} divider sx={{padding: '12px 4px', '&:hover': {backgroundColor: 'action.hover'}}}>
                    {action.icon}
                    <ListItemText primary={action.label} primaryTypographyProps={{variant: 'body1'}}/>
                    </ListItem>
                ))}
                </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;