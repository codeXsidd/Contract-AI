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
