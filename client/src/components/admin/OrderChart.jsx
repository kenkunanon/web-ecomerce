import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders'); // Adjust the URL to your API endpoint
        const orders = response.data;

        const groupedData = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {};
          }
          order.items.forEach(item => {
            if (!acc[date][item.productName]) {
              acc[date][item.productName] = 0;
            }
            acc[date][item.productName] += item.quantity;
          });
          return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const datasets = Object.keys(groupedData[labels[0]]).map(productName => ({
          label: productName,
          data: labels.map(date => groupedData[date][productName] || 0),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        }));

        setChartData({
          labels,
          datasets,
        });
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Order Data</h2>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Orders per Product per Day' } } }} />
    </div>
  );
};

export default OrderChart;