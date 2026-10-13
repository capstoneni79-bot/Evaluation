import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvaluationForm, FormSection, FormQuestion, QuestionType } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Eye, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Star, 
  List, 
  Type, 
  X,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';

export const EvaluationFormBuilder: React.FC = () => {
  const { forms, createForm, updateForm, deleteForm, duplicateForm, theme } = useApp();

  const [activeFormId, setActiveFormId] = useState<string>(forms[0]?.id || '');
  const [editingForm, setEditingForm] = useState<EvaluationForm | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Question editing modal state
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [targetSectionId, setTargetSectionId] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null);

  // Question form fields
  const [qLabel, setQLabel] = useState('');
  const [qDescription, setQDescription] = useState('');
  const [qType, setQType] = useState<QuestionType>('rating_scale');
  const [qRequired, setQRequired] = useState(true);
  const [qOptionsText, setQOptionsText] = useState('Option 1\nOption 2\nOption 3');
  const [qScaleMin, setQScaleMin] = useState(1);
  const [qScaleMax, setQScaleMax] = useState(5);
  const [qScaleMinLabel, setQScaleMinLabel] = useState('Strongly Disagree');
  const [qScaleMaxLabel, setQScaleMaxLabel] = useState('Strongly Agree');
  const [qWeight, setQWeight] = useState(20);

  // Section title editing
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Selected or active form
  const currentForm = editingForm || forms.find(f => f.id === activeFormId) || forms[0];

  const handleStartEditForm = (form: EvaluationForm) => {
    setEditingForm(JSON.parse(JSON.stringify(form)));
  };

  const handleCreateNewForm = async () => {
    const newForm: Partial<EvaluationForm> = {
      title: 'New Evaluation Rubric Form',
      description: 'Custom evaluation questionnaire for Southern Leyte State University extension programs.',
      instructions: 'Please answer all questions objectively.',
      status: 'draft',
      version: 1,
      targetActivityType: 'all',
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: 'I. General Evaluation Dimension',
          description: 'Assess content delivery and attainment of objectives',
          questions: [
            {
              id: `q-${Date.now()}-1`,
              label: 'Overall Satisfaction with Extension Service',
              description: 'How would you rate your experience?',
              type: 'rating_scale',
              required: true,
              scaleMin: 1,
              scaleMax: 5,
              scaleMinLabel: 'Very Dissatisfied',
              scaleMaxLabel: 'Very Satisfied',
              weight: 25
            }
          ]
        }
      ]
    };
    const created = await createForm(newForm);
    setActiveFormId(created.id);
    setEditingForm(JSON.parse(JSON.stringify(created)));
  };

  const handleSaveForm = async () => {
    if (!editingForm) return;
    await updateForm(editingForm.id, editingForm);
    setEditingForm(null);
  };

  const handleAddSection = () => {
    if (!editingForm) return;
    const newSec: FormSection = {
      id: `sec-${Date.now()}`,
      title: newSectionTitle.trim() || `Section ${editingForm.sections.length + 1}`,
      questions: []
    };
    setEditingForm({
      ...editingForm,
      sections: [...editingForm.sections, newSec]
    });
    setNewSectionTitle('');
  };

  const handleDeleteSection = (secId: string) => {
    if (!editingForm) return;
    setEditingForm({
      ...editingForm,
      sections: editingForm.sections.filter(s => s.id !== secId)
    });
  };

  const openAddQuestion = (secId: string) => {
    setTargetSectionId(secId);
    setEditingQuestion(null);
    setQLabel('');
    setQDescription('');
    setQType('rating_scale');
    setQRequired(true);
    setQOptionsText('Option 1\nOption 2\nOption 3');
    setQScaleMin(1);
    setQScaleMax(5);
    setQScaleMinLabel('Strongly Disagree');
    setQScaleMaxLabel('Strongly Agree');
    setQWeight(20);
    setShowQuestionModal(true);
  };

  const openEditQuestion = (secId: string, q: FormQuestion) => {
    setTargetSectionId(secId);
    setEditingQuestion(q);
    setQLabel(q.label);
    setQDescription(q.description || '');
    setQType(q.type);
    setQRequired(q.required);
    setQOptionsText((q.options || []).join('\n'));
    setQScaleMin(q.scaleMin || 1);
    setQScaleMax(q.scaleMax || 5);
    setQScaleMinLabel(q.scaleMinLabel || 'Strongly Disagree');
    setQScaleMaxLabel(q.scaleMaxLabel || 'Strongly Agree');
    setQWeight(q.weight || 20);
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm || !qLabel.trim()) return;

    const options = ['single_choice', 'multiple_choice', 'dropdown'].includes(qType)
      ? qOptionsText.split('\n').map(o => o.trim()).filter(Boolean)
      : undefined;

    const qData: FormQuestion = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}`,
      label: qLabel.trim(),
      description: qDescription.trim() || undefined,
      type: qType,
      required: qRequired,
      options,
      scaleMin: qType === 'rating_scale' || qType === 'star_rating' ? qScaleMin : undefined,
      scaleMax: qType === 'rating_scale' || qType === 'star_rating' ? qScaleMax : undefined,
      scaleMinLabel: qType === 'rating_scale' ? qScaleMinLabel : undefined,
      scaleMaxLabel: qType === 'rating_scale' ? qScaleMaxLabel : undefined,
      weight: qWeight
    };

    const updatedSections = editingForm.sections.map(sec => {
      if (sec.id !== targetSectionId) return sec;
      if (editingQuestion) {
        return {
          ...sec,
          questions: sec.questions.map(q => q.id === editingQuestion.id ? qData : q)
        };
      } else {
        return {
          ...sec,
          questions: [...sec.questions, qData]
        };
      }
    });

    setEditingForm({ ...editingForm, sections: updatedSections });
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (secId: string, qId: string) => {
    if (!editingForm) return;
    const updated = editingForm.sections.map(sec => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        questions: sec.questions.filter(q => q.id !== qId)
      };
    });
    setEditingForm({ ...editingForm, sections: updated });
  };

  const handleMoveQuestion = (secId: string, index: number, direction: 'up' | 'down') => {
    if (!editingForm) return;
    const updated = editingForm.sections.map(sec => {
      if (sec.id !== secId) return sec;
      const qs = [...sec.questions];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= qs.length) return sec;
      const temp = qs[index];
      qs[index] = qs[targetIdx];
      qs[targetIdx] = temp;
      return { ...sec, questions: qs };
    });
    setEditingForm({ ...editingForm, sections: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Form Selector & Creation Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            <span>Evaluation Form Builder & Rubric Customizer</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Design dynamic Likert rubrics, weighted criteria, and question sections without modifying source code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={handleCreateNewForm}
            className="px-4 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Form</span>
          </button>
        </div>
      </div>

      {/* Forms Tabs Roster */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        {forms.map(f => {
          const isSelected = f.id === (editingForm ? editingForm.id : activeFormId);
          return (
            <button
              key={f.id}
              onClick={() => {
                setActiveFormId(f.id);
                if (editingForm && editingForm.id !== f.id) {
                  setEditingForm(null);
                }
              }}
              className={`px-4 py-2.5 rounded-t-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 border-t-2 border-x border-slate-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
              style={isSelected ? { borderTopColor: theme.accentColor } : {}}
            >
              <span>{f.title}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                f.status === 'published' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {f.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Form Editor Container */}
      {currentForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          
          {/* Form Header Information */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex-1 space-y-3">
              {editingForm ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingForm.title}
                    onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                    className="w-full font-bold text-lg text-slate-900 border border-slate-300 rounded-lg p-2"
                  />
                  <textarea
                    rows={2}
                    value={editingForm.description}
                    onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                    placeholder="Form description..."
                    className="w-full text-xs text-slate-600 border border-slate-300 rounded-lg p-2"
                  />
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Status:</span>
                      <select
                        value={editingForm.status}
                        onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value as any })}
                        className="border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published (Available for Participants)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Target Type:</span>
                      <select
                        value={editingForm.targetActivityType || 'all'}
                        onChange={(e) => setEditingForm({ ...editingForm, targetActivityType: e.target.value as any })}
                        className="border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="all">Universal / All Activities</option>
                        <option value="training">Training</option>
                        <option value="livelihood">Livelihood</option>
                        <option value="seminar">Seminar</option>
                        <option value="outreach">Outreach</option>
                        <option value="community_service">Community Service</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{currentForm.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{currentForm.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                    <span>Version: <strong>v{currentForm.version}</strong></span>
                    <span>·</span>
                    <span>Status: <strong className="uppercase text-emerald-800">{currentForm.status}</strong></span>
                    <span>·</span>
                    <span>Total Sections: <strong>{currentForm.sections.length}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {editingForm ? (
                <>
                  <button
                    onClick={() => setEditingForm(null)}
                    className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveForm}
                    className="px-4 py-2 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Form Changes</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartEditForm(currentForm)}
                    className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Form Rubric</span>
                  </button>
                  <button
                    onClick={() => duplicateForm(currentForm.id)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Duplicate Form"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {forms.length > 1 && (
                    <button
                      onClick={() => deleteForm(currentForm.id)}
                      className="p-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Form Sections & Questions List */}
          <div className="space-y-6">
            {(editingForm ? editingForm.sections : currentForm.sections).map((sec, secIdx) => (
              <div key={sec.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {/* Section Header */}
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{sec.title}</h4>
                    {sec.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{sec.description}</p>
                    )}
                  </div>

                  {editingForm && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openAddQuestion(sec.id)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Add Question</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-100/60"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Questions under Section */}
                <div className="p-4 space-y-3">
                  {sec.questions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">
                      No questions configured in this section yet. Click "Add Question" above.
                    </p>
                  ) : (
                    sec.questions.map((q, qIdx) => (
                      <div 
                        key={q.id} 
                        className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{qIdx + 1}. {q.label}</span>
                            {q.required && (
                              <span className="text-[10px] text-rose-600 font-bold">*Required</span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                              {q.type.replace('_', ' ')}
                            </span>
                          </div>
                          {q.description && (
                            <p className="text-[11px] text-slate-500">{q.description}</p>
                          )}
                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {q.options.map((opt, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {editingForm && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              disabled={qIdx === 0}
                              onClick={() => handleMoveQuestion(sec.id, qIdx, 'up')}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={qIdx === sec.questions.length - 1}
                              onClick={() => handleMoveQuestion(sec.id, qIdx, 'down')}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditQuestion(sec.id, q)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                              title="Edit Question"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(sec.id, q.id)}
                              className="p-1 rounded hover:bg-rose-50 text-rose-600 cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Add Section Field when editing */}
            {editingForm && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Enter title for new question section (e.g., III. Speaker Effectiveness & Interaction)..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  Add Section
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal: Question Editor */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingQuestion ? 'Edit Question Configuration' : 'Add New Evaluation Question'}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Prompt / Statement:</label>
                <input
                  type="text"
                  required
                  value={qLabel}
                  onChange={(e) => setQLabel(e.target.value)}
                  placeholder="e.g. Rate the clarity of the resource speaker's presentation..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Sub-instructions:</label>
                <input
                  type="text"
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  placeholder="e.g. Consider voice projection, pacing, and visual aids."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Response Type:</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="rating_scale">Rating Scale (1-5 Likert)</option>
                    <option value="star_rating">Star Rating (1-5 Stars)</option>
                    <option value="single_choice">Single Choice (Radio Buttons)</option>
                    <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
                    <option value="dropdown">Dropdown Select</option>
                    <option value="short_text">Short Text Response</option>
                    <option value="long_text">Paragraph Textarea</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scoring Weight (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={qWeight}
                    onChange={(e) => setQWeight(parseInt(e.target.value, 10))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {['single_choice', 'multiple_choice', 'dropdown'].includes(qType) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Choice Options (one per line):
                  </label>
                  <textarea
                    rows={3}
                    value={qOptionsText}
                    onChange={(e) => setQOptionsText(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              )}

              {qType === 'rating_scale' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Low Label (1):</label>
                    <input
                      type="text"
                      value={qScaleMinLabel}
                      onChange={(e) => setQScaleMinLabel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">High Label (5):</label>
                    <input
                      type="text"
                      value={qScaleMaxLabel}
                      onChange={(e) => setQScaleMaxLabel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reqCheck"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <label htmlFor="reqCheck" className="font-semibold text-slate-800">
                  Mark question as required (evaluators cannot submit without answering)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-bold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Live Form Preview */}
      {showPreviewModal && currentForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Live Participant Preview
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{currentForm.title}</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {currentForm.instructions || currentForm.description}
            </p>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {currentForm.sections.map((sec, i) => (
                <div key={sec.id} className="space-y-4">
                  <h4 className="font-bold text-xs text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
                    {sec.title}
                  </h4>
                  <div className="space-y-4">
                    {sec.questions.map((q, idx) => (
                      <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-800">
                            {idx + 1}. {q.label} {q.required && <strong className="text-rose-500">*</strong>}
                          </span>
                        </div>
                        {q.description && (
                          <p className="text-[11px] text-slate-500">{q.description}</p>
                        )}

                        {q.type === 'rating_scale' && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-[10px] text-slate-400">{q.scaleMinLabel || 'Low'}</span>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(v => (
                                <button key={v} type="button" className="w-8 h-8 rounded-full border border-slate-300 font-bold hover:bg-emerald-50">
                                  {v}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400">{q.scaleMaxLabel || 'High'}</span>
                          </div>
                        )}

                        {q.type === 'single_choice' && q.options && (
                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name={q.id} className="text-emerald-800" />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'multiple_choice' && q.options && (
                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="text-emerald-800 rounded" />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'short_text' && (
                          <input type="text" placeholder="Type answer here..." className="w-full border border-slate-300 rounded p-2 text-xs" />
                        )}

                        {q.type === 'long_text' && (
                          <textarea rows={2} placeholder="Write comments here..." className="w-full border border-slate-300 rounded p-2 text-xs" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-lg text-white font-bold text-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
