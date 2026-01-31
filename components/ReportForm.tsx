
import React, { useState } from 'react';
import { User, WeeklyReport, Member, Team, Status, STATUS_OPTIONS, MONTHS } from '../types';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReportFormProps {
  user: User;
  reports: WeeklyReport[];
  setReports: React.Dispatch<React.SetStateAction<WeeklyReport[]>>;
  members: Member[];
  team: Team;
}

const ReportForm: React.FC<ReportFormProps> = ({ user, reports, setReports, members, team }) => {
  const teamMembers = members.filter(m => m.teamId === team.id);
  
  const [week, setWeek] = useState(1);
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year] = useState(2024);
  const [trainees, setTrainees] = useState(0);
  const [memberStatuses, setMemberStatuses] = useState<Record<string, Status>>(
    teamMembers.reduce((acc, m) => ({ ...acc, [m.id]: 'P' }), {})
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: WeeklyReport = {
      id: `report-${Date.now()}`,
      teamId: team.id,
      lgaId: team.lgaId,
      week,
      month,
      year,
      traineesTrained: trainees,
      memberStatuses: Object.entries(memberStatuses).map(([memberId, status]) => ({
        memberId,
        status
      })),
      submittedAt: new Date().toISOString(),
      submittedBy: user.username
    };

    setReports(prev => [newReport, ...prev]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-emerald-700 p-8 text-white">
          <h2 className="text-2xl font-bold mb-1">Weekly Reporting Form</h2>
          <p className="text-emerald-100 text-sm">Team: {team.name} ({team.lgaId} LGA)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Week Number</label>
              <select 
                value={week} 
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5].map(w => <option key={w} value={w}>Week {w}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Month</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Member Status Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 uppercase tracking-widest">
              Team Attendance
            </h3>
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-medium text-gray-700">{member.name}</span>
                  <div className="flex gap-1">
                    {STATUS_OPTIONS.map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setMemberStatuses(prev => ({ ...prev, [member.id]: status }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          memberStatuses[member.id] === status 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-white text-gray-400 border border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3 text-amber-800">
                  <AlertCircle size={20} />
                  <p className="text-sm">No members found in this team. Please contact the Admin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Trainees Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Number of Trainees (Weekly Total)</label>
            <input 
              type="number" 
              value={trainees}
              onChange={(e) => setTrainees(Math.max(0, Number(e.target.value)))}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xl font-bold text-center text-emerald-700"
              placeholder="0"
            />
            <p className="text-xs text-gray-400 text-center">Enter the total count of individual trainees handled by the entire team this week.</p>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
          >
            {submitted ? <CheckCircle2 /> : <Save />}
            {submitted ? 'Submitted Successfully!' : 'Save Weekly Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
