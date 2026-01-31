
import React, { useState, useEffect } from 'react';
import { User, UserRole, LGA, Team, Member, WeeklyReport } from './types';
import { INITIAL_LGAS, INITIAL_TEAMS, INITIAL_MEMBERS } from './constants';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import AdminPanel from './components/AdminPanel';
import { LogOut, LayoutDashboard, FileText, Settings, UserCircle, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lgas] = useState<LGA[]>(INITIAL_LGAS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'admin'>('dashboard');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('dlc_reports');
    if (savedReports) setReports(JSON.parse(savedReports));

    const savedTeams = localStorage.getItem('dlc_teams');
    if (savedTeams) setTeams(JSON.parse(savedTeams));

    const savedMembers = localStorage.getItem('dlc_members');
    if (savedMembers) setMembers(JSON.parse(savedMembers));

    const savedUser = localStorage.getItem('dlc_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('dlc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('dlc_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('dlc_members', JSON.stringify(members));
  }, [members]);

  const handleLogin = (username: string) => {
    let loggedInUser: User;
    if (username.toLowerCase() === 'admin') {
      loggedInUser = { id: 'admin-1', username: 'Administrator', role: UserRole.ADMIN };
    } else {
      // Find team for leaders - simple logic for demo
      const team = teams.find(t => t.leaderId === username) || teams[0];
      loggedInUser = { 
        id: username, 
        username: `Leader (${team.name})`, 
        role: UserRole.TEAM_LEADER,
        teamId: team.id,
        lgaId: team.lgaId
      };
    }
    setUser(loggedInUser);
    localStorage.setItem('dlc_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dlc_user');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-900 px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Briefcase className="w-8 h-8 text-emerald-700" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Katsina State DLC</h1>
          <p className="text-center text-gray-500 mb-8">Performance Reporting System</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Username (e.g., admin, user-kt-1)" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              id="login-input"
            />
            <button 
              onClick={() => {
                const val = (document.getElementById('login-input') as HTMLInputElement).value;
                if (val) handleLogin(val);
              }}
              className="w-full bg-emerald-700 text-white p-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-lg"
            >
              Sign In
            </button>
          </div>
          <p className="mt-6 text-xs text-center text-gray-400">
            For access issues, please contact the state DLC administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-900 text-white shrink-0 shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <Briefcase className="w-6 h-6 text-emerald-400" />
          <h2 className="font-bold text-lg leading-tight">Katsina DLC</h2>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          {user.role === UserRole.TEAM_LEADER && (
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'report' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
            >
              <FileText size={20} />
              Submit Report
            </button>
          )}
          {user.role === UserRole.ADMIN && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'admin' ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
            >
              <Settings size={20} />
              Manage Teams
            </button>
          )}
        </nav>
        <div className="mt-auto p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3 mb-4 p-2">
            <UserCircle className="text-emerald-400" size={32} />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-emerald-300 capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-emerald-100 hover:bg-red-900/40 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard reports={reports} lgas={lgas} user={user} teams={teams} members={members} />
          )}
          {activeTab === 'report' && user.role === UserRole.TEAM_LEADER && (
            <ReportForm 
              user={user} 
              reports={reports} 
              setReports={setReports} 
              members={members} 
              team={teams.find(t => t.id === user.teamId)!}
            />
          )}
          {activeTab === 'admin' && user.role === UserRole.ADMIN && (
            <AdminPanel 
              lgas={lgas} 
              teams={teams} 
              setTeams={setTeams} 
              members={members} 
              setMembers={setMembers} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
