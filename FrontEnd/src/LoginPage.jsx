import React from "react"
import { TextField, Button, Container, Typography, Card, CardContent, Grid } from "@mui/material"

function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission logic here
  }

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}

export default LoginPage
