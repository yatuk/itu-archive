package site

// Rehber sayfalarının metni. Yapı (kart, kutu, şema) guides.go'da; buradaki
// tek iş TR ve EN içeriği yazmak.
//
// Metin kuralları: uzun çizgi yok, "kalın başlık: açıklama" kalıbı yok,
// şişirilmiş sıfat yok, başlıklar cümle düzeninde, emoji yok, düz tırnak.
// Hiçbir yerde somut tarih verilmez; tarih geçen her ifade akademik takvim
// sayfasına bağlanır.

import (
	"fmt"
	"strings"
)

// --- /ders-kaydi-nasil-yapilir/ ---

func (b *Builder) writeRegistrationGuidePage(p landingPage) error {
	if b.l.Code == "en" {
		return b.writeRegistrationGuideEN(p)
	}
	return b.writeRegistrationGuideTR(p)
}

func (b *Builder) writeRegistrationGuideTR(p landingPage) error {
	obs := b.glossaryLink("obs", "ÖBS")
	sis := b.glossaryLink("sis", "SİS")
	bidb := b.glossaryLink("bidb", "BİDB")
	ninova := b.glossaryLink("ninova", "Ninova")
	crn := b.glossaryLink("crn", "CRN")
	cal := b.calendarHref()

	flow := guideFlowSVG(
		[]string{"Şifre", "Ders planı", "Ders programı", "Haftalık plan", "Kayıt", "Kontrol", "İntibak"},
		"Ders kaydının yedi adımı: şifre, ders planı, ders programı, haftalık plan, kayıt, kontrol, intibak",
	)

	dateNote := renderGuideCallouts([]guideCallout{{text: `Bu sayfada tarih yok. Kayıt, ders ekle-bırak ve sınav tarihleri her dönem değişir, güncel tarihler <a href="` + cal + `">akademik takvimde</a> durur.`}})

	systems := renderGuideSystems("Hangi sistem ne işe yarar", []guideSystem{
		{name: bidb, badge: "Adım 1", desc: "Bilgi İşlem Daire Başkanlığı. İTÜ kullanıcı adını ve şifreni burada oluşturursun."},
		{name: obs, badge: "Adım 2-3", desc: "Öğrenci Bilgi Sistemi. Ders planı, dönem programı ve program kodları burada durur."},
		{name: sis, badge: "Adım 5-6", desc: "Öğrenci İşleri portalı. Ders kayıt işleminin kendisi burada yapılır."},
		{name: ninova, badge: "Kayıttan sonra", desc: "Ders yönetim sistemi. Kaydolduğun dersler açıldığında duyuru, materyal ve ödevler buradan gelir."},
	})

	crnFigure := guideFigure(
		guideCRNTable("örnek satır",
			[4]string{"Ders", "Gün ve saat", "Bina", "CRN"},
			[4]string{"BLG 102E", "Salı 13:30-15:29", "MED", "30154"},
			"Kayıt ekranına yazacağın şey bu 5 haneli kod."),
		"Örnek: bir dersin CRN'i. Adım 3'te ders programından not aldığın satır böyle görünür.",
	)

	registerFigure := guideFigure(
		guideRegisterMock("örnek arayüz", "Ders kayıt", "CRN", "30154", "Dersi ekle"),
		"Örnek arayüz, gerçek ekran görüntüsü değil. Adım 5'te CRN'i bu şekilde yazıp eklersin.",
	)

	resultFigure := guideFigure(
		guideStateMock("örnek arayüz", "Kayıt sonucu",
			"BLG 102E programına eklendi.",
			"Kontenjan dolu, ders eklenmedi."),
		"Örnek arayüz. Adım 5'te her CRN için iki sonuçtan biriyle karşılaşırsın.",
	)

	steps := renderGuideSteps([]guideStep{
		{
			title: "Şifreni kur ve girişi önceden dene",
			paras: []string{
				`İTÜ kullanıcı adını ve şifreni ` + bidb + ` üzerinden oluştur. Bu tek hesap ` + obs + `, ` + sis + ` ve ` + ninova + ` dahil bütün dijital işlemlerde geçerlidir.`,
				`Kayıt gününden birkaç gün önce giriş yapabildiğini test et.`,
			},
			callouts: []guideCallout{
				{warn: true, text: "Şifre sıfırlama işini kayıt gününe bırakma. O gün sistemler yoğun olur ve kaybettiğin dakikalar doğrudan kontenjana yansır."},
			},
		},
		{
			title: "Ders planını bul",
			paras: []string{
				`Fakülteni ve bölümünü seçerek ` + obs + `'deki ders planı sayfasını aç. Aynı bölüm için birden fazla plan sürümü görünüyorsa en güncel olanı kullan.`,
				`Bölümünün planına <a href="/bolumler/">fakülte ve program haritasından</a> da ulaşabilirsin.`,
			},
			callouts: []guideCallout{
				{warn: true, text: "1. sınıf 1. yarıyıl öğrencisiysen planının birinci yarıyılındaki derslerin tamamına yazılman gerekir. Bu dönem üst yarıyıldan ders alınmaz."},
			},
		},
		{
			title: "Ders programını oku ve CRN'leri not al",
			paras: []string{
				`Güncel dönemin ders programında her dersin günü, saati ve binası yazar. Her satırda 5 haneli bir ` + crn + ` vardır ve o dersin yalnızca o dönemki belirli şubesini gösterir.`,
				`Dersi alabilen programlar kısmında kendi program kodunun bulunduğunu doğrula. İlk yarıyıl derslerinde genelde önşart aranmaz, sonraki dönemlerde <a href="/#onsart">önşart haritasına</a> bak.`,
			},
			figures: []string{crnFigure},
		},
		{
			title: "Çakışmasız bir haftalık plan kur",
			paras: []string{
				`Seçtiğin şubelerin saatleri üst üste gelmemeli. <a href="/#program">Program aracında</a> şubeleri çizelgeye ekleyip çakışmaları kayıttan önce görebilirsin.`,
				`Art arda gelen iki ders farklı kampüslerdeyse aralarında ulaşım süresi bırak.`,
			},
			callouts: []guideCallout{
				{text: "Her ders için mümkünse 1-2 yedek CRN belirle. Kayıt sırasında karar vermek yerine listeden okumak çok daha hızlıdır."},
			},
		},
		{
			title: "Kayıt anında CRN'leri gir",
			paras: []string{
				`Sana bildirilen saatte ` + sis + `'teki ders kayıt menüsünü aç, not aldığın CRN'leri sırayla yaz ve ekle.`,
			},
			callouts: []guideCallout{
				{text: "Sistem yoğunluk nedeniyle birkaç saniye bekletebilir, bu normaldir. Butona üst üste basmak işlemi hızlandırmaz."},
				{warn: true, text: "Bir şube dolmuşsa ekranda nedeni yazar. Beklemeden yedek CRN'ine geç, dolu şube kayıt saatinde nadiren boşalır."},
			},
			figures: []string{registerFigure, resultFigure},
		},
		{
			title: "Kaydını kontrol et",
			paras: []string{
				`Kayıtlı dersler sayfasını açıp eklediğin her dersin listede göründüğünü doğrula. Ekranda hata görmediysen bile bu kontrolü yap.`,
				`1. sınıf 1. yarıyıl öğrencisiysen planındaki dersleri tek tek karşılaştır, eksik kalan ders varsa <a href="` + cal + `">ders ekle-bırak</a> döneminde tamamla.`,
			},
		},
		{
			title: "Başka kurumdan ders aldıysan intibak sürecini izle",
			paras: []string{
				`Başka bir üniversitede tamamladığın derslerin sayılması ayrı bir süreçtir ve genelde kayıttan sonra sonuçlanır.`,
				`Sonuç açıklanana kadar ilk yarıyıl derslerinin tamamına kayıtlı kal. Muafiyet çıkarsa programını ders ekle-bırak döneminde güncelle, güncel koşulları ` + sis + ` duyurularından takip et.`,
			},
		},
	})

	faq := renderGuideFAQ("Sık sorulan sorular", []guideQA{
		{q: "CRN nedir, nereden bulurum?",
			a: `Course Registration Number'ın kısaltmasıdır. Ders programı sayfasında her şubenin yanında duran 5 haneli koddur, kayıt ekranına girdiğin şey de odur. <a href="/#dersler">Dersler görünümünden</a> ders kodu, ad veya öğretim üyesiyle arayabilirsin.`},
		{q: "İki dersin saati çakışırsa ne olur?",
			a: `Sistem aynı saate gelen iki dersi birlikte kabul etmez. CRN'lerden birini aynı dersin başka bir şubesiyle değiştirmen gerekir, çakışmayı kayıttan önce <a href="/#program">program aracında</a> görebilirsin.`},
		{q: "Kontenjan dolarsa ne yapmalıyım?",
			a: `Önceden belirlediğin yedek CRN'e geç. Ekle-bırak döneminde ders bırakanlar olduğu için yer açılabilir, bir dersin geçmiş dönemlerde ne kadar hızlı dolduğunu <a href="/ders-arsivi/">ders arşivinden</a> görebilirsin.`},
		{q: "Başka bir üniversiteden geldim, derslerim sayılır mı?",
			a: `Bu intibak ve muafiyet sürecine tabidir, ayrı değerlendirilir. Sonuçlanana kadar ilk yarıyıl derslerinin tamamına kayıtlı kal.`},
		{q: "İngilizce seviye dersini kim alır?",
			a: `İngilizce yeterlilik sınavının sonucuna göre yerleştirilen bir seviye dersi vardır. Bu dersin şubesi her dönem ayrı planlanır ve diğer derslerle çakışmayacak şekilde yerleştirilir, o yüzden burada sabit bir CRN veya saat yazmıyoruz. Kendi durumunu ` + sis + ` duyurularından kontrol et.`},
	})

	return b.writeGuideShell(p, p.h1,
		"Şifre kurulumundan kayıt sonrası kontrole kadar İTÜ ders kaydının yedi adımı, örnek ekranlarla.",
		"İlgili araçlar",
		b.guideLaunch(p, "Akademik takvimi aç"),
		flow,
		dateNote,
		systems,
		`<section class="guide-section"><h2>Kayıt adımları</h2>`+steps+`</section>`,
		faq,
	)
}

