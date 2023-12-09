export type LanguageCharacteristic = {
  textColor: string;
  backgroundColor: string;
  iconLink: string;
  formattedTitle?: string;
  borderColor?: string;
};

export type LanguagesCharacteristicsList = { [techName: string]: LanguageCharacteristic };

export type LangFields = { [language: string]: string };
export type LanguagesShort = { [techScope: string]: LangFields };
