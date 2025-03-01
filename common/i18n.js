	import en from '@/locale/en.json'
	var messages={en};
	if(uni.getStorageSync('localeJson')){
		messages=uni.getStorageSync('localeJson')
	}
	var lang =uni.getStorageSync('locale')?uni.getStorageSync('locale'):'en'
	//console.log(lang)
	let i18nConfig = {
		locale: lang, // set locale
		fallbackLocale: 'en',
		messages // set locale messages
	}
	
	// #ifdef VUE2
	import Vue from 'vue'
	import VueI18n from 'vue-i18n'
	Vue.use(VueI18n)
	const i18n = new VueI18n(i18nConfig)
	// #endif
	
	// #ifdef VUE3
	import {
		createI18n
	} from 'vue-i18n'
	const i18n = createI18n(i18nConfig)
	// #endif
 
    export default i18n