'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { getCitiesForCountry } from '../lib/cities';

// Helper: digits only
const digitsOnly = (val: string | undefined) => !val || /^\d+$/.test(val);

// Dynamic class helpers — red border on error, gold on focus otherwise
const inputCls = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-colors ${hasError ? 'border-red-500/70 bg-red-500/5 focus:border-red-400' : 'border-white/30 focus:border-[#C9A84C]'}`;
const selectCls = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:bg-white/20 appearance-none cursor-pointer transition-colors ${hasError ? 'border-red-500/70 bg-red-500/5 focus:border-red-400' : 'border-white/30 focus:border-[#C9A84C]'}`;
const hint = (text: string) => <p className="text-white/40 text-xs mt-0.5 mb-1.5 leading-snug">{text}</p>;

// Ordinal number helper (French)
const ordinal = (n: number): string => n === 1 ? '1er' : `${n}ème`;

// Age calculator
const calculateAge = (day: string, month: string, year: string): number => {
  const today = new Date();
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ── Conditions Générales d'Inscription ──
const CGI_TEXT = `CONDITIONS GÉNÉRALES D'INSCRIPTION — PREPANEXTGEN

Article 1 — Objet
Les présentes Conditions Générales d'Inscription (CGI) régissent les relations entre PrepaNextGen (ci-après « l'Institut ») et le Parent ou Tuteur légal procédant à une demande d'inscription.

Article 2 — Inscription et admission
Toute demande d'inscription est soumise à validation par l'Institut. L'inscription n'est définitive qu'après confirmation écrite de l'équipe PrepaNextGen. L'Institut se réserve le droit de refuser ou de réorienter toute inscription ne correspondant pas aux critères du programme choisi.

Article 3 — Conditions d'âge et de niveau
Les programmes PrepaNextGen sont destinés aux enfants et jeunes de 5 à 18 ans. L'Institut se réserve le droit de rediriger un élève vers le programme le mieux adapté à son âge et à son niveau.

Article 4 — Règlement intérieur
L'élève s'engage à respecter le règlement intérieur de l'Institut : ponctualité, respect des formateurs et des autres élèves, utilisation soigneuse du matériel informatique. Tout comportement perturbateur grave pourra entraîner une exclusion définitive sans remboursement.

Article 5 — Paiement
Les frais d'inscription sont dus selon les modalités communiquées lors de la confirmation. Tout mois commencé est dû intégralement. En cas de paiement échelonné, tout défaut de règlement entraîne la suspension immédiate de l'accès aux cours.

Article 6 — Désistement et remboursement
Tout désistement doit être notifié par écrit avant le début du programme. Aucun remboursement n'est accordé après le démarrage des cours. Un avoir exceptionnel pourra être étudié uniquement sur présentation d'un justificatif médical.

Article 7 — Droit à l'image
En acceptant ces CGI, le Parent autorise PrepaNextGen à utiliser les photos et vidéos de l'élève réalisées lors des activités de l'Institut, à des fins de communication (réseaux sociaux, site web, supports pédagogiques). Cette autorisation est révocable à tout moment par écrit.

Article 8 — Protection des données personnelles
Les informations collectées sont utilisées exclusivement pour la gestion de la scolarité et la communication institutionnelle. Elles ne seront pas cédées à des tiers. Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données sur simple demande à : info@prepanextgen.com.

Article 9 — Responsabilité
L'Institut ne saurait être tenu responsable des pertes ou dommages causés à des effets personnels au sein de l'établissement. Sa responsabilité est limitée aux activités directement encadrées par ses formateurs accrédités.

Article 10 — Acceptation
En cochant la case d'acceptation, le Parent ou Tuteur légal déclare avoir lu, compris et accepté l'intégralité des présentes Conditions Générales d'Inscription. Cette acceptation a valeur d'engagement contractuel.`;

// ── Duplicate detection via localStorage ──
const STORAGE_KEY = 'prepanextgen_submissions';

type StoredChild = { lastName: string; firstName: string; birthDay: string; birthMonth: string; birthYear: string };

const getStoredSubmissions = (): StoredChild[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
};

const saveSubmission = (child: StoredChild) => {
  const existing = getStoredSubmissions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, child]));
};

const findDuplicate = (child: StoredChild): StoredChild | undefined =>
  getStoredSubmissions().find(
    s =>
      s.lastName.trim().toLowerCase()  === child.lastName.trim().toLowerCase()  &&
      s.firstName.trim().toLowerCase() === child.firstName.trim().toLowerCase() &&
      s.birthDay   === child.birthDay   &&
      s.birthMonth === child.birthMonth &&
      s.birthYear  === child.birthYear
  );

// Human-readable field names for step error messages
const FIELD_LABELS: Record<string, string> = {
  gender: 'le sexe de l\'élève (Garçon ou Fille)',
  lastName: 'le nom de famille de l\'élève',
  firstName: 'le prénom de l\'élève',
  birthDay: 'le jour de naissance',
  birthMonth: 'le mois de naissance',
  birthYear: 'l\'année de naissance',
  schoolLevel: 'le niveau scolaire',
  country: 'le pays de résidence',
  city: 'la ville',
  studentAddress: 'l\'adresse précise (quartier / rue)',
  motherLastName: 'le nom de la mère',
  motherFirstName: 'le prénom de la mère',
  motherPhone: 'le téléphone de la mère',
  motherResidence: 'le lieu de résidence de la mère',
  fatherLastName: 'le nom du père',
  fatherFirstName: 'le prénom du père',
  fatherPhone: 'le téléphone du père',
  fatherResidence: 'le lieu de résidence du père',
  contactIdentity: 'le lien de la personne avec l\'élève',
  contactLastName: 'le nom de la personne à contacter',
  contactFirstName: 'le prénom de la personne à contacter',
  contactPhone: 'le téléphone de la personne à contacter',
  contactWhatsApp: 'le WhatsApp de la personne à contacter',
  contactEmail: 'l\'email de la personne à contacter',
  contactResidence: 'l\'adresse de la personne à contacter',
  programCategory: 'la catégorie de programme',
  programType: 'le type de programme',
};

const getStepErrorMsg = (fields: string[], errs: Record<string, any>): string => {
  for (const f of fields) {
    if (errs[f]) {
      const raw = String(errs[f]?.message || '');
      if (!raw || raw === 'Invalid input') {
        return `Veuillez renseigner ${FIELD_LABELS[f] || f}.`;
      }
      return raw;
    }
  }
  return 'Veuillez remplir tous les champs obligatoires.';
};

// Fields to validate per step
const STEP_FIELDS: Record<number, string[]> = {
  1: ['gender','lastName','firstName','birthDay','birthMonth','birthYear','schoolLevel','country','city','studentAddress'],
  2: ['motherLastName','motherFirstName','motherPhone','motherResidence'],
  3: ['fatherLastName','fatherFirstName','fatherPhone','fatherResidence'],
  4: ['contactIdentity','contactLastName','contactFirstName','contactPhone','contactWhatsApp','contactEmail','contactResidence'],
  5: ['programCategory','programType'],
};

// Combined schema for all form data
const formSchema = z.object({
  // Step 1: Student Information
  gender: z.enum(['garcon', 'fille']),
  lastName: z.string().min(2, 'Nom de l\'élève requis (min. 2 lettres)'),
  firstName: z.string().min(2, 'Prénom de l\'élève requis (min. 2 lettres)'),
  birthDay: z.string().min(1, 'Jour de naissance requis'),
  birthMonth: z.string().min(1, 'Mois de naissance requis'),
  birthYear: z.string()
    .min(1, 'Année de naissance requise')
    .refine((v) => {
      const year = parseInt(v, 10);
      if (isNaN(year)) return false;
      const currentYear = new Date().getFullYear();
      return year >= currentYear - 18 && year <= currentYear - 5;
    }, `L'âge doit être compris entre 5 et 18 ans`),
  schoolLevel: z.string().min(1, 'Niveau scolaire requis'),
  country: z.string().min(2, 'Pays de résidence requis'),
  city: z.string().min(2, 'Ville requise'),
  studentAddress: z.string().min(3, 'Adresse / quartier requis'),

  // Step 2: Mother Information
  motherLastName: z.string().min(2, 'Nom de la mère requis'),
  motherFirstName: z.string().min(2, 'Prénom de la mère requis'),
  motherFunction: z.string().optional(),
  motherPhone: z.string().min(6, 'Téléphone de la mère requis').refine(digitsOnly, 'Chiffres uniquement (sans espace ni tiret)'),
  motherWhatsApp: z.string().refine(digitsOnly, 'Chiffres uniquement').optional().or(z.literal('')),
  motherEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  motherResidence: z.string().min(2, 'Lieu de résidence de la mère requis'),

  // Step 3: Father Information
  fatherLastName: z.string().min(2, 'Nom du père requis'),
  fatherFirstName: z.string().min(2, 'Prénom du père requis'),
  fatherFunction: z.string().optional(),
  fatherPhone: z.string().min(6, 'Téléphone du père requis').refine(digitsOnly, 'Chiffres uniquement (sans espace ni tiret)'),
  fatherWhatsApp: z.string().refine(digitsOnly, 'Chiffres uniquement').optional().or(z.literal('')),
  fatherEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  fatherResidence: z.string().min(2, 'Lieu de résidence du père requis'),

  // Step 4: Personne en charge de récupérer l'élève
  contactIdentity: z.enum(['Mère', 'Père', 'Grand-père', 'Grand-mère', 'Sœur', 'Frère', 'Oncle', 'Tante', 'Tuteur', 'Tutrice', 'Ami(e) des parents', 'Autre']),
  contactLastName: z.string().min(2, 'Nom requis'),
  contactFirstName: z.string().min(2, 'Prénom requis'),
  contactPhone: z.string().min(6, 'Téléphone requis').refine(digitsOnly, 'Chiffres uniquement'),
  contactWhatsApp: z.string().min(6, 'WhatsApp requis').refine(digitsOnly, 'Chiffres uniquement'),
  contactEmail: z.string().email('Email requis et valide'),
  contactResidence: z.string().min(2, 'Adresse de la personne à contacter requise'),

  // Step 5: Program Selection
  programCategory: z.enum(['PrepaKid (7-11 ans)', 'FlexiTeen (11-15 ans)', 'NextGen (16-18 ans)', 'Langues', 'VIP', 'Vacances Digitales']),
  programType: z.enum(['Programme', 'BOOST', 'IMPACT', 'HUB', 'Session A', 'Session B', 'Session C', 'PREPANEXTGEN VIP']),
  days: z.array(z.string()).max(2, 'Maximum 2 jours autorisés'),
  message: z.string().optional(),
}).refine(
  (data) => !data.fatherPhone || data.fatherPhone !== data.motherPhone,
  { message: 'Le numéro du père doit être différent de celui de la mère', path: ['fatherPhone'] }
).refine(
  (data) => !data.fatherWhatsApp || !data.motherWhatsApp || data.fatherWhatsApp !== data.motherWhatsApp,
  { message: 'Le WhatsApp du père doit être différent de celui de la mère', path: ['fatherWhatsApp'] }
);

type FormData = z.infer<typeof formSchema>;

interface AdmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProgram?: { category: string; type: string } | null;
}

