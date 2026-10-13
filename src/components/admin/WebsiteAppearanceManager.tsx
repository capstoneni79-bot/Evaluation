import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { WebsiteTheme, TypographySettings, LogoHistoryItem } from '../../types';
import { 
  Palette, 
  RotateCcw, 
  Save, 
  Check, 
  Sparkles, 
  Building2, 
  Eye, 
  CheckCircle2,
  Type,
  Sliders,
  X,
  ShieldCheck,
  Table,
  CheckSquare,
  BarChart3,
  Calendar,
  PanelLeft,
  GraduationCap,
  Award,
  Landmark,
  BookOpen,
  Layout,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  History,
  Trash2,
  ExternalLink,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';

interface PresetTheme {
  id: string;
  name: string;
  description: string;
  previewColors: string[];
  theme: Partial<WebsiteTheme>;
}

const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'slsu-official',
    name: 'SLSU Official Emerald & Gold',
    description: 'Southern Leyte State University institutional forest green with academic gold accents.',
    previewColors: ['#022c22', '#065f46', '#d97706', '#f8fafc'],
    theme: {
      siteName: 'Southern Leyte State University',
      siteTagline: 'Extension Services Evaluation System & Decision Support',
      logoText: 'SLSU-Hinunangan',
      primaryColor: '#022c22',
      secondaryColor: '#065f46',
      accentColor: '#d97706',
      pageBgColor: '#f8fafc',
      cardBgColor: '#ffffff',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#1e293b',
      sidebarLogoColor: '#d97706',
      sidebarLogoBg: '#022c22',
      sidebarLogoTextColor: '#1e293b',
      sidebarLogoIcon: 'building',
      sidebarLogoShape: 'rounded',
      sidebarActiveItemBg: '#022c22',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#e2e8f0',
      headerBgColor: '#022c22',
      headerTextColor: '#ffffff',
      buttonPrimaryBg: '#064e3b',
      buttonPrimaryText: '#ffffff',
      linkTextColor: '#065f46',
      themeMode: 'light'
    }
  },
  {
    id: 'corporate-slate',
    name: 'Modern Corporate Slate',
    description: 'Clean modern enterprise look with deep slate, cool gray, and royal blue accents.',
    previewColors: ['#0f172a', '#334155', '#2563eb', '#f1f5f9'],
    theme: {
      siteName: 'Southern Leyte State University',
      siteTagline: 'Extension Services Evaluation System & Decision Support',
      logoText: 'SLSU-Hinunangan',
      primaryColor: '#0f172a',
      secondaryColor: '#334155',
      accentColor: '#2563eb',
      pageBgColor: '#f1f5f9',
      cardBgColor: '#ffffff',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#0f172a',
      sidebarLogoColor: '#38bdf8',
      sidebarLogoBg: '#0f172a',
      sidebarLogoTextColor: '#0f172a',
      sidebarLogoIcon: 'landmark',
      sidebarLogoShape: 'rounded',
      sidebarActiveItemBg: '#0f172a',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#e2e8f0',
      headerBgColor: '#0f172a',
      headerTextColor: '#ffffff',
      buttonPrimaryBg: '#2563eb',
      buttonPrimaryText: '#ffffff',
      linkTextColor: '#2563eb',
      themeMode: 'light'
    }
  },
  {
    id: 'academic-navy',
    name: 'Deep Academic Navy',
    description: 'Prestigious university navy blue with bright amber accents.',
    previewColors: ['#1e1b4b', '#312e81', '#f59e0b', '#f8fafc'],
    theme: {
      siteName: 'Southern Leyte State University',
      siteTagline: 'Extension Services Evaluation System & Decision Support',
      logoText: 'SLSU-Hinunangan',
      primaryColor: '#1e1b4b',
      secondaryColor: '#312e81',
      accentColor: '#f59e0b',
      pageBgColor: '#f8fafc',
      cardBgColor: '#ffffff',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#1e1b4b',
      sidebarLogoColor: '#f59e0b',
      sidebarLogoBg: '#1e1b4b',
      sidebarLogoTextColor: '#1e1b4b',
      sidebarLogoIcon: 'graduation',
      sidebarLogoShape: 'rounded',
      sidebarActiveItemBg: '#1e1b4b',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#e2e8f0',
      headerBgColor: '#1e1b4b',
      headerTextColor: '#ffffff',
      buttonPrimaryBg: '#312e81',
      buttonPrimaryText: '#ffffff',
      linkTextColor: '#312e81',
      themeMode: 'light'
    }
  },
  {
    id: 'sage-nature',
    name: 'Coastal Agro-Ecology Green',
    description: 'Natural organic botanical tones suited for community agriculture and livelihood outreach.',
    previewColors: ['#14532d', '#166534', '#10b981', '#f0fdf4'],
    theme: {
      siteName: 'Southern Leyte State University',
      siteTagline: 'Extension Services Evaluation System & Decision Support',
      logoText: 'SLSU-Hinunangan',
      primaryColor: '#14532d',
      secondaryColor: '#166534',
      accentColor: '#10b981',
      pageBgColor: '#f0fdf4',
      cardBgColor: '#ffffff',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#14532d',
      sidebarLogoColor: '#10b981',
      sidebarLogoBg: '#14532d',
      sidebarLogoTextColor: '#14532d',
      sidebarLogoIcon: 'award',
      sidebarLogoShape: 'circle',
      sidebarActiveItemBg: '#14532d',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#dcfce7',
      headerBgColor: '#14532d',
      headerTextColor: '#ffffff',
      buttonPrimaryBg: '#15803d',
      buttonPrimaryText: '#ffffff',
      linkTextColor: '#166534',
      themeMode: 'light'
    }
  },
  {
    id: 'royal-plum',
    name: 'Executive Amethyst & Violet',
    description: 'Authoritative deep violet tones with lavender highlights for executive reporting.',
    previewColors: ['#3b0764', '#581c87', '#9333ea', '#faf5ff'],
    theme: {
      siteName: 'Southern Leyte State University',
      siteTagline: 'Extension Services Evaluation System & Decision Support',
      logoText: 'SLSU-Hinunangan',
      primaryColor: '#3b0764',
      secondaryColor: '#581c87',
      accentColor: '#9333ea',
      pageBgColor: '#faf5ff',
      cardBgColor: '#ffffff',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#3b0764',
      sidebarLogoColor: '#f472b6',
      sidebarLogoBg: '#3b0764',
      sidebarLogoTextColor: '#3b0764',
      sidebarLogoIcon: 'sparkles',
      sidebarLogoShape: 'rounded',
      sidebarActiveItemBg: '#3b0764',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#f3e8ff',
      headerBgColor: '#3b0764',
      headerTextColor: '#ffffff',
      buttonPrimaryBg: '#581c87',
      buttonPrimaryText: '#ffffff',
      linkTextColor: '#581c87',
      themeMode: 'light'
    }
  }
];

const DEFAULT_TYPOGRAPHY_CONFIG: TypographySettings = {
  baseFontSize: 1.0,
  pageTitleSize: 1.5,
  sectionHeadingSize: 1.125,
  bodyTextSize: 0.875,
  labelSize: 0.75,
  buttonTextSize: 0.75,
  tableTextSize: 0.75,
  navTextSize: 0.875,
  metricNumberSize: 1.875,
  smallTextSize: 0.6875,
  pageTitleColor: '#0f172a',
  sectionHeadingColor: '#1e293b',
  bodyTextColor: '#334155',
  mutedTextColor: '#64748b',
  labelTextColor: '#475569'
};

const FONT_COLOR_SCHEMES = [
  {
    id: 'institutional-slate',
    name: 'SLSU High-Legibility Slate',
    description: 'Clean dark slate and deep charcoal for optimal academic readability and contrast.',
    titleColor: '#0f172a',
    headingColor: '#1e293b',
    bodyColor: '#334155',
    mutedColor: '#64748b',
    labelColor: '#475569'
  },
  {
    id: 'forest-emerald',
    name: 'Institutional Forest & Charcoal',
    description: 'Deep forest green titles with clear charcoal body text reflecting university identity.',
    titleColor: '#022c22',
    headingColor: '#064e3b',
    bodyColor: '#1e293b',
    mutedColor: '#047857',
    labelColor: '#065f46'
  },
  {
    id: 'high-contrast-black',
    name: 'High Contrast Pure Black',
    description: 'Maximum contrast AAA standard for accessibility, presentations, and bright screens.',
    titleColor: '#000000',
    headingColor: '#111827',
    bodyColor: '#1f2937',
    mutedColor: '#4b5563',
    labelColor: '#374151'
  },
  {
    id: 'academic-navy',
    name: 'Scholarly Deep Navy',
    description: 'Prestigious university navy headlines with clean slate body text.',
    titleColor: '#1e1b4b',
    headingColor: '#312e81',
    bodyColor: '#1e293b',
    mutedColor: '#4f46e5',
    labelColor: '#4338ca'
  },
  {
    id: 'warm-espresso',
    name: 'Warm Espresso & Earth',
    description: 'Soft warm earth and dark coffee hues for reduced eye fatigue during long sessions.',
    titleColor: '#271c19',
    headingColor: '#451a03',
    bodyColor: '#292524',
    mutedColor: '#78716c',
    labelColor: '#57534e'
  }
];

