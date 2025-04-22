import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Twitter, Linkedin } from "lucide-react"

interface AboutContentProps {
  dict: {
    about: {
      mission: {
        title: string
        description: string
      }
      team: {
        title: string
        description: string
      }
      contact: {
        title: string
        email: string
        social: string
      }
    }
  }
  lang: string
}

export default function AboutContent({ dict, lang }: AboutContentProps) {
  return (
    <div className="space-y-16">
      {/* Mission Section */}
      <section className="moroccan-border">
        <h2 className="text-2xl font-bold mb-4 text-primary">{dict.about.mission.title}</h2>
        <p className="text-lg leading-relaxed">{dict.about.mission.description}</p>
      </section>

      {/* Team Section - Single Member */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-primary">{dict.about.team.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member Photo */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={`/placeholder.svg?height=400&width=400&text=Othman`}
                  alt="Othman"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-xl">Othman</h3>
                <p className="text-sm text-muted-foreground">AI & Moroccan Art Specialist</p>
              </CardContent>
            </Card>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" size="icon">
                <Github />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin />
              </Button>
            </div>
          </div>

          {/* Biography */}
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              {lang === "ar" ? (
                <div className="space-y-4 text-right">
                  <p>
                    يعتبر عثمان المشاوي واحداً من الرواد في مجال الذكاء الاصطناعي والفن. اكتسب خبرة بالأعمال التكنولوجية
                    منذ الصغر، حيث كان من طليعة هذا المجال بشكل مبكر في المغرب وبطريقة متميزة تجاوز بها الحدود التقليدية
                    للفنون. بدأ عثمان مشواره حول التكنولوجيا، حيث تخرج بدرجة مهندس في نظم المعلومات والشبكات التقنية من
                    المدرسة المغربية للعلوم التقنية بالمغرب. حيث تعمق في دراسة تطبيقات الذكاء الاصطناعي وتطوير حلول
                    مبتكرة تخدم هذه التقنية الحديثة لتحسين الحياة اليومية.
                  </p>
                  <p>
                    لم يقتصر شغف عثمان على التكنولوجيا فقط، بل كان له اهتمام خاص بالفن التقليدي. وفي إطار هذا التطوير
                    مسار فني رقمي باستخدام الذكاء الاصطناعي. من خلال هذه المسارات، استطاع أن يقدم أعمالاً فنية تجمع بين
                    الأصالة المغربية والتراث الفني باستخدام تقنيات حديثة مثل التوليد الإبداعي، مما أتاح مجالات متعددة.
                  </p>
                  <h3 className="text-xl font-bold mt-6">المشاركات الدولية</h3>
                  <p>
                    شارك عثمان في مسابقة تكنولوجيا المعلومات والاتصالات (ICT) التي أقيمت في تونس. رغم أن المسابقة كانت
                    تركز على تقنيات تكنولوجيا المعلومات والاتصالات، إلا أن عثمان استطاع استغلال تقنيات الذكاء الاصطناعي
                    ليحصل على المركز الثاني.
                  </p>
                  <p>
                    في الصين، شارك عثمان في مسابقة أخرى متعلقة بتكنولوجيا المعلومات والاتصالات (ICT)، حيث حصل على المركز
                    الثالث. كانت المنافسة شرسة، إلا أن عثمان برز بفضل قدراته على استخدام الذكاء الاصطناعي في مجالات
                    متعددة. ساعده ذلك على صقل مهاراته في التعامل مع التقنيات الحديثة والتطبيقات العملية.
                  </p>
                  <p>
                    لكن التجربة الأكبر جاءت في دبي، حيث كانت المنافسة تركز على دمج الذكاء الاصطناعي مع الفن. في هذه
                    المسابقة، التحدي كان أكبر بكثير على مستوى العالم في هندسة الـ (Prompt Engineering)، أظهر عثمان مدى
                    قدرته على تحويل الأفكار التقنية إلى إبداعات فنية باستخدام تقنيات الذكاء الاصطناعي. التحدي كان في
                    الوقت الضيق، حيث كان على المشاركين توليد الصور المطلوبة في غضون 10 دقائق فقط باستخدام الأوامر
                    الموجهة للذكاء الاصطناعي.
                  </p>
                  <p>
                    عثمان تمكن من تقديم عمل فني في هذا الوقت القصير، محققاً المركز الثاني وسط منافسة شرسة من آلاف
                    المتنافسين من جميع أنحاء العالم. المسابقة كانت تضم صور عالية من المشاركين من شركات عالمية مثل Google
                    وAmazon، مما أضاف طابعاً عالمياً للمنافسة ورفع مستوى التحدي. تم تقييم المسابقة من قبل آل سعيد حفيد
                    سلطان عمان وإشراف مباشر من كبار الشيخ خليفة آل نهيان حفيد سلطان عمان. الحضور رفيع المستوى والخبراء
                    العالميون في التكنولوجيا والفن جعلوا من هذه المنافسة واحدة من أبرز المحافل الدولية التي تربط بين
                    الإبداع الفني والتكنولوجيا.
                  </p>
                  <h3 className="text-xl font-bold mt-6">الإنجازات الحكومية</h3>
                  <p>
                    خلال مشاركته في Gitex Africa، تم تكريم عثمان المشاوي من قبل وزارة الانتقال الرقمي وإصلاح الإدارة
                    العمومية، كما تم تكريمه أيضاً من قبل السيد مولاي حفيظ العلمي، وزير الصناعة والتجارة، وكذلك من قبل
                    المديرية العامة لأمن نظم المعلومات (DGSSI)، السيد محمد الدخيسي، حيث تم تقدير جهوده في دمج الذكاء
                    الاصطناعي الفنون.
                  </p>
                  <h3 className="text-xl font-bold mt-6">الخلاصة</h3>
                  <p>
                    يمثل عثمان المشاوي مثالاً حياً على الإمكانيات الهائلة التي يمكن أن يحققها دمج الذكاء الاصطناعي مع
                    الفنون التقليدية والحديثة. من خلال مشاركاته الدولية وفوزه في المسابقات الكبرى مثل مسابقة دبي للذكاء
                    الاصطناعي، وتفوقه في مسابقة MSI الدولية على آلاف المشاركين، برز عثمان كواحد من أبرز المبدعين في هذا
                    المجال.
                  </p>
                  <p>
                    إن مشواره يعكس التزاماً عميقاً بالإبداع والتكنولوجيا، وقدرته على تحويل الأفكار التقنية إلى أعمال فنية
                    مبتكرة. لا شك أن المستقبل يحمل المزيد من الإنجازات لعالم الفنون الحديثة بفضل أمثال عثمان المشاوي
                    الذين يساهمون في إعادة تعريف حدود الفن والتكنولوجيا على الساحة العالمية.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>
                    Othman El Meshaoui is considered one of the pioneers in the field of AI and art. He gained
                    experience with technology from an early age, where he was at the forefront of this field in Morocco
                    in a distinctive way that transcended the traditional boundaries of art. Othman began his journey in
                    technology, graduating with an engineering degree in Information Systems and Technical Networks from
                    the Moroccan School of Technical Sciences. He delved into studying AI applications and developing
                    innovative solutions that serve this modern technology to improve daily life.
                  </p>
                  <p>
                    Othman's passion wasn't limited to technology alone; he had a special interest in traditional art.
                    Within this framework, he developed a digital artistic path using artificial intelligence. Through
                    these paths, he was able to present artistic works that combine Moroccan authenticity and artistic
                    heritage using modern techniques such as creative generation, which opened up multiple fields.
                  </p>
                  <h3 className="text-xl font-bold mt-6">International Participations</h3>
                  <p>
                    Othman participated in the Information and Communication Technology (ICT) competition held in
                    Tunisia. Although the competition focused on ICT technologies, Othman was able to leverage
                    artificial intelligence techniques to secure second place.
                  </p>
                  <p>
                    In China, Othman participated in another competition related to Information and Communication
                    Technology (ICT), where he won third place. The competition was fierce, but Othman stood out thanks
                    to his abilities to use artificial intelligence in multiple fields. This helped him refine his
                    skills in dealing with modern technologies and practical applications.
                  </p>
                  <p>
                    But the biggest experience came in Dubai, where the competition focused on integrating artificial
                    intelligence with art. In this competition, the challenge was much greater at the global level in
                    Prompt Engineering. Othman demonstrated his ability to transform technical ideas into artistic
                    creations using artificial intelligence techniques. The challenge was in the tight timeframe, where
                    participants had to generate the required images within just 10 minutes using prompts directed to
                    artificial intelligence.
                  </p>
                  <p>
                    Othman managed to present an artistic work in this short time, achieving second place amid fierce
                    competition from thousands of competitors from around the world. The competition included
                    high-caliber participants from global companies like Google and Amazon, which added an international
                    character to the competition and raised the level of challenge. The competition was evaluated by Al
                    Said, grandson of the Sultan of Oman, and under the direct supervision of Sheikh Khalifa Al Nahyan,
                    grandson of the Sultan of Oman. The high-level attendance and global experts in technology and art
                    made this competition one of the most prominent international forums that connect artistic
                    creativity and technology.
                  </p>
                  <h3 className="text-xl font-bold mt-6">Government Achievements</h3>
                  <p>
                    During his participation in Gitex Africa, Othman El Meshaoui was honored by the Ministry of Digital
                    Transition and Public Administration Reform. He was also honored by Mr. Moulay Hafid El Alamy,
                    Minister of Industry and Trade, as well as by the General Directorate for Information Systems
                    Security (DGSSI), Mr. Mohamed El Dakhissi, where his efforts in integrating artificial intelligence
                    with arts were appreciated.
                  </p>
                  <h3 className="text-xl font-bold mt-6">Conclusion</h3>
                  <p>
                    Othman El Meshaoui represents a living example of the enormous potential that can be achieved by
                    integrating artificial intelligence with traditional and modern arts. Through his international
                    participations and his victory in major competitions such as the Dubai AI competition, and his
                    excellence in the international MSI competition over thousands of participants, Othman has emerged
                    as one of the most prominent creators in this field.
                  </p>
                  <p>
                    His journey reflects a deep commitment to creativity and technology, and his ability to transform
                    technical ideas into innovative artistic works. Undoubtedly, the future holds more achievements for
                    the world of modern arts thanks to the likes of Othman El Meshaoui who contribute to redefining the
                    boundaries of art and technology on the global stage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-primary/5 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary">{dict.about.contact.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.about.contact.email}</h3>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail size={16} />
              othmanmoussaoui1@gmail.com
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.about.contact.social}</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="icon">
                <Github />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
