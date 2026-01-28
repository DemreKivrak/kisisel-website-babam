import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Language names
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "lang.ja": "日本語",

      // Header & Navigation
      "nav.home": "Home",
      "nav.tours": "Tours",
      "nav.destinations": "Destinations",
      "nav.services": "Services",
      "nav.about": "About Us",
      "nav.gallery": "Gallery",
      "nav.contact": "Contact Us",
      "nav.carRental": "Car Rental",

      // Homepage
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Explore Turkey, Embrace the Journey.",
      "hero.subtitle": "Your Gateway to Unforgettable Experiences",

      // Contact
      "contact.title": "Contact Us",
      "contact.phone": "Mobile & Whatsapp",
      "contact.email": "Email",
      "contact.location": "Location",
      "contact.available": "Available 24/7",
      "contact.response": "Response within 24h",
      "contact.sendEmail": "Send us an email anytime!",
      "contact.viewOnMap": "View on map",
      "contact.whyChoose": "Why Choose Us?",
      "contact.expertGuides": "Expert Local Guides",
      "contact.expertGuidesDesc":
        "Professional English-speaking guides with deep local knowledge",
      "contact.bestPrice": "Best Price Guarantee",
      "contact.bestPriceDesc": "Competitive prices with no hidden fees",
      "contact.support": "24/7 Support",
      "contact.supportDesc": "Always available to help during your journey",
      "contact.quality": "Quality Service",
      "contact.qualityDesc": "Dedicated to making your journey unforgettable",
      "contact.heroSubtitle":
        "We're here to help plan your perfect Turkish adventure",

      // Footer
      "footer.quickLinks": "Quick Links",
      "footer.contactUs": "Contact Us",

      // Tours
      "tours.recommended": "Recommended Tours",
      "tours.allTours": "All Tours",
      "tours.viewDetails": "View Details",
      "tours.price": "Pricing list",
      "tours.duration": "Duration",
      "tours.overview": "Overview",
      "tours.highlights": "Highlights",
      "tours.included": "What's Included",
      "tours.notIncluded": "What's Not Included",
      "tours.itinerary": "Itinerary",
      "tours.handpicked": "Handpicked For You",
      "tours.recommendedSubtitle":
        "Carefully curated experiences designed to create unforgettable memories",
      "tours.recommendedBadge": "RECOMMENDED",
      "tours.expertGuide": "Expert Guide Included",
      "tours.exploreSubtitle":
        "Explore Turkey's most beautiful destinations with our curated tour packages",
      "tours.filterByLanguage": "Filter by Language:",
      "tours.filterByDestination": "Filter by Destination:",
      "tours.noToursFound": "No tours found for this destination",

      // About
      "about.title": "About Us",
      "about.whoWeAre": "Who We Are",
      "about.ourMission": "Our Mission",
      "about.ourVision": "Our Vision",
      "about.heroTitle": "Discover Turkey with a Passion",
      "about.heroSubtitle": "Your Expert Tour Guide, Yuksel Kivrak",
      "about.guideName": "Yuksel Kivrak",
      "about.licenseGuide": "Licensed Tour Guide",
      "about.experience": "30+ Years Experience",
      "about.welcomeTitle": "Welcome to My World",
      "about.welcome1":
        "The most picturesque and pleasant way to discover Istanbul and Turkey is with your expert tour guide, Yuksel Kivrak. Over 30 years ago I arrived in Istanbul, basing myself in Old Ottoman and the Byzantine Capital.",
      "about.welcome2":
        "With a passion to show others my magnificent, historic city - and its surrounding areas - I obtained a Tourist Guide License, allowing me the pleasure to present to you one of the most beautiful countries in the world, Turkey, and its fascinating cities such as Istanbul, the capital of tourism in Turkey.",
      "about.historicTitle": "Historic Expertise",
      "about.historicDesc": "Deep knowledge of Ottoman and Byzantine history",
      "about.localTitle": "Local Knowledge",
      "about.localDesc": "Walked and cycled every corner of Istanbul",
      "about.passionTitle": "Unwavering Passion",
      "about.passionDesc":
        "30+ years of enthusiasm for this impressive metropolis",
      "about.experienceText":
        "I have walked and cycled every corner of this wonderful city, witnessed the many changes throughout the years, and have never lost my enthusiasm for this impressive metropolis or my desire for others to see it as I do, in all its greatness.",
      "about.anzacTitle": "The ANZAC Spirit",
      "about.anzac1":
        "Living in Çanakkale for 4 years, I have witnessed firsthand the Australian spirit and respect for the fallen ones of ANZAC and the tragic events that occurred at the Gallipoli Peninsula.",
      "about.anzac2":
        "Countless times I have solemnly looked out over that battlefield with my head bowed in respect for our lost loved ones. Such memories and visions are instilled in my heart forever, and they will be in yours as well, I am sure.",
      "about.offerTitle": "What I Offer",
      "about.architectureTitle": "Architecture & History",
      "about.architectureDesc":
        "Explore magnificent Ottoman palaces, Byzantine churches, and ancient architectural wonders",
      "about.ruinsTitle": "Ancient Ruins",
      "about.ruinsDesc":
        "Discover the remnants of ancient civilizations and walk through millennia of history",
      "about.beautyTitle": "Natural Beauty",
      "about.beautyDesc":
        "Experience breathtaking landscapes, from coastal paradises to fairy chimneys",
      "about.cultureTitle": "Local Culture",
      "about.cultureDesc":
        "Immerse yourself in authentic Turkish culture, traditions, and daily life",
      "about.battlefieldsTitle": "ANZAC Battlefields",
      "about.battlefieldsDesc":
        "Solemn and respectful tours of Gallipoli Peninsula's historic battlefields",
      "about.customTitle": "Custom Tours",
      "about.customDesc":
        "Personalized itineraries tailored to your interests and schedule",
      "about.serviceDesc1":
        "I have personally travelled with numerous Tour Groups throughout this stunning land. Are you interested in architecture, history, ancient ruins, natural beauty, local culture or the ANZAC battlefields? Your time is precious, so tell me what you would like to see and I will make it happen for you.",
      "about.serviceDesc2":
        "Nothing is too much trouble, because I want you to discover the heartbeat and spirit of Turkey in the best possible way: with me as your passionate, knowledgeable tour guide.",
      "about.readyTitle": "Ready to Explore Turkey?",
      "about.readyDesc":
        "Let's create unforgettable memories together. Browse our tours or get in touch to plan your perfect Turkish adventure.",
      "about.viewTours": "View Tours",
      "about.contact": "Contact",

      // Services
      "services.title": "Our Services",
      "services.carRental": "Car Rental Service",
      "services.carRentalTitle": "Car Rental Services",
      "services.description":
        "Explore Turkey at your own pace with our reliable car rental service",
      "services.subtitle":
        "Explore Turkey at your own pace with our reliable and comfortable vehicles",
      "services.chooseVehicle": "Choose Your Perfect Vehicle",
      "services.chooseDescription":
        "Whether you're traveling solo, with family, or in a group, we have the perfect vehicle for your Turkish adventure. All vehicles are well-maintained, insured, and ready for your journey.",
      "services.loading": "Loading rental cars...",
      "services.noAvailable": "No rental cars available at the moment.",
      "services.transmission": "Transmission",
      "services.fuelType": "Fuel Type",
      "services.doors": "Doors",
      "services.features": "Features:",
      "services.startingFrom": "Starting from",
      "services.perDay": "/day",
      "services.or": "or",
      "services.perWeek": "/week",
      "services.requestQuote": "Request Quote & Book Now",
      "services.readyToRide": "Ready to Hit the Road?",
      "services.readyDescription":
        "Contact us today for availability, pricing, and special offers. Let's make your Turkish journey unforgettable!",
      "services.contactUs": "Contact Us",

      // Destinations
      "destinations.title": "Destinations",
      "destinations.explore": "Explore",
      "destinations.discover": "Discover",
      "destinations.exploreTitle": "Explore Destinations",
      "destinations.subtitle":
        "Discover Turkey's most captivating locations and find your perfect tour",
      "destinations.backButton": "Back to Destinations",
      "destinations.topAttractions": "Top Attractions",
      "destinations.availableTours": "Available Tours in",
      "destinations.loadingText": "Loading destinations...",
      "destinations.popularTitle": "Popular Destinations",
      "destinations.popularSubtitle":
        "Explore Turkey's most breathtaking locations and hidden gems",
      "destinations.exploreMore": "Explore More",

      // Gallery
      "gallery.title": "Gallery",
      "gallery.allPhotos": "All Photos",
      "gallery.subtitle":
        "Discover the most beautiful moments and destinations from our trips",
      "gallery.all": "All",
      "gallery.photos": "Photos",
      "gallery.videos": "Videos",
      "gallery.noContent": "No content available in this category yet.",
      "gallery.loading": "Loading...",

      // Common
      "common.learnMore": "Learn More",
      "common.bookNow": "Book Now",
      "common.readMore": "Read More",
      "common.seeMore": "See More",
      "common.loading": "Loading...",
      "common.error": "Error",
    },
  },
  tr: {
    translation: {
      // Language names
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "lang.ja": "日本語",

      // Header & Navigation
      "nav.home": "Ana Sayfa",
      "nav.tours": "Turlar",
      "nav.destinations": "Destinasyonlar",
      "nav.services": "Hizmetler",
      "nav.about": "Hakkımızda",
      "nav.gallery": "Galeri",
      "nav.contact": "İletişim",
      "nav.carRental": "Araç Kiralama",

      // Homepage
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Türkiye'yi Keşfedin, Yolculuğu Benimseyin.",
      "hero.subtitle": "Unutulmaz Deneyimlere Açılan Kapınız",

      // Contact
      "contact.title": "İletişim",
      "contact.phone": "Telefon & Whatsapp",
      "contact.email": "E-posta",
      "contact.location": "Konum",
      "contact.available": "7/24 Ulaşılabilir",
      "contact.response": "24 saat içinde yanıt",
      "contact.sendEmail": "Bize istediğiniz zaman e-posta gönderin!",
      "contact.viewOnMap": "Haritada Görüntüle",
      "contact.whyChoose": "Neden Bizi Seçmelisiniz?",
      "contact.expertGuides": "Uzman Yerel Rehberler",
      "contact.expertGuidesDesc":
        "Derin yerel bilgiye sahip profesyonel İngilizce konuşan rehberler",
      "contact.bestPrice": "En İyi Fiyat Garantisi",
      "contact.bestPriceDesc": "Gizli ücret olmayan rekabetçi fiyatlar",
      "contact.support": "7/24 Destek",
      "contact.supportDesc":
        "Yolculuğunuz boyunca yardımcı olmaya her zaman hazırız",
      "contact.quality": "Kaliteli Hizmet",
      "contact.qualityDesc": "Yolculuğunuzu unutulmaz kılmaya adanmış",
      "contact.heroSubtitle":
        "Mükemmel Türkiye maceranızı planlamanıza yardımcı olmak için buradayız",

      // Footer
      "footer.quickLinks": "Hızlı Bağlantılar",
      "footer.contactUs": "İletişim",

      // Tours
      "tours.recommended": "Önerilen Turlar",
      "tours.allTours": "Tüm Turlar",
      "tours.viewDetails": "Detayları Gör",
      "tours.price": "Fiyat listesi",
      "tours.duration": "Süre",
      "tours.overview": "Genel Bakış",
      "tours.highlights": "Öne Çıkanlar",
      "tours.included": "Dahil Olanlar",
      "tours.notIncluded": "Dahil Olmayanlar",
      "tours.itinerary": " Tur Programı",
      "tours.handpicked": "Sizin İçin Seçtiklerimiz",
      "tours.recommendedSubtitle":
        "Unutulmaz anılar yaratmak için özenle hazırlanmış deneyimler",
      "tours.recommendedBadge": "ÖNERİLEN",
      "tours.expertGuide": "Uzman Rehber Dahil",
      "tours.exploreSubtitle":
        "Özenle hazırlanmış tur paketlerimizle Türkiye'nin en güzel destinasyonlarını keşfedin",
      "tours.filterByLanguage": "Dile Göre Filtrele:",
      "tours.filterByDestination": "Destinasyona Göre Filtrele:",
      "tours.noToursFound": "Bu destinasyon için tur bulunamadı",

      // About
      "about.title": "Hakkımızda",
      "about.whoWeAre": "Biz Kimiz",
      "about.ourMission": "Misyonumuz",
      "about.ourVision": "Vizyonumuz",
      "about.heroTitle": "Türkiye'yi Tutkuyla Keşfedin",
      "about.heroSubtitle": "Uzman Turist Rehberiniz, Yüksel Kıvrak",
      "about.guideName": "Yüksel Kıvrak",
      "about.licenseGuide": "Lisanslı Turist Rehberi",
      "about.experience": "30+ Yıl Deneyim",
      "about.welcomeTitle": "Dünyama Hoş Geldiniz",
      "about.welcome1":
        "İstanbul ve Türkiye'yi keşfetmenin en güzel ve keyifli yolu uzman turist rehberiniz Yüksel Kıvrak ile. 30 yıldan fazla bir süre önce İstanbul'a geldim ve kendimi Osmanlı ve Bizans başkentinde buldum.",
      "about.welcome2":
        "Bu muhteşem, tarihi şehri ve çevresini başkalarına gösterme tutkusuyla Turist Rehberliği Lisansı aldım. Bu bana dünyanın en güzel ülkelerinden biri olan Türkiye'yi ve Türkiye'nin turizm başkenti İstanbul gibi büyüleyici şehirleri size sunma zevkini veriyor.",
      "about.historicTitle": "Tarihi Uzmanlık",
      "about.historicDesc": "Osmanlı ve Bizans tarihi konusunda derin bilgi",
      "about.localTitle": "Yerel Bilgi",
      "about.localDesc":
        "İstanbul'un her köşesini yürüyerek ve bisikletle gezdim",
      "about.passionTitle": "Sarsılmaz Tutku",
      "about.passionDesc": "Bu etkileyici metropole 30+ yıllık coşku",
      "about.experienceText":
        "Bu harika şehrin her köşesini yürüdüm ve bisikletle gezdim, yıllar boyunca birçok değişime tanık oldum ve bu etkileyici metropole olan coşkumu veya başkalarının onu benim gördüğüm gibi, tüm büyüklüğüyle görmesi arzumu hiç kaybetmedim.",
      "about.anzacTitle": "ANZAC Ruhu",
      "about.anzac1":
        "Çanakkale'de 4 yıl yaşayarak, ANZAC'ın şehitlerine duyulan Avustralya ruhu ve saygısına ve Gelibolu Yarımadası'nda meydana gelen trajik olaylara ilk elden tanık oldum.",
      "about.anzac2":
        "Sayısız kez o savaş alanına, kaybettiğimiz sevdiklerimize saygıyla başım eğik olarak baktım. Bu anılar ve görüntüler sonsuza kadar kalbimde yer edindi ve eminim sizin de kalbinizde yer edecektir.",
      "about.offerTitle": "Ne Sunuyorum",
      "about.architectureTitle": "Mimari & Tarih",
      "about.architectureDesc":
        "Muhteşem Osmanlı saraylarını, Bizans kiliselerini ve antik mimari harikaları keşfedin",
      "about.ruinsTitle": "Antik Kalıntılar",
      "about.ruinsDesc":
        "Antik medeniyetlerin kalıntılarını keşfedin ve binlerce yıllık tarihin içinde yürüyün",
      "about.beautyTitle": "Doğal Güzellik",
      "about.beautyDesc":
        "Kıyı cennetlerinden peri bacalarına kadar nefes kesici manzaraları deneyimleyin",
      "about.cultureTitle": "Yerel Kültür",
      "about.cultureDesc":
        "Otantik Türk kültürüne, geleneklerine ve günlük yaşama dalın",
      "about.battlefieldsTitle": "ANZAC Savaş Alanları",
      "about.battlefieldsDesc":
        "Gelibolu Yarımadası'nın tarihi savaş alanlarının ciddi ve saygılı turları",
      "about.customTitle": "Özel Turlar",
      "about.customDesc":
        "İlgi alanlarınıza ve programınıza göre özelleştirilmiş güzergahlar",
      "about.serviceDesc1":
        "Bu muhteşem topraklarda kişisel olarak sayısız Tur Grubuyla seyahat ettim. Mimari, tarih, antik kalıntılar, doğal güzellik, yerel kültür veya ANZAC savaş alanlarıyla mı ilgileniyorsunuz? Zamanınız değerli, bu yüzden neyi görmek istediğinizi söyleyin ve sizin için gerçekleştireyim.",
      "about.serviceDesc2":
        "Hiçbir şey çok fazla sorun değil, çünkü Türkiye'nin nabzını ve ruhunu en iyi şekilde keşfetmenizi istiyorum: tutkulu, bilgili rehberiniz olarak benimle.",
      "about.readyTitle": "Türkiye'yi Keşfetmeye Hazır Mısınız?",
      "about.readyDesc":
        "Birlikte unutulmaz anılar yaratalım. Turlarımıza göz atın veya mükemmel Türkiye maceranızı planlamak için bizimle iletişime geçin.",
      "about.viewTours": "Turları Görüntüle",
      "about.contact": "İletişim",

      // Services
      "services.title": "Hizmetlerimiz",
      "services.carRental": "Araç Kiralama Hizmeti",
      "services.carRentalTitle": "Araç Kiralama Hizmeti",
      "services.description":
        "Güvenilir araç kiralama hizmetimizle Türkiye'yi kendi hızınızda keşfedin",
      "services.subtitle":
        "Güvenilir ve konforlu araçlarımızla Türkiye'yi kendi hızınızda keşfedin",
      "services.chooseVehicle": "Mükemmel Aracınızı Seçin",
      "services.chooseDescription":
        "İster yalnız, ister aile veya grup halinde seyahat edin, Türkiye maceranız için mükemmel araca sahibiz. Tüm araçlar bakımlı, sigortalı ve yolculuğunuz için hazır.",
      "services.loading": "Kiralık araçlar yükleniyor...",
      "services.noAvailable": "Şu anda müsait kiralık araç bulunmamaktadır.",
      "services.transmission": "Vites",
      "services.fuelType": "Yakıt Türü",
      "services.doors": "Kapı",
      "services.features": "Özellikler:",
      "services.startingFrom": "Başlangıç fiyatı",
      "services.perDay": "/gün",
      "services.or": "veya",
      "services.perWeek": "/hafta",
      "services.requestQuote": "Fiyat Teklifi Al & Hemen Rezervasyon",
      "services.readyToRide": "Yola Çıkmaya Hazır Mısınız?",
      "services.readyDescription":
        "Müsaitlik, fiyat ve özel teklifler için bugün bize ulaşın. Türkiye yolculuğunuzu unutulmaz kılalım!",
      "services.contactUs": "İletişime Geçin",

      // Destinations
      "destinations.title": "Destinasyonlar",
      "destinations.explore": "Keşfet",
      "destinations.discover": "Keşfedin",
      "destinations.exploreTitle": "Destinasyonları Keşfedin",
      "destinations.subtitle":
        "Türkiye'nin en büyüleyici lokasyonlarını keşfedin ve mükemmel turunuzu bulun",
      "destinations.backButton": "Destinasyonlara Geri Dön",
      "destinations.topAttractions": "En İyi Cazibe Merkezleri",
      "destinations.availableTours": "Müsait Turlar",
      "destinations.loadingText": "Destinasyonlar yükleniyor...",
      "destinations.popularTitle": "Popüler Destinasyonlar",
      "destinations.popularSubtitle":
        "Türkiye'nin en nefes kesici lokasyonlarını ve gizli cennetlerini keşfedin",
      "destinations.exploreMore": "Daha Fazla Keşfet",

      // Gallery
      "gallery.title": "Galeri",
      "gallery.allPhotos": "Tüm Fotoğraflar",
      "gallery.subtitle":
        "Turlarımızdan en güzel anları ve destinasyonları keşfedin",
      "gallery.all": "Tümü",
      "gallery.photos": "Fotoğraflar",
      "gallery.videos": "Videolar",
      "gallery.noContent": "Bu kategoride henüz içerik bulunmamaktadır.",
      "gallery.loading": "Yükleniyor...",

      // Common
      "common.learnMore": "Daha Fazla",
      "common.bookNow": "Hemen Rezervasyon",
      "common.readMore": "Devamını Oku",
      "common.seeMore": "Daha Fazla Gör",
      "common.loading": "Yükleniyor...",
      "common.error": "Hata",
    },
  },
  de: {
    translation: {
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "nav.home": "Startseite",
      "nav.tours": "Touren",
      "nav.destinations": "Reiseziele",
      "nav.services": "Dienstleistungen",
      "nav.about": "Über uns",
      "nav.gallery": "Galerie",
      "nav.contact": "Kontakt",
      "nav.carRental": "Autovermietung",
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Entdecken Sie die Türkei, Erleben Sie die Reise.",
      "destinations.exploreTitle": "Reiseziele erkunden",
      "destinations.subtitle":
        "Entdecken Sie die faszinierendsten Orte der Türkei und finden Sie Ihre perfekte Tour",
      "destinations.backButton": "Zurück zu Reisezielen",
      "destinations.topAttractions": "Top-Attraktionen",
      "destinations.availableTours": "Verfügbare Touren in",
      "destinations.loadingText": "Reiseziele werden geladen...",
      "destinations.popularTitle": "Beliebte Reiseziele",
      "destinations.popularSubtitle":
        "Entdecken Sie die atemberaubendsten Orte und versteckten Juwelen der Türkei",
      "destinations.exploreMore": "Mehr erkunden",
      "hero.subtitle": "Ihr Tor zu unvergesslichen Erlebnissen",
      "contact.title": "Kontakt",
      "contact.phone": "Mobil & Whatsapp",
      "contact.email": "E-Mail",
      "contact.location": "Standort",
      "contact.available": "24/7 verfügbar",
      "contact.response": "Antwort innerhalb von 24h",
      "contact.sendEmail": "Senden Sie uns jederzeit eine E-Mail!",
      "contact.viewOnMap": "Auf Karte anzeigen",
      "footer.contactUs": "Kontakt",
      "tours.recommended": "Empfohlene Touren",
      "tours.viewDetails": "Details ansehen",
      "tours.handpicked": "Handverlesen für Sie",
      "tours.recommendedSubtitle":
        "Sorgfältig kuratierte Erlebnisse, die unvergessliche Erinnerungen schaffen",
      "tours.recommendedBadge": "EMPFOHLEN",
      "tours.expertGuide": "Expertenführer inbegriffen",
      "tours.exploreSubtitle":
        "Entdecken Sie die schönsten Reiseziele der Türkei mit unseren kuratierten Tourpaketen",
      "tours.filterByLanguage": "Nach Sprache filtern:",
      "tours.filterByDestination": "Nach Ziel filtern:",
      "tours.noToursFound": "Keine Touren für dieses Ziel gefunden",
      "common.learnMore": "Mehr erfahren",
      "common.bookNow": "Jetzt buchen",
    },
  },
  fr: {
    translation: {
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "nav.home": "Accueil",
      "nav.tours": "Circuits",
      "nav.destinations": "Destinations",
      "nav.services": "Services",
      "nav.about": "À propos",
      "nav.gallery": "Galerie",
      "nav.contact": "Contact",
      "nav.carRental": "Location de voiture",
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Explorez la Turquie, Embrassez le Voyage.",
      "destinations.exploreTitle": "Explorer les destinations",
      "destinations.subtitle":
        "Découvrez les endroits les plus captivants de la Turquie et trouvez votre circuit parfait",
      "destinations.backButton": "Retour aux destinations",
      "destinations.topAttractions": "Principales attractions",
      "destinations.availableTours": "Circuits disponibles à",
      "destinations.loadingText": "Chargement des destinations...",
      "destinations.popularTitle": "Destinations populaires",
      "destinations.popularSubtitle":
        "Explorez les lieux les plus époustouflants et les joyaux cachés de la Turquie",
      "destinations.exploreMore": "Explorer plus",
      "hero.subtitle": "Votre porte d'entrée vers des expériences inoubliables",
      "contact.title": "Contact",
      "contact.phone": "Mobile & Whatsapp",
      "contact.email": "E-mail",
      "contact.location": "Localisation",
      "contact.available": "Disponible 24/7",
      "contact.response": "Réponse sous 24h",
      "contact.sendEmail": "Envoyez-nous un e-mail à tout moment!",
      "contact.viewOnMap": "Voir sur la carte",
      "footer.contactUs": "Contact",
      "tours.recommended": "Circuits recommandés",
      "tours.viewDetails": "Voir les détails",
      "tours.handpicked": "Sélectionné pour vous",
      "tours.recommendedSubtitle":
        "Des expériences soigneusement sélectionnées conçues pour créer des souvenirs inoubliables",
      "tours.recommendedBadge": "RECOMMANDÉ",
      "tours.expertGuide": "Guide expert inclus",
      "tours.exploreSubtitle":
        "Explorez les plus belles destinations de la Turquie avec nos forfaits touristiques sélectionnés",
      "tours.filterByLanguage": "Filtrer par langue:",
      "tours.filterByDestination": "Filtrer par destination:",
      "tours.noToursFound": "Aucun circuit trouvé pour cette destination",
      "common.learnMore": "En savoir plus",
      "common.bookNow": "Réserver maintenant",
    },
  },
  es: {
    translation: {
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "nav.home": "Inicio",
      "nav.tours": "Tours",
      "nav.destinations": "Destinos",
      "nav.services": "Servicios",
      "nav.about": "Sobre nosotros",
      "nav.gallery": "Galería",
      "nav.contact": "Contacto",
      "nav.carRental": "Alquiler de coches",
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Explora Turquía, Abraza el Viaje.",
      "destinations.exploreTitle": "Explorar destinos",
      "destinations.subtitle":
        "Descubre los lugares más cautivadores de Turquía y encuentra tu tour perfecto",
      "destinations.backButton": "Volver a destinos",
      "destinations.topAttractions": "Principales atracciones",
      "destinations.availableTours": "Tours disponibles en",
      "destinations.loadingText": "Cargando destinos...",
      "destinations.popularTitle": "Destinos populares",
      "destinations.popularSubtitle":
        "Explora los lugares más impresionantes y joyas ocultas de Turquía",
      "destinations.exploreMore": "Explorar más",
      "hero.subtitle": "Tu puerta de entrada a experiencias inolvidables",
      "contact.title": "Contacto",
      "contact.phone": "Móvil & Whatsapp",
      "contact.email": "Correo electrónico",
      "contact.location": "Ubicación",
      "contact.available": "Disponible 24/7",
      "contact.response": "Respuesta en 24h",
      "contact.sendEmail":
        "¡Envíanos un correo electrónico en cualquier momento!",
      "contact.viewOnMap": "Ver en el mapa",
      "footer.contactUs": "Contacto",
      "tours.recommended": "Tours recomendados",
      "tours.viewDetails": "Ver detalles",
      "tours.handpicked": "Seleccionado para ti",
      "tours.recommendedSubtitle":
        "Experiencias cuidadosamente seleccionadas diseñadas para crear recuerdos inolvidables",
      "tours.recommendedBadge": "RECOMENDADO",
      "tours.expertGuide": "Guía experto incluido",
      "tours.exploreSubtitle":
        "Explore los destinos más hermosos de Turquía con nuestros paquetes turísticos seleccionados",
      "tours.filterByLanguage": "Filtrar por idioma:",
      "tours.filterByDestination": "Filtrar por destino:",
      "tours.noToursFound": "No se encontraron tours para este destino",
      "common.learnMore": "Más información",
      "common.bookNow": "Reservar ahora",
    },
  },
  ru: {
    translation: {
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "nav.home": "Главная",
      "nav.tours": "Туры",
      "nav.destinations": "Направления",
      "nav.services": "Услуги",
      "nav.about": "О нас",
      "nav.gallery": "Галерея",
      "nav.contact": "Контакты",
      "nav.carRental": "Аренда автомобилей",
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "Исследуйте Турцию, Наслаждайтесь Путешествием.",
      "destinations.exploreTitle": "Исследуйте направления",
      "destinations.subtitle":
        "Откройте для себя самые захватывающие места Турции и найдите свой идеальный тур",
      "destinations.backButton": "Вернуться к направлениям",
      "destinations.topAttractions": "Главные достопримечательности",
      "destinations.availableTours": "Доступные туры в",
      "destinations.loadingText": "Загрузка направлений...",
      "destinations.popularTitle": "Популярные направления",
      "destinations.popularSubtitle":
        "Исследуйте самые захватывающие места и скрытые жемчужины Турции",
      "destinations.exploreMore": "Узнать больше",
      "hero.subtitle": "Ваши ворота к незабываемым впечатлениям",
      "contact.title": "Контакты",
      "contact.phone": "Мобильный & Whatsapp",
      "contact.email": "Электронная почта",
      "contact.location": "Местоположение",
      "contact.available": "Доступно 24/7",
      "contact.response": "Ответ в течение 24ч",
      "contact.sendEmail": "Отправьте нам письмо в любое время!",
      "contact.viewOnMap": "Посмотреть на карте",
      "footer.contactUs": "Контакты",
      "tours.recommended": "Рекомендуемые туры",
      "tours.viewDetails": "Смотреть детали",
      "tours.handpicked": "Отобрано для вас",
      "tours.recommendedSubtitle":
        "Тщательно подобранные впечатления, созданные для незабываемых воспоминаний",
      "tours.recommendedBadge": "РЕКОМЕНДУЕТСЯ",
      "tours.expertGuide": "Экспертный гид включен",
      "tours.exploreSubtitle":
        "Откройте для себя самые красивые направления Турции с нашими туристическими пакетами",
      "tours.filterByLanguage": "Фильтр по языку:",
      "tours.filterByDestination": "Фильтр по направлению:",
      "tours.noToursFound": "Туры для этого направления не найдены",
      "common.learnMore": "Узнать больше",
      "common.bookNow": "Забронировать сейчас",
    },
  },
  ja: {
    translation: {
      "lang.en": "English",
      "lang.tr": "Türkçe",
      "lang.de": "Deutsch",
      "lang.fr": "Français",
      "lang.es": "Español",
      "lang.ru": "Русский",
      "lang.ja": "日本語",
      "nav.home": "ホーム",
      "nav.tours": "ツアー",
      "nav.destinations": "目的地",
      "nav.services": "サービス",
      "nav.about": "私たちについて",
      "nav.gallery": "ギャラリー",
      "nav.contact": "お問い合わせ",
      "nav.carRental": "レンタカー",
      "hero.title": "ANATOLIA HORIZON TRAVEL",
      "hero.tagline": "トルコを探索し、旅を楽しもう。",
      "destinations.exploreTitle": "目的地を探索",
      "destinations.subtitle":
        "トルコで最も魅力的な場所を発見し、完璧なツアーを見つけましょう",
      "destinations.backButton": "目的地に戻る",
      "destinations.topAttractions": "トップアトラクション",
      "destinations.availableTours": "利用可能なツアー",
      "destinations.loadingText": "目的地を読み込んでいます...",
      "destinations.popularTitle": "人気の目的地",
      "destinations.popularSubtitle":
        "トルコの最も息を呑むような場所と隠された宝石を探索",
      "destinations.exploreMore": "もっと探索",
      "hero.subtitle": "忘れられない体験への入り口",
      "contact.title": "お問い合わせ",
      "contact.phone": "携帯電話 & Whatsapp",
      "contact.email": "メール",
      "contact.location": "場所",
      "contact.available": "24時間対応",
      "contact.response": "24時間以内に返信",
      "contact.sendEmail": "いつでもメールをお送りください！",
      "contact.viewOnMap": "地図で見る",
      "footer.contactUs": "お問い合わせ",
      "tours.recommended": "おすすめツアー",
      "tours.viewDetails": "詳細を見る",
      "tours.handpicked": "あなたのために選ばれました",
      "tours.recommendedSubtitle":
        "忘れられない思い出を作るために注意深く選ばれた体験",
      "tours.recommendedBadge": "おすすめ",
      "tours.expertGuide": "専門ガイド含まれる",
      "tours.exploreSubtitle":
        "厳選されたツアーパッケージでトルコの最も美しい目的地を探索",
      "tours.filterByLanguage": "言語でフィルター:",
      "tours.filterByDestination": "目的地でフィルター:",
      "tours.noToursFound": "この目的地のツアーは見つかりませんでした",
      "common.learnMore": "詳しく見る",
      "common.bookNow": "今すぐ予約",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
