'use client';

import React, { useState, useEffect } from 'react';
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
  PhoneCall
} from 'lucide-react';

// Types
interface DaySchedule {
  inicio: string;
  fin: string;
}

interface FormData {
  empresa: { nombre: string; giro: string; ciudad: string; tamano: string };
  contacto: { nombre: string; puesto: string; email: string; telefono: string };
  vacante: { puesto: string; numero: number; ubicacion: string; modalidad: string; fechaIngreso: string };
  condiciones: { 
    sueldo: string; 
    contrato: string; 
    jornada: Record<string, DaySchedule | null>; 
    prestaciones: string 
  };
  perfil: { estudios: string; experiencia: string; habilidades: string[]; idiomas: string };
  detalles: { actividades: string; objetivos: string; observaciones: string };
}

const initialData: FormData = {
  empresa: { nombre: '', giro: '', ciudad: '', tamano: '' },
  contacto: { nombre: '', puesto: '', email: '', telefono: '' },
  vacante: { puesto: '', numero: 1, ubicacion: '', modalidad: '', fechaIngreso: '' },
  condiciones: { 
    sueldo: '', 
    contrato: '', 
    jornada: {
      lunes: { inicio: '08:00', fin: '18:00' },
      martes: { inicio: '08:00', fin: '18:00' },
      miercoles: { inicio: '08:00', fin: '18:00' },
      jueves: { inicio: '08:00', fin: '18:00' },
      viernes: { inicio: '08:00', fin: '18:00' },
      sabado: null,
      domingo: null
    }, 
    prestaciones: '' 
  },
  perfil: { estudios: '', experiencia: '', habilidades: [], idiomas: '' },
  detalles: { actividades: '', objetivos: '', observaciones: '' }
};

const steps = [
  { id: 1, title: 'Empresa', icon: Building2 },
  { id: 2, title: 'Contacto', icon: UserCircle },
  { id: 3, title: 'Vacante', icon: Briefcase },
  { id: 4, title: 'Condiciones', icon: DollarSign },
  { id: 5, title: 'Perfil', icon: GraduationCap },
  { id: 6, title: 'Detalles', icon: ClipboardList },
];

const DAYS = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
];