const FONT_COLOR_SWATCHES = [
  { name: 'Pure Black', color: '#000000' },
  { name: 'Deep Slate', color: '#0f172a' },
  { name: 'Charcoal', color: '#1e293b' },
  { name: 'Muted Slate', color: '#334155' },
  { name: 'Forest Green', color: '#022c22' },
  { name: 'Pine Emerald', color: '#064e3b' },
  { name: 'Midnight Navy', color: '#1e1b4b' },
  { name: 'Royal Indigo', color: '#312e81' },
  { name: 'Deep Violet', color: '#3b0764' },
  { name: 'Dark Earth', color: '#271c19' },
  { name: 'Neutral Gray', color: '#4b5563' },
  { name: 'Muted Cool Gray', color: '#64748b' }
];

const LOGO_COLOR_SWATCHES = [
  { name: 'Institutional Gold', color: '#d97706' },
  { name: 'Warm Amber', color: '#f59e0b' },
  { name: 'Emerald Green', color: '#059669' },
  { name: 'Vibrant Mint', color: '#10b981' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Sky Cyan', color: '#06b6d4' },
  { name: 'Royal Blue', color: '#2563eb' },
  { name: 'Amethyst Purple', color: '#9333ea' },
  { name: 'Crimson Red', color: '#e11d48' },
  { name: 'Charcoal Slate', color: '#334155' }
];

const LOGO_BG_SWATCHES = [
  { name: 'Forest Emerald', color: '#022c22' },
  { name: 'Botanical Green', color: '#065f46' },
  { name: 'Midnight Navy', color: '#1e1b4b' },
  { name: 'Enterprise Slate', color: '#0f172a' },
  { name: 'Executive Violet', color: '#3b0764' },
  { name: 'Clean White', color: '#ffffff' },
  { name: 'Soft Pearl Slate', color: '#f1f5f9' },
  { name: 'Deep Amber', color: '#78350f' }
];

const LOGO_ICON_OPTIONS = [
  { id: 'building', label: 'University Building', icon: Building2 },
  { id: 'graduation', label: 'Graduation Cap', icon: GraduationCap },
  { id: 'award', label: 'Excellence Award', icon: Award },
  { id: 'shield', label: 'Quality Shield', icon: ShieldCheck },
  { id: 'landmark', label: 'Public Landmark', icon: Landmark },
  { id: 'book', label: 'Learning Book', icon: BookOpen },
  { id: 'sparkles', label: 'Innovation Stars', icon: Sparkles }
];

const LOGO_SHAPE_OPTIONS = [
  { id: 'rounded', label: 'Squircle / Rounded', class: 'rounded-xl' },
  { id: 'circle', label: 'Circular Badge', class: 'rounded-full' },
  { id: 'square', label: 'Square Badge', class: 'rounded-xs' }
];

// Sample Institutional Logo SVGs (encoded as Data URIs for offline portability)
const SAMPLE_INSTITUTIONAL_LOGOS = [
  {
    name: 'SLSU Institutional Seal Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23022c22" stroke="%23d97706" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="none" stroke="%23d97706" stroke-width="1.5" stroke-dasharray="3,2"/><path d="M50 20 L68 45 L58 45 L58 75 L42 75 L42 45 L32 45 Z" fill="%23d97706"/><polygon points="50,26 55,38 45,38" fill="%23ffffff"/><circle cx="50" cy="58" r="5" fill="%23ffffff"/></svg>'
  },
  {
    name: 'FCSIT IT Department Shield Emblem',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L85 24 L85 55 Q85 80 50 95 Q15 80 15 55 L15 24 Z" fill="%230f172a" stroke="%2338bdf8" stroke-width="3"/><rect x="35" y="35" width="30" height="22" rx="3" fill="%2338bdf8"/><path d="M42 62 L58 62 M50 57 L50 65" stroke="%2338bdf8" stroke-width="3"/><circle cx="50" cy="46" r="4" fill="%230f172a"/></svg>'
  },
  {
    name: 'Hinunangan Community Outreach Seal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%2314532d" stroke="%2310b981" stroke-width="3"/><path d="M50 22 C65 22 75 35 75 50 C75 70 50 82 50 82 C50 82 25 70 25 50 C25 35 35 22 50 22 Z" fill="%2310b981"/><circle cx="50" cy="44" r="8" fill="%23ffffff"/><path d="M42 60 Q50 54 58 60" stroke="%23ffffff" stroke-width="3" fill="none"/></svg>'
  }
];

export const WebsiteAppearanceManager: React.FC = () => {
  const { theme, updateTheme, resetTheme, addToast, role } = useApp();

  const [activeTab, setActiveTab] = useState<'sidebar' | 'typography' | 'colors'>('sidebar');
  const [logoSourceTab, setLogoSourceTab] = useState<'upload' | 'url' | 'preset'>('upload');
  
  const [formTheme, setFormTheme] = useState<WebsiteTheme>({
    ...theme,
    typography: theme.typography || { ...DEFAULT_TYPOGRAPHY_CONFIG }
  });
  const [selectedPreset, setSelectedPreset] = useState<string>('slsu-official');
  const [isSaving, setIsSaving] = useState(false);
  const [previewSidebarCollapsed, setPreviewSidebarCollapsed] = useState(false);

  // File upload & URL state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<{
    dataUrl: string;
    name: string;
    size: number;
  } | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlLabelInput, setUrlLabelInput] = useState('');
  const [urlTestingPreview, setUrlTestingPreview] = useState<string | null>(null);
  const [urlError, setUrlError] = useState(false);

  // Sync state if external theme changes
  useEffect(() => {
    setFormTheme({
      ...theme,
      typography: theme.typography || { ...DEFAULT_TYPOGRAPHY_CONFIG }
    });
  }, [theme]);

  const currentTypo = formTheme.typography || DEFAULT_TYPOGRAPHY_CONFIG;

  const handleApplyPreset = async (preset: PresetTheme) => {
    if (role !== 'admin') {
      addToast({ type: 'info', title: 'Permission Restricted', description: 'Only administrators can modify design presets.' });
      return;
    }
    setSelectedPreset(preset.id);
    const updated = { ...formTheme, ...preset.theme };
    setFormTheme(updated);
    await updateTheme(preset.theme, false);
    addToast({
      type: 'info',
      title: 'Preset Applied',
      description: `Applied palette: ${preset.name}`
    });
  };

  const handleSaveTheme = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (role !== 'admin') {
      addToast({ type: 'info', title: 'Permission Restricted', description: 'Only administrators can save global appearance settings.' });
      return;
    }

    setIsSaving(true);
    try {
      await updateTheme(formTheme, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setFormTheme({
      ...theme,
      typography: theme.typography || { ...DEFAULT_TYPOGRAPHY_CONFIG }
    });
    setUploadedFilePreview(null);
    setUrlTestingPreview(null);
    setUrlInput('');
    setUrlLabelInput('');
    addToast({
      type: 'info',
      title: 'Changes Cancelled',
      description: 'Restored current saved appearance configuration.'
    });
  };

  const handleReset = async () => {
    if (role !== 'admin') return;
    if (confirm('Reset website appearance, sidebar logo styling, and typography to default SLSU standards?')) {
      await resetTheme();
      const defaultPreset = PRESET_THEMES[0];
      setSelectedPreset(defaultPreset.id);
      setFormTheme({
        ...defaultPreset.theme as WebsiteTheme,
        typography: { ...DEFAULT_TYPOGRAPHY_CONFIG }
      });
      setUploadedFilePreview(null);
      setUrlTestingPreview(null);
    }
  };

  const handleResetSidebarDefaults = () => {
    setFormTheme(prev => ({
      ...prev,
      sidebarLogoType: 'icon',
      sidebarLogoUrl: '',
      sidebarLogoColor: '#d97706',
      sidebarLogoBg: '#022c22',
      sidebarLogoTextColor: '#1e293b',
      sidebarLogoIcon: 'building',
      sidebarLogoShape: 'rounded',
      sidebarBgColor: '#ffffff',
      sidebarTextColor: '#1e293b',
      sidebarActiveItemBg: '#022c22',
      sidebarActiveItemText: '#ffffff',
      sidebarBorderColor: '#e2e8f0'
    }));
    setUploadedFilePreview(null);
    setUrlTestingPreview(null);
    addToast({
      type: 'info',
      title: 'Sidebar Reset to Defaults',
      description: 'Restored SLSU institutional forest green badge with academic gold logo icon.'
    });
  };

  const handleResetTypography = () => {
    setFormTheme(prev => ({
      ...prev,
      typography: { ...DEFAULT_TYPOGRAPHY_CONFIG }
    }));
    addToast({
      type: 'info',
      title: 'Typography Reset',
      description: 'Reset font sizes to default 1.0x institutional standards.'
    });
  };

  const applyScalePreset = (factor: number) => {
    setFormTheme(prev => ({
      ...prev,
      typography: {
        baseFontSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.baseFontSize * factor).toFixed(3)),
        pageTitleSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.pageTitleSize * factor).toFixed(3)),
        sectionHeadingSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.sectionHeadingSize * factor).toFixed(3)),
        bodyTextSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.bodyTextSize * factor).toFixed(3)),
        labelSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.labelSize * factor).toFixed(3)),
        buttonTextSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.buttonTextSize * factor).toFixed(3)),
        tableTextSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.tableTextSize * factor).toFixed(3)),
        navTextSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.navTextSize * factor).toFixed(3)),
        metricNumberSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.metricNumberSize * factor).toFixed(3)),
        smallTextSize: Number((DEFAULT_TYPOGRAPHY_CONFIG.smallTextSize * factor).toFixed(3)),
      }
    }));
  };

  const updateField = (field: keyof WebsiteTheme, val: any) => {
    setFormTheme(prev => ({ ...prev, [field]: val }));
  };

  const updateTypoField = (field: keyof TypographySettings, val: number) => {
    setFormTheme(prev => ({
      ...prev,
      typography: {
        ...(prev.typography || DEFAULT_TYPOGRAPHY_CONFIG),
        [field]: val
      }
    }));
  };

  const updateTypoColorField = (field: keyof TypographySettings, val: string) => {
    setFormTheme(prev => {
      const updatedTypo = {
        ...(prev.typography || DEFAULT_TYPOGRAPHY_CONFIG),
        [field]: val
      };
      return {
        ...prev,
        typography: updatedTypo,
        fontColorTitle: field === 'pageTitleColor' ? val : (prev.fontColorTitle || '#0f172a'),
        fontColorHeading: field === 'sectionHeadingColor' ? val : (prev.fontColorHeading || '#1e293b'),
        fontColorBody: field === 'bodyTextColor' ? val : (prev.fontColorBody || '#334155'),
        fontColorMuted: field === 'mutedTextColor' ? val : (prev.fontColorMuted || '#64748b'),
        fontColorLabel: field === 'labelTextColor' ? val : (prev.fontColorLabel || '#475569'),
      };
    });
  };

  const applyFontColorScheme = (scheme: typeof FONT_COLOR_SCHEMES[0]) => {
    setFormTheme(prev => ({
      ...prev,
      fontColorTitle: scheme.titleColor,
      fontColorHeading: scheme.headingColor,
      fontColorBody: scheme.bodyColor,
      fontColorMuted: scheme.mutedColor,
      fontColorLabel: scheme.labelColor,
      typography: {
        ...(prev.typography || DEFAULT_TYPOGRAPHY_CONFIG),
        pageTitleColor: scheme.titleColor,
        sectionHeadingColor: scheme.headingColor,
        bodyTextColor: scheme.bodyColor,
        mutedTextColor: scheme.mutedColor,
        labelTextColor: scheme.labelColor
      }
    }));
    addToast({
      type: 'info',
      title: 'Font Color Palette Applied',
      description: `Applied "${scheme.name}" across system page titles, headings, body text, and labels.`
    });
  };

  const handleResetFontColors = () => {
    setFormTheme(prev => ({
      ...prev,
      fontColorTitle: '#0f172a',
      fontColorHeading: '#1e293b',
      fontColorBody: '#334155',
      fontColorMuted: '#64748b',
      fontColorLabel: '#475569',
      typography: {
        ...(prev.typography || DEFAULT_TYPOGRAPHY_CONFIG),
        pageTitleColor: '#0f172a',
        sectionHeadingColor: '#1e293b',
        bodyTextColor: '#334155',
        mutedTextColor: '#64748b',
        labelTextColor: '#475569'
      }
    }));
    addToast({
      type: 'info',
      title: 'Font Colors Restored',
      description: 'Reset typography font colors to standard high-contrast charcoal defaults.'
    });
  };

  // ==========================================
  // LOGO FILE UPLOAD & URL HANDLING WITH HISTORY
  // ==========================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      addToast({
        type: 'error',
        title: 'Unsupported File Format',
        description: 'Please upload an image file (SVG, PNG, JPG, WEBP, ICO).'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedFilePreview({
        dataUrl: result,
        name: file.name,
        size: file.size
      });
      addToast({
        type: 'info',
        title: 'File Ready for Preview',
        description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB). Click "Apply Uploaded Logo" to use it.`
      });
    };
    reader.onerror = () => {
      addToast({
        type: 'error',
        title: 'File Read Failed',
        description: 'Could not read the selected image file.'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUploadedLogo = () => {
    if (!uploadedFilePreview) return;

    const newHistoryItem: LogoHistoryItem = {
      id: `logo-hist-${Date.now()}`,
      sourceType: 'file',
      value: uploadedFilePreview.dataUrl,
      name: uploadedFilePreview.name,
      timestamp: new Date().toISOString(),
      previewUrl: uploadedFilePreview.dataUrl,
      sizeBytes: uploadedFilePreview.size
    };

    const currentHistory = formTheme.sidebarLogoHistory || [];
    // Prepend to history, avoiding duplicate identical values
    const filteredHistory = currentHistory.filter(h => h.value !== uploadedFilePreview.dataUrl);
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 15);

    setFormTheme(prev => ({
      ...prev,
      sidebarLogoType: 'image',
      sidebarLogoUrl: uploadedFilePreview.dataUrl,
      sidebarLogoHistory: updatedHistory
    }));

    addToast({
      type: 'success',
      title: 'Logo Imported & Applied',
      description: `Applied ${uploadedFilePreview.name} to sidebar and saved to history.`
    });
  };

  const handleTestUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      addToast({ type: 'info', title: 'URL Required', description: 'Please enter an image web URL or data URI.' });
      return;
    }
    setUrlError(false);
    setUrlTestingPreview(trimmed);
  };

  const handleApplyUrlLogo = (customUrl?: string, customName?: string) => {
    const targetUrl = (customUrl || urlInput).trim();
    const targetName = customName || urlLabelInput.trim() || targetUrl.split('/').pop()?.split('?')[0] || 'Web Image Logo';

    if (!targetUrl) {
      addToast({ type: 'info', title: 'URL Required', description: 'Please enter an image web URL.' });
      return;
    }

    const newHistoryItem: LogoHistoryItem = {
      id: `logo-hist-${Date.now()}`,
      sourceType: 'url',
      value: targetUrl,
      name: targetName,
      timestamp: new Date().toISOString(),
      previewUrl: targetUrl
    };

    const currentHistory = formTheme.sidebarLogoHistory || [];
    const filteredHistory = currentHistory.filter(h => h.value !== targetUrl);
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 15);

    setFormTheme(prev => ({
      ...prev,
      sidebarLogoType: 'image',
      sidebarLogoUrl: targetUrl,
      sidebarLogoHistory: updatedHistory
    }));

    setUrlTestingPreview(targetUrl);

    addToast({
      type: 'success',
      title: 'URL Logo Applied',
      description: `Applied ${targetName} to sidebar and saved to history.`
    });
  };

  const handleApplyPresetVectorIcon = (iconId: string, iconLabel: string) => {
    const newHistoryItem: LogoHistoryItem = {
      id: `logo-hist-${Date.now()}`,
      sourceType: 'preset',
      value: iconId,
      name: iconLabel,
      timestamp: new Date().toISOString()
    };

    const currentHistory = formTheme.sidebarLogoHistory || [];
    const filteredHistory = currentHistory.filter(h => !(h.sourceType === 'preset' && h.value === iconId));
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 15);

    setFormTheme(prev => ({
      ...prev,
      sidebarLogoType: 'icon',
      sidebarLogoIcon: iconId as any,
      sidebarLogoHistory: updatedHistory
    }));

    addToast({
      type: 'info',
      title: 'Vector Icon Selected',
      description: `Switched to vector icon: ${iconLabel}`
    });
  };

  const handleSelectHistoryItem = (item: LogoHistoryItem) => {
    if (item.sourceType === 'preset') {
      setFormTheme(prev => ({
        ...prev,
        sidebarLogoType: 'icon',
        sidebarLogoIcon: item.value as any
      }));
    } else {
      setFormTheme(prev => ({
        ...prev,
        sidebarLogoType: 'image',
        sidebarLogoUrl: item.value
      }));
    }

    addToast({
      type: 'success',
      title: 'Restored Logo from History',
      description: `Applied "${item.name}" to sidebar.`
    });
  };

  const handleRemoveHistoryItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = (formTheme.sidebarLogoHistory || []).filter(h => h.id !== itemId);
    setFormTheme(prev => ({
      ...prev,
      sidebarLogoHistory: updated
    }));
    addToast({
      type: 'info',
      title: 'Removed from History',
      description: 'Logo entry deleted from historical roster.'
    });
  };

  const handleClearHistory = () => {
    if (confirm('Clear all logo history entries? This cannot be undone.')) {
      setFormTheme(prev => ({
        ...prev,
        sidebarLogoHistory: []
      }));
      addToast({
        type: 'info',
        title: 'Logo History Cleared',
        description: 'All historical logo imports have been cleared.'
      });
    }
  };

  const handleRevertToVectorIcon = () => {
    setFormTheme(prev => ({
      ...prev,
      sidebarLogoType: 'icon'
    }));
    addToast({
      type: 'info',
      title: 'Switched to Vector Icon',
      description: 'Sidebar now displays the university landmark vector icon.'
    });
  };

  // Helper to render preview icon
  const renderPreviewLogoIcon = (iconId?: string) => {
    switch (iconId) {
      case 'graduation':
        return <GraduationCap className="w-5 h-5 shrink-0" />;
      case 'award':
        return <Award className="w-5 h-5 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 shrink-0" />;
      case 'landmark':
        return <Landmark className="w-5 h-5 shrink-0" />;
      case 'book':
        return <BookOpen className="w-5 h-5 shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 shrink-0" />;
      case 'building':
      default:
        return <Building2 className="w-5 h-5 shrink-0" />;
    }
  };

  const currentSidebarLogoColor = formTheme.sidebarLogoColor || formTheme.accentColor || '#d97706';
  const currentSidebarLogoBg = formTheme.sidebarLogoBg || formTheme.primaryColor || '#022c22';
  const currentSidebarLogoTextColor = formTheme.sidebarLogoTextColor || formTheme.sidebarTextColor || '#1e293b';
  const currentSidebarLogoShape = formTheme.sidebarLogoShape || 'rounded';
  const currentSidebarLogoIcon = formTheme.sidebarLogoIcon || 'building';
  const currentSidebarBg = formTheme.sidebarBgColor || '#ffffff';
  const currentSidebarTextColor = formTheme.sidebarTextColor || '#1e293b';
  const currentActiveBg = formTheme.sidebarActiveItemBg || formTheme.primaryColor || '#022c22';
  const currentActiveText = formTheme.sidebarActiveItemText || '#ffffff';
  const currentBorderColor = formTheme.sidebarBorderColor || '#e2e8f0';

  const previewTitleColor = currentTypo.pageTitleColor || formTheme.fontColorTitle || '#0f172a';
  const previewHeadingColor = currentTypo.sectionHeadingColor || formTheme.fontColorHeading || '#1e293b';
  const previewBodyColor = currentTypo.bodyTextColor || formTheme.fontColorBody || '#334155';
  const previewMutedColor = currentTypo.mutedTextColor || formTheme.fontColorMuted || '#64748b';
  const previewLabelColor = currentTypo.labelTextColor || formTheme.fontColorLabel || '#475569';

  const shapeClass = currentSidebarLogoShape === 'circle' 
    ? 'rounded-full' 
    : currentSidebarLogoShape === 'square' 
      ? 'rounded-xs' 
      : 'rounded-xl';

  const historyItems = formTheme.sidebarLogoHistory || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <PanelLeft className="w-5 h-5 text-emerald-800" />
              <span>Sidebar Configuration & Logo Manager</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Protected</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Import files or paste URLs for custom logos with history tracking, adjust emblem colors, and customize sidebar surfaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancelChanges}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            title="Discard unsaved changes"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveTheme()}
            disabled={isSaving || role !== 'admin'}
            className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving System-Wide...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs between Sidebar Configuration, Typography and Colors */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('sidebar')}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'sidebar'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PanelLeft className="w-4 h-4 text-emerald-400" />
          <span>Sidebar & Logo Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'typography'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4 text-amber-300" />
          <span>Typography, Font Sizing & Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'colors'
              ? 'bg-emerald-950 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>Brand Colors & Surfaces</span>
        </button>
      </div>

      {/* TAB 1: SIDEBAR & LOGO CONFIGURATION */}
      {activeTab === 'sidebar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">

            {/* SECTION 1: LOGO SOURCE (IMPORT FILES, URL, OR VECTOR GLYPHS) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-800" />
                    <span>Logo Source: Import File or Image URL</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload an institutional seal/image file from your computer or paste an external URL. All imports are saved in your Logo History.
                  </p>
                </div>

                {/* Status indicator of active logo type */}
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    formTheme.sidebarLogoType === 'image' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    {formTheme.sidebarLogoType === 'image' ? 'Custom Image Active' : 'Vector Icon Active'}
                  </span>
                </div>
              </div>

              {/* Source Mode Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setLogoSourceTab('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    logoSourceTab === 'upload'
                      ? 'bg-emerald-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoSourceTab('url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    logoSourceTab === 'url'
                      ? 'bg-emerald-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogoSourceTab('preset')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    logoSourceTab === 'preset'
                      ? 'bg-emerald-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Built-in Glyphs</span>
                </button>
              </div>

              {/* SOURCE OPTION 1: FILE UPLOAD */}
              {logoSourceTab === 'upload' && (
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.svg,.png,.jpg,.jpeg,.webp,.ico"
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-xl p-6 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        Click to browse or drop university seal file
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports SVG, PNG (transparent recommended), JPG, WEBP, ICO (Max 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded File Ready State */}
                  {uploadedFilePreview && (
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 shadow-xs border shrink-0"
                          style={{ backgroundColor: currentSidebarLogoBg }}
                        >
                          <img 
                            src={uploadedFilePreview.dataUrl} 
                            alt={uploadedFilePreview.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 truncate max-w-xs">
                            {uploadedFilePreview.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {(uploadedFilePreview.size / 1024).toFixed(1)} KB • Base64 Ready
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadedFilePreview(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyUploadedLogo}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply Uploaded Logo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOURCE OPTION 2: IMAGE URL */}
              {logoSourceTab === 'url' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-xs text-slate-900 mb-1">
                        Image Web URL (HTTPS or Data URI)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => { setUrlInput(e.target.value); setUrlTestingPreview(null); }}
                          placeholder="https://example.edu.ph/logos/university-seal.png"
                          className="flex-1 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleTestUrl}
                          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs whitespace-nowrap cursor-pointer"
                        >
                          Test Preview
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-xs text-slate-700 mb-1">
                        Logo Label / Title (Optional for History)
                      </label>
                      <input
                        type="text"
                        value={urlLabelInput}
                        onChange={(e) => setUrlLabelInput(e.target.value)}
                        placeholder="e.g. SLSU Hinunangan Official Crest"
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* URL Testing Preview Box */}
                  {urlTestingPreview && (
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 shadow-xs border shrink-0 overflow-hidden"
                          style={{ backgroundColor: currentSidebarLogoBg }}
                        >
                          <img 
                            src={urlTestingPreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                            onError={() => setUrlError(true)}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">
                            {urlError ? 'Failed to load image from URL' : 'Image URL verified'}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate max-w-sm font-mono">
                            {urlTestingPreview}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyUrlLogo()}
                        disabled={urlError}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply URL Logo</span>
                      </button>
                    </div>
                  )}

                  {/* Sample Institutional Links */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      1-Click Institutional Emblems:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_INSTITUTIONAL_LOGOS.map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => handleApplyUrlLogo(sample.url, sample.name)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-700 text-[11px] font-semibold flex items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <div 
                            className="w-5 h-5 rounded flex items-center justify-center p-0.5"
                            style={{ backgroundColor: currentSidebarLogoBg }}
                          >
                            <img src={sample.url} alt="" className="w-full h-full object-contain" />
                          </div>
                          <span>{sample.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SOURCE OPTION 3: BUILT-IN VECTOR GLYPHS */}
              {logoSourceTab === 'preset' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Select a crisp vector icon glyph that responds directly to the custom Logo Color picker.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LOGO_ICON_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      const isSelected = formTheme.sidebarLogoType === 'icon' && currentSidebarLogoIcon === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleApplyPresetVectorIcon(opt.id, opt.label)}
                          className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer text-xs ${
                            isSelected
                              ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                            style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: LOGO HISTORY ROSTER */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-800" />
                    <span>Logo Icon History ({historyItems.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Previously uploaded files and configured URLs. 1-click restore any previous logo without re-uploading.
                  </p>
                </div>

                {historyItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {historyItems.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
                  <History className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No logo history recorded yet</p>
                  <p className="text-[11px] text-slate-400">
                    Uploaded image files and configured URLs will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                  {historyItems.map((item) => {
                    const isCurrentlyActive = 
                      (item.sourceType === 'preset' && formTheme.sidebarLogoType === 'icon' && formTheme.sidebarLogoIcon === item.value) ||
                      (item.sourceType !== 'preset' && formTheme.sidebarLogoType === 'image' && formTheme.sidebarLogoUrl === item.value);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistoryItem(item)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrentlyActive
                            ? 'border-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-800/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail */}
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border overflow-hidden p-1"
                            style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                          >
                            {item.sourceType === 'preset' ? (
                              renderPreviewLogoIcon(item.value)
                            ) : (
                              <img 
                                src={item.value} 
                                alt="" 
                                className="w-full h-full object-contain" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 truncate block">
                                {item.name}
                              </span>
                              {isCurrentlyActive && (
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-800 text-white font-extrabold text-[9px] uppercase shrink-0">
                                  Active
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                              <span className="uppercase font-mono bg-slate-100 px-1 rounded text-slate-600">
                                {item.sourceType}
                              </span>
                              <span>
                                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delete history button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 3: EMBLEM BADGE COLOR & STYLING */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-800" />
                    <span>Sidebar Logo Badge & Surface Styling</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fine-tune the emblem background, icon accent colors, badge shape, and typography.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSidebarDefaults}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Default SLSU</span>
                </button>
              </div>

              {/* 1. Logo Icon Color */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-xs text-slate-900">
                      Sidebar Logo Accent Color (Vector Glyphs & SVG Highlights)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Used for vector emblem icons, badge highlights, and active sidebar link accents.
                    </p>
                  </div>
                  <span 
                    className="px-2.5 py-1 rounded text-xs font-mono font-bold border shadow-xs"
                    style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                  >
                    {currentSidebarLogoColor}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={currentSidebarLogoColor}
                    onChange={(e) => updateField('sidebarLogoColor', e.target.value)}
                    className="w-12 h-10 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                    title="Choose Logo Color"
                  />
                  <input
                    type="text"
                    value={currentSidebarLogoColor}
                    onChange={(e) => updateField('sidebarLogoColor', e.target.value)}
                    className="w-32 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900 uppercase"
                    placeholder="#D97706"
                  />
                  <span className="text-[11px] text-slate-500">
                    Hex Color Code
                  </span>
                </div>

                {/* Quick Swatches for Logo Color */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                    Recommended Logo Accent Palettes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOGO_COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => updateField('sidebarLogoColor', swatch.color)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentSidebarLogoColor.toLowerCase() === swatch.color.toLowerCase()
                            ? 'border-slate-800 bg-white ring-2 ring-slate-400 font-bold'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={swatch.name}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: swatch.color }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Logo Badge Background Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-xs text-slate-900">
                      Logo Badge Container Background
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Background surface of the square or circle badge containing the logo icon or image.
                    </p>
                  </div>
                  <span 
                    className="px-2.5 py-1 rounded text-xs font-mono font-bold border shadow-xs"
                    style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                  >
                    {currentSidebarLogoBg}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={currentSidebarLogoBg}
                    onChange={(e) => updateField('sidebarLogoBg', e.target.value)}
                    className="w-12 h-10 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                    title="Choose Logo Background Color"
                  />
                  <input
                    type="text"
                    value={currentSidebarLogoBg}
                    onChange={(e) => updateField('sidebarLogoBg', e.target.value)}
                    className="w-32 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900 uppercase"
                    placeholder="#022C22"
                  />
                  <span className="text-[11px] text-slate-500">
                    Hex Color Code
                  </span>
                </div>

                {/* Quick Swatches for Logo Background */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                    Recommended Badge Surfaces:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOGO_BG_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.color}
                        type="button"
                        onClick={() => updateField('sidebarLogoBg', swatch.color)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentSidebarLogoBg.toLowerCase() === swatch.color.toLowerCase()
                            ? 'border-slate-800 bg-white ring-2 ring-slate-400 font-bold'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={swatch.name}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: swatch.color }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Logo Badge Shape & Wordmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-xs text-slate-900 mb-1.5">
                    Logo Badge Shape
                  </label>
                  <div className="space-y-2">
                    {LOGO_SHAPE_OPTIONS.map((shape) => {
                      const isSelected = currentSidebarLogoShape === shape.id;
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => updateField('sidebarLogoShape', shape.id)}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer text-xs ${
                            isSelected
                              ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div 
                              className={`w-6 h-6 ${shape.class} flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs`}
                              style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                            >
                              ★
                            </div>
                            <span>{shape.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wordmark Titles */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-xs text-slate-700 mb-1">
                      Campus / Wordmark Title Text
                    </label>
                    <input
                      type="text"
                      value={formTheme.logoText || 'SLSU-Hinunangan'}
                      onChange={(e) => updateField('logoText', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-semibold"
                      placeholder="SLSU-Hinunangan"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-xs text-slate-700 mb-1">
                      Wordmark Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentSidebarLogoTextColor}
                        onChange={(e) => updateField('sidebarLogoTextColor', e.target.value)}
                        className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={currentSidebarLogoTextColor}
                        onChange={(e) => updateField('sidebarLogoTextColor', e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                        placeholder="#1E293B"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: SIDEBAR CONTAINER & MENU COLORS */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layout className="w-4 h-4 text-emerald-800" />
                <span>Sidebar Background & Menu Surfaces</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Sidebar Background Color */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sidebar Container Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentSidebarBg}
                      onChange={(e) => updateField('sidebarBgColor', e.target.value)}
                      className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentSidebarBg}
                      onChange={(e) => updateField('sidebarBgColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {['#ffffff', '#f8fafc', '#0f172a', '#022c22'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateField('sidebarBgColor', c)}
                        className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer shadow-xs"
                        style={{ backgroundColor: c }}
                        title={`Set background to ${c}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar Menu Text Color */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Menu Items Inactive Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentSidebarTextColor}
                      onChange={(e) => updateField('sidebarTextColor', e.target.value)}
                      className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentSidebarTextColor}
                      onChange={(e) => updateField('sidebarTextColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Active Tab Background Color */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Active Nav Item Highlight Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentActiveBg}
                      onChange={(e) => updateField('sidebarActiveItemBg', e.target.value)}
                      className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentActiveBg}
                      onChange={(e) => updateField('sidebarActiveItemBg', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Active Tab Text Color */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Active Nav Item Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentActiveText}
                      onChange={(e) => updateField('sidebarActiveItemText', e.target.value)}
                      className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentActiveText}
                      onChange={(e) => updateField('sidebarActiveItemText', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar Right Divider Border */}
              <div className="pt-2">
                <label className="block font-semibold text-xs text-slate-700 mb-1">
                  Sidebar Border / Separator Color
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="color"
                    value={currentBorderColor}
                    onChange={(e) => updateField('sidebarBorderColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentBorderColor}
                    onChange={(e) => updateField('sidebarBorderColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions for Sidebar Tab */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetSidebarDefaults}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Reset Sidebar to Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelChanges}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTheme()}
                  disabled={isSaving || role !== 'admin'}
                  className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Sidebar...' : 'Save Sidebar Configuration'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Sidebar Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs sticky top-20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-800" />
                    <span>Live Sidebar Preview</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Real-time simulation of the navigation sidebar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewSidebarCollapsed(!previewSidebarCollapsed)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                  title="Toggle collapsed/expanded preview"
                >
                  {previewSidebarCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                  <span>{previewSidebarCollapsed ? 'Expanded View' : 'Collapsed View'}</span>
                </button>
              </div>

              {/* Simulated Sidebar Frame */}
              <div 
                className="rounded-xl border shadow-xs overflow-hidden transition-all duration-200"
                style={{ 
                  backgroundColor: currentSidebarBg, 
                  color: currentSidebarTextColor,
                  borderColor: currentBorderColor,
                  width: previewSidebarCollapsed ? '76px' : '100%',
                  margin: previewSidebarCollapsed ? '0 auto' : '0'
                }}
              >
                {/* Top Brand Header in Preview */}
                <div 
                  className={`h-16 flex items-center border-b px-3 ${previewSidebarCollapsed ? 'justify-center relative' : 'justify-between'}`}
                  style={{ borderColor: currentBorderColor }}
                >
                  {previewSidebarCollapsed ? (
                    <div 
                      className={`w-10 h-10 ${shapeClass} flex items-center justify-center font-bold shadow-xs transition-transform hover:scale-105 cursor-pointer relative overflow-hidden`}
                      style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                      title={formTheme.logoText || 'SLSU-Hinunangan'}
                    >
                      {formTheme.sidebarLogoType === 'image' && formTheme.sidebarLogoUrl ? (
                        <img 
                          src={formTheme.sidebarLogoUrl} 
                          alt="Logo" 
                          className="w-7 h-7 object-contain" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        renderPreviewLogoIcon(currentSidebarLogoIcon)
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                      <div 
                        className={`w-9 h-9 ${shapeClass} flex items-center justify-center font-bold shrink-0 shadow-xs transition-colors overflow-hidden`}
                        style={{ backgroundColor: currentSidebarLogoBg, color: currentSidebarLogoColor }}
                      >
                        {formTheme.sidebarLogoType === 'image' && formTheme.sidebarLogoUrl ? (
                          <img 
                            src={formTheme.sidebarLogoUrl} 
                            alt="Logo" 
                            className="w-6 h-6 object-contain" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          renderPreviewLogoIcon(currentSidebarLogoIcon)
                        )}
                      </div>
                      <div className="flex flex-col truncate min-w-0">
                        <span 
                          className="font-bold text-sm tracking-tight truncate leading-tight"
                          style={{ color: currentSidebarLogoTextColor }}
                        >
                          {formTheme.logoText || 'SLSU-Hinunangan'}
                        </span>
                        <span 
                          className="text-[10px] font-semibold tracking-wide uppercase truncate opacity-80"
                          style={{ color: currentSidebarLogoTextColor }}
                        >
                          {formTheme.siteTagline ? 'Evaluation System' : 'Extension Evaluation'}
                        </span>
                      </div>
                    </div>
                  )}

                  {!previewSidebarCollapsed && (
                    <div className="p-1 rounded-md text-slate-400">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* User Role Indicator in Preview */}
                {!previewSidebarCollapsed && (
                  <div className="px-3.5 py-2.5 bg-slate-50/70 border-b" style={{ borderColor: currentBorderColor }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Current Role
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                      Dr. Jane C. Monfort
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      Campus Quality Assurance Director
                    </p>
                  </div>
                )}

                {/* Simulated Menu Items */}
                <div className="p-2 space-y-1">
                  {/* Item 1: Active item */}
                  <div
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold shadow-xs ${
                      previewSidebarCollapsed ? 'justify-center px-1.5' : ''
                    }`}
                    style={{ backgroundColor: currentActiveBg, color: currentActiveText }}
                  >
                    <div style={{ color: currentSidebarLogoColor }}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    {!previewSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span>Dashboard</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                          Live
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item 2: Evaluation Activities */}
                  <div
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100/50 ${
                      previewSidebarCollapsed ? 'justify-center px-1.5' : ''
                    }`}
                    style={{ color: currentSidebarTextColor }}
                  >
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {!previewSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span>Evaluation Activities</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                          5
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item 3: Evaluation Form Builder */}
                  <div
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100/50 ${
                      previewSidebarCollapsed ? 'justify-center px-1.5' : ''
                    }`}
                    style={{ color: currentSidebarTextColor }}
                  >
                    <Award className="w-4 h-4 text-slate-400" />
                    {!previewSidebarCollapsed && (
                      <span>Form Builder</span>
                    )}
                  </div>

                  {/* Item 4: Website Appearance (active indicator) */}
                  <div
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold border border-dashed border-emerald-300 bg-emerald-50/50 text-emerald-950 ${
                      previewSidebarCollapsed ? 'justify-center px-1.5' : ''
                    }`}
                  >
                    <Palette className="w-4 h-4 text-emerald-700" />
                    {!previewSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span>Sidebar & Appearance</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold bg-emerald-800 text-white">
                          Current
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Note in Preview */}
                <div className="p-3 border-t bg-slate-50/50 text-center" style={{ borderColor: currentBorderColor }}>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Southern Leyte State University
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Hinunangan Campus • BSIT
                  </p>
                </div>
              </div>

              {/* Informational Card */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Immediate Live Application</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  Imported files, image URLs, and history restorations update instantly in the preview and across the interface. Click <strong className="text-slate-900">Save Changes</strong> to persist the logo across all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY SETTINGS */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          {/* Quick Scale Presets */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-800" />
                  <span>1-Click Typographic Scale Presets</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select a standardized font sizing scale or fine-tune individual element sizes below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetTypography}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Default Standard</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Compact Scale', factor: 0.9, desc: 'High data density for smaller laptops' },
                { label: 'Standard Scale', factor: 1.0, desc: 'Official SLSU default typography' },
                { label: 'Comfortable Scale', factor: 1.1, desc: 'Spacious modern layout with enhanced scanning' },
                { label: 'Large / Accessible', factor: 1.2, desc: 'High legibility for presentations & touch devices' }
              ].map(preset => {
                const isActive = Math.abs(currentTypo.baseFontSize - preset.factor) < 0.03;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyScalePreset(preset.factor)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{preset.label}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{preset.desc}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 mt-1.5 block">
                      {preset.factor}x Ratio
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Typographic Preview Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-800" />
                  <span>Live Typography System Preview</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Instant visual preview reflecting your adjustments without requiring a page reload.
                </p>
              </div>

              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                Base: {currentTypo.baseFontSize}rem ({Math.round(currentTypo.baseFontSize * 16)}px)
              </span>
            </div>

            {/* Simulated UI Area */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-5">
              <div className="space-y-1">
                <span 
                  className="font-bold uppercase tracking-wider block"
                  style={{ fontSize: `${currentTypo.smallTextSize}rem`, color: previewMutedColor }}
                >
                  SOUTHERN LEYTE STATE UNIVERSITY • HINUNANGAN CAMPUS
                </span>
                <h1 
                  className="font-extrabold tracking-tight leading-tight"
                  style={{ fontSize: `${currentTypo.pageTitleSize}rem`, color: previewTitleColor }}
                >
                  Extension Services Quality Evaluation & Analytics
                </h1>
                <p 
                  className="leading-relaxed max-w-3xl"
                  style={{ fontSize: `${currentTypo.bodyTextSize}rem`, color: previewBodyColor }}
                >
                  Comprehensive performance auditing across client satisfaction, trainer mastery, facilities sufficiency, and socio-economic community impact under AACCUP accreditation standards.
                </p>
              </div>

              {/* Metric Card Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span 
                    className="font-semibold block uppercase"
                    style={{ fontSize: `${currentTypo.labelSize}rem`, color: previewLabelColor }}
                  >
                    Overall Satisfaction Mean
                  </span>
                  <div 
                    className="font-extrabold text-emerald-900 font-mono my-0.5"
                    style={{ fontSize: `${currentTypo.metricNumberSize}rem` }}
                  >
                    4.82 / 5.0
                  </div>
                  <span 
                    className="font-medium"
                    style={{ fontSize: `${currentTypo.smallTextSize}rem`, color: previewMutedColor }}
                  >
                    ★ Outstanding (96.4% Rating)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span 
                    className="font-semibold block uppercase"
                    style={{ fontSize: `${currentTypo.labelSize}rem`, color: previewLabelColor }}
                  >
                    Total Participant Responses
                  </span>
                  <div 
                    className="font-extrabold font-mono my-0.5"
                    style={{ fontSize: `${currentTypo.metricNumberSize}rem`, color: previewTitleColor }}
                  >
                    328 Audited
                  </div>
                  <span 
                    className="font-medium"
                    style={{ fontSize: `${currentTypo.smallTextSize}rem`, color: previewMutedColor }}
                  >
                    100% Cryptographic Hash Verified
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span 
                    className="font-semibold block uppercase"
                    style={{ fontSize: `${currentTypo.labelSize}rem`, color: previewLabelColor }}
                  >
                    Accreditation Turnout Rate
                  </span>
                  <div 
                    className="font-extrabold text-amber-700 font-mono my-0.5"
                    style={{ fontSize: `${currentTypo.metricNumberSize}rem` }}
                  >
                    93.7% Target
                  </div>
                  <span 
                    className="font-medium"
                    style={{ fontSize: `${currentTypo.smallTextSize}rem`, color: previewMutedColor }}
                  >
                    Exceeds minimum benchmark (80%)
                  </span>
                </div>
              </div>

              {/* Navigation Bar & Button Simulation */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span 
                    className="font-bold"
                    style={{ fontSize: `${currentTypo.navTextSize}rem`, color: previewTitleColor }}
                  >
                    Navigation Tab Link
                  </span>
                  <span 
                    className="font-medium"
                    style={{ fontSize: `${currentTypo.navTextSize}rem`, color: previewMutedColor }}
                  >
                    Evaluation Activities
                  </span>
                  <span 
                    className="font-medium"
                    style={{ fontSize: `${currentTypo.navTextSize}rem`, color: previewMutedColor }}
                  >
                    Reports & Analytics
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md border border-slate-300 font-semibold bg-white cursor-pointer"
                    style={{ fontSize: `${currentTypo.buttonTextSize}rem`, color: previewBodyColor }}
                  >
                    Secondary Action
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-md bg-emerald-900 font-bold text-white shadow-xs cursor-pointer"
                    style={{ fontSize: `${currentTypo.buttonTextSize}rem` }}
                  >
                    Primary Action Trigger
                  </button>
                </div>
              </div>

              {/* Form Input & Table Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                  <span 
                    className="font-bold block"
                    style={{ fontSize: `${currentTypo.sectionHeadingSize}rem`, color: previewHeadingColor }}
                  >
                    Section Subheading Title
                  </span>
                  <div>
                    <label 
                      className="block font-semibold mb-1"
                      style={{ fontSize: `${currentTypo.labelSize}rem`, color: previewLabelColor }}
                    >
                      Control Number / Verification ID:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="SLSU-2026-HIN-0101"
                      className="w-full p-2 border border-slate-300 rounded-md font-mono bg-slate-50"
                      style={{ fontSize: `${currentTypo.bodyTextSize}rem`, color: previewBodyColor }}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th 
                          className="p-2 font-bold uppercase"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewLabelColor }}
                        >
                          Evaluation Criteria
                        </th>
                        <th 
                          className="p-2 font-bold uppercase text-right"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewLabelColor }}
                        >
                          Mean Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td 
                          className="p-2 font-medium"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewBodyColor }}
                        >
                          1. Trainer Mastery & Delivery
                        </td>
                        <td 
                          className="p-2 font-bold text-right font-mono"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewTitleColor }}
                        >
                          4.90
                        </td>
                      </tr>
                      <tr>
                        <td 
                          className="p-2 font-medium"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewBodyColor }}
                        >
                          2. Handouts & Learning Materials
                        </td>
                        <td 
                          className="p-2 font-bold text-right font-mono"
                          style={{ fontSize: `${currentTypo.tableTextSize}rem`, color: previewTitleColor }}
                        >
                          4.85
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: FONT COLOR CUSTOMIZATION */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-800" />
                    <span>System-Wide Font Color Customization</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    WCAG AAA Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the exact colors used for page titles, headings, body reading text, form labels, and supporting notes across the entire application.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFontColors}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Font Colors</span>
              </button>
            </div>

            {/* 1-Click Font Color Preset Schemes */}
            <div className="space-y-2">
              <label className="block font-semibold text-xs text-slate-700">
                1-Click Font Color Schemes:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {FONT_COLOR_SCHEMES.map(scheme => {
                  const isActive = 
                    (currentTypo.pageTitleColor || formTheme.fontColorTitle) === scheme.titleColor &&
                    (currentTypo.sectionHeadingColor || formTheme.fontColorHeading) === scheme.headingColor &&
                    (currentTypo.bodyTextColor || formTheme.fontColorBody) === scheme.bodyColor;
                  return (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => applyFontColorScheme(scheme)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-slate-900 line-clamp-1">{scheme.name}</span>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: scheme.titleColor }} title="Title Color" />
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: scheme.headingColor }} title="Heading Color" />
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: scheme.bodyColor }} title="Body Text Color" />
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: scheme.mutedColor }} title="Muted Color" />
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: scheme.labelColor }} title="Label Color" />
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {scheme.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Granular Font Color Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* 1. Page Title Font Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Main Page Title Font Color</span>
                    <span className="text-[11px] text-slate-500">H1, main view headers, system hero banners</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: previewTitleColor }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewTitleColor}
                    onChange={(e) => updateTypoColorField('pageTitleColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={previewTitleColor}
                    onChange={(e) => updateTypoColorField('pageTitleColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                  />
                </div>

                {/* Swatches */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Quick Swatches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FONT_COLOR_SWATCHES.map(swatch => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => updateTypoColorField('pageTitleColor', swatch.color)}
                        className={`w-5 h-5 rounded border shadow-2xs cursor-pointer transition-transform hover:scale-110 ${
                          previewTitleColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-emerald-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Live typography preview pill */}
                <div className="pt-1">
                  <div 
                    className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-extrabold text-sm tracking-tight text-center"
                    style={{ color: previewTitleColor }}
                  >
                    Sample Page Title Text
                  </div>
                </div>
              </div>

              {/* 2. Section Heading Font Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Section Heading Font Color</span>
                    <span className="text-[11px] text-slate-500">H2, H3, card headers, modal dialog titles</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: previewHeadingColor }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewHeadingColor}
                    onChange={(e) => updateTypoColorField('sectionHeadingColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={previewHeadingColor}
                    onChange={(e) => updateTypoColorField('sectionHeadingColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                  />
                </div>

                {/* Swatches */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Quick Swatches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FONT_COLOR_SWATCHES.map(swatch => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => updateTypoColorField('sectionHeadingColor', swatch.color)}
                        className={`w-5 h-5 rounded border shadow-2xs cursor-pointer transition-transform hover:scale-110 ${
                          previewHeadingColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-emerald-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Live typography preview pill */}
                <div className="pt-1">
                  <div 
                    className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-bold text-xs tracking-tight text-center"
                    style={{ color: previewHeadingColor }}
                  >
                    Sample Section Heading
                  </div>
                </div>
              </div>

              {/* 3. Body Text & Descriptions Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Body Reading Text Color</span>
                    <span className="text-[11px] text-slate-500">Paragraphs, instructions, table cells</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: previewBodyColor }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewBodyColor}
                    onChange={(e) => updateTypoColorField('bodyTextColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={previewBodyColor}
                    onChange={(e) => updateTypoColorField('bodyTextColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                  />
                </div>

                {/* Swatches */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Quick Swatches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FONT_COLOR_SWATCHES.map(swatch => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => updateTypoColorField('bodyTextColor', swatch.color)}
                        className={`w-5 h-5 rounded border shadow-2xs cursor-pointer transition-transform hover:scale-110 ${
                          previewBodyColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-emerald-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Live typography preview pill */}
                <div className="pt-1">
                  <div 
                    className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-normal text-xs leading-relaxed text-center"
                    style={{ color: previewBodyColor }}
                  >
                    Sample reading body paragraph text
                  </div>
                </div>
              </div>

              {/* 4. Muted & Supporting Text Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Muted & Supporting Text Color</span>
                    <span className="text-[11px] text-slate-500">Subtitles, timestamps, helper hints, micro-copy</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: previewMutedColor }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewMutedColor}
                    onChange={(e) => updateTypoColorField('mutedTextColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={previewMutedColor}
                    onChange={(e) => updateTypoColorField('mutedTextColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                  />
                </div>

                {/* Swatches */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Quick Swatches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FONT_COLOR_SWATCHES.map(swatch => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => updateTypoColorField('mutedTextColor', swatch.color)}
                        className={`w-5 h-5 rounded border shadow-2xs cursor-pointer transition-transform hover:scale-110 ${
                          previewMutedColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-emerald-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Live typography preview pill */}
                <div className="pt-1">
                  <div 
                    className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-medium text-[11px] text-center"
                    style={{ color: previewMutedColor }}
                  >
                    Sample subtitle & timestamp text
                  </div>
                </div>
              </div>

              {/* 5. Form Labels & Table Headers Color */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Form Labels & Table Headers</span>
                    <span className="text-[11px] text-slate-500">Field labels, column headers, filter tags</span>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: previewLabelColor }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={previewLabelColor}
                    onChange={(e) => updateTypoColorField('labelTextColor', e.target.value)}
                    className="w-10 h-9 rounded border border-slate-300 p-0.5 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={previewLabelColor}
                    onChange={(e) => updateTypoColorField('labelTextColor', e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                  />
                </div>

                {/* Swatches */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Quick Swatches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {FONT_COLOR_SWATCHES.map(swatch => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => updateTypoColorField('labelTextColor', swatch.color)}
                        className={`w-5 h-5 rounded border shadow-2xs cursor-pointer transition-transform hover:scale-110 ${
                          previewLabelColor.toLowerCase() === swatch.color.toLowerCase() ? 'ring-2 ring-emerald-800' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`${swatch.name} (${swatch.color})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Live typography preview pill */}
                <div className="pt-1">
                  <div 
                    className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 font-bold text-[11px] uppercase tracking-wider text-center"
                    style={{ color: previewLabelColor }}
                  >
                    Sample Label & Column Header
                  </div>
                </div>
              </div>

              {/* 6. Typography Summary & Accessibility Card */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-slate-900 text-xs">Accessibility & Global Persistence</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Custom font colors are mapped to centralized CSS design tokens (<code>--font-color-title</code>, <code>--font-color-heading</code>, <code>--font-color-body</code>, <code>--font-color-muted</code>, <code>--font-color-label</code>).
                  </p>
                </div>
                <div className="p-2.5 rounded bg-white border border-emerald-200 text-[10px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Current Title Color:</span>
                    <span className="font-mono font-bold">{previewTitleColor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Current Body Color:</span>
                    <span className="font-mono font-bold">{previewBodyColor}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-800 font-bold">
                    <span>Contrast Standard:</span>
                    <span>WCAG AAA Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Granular Font Size Sliders & Numeric Inputs */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Granular Font Size Controls (in rem units)
                </h3>
                <p className="text-xs text-slate-500">
                  Carefully bounded between safe minimums and maximums to maintain accessibility and responsive layouts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* 1. Base Body Font Size */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Base Root Font Size (Global Root Scale)</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.baseFontSize} rem ({Math.round(currentTypo.baseFontSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Root baseline scale affecting overall interface sizing.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.85"
                    max="1.25"
                    step="0.025"
                    value={currentTypo.baseFontSize}
                    onChange={(e) => updateTypoField('baseFontSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.85"
                    max="1.25"
                    step="0.025"
                    value={currentTypo.baseFontSize}
                    onChange={(e) => updateTypoField('baseFontSize', parseFloat(e.target.value) || 1.0)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 2. Page Main Title Size */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Main Page Title Size</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.pageTitleSize} rem ({Math.round(currentTypo.pageTitleSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Used for primary page headers and main view banners.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.25"
                    max="2.0"
                    step="0.05"
                    value={currentTypo.pageTitleSize}
                    onChange={(e) => updateTypoField('pageTitleSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1.25"
                    max="2.0"
                    step="0.05"
                    value={currentTypo.pageTitleSize}
                    onChange={(e) => updateTypoField('pageTitleSize', parseFloat(e.target.value) || 1.5)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 3. Section Heading Size */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Section Headings & Subtitles</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.sectionHeadingSize} rem ({Math.round(currentTypo.sectionHeadingSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Used for card titles, modal dialog headers, and section labels.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.95"
                    max="1.5"
                    step="0.025"
                    value={currentTypo.sectionHeadingSize}
                    onChange={(e) => updateTypoField('sectionHeadingSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.95"
                    max="1.5"
                    step="0.025"
                    value={currentTypo.sectionHeadingSize}
                    onChange={(e) => updateTypoField('sectionHeadingSize', parseFloat(e.target.value) || 1.125)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 4. Body Text Size */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Body Text & Descriptions</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.bodyTextSize} rem ({Math.round(currentTypo.bodyTextSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Standard reading paragraphs, helper notes, and text blocks.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.75"
                    max="1.125"
                    step="0.025"
                    value={currentTypo.bodyTextSize}
                    onChange={(e) => updateTypoField('bodyTextSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.75"
                    max="1.125"
                    step="0.025"
                    value={currentTypo.bodyTextSize}
                    onChange={(e) => updateTypoField('bodyTextSize', parseFloat(e.target.value) || 0.875)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 5. Form Labels */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Form Labels & Input Captions</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.labelSize} rem ({Math.round(currentTypo.labelSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Labels accompanying inputs, dropdowns, and checkboxes.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.65"
                    max="0.95"
                    step="0.025"
                    value={currentTypo.labelSize}
                    onChange={(e) => updateTypoField('labelSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.65"
                    max="0.95"
                    step="0.025"
                    value={currentTypo.labelSize}
                    onChange={(e) => updateTypoField('labelSize', parseFloat(e.target.value) || 0.75)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 6. Buttons & Action Labels */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Buttons & Action Controls</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.buttonTextSize} rem ({Math.round(currentTypo.buttonTextSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Primary action triggers, modal submit buttons, and filters.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.65"
                    max="1.0"
                    step="0.025"
                    value={currentTypo.buttonTextSize}
                    onChange={(e) => updateTypoField('buttonTextSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.65"
                    max="1.0"
                    step="0.025"
                    value={currentTypo.buttonTextSize}
                    onChange={(e) => updateTypoField('buttonTextSize', parseFloat(e.target.value) || 0.75)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 7. Table Headers & Content */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Table Headers & Grid Cells</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.tableTextSize} rem ({Math.round(currentTypo.tableTextSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Tabular data in activity lists, user accounts, and submission feeds.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.65"
                    max="0.95"
                    step="0.025"
                    value={currentTypo.tableTextSize}
                    onChange={(e) => updateTypoField('tableTextSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.65"
                    max="0.95"
                    step="0.025"
                    value={currentTypo.tableTextSize}
                    onChange={(e) => updateTypoField('tableTextSize', parseFloat(e.target.value) || 0.75)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 8. Navigation & Sidebar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Sidebar Menu & Top Bar Labels</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.navTextSize} rem ({Math.round(currentTypo.navTextSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Navigation links, breadcrumb labels, and user menu triggers.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.75"
                    max="1.125"
                    step="0.025"
                    value={currentTypo.navTextSize}
                    onChange={(e) => updateTypoField('navTextSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.75"
                    max="1.125"
                    step="0.025"
                    value={currentTypo.navTextSize}
                    onChange={(e) => updateTypoField('navTextSize', parseFloat(e.target.value) || 0.875)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 9. Metrics & KPI Numbers */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Dashboard Metrics & KPI Numbers</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.metricNumberSize} rem ({Math.round(currentTypo.metricNumberSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Large numerical figures on top dashboard analytical cards.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.4"
                    max="2.5"
                    step="0.05"
                    value={currentTypo.metricNumberSize}
                    onChange={(e) => updateTypoField('metricNumberSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1.4"
                    max="2.5"
                    step="0.05"
                    value={currentTypo.metricNumberSize}
                    onChange={(e) => updateTypoField('metricNumberSize', parseFloat(e.target.value) || 1.875)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>

              {/* 10. Small Supporting Text & Badges */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Badges, Micro-copy & Footers</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentTypo.smallTextSize} rem ({Math.round(currentTypo.smallTextSize * 16)}px)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Status tags, timestamp micro-copy, and breadcrumb chips.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.60"
                    max="0.85"
                    step="0.025"
                    value={currentTypo.smallTextSize}
                    onChange={(e) => updateTypoField('smallTextSize', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-800 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.60"
                    max="0.85"
                    step="0.025"
                    value={currentTypo.smallTextSize}
                    onChange={(e) => updateTypoField('smallTextSize', parseFloat(e.target.value) || 0.6875)}
                    className="w-16 p-1 border border-slate-300 rounded text-center font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar for Typography */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetTypography}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Reset to Standard Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelChanges}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTheme()}
                  disabled={isSaving || role !== 'admin'}
                  className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Applying System Typography...' : 'Save Typography Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BRAND COLORS & SURFACES */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Preset Palettes */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1-Click Institutional Theme Presets</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select professionally matched university color palettes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {PRESET_THEMES.map(preset => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50/40 ring-2 ring-emerald-800/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900">{preset.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        {preset.previewColors.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs" 
                            style={{ backgroundColor: color }} 
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Preview & Form */}
          <form onSubmit={handleSaveTheme} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Institutional Branding & Titles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site / University Name</label>
                  <input
                    type="text"
                    value={formTheme.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={formTheme.siteTagline}
                    onChange={(e) => updateField('siteTagline', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus / Logo Text</label>
                  <input
                    type="text"
                    value={formTheme.logoText}
                    onChange={(e) => updateField('logoText', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Color Customizer */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Brand Color Palette & Surfaces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secondary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.secondaryColor}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.secondaryColor}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accent Color (Gold/Amber)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Button Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.buttonPrimaryBg}
                      onChange={(e) => updateField('buttonPrimaryBg', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.buttonPrimaryBg}
                      onChange={(e) => updateField('buttonPrimaryBg', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Page Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.pageBgColor}
                      onChange={(e) => updateField('pageBgColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.pageBgColor}
                      onChange={(e) => updateField('pageBgColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sidebar Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.sidebarBgColor}
                      onChange={(e) => updateField('sidebarBgColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.sidebarBgColor}
                      onChange={(e) => updateField('sidebarBgColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Top Header Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.headerBgColor}
                      onChange={(e) => updateField('headerBgColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.headerBgColor}
                      onChange={(e) => updateField('headerBgColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Global Typography & Font Color Customizer in Colors Tab */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-emerald-800" />
                    <span>Global Typography Font Colors</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fine-tune font colors across headers, reading body paragraphs, and form labels.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('typography')}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Full Typography Suite</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Page Title Font Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewTitleColor}
                      onChange={(e) => updateTypoColorField('pageTitleColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewTitleColor}
                      onChange={(e) => updateTypoColorField('pageTitleColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Heading Font Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewHeadingColor}
                      onChange={(e) => updateTypoColorField('sectionHeadingColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewHeadingColor}
                      onChange={(e) => updateTypoColorField('sectionHeadingColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Body Text Font Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewBodyColor}
                      onChange={(e) => updateTypoColorField('bodyTextColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewBodyColor}
                      onChange={(e) => updateTypoColorField('bodyTextColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Muted / Micro-copy Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewMutedColor}
                      onChange={(e) => updateTypoColorField('mutedTextColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewMutedColor}
                      onChange={(e) => updateTypoColorField('mutedTextColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Form Labels & Table Headers Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewLabelColor}
                      onChange={(e) => updateTypoColorField('labelTextColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewLabelColor}
                      onChange={(e) => updateTypoColorField('labelTextColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formTheme.linkTextColor}
                      onChange={(e) => updateField('linkTextColor', e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formTheme.linkTextColor}
                      onChange={(e) => updateField('linkTextColor', e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Reset to Standard Defaults
              </button>
              <button
                type="submit"
                disabled={isSaving || role !== 'admin'}
                className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Applying Changes...' : 'Apply & Save Theme'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
