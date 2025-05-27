// src/components/layout/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Alunos', path: '/alunos' },
  { label: 'Minicursos', path: '/minicursos' },
  { label: 'Oficinas', path: '/oficinas' },
  { label: 'Professores', path: '/professores' },
];

function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06)' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/dashboard" sx={{ flexGrow: 1, color: '#3f51b5', textDecoration: 'none', fontWeight: 'bold' }}>
          ENCOSIS
        </Typography>
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                color: location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard') ? '#3f51b5' : 'inherit',
                fontWeight: location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard') ? 'bold' : 'normal',
                borderBottom: location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard') ? '3px solid #3f51b5' : 'none',
                borderRadius: 0,
                paddingBottom: '6px', // Adjusted for better visual separation of the underline
                margin: '0 10px',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.04)'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;