// UI Components (Outside to prevent re-render focus issues)
const Label = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
  <label className="block text-sm font-semibold text-slate-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors outline-none ${props.className || ''}`}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors outline-none appearance-none ${props.className || ''}`}
  >
    {props.children}
  </select>
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors outline-none resize-y ${props.className || ''}`}
  />
);

export function RequisitionWizard() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // Recover from localStorage backup if exists
  useEffect(() => {
    const backup = localStorage.getItem('hj_requisicion_backup');
    if (backup) {
      try {
        const { data } = JSON.parse(backup);
        setFormData(data);
        console.log("Datos recuperados de respaldo local.");
      } catch (e) {
        console.error("Error al recuperar respaldo:", e);
      }
    }
  }, []);

  const updateData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateJornadaDay = (day: string, active: boolean) => {
    const newJornada = { ...formData.condiciones.jornada };
    if (active) {
      newJornada[day] = { inicio: '08:00', fin: '18:00' };
    } else {
      newJornada[day] = null;
    }
    updateData('condiciones', 'jornada', newJornada);
  };

  const updateJornadaTime = (day: string, type: 'inicio' | 'fin', time: string) => {
    const dayData = formData.condiciones.jornada[day];
    if (dayData) {
      const newJornada = { ...formData.condiciones.jornada };
      newJornada[day] = { ...dayData, [type]: time };
      updateData('condiciones', 'jornada', newJornada);
    }
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!formData.perfil.habilidades.includes(skillInput.trim())) {
        updateData('perfil', 'habilidades', [...formData.perfil.habilidades, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateData('perfil', 'habilidades', formData.perfil.habilidades.filter(skill => skill !== skillToRemove));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) return !!(formData.empresa.nombre && formData.empresa.giro && formData.empresa.ciudad && formData.empresa.tamano);
    if (step === 2) return !!(formData.contacto.nombre && formData.contacto.email && formData.contacto.telefono);
    if (step === 3) return !!(formData.vacante.puesto && formData.vacante.modalidad && formData.vacante.numero > 0);
    if (step === 4) {
      const hasContract = !!(formData.condiciones.sueldo && formData.condiciones.contrato);
      const hasAnyDay = Object.values(formData.condiciones.jornada).some(day => day !== null);
      
      // Time validation: exit must be after entry
      const timeValid = Object.entries(formData.condiciones.jornada).every(([day, data]) => {
        if (!data) return true;
        return data.fin > data.inicio;
      });

      if (!timeValid) {
        setError('La hora de salida debe ser posterior a la de entrada.');
        return false;
      }

      return hasContract && hasAnyDay;
    }
    if (step === 5) return !!(formData.perfil.estudios && formData.perfil.experiencia);
    if (step === 6) return !!(formData.detalles.actividades);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } else if (!error) {
      setError('Por favor, completa todos los campos requeridos (*).');
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Centralized sending function for future proxy or endpoint changes
  const sendRequisitionData = async (data: FormData) => {
    const endpoint = 'https://api.hackesjobs.com.mx/webhook/perfilador';
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isHttpEndpoint = endpoint.startsWith('http:');

    // Pre-check for Mixed Content (HTTPS site calling HTTP endpoint)
    if (isHttps && isHttpEndpoint) {
      console.warn("ALERTA DE SEGURIDAD: Intentando enviar datos HTTP desde un sitio HTTPS. El navegador podría bloquear la petición.");
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error detallado de envío:", err);
      
      // Attempt to identify the cause
      if (isHttps && isHttpEndpoint) {
        return { 
          success: false, 
          type: 'SECURITY', 
          message: 'Problema de seguridad del navegador (HTTPS/HTTP). El navegador bloqueó la conexión insegura.' 
        };
      }
      
      if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
        return { 
          success: false, 
          type: 'NETWORK', 
          message: 'No se pudo conectar con el servidor. Verifica tu conexión o permisos de CORS.' 
        };
      }

      return { 
        success: false, 
        type: 'UNKNOWN', 
        message: err.message || 'Error al enviar. Intenta nuevamente' 
      };
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      setError('Por favor, completa los campos requeridos (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    console.log("Iniciando proceso de envío robusto...");

    const result = await sendRequisitionData(formData);

    if (result.success) {
      console.log("Formulario enviado correctamente");
      setIsSuccess(true);
      // Limpiar respaldo si existía
      localStorage.removeItem('hj_requisicion_backup');
    } else {
      // Sistema de Fallback: Guardar en localStorage
      try {
        localStorage.setItem('hj_requisicion_backup', JSON.stringify({
          timestamp: new Date().toISOString(),
          data: formData
        }));
        console.log("Datos guardados en localStorage como respaldo.");
      } catch (e) {
        console.error("No se pudo guardar respaldo local:", e);
      }

      setError(result.message || "Error al enviar. Intenta nuevamente");
    }

    setIsSubmitting(false);
  };

  if (showIntro) {
    return (
      <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-premium border border-slate-100 max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-8">
          <ClipboardList size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-6 tracking-tight">Crea el Perfil de tu Vacante</h2>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Para encontrar al candidato ideal, necesitamos entender profundamente tus necesidades. Este perfilador nos ayudará a mapear las competencias clave de tu próxima contratación.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <Clock className="text-brand-orange mb-3" size={24} />
            <h4 className="font-bold text-brand-black mb-1">Tiempo</h4>
            <p className="text-sm text-slate-500">Solo te tomará 3-5 minutos completarlo.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <Calendar className="text-brand-blue mb-3" size={24} />
            <h4 className="font-bold text-brand-black mb-1">Estructura</h4>
            <p className="text-sm text-slate-500">6 pasos clave para un perfil profesional.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <AlertCircle className="text-brand-orange mb-3" size={24} />
            <h4 className="font-bold text-brand-black mb-1">Precisión</h4>
            <p className="text-sm text-slate-500">Mejora la calidad de los candidatos recibidos.</p>
          </div>
        </div>

        <Button onClick={() => setShowIntro(false)} variant="primary" size="xl" className="w-full md:w-auto">
          Comenzar ahora
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-premium border border-slate-100 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-4">Requisición enviada correctamente</h2>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Hemos recibido tu solicitud. Nuestros especialistas y sistema de IA están analizando tu requerimiento para presentarte una estrategia de búsqueda personalizada.
        </p>
        
        <div className="bg-slate-50 rounded-3xl p-8 mb-10 text-left border border-slate-100">
          <h4 className="font-black uppercase tracking-widest text-xs text-brand-blue mb-4">Siguientes Pasos</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
              Recibirás un correo de confirmación con el resumen de la vacante.
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
              Un consultor experto te contactará para validar detalles técnicos.
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
              <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
              Comenzaremos la entrega de candidatos en un plazo de 3 a 5 días.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = 'tel:+525500000000'} variant="outline" size="lg">
            <PhoneCall className="mr-2" size={20} />
            Llamada Urgente
          </Button>
          <Button onClick={() => window.location.reload()} variant="primary" size="lg">
            Crear Otra Vacante
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-premium border border-slate-100 overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
      
      {/* Sidebar Progress */}
      <div className="bg-brand-black p-8 md:w-1/4 flex flex-col relative overflow-hidden text-white shrink-0">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex-1">
          <h3 className="text-xl font-black mb-10 tracking-tight uppercase">Perfilador</h3>
          <div className="space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center group">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-brand-blue border-brand-blue text-white scale-110' : isPast ? 'bg-green-500 border-green-500 text-white' : 'border-slate-700 text-slate-600'}`}>
                    {isPast ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <div className={`ml-4 font-bold transition-colors duration-300 ${isActive ? 'text-white' : isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className="text-[10px] uppercase tracking-widest opacity-50">Fase {step.id}</div>
                    <div className="text-xs uppercase tracking-wider">{step.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 md:p-14 md:w-3/4 flex flex-col bg-white">
        
        <div className="flex-1 min-h-[450px]">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Datos de la Empresa</h2>
              <p className="text-slate-500 mb-8">Cuéntanos sobre tu organización.</p>
              <div className="space-y-6">
                <div>
                  <Label required>Nombre Comercial</Label>
                  <Input 
                    placeholder="Ej. TechCorp International" 
                    value={formData.empresa.nombre} 
                    onChange={e => updateData('empresa', 'nombre', e.target.value)} 
                  />
                </div>
                <div>
                  <Label required>Giro de Negocio</Label>
                  <Input 
                    placeholder="Ej. Fintech, Logística, E-commerce..." 
                    value={formData.empresa.giro} 
                    onChange={e => updateData('empresa', 'giro', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Ubicación (Ciudad/Estado)</Label>
                    <Input 
                      placeholder="Ej. Querétaro, Qro." 
                      value={formData.empresa.ciudad} 
                      onChange={e => updateData('empresa', 'ciudad', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label required>Tamaño de Plantilla</Label>
                    <Select 
                      value={formData.empresa.tamano} 
                      onChange={e => updateData('empresa', 'tamano', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1-10">Start-up (1-10)</option>
                      <option value="11-50">PyME (11-50)</option>
                      <option value="51-200">Consolidada (51-200)</option>
                      <option value="201-500">Gran Empresa (201-500)</option>
                      <option value="500+">Corporativo (500+)</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Persona de Contacto</h2>
              <p className="text-slate-500 mb-8">¿Con quién coordinaremos el proceso?</p>
              <div className="space-y-6">
                <div>
                  <Label required>Nombre Completo</Label>
                  <Input 
                    placeholder="Tu nombre y apellido" 
                    value={formData.contacto.nombre} 
                    onChange={e => updateData('contacto', 'nombre', e.target.value)} 
                  />
                </div>
                <div>
                  <Label>Cargo / Puesto</Label>
                  <Input 
                    placeholder="Ej. Lead Recruiter, CEO, Project Manager..." 
                    value={formData.contacto.puesto} 
                    onChange={e => updateData('contacto', 'puesto', e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Email Corporativo</Label>
                    <Input 
                      type="email"
                      placeholder="nombre@empresa.com" 
                      value={formData.contacto.email} 
                      onChange={e => updateData('contacto', 'email', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label required>Teléfono Directo</Label>
                    <Input 
                      type="tel"
                      placeholder="+52" 
                      value={formData.contacto.telefono} 
                      onChange={e => updateData('contacto', 'telefono', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Detalles de la Vacante</h2>
              <p className="text-slate-500 mb-8">Define el rol que necesitas cubrir.</p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Label required>Título del Puesto</Label>
                    <Input 
                      placeholder="Ej. Senior Accountant" 
                      value={formData.vacante.puesto} 
                      onChange={e => updateData('vacante', 'puesto', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label required>Plazas</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={formData.vacante.numero} 
                      onChange={e => updateData('vacante', 'numero', parseInt(e.target.value) || 1)} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Modalidad</Label>
                    <Select 
                      value={formData.vacante.modalidad} 
                      onChange={e => updateData('vacante', 'modalidad', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Remoto">100% Remoto</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Zona de Trabajo</Label>
                    <Input 
                      placeholder="Ej. Polanco, CDMX" 
                      value={formData.vacante.ubicacion} 
                      onChange={e => updateData('vacante', 'ubicacion', e.target.value)} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Disponibilidad de Ingreso</Label>
                  <Input 
                    type="date"
                    value={formData.vacante.fechaIngreso} 
                    onChange={e => updateData('vacante', 'fechaIngreso', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Condiciones y Horarios</h2>
              <p className="text-slate-500 mb-8">Define la oferta económica y la jornada.</p>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Sueldo Mensual Neto</Label>
                    <Input 
                      placeholder="Ej. $25,000 - $30,000" 
                      value={formData.condiciones.sueldo} 
                      onChange={e => updateData('condiciones', 'sueldo', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label required>Esquema de Contratación</Label>
                    <Select 
                      value={formData.condiciones.contrato} 
                      onChange={e => updateData('condiciones', 'contrato', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Indeterminado">Directo / Planta</option>
                      <option value="Proyecto">Por Proyecto / Temporal</option>
                      <option value="Freelance">Honorarios (RESICO/PF)</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label required>Jornada Laboral Detallada</Label>
                  <p className="text-xs text-slate-400 mb-4">Selecciona los días y define el horario de entrada y salida.</p>
                  
                  <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-inner bg-slate-50/50">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-black text-[10px] uppercase tracking-widest text-slate-500 w-12"></th>
                          <th className="px-4 py-3 text-left font-black text-[10px] uppercase tracking-widest text-slate-500">Día</th>
                          <th className="px-4 py-3 text-left font-black text-[10px] uppercase tracking-widest text-slate-500">Entrada</th>
                          <th className="px-4 py-3 text-left font-black text-[10px] uppercase tracking-widest text-slate-500">Salida</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {DAYS.map((day) => {
                          const isDayActive = formData.condiciones.jornada[day.id] !== null;
                          return (
                            <tr key={day.id} className={`transition-colors ${isDayActive ? 'bg-white' : 'opacity-60'}`}>
                              <td className="px-4 py-3">
                                <input 
                                  type="checkbox" 
                                  checked={isDayActive}
                                  onChange={(e) => updateJornadaDay(day.id, e.target.checked)}
                                  className="w-5 h-5 rounded-lg border-slate-300 text-brand-blue focus:ring-brand-blue transition-all cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3 font-bold text-brand-black">{day.label}</td>
                              <td className="px-4 py-3">
                                <input 
                                  type="time" 
                                  disabled={!isDayActive}
                                  value={formData.condiciones.jornada[day.id]?.inicio || ''}
                                  onChange={(e) => updateJornadaTime(day.id, 'inicio', e.target.value)}
                                  className="bg-slate-100 border-none rounded-lg px-2 py-1 text-xs font-mono disabled:opacity-30 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input 
                                  type="time" 
                                  disabled={!isDayActive}
                                  value={formData.condiciones.jornada[day.id]?.fin || ''}
                                  onChange={(e) => updateJornadaTime(day.id, 'fin', e.target.value)}
                                  className="bg-slate-100 border-none rounded-lg px-2 py-1 text-xs font-mono disabled:opacity-30 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <Label>Prestaciones Superiores</Label>
                  <Textarea 
                    rows={3}
                    placeholder="Vales, SGMM, Aguinaldo 30 días, etc." 
                    value={formData.condiciones.prestaciones} 
                    onChange={e => updateData('condiciones', 'prestaciones', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Perfil del Candidato</h2>
              <p className="text-slate-500 mb-8">¿Qué formación y experiencia buscas?</p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label required>Escolaridad Mínima</Label>
                    <Select 
                      value={formData.perfil.estudios} 
                      onChange={e => updateData('perfil', 'estudios', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Bachillerato">Bachillerato / Técnico</option>
                      <option value="Licenciatura">Licenciatura / Ingeniería</option>
                      <option value="Posgrado">Especialidad / Maestría</option>
                    </Select>
                  </div>
                  <div>
                    <Label required>Experiencia en el Rol</Label>
                    <Select 
                      value={formData.perfil.experiencia} 
                      onChange={e => updateData('perfil', 'experiencia', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="0-1">0 a 1 año (Junior)</option>
                      <option value="2-4">2 a 4 años (Mid)</option>
                      <option value="5+">5+ años (Senior)</option>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Idiomas / Nivel</Label>
                  <Input 
                    placeholder="Ej. Inglés Avanzado (C1)" 
                    value={formData.perfil.idiomas} 
                    onChange={e => updateData('perfil', 'idiomas', e.target.value)} 
                  />
                </div>

                <div>
                  <Label>Habilidades Técnicas (Enter para añadir)</Label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-wrap gap-2 items-center min-h-[60px] shadow-inner">
                    {formData.perfil.habilidades.map((skill, idx) => (
                      <span key={idx} className="bg-brand-blue text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-md">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-300">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-slate-400"
                      placeholder={formData.perfil.habilidades.length === 0 ? "Ej. SAP, SQL, Ventas..." : "Añadir más..."}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Objetivos y Detalles</h2>
              <p className="text-slate-500 mb-8">Últimos detalles para un perfil perfecto.</p>
              <div className="space-y-6">
                <div>
                  <Label required>Responsabilidades Principales</Label>
                  <Textarea 
                    rows={5}
                    placeholder="Describe los 3 a 5 objetivos clave del puesto..." 
                    value={formData.detalles.actividades} 
                    onChange={e => updateData('detalles', 'actividades', e.target.value)} 
                  />
                </div>
                <div>
                  <Label>Observaciones o Notas</Label>
                  <Textarea 
                    rows={3}
                    placeholder="Cualquier otro detalle importante..." 
                    value={formData.detalles.observaciones} 
                    onChange={e => updateData('detalles', 'observaciones', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold uppercase tracking-widest flex items-center animate-in fade-in">
              <AlertCircle size={16} className="mr-3" />
              {error}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStep === 1 || isSubmitting}
            className={`font-black text-[10px] uppercase tracking-[0.2em] ${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft size={16} className="mr-2" />
            Volver
          </Button>
          
          {currentStep < 6 ? (
            <Button variant="primary" onClick={handleNext} className="font-black text-[10px] uppercase tracking-[0.2em] px-8">
              Siguiente
              <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting} className="font-black text-[10px] uppercase tracking-[0.2em] px-10">
              {isSubmitting ? 'Enviando...' : 'Finalizar Perfil'}
              <CheckCircle2 size={16} className="ml-2" />
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