func (b *Builder) writeRegistrationGuideEN(p landingPage) error {
	obs := b.glossaryLink("obs", "OBS")
	sis := b.glossaryLink("sis", "SIS")
	bidb := b.glossaryLink("bidb", "BIDB")
	ninova := b.glossaryLink("ninova", "Ninova")
	crn := b.glossaryLink("crn", "CRN")
	cal := b.calendarHref()

	flow := guideFlowSVG(
		[]string{"Password", "Course plan", "Schedule", "Weekly plan", "Register", "Verify", "Transfer"},
		"The seven steps of course registration: password, course plan, schedule, weekly plan, register, verify, credit transfer",
	)

	dateNote := renderGuideCallouts([]guideCallout{{text: `This page carries no dates. Registration, add/drop and exam dates change every term, and the current ones live in the <a href="` + cal + `">academic calendar</a>.`}})

	systems := renderGuideSystems("What each system is for", []guideSystem{
		{name: bidb, badge: "Step 1", desc: "The IT department. This is where you create your ITU username and password."},
		{name: obs, badge: "Steps 2-3", desc: "The student information system. Curriculum plans, the term schedule and program codes live here."},
		{name: sis, badge: "Steps 5-6", desc: "The student affairs portal. Registration itself happens here."},
		{name: ninova, badge: "After registration", desc: "The course management platform. Announcements, materials and assignments for your courses arrive here."},
	})

	crnFigure := guideFigure(
		guideCRNTable("example row",
			[4]string{"Course", "Day and time", "Building", "CRN"},
			[4]string{"BLG 102E", "Tuesday 13:30-15:29", "MED", "30154"},
			"This 5-digit code is what you type on the registration screen."),
		"Example: a course's CRN. In step 3 the row you note down looks like this.",
	)

	registerFigure := guideFigure(
		guideRegisterMock("mockup", "Course registration", "CRN", "30154", "Add course"),
		"A mockup, not a real screenshot. In step 5 you enter the CRN like this and add it.",
	)

	resultFigure := guideFigure(
		guideStateMock("mockup", "Registration result",
			"BLG 102E was added to your schedule.",
			"Section is full, the course was not added."),
		"A mockup. In step 5 each CRN ends in one of these two states.",
	)

	steps := renderGuideSteps([]guideStep{
		{
			title: "Set up your password and test the login early",
			paras: []string{
				`Create your ITU username and password through ` + bidb + `. This single account works everywhere, including ` + obs + `, ` + sis + ` and ` + ninova + `.`,
				`Test that you can log in a few days before registration day.`,
			},
			callouts: []guideCallout{
				{warn: true, text: "Do not leave a password reset to registration day. Systems are busy then, and the minutes you lose come straight out of the seats you wanted."},
			},
		},
		{
			title: "Find your curriculum plan",
			paras: []string{
				`Pick your faculty and program to open the course plan page in ` + obs + `. If several plan versions exist for your program, use the most recent one.`,
				`You can also reach your program's plan from the <a href="/en/bolumler/">faculty and program directory</a>.`,
			},
			callouts: []guideCallout{
				{warn: true, text: "As a first-semester freshman you have to register for every course in the first semester of your plan. No higher-semester courses this term."},
			},
		},
		{
			title: "Read the schedule and note the CRNs",
			paras: []string{
				`The current term's schedule lists the day, time and building of every course. Each row carries a 5-digit ` + crn + ` that identifies one specific section for that term only.`,
				`Check that your own program code appears under the programs allowed to take the course. First-semester courses usually have no prerequisites, for later terms see the <a href="/#onsart">prerequisite map</a>.`,
			},
			figures: []string{crnFigure},
		},
		{
			title: "Build a conflict-free weekly plan",
			paras: []string{
				`The sections you pick must not overlap. Add them to the grid in the <a href="/#program">schedule tool</a> and you will see the conflicts before registration.`,
				`If two back-to-back courses sit on different campuses, leave travel time between them.`,
			},
			callouts: []guideCallout{
				{text: "Where you can, pick 1-2 backup CRNs per course. Reading from a list beats deciding while the clock runs."},
			},
		},
		{
			title: "Enter your CRNs during registration",
			paras: []string{
				`At the time assigned to you, open the registration menu in ` + sis + `, then type and add your CRNs one by one.`,
			},
			callouts: []guideCallout{
				{text: "The system may pause a few seconds under load. That is normal, and clicking again does not speed it up."},
				{warn: true, text: "If a section is full the screen says so. Switch to your backup CRN right away instead of waiting, full sections rarely open up during the registration hour."},
			},
			figures: []string{registerFigure, resultFigure},
		},
		{
			title: "Verify your registration",
			paras: []string{
				`Open the registered courses page and confirm that every course you added is listed. Do this even when no error appeared on screen.`,
				`First-semester freshmen should compare the list against the plan course by course, and complete anything missing during <a href="` + cal + `">add/drop</a>.`,
			},
		},
		{
			title: "Follow the credit transfer process if you studied elsewhere",
			paras: []string{
				`Getting credit for courses completed at another university is a separate process and usually concludes after registration.`,
				`Stay registered in all first-semester courses until the result is announced. If an exemption comes through, adjust your schedule during add/drop and follow ` + sis + ` announcements for the current requirements.`,
			},
		},
	})

	faq := renderGuideFAQ("Frequently asked questions", []guideQA{
		{q: "What is a CRN and where do I find it?",
			a: `Short for Course Registration Number. It is the 5-digit code shown next to each section on the schedule, and it is what you type to register. You can search for it in the <a href="/#dersler">courses view</a> by code, name or instructor.`},
		{q: "What happens if two courses overlap?",
			a: `The system will not accept two courses at the same hour. Swap one CRN for another section of the same course, and check the overlap in the <a href="/#program">schedule tool</a> before registration.`},
		{q: "What should I do if a section is full?",
			a: `Switch to the backup CRN you picked earlier. Seats can open during add/drop as people leave courses, and you can see how fast a course filled in past terms in the <a href="/en/ders-arsivi/">course archive</a>.`},
		{q: "I transferred from another university, will my credits count?",
			a: `That goes through the credit transfer and exemption process and is evaluated separately. Stay registered in every first-semester course until it is decided.`},
		{q: "Who takes the English placement course?",
			a: `There is a placement course you are assigned to based on your English proficiency exam result. Its section is scheduled separately each term so that it does not clash with other courses, which is why no fixed CRN or hour is listed here. Check your own case through ` + sis + ` announcements.`},
	})

	return b.writeGuideShell(p, p.h1EN,
		"The seven steps of ITU course registration, from setting up your password to checking the result, with example screens.",
		"Related tools",
		b.guideLaunch(p, "Open the academic calendar"),
		flow,
		dateNote,
		systems,
		`<section class="guide-section"><h2>Registration steps</h2>`+steps+`</section>`,
		faq,
	)
}

