import React, { createContext, useContext, useState, useEffect } from 'react'

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh'

export interface TranslationDictionary {
  [key: string]: {
    [lang in LanguageCode]: string
  }
}

export const translations: TranslationDictionary = {
  dashboard: {
    en: 'Dashboard',
    es: 'Panel Control',
    fr: 'Tableau de bord',
    de: 'Dashboard',
    hi: 'डैशबोर्ड',
    zh: '仪表板',
  },
  allContracts: {
    en: 'All Contracts',
    es: 'Todos los Contratos',
    fr: 'Tous les Contrats',
    de: 'Alle Verträge',
    hi: 'सभी अनुबंध',
    zh: '所有合同',
  },
  uploadContract: {
    en: 'Upload Contract',
    es: 'Subir Contrato',
    fr: 'Télécharger le contrat',
    de: 'Vertrag hochladen',
    hi: 'अनुबंध अपलोड करें',
    zh: '上传合同',
  },
  aiNegotiation: {
    en: 'AI Negotiation Copilot',
    es: 'Copiloto de Negociación IA',
    fr: 'Copilote de Négociation IA',
    de: 'KI-Verhandlungspilot',
    hi: 'एआई वार्ता सहायक',
    zh: 'AI 谈判副驾驶',
  },
  ragChatbot: {
    en: 'RAG Contract Chatbot',
    es: 'Chatbot de Contrato RAG',
    fr: 'Chatbot de Contrat RAG',
    de: 'RAG-Vertrags-Chatbot',
    hi: 'आरएजी कॉन्ट्रैक्ट चैटबॉट',
    zh: 'RAG 合同聊天机器人',
  },
  regulatoryRadar: {
    en: 'Regulatory Radar',
    es: 'Radar Regulatorio',
    fr: 'Radar Réglementaire',
    de: 'Regulierungsradar',
    hi: 'नियामक रडार',
    zh: '监管雷达',
  },
  settings: {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
    hi: 'सेटिंग्स',
    zh: '设置',
  },
  systemPreference: {
    en: 'System Preference',
    es: 'Preferencia del Sistema',
    fr: 'Préférence Système',
    de: 'Systemeinstellungen',
    hi: 'सिस्टम वरीयता',
    zh: '系统偏好设置',
  },
  settingsDescription: {
    en: 'Manage your organization preferences, multilingual settings, and system themes',
    es: 'Administre las preferencias de su organización, configuración multilingüe y temas',
    fr: 'Gérez les préférences de votre organisation, les paramètres multilingues et les thèmes',
    de: 'Verwalten Sie Ihre Organisationseinstellungen, mehrsprachigen Einstellungen und Systemdesigns',
    hi: 'अपने संगठन की प्राथमिकताएं, बहुभाषी सेटिंग्स और सिस्टम थीम प्रबंधित करें',
    zh: '管理您的组织首选项、多语言设置和系统主题',
  },
  multilingualSupport: {
    en: 'Multilingual Support',
    es: 'Soporte Multilingüe',
    fr: 'Support Multilingue',
    de: 'Mehrsprachige Unterstützung',
    hi: 'बहुभाषी समर्थन',
    zh: '多语言支持',
  },
  multilingualSupportDescription: {
    en: 'Select your preferred platform & AI response language',
    es: 'Seleccione su plataforma preferida y el idioma de respuesta de la IA',
    fr: "Sélectionnez votre plateforme préférée et la langue de réponse de l'IA",
    de: 'Wählen Sie Ihre bevorzugte Plattform und KI-Antwortsprache',
    hi: 'अपना पसंदीदा प्लेटफ़ॉर्म और AI प्रतिक्रिया भाषा चुनें',
    zh: '选择您首选的平台和 AI 响应语言',
  },
  systemAppearance: {
    en: 'System Preference & Appearance',
    es: 'Preferencia y Apariencia del Sistema',
    fr: 'Préférence Système et Apparence',
    de: 'Systemeinstellungen & Erscheinungsbild',
    hi: 'सिस्टम वरीयता और प्रकटन',
    zh: '系统偏好设置和外观',
  },
  systemAppearanceDescription: {
    en: 'Configure interface themes or sync automatically with OS preferences',
    es: 'Configure temas de interfaz o sincronice automáticamente con las preferencias del SO',
    fr: "Configurez les thèmes de l'interface ou synchronisez automatiquement avec les préférences de l'OS",
    de: 'Konfigurieren Sie Benutzeroberflächendesigns oder synchronisieren Sie sie automatisch mit den Betriebssystemeinstellungen',
    hi: 'इंटरफ़ेस थीम कॉन्फ़िगर करें या OS प्राथमिकताओं के साथ स्वचालित रूप से सिंक करें',
    zh: '配置界面主题或自动与操作系统偏好设置同步',
  },
  systemPreferenceDesc: {
    en: 'Sync automatically with OS dark/light mode',
    es: 'Sincronizar automáticamente con el modo oscuro/claro del SO',
    fr: "Synchronisation automatique avec le mode sombre/clair de l'OS",
    de: 'Automatisch mit dem Dunkel-/Hell-Modus des Betriebssystems synchronisieren',
    hi: 'OS डार्क/लाइट मोड के साथ स्वचालित रूप से सिंक करें',
    zh: '自动同步操作系统的深色/浅色模式',
  },
  darkMode: {
    en: 'Dark Mode',
    es: 'Modo Oscuro',
    fr: 'Mode Sombre',
    de: 'Dunkelmodus',
    hi: 'डार्क मोड',
    zh: '深色模式',
  },
  darkModeDesc: {
    en: 'Optimized high-contrast dark enterprise interface',
    es: 'Interfaz empresarial oscura optimizada de alto contraste',
    fr: "Interface d'entreprise sombre optimisée à contraste élevé",
    de: 'Optimierte kontrastreiche dunkle Unternehmensschnittstelle',
    hi: 'अनुकूलित उच्च-कंट्रास्ट डार्क एंटरप्राइज़ इंटरफ़ेस',
    zh: '优化的全对比度深色企业界面',
  },
  lightMode: {
    en: 'Light Mode',
    es: 'Modo Claro',
    fr: 'Mode Clair',
    de: 'Hellmodus',
    hi: 'लाइट मोड',
    zh: '浅色模式',
  },
  lightModeDesc: {
    en: 'Clean high-visibility daylight interface',
    es: 'Interfaz diurna limpia y de alta visibilidad',
    fr: 'Interface de jour propre et à haute visibilité',
    de: 'Saubere, gut sichtbare Tageslichtschnittstelle',
    hi: 'स्वच्छ उच्च-दृश्यता दिन के उजाले इंटरफ़ेस',
    zh: '干净的高可见度日光界面',
  },
  profileInfo: {
    en: 'Profile Information',
    es: 'Información del Perfil',
    fr: 'Informations du Profil',
    de: 'Profilinformationen',
    hi: 'प्रोफाइल जानकारी',
    zh: '个人资料信息',
  },
  fullName: {
    en: 'Full Name',
    es: 'Nombre Completo',
    fr: 'Nom Complet',
    de: 'Vollständiger Name',
    hi: 'पूरा नाम',
    zh: '全名',
  },
  organization: {
    en: 'Organization',
    es: 'Organización',
    fr: 'Organisation',
    de: 'Organisation',
    hi: 'संगठन',
    zh: '组织',
  },
  savingPreferences: {
    en: 'Saving Preferences...',
    es: 'Guardando Preferencias...',
    fr: 'Enregistrement des Préférences...',
    de: 'Einstellungen speichern...',
    hi: 'प्राथमिकताएं सहेजी जा रही हैं...',
    zh: '保存首选项...',
  },
  saveSettings: {
    en: 'Save Settings',
    es: 'Guardar Configuración',
    fr: 'Enregistrer les Paramètres',
    de: 'Einstellungen speichern',
    hi: 'सेटिंग्स सहेजें',
    zh: '保存设置',
  }
}

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('user_language') as LanguageCode) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('user_language', language)
  }, [language])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language]
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
