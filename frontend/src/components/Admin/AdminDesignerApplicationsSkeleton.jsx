import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';

// This component provides a skeleton loading state for the designer applications table.
// It mimics the structure of the real table to give the user a better sense of
// what the final content will look like when it loads.
const AdminApplicationsSkeleton = () => {
  // Define the columns to match the main table
  const columns = [
    'Applicant Name', 'Email', 'Message', 'Portfolio', 'Experience',
    'Specializations', 'Applied At', 'Actions'
  ];

  // We will display 5 rows of skeleton data to simulate a list of applications
  const skeletonRows = 5;

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }} aria-label="skeleton applications table">
        {/* Table head with skeleton text for column headers */}
        <TableHead sx={{ bgcolor: '#f0e4d3' }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ fontWeight: 'bold', color: '#44403c' }}>
                <Skeleton animation="wave" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Generate multiple rows of skeleton cells */}
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#faf7f3' } }}>
              {/* Skeleton for each cell in a row */}
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell><Skeleton animation="wave" /></TableCell>
              <TableCell>
                {/* Skeleton for the action buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton animation="wave" variant="rectangular" width={80} height={30} sx={{ borderRadius: '4px' }} />
                  <Skeleton animation="wave" variant="rectangular" width={80} height={30} sx={{ borderRadius: '4px' }} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminApplicationsSkeleton;