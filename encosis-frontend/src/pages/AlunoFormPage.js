import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, // MenuItem pode não ser usado aqui se for só checkbox
  List, ListItem, ListItemText, IconButton, Checkbox, ListItemIcon // Imports para a lista de oficinas
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
// import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'; // Pode remover se não usar

const API_URL = 'backend-banco-de-dados-production.up.railway.app';

function AlunoFormPage() {
  const navigate = useNavigate();
  const { id: alunoId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isViewMode = queryParams.get('view') === 'true';
  const isEditMode = Boolean(alunoId) && !isViewMode;

  const pageTitle = isViewMode ? 'Visualizar Aluno' : (isEditMode ? 'Editar Aluno' : 'Novo Aluno');
  const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Criar Aluno e Inscrever';

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    instituicao: '',
  });
  // Estados para as oficinas
  const [oficinasDisponiveis, setOficinasDisponiveis] = useState([]);
  const [selectedOficinas, setSelectedOficinas] = useState([]);
  const [loadingOficinas, setLoadingOficinas] = useState(true); // Para o loading das oficinas
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [inscricoesAtuais, setInscricoesAtuais] = useState([]); // Se precisar para edição avançada

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingOficinas(true); // Inicia o loading
      try {
        // Busca as oficinas disponíveis
        const oficinasRes = await axios.get(`${API_URL}/oficinas`);
        setOficinasDisponiveis(oficinasRes.data || []);

        // Se estiver editando ou visualizando um aluno, busca os dados do aluno
        if (alunoId && (isEditMode || isViewMode)) {
          const alunoRes = await axios.get(`${API_URL}/alunos/${alunoId}`);
          setFormData({
            nome: alunoRes.data.nome,
            email: alunoRes.data.email,
            telefone: alunoRes.data.telefone || '',
            instituicao: alunoRes.data.instituicao || '',
          });
          // TODO: Implementar a busca de oficinas já inscritas por este aluno
          // e popular `setSelectedOficinas` com os IDs delas. Ex:
          // const inscricoesAnteriores = await axios.get(`${API_URL}/alunos/${alunoId}/oficinas`);
          // if (inscricoesAnteriores.data) {
          //   setSelectedOficinas(inscricoesAnteriores.data.map(oficina => oficina.oficina_id)); // ou oficina.id dependendo da sua API
          // }
        }
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
        alert('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoadingOficinas(false); // Finaliza o loading
      }
    };
    fetchInitialData();
  }, [alunoId, isEditMode, isViewMode]); // Dependências do useEffect

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para marcar/desmarcar oficina
  const handleOficinaToggle = (oficinaId) => {
    setSelectedOficinas((prevSelected) =>
      prevSelected.includes(oficinaId)
        ? prevSelected.filter((id) => id !== oficinaId)
        : [...prevSelected, oficinaId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isViewMode) return;
    setIsSubmitting(true);

    const alunoPayload = { ...formData };
    let currentAlunoId = alunoId;

    try {
      if (isEditMode) {
        // Lógica para atualizar o aluno
        await axios.put(`${API_URL}/alunos/${alunoId}`, alunoPayload); // PRECISA DESTA ROTA NO BACKEND
        alert('Dados do aluno atualizados com sucesso!');
      } else {
        // Lógica para criar novo aluno
        const response = await axios.post(`${API_URL}/alunos/cadastro`, alunoPayload);
        currentAlunoId = response.data.id; // Pega o ID do aluno recém-criado
        alert('Aluno cadastrado com sucesso!');
      }

      // Processar inscrições em oficinas apenas se tivermos um ID de aluno
      if (currentAlunoId) {
        // No modo de edição, você pode querer comparar selectedOficinas com inscrições anteriores
        // para decidir se deve inscrever ou desinscrever.
        // Por simplicidade aqui, vamos apenas tentar inscrever nas selecionadas.
        // Se uma oficina já estava inscrita e continua selecionada, o backend pode lidar com isso
        // (ex: ignorar a duplicata ou retornar um erro específico que você pode tratar).

        for (const oficina_id of selectedOficinas) {
          // TODO: Verificar se o aluno já está inscrito nesta oficina ANTES de tentar inscrever,
          // especialmente se não houver tratamento de duplicatas no backend.
          try {
            await axios.post(`${API_URL}/alunos/oficinas/inscrever`, {
              aluno_id: currentAlunoId,
              oficina_id: oficina_id,
            });
          } catch (inscError) {
            console.error(`Erro ao inscrever na oficina ${oficina_id}:`, inscError.response?.data?.error || inscError.message);
            // Considerar não parar o loop, mas coletar erros para exibir no final.
          }
        }
        if (selectedOficinas.length > 0) {
            alert('Inscrições em oficinas processadas!');
        }
      }
      navigate('/alunos');
    } catch (error) {
      console.error('Erro ao processar aluno:', error.response ? error.response.data : error.message);
      alert(`Erro ao processar aluno: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Só mostra o loading principal se for um novo aluno e estiver carregando oficinas.
  // Se for edição, o formulário de aluno aparece e a lista de oficinas pode carregar depois.
  if (loadingOficinas && !alunoId) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
          {pageTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
          {isViewMode ? 'Detalhes do aluno.' : (isEditMode ? 'Atualize os dados do aluno.' : 'Preencha os dados para cadastrar um novo aluno.')}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Campos do Aluno */}
          <TextField label="Nome completo" name="nome" value={formData.nome} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }}/>
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }}/>
          <TextField label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} disabled={isViewMode} fullWidth margin="normal" InputLabelProps={{ shrink: true }}/>
          <TextField label="Instituição" name="instituicao" value={formData.instituicao} onChange={handleChange} disabled={isViewMode} required fullWidth margin="normal" InputLabelProps={{ shrink: true }}/>

          {/* Seção de Inscrição em Oficinas (não mostrar em modo de visualização) */}
          {!isViewMode && (
            <Box mt={4} mb={2}>
              <Typography variant="h6" gutterBottom>Inscrever em Oficinas</Typography>
              {loadingOficinas ? <CircularProgress size={24} /> : (
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '4px' }}>
                  <List dense>
                    {oficinasDisponiveis.length > 0 ? oficinasDisponiveis.map((oficina) => (
                      <ListItem
                        key={oficina.id}
                        button // Faz o item parecer clicável
                        onClick={() => handleOficinaToggle(oficina.id)}
                        disabled={isSubmitting}
                        secondaryAction={ // Para um visual mais claro, pode-se usar secondaryAction para o checkbox
                            <Checkbox
                                edge="end"
                                onChange={() => handleOficinaToggle(oficina.id)}
                                checked={selectedOficinas.includes(oficina.id)}
                                disabled={isSubmitting}
                            />
                        }
                      >
                        {/* Ou manter o ListItemIcon se preferir */}
                        {/* <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedOficinas.includes(oficina.id)}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon> */}
                        <ListItemText
                          primary={oficina.titulo}
                          secondary={oficina.vagas_disponiveis !== null ? `Vagas disponíveis: ${oficina.vagas_disponiveis}` : 'Vagas não informadas'}
                        />
                      </ListItem>
                    )) : (
                      <ListItem>
                        <ListItemText primary="Nenhuma oficina disponível no momento." />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          )}

          {/* Botões de Ação */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/alunos')} sx={{ mr: 2, textTransform: 'none' }}>
              {isViewMode ? 'Voltar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{backgroundColor: '#0D1B2A', '&:hover': {backgroundColor: '#1E3A5F'}, textTransform: 'none'}}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default AlunoFormPage;