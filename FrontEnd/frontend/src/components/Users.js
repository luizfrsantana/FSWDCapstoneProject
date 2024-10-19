import React, { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles'; 
import Typography from '@mui/material/Typography'; 
import Button from '@mui/material/Button'; 
import Container from '@mui/material/Container'; 
import Paper from '@mui/material/Paper'; 
import Box from '@mui/material/Box'; 
import Table from '@mui/material/Table'; 
import TableBody from '@mui/material/TableBody'; 
import TableCell from '@mui/material/TableCell'; 
import TableContainer from '@mui/material/TableContainer'; 
import TableHead from '@mui/material/TableHead'; 
import TableRow from '@mui/material/TableRow'; 
// import Avatar from '@mui/material/Avatar'; 
import ButtonGroup from '@mui/material/ButtonGroup'; 
import { Link } from "react-router-dom"; 
import { useTheme } from '@mui/material/styles'; // Adicionando o tema

const useStyles = makeStyles(() => {
  const theme = useTheme(); // Usando o tema para evitar problemas
  return {
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  };
});

export default function UserList() {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    UsersGet();
  }, []);

  const UsersGet = () => {
    fetch("http://192.168.56.107:5000/api/users")
      .then(res => res.json())
      .then(
        (result) => {
          setUsers(result);
        },
        (error) => {
          setError(error);
        }
      );
  };

//  const UpdateUser = (id) => {
//     window.location = '/update/' + id;
//   };

//   const UserDelete = (id) => {
//     const data = {
//       'id': id
//     };
//     fetch('http://192.168.56.107:5000/api/delete_user', {
//       method: 'DELETE',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//     .then(res => res.json())
//     .then(
//       (result) => {
//         alert(result.message); // Usando o campo "message" da resposta JSON
//         if (result.status === 'ok') {
//           UsersGet();
//         }
//       },
//       (error) => {
//         setError(error); // Captura o erro e exibe
//       }
//     );
//   };

  return (
    <div className={classes.root}>
      <Container className={classes.container} maxWidth="lg">    
        <Paper className={classes.paper}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                USERS
              </Typography>
            </Box>
            <Box>
              <Link to="/create">
                <Button variant="contained" color="primary">
                  CREATE
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Exibição de erros, caso ocorram */}
          {error && (
            <Box color="red" mb={2}>
              <Typography variant="body1">
                Error: {error.message}
              </Typography>
            </Box>
          )}

          <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Username</TableCell>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Phone Number</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="center">Created at</TableCell>
                <TableCell align="center">Updated at</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}> {/* Corrigido para usar user.id */}
                  <TableCell align="right">{user.id}</TableCell>
                  <TableCell align="left">{user.username}</TableCell>
                  <TableCell align="left">{user.full_name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left">{user.phone_number}</TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell align="left">{user.created_at}</TableCell>
                  <TableCell align="left">{user.updated_at}</TableCell>
                  <TableCell align="left">{user.status}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                      {/* <Button onClick={() => UpdateUser(user.id)}>Edit</Button>
                      <Button onClick={() => UserDelete(user.id)}>Del</Button> */}
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </Container>
    </div>
  );
}
