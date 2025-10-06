import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

import LiveDigiStats from './pages/stats/LiveDigiStats';
import LiveQCStats from './pages/stats/LiveQCStats';
import MyDigiStats from './pages/stats/MyDigiStats';
import MyPerformance from './pages/stats/MyPerformance';

import AddUser from './pages/users/AddUser';
import BulkUserUpload from './pages/users/BulkUserUpload';
import UserManagement from './pages/users/UserManagement';
import TimesheetTool from './pages/users/TimesheetTool';
import HolidayCalendar from './pages/users/HolidayCalendar';
import UserLogs from './pages/users/UserLogs';
import TrainingRecord from './pages/users/TrainingRecord';

import PrioritySheets from './pages/tools/PrioritySheets';
import SLASummary from './pages/tools/SLASummary';
import MapSearch from './pages/tools/MapSearch';
import AgreementSearch from './pages/tools/AgreementSearch';

import DigiSheet from './pages/sheets/DigiSheet';
import QCSheet from './pages/sheets/QCSheet';
import TLSheet from './pages/sheets/TLSheet';

import LivePLCDDashboard from './pages/dashboards/LivePLCDDashboard';
import MonthlyDashboard from './pages/dashboards/MonthlyDashboard';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        //stats
        <Route path="/stats/livedigistats" element={<LiveDigiStats />} />
        <Route path="/stats/liveqcstats" element={<LiveQCStats />} />
        <Route path="/stats/mydigistats" element={<MyDigiStats />} />
        <Route path="/stats/my-performance" element={<MyPerformance />} />
        //users
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/bulk-upload" element={<BulkUserUpload />} />
        <Route path="/users/timesheet" element={<TimesheetTool />} />
        <Route path="/users/leave" element={<HolidayCalendar />} />
        <Route path="/users/logs-summary" element={<UserLogs />} />
        <Route path="/users/training" element={<TrainingRecord />} />
        //tools
        <Route path="/tools/prioritysheets" element={<PrioritySheets />} />
        <Route path="/tools/slasummary" element={<SLASummary />} />
        <Route path="/tools/mapsearch" element={<MapSearch />} />
        <Route path="/tools/agreementsearch" element={<AgreementSearch />} />
        //sheets
        <Route path="/sheets/digi/:sheetname" element={<DigiSheet />} />
        <Route path="/sheets/qc/:sheetname" element={<QCSheet />} />
        <Route path="/sheets/tl/:sheetname" element={<TLSheet />} />
        <Route path="/sheets/tl/:sheetname" element={<TLSheet />} />
        //Dashboards
        <Route path="/dashboards/plcd" element={<LivePLCDDashboard />} />
        <Route path="/dashboards/monthly" element={<MonthlyDashboard />} />
      </Routes>
    </Router>
  );
}