// --- /ders-programi-nasil-hazirlanir/ ---

func (b *Builder) writeScheduleGuidePage(p landingPage) error {
	if b.l.Code == "en" {
		return b.writeScheduleGuideEN(p)
	}
	return b.writeScheduleGuideTR(p)
}

func (b *Builder) writeScheduleGuideTR(p landingPage) error {
	crn := b.glossaryLink("crn", "CRN")
	sis := b.glossaryLink("sis", "SİS")

	steps := renderGuideSteps([]guideStep{
		{
			title: "Ders planını bul",
			paras: []string{
				`Bölümünü <a href="/bolumler/">fakülte ve program haritasından</a> seç ya da doğrudan <a href="/#dersplanim">ders planım</a> görünümünü aç. Bu dönem hangi dersleri alman gerektiğini yarıyıl yarıyıl görürsün.`,
			},
		},
		{
			title: "Önşartları kontrol et",
			paras: []string{
				`<a href="/#onsart">Önşart haritasında</a> almak istediğin dersin geriye doğru zorunlu ve alternatif bağlantılarını izle. Önce tamamlaman gereken dersler varsa program burada belli olur.`,
			},
		},
		{
			title: "Şubeleri ve CRN'leri karşılaştır",
			paras: []string{
				`<a href="/#dersler">Dersler görünümünde</a> ders kodu, ad veya öğretim üyesiyle ara. Her şubenin günü, saati, binası, ` + crn + `'i ve kalan kontenjanı listede yan yana durur.`,
				`Bir dersin geçmiş dönemlerde ne kadar hızlı dolduğunu <a href="/ders-arsivi/">ders arşivinden</a> görebilirsin, bu yedek şube seçerken işe yarar.`,
			},
		},
		{
			title: "Çakışmasız programı kur",
			paras: []string{
				`Seçtiğin şubeleri <a href="/#program">program aracına</a> ekle. Aynı saate düşen dersler çizelgede işaretlenir, toplam kredi ve AKTS altta toplanır.`,
				`Alternatif Bul aracı gün, saat aralığı veya öğretim üyesi kısıtlarına uyan başka şube kombinasyonlarını hesaplar. <a href="/ders-programi-olustur/">Program oluşturma sayfasında</a> tüm özellikleri var.`,
			},
			callouts: []guideCallout{
				{warn: true, text: `Çakışmayı kayıt ekranında çözmeye çalışma. ` + sis + ` aynı saatteki iki dersi kabul etmez, çakışan şubeyi çizelgede değiştirmek çok daha hızlıdır.`},
			},
		},
	})

	notes := renderGuideCallouts([]guideCallout{
		{text: "Kampüsler arası ulaşımı hesaba kat. Art arda gelen iki ders farklı kampüslerdeyse aralarında yol için yeterli boşluk bırak, ders programında yalnızca bina kodu yazar."},
		{text: `Her ders için 1-2 yedek CRN belirle. Kayıt sırasında bir şube dolduğunda liste hazırsa saniyeler içinde geçersin.`},
	})

	export := `<section class="guide-section"><h2>Programı dışarı aktar</h2><p class="guide-para">Hazırladığın programı görsel veya .ics takvim dosyası olarak indirebilir, seçtiğin CRN'leri kayıt ekranına kopyalayabilirsin. Kayıt sürecinin tamamı için <a href="/ders-kaydi-nasil-yapilir/">ders kaydı nasıl yapılır</a> sayfasına bak.</p></section>`

	return b.writeGuideShell(p, p.h1,
		"Ders planından çakışmasız haftalık programa giden dört adım, her adımda kullanacağın araca bağlı.",
		"İlgili araçlar",
		b.guideLaunch(p, "Program aracını aç"),
		`<section class="guide-section"><h2>Programı kurma adımları</h2>`+steps+`</section>`,
		`<section class="guide-section"><h2>Programı kurarken atlanan iki şey</h2>`+notes+`</section>`,
		export,
	)
}

