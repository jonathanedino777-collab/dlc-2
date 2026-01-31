
import React, { useState } from 'react';
import { LGA, Team, Member } from '../types';
import { Plus, Trash2, Edit2, Users, MapPin } from 'lucide-react';

interface AdminPanelProps {
  lgas: LGA[];
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lgas, teams, setTeams, members, setMembers }) => {
  const [selectedLgaId, setSelectedLgaId] = useState(lgas[0].id);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const lgaTeams = teams.filter(t => t.lgaId === selectedLgaId);
  const teamMembers = members.filter(m => m.teamId === selectedTeamId);

  const handleAddTeam = () => {
    if (!newTeamName) return;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      lgaId: selectedLgaId,
      leaderId: `leader-${Date.now()}`
    };
    setTeams(prev => [...prev, newTeam]);
    setNewTeamName('');
  };

  const handleAddMember = () => {
    if (!newMemberName || !selectedTeamId) return;
    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: newMemberName,
      teamId: selectedTeamId
    };
    setMembers(prev => [...prev, newMember]);
    setNewMemberName('');
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-12">
        <h1 className="text-2xl font-bold text-gray-800">Resource Management</h1>
        <p className="text-gray-500">Add or edit team members for all Katsina state DLC centres.</p>
      </div>

      {/* LGA Selector */}
      <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-emerald-600" />
          Select LGA
        </h3>
        <div className="space-y-2">
          {lgas.map(lga => (
            <button
              key={lga.id}
              onClick={() => {
                setSelectedLgaId(lga.id);
                setSelectedTeamId(null);
              }}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                selectedLgaId === lga.id 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-500' 
                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white'
              }`}
            >
              {lga.name}
            </button>
          ))}
        </div>
      </div>

      {/* Teams in LGA */}
      <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-emerald-600" />
          Teams in {lgas.find(l => l.id === selectedLgaId)?.name}
        </h3>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="New Team Name" 
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="flex-1 p-2 text-sm border border-gray-200 rounded outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button 
            onClick={handleAddTeam}
            className="p-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {lgaTeams.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                selectedTeamId === team.id 
                ? 'bg-emerald-600 text-white font-bold' 
                : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-emerald-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{team.name}</span>
                <span className="text-xs opacity-60">
                  {members.filter(m => m.teamId === team.id).length} members
                </span>
              </div>
            </button>
          ))}
          {lgaTeams.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No teams found</p>}
        </div>
      </div>

      {/* Team Members */}
      <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-emerald-600" />
          {selectedTeamId ? `Members in ${teams.find(t => t.id === selectedTeamId)?.name}` : 'Select a team'}
        </h3>
        {selectedTeamId && (
          <>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Member Name" 
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="flex-1 p-2 text-sm border border-gray-200 rounded outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                onClick={handleAddMember}
                className="p-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                  <span className="text-sm font-medium text-gray-700">{member.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={14} /></button>
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">Add members to this team</p>}
            </div>
          </>
        )}
        {!selectedTeamId && (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
            <Users size={48} className="mb-2 opacity-20" />
            <p className="text-sm">Select a team to manage members</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
