import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    carsByMake: {},
    carsByYear: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/stats/dashboard', {
        withCredentials: true
      });
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: Object.keys(stats.carsByMake),
    datasets: [
      {
        data: Object.values(stats.carsByMake),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(stats.carsByYear),
    datasets: [
      {
        label: 'Cars by Year',
        data: Object.values(stats.carsByYear),
        backgroundColor: '#36A2EB'
      }
    ]
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Cars</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.totalCars}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Total Users</h2>
          <p className="text-4xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cars by Make</h2>
          <div className="h-64">
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cars by Year</h2>
          <div className="h-64">
            <Bar data={barChartData} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 