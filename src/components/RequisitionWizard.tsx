'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  UserCircle, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  ClipboardList, 
  X, 
  Clock, 
  Calendar,
  AlertCircle,
  PhoneCall,
  Sparkles,
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  Loader2,
  Check,
  Award,
  Target,
  Cpu
} from 'lucide-react';

// TypeScript Interfaces for n8n JSON Payload
interface RequisitionPayload {
  empresa: {
    nombre: string;
    industria: string;
    tamano: string;
    sitio_web: string;
    ubicacion: string;
  };
  contacto: {
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
    linkedin: string;
  };
  vacante: {
    titulo: string;
    seniority: string;
    modalidad: string;
    salario_min: string;
    salario_max: string;
    tipo_contratacion: string;
    urgencia: string;
    vacantes: string;
  };
  perfil: {
    skills_tecnicas: string[];
    soft_skills: string[];
    anos_experiencia: string;
    idiomas: string[];
    herramientas: string[];
    certificaciones: string[];
  };
  estrategia: {
    objetivo_rol: string;
    retos_principales: string;
    kpis: string;
    estructura_equipo: string;
    reporta_a: string;
    personas_a_cargo: string;
  };
  extras: {
    comentarios: string;
    fecha_contratacion: string;
    archivo: string; // Base64 Data URL or filename string
  };
  metadata?: {
    source: string;
    form_version: string;
    created_at: string;
    timezone: string;
  };
}

const initialData: RequisitionPayload = {
  empresa: {
    nombre: '',
    industria: '',
    tamano: '',
    sitio_web: '',
    ubicacion: '',
  },
  contacto: {
    nombre: '',
    cargo: '',
    email: '',
    telefono: '',
    linkedin: '',
  },
  vacante: {
    titulo: '',
    seniority: '',
    modalidad: '',
    salario_min: '',
    salario_max: '',
    tipo_contratacion: '',
    urgencia: '',
    vacantes: '1',
  },
  perfil: {
    skills_tecnicas: [],
    soft_skills: [],
    anos_experiencia: '',
    idiomas: [],
    herramientas: [],
    certificaciones: [],
  },
  estrategia: {
    objetivo_rol: '',
    retos_principales: '',
    kpis: '',
    estructura_equipo: '',
    reporta_a: '',
    personas_a_cargo: '',
  },
  extras: {
    comentarios: '',
    fecha_contratacion: '',
    archivo: '',
  }
};

const steps = [
  { id: 1, title: 'Empresa', icon: Building2, desc: 'Identidad corporativa' },
  { id: 2, title: 'Contacto', icon: UserCircle, desc: 'Responsable' },
  { id: 3, title: 'Vacante', icon: Briefcase, desc: 'Detalles del puesto' },
  { id: 4, title: 'Perfil', icon: GraduationCap, desc: 'Requisitos y Skills' },
  { id: 5, title: 'Estrategia', icon: Target, desc: 'KPIs y Retos del rol' },
  { id: 6, title: 'Extras', icon: ClipboardList, desc: 'Archivos y fecha' },
];

// Presets for faster tagging and high conversion (SaaS UX)
const SUGGESTED_TECHNICAL_SKILLS = ['React', 'Python', 'SQL', 'SAP', 'PLC', 'Six Sigma', 'SolidWorks', 'AutoCAD', 'Node.js', 'Salesforce'];
const SUGGESTED_SOFT_SKILLS = ['Liderazgo', 'Trabajo en equipo', 'Comunicación asertiva', 'Resolución de problemas', 'Proactividad', 'Negociación'];
const SUGGESTED_TOOLS = ['Excel Avanzado', 'Jira', 'AWS', 'PowerBI', 'Slack', 'MS Project', 'Trello'];
const SUGGESTED_LANGUAGES = ['Inglés Avanzado (C1/C2)', 'Inglés Intermedio (B1/B2)', 'Alemán B2', 'Portugués Comercial'];
const SUGGESTED_CERTIFICATIONS = ['PMP', 'Scrum Master', 'ISO 9001', 'AWS Certified', 'Lean Black Belt', 'CISSP'];

