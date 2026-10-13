import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ActivityType, ActivityStatus } from '../../types';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Archive, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowUpDown,
  X,
  Layers,
  Save,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const EvaluationActivityManager: React.FC = () => {
  const { 
    activities, 
    evaluations, 
    forms, 
    createActivity, 
    updateActivity, 
    deleteActivity, 
    duplicateActivity, 
    theme,
    setCurrentView,
    setSelectedActivityId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<ActivityType>('training');
  const [formStatus, setFormStatus] = useState<ActivityStatus>('active');
  const [formDescription, setFormDescription] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDeadline, setFormDeadline] = useState('');
  const [formVenue, setFormVenue] = useState('SLSU-Hinunangan Campus');
  const [formBeneficiaries, setFormBeneficiaries] = useState('Community Members & Trainees');
  const [formDepartment, setFormDepartment] = useState('Faculty of Computer Studies and Information Technology (FCSIT)');
  const [formCoordinator, setFormCoordinator] = useState('Dr. Jane C. Monfort');
  const [formSpeaker, setFormSpeaker] = useState('Faculty Extension Team');
  const [formTargetCount, setFormTargetCount] = useState(40);
  const [formAssignedRubric, setFormAssignedRubric] = useState<string>('form-001');

  // Activity Details Modal
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);

  const openCreateModal = () => {
    setEditingActivity(null);
    setFormTitle('');
    setFormType('training');
    setFormStatus('active');
    setFormDescription('');
    setFormInstructions('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDeadline(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setFormVenue('SLSU-Hinunangan Campus');
    setFormBeneficiaries('Community Members & Trainees');
    setFormDepartment('Faculty of Computer Studies and Information Technology (FCSIT)');
    setFormCoordinator('Dr. Jane C. Monfort');
    setFormSpeaker('Faculty Extension Team');
    setFormTargetCount(40);
    setFormAssignedRubric(forms[0]?.id || 'form-001');
    setShowModal(true);
  };

  const openEditModal = (act: Activity) => {
    setEditingActivity(act);
    setFormTitle(act.title);
    setFormType(act.activityType);
    setFormStatus(act.status);
    setFormDescription(act.description || '');
    setFormInstructions(act.instructions || '');
    setFormDate(act.date || new Date().toISOString().split('T')[0]);
    setFormDeadline(act.deadline || '');
    setFormVenue(act.venue || '');
    setFormBeneficiaries(act.targetBeneficiaries || '');
    setFormDepartment(act.organizingDepartment || '');
    setFormCoordinator(act.leadCoordinator || '');
    setFormSpeaker(act.trainerOrSpeaker || '');
    setFormTargetCount(act.totalTargetParticipants || 30);
    setFormAssignedRubric(act.assignedFormId || (forms[0]?.id || 'form-001'));
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload: Partial<Activity> = {
      title: formTitle.trim(),
      activityType: formType,
      status: formStatus,
      description: formDescription.trim(),
      instructions: formInstructions.trim(),
      date: formDate,
      deadline: formDeadline,
      venue: formVenue.trim(),
      targetBeneficiaries: formBeneficiaries.trim(),
      organizingDepartment: formDepartment.trim(),
      leadCoordinator: formCoordinator.trim(),
      trainerOrSpeaker: formSpeaker.trim(),
      totalTargetParticipants: Number(formTargetCount),
      assignedFormId: formAssignedRubric
    };

    if (editingActivity) {
      await updateActivity(editingActivity.id, payload);
    } else {
      await createActivity(payload);
    }

    setShowModal(false);
  };

  const filteredActivities = activities.filter(act => {
    if (filterType !== 'all' && act.activityType !== filterType) return false;
    if (filterStatus !== 'all' && act.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.venue.toLowerCase().includes(q) ||
        act.leadCoordinator.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Primary Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">
            Evaluation Activity Roster & Assignment Manager
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, schedule, publish, and assign dynamic evaluation forms to extension programs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>New Evaluation Activity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by title, venue, or coordinator..."
            className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="all">All Activity Types</option>
            <option value="training">Training</option>
            <option value="livelihood">Livelihood</option>
            <option value="seminar">Seminar</option>
            <option value="outreach">Outreach</option>
            <option value="community_service">Community Service</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active / Open</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map(act => {
          const actEvals = evaluations.filter(e => e.activityId === act.id);
          const evalCount = actEvals.length;
          const turnoutPct = Math.min(100, Math.round((evalCount / act.totalTargetParticipants) * 100));
          const avgRating = evalCount > 0
            ? (actEvals.reduce((a, b) => a + b.meanRating, 0) / evalCount).toFixed(2)
            : 'N/A';

          const assignedForm = forms.find(f => f.id === act.assignedFormId);

          return (
            <div 
              key={act.id} 
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {act.activityType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    act.status === 'active' ? 'bg-emerald-100 text-emerald-900' :
                    act.status === 'completed' ? 'bg-blue-100 text-blue-900' :
                    act.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {act.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{act.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{act.description}</p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Conducted: {act.date} {act.deadline && `(Deadline: ${act.deadline})`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{act.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Resource: {act.trainerOrSpeaker}</span>
                  </div>
                  {assignedForm && (
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Rubric: {assignedForm.title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Turnout Progress Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Participation Turnout:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {evalCount} / {act.totalTargetParticipants} ({turnoutPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${turnoutPct}%`,
                      backgroundColor: turnoutPct >= 80 ? '#059669' : turnoutPct >= 50 ? '#d97706' : '#3b82f6'
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Mean Score:</span>
                  <span className="font-bold text-emerald-900 tabular-nums">
                    {avgRating} {avgRating !== 'N/A' && '★'}
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setDetailActivity(act)}
                    className="flex-1 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => openEditModal(act)}
                    className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                    title="Edit Activity"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => duplicateActivity(act.id)}
                    className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                    title="Duplicate as Template"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="p-1.5 rounded border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Archive Activity"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create or Edit Activity */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingActivity ? 'Edit Evaluation Activity' : 'Create New Evaluation Activity'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Modern Web Development for Hinunangan Youth"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Type:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ActivityType)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="training">Skills Training</option>
                    <option value="livelihood">Livelihood Workshop</option>
                    <option value="seminar">Seminar / Lecture</option>
                    <option value="outreach">Community Outreach</option>
                    <option value="community_service">Community Service</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ActivityStatus)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="active">Active (Open for Evaluation)</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Participants:</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={formTargetCount}
                    onChange={(e) => setFormTargetCount(parseInt(e.target.value, 10))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conduct Date:</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evaluation Deadline:</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue / Location:</label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Beneficiaries:</label>
                  <input
                    type="text"
                    required
                    value={formBeneficiaries}
                    onChange={(e) => setFormBeneficiaries(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Coordinator:</label>
                  <input
                    type="text"
                    value={formCoordinator}
                    onChange={(e) => setFormCoordinator(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Speaker / Resource Person:</label>
                  <input
                    type="text"
                    value={formSpeaker}
                    onChange={(e) => setFormSpeaker(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Form Builder Rubric:</label>
                <select
                  value={formAssignedRubric}
                  onChange={(e) => setFormAssignedRubric(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-medium"
                >
                  {forms.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.title} ({f.sections.reduce((a, s) => a + s.questions.length, 0)} questions · {f.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Description:</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Outline community deliverables and technology transfer objectives..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Evaluation Instructions for Beneficiaries:</label>
                <textarea
                  rows={2}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="e.g. Please bring your QR attendee code or student ID to verify attendance."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white font-bold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {editingActivity ? 'Save Changes' : 'Create Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Drawer / Modal */}
      {detailActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-900">
                  {detailActivity.activityType}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{detailActivity.title}</h3>
              </div>
              <button onClick={() => setDetailActivity(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {detailActivity.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Venue</span>
                  <span className="font-bold text-slate-900">{detailActivity.date} · {detailActivity.venue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Coordinator & Speaker</span>
                  <span className="font-bold text-slate-900">{detailActivity.leadCoordinator}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-emerald-950">Participation Quota Progress</span>
                  <span className="font-extrabold text-emerald-900 tabular-nums">
                    {evaluations.filter(e => e.activityId === detailActivity.id).length} / {detailActivity.totalTargetParticipants} submissions
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target Beneficiaries: {detailActivity.targetBeneficiaries}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedActivityId(detailActivity.id);
                  setDetailActivity(null);
                  openEditModal(detailActivity);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs"
              >
                Edit Activity
              </button>
              <button
                onClick={() => setDetailActivity(null)}
                className="px-4 py-2 rounded-lg text-white font-bold text-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
