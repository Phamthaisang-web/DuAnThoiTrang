import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Store,
  Headphones,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
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
      url: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "#",
      color: "hover:text-pink-600",
    },
    { icon: Twitter, name: "Twitter", url: "#", color: "hover:text-sky-600" },
    { icon: Youtube, name: "Youtube", url: "#", color: "hover:text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-gray-900/10 to-zinc-900/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
            <MessageSquare className="w-4 h-4 mr-2 text-slate-500" />
            Liên Hệ Với Chúng Tôi
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 bg-clip-text text-transparent mb-6">
            Kết Nối Ngay
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với
            <span className="font-semibold text-slate-800">
              {" "}
              dịch vụ tư vấn chuyên nghiệp{" "}
            </span>
            và giải đáp mọi thắc mắc về thời trang hàng hiệu.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group text-center"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">
                      {detail}
                    </p>
                  ))}
                  <p className="text-sm text-gray-500 mt-2">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Gửi Tin Nhắn
              </h2>
              <p className="text-gray-600 mb-8">
                Hãy để lại thông tin và chúng tôi sẽ liên hệ với bạn trong thời
                gian sớm nhất.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Họ *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      placeholder="Nhập họ của bạn"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tên *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                    placeholder="0123 456 789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Chủ đề
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="product">Tư vấn sản phẩm</option>
                    <option value="order">Đặt hàng</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="partnership">Hợp tác kinh doanh</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all resize-none"
                    placeholder="Nhập tin nhắn của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Tìm Chúng Tôi
              </h2>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <div className="text-center text-gray-500 p-4">
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <p className="mb-2">Bản đồ Google Maps</p>
                  <div className="w-full h-64">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.846234340846!2d106.68453677143508!3d10.775917634039189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f464d6c70b5%3A0x5d0166af04b12165!2sLouis%20Vuitton%20Ho%20Chi%20Minh!5e0!3m2!1sen!2s!4v1751354119063!5m2!1sen!2s"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <p className="text-sm mt-2">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-slate-800 to-gray-900 rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Liên Hệ Nhanh</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-slate-300" />
                    <span>Hotline: 1900 1234</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-slate-300" />
                    <span>Email: info@fashionstore.vn</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-slate-300" />
                    <span>T2-T7: 9:00-21:00, CN: 10:00-20:00</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <p className="text-sm text-slate-300 mb-3">
                    Theo dõi chúng tôi:
                  </p>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.url}
                          className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all ${social.color}`}
                        >
                          <IconComponent className="w-5 h-5" />
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
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
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
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 rounded-2xl p-12 text-white">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cần Hỗ Trợ Ngay?
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Đội ngũ tư vấn viên chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ
              trợ bạn 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:19001234"
                className="px-8 py-4 bg-white text-slate-800 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Gọi Ngay: 123456789
              </a>
              <a
                href="mailto:info@fashionstore.vn"
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Gửi Email: phamthaisang1710@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
            <Store className="w-5 h-5 text-slate-500" />
            <p className="text-sm">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
          <p className="text-xs text-gray-400">
            © 2024 Cửa hàng thời trang hàng hiệu. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
