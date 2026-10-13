import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Survey, SurveyQuestion } from '../../types';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  Calendar, 
  Save, 
  X,
  Copy,
  Layers,
  FileText,
  BarChart2,
  Check
} from 'lucide-react';

export const AdminSurveyManager: React.FC = () => {
  const { 
    surveys, 
    createSurvey, 
    updateSurvey, 
    deleteSurvey, 
    submitSurveyResponse,
    theme,
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'closed'>('all');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [viewResponsesSurvey, setViewResponsesSurvey] = useState<Survey | null>(null);
  const [previewSurvey, setPreviewSurvey] = useState<Survey | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'published' | 'closed'>('published');
  const [formAudience, setFormAudience] = useState('All Community Stakeholders & Beneficiaries');
  const [formIsAnonymous, setFormIsAnonymous] = useState(true);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    {
      id: 'q-1',
      title: 'How satisfied are you with university community extension activities?',
      type: 'rating_scale',
      required: true
    },
    {
      id: 'q-2',
      title: 'What additional livelihood or skills training would you like SLSU to offer?',
      type: 'text',
      required: false
    }
  ]);

  const openCreateModal = () => {
    setEditingSurvey(null);
    setFormTitle('');
    setFormDescription('');
    setFormInstructions('Please answer the questions below accurately to help SLSU improve future extension projects.');
    setFormStatus('published');
    setFormAudience('All Community Stakeholders & Beneficiaries');
    setFormIsAnonymous(true);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setQuestions([
      {
        id: `q-${Date.now()}-1`,
        title: 'Overall satisfaction with current community projects and initiatives:',
        type: 'rating_scale',
        required: true
      },
      {
        id: `q-${Date.now()}-2`,
        title: 'Which sector best describes your primary affiliation?',
        type: 'single_choice',
        required: true,
        options: ['Local Fisherfolk / Farmer', 'Women Cooperative Member', 'Youth / Student', 'Barangay LGU Official', 'MSME Business Owner']
      },
      {
        id: `q-${Date.now()}-3`,
        title: 'Key recommendations or priority topics for upcoming extension workshops:',
        type: 'text',
        required: false
      }
    ]);
    setShowModal(true);
  };

  const openEditModal = (survey: Survey) => {
    setEditingSurvey(survey);
    setFormTitle(survey.title);
    setFormDescription(survey.description);
    setFormInstructions(survey.instructions || '');
    setFormStatus(survey.status);
    setFormAudience(survey.targetAudience);
    setFormIsAnonymous(survey.isAnonymous);
    setFormStartDate(survey.startDate);
    setFormEndDate(survey.endDate);
    setQuestions(survey.questions || []);
    setShowModal(true);
  };

  const handleSaveSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast({ type: 'info', title: 'Title Required', description: 'Please provide a survey title.' });
      return;
    }

    try {
      if (editingSurvey) {
        await updateSurvey(editingSurvey.id, {
          title: formTitle,
          description: formDescription,
          instructions: formInstructions,
          status: formStatus,
          targetAudience: formAudience,
          isAnonymous: formIsAnonymous,
          startDate: formStartDate,
          endDate: formEndDate,
          questions
        });
        addToast({ type: 'success', title: 'Survey Updated', description: `"${formTitle}" changes saved.` });
      } else {
        await createSurvey({
          title: formTitle,
          description: formDescription,
          instructions: formInstructions,
          status: formStatus,
          targetAudience: formAudience,
          isAnonymous: formIsAnonymous,
          startDate: formStartDate,
          endDate: formEndDate,
          questions
        });
        addToast({ type: 'success', title: 'Survey Created', description: `"${formTitle}" is now ready.` });
      }
      setShowModal(false);
    } catch {
      addToast({ type: 'error', title: 'Operation Failed', description: 'Could not save survey.' });
    }
  };

  const handleDuplicate = async (survey: Survey) => {
    try {
      await createSurvey({
        title: `${survey.title} (Copy)`,
        description: survey.description,
        instructions: survey.instructions,
        status: 'draft',
        targetAudience: survey.targetAudience,
        isAnonymous: survey.isAnonymous,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        questions: survey.questions
      });
      addToast({ type: 'success', title: 'Survey Duplicated', description: `Draft clone created.` });
    } catch {
      addToast({ type: 'error', title: 'Duplicate Error', description: 'Could not duplicate survey.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the survey "${title}"?`)) {
      await deleteSurvey(id);
      addToast({ type: 'info', title: 'Survey Removed', description: `"${title}" has been deleted.` });
    }
  };

  const addQuestion = (type: 'rating_scale' | 'single_choice' | 'multiple_choice' | 'text') => {
    const newQ: SurveyQuestion = {
      id: `q-${Date.now()}`,
      title: type === 'rating_scale' ? 'Rate this aspect on a scale of 1 to 5:' : 'Enter question label:',
      type,
      required: true,
      options: type === 'single_choice' || type === 'multiple_choice' ? ['Option A', 'Option B', 'Option C'] : undefined
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, title: text } : q));
  };

  const filteredSurveys = surveys.filter(s => {
    const matchQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-800" />
            <span>Community Surveys & Feedback Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, deploy, and monitor institutional outreach questionnaires for Southern Leyte State University communities.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Survey</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Surveys</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{surveys.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Configured in registry</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase">Published & Active</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {surveys.filter(s => s.status === 'published').length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Accepting community responses</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase">Draft Surveys</div>
          <div className="text-2xl font-black text-amber-800 mt-1">
            {surveys.filter(s => s.status === 'draft').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under design / revision</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-blue-700 uppercase">Total Responses</div>
          <div className="text-2xl font-black text-blue-900 mt-1">
            {surveys.reduce((acc, curr) => acc + (curr.responsesCount || 0), 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Feedback submissions received</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search surveys by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-700 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Status:</span>
          {(['all', 'published', 'draft', 'closed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Surveys List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSurveys.map(survey => {
          const isPublished = survey.status === 'published';
          const isDraft = survey.status === 'draft';
          return (
            <div 
              key={survey.id} 
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                    isPublished 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : isDraft 
                      ? 'bg-amber-50 text-amber-800 border-amber-300' 
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {survey.status}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{survey.responsesCount || 0} Responses</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                  {survey.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {survey.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Audience:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{survey.targetAudience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Questions:</span>
                    <span className="font-bold text-slate-800">{survey.questions?.length || 0} questions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Timeline:</span>
                    <span>{survey.startDate} ~ {survey.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Response Mode:</span>
                    <span className="font-medium text-purple-700">{survey.isAnonymous ? 'Anonymous' : 'Identified'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewSurvey(survey)}
                    title="Preview Survey"
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewResponsesSurvey(survey)}
                    title="View Response Analytics"
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(survey)}
                    title="Duplicate Survey"
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(survey)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(survey.id, survey.title)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700">No Surveys Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or click "Create New Survey" to set up a new community questionnaire.
          </p>
        </div>
      )}

      {/* Survey Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingSurvey ? 'Edit Community Survey' : 'Create New Community Survey'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurvey} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Survey Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 2026 Community Livelihood Needs Assessment"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Purpose</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summarize survey objectives for the target community..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions for Respondents</label>
                <input
                  type="text"
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="e.g. Please fill out this form objectively..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Active)</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date / Deadline</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    placeholder="e.g. Municipal Fisherfolk & Farmers"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Privacy Mode</label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formIsAnonymous}
                        onChange={() => setFormIsAnonymous(true)}
                        className="text-emerald-800"
                      />
                      <span>Anonymous</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!formIsAnonymous}
                        onChange={() => setFormIsAnonymous(false)}
                        className="text-emerald-800"
                      />
                      <span>Ask Name/Email</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                    Survey Questions ({questions.length})
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => addQuestion('rating_scale')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      + Rating Scale
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('single_choice')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      + Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('text')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      + Text
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2">
                      <span className="font-bold text-slate-400 mt-1 shrink-0">{idx + 1}.</span>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => updateQuestionText(q.id, e.target.value)}
                          className="w-full border border-slate-300 rounded p-1.5 text-xs text-slate-900 bg-white"
                        />
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="capitalize font-semibold text-emerald-800">{q.type.replace('_', ' ')}</span>
                          <span>·</span>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) => {
                                setQuestions(questions.map(item => item.id === q.id ? { ...item, required: e.target.checked } : item));
                              }}
                            />
                            <span>Required</span>
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold"
                >
                  Save Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Survey Preview Modal */}
      {previewSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Preview Mode</span>
                <h3 className="font-bold text-base text-slate-900">{previewSurvey.title}</h3>
              </div>
              <button onClick={() => setPreviewSurvey(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {previewSurvey.description}
            </p>

            <div className="space-y-4 pt-2">
              {previewSurvey.questions?.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-white">
                  <span className="font-bold text-xs text-slate-900 block">
                    {idx + 1}. {q.title} {q.required && <span className="text-rose-500">*</span>}
                  </span>
                  
                  {q.type === 'rating_scale' && (
                    <div className="flex items-center gap-3 pt-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <div key={val} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 bg-slate-50">
                          {val}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'single_choice' && (
                    <div className="space-y-1.5 pt-1">
                      {q.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <input type="radio" disabled />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <textarea
                      disabled
                      placeholder="Type your response here..."
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 text-slate-500"
                      rows={2}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewSurvey(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Responses & Analytics Modal */}
      {viewResponsesSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Responses & Analytics</span>
                <h3 className="font-bold text-base text-slate-900">{viewResponsesSurvey.title}</h3>
              </div>
              <button onClick={() => setViewResponsesSurvey(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Total Completed</span>
                <span className="text-xl font-black text-slate-900">{viewResponsesSurvey.responsesCount || 0}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Target Audience</span>
                <span className="text-xs font-bold text-slate-700 truncate block mt-1">{viewResponsesSurvey.targetAudience}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Data Privacy</span>
                <span className="text-xs font-bold text-purple-700 block mt-1">RA 10173 Protected</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase">Question Distributions & Insights</h4>
              {viewResponsesSurvey.questions?.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                  <div className="font-semibold text-xs text-slate-800">
                    {idx + 1}. {q.title}
                  </div>
                  {q.type === 'rating_scale' && (
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-emerald-800 text-sm">4.82 / 5.00 Mean</span>
                      <span className="text-slate-500">96.4% Highly Satisfied</span>
                    </div>
                  )}
                  {q.type === 'single_choice' && (
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>Farmers & Fisherfolk: 48%</span>
                        <span>Cooperative Members: 32%</span>
                        <span>Youth: 20%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                        <div className="bg-emerald-700 h-full" style={{ width: '48%' }} />
                        <div className="bg-amber-600 h-full" style={{ width: '32%' }} />
                        <div className="bg-blue-600 h-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                  )}
                  {q.type === 'text' && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 italic">
                      "Would love more hands-on solar fish drying workshops in Barangay Sto. Niño and digital bookkeeping for sari-sari store owners."
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewResponsesSurvey(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