func (b *Builder) writeScheduleGuideEN(p landingPage) error {
	crn := b.glossaryLink("crn", "CRN")
	sis := b.glossaryLink("sis", "SIS")

	steps := renderGuideSteps([]guideStep{
		{
			title: "Find your curriculum plan",
			paras: []string{
				`Pick your program from the <a href="/en/bolumler/">faculty and program directory</a>, or open the <a href="/#dersplanim">my plan</a> view directly. You will see which courses this term expects from you, semester by semester.`,
			},
		},
		{
			title: "Check prerequisites",
			paras: []string{
				`Trace the required and alternative links of a course backward in the <a href="/#onsart">prerequisite map</a>. Anything you have to finish first shows up there.`,
			},
		},
		{
			title: "Compare sections and CRNs",
			paras: []string{
				`Search by course code, name or instructor in the <a href="/#dersler">courses view</a>. Each section lists its day, time, building, ` + crn + ` and remaining capacity side by side.`,
				`The <a href="/en/ders-arsivi/">course archive</a> shows how quickly a course filled in past terms, which helps when you pick a backup section.`,
			},
		},
		{
			title: "Build the conflict-free schedule",
			paras: []string{
				`Add your chosen sections to the <a href="/#program">schedule tool</a>. Overlapping hours are flagged on the grid, and total credits and ECTS add up below it.`,
				`Find Alternatives computes other section combinations that fit constraints like day, time range or instructor. The <a href="/en/ders-programi-olustur/">schedule builder page</a> covers every feature.`,
			},
			callouts: []guideCallout{
				{warn: true, text: `Do not try to resolve a conflict on the registration screen. ` + sis + ` will not accept two courses at the same hour, and swapping the section on the grid is far quicker.`},
			},
		},
	})

	notes := renderGuideCallouts([]guideCallout{
		{text: "Account for travel between campuses. If two back-to-back courses sit on different campuses, leave enough of a gap, the schedule only prints the building code."},
		{text: `Pick 1-2 backup CRNs per course. When a section fills during registration, a ready list turns the switch into a few seconds.`},
	})

	export := `<section class="guide-section"><h2>Export your schedule</h2><p class="guide-para">You can download the finished schedule as an image or an .ics calendar file, and copy the selected CRNs for the registration screen. For the registration process itself, see <a href="/en/ders-kaydi-nasil-yapilir/">how course registration works</a>.</p></section>`

	return b.writeGuideShell(p, p.h1EN,
		"Four steps from your curriculum plan to a conflict-free weekly schedule, each tied to the tool you use for it.",
		"Related tools",
		b.guideLaunch(p, "Open the schedule tool"),
		`<section class="guide-section"><h2>Building the schedule</h2>`+steps+`</section>`,
		`<section class="guide-section"><h2>Two things people skip</h2>`+notes+`</section>`,
		export,
	)
}

