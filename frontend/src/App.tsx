import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

// Route-split so an attendee on venue wifi never downloads the host
// dashboard. Keep it that way: import host code only through this boundary.
const AttendeeCheckIn = lazy(() => import('./routes/attendee/CheckIn'));
const AttendeeStatus = lazy(() => import('./routes/attendee/Status'));
const HostDashboard = lazy(() => import('./routes/host/Dashboard'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route path="/" element={<Navigate to="/check-in" replace />} />
          <Route path="/check-in" element={<AttendeeCheckIn />} />
          <Route path="/status" element={<AttendeeStatus />} />
          <Route path="/host" element={<HostDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
