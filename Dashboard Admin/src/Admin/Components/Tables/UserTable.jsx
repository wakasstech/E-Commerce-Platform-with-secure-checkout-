import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

const UserTable = () => {
  const columns = [
    {
      id: 'username',
      label: 'Username',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'createdAt',
      label: 'Created On',
      minWidth: 100,
      align: 'center',
    },
  ];

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from the API
  useEffect(() => {
    fetch('http://localhost:6464/user/getAlluser')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const username = user.username.toLowerCase();
    const email = user.email.toLowerCase();
    const role = user.role.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      username.includes(query) || email.includes(query) || role.includes(query)
    );
  });

  return (
    <>
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}
      >
        <TextField
          id="search"
          type="search"
          label="Search Users"
          onChange={handleSearchInputChange}
          sx={{ width: { xs: 350, sm: 500, md: 800 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AiOutlineSearch />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      <Paper style={{ overflow: 'auto' }}>
        <TableContainer component={Paper} >
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ position: 'sticky', top: 0 }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, color: '#1976d2', fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <h4>User not found.</h4>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.role}</TableCell>
                    <TableCell align="center">
                      {new Date(user.createdAt).toLocaleDateString('en-us', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' '}
                      {new Date(user.createdAt).toLocaleTimeString('en-US')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default UserTable;
