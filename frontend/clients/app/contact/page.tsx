"use client";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Store,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Award,
  Shield,
  Star,
} from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      details: ["1900 1234", "028 3456 7890"],
      description: "Hỗ trợ 24/7",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@fashionstore.vn", "support@fashionstore.vn"],
      description: "Phản hồi trong 2 giờ",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: ["123 Nguyễn Huệ, Q.1", "TP. Hồ Chí Minh"],
      description: "Showroom chính",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: ["T2-T7: 9:00 - 21:00", "CN: 10:00 - 20:00"],
      description: "Mở cửa hàng ngày",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://www.facebook.com/pt.sang.71",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "#",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-50",
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "#",
      color: "hover:text-sky-600",
      bgColor: "hover:bg-sky-50",
    },
    {
      icon: Youtube,
      name: "Youtube",
      url: "#",
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-50",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Tư Vấn Chuyên Nghiệp",
      description: "Đội ngũ stylist giàu kinh nghiệm",
    },
    {
      icon: Shield,
      title: "Cam Kết Chất Lượng",
      description: "100% hàng chính hãng",
    },
    {
      icon: Star,
      title: "Dịch Vụ Tận Tâm",
      description: "Hỗ trợ khách hàng 24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-transparent to-gray-900/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 mb-8 border border-slate-200 shadow-lg">
            <MessageSquare className="w-4 h-4 mr-2 text-amber-500" />
            Liên Hệ Với Chúng Tôi
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 bg-clip-text text-transparent">
              Kết Nối
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              Ngay Hôm Nay
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với
            <span className="font-semibold text-slate-800">
              {" "}
              dịch vụ tư vấn chuyên nghiệp{" "}
            </span>
            và giải đáp mọi thắc mắc về thời trang hàng hiệu.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Thông Tin Liên Hệ
            </h2>
            <p className="text-gray-600 text-lg">
              Nhiều cách để bạn có thể kết nối với chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div
                    className={`relative w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {info.title}
                  </h3>

                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 font-medium">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-1 gap-16">
            {/* Map & Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Tìm Chúng Tôi
                </h2>

                {/* Map */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="h-80">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.846234340846!2d106.68453677143508!3d10.775917634039189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f464d6c70b5%3A0x5d0166af04b12165!2sLouis%20Vuitton%20Ho%20Chi%20Minh!5e0!3m2!1sen!2s!4v1751354119063!5m2!1sen!2s"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-amber-500 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          123 Nguyễn Huệ, Quận 1
                        </p>
                        <p className="text-gray-600">
                          TP. Hồ Chí Minh, Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Liên Hệ Nhanh</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Phone className="w-6 h-6 mr-4 text-amber-400" />
                    <div>
                      <p className="font-semibold">Hotline</p>
                      <p className="text-slate-300">1900 1234</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Mail className="w-6 h-6 mr-4 text-amber-400" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-slate-300">info@fashionstore.vn</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Clock className="w-6 h-6 mr-4 text-amber-400" />
                    <div>
                      <p className="font-semibold">Giờ làm việc</p>
                      <p className="text-slate-300">
                        T2-T7: 9:00-21:00, CN: 10:00-20:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-slate-600">
                  <p className="text-slate-300 mb-4 font-medium">
                    Theo dõi chúng tôi:
                  </p>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${social.color} group`}
                        >
                          <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white font-medium mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-xl text-gray-600">
              Những câu hỏi khách hàng thường quan tâm
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Làm sao để biết sản phẩm là hàng chính hãng?",
                answer:
                  "Tất cả sản phẩm tại cửa hàng đều có tem chống hàng giả, hóa đơn VAT và thẻ bảo hành chính hãng từ nhà sản xuất.",
              },
              {
                question: "Chính sách đổi trả như thế nào?",
                answer:
                  "Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày với điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng.",
              },
              {
                question: "Có giao hàng toàn quốc không?",
                answer:
                  "Có, chúng tôi giao hàng toàn quốc. Miễn phí giao hàng cho đơn hàng từ 2 triệu đồng trở lên.",
              },
              {
                question: "Có thể thanh toán trả góp không?",
                answer:
                  "Có, chúng tôi hỗ trợ thanh toán trả góp qua thẻ tín dụng và các ứng dụng thanh toán như Kredivo, Home Credit.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-amber-600 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 rounded-3xl p-12 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Headphones className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Cần Hỗ Trợ Ngay?
              </h2>
              <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                Đội ngũ tư vấn viên chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ
                trợ bạn 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="tel:19001234"
                  className="group px-8 py-4 bg-white text-slate-800 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Gọi Ngay: 123456789
                </a>
                <a
                  href="mailto:phamthaisang1710@gmail.com"
                  className="group px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                >
                  <Mail className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Gửi Email: phamthaisang1710@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 text-gray-500 mb-6">
            <Store className="w-6 h-6 text-amber-500" />
            <p className="text-lg font-medium">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
          <p className="text-gray-400">
            © 2024 Cửa hàng thời trang hàng hiệu. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
