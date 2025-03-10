import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Box } from '@mui/material';

const CouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState({
    code: '',
    discountAmount: '',
    discountType: 'percentage',
    expirationDate: ''
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:6464/coupon/getAll');
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle open/close for Dialog
  const handleOpen = (coupon = null) => {
    setIsEditing(!!coupon);
    setCurrentCoupon(coupon || { code: '', discountAmount: '', discountType: 'percentage', expirationDate: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Handle form submit for create or update
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:6464/coupon/update?id=${currentCoupon._id}`, currentCoupon);
      } else {
        await axios.post('http://localhost:6464/coupon/createCoupon', currentCoupon);
      }
      fetchCoupons();
      handleClose();
    } catch (error) {
      console.error("Error in submitting form:", error);
    }
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6464/coupon/delete?id=${id}`);
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Coupon</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Discount Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountAmount}</TableCell>
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>{new Date(coupon.expirationDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(coupon)}>Edit</Button>
                  <Button onClick={() => handleDelete(coupon._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Coupon Code"
            fullWidth
            value={currentCoupon.code}
            onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Discount Amount Percentage e.g; 20"
            type="number"
            fullWidth
            value={currentCoupon.discountAmount}
            onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountAmount: e.target.value })}
            margin="dense"
          />
          <Box mt={2} mb={2}>
            <label>Select Discount Type</label>
          <Select
            // label="Discount Type"
            fullWidth
            value={currentCoupon.discountType}
            onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
            margin="dense"
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="flat">Flat</MenuItem>
          </Select>
          </Box>
        
          <TextField
            label="Expiration Date"
            type="datetime-local"
            fullWidth
            value={currentCoupon.expirationDate}
            onChange={(e) => setCurrentCoupon({ ...currentCoupon, expirationDate: e.target.value })}
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{isEditing ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CouponTable;
