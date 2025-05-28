// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { PersonOutline, SchoolOutlined, EventNoteOutlined, BusinessCenterOutlined, GroupAddOutlined, PostAddOutlined, LibraryAddOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getLocalStorage } from '../utils/localStorage';

const ALUNOS_STORAGE_KEY = 'alunos';
const PROFESSORES_STORAGE_KEY = 'professores';
//const MINICURSOS_STORAGE_KEY = 'minicursos';
const OFICINAS_STORAGE_KEY = 'oficinas';

// Componente SummaryCard Refinado
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

  useEffect(() => {
    const alunos = getLocalStorage(ALUNOS_STORAGE_KEY, []);
    const professores = getLocalStorage(PROFESSORES_STORAGE_KEY, []);
    //const minicursos = getLocalStorage(MINICURSOS_STORAGE_KEY, []);
    const oficinas = getLocalStorage(OFICINAS_STORAGE_KEY, []);

    setCounts({
      alunos: alunos.length,
      professores: professores.length,
      //minicursos: minicursos.length,
      oficinas: oficinas.length,
    });

    const sortedAlunos = [...alunos].sort((a, b) => {
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            const parts = dateStr.split('/');
            // Assuming DD/MM/YYYY
            return new Date(parts[2], parts[1] - 1, parts[0]);
        };
        return parseDate(b.dataCadastro) - parseDate(a.dataCadastro);
    });
    setRecentAlunos(sortedAlunos.slice(0, 3));

  }, []);

  const summaryData = [
    { title: 'Alunos', count: counts.alunos, icon: <PersonOutline />, color: '#e3f2fd', iconColor: '#1976d2', linkTo: '/alunos' },
    { title: 'Professores', count: counts.professores, icon: <SchoolOutlined />, color: '#e8f5e9', iconColor: '#388e3c', linkTo: '/professores' },
    //{ title: 'Minicursos', count: counts.minicursos, icon: <EventNoteOutlined />, color: '#f3e5f5', iconColor: '#7b1fa2', linkTo: '/minicursos' },
    { title: 'Oficinas', count: counts.oficinas, icon: <BusinessCenterOutlined />, color: '#fff3e0', iconColor: '#ef6c00', linkTo: '/oficinas' },
  ];

  const quickActions = [
    { label: 'Cadastrar Novo Aluno', path: '/alunos/novo', icon: <GroupAddOutlined sx={{ mr: 1.5, color: '#1976d2' }} /> },
    { label: 'Cadastrar Novo Professor', path: '/professores/novo', icon: <SchoolOutlined sx={{ mr: 1.5, color: '#388e3c' }} /> },
    //{ label: 'Criar Novo Minicurso', path: '/minicursos/novo', icon: <PostAddOutlined sx={{ mr: 1.5, color: '#7b1fa2' }} /> },
    { label: 'Criar Nova Oficina', path: '/oficinas/novo', icon: <LibraryAddOutlined sx={{ mr: 1.5, color: '#ef6c00' }} /> },
  ];

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

      <Grid container spacing={11} sx={{ mt: 10}}> {/* Reduzido o mt aqui para alinhar melhor visualmente */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ padding: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>👥 Alunos Recentes</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>Últimos alunos cadastrados no sistema</Typography>
            <Box sx={{ flexGrow: 1, minHeight: recentAlunos.length === 0 ? '80px' : 'auto' /* Garante um espaço mínimo */ }}>
              {recentAlunos.length > 0 ? (
                <List sx={{padding: 0}}>
                  {recentAlunos.map((student) => (
                    <ListItem key={student.id} divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                      <Box>
                        <ListItemText primary={student.nome} secondary={student.email} primaryTypographyProps={{fontWeight: '500'}}/>
                      </Box>
                      <Typography variant="body2" color="textSecondary">{student.dataCadastro}</Typography>
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