// Country codes — most common for PrepaNextGen families
const COUNTRY_CODES = [
  { code: '+225', flag: '🇨🇮', label: 'CI' },
  { code: '+221', flag: '🇸🇳', label: 'SN' },
  { code: '+223', flag: '🇲🇱', label: 'ML' },
  { code: '+226', flag: '🇧🇫', label: 'BF' },
  { code: '+224', flag: '🇬🇳', label: 'GN' },
  { code: '+228', flag: '🇹🇬', label: 'TG' },
  { code: '+229', flag: '🇧🇯', label: 'BJ' },
  { code: '+233', flag: '🇬🇭', label: 'GH' },
  { code: '+234', flag: '🇳🇬', label: 'NG' },
  { code: '+237', flag: '🇨🇲', label: 'CM' },
  { code: '+241', flag: '🇬🇦', label: 'GA' },
  { code: '+242', flag: '🇨🇬', label: 'CG' },
  { code: '+243', flag: '🇨🇩', label: 'CD' },
  { code: '+212', flag: '🇲🇦', label: 'MA' },
  { code: '+213', flag: '🇩🇿', label: 'DZ' },
  { code: '+216', flag: '🇹🇳', label: 'TN' },
  { code: '+20',  flag: '🇪🇬', label: 'EG' },
  { code: '+250', flag: '🇷🇼', label: 'RW' },
  { code: '+254', flag: '🇰🇪', label: 'KE' },
  { code: '+27',  flag: '🇿🇦', label: 'ZA' },
  { code: '+33',  flag: '🇫🇷', label: 'FR' },
  { code: '+32',  flag: '🇧🇪', label: 'BE' },
  { code: '+41',  flag: '🇨🇭', label: 'CH' },
  { code: '+1',   flag: '🇨🇦', label: 'CA' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+44',  flag: '🇬🇧', label: 'GB' },
  { code: '+49',  flag: '🇩🇪', label: 'DE' },
  { code: '+39',  flag: '🇮🇹', label: 'IT' },
  { code: '+34',  flag: '🇪🇸', label: 'ES' },
  { code: '+351', flag: '🇵🇹', label: 'PT' },
  { code: '+961', flag: '🇱🇧', label: 'LB' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+55',  flag: '🇧🇷', label: 'BR' },
  { code: '+1',   flag: '🇺🇸', label: 'Autre' },
];

// Reusable phone input with country code selector
const PhoneCodeSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="bg-white/5 text-white text-sm focus:outline-none cursor-pointer border-r border-white/20 shrink-0 px-1 py-3"
    style={{ width: '88px' }}
  >
    {COUNTRY_CODES.map((c, i) => (
      <option key={i} value={c.code} className="bg-[#0A0F2C] text-white">
        {c.flag} {c.code}
      </option>
    ))}
  </select>
);

const AdmissionForm: React.FC<AdmissionFormProps> = ({ isOpen, onClose, preselectedProgram }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [childCount, setChildCount] = useState(1);
  const [registeredChildren, setRegisteredChildren] = useState<string[]>([]);

  // Phone country codes state
  const [motherPhoneCode, setMotherPhoneCode] = useState('+225');
  const [motherWaCode, setMotherWaCode] = useState('+225');
  const [fatherPhoneCode, setFatherPhoneCode] = useState('+225');
  const [fatherWaCode, setFatherWaCode] = useState('+225');
  const [contactPhoneCode, setContactPhoneCode] = useState('+225');
  const [contactWaCode, setContactWaCode] = useState('+225');

  // Same-address checkboxes
  const [motherSameAddr, setMotherSameAddr] = useState(false);
  const [fatherSameAddr, setFatherSameAddr] = useState(false);
  const [contactSameAddr, setContactSameAddr] = useState(false);

  // Submit confirmation popup
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pendingAddChild, setPendingAddChild] = useState(false);

  // Duplicate detection
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');

  // Age confirmation popup
  const [showAgeConfirm, setShowAgeConfirm] = useState(false);
  const [pendingNextStep, setPendingNextStep] = useState(false);
  const [childAgeDisplay, setChildAgeDisplay] = useState(0);

  // Conditions Générales
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCGI, setShowCGI] = useState(false);

  // Step validation error popup
  const [stepErrorMsg, setStepErrorMsg] = useState('');
  const [xanoError, setXanoError] = useState('');

  // "Autre" free-text for function and contact identity
  const [motherFunctionOther, setMotherFunctionOther] = useState('');
  const [fatherFunctionOther, setFatherFunctionOther] = useState('');
  const [contactIdentityOther, setContactIdentityOther] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset, getValues, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'all',       // validate on change AND blur so errors clear as soon as field is fixed
    reValidateMode: 'onChange',
  });

  // Reset form state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSubmitStatus('idle');
      setChildCount(1);
      setRegisteredChildren([]);
      setTermsAccepted(false);
      setShowCGI(false);
      if (preselectedProgram) {
        setValue('programCategory', preselectedProgram.category as any);
        setValue('programType', preselectedProgram.type as any);
      }
    }
  }, [isOpen, preselectedProgram, setValue]);

  const watchedDays = watch('days', []);
  const watchedCountry = watch('country', '');
  const watchedCity = watch('city', '');
  const watchedStudentAddress = watch('studentAddress', '');
  const watchGender = watch('gender');
  const watchMotherFunction = watch('motherFunction');
  const watchFatherFunction = watch('fatherFunction');
  const watchContactIdentity = watch('contactIdentity');

  const isContactMother = watchContactIdentity === 'Mère';
  const isContactFather = watchContactIdentity === 'Père';
  const availableCities = getCitiesForCountry(watchedCountry);

  // Auto-fill "same address" fields when student address changes
  const studentFullAddress = [watchedCity, watchedStudentAddress].filter(Boolean).join(' — ');
  React.useEffect(() => {
    if (motherSameAddr) setValue('motherResidence', studentFullAddress);
  }, [motherSameAddr, studentFullAddress, setValue]);
  React.useEffect(() => {
    if (fatherSameAddr) setValue('fatherResidence', studentFullAddress);
  }, [fatherSameAddr, studentFullAddress, setValue]);
  React.useEffect(() => {
    if (contactSameAddr) setValue('contactResidence', studentFullAddress);
  }, [contactSameAddr, studentFullAddress, setValue]);

  // Auto-remplissage contact si Mère ou Père, vidage si on change
  React.useEffect(() => {
    if (!watchContactIdentity) return;
    if (watchContactIdentity === 'Mère') {
      setValue('contactLastName',  getValues('motherLastName'));
      setValue('contactFirstName', getValues('motherFirstName'));
      setValue('contactPhone',     getValues('motherPhone'));
      setValue('contactWhatsApp',  getValues('motherWhatsApp') || '');
      setValue('contactEmail',     getValues('motherEmail') || '');
      setValue('contactResidence', getValues('motherResidence'));
      setContactPhoneCode(motherPhoneCode);
      setContactWaCode(motherWaCode);
    } else if (watchContactIdentity === 'Père') {
      setValue('contactLastName',  getValues('fatherLastName'));
      setValue('contactFirstName', getValues('fatherFirstName'));
      setValue('contactPhone',     getValues('fatherPhone'));
      setValue('contactWhatsApp',  getValues('fatherWhatsApp') || '');
      setValue('contactEmail',     getValues('fatherEmail') || '');
      setValue('contactResidence', getValues('fatherResidence'));
      setContactPhoneCode(fatherPhoneCode);
      setContactWaCode(fatherWaCode);
    } else {
      // Autre choix → vider tous les champs contact
      setValue('contactLastName',  '');
      setValue('contactFirstName', '');
      setValue('contactPhone',     '');
      setValue('contactWhatsApp',  '');
      setValue('contactEmail',     '');
      setValue('contactResidence', '');
      setContactPhoneCode('+225');
      setContactWaCode('+225');
    }
  }, [watchContactIdentity]);

  const steps = [
    { number: 1, title: 'Informations de l\'élève' },
    { number: 2, title: 'Mère' },
    { number: 3, title: 'Père' },
    { number: 4, title: 'Personnes autorisées à venir chercher l\'enfant & Contacts d\'urgence' },
    { number: 5, title: 'Programme choisi' },
  ];

  // Inscrire un autre enfant — réinitialise étape 1 seulement, saute les étapes parent
  const registerAnotherChild = () => {
    const current = getValues();
    setChildCount(c => c + 1);
    setSubmitStatus('idle');
    setPendingAddChild(false);
    setStepErrorMsg('');
    setValue('gender', undefined as any);
    setValue('lastName', '');
    setValue('firstName', '');
    setValue('birthDay', '');
    setValue('birthMonth', '');
    setValue('birthYear', '');
    setValue('schoolLevel', '');
    setValue('country', current.country);
    setValue('city', '');
    setValue('studentAddress', '');
    setCurrentStep(1);
  };

  const availableDays = [
    'Samedi 8h–12h',
    'Samedi 14h–17h',
    'Samedi 8h–17h',
    'Dimanche 8h–12h',
    'Dimanche 14h–17h',
    'Dimanche 8h–17h',
    'Mercredi 14h–17h',
  ];

  const handleDayToggle = (day: string) => {
    const currentDays = watchedDays || [];
    if (currentDays.includes(day)) {
      setValue('days', currentDays.filter(d => d !== day));
    } else if (currentDays.length < 2) {
      setValue('days', [...currentDays, day]);
    }
  };

  const addChildRef = React.useRef(false);

  const onSubmit = async (data: FormData) => {
    const addChild = addChildRef.current;
    addChildRef.current = false;

    // Filet de sécurité : tél père ≠ tél mère (normalement déjà bloqué à l'étape 3)
    if (data.fatherPhone && data.fatherPhone === data.motherPhone) {
      setStepErrorMsg('Le numéro de téléphone du père doit être différent de celui de la mère.');
      return;
    }

    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    try {
      // Payload — noms de paramètres tels que définis dans Xano
      const payload = {
        child_number:         childCount,
        gender:               data.gender,
        last_name:            data.lastName,
        first_name:           data.firstName,
        birth_day:            data.birthDay,
        birth_month:          data.birthMonth,
        birth_year:           data.birthYear,
        school_level:         data.schoolLevel,
        country:              data.country,
        city:                 data.city,
        student_address:      data.studentAddress,
        mother_last_name:     data.motherLastName,
        mother_first_name:    data.motherFirstName,
        mother_function:      data.motherFunction === 'Autre' ? (motherFunctionOther || '') : (data.motherFunction || ''),
        mother_phone:         motherPhoneCode + data.motherPhone,
        mother_whatsapp:      data.motherWhatsApp ? motherWaCode + data.motherWhatsApp : '',
        mother_email:         data.motherEmail || '',
        mother_residence:     data.motherResidence,
        father_last_name:     data.fatherLastName,
        father_first_name:    data.fatherFirstName,
        father_function:      data.fatherFunction === 'Autre' ? (fatherFunctionOther || '') : (data.fatherFunction || ''),
        father_phone:         fatherPhoneCode + data.fatherPhone,
        father_whatsapp:      data.fatherWhatsApp ? fatherWaCode + data.fatherWhatsApp : '',
        father_email:         data.fatherEmail || '',
        father_residence:     data.fatherResidence,
        contact_identity:     data.contactIdentity === 'Autre' ? (contactIdentityOther || '') : (data.contactIdentity || ''),
        contact_last_name:    data.contactLastName,
        contact_first_name:   data.contactFirstName,
        contact_phone:        contactPhoneCode + data.contactPhone,
        contact_whatsapp:     data.contactWhatsApp ? contactWaCode + data.contactWhatsApp : '',
        contact_email:        data.contactEmail || '',
        contact_residence:    data.contactResidence,
        program_category:     data.programCategory,
        program_type:         data.programType,
        days:                 data.days,
        message:              data.message || '',
      };

      const apiUrl = process.env.NEXT_PUBLIC_XANO_BASE_URL;
      if (apiUrl) {
        console.log('📤 Envoi vers Xano:', `${apiUrl}/admissions`);
        console.log('📦 Payload:', payload);
        const response = await fetch(`${apiUrl}/admissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errText = await response.text();
          console.error('❌ Xano erreur', response.status, errText);
          setXanoError(`Erreur ${response.status} : ${errText}`);
          setSubmitStatus('error');
          return;
        }
      } else {
        // Mode démo — pas de backend configuré, on simule le succès
        await new Promise(r => setTimeout(r, 800));
      }

      setSubmitStatus('success');
      setRegisteredChildren(prev => [...prev, `${data.firstName} ${data.lastName}`]);

      // Sauvegarder pour éviter les doublons lors d'une future soumission
      saveSubmission({
        lastName:   data.lastName,
        firstName:  data.firstName,
        birthDay:   data.birthDay,
        birthMonth: data.birthMonth,
        birthYear:  data.birthYear,
      });

      // Si le parent veut inscrire un autre enfant, on le prépare après affichage du succès
      if (addChild) {
        setTimeout(() => registerAnotherChild(), 1500);
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Valider l'étape courante avant d'avancer
  const nextStep = async () => {
    let fields = STEP_FIELDS[currentStep] || [];
    // Étape 4 : si Mère ou Père sélectionné, les autres champs sont auto-remplis
    // depuis les étapes 2/3 déjà validées → on ne revalide que l'identité
    if (currentStep === 4) {
      const identity = getValues('contactIdentity');
      if (identity === 'Mère' || identity === 'Père') {
        fields = ['contactIdentity'];
      }
    }
    await trigger(fields as any);
    const hasError = fields.some(f => (errors as any)[f]);
    if (hasError) {
      setStepErrorMsg(getStepErrorMsg(fields, errors as any));
      return;
    }

    // Étape 3 : vérifier que le tél père ≠ tél mère avant d'avancer
    if (currentStep === 3) {
      const fp = getValues('fatherPhone');
      const mp = getValues('motherPhone');
      if (fp && mp && fp === mp) {
        setStepErrorMsg('Le numéro de téléphone du père doit être différent de celui de la mère.');
        return;
      }
    }

    // Étape 1 : confirmer l'âge de l'enfant avant d'avancer
    if (currentStep === 1) {
      const { birthDay, birthMonth, birthYear, firstName, lastName } = getValues();
      const age = calculateAge(birthDay, birthMonth, birthYear);
      setChildAgeDisplay(age);
      setShowAgeConfirm(true);
      setPendingNextStep(true);
      return;
    }

    setStepErrorMsg('');
    if (childCount > 1 && currentStep === 1) setCurrentStep(5);
    else if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setStepErrorMsg('');
    if (childCount > 1 && currentStep === 5) setCurrentStep(1);
    else if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Bouton "Envoyer" → valide + vérifie doublon + ouvre popup confirmation
  const handleFinalSubmitClick = async () => {
    const fields = STEP_FIELDS[5] || [];
    await trigger(fields as any);
    const hasError = fields.some(f => (errors as any)[f]);
    if (hasError) {
      setStepErrorMsg(getStepErrorMsg(fields, errors as any));
      return;
    }
    // Vérifier tél père ≠ mère (au cas où modifié après l'étape 3)
    const fp = getValues('fatherPhone');
    const mp = getValues('motherPhone');
    if (fp && mp && fp === mp) {
      setStepErrorMsg('Le numéro de téléphone du père doit être différent de celui de la mère.');
      return;
    }

    // Vérifier CGI acceptées
    if (!termsAccepted) {
      setStepErrorMsg('Veuillez accepter les Conditions Générales d\'Inscription pour continuer.');
      return;
    }

    setStepErrorMsg('');

    // Vérification doublon
    const v = getValues();
    const dup = findDuplicate({
      lastName:   v.lastName,
      firstName:  v.firstName,
      birthDay:   v.birthDay,
      birthMonth: v.birthMonth,
      birthYear:  v.birthYear,
    });
    if (dup) {
      setDuplicateName(`${dup.firstName} ${dup.lastName}`);
      setShowDuplicateWarning(true);
      return;
    }

    setShowSubmitConfirm(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-2xl mx-auto">

        {/* ── Children tracker bar ── */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {/* Registered children chips */}
          {registeredChildren.map((name, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-medium">
              <span>✅</span>
              <span>{name}</span>
            </div>
          ))}

          {/* Current child in progress */}
          {submitStatus !== 'success' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C]/20 border border-[#C9A84C]/50 rounded-full text-[#C9A84C] text-sm font-medium">
              <span>🖊️</span>
              <span>Enfant {childCount} (en cours)</span>
            </div>
          )}

          {/* Add child button — always visible, only clickable after success */}
          <div
            onClick={submitStatus === 'success' ? registerAnotherChild : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all select-none ${
              submitStatus === 'success'
                ? 'bg-[#C9A84C] hover:bg-[#C9A84C]/80 text-white cursor-pointer shadow-lg'
                : 'border border-dashed border-white/20 text-white/25 cursor-not-allowed'
            }`}
          >
            <span className="font-bold">＋</span>
            <span>{ordinal(childCount + 1)} enfant</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-5">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-sm sm:text-base font-semibold shrink-0 transition-colors ${
                currentStep >= step.number
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-white'
                  : 'border-white/30 text-white/60'
              }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[4px] transition-colors ${
                  currentStep > step.number ? 'bg-[#C9A84C]' : 'bg-white/20'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Étape courante — titre + indicateur mobile */}
        <div className="mb-5 text-center">
          <p className="text-white/40 text-xs mb-0.5 tracking-wider uppercase">Étape {currentStep} / 5</p>
          <h2 className="text-base sm:text-2xl font-serif text-white leading-snug px-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {steps[currentStep - 1].title}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={currentStep}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Student Information */}
            {currentStep === 1 && (
              <>
                {childCount > 1 && (
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg px-4 py-2 text-[#C9A84C] text-sm font-medium">
                    👶 Inscription de l'enfant n°{childCount} — les informations parentales sont déjà enregistrées.
                  </div>
                )}
                <div>
                  <label className="block text-white mb-3 font-medium text-center text-lg">Sexe *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center gap-3 cursor-pointer p-6 rounded-xl border-2 transition-all select-none ${watchGender === 'garcon' ? 'bg-[#C9A84C]/20 border-[#C9A84C] shadow-lg' : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'}`}>
                      <input type="radio" {...register('gender')} value="garcon" className="sr-only" />
                      <span className="text-6xl">👦</span>
                      <span className={`font-bold text-xl ${watchGender === 'garcon' ? 'text-[#C9A84C]' : 'text-white'}`}>Garçon</span>
                    </label>
                    <label className={`flex flex-col items-center gap-3 cursor-pointer p-6 rounded-xl border-2 transition-all select-none ${watchGender === 'fille' ? 'bg-[#C9A84C]/20 border-[#C9A84C] shadow-lg' : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'}`}>
                      <input type="radio" {...register('gender')} value="fille" className="sr-only" />
                      <span className="text-6xl">👧</span>
                      <span className={`font-bold text-xl ${watchGender === 'fille' ? 'text-[#C9A84C]' : 'text-white'}`}>Fille</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-400 text-sm mt-2 text-center">{errors.gender.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium">Nom *</label>
                    {hint('Tel qu\'il figure sur les documents officiels')}
                    <input {...register('lastName')} className={inputCls(!!errors.lastName)} placeholder="Nom de famille" />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-white font-medium">Prénom *</label>
                    {hint('Prénom(s) complet(s) de l\'élève')}
                    <input {...register('firstName')} className={inputCls(!!errors.firstName)} placeholder="Prénom(s)" />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Date de naissance *</label>
                  {hint('Âge requis : 5 à 18 ans. Vérifiez bien l\'année avant de continuer.')}
                  <div className="grid grid-cols-3 gap-2">
                    <select {...register('birthDay')} style={{ colorScheme: 'dark' }} className={`px-3 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:bg-white/20 ${errors.birthDay ? 'border-red-500/70' : 'border-white/30 focus:border-[#C9A84C]'}`}>
                      <option value="">Jour</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select {...register('birthMonth')} style={{ colorScheme: 'dark' }} className="px-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#C9A84C] focus:bg-white/20">
                      <option value="">Mois</option>
                      <option value="1">Janvier</option>
                      <option value="2">Février</option>
                      <option value="3">Mars</option>
                      <option value="4">Avril</option>
                      <option value="5">Mai</option>
                      <option value="6">Juin</option>
                      <option value="7">Juillet</option>
                      <option value="8">Août</option>
                      <option value="9">Septembre</option>
                      <option value="10">Octobre</option>
                      <option value="11">Novembre</option>
                      <option value="12">Décembre</option>
                    </select>
                    <select {...register('birthYear')} style={{ colorScheme: 'dark' }} className="px-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#C9A84C] focus:bg-white/20">
                      <option value="">Année</option>
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const minYear = currentYear - 18; // 18 ans max
                        const maxYear = currentYear - 5;  // 5 ans min
                        return Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Niveau scolaire *</label>
                  {hint('Classe actuelle de l\'élève dans son établissement scolaire')}
                  <select {...register('schoolLevel')} style={{ colorScheme: 'dark' }} className={selectCls(!!errors.schoolLevel)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                    <option value="CP" className="bg-[#0A0F2C] text-white">CP</option>
                    <option value="CE1" className="bg-[#0A0F2C] text-white">CE1</option>
                    <option value="CE2" className="bg-[#0A0F2C] text-white">CE2</option>
                    <option value="CM1" className="bg-[#0A0F2C] text-white">CM1</option>
                    <option value="CM2" className="bg-[#0A0F2C] text-white">CM2</option>
                    <option value="6ème" className="bg-[#0A0F2C] text-white">6ème</option>
                    <option value="5ème" className="bg-[#0A0F2C] text-white">5ème</option>
                    <option value="4ème" className="bg-[#0A0F2C] text-white">4ème</option>
                    <option value="3ème" className="bg-[#0A0F2C] text-white">3ème</option>
                    <option value="2nde" className="bg-[#0A0F2C] text-white">2nde</option>
                    <option value="1ère" className="bg-[#0A0F2C] text-white">1ère</option>
                    <option value="Terminale" className="bg-[#0A0F2C] text-white">Terminale</option>
                  </select>
                  {errors.schoolLevel && <p className="text-red-400 text-xs mt-1">{errors.schoolLevel.message}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium">Pays de résidence (élève) *</label>
                  {hint('Pays où vit l\'élève actuellement')}
                  <select {...register('country')} style={{ colorScheme: 'dark' }} className={selectCls(!!errors.country)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner un pays...</option>
                    {/* ── Pays les plus courants ── */}
                    <option value="CI" className="bg-[#0A0F2C] text-white">🇨🇮 Côte d'Ivoire</option>
                    <option value="SN" className="bg-[#0A0F2C] text-white">🇸🇳 Sénégal</option>
                    <option value="ML" className="bg-[#0A0F2C] text-white">🇲🇱 Mali</option>
                    <option value="BF" className="bg-[#0A0F2C] text-white">🇧🇫 Burkina Faso</option>
                    <option value="GN" className="bg-[#0A0F2C] text-white">🇬🇳 Guinée</option>
                    <option value="TG" className="bg-[#0A0F2C] text-white">🇹🇬 Togo</option>
                    <option value="BJ" className="bg-[#0A0F2C] text-white">🇧🇯 Bénin</option>
                    <option value="GH" className="bg-[#0A0F2C] text-white">🇬🇭 Ghana</option>
                    <option value="NG" className="bg-[#0A0F2C] text-white">🇳🇬 Nigéria</option>
                    <option value="CM" className="bg-[#0A0F2C] text-white">🇨🇲 Cameroun</option>
                    <option value="GA" className="bg-[#0A0F2C] text-white">🇬🇦 Gabon</option>
                    <option value="CG" className="bg-[#0A0F2C] text-white">🇨🇬 Congo</option>
                    <option value="CD" className="bg-[#0A0F2C] text-white">🇨🇩 RD Congo</option>
                    <option value="MA" className="bg-[#0A0F2C] text-white">🇲🇦 Maroc</option>
                    <option value="DZ" className="bg-[#0A0F2C] text-white">🇩🇿 Algérie</option>
                    <option value="TN" className="bg-[#0A0F2C] text-white">🇹🇳 Tunisie</option>
                    <option value="FR" className="bg-[#0A0F2C] text-white">🇫🇷 France</option>
                    <option value="BE" className="bg-[#0A0F2C] text-white">🇧🇪 Belgique</option>
                    <option value="CH" className="bg-[#0A0F2C] text-white">🇨🇭 Suisse</option>
                    <option value="CA" className="bg-[#0A0F2C] text-white">🇨🇦 Canada</option>
                    <option value="US" className="bg-[#0A0F2C] text-white">🇺🇸 États-Unis</option>
                    <option value="GB" className="bg-[#0A0F2C] text-white">🇬🇧 Royaume-Uni</option>
                    <option disabled className="bg-[#0A0F2C] text-white/40">──────────────────</option>
                    {/* ── Tous les pays ── */}
                    <option value="AF" className="bg-[#0A0F2C] text-white">Afghanistan</option>
                    <option value="ZA" className="bg-[#0A0F2C] text-white">Afrique du Sud</option>
                    <option value="AL" className="bg-[#0A0F2C] text-white">Albanie</option>
                    <option value="DZ" className="bg-[#0A0F2C] text-white">Algérie</option>
                    <option value="DE" className="bg-[#0A0F2C] text-white">Allemagne</option>
                    <option value="AD" className="bg-[#0A0F2C] text-white">Andorre</option>
                    <option value="AO" className="bg-[#0A0F2C] text-white">Angola</option>
                    <option value="AG" className="bg-[#0A0F2C] text-white">Antigua-et-Barbuda</option>
                    <option value="SA" className="bg-[#0A0F2C] text-white">Arabie Saoudite</option>
                    <option value="AR" className="bg-[#0A0F2C] text-white">Argentine</option>
                    <option value="AM" className="bg-[#0A0F2C] text-white">Arménie</option>
                    <option value="AU" className="bg-[#0A0F2C] text-white">Australie</option>
                    <option value="AT" className="bg-[#0A0F2C] text-white">Autriche</option>
                    <option value="AZ" className="bg-[#0A0F2C] text-white">Azerbaïdjan</option>
                    <option value="BS" className="bg-[#0A0F2C] text-white">Bahamas</option>
                    <option value="BH" className="bg-[#0A0F2C] text-white">Bahreïn</option>
                    <option value="BD" className="bg-[#0A0F2C] text-white">Bangladesh</option>
                    <option value="BB" className="bg-[#0A0F2C] text-white">Barbade</option>
                    <option value="BE" className="bg-[#0A0F2C] text-white">Belgique</option>
                    <option value="BZ" className="bg-[#0A0F2C] text-white">Belize</option>
                    <option value="BJ" className="bg-[#0A0F2C] text-white">Bénin</option>
                    <option value="BT" className="bg-[#0A0F2C] text-white">Bhoutan</option>
                    <option value="BY" className="bg-[#0A0F2C] text-white">Biélorussie</option>
                    <option value="BO" className="bg-[#0A0F2C] text-white">Bolivie</option>
                    <option value="BA" className="bg-[#0A0F2C] text-white">Bosnie-Herzégovine</option>
                    <option value="BW" className="bg-[#0A0F2C] text-white">Botswana</option>
                    <option value="BR" className="bg-[#0A0F2C] text-white">Brésil</option>
                    <option value="BN" className="bg-[#0A0F2C] text-white">Brunei</option>
                    <option value="BG" className="bg-[#0A0F2C] text-white">Bulgarie</option>
                    <option value="BF" className="bg-[#0A0F2C] text-white">Burkina Faso</option>
                    <option value="BI" className="bg-[#0A0F2C] text-white">Burundi</option>
                    <option value="KH" className="bg-[#0A0F2C] text-white">Cambodge</option>
                    <option value="CM" className="bg-[#0A0F2C] text-white">Cameroun</option>
                    <option value="CA" className="bg-[#0A0F2C] text-white">Canada</option>
                    <option value="CV" className="bg-[#0A0F2C] text-white">Cap-Vert</option>
                    <option value="CF" className="bg-[#0A0F2C] text-white">Centrafrique</option>
                    <option value="CL" className="bg-[#0A0F2C] text-white">Chili</option>
                    <option value="CN" className="bg-[#0A0F2C] text-white">Chine</option>
                    <option value="CY" className="bg-[#0A0F2C] text-white">Chypre</option>
                    <option value="CO" className="bg-[#0A0F2C] text-white">Colombie</option>
                    <option value="KM" className="bg-[#0A0F2C] text-white">Comores</option>
                    <option value="CG" className="bg-[#0A0F2C] text-white">Congo</option>
                    <option value="CD" className="bg-[#0A0F2C] text-white">RD Congo</option>
                    <option value="KR" className="bg-[#0A0F2C] text-white">Corée du Sud</option>
                    <option value="CR" className="bg-[#0A0F2C] text-white">Costa Rica</option>
                    <option value="CI" className="bg-[#0A0F2C] text-white">Côte d'Ivoire</option>
                    <option value="HR" className="bg-[#0A0F2C] text-white">Croatie</option>
                    <option value="CU" className="bg-[#0A0F2C] text-white">Cuba</option>
                    <option value="DK" className="bg-[#0A0F2C] text-white">Danemark</option>
                    <option value="DJ" className="bg-[#0A0F2C] text-white">Djibouti</option>
                    <option value="DM" className="bg-[#0A0F2C] text-white">Dominique</option>
                    <option value="EG" className="bg-[#0A0F2C] text-white">Égypte</option>
                    <option value="AE" className="bg-[#0A0F2C] text-white">Émirats Arabes Unis</option>
                    <option value="EC" className="bg-[#0A0F2C] text-white">Équateur</option>
                    <option value="ES" className="bg-[#0A0F2C] text-white">Espagne</option>
                    <option value="EE" className="bg-[#0A0F2C] text-white">Estonie</option>
                    <option value="US" className="bg-[#0A0F2C] text-white">États-Unis</option>
                    <option value="ET" className="bg-[#0A0F2C] text-white">Éthiopie</option>
                    <option value="FJ" className="bg-[#0A0F2C] text-white">Fidji</option>
                    <option value="FI" className="bg-[#0A0F2C] text-white">Finlande</option>
                    <option value="FR" className="bg-[#0A0F2C] text-white">France</option>
                    <option value="GA" className="bg-[#0A0F2C] text-white">Gabon</option>
                    <option value="GM" className="bg-[#0A0F2C] text-white">Gambie</option>
                    <option value="GE" className="bg-[#0A0F2C] text-white">Géorgie</option>
                    <option value="GH" className="bg-[#0A0F2C] text-white">Ghana</option>
                    <option value="GR" className="bg-[#0A0F2C] text-white">Grèce</option>
                    <option value="GD" className="bg-[#0A0F2C] text-white">Grenade</option>
                    <option value="GT" className="bg-[#0A0F2C] text-white">Guatemala</option>
                    <option value="GN" className="bg-[#0A0F2C] text-white">Guinée</option>
                    <option value="GW" className="bg-[#0A0F2C] text-white">Guinée-Bissau</option>
                    <option value="GY" className="bg-[#0A0F2C] text-white">Guyana</option>
                    <option value="HT" className="bg-[#0A0F2C] text-white">Haïti</option>
                    <option value="HN" className="bg-[#0A0F2C] text-white">Honduras</option>
                    <option value="HU" className="bg-[#0A0F2C] text-white">Hongrie</option>
                    <option value="IN" className="bg-[#0A0F2C] text-white">Inde</option>
                    <option value="ID" className="bg-[#0A0F2C] text-white">Indonésie</option>
                    <option value="IR" className="bg-[#0A0F2C] text-white">Iran</option>
                    <option value="IQ" className="bg-[#0A0F2C] text-white">Irak</option>
                    <option value="IE" className="bg-[#0A0F2C] text-white">Irlande</option>
                    <option value="IS" className="bg-[#0A0F2C] text-white">Islande</option>
                    <option value="IL" className="bg-[#0A0F2C] text-white">Israël</option>
                    <option value="IT" className="bg-[#0A0F2C] text-white">Italie</option>
                    <option value="JM" className="bg-[#0A0F2C] text-white">Jamaïque</option>
                    <option value="JP" className="bg-[#0A0F2C] text-white">Japon</option>
                    <option value="JO" className="bg-[#0A0F2C] text-white">Jordanie</option>
                    <option value="KZ" className="bg-[#0A0F2C] text-white">Kazakhstan</option>
                    <option value="KE" className="bg-[#0A0F2C] text-white">Kenya</option>
                    <option value="KG" className="bg-[#0A0F2C] text-white">Kirghizistan</option>
                    <option value="KI" className="bg-[#0A0F2C] text-white">Kiribati</option>
                    <option value="KW" className="bg-[#0A0F2C] text-white">Koweït</option>
                    <option value="LA" className="bg-[#0A0F2C] text-white">Laos</option>
                    <option value="LS" className="bg-[#0A0F2C] text-white">Lesotho</option>
                    <option value="LV" className="bg-[#0A0F2C] text-white">Lettonie</option>
                    <option value="LB" className="bg-[#0A0F2C] text-white">Liban</option>
                    <option value="LR" className="bg-[#0A0F2C] text-white">Libéria</option>
                    <option value="LY" className="bg-[#0A0F2C] text-white">Libye</option>
                    <option value="LI" className="bg-[#0A0F2C] text-white">Liechtenstein</option>
                    <option value="LT" className="bg-[#0A0F2C] text-white">Lituanie</option>
                    <option value="LU" className="bg-[#0A0F2C] text-white">Luxembourg</option>
                    <option value="MK" className="bg-[#0A0F2C] text-white">Macédoine</option>
                    <option value="MG" className="bg-[#0A0F2C] text-white">Madagascar</option>
                    <option value="MY" className="bg-[#0A0F2C] text-white">Malaisie</option>
                    <option value="MW" className="bg-[#0A0F2C] text-white">Malawi</option>
                    <option value="ML" className="bg-[#0A0F2C] text-white">Mali</option>
                    <option value="MT" className="bg-[#0A0F2C] text-white">Malte</option>
                    <option value="MA" className="bg-[#0A0F2C] text-white">Maroc</option>
                    <option value="MU" className="bg-[#0A0F2C] text-white">Maurice</option>
                    <option value="MR" className="bg-[#0A0F2C] text-white">Mauritanie</option>
                    <option value="MX" className="bg-[#0A0F2C] text-white">Mexique</option>
                    <option value="MD" className="bg-[#0A0F2C] text-white">Moldavie</option>
                    <option value="MC" className="bg-[#0A0F2C] text-white">Monaco</option>
                    <option value="MN" className="bg-[#0A0F2C] text-white">Mongolie</option>
                    <option value="ME" className="bg-[#0A0F2C] text-white">Monténégro</option>
                    <option value="MZ" className="bg-[#0A0F2C] text-white">Mozambique</option>
                    <option value="MM" className="bg-[#0A0F2C] text-white">Myanmar</option>
                    <option value="NA" className="bg-[#0A0F2C] text-white">Namibie</option>
                    <option value="NP" className="bg-[#0A0F2C] text-white">Népal</option>
                    <option value="NI" className="bg-[#0A0F2C] text-white">Nicaragua</option>
                    <option value="NE" className="bg-[#0A0F2C] text-white">Niger</option>
                    <option value="NG" className="bg-[#0A0F2C] text-white">Nigéria</option>
                    <option value="NO" className="bg-[#0A0F2C] text-white">Norvège</option>
                    <option value="NZ" className="bg-[#0A0F2C] text-white">Nouvelle-Zélande</option>
                    <option value="OM" className="bg-[#0A0F2C] text-white">Oman</option>
                    <option value="UG" className="bg-[#0A0F2C] text-white">Ouganda</option>
                    <option value="UZ" className="bg-[#0A0F2C] text-white">Ouzbékistan</option>
                    <option value="PK" className="bg-[#0A0F2C] text-white">Pakistan</option>
                    <option value="PA" className="bg-[#0A0F2C] text-white">Panama</option>
                    <option value="PG" className="bg-[#0A0F2C] text-white">Papouasie-Nouvelle-Guinée</option>
                    <option value="PY" className="bg-[#0A0F2C] text-white">Paraguay</option>
                    <option value="NL" className="bg-[#0A0F2C] text-white">Pays-Bas</option>
                    <option value="PE" className="bg-[#0A0F2C] text-white">Pérou</option>
                    <option value="PH" className="bg-[#0A0F2C] text-white">Philippines</option>
                    <option value="PL" className="bg-[#0A0F2C] text-white">Pologne</option>
                    <option value="PT" className="bg-[#0A0F2C] text-white">Portugal</option>
                    <option value="QA" className="bg-[#0A0F2C] text-white">Qatar</option>
                    <option value="RO" className="bg-[#0A0F2C] text-white">Roumanie</option>
                    <option value="GB" className="bg-[#0A0F2C] text-white">Royaume-Uni</option>
                    <option value="RU" className="bg-[#0A0F2C] text-white">Russie</option>
                    <option value="RW" className="bg-[#0A0F2C] text-white">Rwanda</option>
                    <option value="SN" className="bg-[#0A0F2C] text-white">Sénégal</option>
                    <option value="RS" className="bg-[#0A0F2C] text-white">Serbie</option>
                    <option value="SC" className="bg-[#0A0F2C] text-white">Seychelles</option>
                    <option value="SL" className="bg-[#0A0F2C] text-white">Sierra Leone</option>
                    <option value="SG" className="bg-[#0A0F2C] text-white">Singapour</option>
                    <option value="SK" className="bg-[#0A0F2C] text-white">Slovaquie</option>
                    <option value="SI" className="bg-[#0A0F2C] text-white">Slovénie</option>
                    <option value="SO" className="bg-[#0A0F2C] text-white">Somalie</option>
                    <option value="SD" className="bg-[#0A0F2C] text-white">Soudan</option>
                    <option value="LK" className="bg-[#0A0F2C] text-white">Sri Lanka</option>
                    <option value="SE" className="bg-[#0A0F2C] text-white">Suède</option>
                    <option value="CH" className="bg-[#0A0F2C] text-white">Suisse</option>
                    <option value="SR" className="bg-[#0A0F2C] text-white">Suriname</option>
                    <option value="SJ" className="bg-[#0A0F2C] text-white">Svalbard et Jan Mayen</option>
                    <option value="SZ" className="bg-[#0A0F2C] text-white">Eswatini</option>
                    <option value="SY" className="bg-[#0A0F2C] text-white">Syrie</option>
                    <option value="TJ" className="bg-[#0A0F2C] text-white">Tadjikistan</option>
                    <option value="TZ" className="bg-[#0A0F2C] text-white">Tanzanie</option>
                    <option value="TD" className="bg-[#0A0F2C] text-white">Tchad</option>
                    <option value="CZ" className="bg-[#0A0F2C] text-white">Tchéquie</option>
                    <option value="TG" className="bg-[#0A0F2C] text-white">Togo</option>
                    <option value="TH" className="bg-[#0A0F2C] text-white">Thaïlande</option>
                    <option value="TN" className="bg-[#0A0F2C] text-white">Tunisie</option>
                    <option value="TR" className="bg-[#0A0F2C] text-white">Turquie</option>
                    <option value="TM" className="bg-[#0A0F2C] text-white">Turkménistan</option>
                    <option value="UA" className="bg-[#0A0F2C] text-white">Ukraine</option>
                    <option value="UY" className="bg-[#0A0F2C] text-white">Uruguay</option>
                    <option value="VU" className="bg-[#0A0F2C] text-white">Vanuatu</option>
                    <option value="VE" className="bg-[#0A0F2C] text-white">Venezuela</option>
                    <option value="VN" className="bg-[#0A0F2C] text-white">Vietnam</option>
                    <option value="YE" className="bg-[#0A0F2C] text-white">Yémen</option>
                    <option value="ZM" className="bg-[#0A0F2C] text-white">Zambie</option>
                    <option value="ZW" className="bg-[#0A0F2C] text-white">Zimbabwe</option>
                  </select>
                  {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium">Ville de résidence (élève) *</label>
                  {hint('Choisissez la ville ou commune de résidence de l\'élève')}
                  {availableCities.length > 0 ? (
                    <select {...register('city')} className={selectCls(!!errors.city)}>
                      <option value="" className="bg-[#0A0F2C]">Sélectionner une ville...</option>
                      {availableCities.map(city => (
                        <option key={city} value={city} className="bg-[#0A0F2C]">{city}</option>
                      ))}
                    </select>
                  ) : (
                    <input {...register('city')} className={inputCls(!!errors.city)} placeholder="Entrez le nom de la ville" />
                  )}
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium">Adresse précise (quartier, rue) *</label>
                  {hint('Ex : Cocody Riviera 3, Rue des Roses — Bâtiment A')}
                  <input
                    {...register('studentAddress')}
                    autoComplete="street-address"
                    className={inputCls(!!errors.studentAddress)}
                    placeholder="Quartier, rue, numéro ou repère"
                  />
                  {errors.studentAddress && <p className="text-red-400 text-xs mt-1">{errors.studentAddress.message}</p>}
                </div>
              </>
            )}

            {/* Step 2: Mother Information */}
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium">Nom *</label>
                    {hint('Nom de famille de la mère')}
                    <input {...register('motherLastName')} className={inputCls(!!errors.motherLastName)} placeholder="Nom de famille" />
                    {errors.motherLastName && <p className="text-red-400 text-xs mt-1">{errors.motherLastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-white font-medium">Prénom *</label>
                    {hint('Prénom(s) complet(s)')}
                    <input {...register('motherFirstName')} className={inputCls(!!errors.motherFirstName)} placeholder="Prénom(s)" />
                    {errors.motherFirstName && <p className="text-red-400 text-xs mt-1">{errors.motherFirstName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Fonction <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                  {hint('Profession ou activité professionnelle de la mère')}
                  <select {...register('motherFunction')} style={{ colorScheme: 'dark' }} className={selectCls(false)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                    <option value="Accountant" className="bg-[#0A0F2C] text-white">Accountant</option>
                    <option value="Actuaire" className="bg-[#0A0F2C] text-white">Actuaire</option>
                    <option value="Administrateur" className="bg-[#0A0F2C] text-white">Administrateur</option>
                    <option value="Agent d'assurance" className="bg-[#0A0F2C] text-white">Agent d'assurance</option>
                    <option value="Agent de change" className="bg-[#0A0F2C] text-white">Agent de change</option>
                    <option value="Agent d'immobilier" className="bg-[#0A0F2C] text-white">Agent d'immobilier</option>
                    <option value="Agent de voyages" className="bg-[#0A0F2C] text-white">Agent de voyages</option>
                    <option value="Agriculteur" className="bg-[#0A0F2C] text-white">Agriculteur</option>
                    <option value="Architecte" className="bg-[#0A0F2C] text-white">Architecte</option>
                    <option value="Artiste" className="bg-[#0A0F2C] text-white">Artiste</option>
                    <option value="Assistant administratif" className="bg-[#0A0F2C] text-white">Assistant administratif</option>
                    <option value="Assistant de direction" className="bg-[#0A0F2C] text-white">Assistant de direction</option>
                    <option value="Avocat" className="bg-[#0A0F2C] text-white">Avocat</option>
                    <option value="Bibliothécaire" className="bg-[#0A0F2C] text-white">Bibliothécaire</option>
                    <option value="Biologiste" className="bg-[#0A0F2C] text-white">Biologiste</option>
                    <option value="Cadre bancaire" className="bg-[#0A0F2C] text-white">Cadre bancaire</option>
                    <option value="Cadre commercial" className="bg-[#0A0F2C] text-white">Cadre commercial</option>
                    <option value="Cadre d'entreprise" className="bg-[#0A0F2C] text-white">Cadre d'entreprise</option>
                    <option value="Cadre hospitalier" className="bg-[#0A0F2C] text-white">Cadre hospitalier</option>
                    <option value="Cadre informatique" className="bg-[#0A0F2C] text-white">Cadre informatique</option>
                    <option value="Chercheur" className="bg-[#0A0F2C] text-white">Chercheur</option>
                    <option value="Chimiste" className="bg-[#0A0F2C] text-white">Chimiste</option>
                    <option value="Chirurgien-dentiste" className="bg-[#0A0F2C] text-white">Chirurgien-dentiste</option>
                    <option value="Chirurgien" className="bg-[#0A0F2C] text-white">Chirurgien</option>
                    <option value="Coach" className="bg-[#0A0F2C] text-white">Coach</option>
                    <option value="Commerçant" className="bg-[#0A0F2C] text-white">Commerçant</option>
                    <option value="Comptable" className="bg-[#0A0F2C] text-white">Comptable</option>
                    <option value="Concepteur de jeux vidéo" className="bg-[#0A0F2C] text-white">Concepteur de jeux vidéo</option>
                    <option value="Consultant" className="bg-[#0A0F2C] text-white">Consultant</option>
                    <option value="Contremaître" className="bg-[#0A0F2C] text-white">Contremaître</option>
                    <option value="Cuisinier" className="bg-[#0A0F2C] text-white">Cuisinier</option>
                    <option value="Décorateur d'intérieur" className="bg-[#0A0F2C] text-white">Décorateur d'intérieur</option>
                    <option value="Dentiste" className="bg-[#0A0F2C] text-white">Dentiste</option>
                    <option value="Designer" className="bg-[#0A0F2C] text-white">Designer</option>
                    <option value="Développeur web" className="bg-[#0A0F2C] text-white">Développeur web</option>
                    <option value="Directeur artistique" className="bg-[#0A0F2C] text-white">Directeur artistique</option>
                    <option value="Directeur commercial" className="bg-[#0A0F2C] text-white">Directeur commercial</option>
                    <option value="Directeur d'agence" className="bg-[#0A0F2C] text-white">Directeur d'agence</option>
                    <option value="Directeur d'école" className="bg-[#0A0F2C] text-white">Directeur d'école</option>
                    <option value="Directeur d'hôpital" className="bg-[#0A0F2C] text-white">Directeur d'hôpital</option>
                    <option value="Directeur d'usine" className="bg-[#0A0F2C] text-white">Directeur d'usine</option>
                    <option value="Directeur des finances" className="bg-[#0A0F2C] text-white">Directeur des finances</option>
                    <option value="Directeur des opérations" className="bg-[#0A0F2C] text-white">Directeur des opérations</option>
                    <option value="Directeur des ressources humaines" className="bg-[#0A0F2C] text-white">Directeur des ressources humaines</option>
                    <option value="Directeur des systèmes d'information" className="bg-[#0A0F2C] text-white">Directeur des systèmes d'information</option>
                    <option value="Directeur des ventes" className="bg-[#0A0F2C] text-white">Directeur des ventes</option>
                    <option value="Directeur du marketing" className="bg-[#0A0F2C] text-white">Directeur du marketing</option>
                    <option value="Directeur du personnel" className="bg-[#0A0F2C] text-white">Directeur du personnel</option>
                    <option value="Directeur technique" className="bg-[#0A0F2C] text-white">Directeur technique</option>
                    <option value="Économiste" className="bg-[#0A0F2C] text-white">Économiste</option>
                    <option value="Éducateur" className="bg-[#0A0F2C] text-white">Éducateur</option>
                    <option value="Électricien" className="bg-[#0A0F2C] text-white">Électricien</option>
                    <option value="Enseignant" className="bg-[#0A0F2C] text-white">Enseignant</option>
                    <option value="Entrepreneur" className="bg-[#0A0F2C] text-white">Entrepreneur</option>
                    <option value="Ergothérapeute" className="bg-[#0A0F2C] text-white">Ergothérapeute</option>
                    <option value="Expert-comptable" className="bg-[#0A0F2C] text-white">Expert-comptable</option>
                    <option value="Farmacien" className="bg-[#0A0F2C] text-white">Farmacien</option>
                    <option value="Fermier" className="bg-[#0A0F2C] text-white">Fermier</option>
                    <option value="Géographe" className="bg-[#0A0F2C] text-white">Géographe</option>
                    <option value="Géologue" className="bg-[#0A0F2C] text-white">Géologue</option>
                    <option value="Graphiste" className="bg-[#0A0F2C] text-white">Graphiste</option>
                    <option value="Guichetier" className="bg-[#0A0F2C] text-white">Guichetier</option>
                    <option value="Historien" className="bg-[#0A0F2C] text-white">Historien</option>
                    <option value="Ingénieur" className="bg-[#0A0F2C] text-white">Ingénieur</option>
                    <option value="Infirmier" className="bg-[#0A0F2C] text-white">Infirmier</option>
                    <option value="Informaticien" className="bg-[#0A0F2C] text-white">Informaticien</option>
                    <option value="Journaliste" className="bg-[#0A0F2C] text-white">Journaliste</option>
                    <option value="Juriste" className="bg-[#0A0F2C] text-white">Juriste</option>
                    <option value="Kinésithérapeute" className="bg-[#0A0F2C] text-white">Kinésithérapeute</option>
                    <option value="Libraire" className="bg-[#0A0F2C] text-white">Libraire</option>
                    <option value="Logisticien" className="bg-[#0A0F2C] text-white">Logisticien</option>
                    <option value="Mannequin" className="bg-[#0A0F2C] text-white">Mannequin</option>
                    <option value="Maçon" className="bg-[#0A0F2C] text-white">Maçon</option>
                    <option value="Mathématicien" className="bg-[#0A0F2C] text-white">Mathématicien</option>
                    <option value="Mécanicien" className="bg-[#0A0F2C] text-white">Mécanicien</option>
                    <option value="Médecin" className="bg-[#0A0F2C] text-white">Médecin</option>
                    <option value="Menuisier" className="bg-[#0A0F2C] text-white">Menuisier</option>
                    <option value="Meteorologiste" className="bg-[#0A0F2C] text-white">Meteorologiste</option>
                    <option value="Moniteur d'auto-école" className="bg-[#0A0F2C] text-white">Moniteur d'auto-école</option>
                    <option value="Musicien" className="bg-[#0A0F2C] text-white">Musicien</option>
                    <option value="Notaire" className="bg-[#0A0F2C] text-white">Notaire</option>
                    <option value="Nutritionniste" className="bg-[#0A0F2C] text-white">Nutritionniste</option>
                    <option value="Opticien" className="bg-[#0A0F2C] text-white">Opticien</option>
                    <option value="Orthophoniste" className="bg-[#0A0F2C] text-white">Orthophoniste</option>
                    <option value="Peintre" className="bg-[#0A0F2C] text-white">Peintre</option>
                    <option value="Pharmacien" className="bg-[#0A0F2C] text-white">Pharmacien</option>
                    <option value="Photographe" className="bg-[#0A0F2C] text-white">Photographe</option>
                    <option value="Physicien" className="bg-[#0A0F2C] text-white">Physicien</option>
                    <option value="Physiothérapeute" className="bg-[#0A0F2C] text-white">Physiothérapeute</option>
                    <option value="Pilote" className="bg-[#0A0F2C] text-white">Pilote</option>
                    <option value="Plombier" className="bg-[#0A0F2C] text-white">Plombier</option>
                    <option value="Psychologue" className="bg-[#0A0F2C] text-white">Psychologue</option>
                    <option value="Professeur" className="bg-[#0A0F2C] text-white">Professeur</option>
                    <option value="Programmeur" className="bg-[#0A0F2C] text-white">Programmeur</option>
                    <option value="Radiologue" className="bg-[#0A0F2C] text-white">Radiologue</option>
                    <option value="Réceptionniste" className="bg-[#0A0F2C] text-white">Réceptionniste</option>
                    <option value="Rédacteur" className="bg-[#0A0F2C] text-white">Rédacteur</option>
                    <option value="Responsable d'atelier" className="bg-[#0A0F2C] text-white">Responsable d'atelier</option>
                    <option value="Responsable d'entrepôt" className="bg-[#0A0F2C] text-white">Responsable d'entrepôt</option>
                    <option value="Responsable de la logistique" className="bg-[#0A0F2C] text-white">Responsable de la logistique</option>
                    <option value="Responsable de la production" className="bg-[#0A0F2C] text-white">Responsable de la production</option>
                    <option value="Responsable de la qualité" className="bg-[#0A0F2C] text-white">Responsable de la qualité</option>
                    <option value="Responsable des achats" className="bg-[#0A0F2C] text-white">Responsable des achats</option>
                    <option value="Responsable des ventes" className="bg-[#0A0F2C] text-white">Responsable des ventes</option>
                    <option value="Sage-femme" className="bg-[#0A0F2C] text-white">Sage-femme</option>
                    <option value="Secrétaire" className="bg-[#0A0F2C] text-white">Secrétaire</option>
                    <option value="Sociologue" className="bg-[#0A0F2C] text-white">Sociologue</option>
                    <option value="Statisticien" className="bg-[#0A0F2C] text-white">Statisticien</option>
                    <option value="Technicien de laboratoire" className="bg-[#0A0F2C] text-white">Technicien de laboratoire</option>
                    <option value="Technicien de maintenance" className="bg-[#0A0F2C] text-white">Technicien de maintenance</option>
                    <option value="Technicien en informatique" className="bg-[#0A0F2C] text-white">Technicien en informatique</option>
                    <option value="Technicien en télécommunications" className="bg-[#0A0F2C] text-white">Technicien en télécommunications</option>
                    <option value="Traducteur" className="bg-[#0A0F2C] text-white">Traducteur</option>
                    <option value="Urbaniste" className="bg-[#0A0F2C] text-white">Urbaniste</option>
                    <option value="Vétérinaire" className="bg-[#0A0F2C] text-white">Vétérinaire</option>
                    <option value="Web designer" className="bg-[#0A0F2C] text-white">Web designer</option>
                    <option value="Autre" className="bg-[#0A0F2C] text-white">Autre</option>
                  </select>
                  {watchMotherFunction === 'Autre' && (
                    <input
                      type="text"
                      value={motherFunctionOther}
                      onChange={e => setMotherFunctionOther(e.target.value)}
                      className="w-full mt-2 px-4 py-2 bg-white/10 border border-[#C9A84C]/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C]"
                      placeholder="Précisez la fonction..."
                    />
                  )}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium">Tél. Mobile (mère) *</label>
                    {hint('Chiffres uniquement, sans espace ni tiret — ex : 0788123456')}
                    <div className={`flex rounded-lg overflow-hidden border focus-within:border-[#C9A84C] ${errors.motherPhone ? 'border-red-500/70' : 'border-white/30'}`}>
                      <PhoneCodeSelect value={motherPhoneCode} onChange={setMotherPhoneCode} />
                      <input {...register('motherPhone')} className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0" placeholder="0788123456" type="tel" inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                    </div>
                    {errors.motherPhone && <p className="text-red-400 text-xs mt-1">{errors.motherPhone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-white font-medium">N° WhatsApp (mère) <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                    {hint('Laissez vide si identique au tél. mobile')}
                    <div className={`flex rounded-lg overflow-hidden border focus-within:border-[#C9A84C] ${errors.motherWhatsApp ? 'border-red-500/70' : 'border-white/30'}`}>
                      <PhoneCodeSelect value={motherWaCode} onChange={setMotherWaCode} />
                      <input {...register('motherWhatsApp')} className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0" placeholder="0788123456" type="tel" inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                    </div>
                    {errors.motherWhatsApp && <p className="text-red-400 text-xs mt-1">{errors.motherWhatsApp.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Email (mère) <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                  {hint('Pour recevoir les confirmations et communications de l\'Institut')}
                  <input type="email" {...register('motherEmail')} className={inputCls(!!errors.motherEmail)} placeholder="exemple@email.com" />
                  {errors.motherEmail && <p className="text-red-400 text-xs mt-1">{errors.motherEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium">Lieu de résidence *</label>
                  {hint('Quartier, commune ou adresse où vit la mère')}
                  <label className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <input type="checkbox" checked={motherSameAddr} onChange={e => setMotherSameAddr(e.target.checked)} className="w-4 h-4 accent-[#C9A84C] cursor-pointer" />
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                      Même adresse que l'élève <span className="text-[#C9A84C] font-medium">{studentFullAddress ? `(${studentFullAddress})` : ''}</span>
                    </span>
                  </label>
                  <input {...register('motherResidence')} disabled={motherSameAddr}
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] transition-all ${motherSameAddr ? 'bg-white/5 border-white/10 text-white/50 cursor-not-allowed' : errors.motherResidence ? 'bg-red-500/5 border-red-500/70' : 'bg-white/10 border-white/30 focus:bg-white/20'}`}
                    placeholder="Ex: Cocody Riviera 3, Rue des Roses" />
                  {errors.motherResidence && <p className="text-red-400 text-xs mt-1">{errors.motherResidence.message}</p>}
                </div>
              </>
            )}

            {/* Step 3: Father Information */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium">Nom *</label>
                    {hint('Nom de famille du père')}
                    <input {...register('fatherLastName')} className={inputCls(!!errors.fatherLastName)} placeholder="Nom de famille" />
                    {errors.fatherLastName && <p className="text-red-400 text-xs mt-1">{errors.fatherLastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-white font-medium">Prénom *</label>
                    {hint('Prénom(s) complet(s)')}
                    <input {...register('fatherFirstName')} className={inputCls(!!errors.fatherFirstName)} placeholder="Prénom(s)" />
                    {errors.fatherFirstName && <p className="text-red-400 text-xs mt-1">{errors.fatherFirstName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Fonction <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                  {hint('Profession ou activité professionnelle du père')}
                  <select {...register('fatherFunction')} style={{ colorScheme: 'dark' }} className={selectCls(false)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                    <option value="Accountant" className="bg-[#0A0F2C] text-white">Accountant</option>
                    <option value="Actuaire" className="bg-[#0A0F2C] text-white">Actuaire</option>
                    <option value="Administrateur" className="bg-[#0A0F2C] text-white">Administrateur</option>
                    <option value="Agent d'assurance" className="bg-[#0A0F2C] text-white">Agent d'assurance</option>
                    <option value="Agent de change" className="bg-[#0A0F2C] text-white">Agent de change</option>
                    <option value="Agent d'immobilier" className="bg-[#0A0F2C] text-white">Agent d'immobilier</option>
                    <option value="Agent de voyages" className="bg-[#0A0F2C] text-white">Agent de voyages</option>
                    <option value="Agriculteur" className="bg-[#0A0F2C] text-white">Agriculteur</option>
                    <option value="Architecte" className="bg-[#0A0F2C] text-white">Architecte</option>
                    <option value="Artiste" className="bg-[#0A0F2C] text-white">Artiste</option>
                    <option value="Assistant administratif" className="bg-[#0A0F2C] text-white">Assistant administratif</option>
                    <option value="Assistant de direction" className="bg-[#0A0F2C] text-white">Assistant de direction</option>
                    <option value="Avocat" className="bg-[#0A0F2C] text-white">Avocat</option>
                    <option value="Bibliothécaire" className="bg-[#0A0F2C] text-white">Bibliothécaire</option>
                    <option value="Biologiste" className="bg-[#0A0F2C] text-white">Biologiste</option>
                    <option value="Cadre bancaire" className="bg-[#0A0F2C] text-white">Cadre bancaire</option>
                    <option value="Cadre commercial" className="bg-[#0A0F2C] text-white">Cadre commercial</option>
                    <option value="Cadre d'entreprise" className="bg-[#0A0F2C] text-white">Cadre d'entreprise</option>
                    <option value="Cadre hospitalier" className="bg-[#0A0F2C] text-white">Cadre hospitalier</option>
                    <option value="Cadre informatique" className="bg-[#0A0F2C] text-white">Cadre informatique</option>
                    <option value="Chercheur" className="bg-[#0A0F2C] text-white">Chercheur</option>
                    <option value="Chimiste" className="bg-[#0A0F2C] text-white">Chimiste</option>
                    <option value="Chirurgien-dentiste" className="bg-[#0A0F2C] text-white">Chirurgien-dentiste</option>
                    <option value="Chirurgien" className="bg-[#0A0F2C] text-white">Chirurgien</option>
                    <option value="Coach" className="bg-[#0A0F2C] text-white">Coach</option>
                    <option value="Commerçant" className="bg-[#0A0F2C] text-white">Commerçant</option>
                    <option value="Comptable" className="bg-[#0A0F2C] text-white">Comptable</option>
                    <option value="Concepteur de jeux vidéo" className="bg-[#0A0F2C] text-white">Concepteur de jeux vidéo</option>
                    <option value="Consultant" className="bg-[#0A0F2C] text-white">Consultant</option>
                    <option value="Contremaître" className="bg-[#0A0F2C] text-white">Contremaître</option>
                    <option value="Cuisinier" className="bg-[#0A0F2C] text-white">Cuisinier</option>
                    <option value="Décorateur d'intérieur" className="bg-[#0A0F2C] text-white">Décorateur d'intérieur</option>
                    <option value="Dentiste" className="bg-[#0A0F2C] text-white">Dentiste</option>
                    <option value="Designer" className="bg-[#0A0F2C] text-white">Designer</option>
                    <option value="Développeur web" className="bg-[#0A0F2C] text-white">Développeur web</option>
                    <option value="Directeur artistique" className="bg-[#0A0F2C] text-white">Directeur artistique</option>
                    <option value="Directeur commercial" className="bg-[#0A0F2C] text-white">Directeur commercial</option>
                    <option value="Directeur d'agence" className="bg-[#0A0F2C] text-white">Directeur d'agence</option>
                    <option value="Directeur d'école" className="bg-[#0A0F2C] text-white">Directeur d'école</option>
                    <option value="Directeur d'hôpital" className="bg-[#0A0F2C] text-white">Directeur d'hôpital</option>
                    <option value="Directeur d'usine" className="bg-[#0A0F2C] text-white">Directeur d'usine</option>
                    <option value="Directeur des finances" className="bg-[#0A0F2C] text-white">Directeur des finances</option>
                    <option value="Directeur des opérations" className="bg-[#0A0F2C] text-white">Directeur des opérations</option>
                    <option value="Directeur des ressources humaines" className="bg-[#0A0F2C] text-white">Directeur des ressources humaines</option>
                    <option value="Directeur des systèmes d'information" className="bg-[#0A0F2C] text-white">Directeur des systèmes d'information</option>
                    <option value="Directeur des ventes" className="bg-[#0A0F2C] text-white">Directeur des ventes</option>
                    <option value="Directeur du marketing" className="bg-[#0A0F2C] text-white">Directeur du marketing</option>
                    <option value="Directeur du personnel" className="bg-[#0A0F2C] text-white">Directeur du personnel</option>
                    <option value="Directeur technique" className="bg-[#0A0F2C] text-white">Directeur technique</option>
                    <option value="Économiste" className="bg-[#0A0F2C] text-white">Économiste</option>
                    <option value="Éducateur" className="bg-[#0A0F2C] text-white">Éducateur</option>
                    <option value="Électricien" className="bg-[#0A0F2C] text-white">Électricien</option>
                    <option value="Enseignant" className="bg-[#0A0F2C] text-white">Enseignant</option>
                    <option value="Entrepreneur" className="bg-[#0A0F2C] text-white">Entrepreneur</option>
                    <option value="Ergothérapeute" className="bg-[#0A0F2C] text-white">Ergothérapeute</option>
                    <option value="Expert-comptable" className="bg-[#0A0F2C] text-white">Expert-comptable</option>
                    <option value="Farmacien" className="bg-[#0A0F2C] text-white">Farmacien</option>
                    <option value="Fermier" className="bg-[#0A0F2C] text-white">Fermier</option>
                    <option value="Géographe" className="bg-[#0A0F2C] text-white">Géographe</option>
                    <option value="Géologue" className="bg-[#0A0F2C] text-white">Géologue</option>
                    <option value="Graphiste" className="bg-[#0A0F2C] text-white">Graphiste</option>
                    <option value="Guichetier" className="bg-[#0A0F2C] text-white">Guichetier</option>
                    <option value="Historien" className="bg-[#0A0F2C] text-white">Historien</option>
                    <option value="Ingénieur" className="bg-[#0A0F2C] text-white">Ingénieur</option>
                    <option value="Infirmier" className="bg-[#0A0F2C] text-white">Infirmier</option>
                    <option value="Informaticien" className="bg-[#0A0F2C] text-white">Informaticien</option>
                    <option value="Journaliste" className="bg-[#0A0F2C] text-white">Journaliste</option>
                    <option value="Juriste" className="bg-[#0A0F2C] text-white">Juriste</option>
                    <option value="Kinésithérapeute" className="bg-[#0A0F2C] text-white">Kinésithérapeute</option>
                    <option value="Libraire" className="bg-[#0A0F2C] text-white">Libraire</option>
                    <option value="Logisticien" className="bg-[#0A0F2C] text-white">Logisticien</option>
                    <option value="Mannequin" className="bg-[#0A0F2C] text-white">Mannequin</option>
                    <option value="Maçon" className="bg-[#0A0F2C] text-white">Maçon</option>
                    <option value="Mathématicien" className="bg-[#0A0F2C] text-white">Mathématicien</option>
                    <option value="Mécanicien" className="bg-[#0A0F2C] text-white">Mécanicien</option>
                    <option value="Médecin" className="bg-[#0A0F2C] text-white">Médecin</option>
                    <option value="Menuisier" className="bg-[#0A0F2C] text-white">Menuisier</option>
                    <option value="Météorologue" className="bg-[#0A0F2C] text-white">Météorologue</option>
                    <option value="Moniteur d'auto-école" className="bg-[#0A0F2C] text-white">Moniteur d'auto-école</option>
                    <option value="Musicien" className="bg-[#0A0F2C] text-white">Musicien</option>
                    <option value="Notaire" className="bg-[#0A0F2C] text-white">Notaire</option>
                    <option value="Nutritionniste" className="bg-[#0A0F2C] text-white">Nutritionniste</option>
                    <option value="Opticien" className="bg-[#0A0F2C] text-white">Opticien</option>
                    <option value="Orthophoniste" className="bg-[#0A0F2C] text-white">Orthophoniste</option>
                    <option value="Peintre" className="bg-[#0A0F2C] text-white">Peintre</option>
                    <option value="Pharmacien" className="bg-[#0A0F2C] text-white">Pharmacien</option>
                    <option value="Photographe" className="bg-[#0A0F2C] text-white">Photographe</option>
                    <option value="Physicien" className="bg-[#0A0F2C] text-white">Physicien</option>
                    <option value="Physiothérapeute" className="bg-[#0A0F2C] text-white">Physiothérapeute</option>
                    <option value="Pilote" className="bg-[#0A0F2C] text-white">Pilote</option>
                    <option value="Plombier" className="bg-[#0A0F2C] text-white">Plombier</option>
                    <option value="Psychologue" className="bg-[#0A0F2C] text-white">Psychologue</option>
                    <option value="Professeur" className="bg-[#0A0F2C] text-white">Professeur</option>
                    <option value="Programmeur" className="bg-[#0A0F2C] text-white">Programmeur</option>
                    <option value="Radiologue" className="bg-[#0A0F2C] text-white">Radiologue</option>
                    <option value="Réceptionniste" className="bg-[#0A0F2C] text-white">Réceptionniste</option>
                    <option value="Rédacteur" className="bg-[#0A0F2C] text-white">Rédacteur</option>
                    <option value="Responsable d'atelier" className="bg-[#0A0F2C] text-white">Responsable d'atelier</option>
                    <option value="Responsable d'entrepôt" className="bg-[#0A0F2C] text-white">Responsable d'entrepôt</option>
                    <option value="Responsable de la logistique" className="bg-[#0A0F2C] text-white">Responsable de la logistique</option>
                    <option value="Responsable de la production" className="bg-[#0A0F2C] text-white">Responsable de la production</option>
                    <option value="Responsable de la qualité" className="bg-[#0A0F2C] text-white">Responsable de la qualité</option>
                    <option value="Responsable des achats" className="bg-[#0A0F2C] text-white">Responsable des achats</option>
                    <option value="Responsable des ventes" className="bg-[#0A0F2C] text-white">Responsable des ventes</option>
                    <option value="Sage-femme" className="bg-[#0A0F2C] text-white">Sage-femme</option>
                    <option value="Secrétaire" className="bg-[#0A0F2C] text-white">Secrétaire</option>
                    <option value="Sociologue" className="bg-[#0A0F2C] text-white">Sociologue</option>
                    <option value="Statisticien" className="bg-[#0A0F2C] text-white">Statisticien</option>
                    <option value="Technicien de laboratoire" className="bg-[#0A0F2C] text-white">Technicien de laboratoire</option>
                    <option value="Technicien de maintenance" className="bg-[#0A0F2C] text-white">Technicien de maintenance</option>
                    <option value="Technicien en informatique" className="bg-[#0A0F2C] text-white">Technicien en informatique</option>
                    <option value="Technicien en télécommunications" className="bg-[#0A0F2C] text-white">Technicien en télécommunications</option>
                    <option value="Traducteur" className="bg-[#0A0F2C] text-white">Traducteur</option>
                    <option value="Urbaniste" className="bg-[#0A0F2C] text-white">Urbaniste</option>
                    <option value="Vétérinaire" className="bg-[#0A0F2C] text-white">Vétérinaire</option>
                    <option value="Web designer" className="bg-[#0A0F2C] text-white">Web designer</option>
                    <option value="Autre" className="bg-[#0A0F2C] text-white">Autre</option>
                  </select>
                  {watchFatherFunction === 'Autre' && (
                    <input
                      type="text"
                      value={fatherFunctionOther}
                      onChange={e => setFatherFunctionOther(e.target.value)}
                      className="w-full mt-2 px-4 py-2 bg-white/10 border border-[#C9A84C]/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C]"
                      placeholder="Précisez la fonction..."
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium">Tél. Mobile (père) *</label>
                    {hint('Doit être différent du numéro de la mère — chiffres uniquement')}
                    <div className={`flex rounded-lg overflow-hidden border focus-within:border-[#C9A84C] ${errors.fatherPhone ? 'border-red-500/70' : 'border-white/30'}`}>
                      <PhoneCodeSelect value={fatherPhoneCode} onChange={setFatherPhoneCode} />
                      <input {...register('fatherPhone')} className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0" placeholder="0788123456" type="tel" inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                    </div>
                    {errors.fatherPhone && <p className="text-red-400 text-xs mt-1">{errors.fatherPhone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-white font-medium">N° WhatsApp (père) <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                    {hint('Laissez vide si identique au tél. mobile')}
                    <div className={`flex rounded-lg overflow-hidden border focus-within:border-[#C9A84C] ${errors.fatherWhatsApp ? 'border-red-500/70' : 'border-white/30'}`}>
                      <PhoneCodeSelect value={fatherWaCode} onChange={setFatherWaCode} />
                      <input {...register('fatherWhatsApp')} className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0" placeholder="0788123456" type="tel" inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                    </div>
                    {errors.fatherWhatsApp && <p className="text-red-400 text-xs mt-1">{errors.fatherWhatsApp.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium">Email (père) <span className="text-white/40 text-xs font-normal">(optionnel)</span></label>
                  {hint('Pour recevoir les confirmations et communications de l\'Institut')}
                  <input type="email" {...register('fatherEmail')} className={inputCls(!!errors.fatherEmail)} placeholder="exemple@email.com" />
                  {errors.fatherEmail && <p className="text-red-400 text-xs mt-1">{errors.fatherEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium">Lieu de résidence *</label>
                  {hint('Quartier, commune ou adresse où vit le père')}
                  <label className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <input type="checkbox" checked={fatherSameAddr} onChange={e => setFatherSameAddr(e.target.checked)} className="w-4 h-4 accent-[#C9A84C] cursor-pointer" />
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                      Même adresse que l'élève <span className="text-[#C9A84C] font-medium">{studentFullAddress ? `(${studentFullAddress})` : ''}</span>
                    </span>
                  </label>
                  <input {...register('fatherResidence')} disabled={fatherSameAddr}
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] transition-all ${fatherSameAddr ? 'bg-white/5 border-white/10 text-white/50 cursor-not-allowed' : errors.fatherResidence ? 'bg-red-500/5 border-red-500/70' : 'bg-white/10 border-white/30 focus:bg-white/20'}`}
                    placeholder="Ex: Cocody Riviera 3, Rue des Roses" />
                  {errors.fatherResidence && <p className="text-red-400 text-xs mt-1">{errors.fatherResidence.message}</p>}
                </div>
              </>
            )}

            {/* Step 4: Contact Person */}
            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-white font-medium">Identité *</label>
                  {hint('Lien de cette personne avec l\'élève — si c\'est la mère ou le père, les infos sont reprises automatiquement')}
                  <select {...register('contactIdentity')} style={{ colorScheme: 'dark' }} className={selectCls(!!errors.contactIdentity)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                    <option value="Mère" className="bg-[#0A0F2C] text-white">Mère</option>
                    <option value="Père" className="bg-[#0A0F2C] text-white">Père</option>
                    <option value="Grand-père" className="bg-[#0A0F2C] text-white">Grand-père</option>
                    <option value="Grand-mère" className="bg-[#0A0F2C] text-white">Grand-mère</option>
                    <option value="Sœur" className="bg-[#0A0F2C] text-white">Sœur</option>
                    <option value="Frère" className="bg-[#0A0F2C] text-white">Frère</option>
                    <option value="Oncle" className="bg-[#0A0F2C] text-white">Oncle</option>
                    <option value="Tante" className="bg-[#0A0F2C] text-white">Tante</option>
                    <option value="Tuteur" className="bg-[#0A0F2C] text-white">Tuteur</option>
                    <option value="Tutrice" className="bg-[#0A0F2C] text-white">Tutrice</option>
                    <option value="Ami(e) des parents" className="bg-[#0A0F2C] text-white">Ami(e) des parents</option>
                    <option value="Autre" className="bg-[#0A0F2C] text-white">Autre</option>
                  </select>
                  {watchContactIdentity === 'Autre' && (
                    <input
                      type="text"
                      value={contactIdentityOther}
                      onChange={e => setContactIdentityOther(e.target.value)}
                      className="w-full mt-2 px-4 py-2 bg-white/10 border border-[#C9A84C]/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C]"
                      placeholder="Précisez le lien avec l'enfant..."
                    />
                  )}
                  {errors.contactIdentity && <p className="text-red-400 text-sm mt-1">{errors.contactIdentity.message}</p>}
                </div>

                {/* Mère ou Père sélectionné → carte récapitulative, pas de champs */}
                {(isContactMother || isContactFather) && (
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-5 space-y-3">
                    <p className="text-[#C9A84C] font-semibold text-sm flex items-center gap-2">
                      <span className="text-xl">{isContactMother ? '👩' : '👨'}</span>
                      Informations {isContactMother ? 'de la mère' : 'du père'} utilisées automatiquement
                    </p>
                    <div className="space-y-1.5 text-sm text-white/80">
                      <p>📛 {watch(isContactMother ? 'motherFirstName' : 'fatherFirstName')} {watch(isContactMother ? 'motherLastName' : 'fatherLastName')}</p>
                      <p>📞 {isContactMother ? motherPhoneCode : fatherPhoneCode} {watch(isContactMother ? 'motherPhone' : 'fatherPhone')}</p>
                      {watch(isContactMother ? 'motherEmail' : 'fatherEmail') && (
                        <p>✉️ {watch(isContactMother ? 'motherEmail' : 'fatherEmail')}</p>
                      )}
                      {watch(isContactMother ? 'motherResidence' : 'fatherResidence') && (
                        <p>📍 {watch(isContactMother ? 'motherResidence' : 'fatherResidence')}</p>
                      )}
                    </div>
                    <p className="text-white/30 text-xs">Ces coordonnées seront transmises avec la demande d'admission.</p>
                  </div>
                )}

                {/* Autre identité → champs à remplir normalement */}
                {!(isContactMother || isContactFather) && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2 font-medium">Nom *</label>
                        <input {...register('contactLastName')}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] focus:bg-white/20"
                          placeholder="Nom de famille" />
                        {errors.contactLastName && <p className="text-red-400 text-sm mt-1">{errors.contactLastName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-white mb-2 font-medium">Prénom *</label>
                        <input {...register('contactFirstName')}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] focus:bg-white/20"
                          placeholder="Prénom" />
                        {errors.contactFirstName && <p className="text-red-400 text-sm mt-1">{errors.contactFirstName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2 font-medium">Tél. Mobile *</label>
                        <div className="flex rounded-lg overflow-hidden border border-white/30 focus-within:border-[#C9A84C]">
                          <PhoneCodeSelect value={contactPhoneCode} onChange={setContactPhoneCode} />
                          <input {...register('contactPhone')}
                            className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0"
                            placeholder="07 88 12 34 56" type="tel" inputMode="numeric"
                            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                        </div>
                        {errors.contactPhone && <p className="text-red-400 text-sm mt-1">{errors.contactPhone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-white mb-2 font-medium">N° WhatsApp *</label>
                        <div className="flex rounded-lg overflow-hidden border border-white/30 focus-within:border-[#C9A84C]">
                          <PhoneCodeSelect value={contactWaCode} onChange={setContactWaCode} />
                          <input {...register('contactWhatsApp')}
                            className="flex-1 px-3 py-3 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0"
                            placeholder="07 88 12 34 56" type="tel" inputMode="numeric"
                            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                        </div>
                        {errors.contactWhatsApp && <p className="text-red-400 text-sm mt-1">{errors.contactWhatsApp.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Email *</label>
                      <input type="email" {...register('contactEmail')}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] focus:bg-white/20"
                        placeholder="exemple@email.com" />
                      {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail.message}</p>}
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Adresse de résidence *</label>
                      <label className="flex items-center gap-2 mb-2 cursor-pointer group">
                        <input type="checkbox" checked={contactSameAddr} onChange={e => setContactSameAddr(e.target.checked)}
                          className="w-4 h-4 accent-[#C9A84C] cursor-pointer" />
                        <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                          Même adresse que l'élève <span className="text-[#C9A84C] font-medium">{studentFullAddress ? `(${studentFullAddress})` : ''}</span>
                        </span>
                      </label>
                      <input {...register('contactResidence')} disabled={contactSameAddr}
                        className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] transition-all ${contactSameAddr ? 'bg-white/5 border-white/10 text-white/50 cursor-not-allowed' : 'bg-white/10 border-white/30 focus:bg-white/20'}`}
                        placeholder="Ex: Cocody Riviera 3, Rue des Roses" />
                      {errors.contactResidence && <p className="text-red-400 text-sm mt-1">{errors.contactResidence.message}</p>}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 5: Program Selection */}
            {currentStep === 5 && (
              <>
                <div>
                  <label className="block text-white font-medium">Catégorie *</label>
                  {hint('Choisissez selon l\'âge de l\'élève — PrepaKid 7-11 ans, FlexiTeen 11-15 ans, NextGen 16-18 ans')}
                  <select {...register('programCategory')} style={{ colorScheme: 'dark' }} className={selectCls(!!errors.programCategory)}>
                    <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                    <option value="PrepaKid (7-11 ans)" className="bg-[#0A0F2C] text-white">PrepaKid (7-11 ans)</option>
                    <option value="FlexiTeen (11-15 ans)" className="bg-[#0A0F2C] text-white">FlexiTeen (11-15 ans)</option>
                    <option value="NextGen (16-18 ans)" className="bg-[#0A0F2C] text-white">NextGen (16-18 ans)</option>
                    <option value="Langues" className="bg-[#0A0F2C] text-white">Langues Internationales</option>
                    <option value="VIP" className="bg-[#0A0F2C] text-white">VIP (Sur mesure)</option>
                    <option value="Vacances Digitales" className="bg-[#0A0F2C] text-white">Vacances Digitales</option>
                  </select>
                  {errors.programCategory && <p className="text-red-400 text-sm mt-1">{errors.programCategory.message}</p>}
                </div>

                {/* Type — conditionnel selon la catégorie */}
                {watch('programCategory') === 'Vacances Digitales' ? (
                  <>
                    {/* Vacances: info horaires + choix session */}
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4 space-y-2">
                      <p className="text-[#C9A84C] font-semibold text-sm">📅 Sessions de Juin à Août</p>
                      <p className="text-white/80 text-sm">⏰ Lun–Jeu : 9h00 – 16h00</p>
                      <p className="text-white/80 text-sm">🎮 Vendredi : Jeux digitaux & IA (facultatif)</p>
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-medium">Session choisie *</label>
                      <select {...register('programType')} style={{ colorScheme: 'dark' }} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#C9A84C] focus:bg-white/20 appearance-none cursor-pointer">
                        <option value="" className="bg-[#0A0F2C] text-white">Sélectionner une session...</option>
                        <option value="Session A" className="bg-[#0A0F2C] text-white">Session A — 1 mois</option>
                        <option value="Session B" className="bg-[#0A0F2C] text-white">Session B — 2 mois</option>
                        <option value="Session C" className="bg-[#0A0F2C] text-white">Session C — 3 mois complets</option>
                      </select>
                      {errors.programType && <p className="text-red-400 text-sm mt-1">{errors.programType.message}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-white font-medium">Type de programme *</label>
                      {hint('Programme = 1 mois · BOOST = 3 mois · IMPACT = 6 mois · HUB = 10 mois')}
                      <select {...register('programType')} style={{ colorScheme: 'dark' }} className={selectCls(!!errors.programType)}>
                        <option value="" className="bg-[#0A0F2C] text-white">Sélectionner...</option>
                        <option value="Programme" className="bg-[#0A0F2C] text-white">Programme — 1 mois</option>
                        <option value="BOOST" className="bg-[#0A0F2C] text-white">BOOST — 3 mois</option>
                        <option value="IMPACT" className="bg-[#0A0F2C] text-white">IMPACT — 6 mois</option>
                        <option value="HUB" className="bg-[#0A0F2C] text-white">HUB — 10 mois</option>
                        {watch('programCategory') === 'VIP' && (
                          <option value="PREPANEXTGEN VIP" className="bg-[#0A0F2C] text-white">PREPANEXTGEN VIP — Sur mesure</option>
                        )}
                      </select>
                      {errors.programType && <p className="text-red-400 text-sm mt-1">{errors.programType.message}</p>}
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Jours préférés (max 2 choix) *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableDays.map((day) => (
                          <label key={day} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={watchedDays.includes(day)}
                              onChange={() => handleDayToggle(day)}
                              className="mr-2 accent-[#C9A84C]"
                            />
                            <span className="text-white text-sm">{day}</span>
                          </label>
                        ))}
                      </div>
                      {errors.days && <p className="text-red-400 text-sm mt-1">{errors.days.message}</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-white mb-2">Message (optionnel)</label>
                  <textarea {...register('message')} rows={4} className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A84C] focus:bg-white/20" placeholder="Questions, précisions..." />
                </div>

                {/* ── Conditions Générales d'Inscription ── */}
                <div className="mt-2 p-4 bg-white/5 border border-white/15 rounded-xl space-y-3">
                  <p className="text-white/60 text-xs leading-relaxed">
                    En soumettant ce formulaire, vous confirmez avoir pris connaissance et accepter les{' '}
                    <button
                      type="button"
                      onClick={() => setShowCGI(true)}
                      className="text-[#C9A84C] underline underline-offset-2 hover:text-[#C9A84C]/80 transition-colors font-medium"
                    >
                      Conditions Générales d'Inscription
                    </button>{' '}
                    de PrepaNextGen, notamment les règles de conduite, les modalités de paiement et le droit à l'image.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded accent-[#C9A84C] cursor-pointer flex-shrink-0"
                    />
                    <span className={`text-sm font-medium transition-colors ${termsAccepted ? 'text-[#C9A84C]' : 'text-white/80'}`}>
                      J'ai lu et j'accepte les Conditions Générales d'Inscription *
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 space-y-3">
              {/* Step error alert */}
              {stepErrorMsg && (
                <div className="flex items-start gap-3 p-4 bg-red-500/15 border border-red-400/50 rounded-xl">
                  <span className="text-2xl shrink-0">⚠️</span>
                  <div>
                    <p className="text-red-300 font-semibold text-sm mb-0.5">Veuillez corriger avant de continuer :</p>
                    <p className="text-red-200 text-sm">{stepErrorMsg}</p>
                  </div>
                  <button onClick={() => setStepErrorMsg('')} className="ml-auto text-red-300 hover:text-white text-lg shrink-0">✕</button>
                </div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    ← Précédent
                  </Button>
                )}
                <div className="ml-auto">
                  {currentStep < 5 ? (
                    <Button type="button" variant="primary" onClick={nextStep} disabled={isSubmitting}>
                      Suivant →
                    </Button>
                  ) : (
                    <Button type="button" variant="primary" onClick={handleFinalSubmitClick} disabled={isSubmitting}>
                      {isSubmitting ? '⏳ Envoi en cours...' : '✅ Envoyer ma demande'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center space-y-2">
                <p className="text-red-400 font-semibold">⚠️ L'envoi a échoué.</p>
                {xanoError && (
                  <p className="text-red-300 text-xs font-mono bg-black/30 rounded p-2 text-left break-all">{xanoError}</p>
                )}
                <p className="text-red-300 text-sm">Copiez le message ci-dessus et communiquez-le pour diagnostic.</p>
                <button onClick={() => { setSubmitStatus('idle'); setXanoError(''); }} className="mt-2 text-white/60 hover:text-white text-sm underline">
                  Réessayer
                </button>
              </div>
            )}
          </motion.form>
        </AnimatePresence>

        {/* ── POPUP Succès (centré, par-dessus le formulaire) ── */}
        {submitStatus === 'success' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0F1535] border border-green-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-5"
            >
              <div className="text-6xl">✅</div>
              <h3 className="text-green-400 font-semibold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {registeredChildren.length === 1 ? 'Demande envoyée avec succès !' : `Enfant n°${registeredChildren.length} inscrit avec succès !`}
              </h3>
              <p className="text-white/70 text-sm">
                Nos équipes vous contacteront sous 24h pour confirmer l'inscription de <strong className="text-white">{registeredChildren[registeredChildren.length - 1]}</strong>.
              </p>

              <div className="pt-1 space-y-3">
                {/* Inscrire un autre enfant */}
                <button
                  onClick={registerAnotherChild}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C9A84C] hover:bg-[#C9A84C]/80 rounded-xl text-white font-semibold text-base transition-all shadow-lg"
                >
                  <span className="text-xl">➕</span>
                  <span>Inscrire un {ordinal(registeredChildren.length + 1)} enfant</span>
                </button>
                <p className="text-white/30 text-xs">(les infos parentales sont déjà enregistrées)</p>

                {/* Fermer */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white/70 hover:text-white text-sm transition-all"
                >
                  Fermer — J'ai terminé
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── POPUP Confirmation âge ── */}
        {showAgeConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.80)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0F2C] border border-[#C9A84C]/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 text-center"
            >
              <div className="text-5xl">🎂</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Confirmation de l'âge</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Votre enfant{' '}
                  <span className="font-bold text-[#C9A84C]">
                    {getValues('firstName')} {getValues('lastName')}
                  </span>{' '}
                  a{' '}
                  <span className="font-bold text-[#C9A84C] text-lg">{childAgeDisplay} ans</span>.
                </p>
                <p className="text-white/60 text-sm mt-1">Est-ce correct ?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowAgeConfirm(false);
                    setPendingNextStep(false);
                    setStepErrorMsg('');
                    if (childCount > 1) setCurrentStep(5);
                    else setCurrentStep(2);
                  }}
                  className="w-full py-3 px-4 bg-[#C9A84C] hover:bg-[#C9A84C]/80 text-white font-bold rounded-xl transition-all"
                >
                  ✅ Oui, c'est correct
                </button>
                <button
                  onClick={() => { setShowAgeConfirm(false); setPendingNextStep(false); }}
                  className="w-full py-3 px-4 bg-white/5 border border-white/20 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all text-sm"
                >
                  ✏️ Non — corriger la date de naissance
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── POPUP Texte CGI ── */}
        {showCGI && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0F2C] border border-white/20 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#C9A84C]">Conditions Générales d'Inscription</h3>
                <button onClick={() => setShowCGI(false)} className="text-white/50 hover:text-white text-xl font-bold">✕</button>
              </div>
              <div className="overflow-y-auto flex-1 text-white/75 text-xs leading-relaxed whitespace-pre-wrap pr-2 space-y-1 font-mono">
                {CGI_TEXT}
              </div>
              <button
                onClick={() => { setTermsAccepted(true); setShowCGI(false); }}
                className="mt-4 w-full py-3 bg-[#C9A84C] hover:bg-[#C9A84C]/80 text-white font-bold rounded-xl transition-all"
              >
                ✅ J'ai lu et j'accepte les CGI
              </button>
            </motion.div>
          </div>
        )}

        {/* ── POPUP Doublon détecté ── */}
        {showDuplicateWarning && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0F2C] border border-yellow-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">⚠️</div>
                <h3 className="text-xl font-bold text-yellow-400">Demande déjà enregistrée</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Une demande pour <span className="font-semibold text-white">{duplicateName}</span> a déjà été envoyée depuis cet appareil.
                </p>
                <p className="text-white/60 text-sm">
                  Voulez-vous quand même envoyer une nouvelle demande pour cet enfant ?
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => { setShowDuplicateWarning(false); setShowSubmitConfirm(true); }}
                  className="w-full py-3 px-4 bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500/30 text-yellow-300 font-semibold rounded-xl transition-all text-sm"
                >
                  📤 Oui — envoyer une nouvelle demande quand même
                </button>
                <button
                  onClick={() => setShowDuplicateWarning(false)}
                  className="w-full py-3 px-4 bg-white/5 border border-white/20 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all text-sm"
                >
                  ✕ Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── POPUP Confirmation avant envoi (multi-enfants) ── */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0F1535] border border-[#C9A84C]/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className="text-5xl">👨‍👩‍👧‍👦</div>
              <h3 className="text-white text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Avez-vous d'autres enfants à inscrire ?
              </h3>
              <p className="text-white/60 text-sm">
                Si oui, votre demande sera envoyée et vous pourrez ajouter le profil du{' '}
                <strong className="text-[#C9A84C]">{ordinal(childCount + 1)} enfant</strong>{' '}
                immédiatement — sans re-remplir les informations parentales.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { addChildRef.current = true; onSubmit(getValues() as FormData); }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#C9A84C] hover:bg-[#C9A84C]/80 rounded-xl text-white font-semibold text-base transition-all"
                >
                  <span>➕</span>
                  Oui — inscrire aussi un {ordinal(childCount + 1)} enfant
                </button>

                <button
                  onClick={() => { addChildRef.current = false; onSubmit(getValues() as FormData); }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium text-base transition-all"
                >
                  <span>✅</span>
                  Non — envoyer uniquement cette demande
                </button>

                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="w-full py-3 text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  ← Retour au formulaire
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdmissionForm;