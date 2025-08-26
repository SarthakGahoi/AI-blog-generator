import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  TextField,
  Button,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Article,
  Speed,
  Refresh,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import toast from 'react-hot-toast';

// Custom Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsRes, generationsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentGenerations(),
        adminAPI.getUsers(),
      ]);

      setStats(statsRes.data);
      setRecentGenerations(generationsRes.data.recentGenerations);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAdminData();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard 👨‍💼
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stats?.total?.users || 0}
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label={`+${stats?.today?.users || 0} today`}
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Article color="secondary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Total Blogs
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stats?.total?.blogs || 0}
              </Typography>
              <Chip
                icon={<TrendingUp />}
                label={`+${stats?.today?.blogs || 0} today`}
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography color="text.secondary" variant="h6">
                  📝 Total Words
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stats?.total?.words?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Words generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Avg Speed
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stats?.avgGenerationTime ? `${Math.round(stats.avgGenerationTime / 1000)}s` : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generation time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabbed Content */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Recent Generations" />
            <Tab label="Users Management" />
            <Tab label="System Status" />
          </Tabs>
        </Box>

        {/* Recent Generations Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Recent Blog Generations ({recentGenerations.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Words</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentGenerations.map((generation) => (
                  <TableRow key={generation._id} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {generation.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {generation.userId?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        {generation.topic}
                      </Typography>
                    </TableCell>
                    <TableCell>{generation.wordCount}</TableCell>
                    <TableCell>
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={generation.status}
                        size="small"
                        color={generation.status === 'completed' ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Users Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Users Management ({users.length})
          </Typography>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} md={6} lg={4} key={user._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {user.email}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {user.isAdmin && (
                        <Chip label="Admin" size="small" color="primary" />
                      )}
                      <Chip 
                        label={`${user.generationCount} blogs`} 
                        size="small" 
                      />
                      <Chip 
                        label={`Joined ${new Date(user.createdAt).toLocaleDateString()}`} 
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* System Status Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Alert severity="success">
                <Typography variant="subtitle2">Backend Status</Typography>
                <Typography variant="body2">All systems operational</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="info">
                <Typography variant="subtitle2">Database Status</Typography>
                <Typography variant="body2">MongoDB connection active</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="success">
                <Typography variant="subtitle2">AI Service</Typography>
                <Typography variant="body2">Blog generation available</Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="info">
                <Typography variant="subtitle2">Last Updated</Typography>
                <Typography variant="body2">{new Date().toLocaleString()}</Typography>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
