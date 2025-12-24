export interface WebsiteOption {
  id: string;
  name: string;
  logo: string;
  backgrounds?: string[];
}

export interface RTPStyle {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export interface BackgroundCategory {
  id: string;
  name: string;
  backgrounds: string[];
}

export interface TextRow {
  id: string;
  text: string;
}

export interface LinkAlternativeConfig {
  websiteId: string;
  headerTitle: string;
  text1: string;
  text2: string;
  additionalTexts: TextRow[];
  telegramFooter: string;
  backgroundId: string;
  styleId: string;
}
