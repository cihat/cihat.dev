import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Container from "@/components/ui/container"
import { P } from "app/(post)/components/p"
import { H1 } from "app/(post)/components/h1"
import { H2 } from "app/(post)/components/h2"
import { LI } from "app/(post)/components/li"
import { OL } from "app/(post)/components/ol"

export default function PrivacyPolicyLayout() {
  return (
    <Container size="large" className="flex flex-col justify-center items-center w-full">
      <Tabs defaultValue="privacy-policy" className="w-[100%] flex flex-col justify-center items-center">
        <TabsList>
          <TabsTrigger value="privacy-policy">Gizlilik Politikası</TabsTrigger>
          <TabsTrigger value="terms-of-use">Kullanim Kosullari</TabsTrigger>
          <TabsTrigger value="cookie-policy">Cerez Politikasi</TabsTrigger>
        </TabsList>
        <TabsContent value="privacy-policy"><H1>Gizlilik Politikası</H1>
          <P>Son güncellenme: 22/07/2023</P>
          <P>
            Güvenliğiniz bizim için önemli. Bu sebeple bizimle paylaşacağınız kişisel verileriz hassasiyetle korunmaktadır.
          </P>
          <P>
            Biz, Cedenes, veri sorumlusu olarak, bu gizlilik ve kişisel verilerin korunması politikası ile,
            hangi kişisel verilerinizin hangi amaçla işleneceği, işlenen verilerin kimlerle ve neden paylaşılabileceği,
            veri işleme yöntemimiz ve hukuki sebeplerimiz ile; işlenen verilerinize ilişkin haklarınızın neler olduğu
            hususunda sizleri aydınlatmayı amaçlıyoruz.
          </P>
          <H2>Toplanan Kişisel Verileriniz, Toplanma Yöntemi ve Hukuki Sebebi</H2>
          <P>
            IP adresiniz ve kullanıcı aracısı bilgileriniz, sadece analiz yapmak amacıyla ve çerezler (cookies) vb.
            teknolojiler vasıtasıyla, otomatik veya otomatik olmayan yöntemlerle ve bazen de analitik sağlayıcılar,
            reklam ağları, arama bilgi sağlayıcıları, teknoloji sağlayıcıları gibi üçüncü taraflardan elde edilerek,
            kaydedilerek, depolanarak ve güncellenerek, aramızdaki hizmet ve sözleşme ilişkisi çerçevesinde ve süresince,
            meşru menfaat işleme şartına dayanılarak işlenecektir.
          </P>
          <H2>Kişisel Verilerinizin İşlenme Amacı</H2>
          <P>
            Bizimle paylaştığınız kişisel verileriniz sadece analiz yapmak suretiyle; sunduğumuz hizmetlerin
            gerekliliklerini en iyi şekilde yerine getirebilmek, bu hizmetlere sizin tarafınızdan ulaşılabilmesini
            ve maksimum düzeyde faydalanılabilmesini sağlamak, hizmetlerimizi, ihtiyaçlarınız doğrultusunda
            geliştirebilmek ve sizleri daha geniş kapsamlı hizmet sağlayıcıları ile yasal çerçeveler içerisinde
            buluşturabilmek ve kanundan doğan zorunlulukların (kişisel verilerin talep halinde adli ve idari makamlarla paylaşılması)
            yerine getirilebilmesi amacıyla, sözleşme ve hizmet süresince, amacına uygun ve ölçülü bir şekilde
            işlenecek ve güncellenecektir.
          </P>
          <H2>Toplanan Kişisel Verilerin Kimlere ve Hangi Amaçlarla Aktarılabileceği</H2>
          <P>
            Bizimle paylaştığınız kişisel verileriniz; faaliyetlerimizi yürütmek üzere hizmet aldığımız ve/veya
            verdiğimiz, sözleşmesel ilişki içerisinde bulunduğumuz, iş birliği yaptığımız, yurt içi ve yurt dışındaki
            3. şahıslar ile kurum ve kuruluşlara ve talep halinde adli ve idari makamlara, gerekli teknik ve idari
            önlemler alınması koşulu ile aktarılabilecektir.
          </P>
          <H2>Kişisel Verileri İşlenen Kişi Olarak Haklarınız</H2>
          <P>KVKK madde 11 uyarınca herkes, veri sorumlusuna başvurarak aşağıdaki haklarını kullanabilir:</P>
          <OL type="a">
            <LI>Kişisel veri işlenip işlenmediğini öğrenme,</LI>
            <LI>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</LI>
            <LI>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</LI>
            <LI>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</LI>
            <LI>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</LI>
            <LI>Kişisel verilerin silinmesini veya yok edilmesini isteme,</LI>
            <LI>(e) ve (f) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</LI>
            <LI>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</LI>
            <LI>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme, haklarına sahiptir.</LI>
          </OL>
          <P>Yukarıda sayılan haklarınızı kullanmak üzere cihatsalik1@gmail.com üzerinden bizimle iletişime geçebilirsiniz.</P>
          <H2>İletişim</H2>
          <P>
            Sizlere hizmet sunabilmek amaçlı analizler yapabilmek için, sadece gerekli olan kişisel verilerinizin,
            işbu gizlilik ve kişisel verilerin işlenmesi politikası uyarınca işlenmesini, kabul edip etmemek hususunda
            tamamen özgürsünüz. Siteyi kullanmaya devam ettiğiniz takdirde kabul etmiş olduğunuz tarafımızca
            varsayılacak olup, daha ayrıntılı bilgi için bizimle cihatsalik1@gmail.com e-mail adresi üzerinden iletişime
            geçmekten lütfen çekinmeyiniz.
          </P>
        </TabsContent>
        <TabsContent value="terms-of-use"><H1>Kullanım Koşulları</H1>
          <P>Son güncellenme: 22/07/2023</P>
          <P>
            Sevgili ziyaretçimiz, lütfen cihat.dev web sitemizi ziyaret etmeden önce işbu
            kullanım koşulları sözleşmesini dikkatlice okuyunuz. Siteye erişiminiz
            tamamen bu sözleşmeyi kabulünüze ve bu sözleşme ile belirlenen
            şartlara uymanıza bağlıdır. Şayet bu sözleşmede yazan herhangi
            bir koşulu kabul etmiyorsanız, lütfen siteye erişiminizi sonlandırınız.
            Siteye erişiminizi sürdürdüğünüz takdirde, koşulsuz ve kısıtlamasız olarak,
            işbu sözleşme metninin tamamını kabul ettiğinizin, tarafımızca varsayılacağını
            lütfen unutmayınız.
          </P>
          <P>
            cihat.dev web sitesi Cedenes tarafından yönetilmekte olup, bundan sonra SİTE olarak anılacaktır.
            İşbu siteye ilişkin Kullanım Koşulları, yayınlanmakla yürürlüğe girer.
            Değişiklik yapma hakkı, tek taraflı olarak SİTE'ye aittir ve
            SİTE üzerinden güncel olarak paylaşılacak olan bu değişiklikleri,
            tüm kullanıcılarımız baştan kabul etmiş sayılır.
          </P>
          <H2>Gizlilik</H2>
          <P>
            Gizlilik, ayrı bir sayfada, kişisel verilerinizin tarafımızca
            işlenmesinin esaslarını düzenlemek üzere mevcuttur. SİTE'yi kullandığınız takdirde,
            bu verilerin işlenmesinin gizlilik politikasına uygun olarak gerçekleştiğini
            kabul edersiniz.
          </P>
          <H2>Hizmet Kapsamı</H2>
          <P>
            Cedenes olarak, sunacağımız hizmetlerin kapsamını ve niteliğini, yasalar
            çerçevesinde belirlemekte tamamen serbest olup; hizmetlere ilişkin yapacağımız
            değişiklikler, SİTE'de yayınlanmakla yürürlüğe girmiş sayılacaktır.
          </P>
          <H2>Telif Hakları</H2>
          <P>
            SİTE'de yayınlanan tüm metin, kod, grafikler, logolar, resimler, ses dosyaları ve kullanılan yazılımın sahibi (bundan böyle ve daha sonra "içerik" olarak anılacaktır) Cedenes olup, tüm hakları saklıdır. Yazılı izin olmaksızın site içeriğinin çoğaltılması veya kopyalanması kesinlikle yasaktır.
          </P>
          <H2>Genel Hükümler</H2>
          <ul>
            <LI>
              Kullanıcıların tamamı, SİTE'yi yalnızca hukuka uygun ve şahsi
              amaçlarla kullanacaklarını ve üçüncü kişinin haklarına tecavüz
              teşkil edecek nitelikteki herhangi bir faaliyette bulunmayacağını
              taahhüt eder. SİTE dâhilinde yaptıkları işlem ve eylemlerindeki,
              hukuki ve cezai sorumlulukları kendilerine aittir. İşbu iş ve
              eylemler sebebiyle, üçüncü kişilerin uğradıkları veya uğrayabilecekleri
              zararlardan dolayı SİTE'nin doğrudan ve/veya dolaylı hiçbir sorumluluğu yoktur.
            </LI>
            <LI>
              SİTE'de mevcut bilgilerin doğruluk ve güncelliğini sağlamak için
              elimizden geleni yapmaktayız. Lakin gösterdiğimiz çabaya rağmen,
              bu bilgiler, fiili değişikliklerin gerisinde kalabilir, birtakım
              farklılıklar olabilir. Bu sebeple, site içerisinde yer alan bilgilerin
              doğruluğu ve güncelliği ile ilgili tarafımızca, açık veya zımni, herhangi
              bir garanti verilmemekte, hiçbir taahhütte bulunulmamaktadır.
            </LI>
            <LI>
              SİTE'de üçüncü şahıslar tarafından işletilen ve içerikleri tarafımızca
              bilinmeyen diğer web sitelerine, uygulamalara ve platformlara köprüler
              (hyperlink) bulunabilir. SİTE, işlevsellik yalnızca bu sitelere ulaşımı
              sağlamakta olup, içerikleri ile ilgili hiçbir sorumluluk kabul etmemekteyiz.
            </LI>
            <LI>
              SİTE'yi virüslerden temizlenmiş tutmak konusunda elimizden geleni
              yapsak da, virüslerin tamamen bulunmadığı garantisini vermemekteyiz.
              Bu nedenle veri indirirken, virüslere karşı gerekli önlemi almak, kullanıcıların
              sorumluluğundadır. Virüs vb. kötü amaçlı programlar, kodlar veya materyallerin
              sebep olabileceği zararlardan dolayı sorumluluk kabul etmemekteyiz.
            </LI>
            <LI>
              SİTE'de sunulan hizmetlerde, kusur veya hata olmayacağına ya da
              kesintisiz hizmet verileceğine dair garanti vermemekteyiz. SİTE'ye ve
              sitenin hizmetlerine veya herhangi bir bölümüne olan erişiminizi önceden
              bildirmeksizin herhangi bir zamanda sonlandırabiliriz.
            </LI>
          </ul>
          <H2>Sorumluluğun Sınırlandırılması</H2>
          <P>
            SİTE'nin kullanımından doğan zararlara ilişkin sorumluluğumuz, kast ve ağır ihmal ile sınırlıdır.
            Sözleşmenin ihlalinden doğan zararlarda, talep edilebilecek toplam tazminat,
            öngörülebilir hasarlar ile sınırlıdır. Yukarıda bahsedilen sorumluluk sınırlamaları
            aynı zamanda insan hayatına, bedeni yaralanmaya veya bir kişinin sağlığına gelebilecek
            zararlar durumunda geçerli değildir. Hukuken mücbir sebep sayılan tüm durumlarda,
            gecikme, ifa etmeme veya temerrütten dolayı, herhangi bir tazminat yükümlülüğümüz
            doğmayacaktır.
          </P>
          <P>
            Uyuşmazlık Çözümü: İşbu Sözleşme'nin uygulanmasından veya yorumlanmasından
            doğacak her türlü uyuşmazlığın çözümünde, Türkiye Cumhuriyeti yasaları uygulanır;
            Istanbul Adliyesi Mahkemeleri ve İcra Daireleri yetkilidir.
          </P>
        </TabsContent>
        <TabsContent value="cookie-policy"><H1>Çerez Politikası</H1>
          <P>Son güncellenme: 22/07/2023</P>
          <P>
            Biz, Cedenes, olarak güvenliğinize önem veriyor ve bu Çerez Politikası ile siz sevgili ziyaretçilerimizi, web sitemizde hangi çerezleri, hangi amaçla kullandığımız ve çerez ayarlarınızı nasıl değiştireceğiniz konularında kısaca bilgilendirmeyi hedefliyoruz.
          </P>
          <P>
            Sizlere daha iyi hizmet verebilmek adına, çerezler vasıtasıyla, ne tür kişisel verilerinizin hangi amaçla toplandığı ve nasıl işlendiği konularında, kısaca bilgi sahibi olmak için lütfen bu Çerez Politikasını okuyunuz. Daha fazla bilgi için Gizlilik Politikamıza göz atabilir ya da bizlerle çekinmeden iletişime geçebilirsiniz.
          </P>
          <H2>Çerez Nedir?</H2>
          <P>
            Çerezler, kullanıcıların web sitelerini daha verimli bir şekilde kullanabilmeleri adına,
            cihazlarına kaydedilen küçük dosyacıklardır. Çerezler vasıtasıyla kullanıcıların bilgilerinin
            işleniyor olması sebebiyle, 6698 sayılı <a href="https://sartlar.com/kvkk-nedir">Kişisel Verilerin Korunması Kanunu</a> gereğince,
            kullanıcıların bilgilendirilmeleri ve onaylarının alınması gerekmektedir.
          </P>
          <P>
            Bizler de siz sevgili ziyaretçilerimizin, web sitemizden en verimli şekilde yararlanabilmelerini
            ve siz sevgili ziyaretçilerimizin kullanıcı deneyimlerinin geliştirilebilmesini sağlamak adına,
            çeşitli çerezler kullanmaktayız.
          </P>
          <h3>1. Zorunlu Çerezler</h3>
          <P>
            Zorunlu çerezler, web sitesine ilişkin temel işlevleri etkinleştirerek
            web sitesinin kullanılabilir hale gelmesini sağlayan çerezlerdir. Web sitesi
            bu çerezler olmadan düzgün çalışmaz.
          </P>
          <h3>2. Performans Çerezleri</h3>
          <P>
            Performans çerezleri, ziyaretçilerin web sitesine ilişkin kullanım bilgilerini
            ve tercihlerini anonim olarak toplayan ve bu sayede web sitesinin performansının
            geliştirilmesine olanak sağlayan çerezlerdir.
          </P>
          <h3>3. Fonksiyonel Çerezler</h3>
          <P>
            Fonksiyonel çerezler, kullanıcıların web sitesine ilişkin geçmiş kullanımlarından
            yola çıkılarak gelecekteki ziyaretlerinde tanınmalarını ve hatırlanmalarını sağlayan
            ve bu sayede web sitelerinin kullanıcılara dil, bölge vb. gibi kişiselleştirilmiş bir
            hizmet sunmasına olanak tanıyan çerezlerdir.
          </P>
          <h3>4. Reklam Çerezleri</h3>
          <P>
            Reklam çerezleri, üçüncü taraflara ait çerezlerdir ve web sitelerinde ziyaretçilerin
            davranışlarını izlemek için kullanılırlar. Bu çerezlerin amaçları, ziyaretçilerin
            ihtiyaçlarına yönelik ilgilerini çekecek reklamların gösterilmesine yardımcı olmaktır
            ve sorumluluğu çerez sahibi üçüncü taraflara aittir.
          </P>
          <H2>Çerezler İle İşlenen Kişisel Veriler Nelerdir?</H2>
          <P>
            Kimlik (isim, soy isim, doğum tarihi vb.) ve iletişim (adres, e-posta adresi, telefon, IP, konum vb.)
            bilgileriniz tarafımızca, çerezler (cookies) vasıtasıyla, otomatik veya otomatik olmayan
            yöntemlerle ve bazen de analitik sağlayıcılar, reklam ağları, arama bilgi sağlayıcıları,
            teknoloji sağlayıcıları gibi üçüncü taraflardan elde edilerek, kaydedilerek, depolanarak
            ve güncellenerek, aramızdaki hizmet ve sözleşme ilişkisi çerçevesinde ve süresince, meşru
            menfaat işleme şartına dayanılarak işlenecektir.
          </P>
          <H2>Çerezler Hangi Amaçla Kullanılmaktadır?</H2>
          <P>
            Web sitemizde, şüpheli eylemlerin tespiti yoluyla güvenliğin sağlanması, kullanıcıların
            tercihleri doğrultusunda işlevsellik ve performansın artırılması, ürünlerin ve hizmetlerin
            geliştirilmesi ve kişiselleştirilmesi ile bu hizmetlere ulaşımın kolaylaştırılması,
            sözleşmesel ve hukuki sorumlulukların yerine getirilmesi amaçlı çerezler kullanmaktadır.
            Ayrıca kullanıcıların daha geniş kapsamlı hizmet sağlayıcılar ile buluşturulabilmesi
            amacıyla reklam çerezleri ve üçüncü taraflarla bilgi paylaşımı da söz konusudur.
          </P>
          <H2>Çerezler Nasıl Yönetilmektedir?</H2>
          <P>
            Tüm bu açıklamalardan sonra, hangi çerezlerin kullanılacağı konusu, tamamen kullanıcılarımızın
            özgür iradelerine bırakılmıştır. Çerez tercihlerinizi, tarayıcınızın ayarlarından silerek
            ya da engelleyerek, web sitemize adım attığınız anda yönetebilir ya da gelecekte,
            istediğiniz zaman bu ayarları değiştirebilirsiniz. Daha ayrıntılı bilgi için Gizlilik Politikamıza
            göz atabilir ya da bizlerle <a href="mailto: cihatsalik1@gmail.com"></a> e-mail adresi üzerinden iletişime geçebilirsiniz.
          </P>
        </TabsContent>
      </Tabs>
    </Container>
  )
}
