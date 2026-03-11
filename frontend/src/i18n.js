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
      "hero.companyName": "OLTRE TOUR TRAVEL AGENCY",
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
      "about.since2000": "Since 2000",
      "about.heroTitle": "A Quarter Century of Trust in Tourism",
      "about.heroSubtitle": "Your Expert Tour Guide, Yuksel Kivrak",
      "about.introText":
        "Since 2000, we have been your travel companion at the heart of the tourism sector with our expertise in transportation and agency services. As Oltre Tours, we combine the experience of years with a modern service approach, believing that transportation is not just about getting from one point to another, but a process of comfort.",
      "about.whyChooseTitle": "Why Work With Us?",
      "about.whyChooseSubtitle":
        "We are with you at every point you need, with our wide range of services",
      "about.fleetTitle": "Rich Vehicle Fleet",
      "about.fleetDesc":
        "We are at your service with our economical, comfortable and luxury segment vehicle fleet that meets all kinds of needs, from small groups to large organizations.",
      "about.corporateTitle": "Corporate Solutions",
      "about.corporateDesc":
        "We manage the staff shuttle, VIP transfer and event transportation needs of corporations with the principles of punctuality and professionalism.",
      "about.touristTitle": "Domestic and Foreign Tourist Services",
      "about.touristDesc":
        "We offer our guests who discover the beauties of Turkey not just a transfer service, but a safe and peaceful travel experience.",
      "about.expertTitle": "Expert Staff",
      "about.expertDesc":
        "Experience the privilege of working with a team that knows the sector, masters operational processes and puts guest satisfaction above everything else.",
      "about.visionTitle": "Our Vision",
      "about.visionText":
        "On this journey we started in 2000, to continue to be the first 'point of trust' that comes to mind in transportation and agency by improving our vehicle park and service quality every day.",
      "about.motto": "Roads change, the search for comfort and trust does not.",
      "about.tagline": "Every journey is special with Oltre Tours",
      "about.ctaTitle": "Ready to Travel With Us?",
      "about.ctaDesc":
        "With our 25 years of experience and wide service network, we are here to offer you the best travel experience.",
      "about.discoverServices": "Discover Our Services",
      "about.getInTouch": "Get In Touch",
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
      "nav.destinations": "Rotalar",
      "nav.services": "Hizmetler",
      "nav.about": "Hakkımızda",
      "nav.gallery": "Galeri",
      "nav.contact": "İletişim",
      "nav.carRental": "Araç Kiralama",

      // Homepage
      "hero.companyName": "OLTRE SEYAHAT TURİZM",
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
        "Özenle hazırlanmış tur paketlerimizle Türkiye'nin en güzel rotaları keşfedin",
      "tours.filterByLanguage": "Dile Göre Filtrele:",
      "tours.filterByDestination": "Rotalara Göre Filtrele:",
      "tours.noToursFound": "Bu Rota için tur bulunamadı",

      // About
      "about.title": "Hakkımızda",
      "about.whoWeAre": "Biz Kimiz",
      "about.ourMission": "Misyonumuz",
      "about.ourVision": "Vizyonumuz",
      "about.since2000": "2000'den Beri",
      "about.heroTitle": "Turizmde Çeyrek Asırlık Güven",
      "about.heroSubtitle": "Uzman Turist Rehberiniz, Yüksel Kıvrak",
      "about.introText":
        "2000 yılından bu yana turizm sektörünün kalbinde; taşımacılık ve acentacılık alanındaki uzmanlığımızla yol arkadaşınız oluyoruz. Oltre Tours olarak, yılların getirdiği tecrübeyi modern hizmet anlayışıyla birleştirerek, ulaşımın sadece bir noktadan diğerine gitmek değil, bir konfor süreci olduğuna inanıyoruz.",
      "about.whyChooseTitle": "Neden Bizimle Çalışmalısınız?",
      "about.whyChooseSubtitle":
        "İhtiyacınız olan her noktada, geniş hizmet yelpazemizle yanınızdayız",
      "about.fleetTitle": "Zengin Araç Filosu",
      "about.fleetDesc":
        "Küçük gruplardan büyük organizasyonlara kadar her türlü ihtiyaca cevap veren; ekonomik, konforlu ve lüks segment araç filomuzla hizmetinizdeyiz.",
      "about.corporateTitle": "Kurumsal Çözümler",
      "about.corporateDesc":
        "Kurumların personel servisi, VIP transfer ve etkinlik taşımacılığı ihtiyaçlarını dakiklik ve profesyonellik ilkeleriyle yönetiyoruz.",
      "about.touristTitle": "Yerli ve Yabancı Turist Hizmetleri",
      "about.touristDesc":
        "Türkiye'nin güzelliklerini keşfeden misafirlerimize, sadece bir transfer hizmeti değil, güvenli ve huzurlu bir seyahat deneyimi sunuyoruz.",
      "about.expertTitle": "Uzman Kadro",
      "about.expertDesc":
        "Sektörü tanıyan, operasyonel süreçlere hakim ve misafir memnuniyetini her şeyin üzerinde tutan bir ekiple çalışmanın ayrıcalığını yaşayın.",
      "about.visionTitle": "Vizyonumuz",
      "about.visionText":
        "2000 yılında başladığımız bu yolculukta, her geçen gün araç parkurumuzu ve hizmet kalitemizi geliştirerek, taşımacılık ve acentacılıkta akla gelen ilk 'güven noktası' olmaya devam etmektir.",
      "about.motto": "Yollar değişir, konfor ve güven arayışı değişmez.",
      "about.tagline": "Oltre Tours ile her yolculuk özeldir",
      "about.ctaTitle": "Bizimle Yolculuğa Çıkmaya Hazır Mısınız?",
      "about.ctaDesc":
        "25 yıllık tecrübemiz ve geniş hizmet ağımızla, sizlere en iyi seyahat deneyimini sunmak için buradayız.",
      "about.discoverServices": "Hizmetlerimizi Keşfedin",
      "about.getInTouch": "İletişime Geçin",
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
      "destinations.title": "Rotalar",
      "destinations.explore": "Keşfet",
      "destinations.discover": "Keşfedin",
      "destinations.exploreTitle": "Rotaları Keşfedin",
      "destinations.subtitle":
        "Türkiye'nin en büyüleyici lokasyonlarını keşfedin ve mükemmel turunuzu bulun",
      "destinations.backButton": "Rotalara Geri Dön",
      "destinations.topAttractions": "En İyi Cazibe Merkezleri",
      "destinations.availableTours": "Müsait Turlar",
      "destinations.loadingText": "Rotalar yükleniyor...",
      "destinations.popularTitle": "Popüler Rotalar",
      "destinations.popularSubtitle":
        "Türkiye'nin en nefes kesici lokasyonlarını ve gizli cennetlerini keşfedin",
      "destinations.exploreMore": "Daha Fazla Keşfet",

      // Gallery
      "gallery.title": "Galeri",
      "gallery.allPhotos": "Tüm Fotoğraflar",
      "gallery.subtitle": "Turlarımızdan en güzel anları ve rotaları keşfedin",
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
      "hero.companyName": "OLTRE TOUR REISEAGENTUR",
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

      // About
      "about.title": "Über uns",
      "about.since2000": "Seit 2000",
      "about.heroTitle": "Ein Vierteljahrhundert Vertrauen im Tourismus",
      "about.introText":
        "Seit 2000 sind wir Ihr Reisebegleiter im Herzen der Tourismusbranche mit unserer Expertise im Transport- und Agenturwesen. Als Oltre Tours kombinieren wir die Erfahrung der Jahre mit einem modernen Serviceansatz und glauben, dass Transport nicht nur darum geht, von einem Punkt zum anderen zu gelangen, sondern ein Prozess des Komforts ist.",
      "about.whyChooseTitle": "Warum mit uns arbeiten?",
      "about.whyChooseSubtitle":
        "Wir sind an jedem Punkt, den Sie benötigen, mit unserem breiten Leistungsspektrum für Sie da",
      "about.fleetTitle": "Reichhaltige Fahrzeugflotte",
      "about.fleetDesc":
        "Wir stehen Ihnen mit unserer wirtschaftlichen, komfortablen und luxuriösen Fahrzeugflotte zur Verfügung, die alle Arten von Bedürfnissen erfüllt, von kleinen Gruppen bis zu großen Organisationen.",
      "about.corporateTitle": "Unternehmenslösungen",
      "about.corporateDesc":
        "Wir verwalten den Personalshuttle, VIP-Transfer und Veranstaltungstransport von Unternehmen nach den Prinzipien von Pünktlichkeit und Professionalität.",
      "about.touristTitle":
        "Dienstleistungen für inländische und ausländische Touristen",
      "about.touristDesc":
        "Wir bieten unseren Gästen, die die Schönheiten der Türkei entdecken, nicht nur einen Transferservice, sondern ein sicheres und friedliches Reiseerlebnis.",
      "about.expertTitle": "Expertenteam",
      "about.expertDesc":
        "Erleben Sie das Privileg, mit einem Team zu arbeiten, das die Branche kennt, operative Prozesse beherrscht und die Gästezufriedenheit über alles stellt.",
      "about.visionTitle": "Unsere Vision",
      "about.visionText":
        "Auf dieser Reise, die wir im Jahr 2000 begonnen haben, wollen wir weiterhin der erste 'Vertrauenspunkt' sein, der einem im Transport- und Agenturwesen einfällt, indem wir täglich unseren Fahrzeugpark und unsere Servicequalität verbessern.",
      "about.motto":
        "Straßen ändern sich, die Suche nach Komfort und Vertrauen nicht.",
      "about.tagline": "Jede Reise ist etwas Besonderes mit Oltre Tours",
      "about.ctaTitle": "Bereit, mit uns zu reisen?",
      "about.ctaDesc":
        "Mit unserer 25-jährigen Erfahrung und unserem umfangreichen Servicenetzwerk sind wir hier, um Ihnen das beste Reiseerlebnis zu bieten.",
      "about.discoverServices": "Entdecken Sie unsere Dienstleistungen",
      "about.getInTouch": "Kontakt aufnehmen",
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
      "hero.companyName": "OLTRE TOUR AGENCE DE VOYAGE",
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

      // About
      "about.title": "À propos de nous",
      "about.since2000": "Depuis 2000",
      "about.heroTitle": "Un quart de siècle de confiance dans le tourisme",
      "about.introText":
        "Depuis 2000, nous sommes votre compagnon de voyage au cœur du secteur touristique avec notre expertise dans les services de transport et d'agence. Chez Oltre Tours, nous combinons l'expérience des années avec une approche de service moderne, croyant que le transport n'est pas seulement un déplacement d'un point à un autre, mais un processus de confort.",
      "about.whyChooseTitle": "Pourquoi travailler avec nous?",
      "about.whyChooseSubtitle":
        "Nous sommes à vos côtés à chaque point où vous en avez besoin, avec notre large gamme de services",
      "about.fleetTitle": "Flotte de véhicules riche",
      "about.fleetDesc":
        "Nous sommes à votre service avec notre flotte de véhicules économiques, confortables et de luxe qui répond à tous les types de besoins, des petits groupes aux grandes organisations.",
      "about.corporateTitle": "Solutions d'entreprise",
      "about.corporateDesc":
        "Nous gérons les besoins de navette du personnel, de transfert VIP et de transport d'événements des entreprises selon les principes de ponctualité et de professionnalisme.",
      "about.touristTitle": "Services pour touristes nationaux et étrangers",
      "about.touristDesc":
        "Nous offrons à nos invités qui découvrent les beautés de la Turquie non seulement un service de transfert, mais une expérience de voyage sûre et paisible.",
      "about.expertTitle": "Équipe d'experts",
      "about.expertDesc":
        "Vivez le privilège de travailler avec une équipe qui connaît le secteur, maîtrise les processus opérationnels et place la satisfaction des clients au-dessus de tout.",
      "about.visionTitle": "Notre vision",
      "about.visionText":
        "Dans ce voyage que nous avons commencé en 2000, continuer à être le premier 'point de confiance' qui vient à l'esprit dans le transport et l'agence en améliorant notre parc automobile et notre qualité de service chaque jour.",
      "about.motto":
        "Les routes changent, la recherche de confort et de confiance ne change pas.",
      "about.tagline": "Chaque voyage est spécial avec Oltre Tours",
      "about.ctaTitle": "Prêt à voyager avec nous?",
      "about.ctaDesc":
        "Avec nos 25 ans d'expérience et notre large réseau de services, nous sommes là pour vous offrir la meilleure expérience de voyage.",
      "about.discoverServices": "Découvrez nos services",
      "about.getInTouch": "Nous contacter",
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
      "hero.companyName": "OLTRE TOUR AGENCIA DE VIAJES",
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

      // About
      "about.title": "Sobre nosotros",
      "about.since2000": "Desde 2000",
      "about.heroTitle": "Un cuarto de siglo de confianza en el turismo",
      "about.introText":
        "Desde 2000, hemos sido su compañero de viaje en el corazón del sector turístico con nuestra experiencia en servicios de transporte y agencia. Como Oltre Tours, combinamos la experiencia de los años con un enfoque de servicio moderno, creyendo que el transporte no es solo ir de un punto a otro, sino un proceso de comodidad.",
      "about.whyChooseTitle": "¿Por qué trabajar con nosotros?",
      "about.whyChooseSubtitle":
        "Estamos con usted en cada punto que necesite, con nuestra amplia gama de servicios",
      "about.fleetTitle": "Flota de vehículos rica",
      "about.fleetDesc":
        "Estamos a su servicio con nuestra flota de vehículos económicos, cómodos y de lujo que satisface todo tipo de necesidades, desde pequeños grupos hasta grandes organizaciones.",
      "about.corporateTitle": "Soluciones corporativas",
      "about.corporateDesc":
        "Gestionamos las necesidades de transporte de personal, traslados VIP y eventos de las empresas con los principios de puntualidad y profesionalismo.",
      "about.touristTitle": "Servicios para turistas nacionales y extranjeros",
      "about.touristDesc":
        "Ofrecemos a nuestros huéspedes que descubren las bellezas de Turquía no solo un servicio de traslado, sino una experiencia de viaje segura y tranquila.",
      "about.expertTitle": "Equipo experto",
      "about.expertDesc":
        "Experimente el privilegio de trabajar con un equipo que conoce el sector, domina los procesos operativos y pone la satisfacción del cliente por encima de todo.",
      "about.visionTitle": "Nuestra visión",
      "about.visionText":
        "En este viaje que comenzamos en 2000, continuar siendo el primer 'punto de confianza' que viene a la mente en transporte y agencia mejorando nuestro parque de vehículos y calidad de servicio cada día.",
      "about.motto":
        "Los caminos cambian, la búsqueda de comodidad y confianza no cambia.",
      "about.tagline": "Cada viaje es especial con Oltre Tours",
      "about.ctaTitle": "¿Listo para viajar con nosotros?",
      "about.ctaDesc":
        "Con nuestros 25 años de experiencia y amplia red de servicios, estamos aquí para ofrecerle la mejor experiencia de viaje.",
      "about.discoverServices": "Descubre nuestros servicios",
      "about.getInTouch": "Ponerse en contacto",
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
      "hero.companyName": "OLTRE TOUR ТУРИСТИЧЕСКОЕ АГЕНТСТВО",
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

      // About
      "about.title": "О нас",
      "about.since2000": "С 2000 года",
      "about.heroTitle": "Четверть века доверия в туризме",
      "about.introText":
        "С 2000 года мы являемся вашим попутчиком в самом сердце туристического сектора с нашим опытом в транспортных и агентских услугах. Как Oltre Tours, мы сочетаем опыт многих лет с современным подходом к обслуживанию, считая, что транспорт — это не просто перемещение из одной точки в другую, а процесс комфорта.",
      "about.whyChooseTitle": "Почему работать с нами?",
      "about.whyChooseSubtitle":
        "Мы с вами в каждой точке, где вам нужна помощь, с нашим широким спектром услуг",
      "about.fleetTitle": "Богатый автопарк",
      "about.fleetDesc":
        "Мы к вашим услугам с нашим экономичным, комфортабельным и роскошным автопарком, который отвечает всем видам потребностей, от небольших групп до крупных организаций.",
      "about.corporateTitle": "Корпоративные решения",
      "about.corporateDesc":
        "Мы управляем потребностями корпораций в персональном трансфере, VIP-трансфере и транспортировке мероприятий по принципам пунктуальности и профессионализма.",
      "about.touristTitle": "Услуги для местных и иностранных туристов",
      "about.touristDesc":
        "Мы предлагаем нашим гостям, которые открывают для себя красоты Турции, не просто услугу трансфера, а безопасный и спокойный опыт путешествия.",
      "about.expertTitle": "Экспертная команда",
      "about.expertDesc":
        "Ощутите привилегию работы с командой, которая знает отрасль, владеет операционными процессами и ставит удовлетворенность гостей превыше всего.",
      "about.visionTitle": "Наше видение",
      "about.visionText":
        "В этом путешествии, которое мы начали в 2000 году, продолжать быть первой 'точкой доверия', которая приходит на ум в транспорте и агентстве, улучшая наш автопарк и качество обслуживания каждый день.",
      "about.motto": "Дороги меняются, поиск комфорта и доверия не меняется.",
      "about.tagline": "Каждое путешествие особенное с Oltre Tours",
      "about.ctaTitle": "Готовы путешествовать с нами?",
      "about.ctaDesc":
        "С нашим 25-летним опытом и широкой сетью услуг мы здесь, чтобы предложить вам лучший опыт путешествий.",
      "about.discoverServices": "Откройте наши услуги",
      "about.getInTouch": "Связаться с нами",
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
      "hero.companyName": "OLTRE TOUR 旅行代理店",
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

      // About
      "about.title": "私たちについて",
      "about.since2000": "2000年から",
      "about.heroTitle": "観光業における四半世紀の信頼",
      "about.introText":
        "2000年から、輸送と代理店サービスにおける専門知識を持って、観光セクターの中心であなたの旅の仲間となっています。Oltre Toursとして、長年の経験と現代的なサービスアプローチを組み合わせ、輸送は単にある地点から別の地点に移動することではなく、快適さのプロセスであると信じています。",
      "about.whyChooseTitle": "なぜ私たちと働くのか？",
      "about.whyChooseSubtitle":
        "私たちは幅広いサービスで、あなたが必要とするすべての場所であなたと共にいます",
      "about.fleetTitle": "豊富な車両フリート",
      "about.fleetDesc":
        "小規模なグループから大規模な組織まで、あらゆる種類のニーズに対応する経済的、快適、高級セグメントの車両フリートでサービスを提供しています。",
      "about.corporateTitle": "企業向けソリューション",
      "about.corporateDesc":
        "企業のスタッフシャトル、VIPトランスファー、イベント輸送のニーズを時間厳守とプロフェッショナリズムの原則で管理しています。",
      "about.touristTitle": "国内外の観光客向けサービス",
      "about.touristDesc":
        "トルコの美しさを発見するゲストに、単なる送迎サービスではなく、安全で平和な旅行体験を提供しています。",
      "about.expertTitle": "専門チーム",
      "about.expertDesc":
        "業界を知り、運用プロセスをマスターし、ゲストの満足を何よりも優先するチームと働く特権を体験してください。",
      "about.visionTitle": "私たちのビジョン",
      "about.visionText":
        "2000年に始めたこの旅において、毎日車両パークとサービス品質を改善することで、輸送と代理店で思い浮かぶ最初の「信頼のポイント」であり続けることです。",
      "about.motto": "道は変わりますが、快適さと信頼の追求は変わりません。",
      "about.tagline": "Oltre Toursとのすべての旅は特別です",
      "about.ctaTitle": "私たちと一緒に旅行する準備はできていますか？",
      "about.ctaDesc":
        "25年の経験と広範なサービスネットワークで、最高の旅行体験を提供するためにここにいます。",
      "about.discoverServices": "サービスを発見する",
      "about.getInTouch": "お問い合わせ",
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
