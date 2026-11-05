// Each question has a Dutch prompt, its Persian translation, a model reply,
// a Persian translation of that reply, and optional accepted alternatives.
const lessons = [
  {
    title: 'در کافه', place: 'In het café', icon: 'coffee',
    questions: [
      ['Wat wil je drinken?', 'چی می‌خواهی بنوشی؟', 'Ik wil graag een koffie.', 'لطفاً یک قهوه می‌خواهم.', 'ik wil koffie|koffie graag|een koffie graag|een koffie|ik wil graag thee|thee graag|een thee graag|ik wil thee|ik wil graag water|water graag|koffie|thee|water|ik wil graag een thee'],
      ['Wil je melk in je koffie?', 'در قهوه‌ات شیر می‌خواهی؟', 'Ja, graag.', 'بله، لطفاً.', 'ja|ja graag met melk|graag|nee bedankt|nee dank je|nee|zonder melk|ja graag melk'],
      ['Wil je er iets bij eten?', 'چیزی هم کنارش می‌خواهی بخوری؟', 'Ja, graag een stuk taart.', 'بله، لطفاً یک تکه کیک.', 'een stuk taart graag|een stuk taart|taart graag|ja graag|nee bedankt|nee dank je|nee|een koekje graag|een croissant graag'],
      ['Is het voor hier of om mee te nemen?', 'همین‌جا می‌خوری یا می‌بری؟', 'Voor hier, graag.', 'برای همین‌جا، لطفاً.', 'voor hier|hier|om mee te nemen|om mee te nemen graag|meenemen graag'],
      ['Wil je pinnen of contant betalen?', 'می‌خواهی با کارت پرداخت کنی یا نقدی؟', 'Ik wil graag pinnen.', 'می‌خواهم با کارت پرداخت کنم.', 'pinnen|pinnen graag|ik wil pinnen|met pin graag|met de pin|contant|contant graag|ik betaal contant|ik wil contant betalen|ik wil graag contant betalen'],
    ],
  },
  {
    title: 'آشنایی و معرفی', place: 'Kennismaken', icon: 'hello',
    questions: [
      ['Hallo! Hoe heet je?', 'سلام! اسمت چیه؟', 'Ik heet Reza.', 'اسم من رضاست.', 'ik ben *|ik heet *|mijn naam is *|reza'],
      ['Waar kom je vandaan?', 'اهل کجایی؟', 'Ik kom uit Iran.', 'من اهل ایرانم.', 'ik kom uit *|ik ben geboren in *|uit *|iran'],
      ['Waar woon je?', 'کجا زندگی می‌کنی؟', 'Ik woon in Amsterdam.', 'من در آمستردام زندگی می‌کنم.', 'ik woon in *|in *|amsterdam'],
      ['Welke taal spreek je?', 'به چه زبانی حرف می‌زنی؟', 'Ik spreek Perzisch.', 'من فارسی حرف می‌زنم.', 'ik spreek *|perzisch|farsi'],
      ['Hoe gaat het met je?', 'حالت چطوره؟', 'Goed, dank je.', 'خوبم، ممنون.', 'goed|het gaat goed|prima|prima dank je|gaat wel|niet zo goed|het gaat niet zo goed|heel goed|goed bedankt|met mij gaat het goed'],
    ],
  },
  {
    title: 'در سوپرمارکت', place: 'In de supermarkt', icon: 'shop',
    questions: [
      ['Kan ik je helpen?', 'می‌توانم کمکت کنم؟', 'Ja, waar ligt het brood?', 'بله، نان کجاست؟', 'waar ligt het brood|waar is het brood|ik zoek brood|ja graag|nee bedankt'],
      ['Hoeveel appels wil je?', 'چند تا سیب می‌خواهی؟', 'Ik wil drie appels.', 'سه تا سیب می‌خواهم.', 'drie|drie appels|ik wil * appels|* appels'],
      ['Welke melk wil je?', 'کدام شیر را می‌خواهی؟', 'Ik wil volle melk.', 'شیر پرچرب می‌خواهم.', 'volle melk|halfvolle melk|magere melk|ik wil halfvolle melk|ik wil magere melk'],
      ['Wil je een tasje?', 'کیسه می‌خواهی؟', 'Nee, dank je.', 'نه، ممنون.', 'nee|nee bedankt|ja graag|ja|ja graag een tasje'],
      ['Heb je een klantenkaart?', 'کارت مشتری داری؟', 'Nee, ik heb geen klantenkaart.', 'نه، کارت مشتری ندارم.', 'nee|ja|ja die heb ik|ja ik heb een klantenkaart|nee die heb ik niet'],
    ],
  },
  {
    title: 'پرسیدن مسیر', place: 'De weg vragen', icon: 'map',
    questions: [
      ['Waar wil je naartoe?', 'کجا می‌خواهی بروی؟', 'Ik wil naar het station.', 'می‌خواهم به ایستگاه بروم.', 'naar het station|ik wil naar *|naar *'],
      ['Zoek je het centrum?', 'دنبال مرکز شهر می‌گردی؟', 'Ja, waar is het centrum?', 'بله، مرکز شهر کجاست؟', 'ja|ja ik zoek het centrum|waar is het centrum|nee ik zoek het station|nee'],
      ['Ga je te voet of met de fiets?', 'پیاده می‌روی یا با دوچرخه؟', 'Ik ga met de fiets.', 'با دوچرخه می‌روم.', 'met de fiets|ik ga fietsen|ik fiets|ik ga te voet|te voet|ik ga lopen|ik loop'],
      ['Wil je dat ik het op de kaart laat zien?', 'می‌خواهی روی نقشه نشانت بدهم؟', 'Ja, graag.', 'بله، لطفاً.', 'ja|graag|nee|nee bedankt|nee dank je'],
      ['Snap je de route?', 'مسیر را فهمیدی؟', 'Ja, ik ga eerst rechtdoor.', 'بله، اول مستقیم می‌روم.', 'ja|ja ik snap het|eerst rechtdoor|ja bedankt|nee kun je het herhalen|nee'],
    ],
  },
  {
    title: 'در ایستگاه قطار', place: 'Op het station', icon: 'train',
    questions: [
      ['Waar gaat je reis naartoe?', 'مقصد سفرت کجاست؟', 'Ik ga naar Utrecht.', 'به اوترخت می‌روم.', 'naar utrecht|utrecht|ik ga naar *|naar *'],
      ['Wil je een enkele reis of een retour?', 'بلیط یک‌طرفه می‌خواهی یا رفت‌وبرگشت؟', 'Een enkele reis, graag.', 'لطفاً یک بلیط یک‌طرفه.', 'een enkele reis|enkele reis|een retour graag|een retour|retour graag|retour'],
      ['Hoe laat wil je vertrekken?', 'ساعت چند می‌خواهی حرکت کنی؟', 'Ik wil om tien uur vertrekken.', 'می‌خواهم ساعت ده حرکت کنم.', 'om tien uur|tien uur|om * uur|ik wil om * vertrekken|nu|zo snel mogelijk'],
      ['Reis je alleen?', 'تنهایی سفر می‌کنی؟', 'Ja, ik reis alleen.', 'بله، تنهایی سفر می‌کنم.', 'ja|ik reis alleen|nee|nee met een vriend|nee met een vriendin|nee ik reis met *'],
      ['Wil je weten van welk spoor de trein vertrekt?', 'می‌خواهی بدانی قطار از کدام سکو حرکت می‌کند؟', 'Ja, van welk spoor vertrekt de trein?', 'بله، قطار از کدام سکو حرکت می‌کند؟', 'ja|ja graag|van welk spoor vertrekt de trein|welk spoor|nee bedankt'],
    ],
  },
  {
    title: 'سفارش در رستوران', place: 'In het restaurant', icon: 'coffee',
    questions: [
      ['Voor hoeveel personen?', 'برای چند نفر؟', 'Voor twee personen, graag.', 'برای دو نفر، لطفاً.', 'voor twee personen|twee|twee personen|voor één persoon|voor een persoon|voor * personen'],
      ['Wil je de menukaart?', 'منو را می‌خواهی؟', 'Ja, graag.', 'بله، لطفاً.', 'ja|graag|ja de menukaart graag|nee bedankt'],
      ['Wat wil je eten?', 'چه چیزی می‌خواهی بخوری؟', 'Ik wil graag de soep.', 'لطفاً سوپ می‌خواهم.', 'de soep graag|soep graag|ik wil soep|ik wil graag *|mag ik *'],
      ['Wil je nog iets drinken?', 'چیز دیگری برای نوشیدن می‌خواهی؟', 'Nee, dank je.', 'نه، ممنون.', 'nee|nee bedankt|ja graag|water graag|een glas water graag|ja een glas water graag'],
      ['Wil je de rekening?', 'صورت‌حساب را می‌خواهی؟', 'Ja, mag ik de rekening?', 'بله، می‌شود صورت‌حساب را بدهید؟', 'ja|ja graag|de rekening graag|mag ik de rekening|nee bedankt'],
    ],
  },
  {
    title: 'وقت گرفتن', place: 'Een afspraak maken', icon: 'calendar',
    questions: [
      ['Waarvoor bel je?', 'برای چه چیزی تماس گرفته‌ای؟', 'Ik wil een afspraak maken.', 'می‌خواهم یک وقت بگیرم.', 'voor een afspraak|ik wil graag een afspraak maken|ik bel voor een afspraak'],
      ['Kan je maandag?', 'دوشنبه می‌توانی؟', 'Ja, maandag kan ik.', 'بله، دوشنبه می‌توانم.', 'ja|ja dat kan|maandag kan ik|nee|nee maandag kan ik niet'],
      ['Kom je liever om tien uur of om elf uur?', 'ترجیح می‌دهی ساعت ده بیایی یا یازده؟', 'Om tien uur, graag.', 'ساعت ده، لطفاً.', 'om tien uur|tien uur|om elf uur|elf uur|om elf uur graag'],
      ['Hoe spel je je voornaam?', 'اسم کوچکت را چطور هجی می‌کنی؟', 'R E Z A.', 'ر، اِ، زِد، آ. حروف اسم رضا.', 'reza|mijn voornaam is reza'],
      ['Klopt de afspraak op maandag om tien uur?', 'وقت ملاقات دوشنبه ساعت ده درست است؟', 'Ja, dat klopt.', 'بله، درست است.', 'ja|dat klopt|ja tot maandag|tot maandag|ja bedankt|nee om elf uur'],
    ],
  },
  {
    title: 'در کلاس هلندی', place: 'In de Nederlandse les', icon: 'book',
    questions: [
      ['Begrijp je de vraag?', 'سؤال را می‌فهمی؟', 'Ja, ik begrijp de vraag.', 'بله، سؤال را می‌فهمم.', 'ja|ja ik begrijp het|nee|nee ik begrijp het niet'],
      ['Zal ik het herhalen?', 'تکرارش کنم؟', 'Ja, kun je het herhalen?', 'بله، می‌شود تکرارش کنی؟', 'ja|ja graag|kun je het herhalen|kunt u het herhalen|nee bedankt'],
      ['Spreek ik te snel?', 'خیلی تند حرف می‌زنم؟', 'Ja, kun je langzamer praten?', 'بله، می‌شود آهسته‌تر حرف بزنی؟', 'ja|ja graag wat langzamer|kun je langzamer praten|wat langzamer graag|nee'],
      ['Heb je een pen?', 'خودکار داری؟', 'Ja, ik heb een pen.', 'بله، خودکار دارم.', 'ja|ja die heb ik|nee|nee ik heb geen pen'],
      ['Wat leer je vandaag?', 'امروز چه چیزی یاد می‌گیری؟', 'Ik leer Nederlands.', 'هلندی یاد می‌گیرم.', 'nederlands|ik leer nieuwe woorden|nieuwe woorden|ik leer *'],
    ],
  },
  {
    title: 'خرید لباس', place: 'Kleren kopen', icon: 'shop',
    questions: [
      ['Wat zoek je?', 'دنبال چه می‌گردی؟', 'Ik zoek een jas.', 'دنبال یک کاپشن می‌گردم.', 'een jas|ik zoek *|ik wil graag *'],
      ['Welke kleur wil je?', 'چه رنگی می‌خواهی؟', 'Ik wil graag een blauwe jas.', 'یک کاپشن آبی می‌خواهم.', 'blauw|een blauwe jas|blauw graag|zwart|een zwarte jas|groen|ik wil graag *'],
      ['Welke maat heb je?', 'سایزت چیست؟', 'Ik heb maat M.', 'سایزم M است.', 'maat m|m|medium|maat *|ik heb maat *'],
      ['Wil je de jas passen?', 'می‌خواهی کاپشن را پرو کنی؟', 'Ja, waar is de paskamer?', 'بله، اتاق پرو کجاست؟', 'ja|ja graag|waar is de paskamer|nee bedankt'],
      ['Past de jas goed?', 'کاپشن اندازه است؟', 'Ja, hij past goed.', 'بله، اندازه است.', 'ja|hij past goed|nee|hij is te groot|hij is te klein|nee hij is te groot|nee hij is te klein'],
    ],
  },
  {
    title: 'در بازار', place: 'Op de markt', icon: 'shop',
    questions: [
      ['Wat mag het zijn?', 'چی میل داری؟', 'Een kilo tomaten, graag.', 'لطفاً یک کیلو گوجه‌فرنگی.', 'een kilo tomaten|ik wil graag een kilo tomaten|tomaten graag|een kilo appels graag'],
      ['Wil je ook komkommers?', 'خیار هم می‌خواهی؟', 'Ja, twee komkommers, graag.', 'بله، لطفاً دو تا خیار.', 'ja|twee komkommers|twee komkommers graag|ja graag|nee bedankt|nee'],
      ['Wil je een hele of een halve kilo kaas?', 'یک کیلو پنیر می‌خواهی یا نیم کیلو؟', 'Een halve kilo kaas, graag.', 'لطفاً نیم کیلو پنیر.', 'een halve kilo kaas|een halve kilo|een hele kilo|een hele kilo kaas|een kilo kaas graag'],
      ['Mag het iets meer zijn?', 'اشکالی ندارد کمی بیشتر باشد؟', 'Ja, dat is goed.', 'بله، اشکالی ندارد.', 'ja|dat is goed|prima|nee|nee liever niet'],
      ['Anders nog iets?', 'چیز دیگری هم می‌خواهی؟', 'Nee, dat is alles.', 'نه، همین است.', 'nee|nee bedankt|dat is alles|nee dank je|nee dat was het'],
    ],
  },
  {
    title: 'صحبت دربارهٔ هوا', place: 'Over het weer', icon: 'sun',
    questions: [
      ['Hoe is het weer vandaag?', 'امروز هوا چطور است؟', 'Het is zonnig.', 'هوا آفتابی است.', 'het regent|het is bewolkt|het is koud|het is warm|het waait|zonnig|bewolkt'],
      ['Vind je het koud?', 'به نظرت هوا سرد است؟', 'Ja, het is een beetje koud.', 'بله، کمی سرد است.', 'ja|een beetje|ja het is koud|nee|nee het is warm|nee niet echt'],
      ['Heb je een paraplu bij je?', 'چتر همراهت هست؟', 'Ja, ik heb een paraplu bij me.', 'بله، چتر همراهم هست.', 'ja|ja ik heb een paraplu|nee|nee ik heb geen paraplu'],
      ['Ga je naar buiten als het regent?', 'وقتی باران می‌بارد، بیرون می‌روی؟', 'Nee, ik blijf thuis.', 'نه، خانه می‌مانم.', 'nee|ik blijf thuis|ja|ja ik ga naar buiten'],
      ['Welk seizoen vind je het leukst?', 'کدام فصل را بیشتر دوست داری؟', 'Ik vind de lente het leukst.', 'بهار را بیشتر دوست دارم.', 'de lente|de zomer|de herfst|de winter|ik vind de zomer het leukst|ik vind de herfst het leukst|ik vind de winter het leukst|ik hou van de lente'],
    ],
  },
  {
    title: 'روزمرگی و ساعت', place: 'Mijn dag', icon: 'calendar',
    questions: [
      ['Hoe laat sta je op?', 'ساعت چند از خواب بلند می‌شوی؟', 'Ik sta om zeven uur op.', 'ساعت هفت بلند می‌شوم.', 'om zeven uur|om * uur|ik sta om * op|om half acht'],
      ['Wat eet je als ontbijt?', 'صبحانه چی می‌خوری؟', 'Ik eet brood.', 'نان می‌خورم.', 'brood|ik eet *|ik ontbijt niet|yoghurt'],
      ['Hoe ga je naar je werk?', 'چطور به محل کار می‌روی؟', 'Ik ga met de fiets.', 'با دوچرخه می‌روم.', 'met de fiets|ik fiets|met de bus|met de trein|ik ga met *|ik ga te voet|ik loop'],
      ['Wanneer eet je avondeten?', 'چه وقت شام می‌خوری؟', 'Ik eet om zes uur.', 'ساعت شش شام می‌خورم.', 'om zes uur|om * uur|ik eet om *|om half zeven'],
      ['Wat doe je ’s avonds?', 'عصرها یا شب‌ها چه کار می‌کنی؟', 'Ik kijk televisie.', 'تلویزیون نگاه می‌کنم.', 'ik kijk tv|ik kijk *|ik lees *|ik luister naar *|ik ga wandelen|ik sport'],
    ],
  },
  {
    title: 'در ادارهٔ شهرداری', place: 'Bij de gemeente', icon: 'map',
    questions: [
      ['Goedemorgen, heb je een afspraak?', 'صبح بخیر، وقت ملاقات داری؟', 'Ja, ik heb een afspraak.', 'بله، وقت ملاقات دارم.', 'ja|ja om tien uur|nee|nee ik heb geen afspraak'],
      ['Wat is je achternaam?', 'نام خانوادگی‌ات چیست؟', 'Mijn achternaam is De Vries.', 'نام خانوادگی من دِ فریس است.', 'mijn achternaam is *|de vries|ik heet *'],
      ['Heb je je identiteitsbewijs bij je?', 'مدرک شناسایی‌ات همراهت هست؟', 'Ja, hier is mijn identiteitsbewijs.', 'بله، بفرمایید این مدرک شناسایی من است.', 'ja|ja alstublieft|hier is mijn identiteitsbewijs|nee|nee die heb ik niet bij me'],
      ['Wat is je postcode?', 'کد پستی‌ات چیست؟', 'Mijn postcode is 1012 AB.', 'کد پستی من ۱۰۱۲ AB است. این کد نمونه است.', 'mijn postcode is *|1012 ab|duizend twaalf ab|tien twaalf ab'],
      ['Wil je hier even wachten?', 'می‌شود کمی اینجا منتظر بمانی؟', 'Ja, natuurlijk.', 'بله، حتماً.', 'ja|natuurlijk|oké|ja hoor|prima|dat is goed'],
    ],
  },
  {
    title: 'قرار با یک دوست', place: 'Met een vriend afspreken', icon: 'hello',
    questions: [
      ['Heb je zaterdag tijd?', 'شنبه وقت داری؟', 'Ja, zaterdag heb ik tijd.', 'بله، شنبه وقت دارم.', 'ja|ja ik heb tijd|zaterdag kan ik|nee|nee zaterdag kan ik niet'],
      ['Wat zullen we doen?', 'چه کار کنیم؟', 'Laten we koffie drinken.', 'بیا قهوه بخوریم.', 'koffie drinken|zullen we koffie drinken|laten we *|we kunnen *'],
      ['Waar spreken we af?', 'کجا قرار بگذاریم؟', 'Bij het station, graag.', 'کنار ایستگاه، لطفاً.', 'bij het station|bij *|in het centrum|in *|op *'],
      ['Is twee uur goed voor jou?', 'ساعت دو برایت خوب است؟', 'Ja, twee uur is goed.', 'بله، ساعت دو خوب است.', 'ja|ja dat is goed|prima|ja om twee uur|nee liever om drie uur'],
      ['Zie ik je dan zaterdag?', 'پس شنبه می‌بینمت؟', 'Ja, tot zaterdag!', 'بله، تا شنبه!', 'ja|tot zaterdag|tot dan|ja tot dan|ja tot ziens'],
    ],
  },
];
