import React, { useEffect, useMemo, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../../styles/main.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

export default function Statistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:8080/api/statistics", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to load statistics: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <h2 className="mb-3">Platform Statistics</h2>
      <p className="text-muted" style={{ marginTop: -6 }}>High-level metrics and recent trends for the platform.</p>

      {loading && (
        <div className="card" style={{ border: "none", boxShadow: "var(--shadow-1)" }}>
          <div className="card-body">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading statistics...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="card" style={{ border: "none", boxShadow: "var(--shadow-1)" }}>
          <div className="card-body" style={{ color: "#b00020" }}>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <>
        
          <div className="row g-3 mb-4 justify-content-center">
            <div className="col-12 col-md-4 col-lg-3 d-flex">
              <div className="card stat-card w-100 text-center" style={{ boxShadow: "var(--shadow-1)" }}>
                <div className="card-body">
                  <h5 className="card-title">Volunteers</h5>
                  <p className="card-text fs-3 fw-bold" style={{ color: "var(--color-primary)" }}>{data.totalVolunteers}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex">
              <div className="card stat-card w-100 text-center" style={{ boxShadow: "var(--shadow-1)" }}>
                <div className="card-body">
                  <h5 className="card-title">Organisations</h5>
                  <p className="card-text fs-3 fw-bold" style={{ color: "var(--color-accent)" }}>{data.totalOrganisations}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 d-flex">
              <div className="card stat-card w-100 text-center" style={{ boxShadow: "var(--shadow-1)" }}>
                <div className="card-body">
                  <h5 className="card-title">Events</h5>
                  <p className="card-text fs-3 fw-bold" style={{ color: "#8b7d7b" }}>{data.totalEvents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <ChartsBlock data={data} />
        </>
      )}
    </div>
  );
}

function ChartsBlock({ data }) {
  // Build daily counts for the last 30 days from recentEvents
  const trend = useMemo(() => {
    const byDay = new Map(); // key: YYYY-MM-DD
    (data.recentEvents || []).forEach(ev => {
      const d = ev.startDate ? new Date(ev.startDate) : null;
      if (!d) return;
      const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
      byDay.set(key, (byDay.get(key) || 0) + 1);
    });

    // Generate last 30 days timeline
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getDate().toString().padStart(2,'0')}`;
      days.push({
        label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        key
      });
    }

    const labels = days.map(d => d.label);
    const values = days.map(d => byDay.get(d.key) || 0);
    return { labels, values };
  }, [data]);

  const lineData = useMemo(() => ({
    labels: trend.labels,
    datasets: [{
      label: 'Events per day (last 30 days)',
      data: trend.values,
      borderColor: '#8b7d7b',
      backgroundColor: 'rgba(179,162,159,0.35)',
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    }],
  }), [trend]);

  const statusData = useMemo(() => {
    const counts = { PUBLISHED: 0, COMPLETED: 0, OTHER: 0 };
    (data.recentEvents || []).forEach(ev => {
      const s = String(ev.status || '').toUpperCase();
      if (s === 'PUBLISHED') counts.PUBLISHED++;
      else if (s === 'COMPLETED') counts.COMPLETED++;
      else counts.OTHER++;
    });
    return {
      labels: ['Published', 'Completed', 'Other'],
      datasets: [{
        data: [counts.PUBLISHED, counts.COMPLETED, counts.OTHER],
        backgroundColor: ['#96b38a', '#8b7d7b', '#d0c9c2'],
      }],
    };
  }, [data]);

  const locationBar = useMemo(() => {
    const map = new Map();
    (data.recentEvents || []).forEach(ev => {
      const key = ev.location || 'Unknown';
      map.set(key, (map.get(key) || 0) + 1);
    });
    const entries = Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0,6);
    return {
      labels: entries.map(e => e[0]),
      datasets: [{
        label: 'Events',
        data: entries.map(e => e[1]),
        backgroundColor: ['#8b7d7b', '#b3a29f', '#96b38a', '#d0c9c2', '#c7b9a5', '#a9b1a8'],
      }],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#eee' }, beginAtZero: true } },
  };

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-6">
        <div className="card" style={{ boxShadow: 'var(--shadow-1)' }}>
          <div className="card-body">
            <h5 className="card-title">Events per day</h5>
            <div style={{ height: 280 }}>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="card" style={{ boxShadow: 'var(--shadow-1)' }}>
          <div className="card-body">
            <h5 className="card-title">Status Distribution</h5>
            <div style={{ height: 280 }}>
              <Doughnut data={statusData} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="card" style={{ boxShadow: 'var(--shadow-1)' }}>
          <div className="card-body">
            <h5 className="card-title">Top Locations</h5>
            <div style={{ height: 280 }}>
              <Bar data={locationBar} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
