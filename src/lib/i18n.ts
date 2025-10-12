import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		supportedLngs: ["en", "pl"],

		backend: {
			loadPath: "/locales/{{lng}}/index.json",
		},
		interpolation: {
			//escapeValue: false, // React already escapes values
		},
		detection: {
			order: ["localStorage", "navigator", "cookie"],
			caches: ["localStorage", "cookie"],
		},
	});

export default i18n;