// --- /terimler-sozlugu/ ---

// glossaryTerm, sözlükteki tek terim. id, rehber sayfalarından
// /terimler-sozlugu/#crn gibi doğrudan bağlanabilmek için sabittir.
type glossaryTerm struct {
	id     string
	term   string
	def    string
	termEN string
	defEN  string
}

var glossaryTerms = []glossaryTerm{
	{
		id: "obs", term: "ÖBS", termEN: "OBS (ÖBS)",
		def:   "Öğrenci Bilgi Sistemi. Ders planı, dönem programı, program kodları ve bina kodları gibi genel bilgiler burada tutulur.",
		defEN: "The student information system. Curriculum plans, the term schedule, program codes and building codes live here.",
	},
	{
		id: "sis", term: "SİS", termEN: "SIS (SİS)",
		def:   "Öğrenci İşleri Daire Başkanlığı'nın portalı. Ders kayıt işlemi burada yapılır.",
		defEN: "The student affairs portal. Course registration itself happens here.",
	},
	{
		id: "ninova", term: "Ninova", termEN: "Ninova",
		def:   "İTÜ'nün ders yönetim sistemi. Duyurular, ders materyalleri ve ödevler bu platformdan paylaşılır.",
		defEN: "ITU's course management platform, used for announcements, course materials and assignments.",
	},
	{
		id: "bidb", term: "BİDB", termEN: "BIDB (BİDB)",
		def:   "Bilgi İşlem Daire Başkanlığı. İTÜ kullanıcı adını ve şifreni burada oluşturursun.",
		defEN: "The IT department. This is where you set up your ITU username and password.",
	},
	{
		id: "crn", term: "CRN", termEN: "CRN",
		def:   "Course Registration Number'ın kısaltması. Bir dönemde açılan belirli bir şubenin gününü, saatini, dersliğini ve kontenjanını tanımlayan 5 haneli koddur.",
		defEN: "Short for Course Registration Number. A 5-digit code identifying one specific section in one term, with its day, time, room and capacity.",
	},
	{
		id: "intibak", term: "İntibak ve muafiyet", termEN: "Credit transfer and exemption",
		def:   "Başka bir kurumda alınmış bir dersin İTÜ'de saydırılması süreci. Ders kaydından ayrı yürür ve genelde kayıttan sonra sonuçlanır.",
		defEN: "The process of counting a course completed at another institution toward your ITU program. It runs separately from registration and usually concludes afterward.",
	},
	{
		id: "program-kodu", term: "Program kodu", termEN: "Program code",
		def:   "Bir bölüm veya programın resmî kısaltması. Ders programındaki dersi alabilen programlar kısıtında kullanılır.",
		defEN: "The official abbreviation of a department or program, used in the eligibility list of a course.",
	},
	{
		id: "bina-kodu", term: "Bina kodu", termEN: "Building code",
		def:   "Dersin yapıldığı binanın kısaltması, örneğin MED, MKB, İNB, MİM.",
		defEN: "The abbreviation of the building a course is held in, for example MED, MKB, INB, MIM.",
	},
}