export function RequisitionWizard() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RequisitionPayload>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Tag Inputs
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [certInput, setCertInput] = useState('');

  // Drag & Drop File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autosave restore banner state
  const [hasBackup, setHasBackup] = useState(false);

  // AI Submission Loader Steps
  const loaderSteps = [
    "Estructurando requerimientos de la empresa...",
    "Enriqueciendo perfil técnico con modelos de IA...",
    "Analizando urgencia y scoring de prioridad...",
    "Preparando brief de reclutamiento B2B...",
    "Enviando requisición a los canales n8n..."
  ];

  // 1. Recover from localStorage backup if exists on Mount
  useEffect(() => {
    const backup = localStorage.getItem('hj_requisicion_backup');
    if (backup) {
      try {
        const { data } = JSON.parse(backup);
        if (data && data.empresa && data.contacto) {
          setHasBackup(true);
        }
      } catch (e) {
        console.error("Error al analizar respaldo local:", e);
      }
    }
  }, []);

  // 2. Local autosave on data change
  const saveToLocalStorage = (data: RequisitionPayload) => {
    try {
      localStorage.setItem('hj_requisicion_backup', JSON.stringify({
        timestamp: new Date().toISOString(),
        data
      }));
    } catch (e) {
      console.error("No se pudo guardar respaldo local:", e);
    }
  };

  const handleRestoreBackup = () => {
    const backup = localStorage.getItem('hj_requisicion_backup');
    if (backup) {
      try {
        const { data } = JSON.parse(backup);
        setFormData(data);
        setHasBackup(false);
        setShowIntro(false);
        // If they had a file saved, parse details
        if (data.extras?.archivo && data.extras.archivo.startsWith('data:')) {
          setUploadedFileName("archivo_recuperado.pdf");
          setUploadedFileSize("Adjunto");
        }
      } catch (e) {
        console.error("Error al restaurar respaldo:", e);
      }
    }
  };

  const handleDiscardBackup = () => {
    localStorage.removeItem('hj_requisicion_backup');
    setHasBackup(false);
  };

  // State update utilities
  const updateData = (section: keyof RequisitionPayload, field: string, value: any) => {
    const updated = {
      ...formData,
      [section]: {
        ...formData[section] as Record<string, any>,
        [field]: value
      }
    };
    setFormData(updated);
    saveToLocalStorage(updated);
  };

  // Tag Manager utilities
  const addTag = (category: keyof RequisitionPayload['perfil'], value: string) => {
    const trimmed = value.trim();
    if (trimmed !== '') {
      const currentTags = formData.perfil[category] as string[];
      if (!currentTags.includes(trimmed)) {
        const updatedTags = [...currentTags, trimmed];
        const updated = {
          ...formData,
          perfil: {
            ...formData.perfil,
            [category]: updatedTags
          }
        };
        setFormData(updated);
        saveToLocalStorage(updated);
      }
    }
  };

  const removeTag = (category: keyof RequisitionPayload['perfil'], tagToRemove: string) => {
    const currentTags = formData.perfil[category] as string[];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    const updated = {
      ...formData,
      perfil: {
        ...formData.perfil,
        [category]: updatedTags
      }
    };
    setFormData(updated);
    saveToLocalStorage(updated);
  };

  // Drag & Drop File Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Check constraints
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setError("Tipo de archivo no permitido. Solo se aceptan PDFs o documentos de Word (.docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo supera el límite de 10 MB.");
      return;
    }

    setError('');
    setUploadingFile(true);
    setUploadedFileName(file.name);
    
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFileSize(`${sizeInMB} MB`);

    // Simulate high-tech IA processing of document
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateData('extras', 'archivo', base64String);
        setUploadingFile(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error("Error al codificar archivo a Base64:", e);
      setUploadingFile(false);
      setError("Ocurrió un error al procesar el archivo. Por favor inténtalo de nuevo.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeUploadedFile = () => {
    updateData('extras', 'archivo', '');
    setUploadedFileName('');
    setUploadedFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Validation per Step
  const validateStep = (step: number): boolean => {
    setError('');
    if (step === 1) {
      if (!formData.empresa.nombre.trim()) return false;
      if (!formData.empresa.industria.trim()) return false;
      if (!formData.empresa.tamano) return false;
      if (!formData.empresa.ubicacion.trim()) return false;
      return true;
    }
    if (step === 2) {
      if (!formData.contacto.nombre.trim()) return false;
      if (!formData.contacto.email.trim()) return false;
      if (!formData.contacto.telefono.trim()) return false;
      
      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contacto.email)) {
        setError('El correo corporativo no tiene un formato válido.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.vacante.titulo.trim()) return false;
      if (!formData.vacante.seniority) return false;
      if (!formData.vacante.modalidad) return false;
      if (!formData.vacante.tipo_contratacion) return false;
      if (!formData.vacante.urgencia) return false;
      if (!formData.vacante.vacantes || parseInt(formData.vacante.vacantes) <= 0) return false;
      
      // Salario min/max validation if populated
      if (formData.vacante.salario_min && formData.vacante.salario_max) {
        const min = parseFloat(formData.vacante.salario_min.replace(/[^0-9.]/g, ''));
        const max = parseFloat(formData.vacante.salario_max.replace(/[^0-9.]/g, ''));
        if (!isNaN(min) && !isNaN(max) && max < min) {
          setError('El salario máximo no puede ser menor al salario mínimo.');
          return false;
        }
      }
      return true;
    }
    if (step === 4) {
      if (!formData.perfil.anos_experiencia) return false;
      if (formData.perfil.skills_tecnicas.length === 0) {
        setError('Por favor añade al menos una habilidad técnica requerida.');
        return false;
      }
      return true;
    }
    if (step === 5) {
      if (!formData.estrategia.objetivo_rol.trim()) return false;
      if (!formData.estrategia.retos_principales.trim()) return false;
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } else if (!error) {
      setError('Por favor completa todos los campos obligatorios (*) marcados en esta sección.');
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit Handler with AI animation proxy logic
  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep(0);
    setError('');

    // Play visual cinematic AI updates
    const runAnimation = () => {
      return new Promise<void>((resolve) => {
        let step = 0;
        const interval = setInterval(() => {
          step++;
          if (step < loaderSteps.length) {
            setSubmissionStep(step);
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 1100);
      });
    };

    // Construct metadata
    const payloadToSend: RequisitionPayload = {
      ...formData,
      metadata: {
        source: 'hackes_jobs_web',
        form_version: 'v2',
        created_at: new Date().toISOString(),
        timezone: 'America/Mexico_City'
      }
    };

    // Run animation and API call concurrently
    const [animationResult, apiResult] = await Promise.all([
      runAnimation(),
      (async () => {
        try {
          const res = await fetch('/api/webhooks/perfilador', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadToSend),
          });

          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `Error del servidor: ${res.status}`);
          }
          return { success: true };
        } catch (err: any) {
          console.error("Error al enviar requisición:", err);
          return { success: false, message: err.message || "No se pudo conectar con el servidor." };
        }
      })()
    ]);

    setIsSubmitting(false);

    if (apiResult.success) {
      setIsSuccess(true);
      localStorage.removeItem('hj_requisicion_backup');
    } else {
      setError(`Ocurrió un error en la conexión: ${apiResult.message}. Tu borrador se ha guardado localmente para que puedas intentarlo nuevamente.`);
    }
  };

  // ---------------- RENDERS ----------------

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="card-premium p-8 md:p-16 max-w-3xl mx-auto text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden bg-brand-black/40 border-white/10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-orange/30 shadow-[0_0_30px_rgba(249,115,22,0.3)] animate-pulse">
          <CheckCircle2 size={48} />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
          ¡Requisición Procesada con Éxito!
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
          Nuestro motor de IA y el equipo de consultores comerciales han recibido los datos estructurados. Un flujo automatizado ha iniciado la búsqueda de perfiles compatibles en nuestras bases de datos de inmediato.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 text-left max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-brand-blue font-black uppercase tracking-widest text-[10px] mb-4 bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
            <Cpu size={12} className="animate-spin" />
            Flujo IA Activado (B2B Pipeline)
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3.5 text-sm text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
              Recibirás un correo corporativo con el resumen estructurado y brief técnico del rol.
            </li>
            <li className="flex items-start gap-3.5 text-sm text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
              Un consultor senior validará el perfil y agendará la terna comercial.
            </li>
            <li className="flex items-start gap-3.5 text-sm text-slate-300 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
              Entregamos los candidatos evaluados con psicometría digital en un plazo de 3 a 5 días hábiles.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={() => window.location.reload()} variant="primary" size="lg" className="w-full sm:w-auto px-8 btn-elev rounded-xl h-14 font-black uppercase text-xs tracking-wider">
            Crear Otra Requisición
          </Button>
          <Button onClick={() => window.location.href = 'https://www.hackesjobs.com.mx/empresas'} variant="outline" size="lg" className="w-full sm:w-auto border-white/20 hover:border-brand-orange hover:text-brand-orange text-white bg-white/5 h-14 rounded-xl px-8 font-black uppercase text-xs tracking-wider">
            Volver a Empresas
          </Button>
        </div>
      </div>
    );
  }

  // INTRO OR RESTORE STATE
  if (showIntro) {
    return (
      <div className="card-premium p-8 md:p-16 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden bg-brand-black/40 border-white/10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none"></div>
        
        {hasBackup && (
          <div className="mb-8 p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-3xl text-left flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-8 duration-500">
            <div className="flex items-start gap-4">
              <Clock className="text-brand-blue shrink-0 mt-0.5" size={24} />
              <div>
                <h4 className="font-bold text-white text-sm">Borrador Detectado</h4>
                <p className="text-xs text-slate-400 mt-1">Tienes una sesión anterior guardada de manera segura localmente. ¿Deseas recuperarla?</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
              <button onClick={handleDiscardBackup} className="text-xs text-slate-400 hover:text-white px-3 py-2 font-bold uppercase tracking-wider transition-all">
                Descartar
              </button>
              <Button onClick={handleRestoreBackup} variant="primary" size="sm" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider">
                Recuperar
              </Button>
            </div>
          </div>
        )}

        <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <ClipboardList size={40} className="animate-pulse" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
          Crea el Perfil Ejecutivo de tu Vacante
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
          Nuestra suite de atracción operada por IA reduce drásticamente el ciclo de contratación. Completa los 6 pasos estratégicos del perfilador para activar el hunting digital en horas, sin fricción y 100% automatizado.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-brand-blue/30 transition-all group">
            <Clock className="text-brand-orange mb-3 group-hover:scale-110 transition-transform duration-300" size={24} />
            <h4 className="font-bold text-white mb-1.5 text-base tracking-tight">Cero fricción</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Completa los 6 pasos modulares en solo 3-5 minutos.</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-brand-blue/30 transition-all group">
            <Cpu className="text-brand-blue mb-3 group-hover:scale-110 transition-transform duration-300" size={24} />
            <h4 className="font-bold text-white mb-1.5 text-base tracking-tight">Optimizado para IA</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Tu payload alimenta modelos n8n que preseleccionan perfiles y automatizan el pipeline.</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-brand-blue/30 transition-all group">
            <Award className="text-brand-orange mb-3 group-hover:scale-110 transition-transform duration-300" size={24} />
            <h4 className="font-bold text-white mb-1.5 text-base tracking-tight">Máxima Precisión</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Mapea objetivos clave, retos y competencias técnicas reales del rol.</p>
          </div>
        </div>

        <Button onClick={() => setShowIntro(false)} variant="primary" size="xl" className="w-full md:w-auto px-10 btn-elev h-16 rounded-xl font-black uppercase tracking-widest text-xs">
          Comenzar Perfilador
          <ChevronRight className="ml-2" size={16} />
        </Button>
      </div>
    );
  }

  // SUBMITTING / AI LOADER STATE
  if (isSubmitting) {
    return (
      <div className="card-premium p-8 md:p-20 max-w-3xl mx-auto text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden bg-brand-black/40 border-white/10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 py-10 space-y-8">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-brand-orange animate-spin duration-1000"></div>
            <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-brand-blue animate-spin duration-1500" style={{ animationDirection: 'reverse' }}></div>
            <Cpu className="text-brand-orange animate-pulse" size={32} />
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              Procesando con IA
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto text-sm font-semibold tracking-wide uppercase">
              Orquestando workflows de reclutamiento B2B
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner space-y-4 text-left">
            {loaderSteps.map((ldrStep, idx) => {
              const isActive = idx === submissionStep;
              const isPast = idx < submissionStep;
              return (
                <div key={idx} className="flex items-center gap-3 transition-all duration-300">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isPast 
                      ? 'bg-brand-orange border-brand-orange text-white' 
                      : isActive 
                        ? 'border-brand-blue bg-brand-blue/20 text-brand-blue animate-pulse' 
                        : 'border-white/10 text-slate-600'
                  }`}>
                    {isPast ? <Check size={10} /> : <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-blue' : 'bg-transparent'}`} />}
                  </div>
                  <span className={`text-xs font-bold transition-all uppercase tracking-wider ${
                    isPast 
                      ? 'text-slate-400 line-through decoration-brand-orange/30' 
                      : isActive 
                        ? 'text-white scale-102 font-black' 
                        : 'text-slate-600'
                  }`}>
                    {ldrStep}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // WIZARD FORM STATE
  return (
    <div className="card-premium overflow-hidden max-w-6xl mx-auto flex flex-col lg:flex-row bg-brand-black/40 border-white/10 min-h-[620px] transition-all">
      
      {/* 1. SIDEBAR PROGRESS */}
      <div className="bg-brand-black p-8 lg:w-1/4 flex flex-col relative overflow-hidden text-white shrink-0 border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <Cpu className="text-brand-orange" size={20} />
              <h3 className="text-base font-black tracking-[0.25em] uppercase text-white">Perfilador IA</h3>
            </div>
            
            {/* Steps list */}
            <div className="space-y-6 lg:space-y-8 flex flex-row lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-6 lg:gap-0 scrollbar-thin">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isPast = step.id < currentStep;

                return (
                  <div key={step.id} className="flex items-center group shrink-0 select-none">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isActive 
                        ? 'bg-brand-orange border-brand-orange text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110' 
                        : isPast 
                          ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_10px_rgba(30,64,175,0.25)]' 
                          : 'border-white/10 bg-white/[0.02] text-slate-500'
                    }`}>
                      {isPast ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <div className="ml-3 hidden lg:block text-left">
                      <div className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-brand-orange' : 'text-slate-500'}`}>
                        Paso {step.id}
                      </div>
                      <div className={`text-xs font-black uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block pt-8 border-t border-white/5 text-left">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Empresarial B2B</div>
            <div className="text-[9px] text-slate-600 font-bold leading-normal">
              Hacke's Jobs Technologies. Cifrado AES-256 y cumplimiento LFPDPPP.
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORM CONTENT */}
      <div className="p-6 md:p-10 lg:p-14 lg:w-3/4 flex flex-col bg-transparent justify-between">
        
        {/* Step Content Wrapper */}
        <div className="flex-1 min-h-[440px]">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full">
              Paso {currentStep} de 6
            </span>
            <span className="text-xs font-bold text-slate-500">
              {steps[currentStep - 1].desc}
            </span>
          </div>

          {/* STEP 1: INFORMACIÓN DE LA EMPRESA */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Información de la Empresa</h2>
                <p className="text-slate-400 text-sm mt-1">Ingresa los datos generales de tu organización para iniciar el brief corporativo.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Nombre Comercial <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. TechCorp International" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.empresa.nombre} 
                    onChange={e => updateData('empresa', 'nombre', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Giro / Industria <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Manufactura Tier 1, Logística, Aeroespacial" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.empresa.industria} 
                    onChange={e => updateData('empresa', 'industria', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Tamaño de Plantilla <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer placeholder:text-slate-500"
                    value={formData.empresa.tamano} 
                    onChange={e => updateData('empresa', 'tamano', e.target.value)}
                  >
                    <option value="" className="text-slate-600 bg-brand-black">Seleccionar...</option>
                    <option value="1-10" className="text-white bg-brand-black">Start-up (1-10 colaboradores)</option>
                    <option value="11-50" className="text-white bg-brand-black">PyME (11-50 colaboradores)</option>
                    <option value="51-200" className="text-white bg-brand-black">Consolidada (51-200 colaboradores)</option>
                    <option value="201-500" className="text-white bg-brand-black">Gran Empresa (201-500 colaboradores)</option>
                    <option value="500+" className="text-white bg-brand-black">Corporativo / Transnacional (500+)</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Ubicación Principal (Ciudad/Estado) <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Toluca, Estado de México" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.empresa.ubicacion} 
                    onChange={e => updateData('empresa', 'ubicacion', e.target.value)} 
                  />
                </div>
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Sitio Web Corporativo</label>
                  <input 
                    type="url"
                    placeholder="Ej. https://www.techcorp.com" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.empresa.sitio_web} 
                    onChange={e => updateData('empresa', 'sitio_web', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INFORMACIÓN DEL CONTACTO */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Datos del Contacto</h2>
                <p className="text-slate-400 text-sm mt-1">Información de la persona con la que coordinaremos el proceso de selección y entrevistas.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Nombre Completo <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Tu nombre y apellido" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.contacto.nombre} 
                    onChange={e => updateData('contacto', 'nombre', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Cargo / Puesto</label>
                  <input 
                    type="text"
                    placeholder="Ej. Director de RH, Gerente de Planta, Lead Recruiter" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.contacto.cargo} 
                    onChange={e => updateData('contacto', 'cargo', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Email Corporativo <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="email"
                    required
                    placeholder="nombre@empresa.com" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.contacto.email} 
                    onChange={e => updateData('contacto', 'email', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Teléfono de Contacto (Directo/WhatsApp) <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="tel"
                    required
                    placeholder="Ej. +52 722 123 4567" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.contacto.telefono} 
                    onChange={e => updateData('contacto', 'telefono', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Perfil de LinkedIn (URL)</label>
                  <input 
                    type="url"
                    placeholder="Ej. https://linkedin.com/in/usuario" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.contacto.linkedin} 
                    onChange={e => updateData('contacto', 'linkedin', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INFORMACIÓN DE LA VACANTE */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Detalles de la Vacante</h2>
                <p className="text-slate-400 text-sm mt-1">Define el rol, modalidad, esquemas y la urgencia de contratación del puesto.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Título del Puesto <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Gerente de Calidad - Planta Automotriz" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.vacante.titulo} 
                    onChange={e => updateData('vacante', 'titulo', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Plazas / Vacantes <span className="text-brand-orange font-black">*</span></label>
                  <input 
                    type="number"
                    required
                    min="1"
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.vacante.vacantes} 
                    onChange={e => updateData('vacante', 'vacantes', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Seniority <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer"
                    value={formData.vacante.seniority} 
                    onChange={e => updateData('vacante', 'seniority', e.target.value)}
                  >
                    <option value="" className="bg-brand-black">Seleccionar...</option>
                    <option value="Junior" className="bg-brand-black">Junior (0-2 años)</option>
                    <option value="Mid" className="bg-brand-black">Mid (2-5 años)</option>
                    <option value="Senior" className="bg-brand-black">Senior (5-8 años)</option>
                    <option value="Lead" className="bg-brand-black">Lead / Especialista (8+ años)</option>
                    <option value="Director" className="bg-brand-black">Director / C-Level</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Modalidad <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer"
                    value={formData.vacante.modalidad} 
                    onChange={e => updateData('vacante', 'modalidad', e.target.value)}
                  >
                    <option value="" className="bg-brand-black">Seleccionar...</option>
                    <option value="Presencial" className="bg-brand-black">100% Presencial</option>
                    <option value="Hibrido" className="bg-brand-black">Híbrido</option>
                    <option value="Remoto" className="bg-brand-black">100% Remoto</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Tipo de Contratación <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer"
                    value={formData.vacante.tipo_contratacion} 
                    onChange={e => updateData('vacante', 'tipo_contratacion', e.target.value)}
                  >
                    <option value="" className="bg-brand-black">Seleccionar...</option>
                    <option value="Directo / Planta" className="bg-brand-black">Directo / Planta</option>
                    <option value="Por Proyecto" className="bg-brand-black">Por Proyecto / Temporal</option>
                    <option value="Freelance" className="bg-brand-black">Freelance / Honorarios</option>
                  </select>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Salario Mínimo Neto (Mensual)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">$</span>
                    <input 
                      type="text"
                      placeholder="Ej. 35,000" 
                      className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 pl-8 pr-4 placeholder:text-slate-500"
                      value={formData.vacante.salario_min} 
                      onChange={e => updateData('vacante', 'salario_min', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Salario Máximo Neto (Mensual)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">$</span>
                    <input 
                      type="text"
                      placeholder="Ej. 45,000" 
                      className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 pl-8 pr-4 placeholder:text-slate-500"
                      value={formData.vacante.salario_max} 
                      onChange={e => updateData('vacante', 'salario_max', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Urgencia del Reclutamiento <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer"
                    value={formData.vacante.urgencia} 
                    onChange={e => updateData('vacante', 'urgencia', e.target.value)}
                  >
                    <option value="" className="bg-brand-black">Seleccionar...</option>
                    <option value="Baja" className="bg-brand-black">Baja (Planificación a futuro)</option>
                    <option value="Media" className="bg-brand-black">Media (Proceso ordinario)</option>
                    <option value="Alta (Express)" className="bg-brand-black">Alta (Hunting de inmediato)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PERFIL DESEADO */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Perfil Técnico y Skills</h2>
                <p className="text-slate-400 text-sm mt-1">Mapea detalladamente las competencias. Haz clic en las sugerencias o escribe tags personalizados.</p>
              </div>
              <div className="space-y-5 pt-2">
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Años de Experiencia Requeridos <span className="text-brand-orange font-black">*</span></label>
                  <select 
                    required
                    className="w-full md:w-1/2 bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 appearance-none cursor-pointer"
                    value={formData.perfil.anos_experiencia} 
                    onChange={e => updateData('perfil', 'anos_experiencia', e.target.value)}
                  >
                    <option value="" className="bg-brand-black">Seleccionar...</option>
                    <option value="0-1" className="bg-brand-black">0 a 1 año</option>
                    <option value="1-3" className="bg-brand-black">1 a 3 años</option>
                    <option value="3-5" className="bg-brand-black">3 a 5 años</option>
                    <option value="5-8" className="bg-brand-black">5 a 8 años</option>
                    <option value="8+" className="bg-brand-black">8+ años</option>
                  </select>
                </div>

                {/* 1. Habilidades Técnicas */}
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Habilidades Técnicas <span className="text-brand-orange font-black">*</span>
                  </label>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner mb-2.5">
                    {formData.perfil.skills_tecnicas.map((tag, idx) => (
                      <span key={idx} className="bg-brand-blue/20 text-blue-300 border border-brand-blue/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md select-none animate-in zoom-in-90 duration-200">
                        {tag}
                        <button onClick={() => removeTag('skills_tecnicas', tag)} className="ml-2 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={techInput}
                      onChange={e => setTechInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag('skills_tecnicas', techInput);
                          setTechInput('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-500 text-white min-w-[120px]"
                      placeholder="Escribe y presiona Enter..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-2">Sugerencias:</span>
                    {SUGGESTED_TECHNICAL_SKILLS.map((sug) => {
                      const isAdded = formData.perfil.skills_tecnicas.includes(sug);
                      return (
                        <button 
                          key={sug} 
                          onClick={() => isAdded ? removeTag('skills_tecnicas', sug) : addTag('skills_tecnicas', sug)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all ${
                            isAdded 
                              ? 'bg-brand-blue/20 border-brand-blue/50 text-blue-300' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '} {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Soft Skills */}
                <div className="text-left pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Habilidades Blandas</label>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner mb-2.5">
                    {formData.perfil.soft_skills.map((tag, idx) => (
                      <span key={idx} className="bg-brand-orange/20 text-orange-300 border border-brand-orange/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md select-none animate-in zoom-in-90 duration-200">
                        {tag}
                        <button onClick={() => removeTag('soft_skills', tag)} className="ml-2 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={softInput}
                      onChange={e => setSoftInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag('soft_skills', softInput);
                          setSoftInput('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-500 text-white min-w-[120px]"
                      placeholder="Escribe y presiona Enter..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-2">Sugerencias:</span>
                    {SUGGESTED_SOFT_SKILLS.map((sug) => {
                      const isAdded = formData.perfil.soft_skills.includes(sug);
                      return (
                        <button 
                          key={sug} 
                          onClick={() => isAdded ? removeTag('soft_skills', sug) : addTag('soft_skills', sug)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all ${
                            isAdded 
                              ? 'bg-brand-orange/20 border-brand-orange/50 text-orange-300' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '} {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Herramientas */}
                <div className="text-left pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Herramientas / Software Requerido</label>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner mb-2.5">
                    {formData.perfil.herramientas.map((tag, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md select-none animate-in zoom-in-90 duration-200">
                        {tag}
                        <button onClick={() => removeTag('herramientas', tag)} className="ml-2 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={toolsInput}
                      onChange={e => setToolsInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag('herramientas', toolsInput);
                          setToolsInput('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-500 text-white min-w-[120px]"
                      placeholder="Escribe y presiona Enter..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-2">Sugerencias:</span>
                    {SUGGESTED_TOOLS.map((sug) => {
                      const isAdded = formData.perfil.herramientas.includes(sug);
                      return (
                        <button 
                          key={sug} 
                          onClick={() => isAdded ? removeTag('herramientas', sug) : addTag('herramientas', sug)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all ${
                            isAdded 
                              ? 'bg-slate-800 border-slate-600 text-white' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '} {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Idiomas */}
                <div className="text-left pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Idiomas</label>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner mb-2.5">
                    {formData.perfil.idiomas.map((tag, idx) => (
                      <span key={idx} className="bg-brand-blue/10 text-white border border-brand-blue/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md select-none animate-in zoom-in-90 duration-200">
                        {tag}
                        <button onClick={() => removeTag('idiomas', tag)} className="ml-2 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={langInput}
                      onChange={e => setLangInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag('idiomas', langInput);
                          setLangInput('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-500 text-white min-w-[120px]"
                      placeholder="Escribe e idioma y nivel..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-2">Sugerencias:</span>
                    {SUGGESTED_LANGUAGES.map((sug) => {
                      const isAdded = formData.perfil.idiomas.includes(sug);
                      return (
                        <button 
                          key={sug} 
                          onClick={() => isAdded ? removeTag('idiomas', sug) : addTag('idiomas', sug)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all ${
                            isAdded 
                              ? 'bg-brand-blue/30 border-brand-blue/60 text-white' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '} {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Certificaciones */}
                <div className="text-left pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Certificaciones Deseadas</label>
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-2 items-center min-h-[52px] shadow-inner mb-2.5">
                    {formData.perfil.certificaciones.map((tag, idx) => (
                      <span key={idx} className="bg-brand-orange/10 text-white border border-brand-orange/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md select-none animate-in zoom-in-90 duration-200">
                        {tag}
                        <button onClick={() => removeTag('certificaciones', tag)} className="ml-2 hover:text-red-400 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={certInput}
                      onChange={e => setCertInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag('certificaciones', certInput);
                          setCertInput('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-500 text-white min-w-[120px]"
                      placeholder="Escribe y presiona Enter..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-2">Sugerencias:</span>
                    {SUGGESTED_CERTIFICATIONS.map((sug) => {
                      const isAdded = formData.perfil.certificaciones.includes(sug);
                      return (
                        <button 
                          key={sug} 
                          onClick={() => isAdded ? removeTag('certificaciones', sug) : addTag('certificaciones', sug)}
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all ${
                            isAdded 
                              ? 'bg-brand-orange/30 border-brand-orange/60 text-white' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '} {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 5: INFORMACIÓN ESTRATÉGICA */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Información Estratégica</h2>
                <p className="text-slate-400 text-sm mt-1">Ayúdanos a perfilar el valor real de la vacante más allá de los requisitos genéricos.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Objetivo del Rol <span className="text-brand-orange font-black">*</span></label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="¿Cuál es la razón de ser del puesto? ¿Qué impacto directo tiene en la planta u organización?" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3 px-4 resize-y placeholder:text-slate-500 text-sm"
                    value={formData.estrategia.objetivo_rol} 
                    onChange={e => updateData('estrategia', 'objetivo_rol', e.target.value)} 
                  />
                </div>
                <div className="text-left md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Principales Retos de la Vacante <span className="text-brand-orange font-black">*</span></label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe los 2 o 3 retos operativos o comerciales principales que enfrentará el candidato en los primeros 90 días." 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3 px-4 resize-y placeholder:text-slate-500 text-sm"
                    value={formData.estrategia.retos_principales} 
                    onChange={e => updateData('estrategia', 'retos_principales', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">KPIs o Métricas de Éxito</label>
                  <input 
                    type="text"
                    placeholder="Ej. Reducción de Scrap < 1%, Rotación < 3%" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.estrategia.kpis} 
                    onChange={e => updateData('estrategia', 'kpis', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Estructura del Equipo</label>
                  <input 
                    type="text"
                    placeholder="Ej. Colabora con 3 Ingenieros de Calidad y 1 Inspector" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.estrategia.estructura_equipo} 
                    onChange={e => updateData('estrategia', 'estructura_equipo', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">¿A quién reporta el puesto?</label>
                  <input 
                    type="text"
                    placeholder="Ej. Gerente de Planta, Director de Operaciones" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.estrategia.reporta_a} 
                    onChange={e => updateData('estrategia', 'reporta_a', e.target.value)} 
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Personas Directas a Cargo</label>
                  <input 
                    type="text"
                    placeholder="Ej. 4 personas directas, 10 indirectas" 
                    className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500"
                    value={formData.estrategia.personas_a_cargo} 
                    onChange={e => updateData('estrategia', 'personas_a_cargo', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: EXTRAS Y ADJUNTOS */}
          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Extras y Job Description</h2>
                <p className="text-slate-400 text-sm mt-1">Adjunta la descripción del puesto si cuentas con ella y especifica la fecha ideal de ingreso.</p>
              </div>
              
              <div className="space-y-6 pt-4">
                
                {/* Drag and drop interactive area */}
                <div className="text-left">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Descriptor de Puesto (JD / Perfil)</label>
                  
                  {!uploadedFileName ? (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white/[0.01] cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-[160px] ${
                        dragActive 
                          ? 'border-brand-orange bg-brand-orange/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                          : 'border-white/10 hover:border-brand-blue/40 hover:bg-white/[0.03]'
                      }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                      />
                      
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-brand-orange group-hover:scale-110 transition-all duration-300 shadow-inner">
                        <UploadCloud size={24} />
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors">
                          Arrastra aquí tu descriptor o haz clic para explorar
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                          Formatos soportados: PDF, DOCX (Hasta 10MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.02] flex items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center shrink-0">
                          {uploadingFile ? (
                            <Loader2 className="animate-spin" size={24} />
                          ) : (
                            <FileText size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-sm">
                            {uploadedFileName}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-semibold">
                            {uploadingFile ? "Codificando archivo..." : `Cargado correctamente · ${uploadedFileSize}`}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={removeUploadedFile}
                        disabled={uploadingFile}
                        className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Fecha Ideal de Contratación</label>
                    <input 
                      type="date"
                      className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 cursor-pointer"
                      value={formData.extras.fecha_contratacion} 
                      onChange={e => updateData('extras', 'fecha_contratacion', e.target.value)} 
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Comentarios Adicionales</label>
                    <textarea 
                      rows={2}
                      placeholder="Cualquier otra especificación, limitante o preferencia relevante..." 
                      className="w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 resize-y placeholder:text-slate-500 text-sm"
                      value={formData.extras.comentarios} 
                      onChange={e => updateData('extras', 'comentarios', e.target.value)} 
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Validation Alert Display */}
          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center animate-in fade-in select-none">
              <AlertCircle size={16} className="mr-3 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* 3. FOOTER NAVIGATION */}
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStep === 1 || isSubmitting}
            className={`font-black text-[10px] uppercase tracking-[0.2em] rounded-xl h-12 ${currentStep === 1 ? 'invisible pointer-events-none' : ''}`}
          >
            <ChevronLeft size={16} className="mr-2" />
            Volver
          </Button>
          
          {currentStep < 6 ? (
            <Button variant="primary" onClick={handleNext} className="font-black text-[10px] uppercase tracking-[0.2em] px-8 rounded-xl h-12 btn-elev">
              Siguiente
              <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting || uploadingFile} className="font-black text-[10px] uppercase tracking-[0.2em] px-10 rounded-xl h-12 btn-elev shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              {isSubmitting ? 'Enviando...' : 'Finalizar Perfil'}
              <CheckCircle2 size={16} className="ml-2" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
