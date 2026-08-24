const fs = require( 'fs' );
const path = require( 'path' );

const translations = {
	pl_PL: [ 'Udostępnij', 'Kopiuj link', 'E-mail', 'Udostępnij tę stronę', 'Skopiowano!', 'Skopiuj ten link:' ],
	es_ES: [ 'Compartir', 'Copiar enlace', 'Correo electrónico', 'Compartir esta página', '¡Copiado!', 'Copia este enlace:' ],
	de_DE: [ 'Teilen', 'Link kopieren', 'E-Mail', 'Diese Seite teilen', 'Kopiert!', 'Diesen Link kopieren:' ],
	pt_PT: [ 'Partilhar', 'Copiar ligação', 'E-mail', 'Partilhar esta página', 'Copiado!', 'Copiar esta ligação:' ],
	it_IT: [ 'Condividi', 'Copia link', 'E-mail', 'Condividi questa pagina', 'Copiato!', 'Copia questo link:' ],
	fr_FR: [ 'Partager', 'Copier le lien', 'E-mail', 'Partager cette page', 'Copié !', 'Copiez ce lien :' ],
	ru_RU: [ 'Поделиться', 'Копировать ссылку', 'Эл. почта', 'Поделиться этой страницей', 'Скопировано!', 'Скопируйте эту ссылку:' ],
	zh_CN: [ '分享', '复制链接', '电子邮件', '分享此页面', '已复制！', '复制此链接：' ],
	fi: [ 'Jaa', 'Kopioi linkki', 'Sähköposti', 'Jaa tämä sivu', 'Kopioitu!', 'Kopioi tämä linkki:' ],
	ja: [ '共有', 'リンクをコピー', 'メール', 'このページを共有', 'コピーしました！', 'このリンクをコピー：' ],
	ko_KR: [ '공유', '링크 복사', '이메일', '이 페이지 공유', '복사했습니다!', '이 링크를 복사하세요:' ],
	sk_SK: [ 'Zdieľať', 'Kopírovať odkaz', 'E-mail', 'Zdieľať túto stránku', 'Skopírované!', 'Skopírujte tento odkaz:' ],
	sv_SE: [ 'Dela', 'Kopiera länk', 'E-post', 'Dela den här sidan', 'Kopierat!', 'Kopiera den här länken:' ],
	tr_TR: [ 'Paylaş', 'Bağlantıyı kopyala', 'E-posta', 'Bu sayfayı paylaş', 'Kopyalandı!', 'Bu bağlantıyı kopyalayın:' ],
	uk: [ 'Поділитися', 'Копіювати посилання', 'Електронна пошта', 'Поділитися цією сторінкою', 'Скопійовано!', 'Скопіюйте це посилання:' ],
	th: [ 'แชร์', 'คัดลอกลิงก์', 'อีเมล', 'แชร์หน้านี้', 'คัดลอกแล้ว!', 'คัดลอกลิงก์นี้:' ],
	sl_SI: [ 'Deli', 'Kopiraj povezavo', 'E-pošta', 'Deli to stran', 'Kopirano!', 'Kopirajte to povezavo:' ],
	sr_RS: [ 'Подели', 'Копирај везу', 'Е-пошта', 'Подели ову страницу', 'Копирано!', 'Копирајте ову везу:' ],
	ro_RO: [ 'Distribuie', 'Copiază linkul', 'E-mail', 'Distribuie această pagină', 'Copiat!', 'Copiază acest link:' ],
	nl_NL: [ 'Delen', 'Link kopiëren', 'E-mail', 'Deze pagina delen', 'Gekopieerd!', 'Kopieer deze link:' ],
	lt_LT: [ 'Bendrinti', 'Kopijuoti nuorodą', 'El. paštas', 'Bendrinti šį puslapį', 'Nukopijuota!', 'Nukopijuokite šią nuorodą:' ],
	la: [ 'Communica', 'Vinculum exscribe', 'Epistula electronica', 'Hanc paginam communica', 'Exscriptum!', 'Hoc vinculum exscribe:' ],
	hi_IN: [ 'साझा करें', 'लिंक कॉपी करें', 'ईमेल', 'यह पेज साझा करें', 'कॉपी किया गया!', 'यह लिंक कॉपी करें:' ],
	he_IL: [ 'שיתוף', 'העתקת קישור', 'אימייל', 'שיתוף העמוד הזה', 'הועתק!', 'העתקת הקישור הזה:' ],
	el: [ 'Κοινοποίηση', 'Αντιγραφή συνδέσμου', 'Email', 'Κοινοποίηση αυτής της σελίδας', 'Αντιγράφηκε!', 'Αντιγράψτε αυτόν τον σύνδεσμο:' ],
	ka_GE: [ 'გაზიარება', 'ბმულის კოპირება', 'ელფოსტა', 'ამ გვერდის გაზიარება', 'კოპირებულია!', 'დააკოპირეთ ეს ბმული:' ],
	et: [ 'Jaga', 'Kopeeri link', 'E-post', 'Jaga seda lehte', 'Kopeeritud!', 'Kopeeri see link:' ],
	ar: [ 'مشاركة', 'نسخ الرابط', 'البريد الإلكتروني', 'مشاركة هذه الصفحة', 'تم النسخ!', 'انسخ هذا الرابط:' ],
	sq: [ 'Shpërndaje', 'Kopjo lidhjen', 'Email', 'Shpërndaje këtë faqe', 'U kopjua!', 'Kopjo këtë lidhje:' ],
	da_DK: [ 'Del', 'Kopiér link', 'E-mail', 'Del denne side', 'Kopieret!', 'Kopiér dette link:' ],
	cs_CZ: [ 'Sdílet', 'Kopírovat odkaz', 'E-mail', 'Sdílet tuto stránku', 'Zkopírováno!', 'Zkopírujte tento odkaz:' ],
};

const messages = [ 'Share', 'Copy Link', 'Email', 'Share this page', 'Copied!', 'Copy this link:' ];
const escapePo = ( value ) => value.replace( /\\/g, '\\\\' ).replace( /"/g, '\\"' );
const directory = path.resolve( __dirname, '..', 'languages' );

for ( const [ locale, values ] of Object.entries( translations ) ) {
	const header = [
		'msgid ""',
		'msgstr ""',
		'"Project-Id-Version: Lightweight Share Buttons 1.0.0\\n"',
		`"Language: ${ locale }\\n"`,
		'"MIME-Version: 1.0\\n"',
		'"Content-Type: text/plain; charset=UTF-8\\n"',
		'"Content-Transfer-Encoding: 8bit\\n"',
		'',
	];
	const entries = messages.flatMap( ( message, index ) => [
		`msgid "${ escapePo( message ) }"`,
		`msgstr "${ escapePo( values[ index ] ) }"`,
		'',
	] );
	fs.writeFileSync(
		path.join( directory, `lightweight-share-buttons-${ locale }.po` ),
		[ ...header, ...entries ].join( '\n' ),
		'utf8'
	);
}