// writeGlossaryPage, sözlüğü tanım listesi olarak üretir. Her terim kendi
// id'sini taşır, böylece rehber sayfaları /terimler-sozlugu/#crn gibi doğrudan
// terime bağlanabilir.
func (b *Builder) writeGlossaryPage(p landingPage) error {
	en := b.l.Code == "en"
	h1, lead, head, related := p.h1,
		"İTÜ'de ders kaydı ve program hazırlarken sık geçen kısaltmaların kısa açıklamaları.",
		"Terimler", "İlgili araçlar"
	launchAria := "Ders programını ara"
	if en {
		h1, lead, head, related = p.h1EN,
			"Short explanations of the abbreviations you run into while registering for courses at ITU.",
			"Terms", "Related tools"
		launchAria = "Search the course schedule"
	}

	var sb strings.Builder
	sb.WriteString(`<section class="guide-section"><h2>` + head + `</h2><dl class="guide-glossary">`)
	for _, t := range glossaryTerms {
		term, def := t.term, t.def
		if en {
			term, def = t.termEN, t.defEN
		}
		fmt.Fprintf(&sb, `<div class="guide-glossary-item" id="%s"><dt>%s</dt><dd>%s</dd></div>`,
			t.id, term, def)
	}
	sb.WriteString(`</dl></section>`)

	return b.writeGuideShell(p, h1, lead, related, b.guideLaunch(p, launchAria), sb.String())
}
