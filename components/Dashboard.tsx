
import React, { useMemo, useState, useEffect } from 'react';
import { WeeklyReport, LGA, User, UserRole, Team, Member, STATUS_OPTIONS } from '../types';
import { getReportInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, BookOpen, CheckCircle, TrendingUp, Filter, Sparkles } from 'lucide-react';

interface DashboardProps {
  reports: WeeklyReport[];
  lgas: LGA[];
  user: User;
  teams: Team[];
  members: Member[];
}

const COLORS = ['#059669', '#10B981', '#F59E0B', '#EF4444'];

const Dashboard: React.FC<DashboardProps> = ({ reports, lgas, user, teams, members }) => {
  const [selectedLga, setSelectedLga] = useState<string>('all');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // Filter reports based on role and selected filter
  const filteredReports = useMemo(() => {
    let result = reports;
    if (user.role === UserRole.TEAM_LEADER) {
      result = result.filter(r => r.teamId === user.teamId);
    } else if (selectedLga !== 'all') {
      result = result.filter(r => r.lgaId === selectedLga);
    }
    return result;
  }, [reports, user, selectedLga]);

  const stats = useMemo(() => {
    const totalTrainees = filteredReports.reduce((sum, r) => sum + r.traineesTrained, 0);
    const statusCounts = { P: 0, ABS: 0, NT: 0, NDB: 0 };
    
    filteredReports.forEach(r => {
      r.memberStatuses.forEach(ms => {
        statusCounts[ms.status]++;
      });
    });

    return { totalTrainees, statusCounts, reportCount: filteredReports.length };
  }, [filteredReports]);

  const chartData = useMemo(() => {
    return lgas.map(lga => {
      const lgaReports = reports.filter(r => r.lgaId === lga.id);
      const total = lgaReports.reduce((sum, r) => sum + r.traineesTrained, 0);
      return { name: lga.name.replace(' LGA', ''), trainees: total };
    }).filter(d => d.trainees > 0 || user.role === UserRole.ADMIN);
  }, [reports, lgas, user.role]);

  const pieData = useMemo(() => {
    return STATUS_OPTIONS.map((status, idx) => ({
      name: status,
      value: stats.statusCounts[status] || 0
    }));
  }, [stats]);

  const handleGenerateInsight = async () => {
    setIsGeneratingInsight(true);
    const insight = await getReportInsights(filteredReports, lgas);
    setAiInsight(insight || "No data available for analysis.");
    setIsGeneratingInsight(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Dashboard</h1>
          <p className="text-gray-500">
            {user.role === UserRole.ADMIN ? 'Overview of all LGA performance' : `Weekly performance for ${teams.find(t => t.id === user.teamId)?.name}`}
          </p>
        </div>
        
        {user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={selectedLga}
              onChange={(e) => setSelectedLga(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-700"
            >
              <option value="all">All LGAs</option>
              {lgas.map(lga => (
                <option key={lga.id} value={lga.id}>{lga.name}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Trainees" value={stats.totalTrainees} icon={<BookOpen className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Total Reports" value={stats.reportCount} icon={<Users className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard title="Total Present" value={stats.statusCounts.P} icon={<CheckCircle className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Participation Rate" value={`${stats.reportCount ? Math.round((stats.statusCounts.P / (stats.statusCounts.P + stats.statusCounts.ABS || 1)) * 100) : 0}%`} icon={<TrendingUp className="text-purple-600" />} color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-6">Trainees Trained by LGA</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="trainees" fill="#059669" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-6">Attendance Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <p><strong>NDB:</strong> No Data Brought</p>
            <p><strong>NT:</strong> Not Trained</p>
            <p><strong>ABS:</strong> Absent</p>
            <p><strong>P:</strong> Present</p>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-600" size={20} />
            <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-sm">AI Performance Insights</h3>
          </div>
          <button 
            onClick={handleGenerateInsight}
            disabled={isGeneratingInsight || filteredReports.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:bg-gray-400 transition-all shadow-md text-sm font-semibold"
          >
            {isGeneratingInsight ? 'Analyzing...' : 'Generate New Insight'}
          </button>
        </div>
        
        {aiInsight ? (
          <div className="prose prose-sm max-w-none text-gray-700 bg-white p-4 rounded-lg border border-emerald-50 leading-relaxed italic">
            {aiInsight}
          </div>
        ) : (
          <div className="text-center py-8 text-emerald-800/60 border-2 border-dashed border-emerald-200 rounded-lg">
            {filteredReports.length === 0 ? "No reporting data available to analyze." : "Click the button above to analyze performance using Gemini AI."}
          </div>
        )}
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Recent Weekly Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">LGA / Team</th>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium text-center">Trainees</th>
                <th className="px-6 py-3 font-medium text-center">Status Mix</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredReports.slice(0, 5).map((report) => {
                const team = teams.find(t => t.id === report.teamId);
                const lga = lgas.find(l => l.id === report.lgaId);
                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{lga?.name}</p>
                      <p className="text-xs text-gray-500">{team?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">Week {report.week}</p>
                      <p className="text-xs text-gray-500">{report.month} {report.year}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-700">
                      {report.traineesTrained}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        {report.memberStatuses.map((s, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${s.status === 'P' ? 'bg-green-500' : s.status === 'ABS' ? 'bg-red-500' : 'bg-gray-300'}`} title={s.status} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
