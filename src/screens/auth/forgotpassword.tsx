import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState<string>("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      //TODO: Add forgot password logic here when God touches my heart
      console.log("Reset link sent to:", email);
    };
  
    return (
      <Box
        sx={{
          width: 300,
          margin: "auto",
          mt: 10,
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Reset Link
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Link to="/login">Back to Login</Link>
        </Box>
      </Box>
    );
  };
  
  export default ForgotPasswordScreen;
  