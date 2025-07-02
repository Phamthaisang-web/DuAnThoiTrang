import {
  Store,
  Heart,
  Award,
  Users,
  ShoppingBag,
  Truck,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Crown,
  Gem,
  Tag,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "100K+", label: "Khách hàng tin tưởng", icon: Users },
    { number: "500+", label: "Thương hiệu nổi tiếng", icon: Store },
    { number: "10+", label: "Năm kinh nghiệm", icon: Award },
    { number: "99.8%", label: "Sản phẩm chính hãng", icon: Shield },
  ];

  const values = [
    {
      icon: Shield,
      title: "100% Chính Hãng",
      description:
        "Cam kết mọi sản phẩm đều là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng từ các nhà phân phối ủy quyền.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Crown,
      title: "Thương Hiệu Cao Cấp",
      description:
        "Tuyển chọn các thương hiệu thời trang hàng đầu thế giới như Gucci, Louis Vuitton, Chanel, Dior.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Tag,
      title: "Giá Cả Cạnh Tranh",
      description:
        "Mang đến giá tốt nhất thị trường với nhiều chương trình khuyến mãi hấp dẫn quanh năm.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Gem,
      title: "Dịch Vụ Vượt Trội",
      description:
        "Tư vấn chuyên nghiệp, giao hàng nhanh chóng và chính sách đổi trả linh hoạt.",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const brands = [
    {
      name: "Gucci",
      category: "Luxury Fashion",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Louis Vuitton",
      category: "Premium Bags & Fashion",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Chanel",
      category: "Haute Couture",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Dior",
      category: "Luxury Fashion",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Hermès",
      category: "Premium Accessories",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Prada",
      category: "Italian Fashion",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Versace",
      category: "Designer Fashion",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Balenciaga",
      category: "Contemporary Luxury",
      logo: "/placeholder.svg?height=80&width=120",
    },
  ];

  const features = [
    "Sản phẩm chính hãng 100%",
    "Bảo hành toàn cầu",
    "Giao hàng miễn phí toàn quốc",
    "Đổi trả trong 30 ngày",
    "Tư vấn styling miễn phí",
    "Thanh toán linh hoạt",
  ];

  const categories = [
    {
      name: "Thời Trang Nam",
      description: "Suits, áo sơ mi, quần tây cao cấp",
      image: "/placeholder.svg?height=300&width=400",
      brands: "Armani, Hugo Boss, Tom Ford",
      color: "from-slate-500 to-gray-600",
    },
    {
      name: "Thời Trang Nữ",
      description: "Váy, áo blouse, trang phục dạ hội",
      image: "/placeholder.svg?height=300&width=400",
      brands: "Chanel, Dior, Valentino",
      color: "from-rose-500 to-pink-600",
    },
    {
      name: "Phụ Kiện Cao Cấp",
      description: "Túi xách, giày dép, trang sức",
      image: "/placeholder.svg?height=300&width=400",
      brands: "Louis Vuitton, Hermès, Cartier",
      color: "from-amber-500 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-gray-900/10 to-zinc-900/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 mb-6 border border-slate-200">
            <Store className="w-4 h-4 mr-2 text-slate-500" />
            Thời Trang Hàng Hiệu
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 bg-clip-text text-transparent mb-6">
            Thương Hiệu Nổi Tiếng
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Chúng tôi là đại lý ủy quyền của
            <span className="font-semibold text-slate-800">
              {" "}
              hơn 500 thương hiệu thời trang hàng đầu thế giới
            </span>
            , mang đến cho bạn những sản phẩm chính hãng với chất lượng tuyệt
            vời.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center">
              Khám Phá Thương Hiệu
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-all duration-200"
            >
              Liên Hệ Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Thương Hiệu Đối Tác
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi tự hào là đại lý ủy quyền của những thương hiệu thời
              trang danh tiếng nhất thế giới
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group text-center"
              >
                <div className="w-20 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-bold text-gray-600">
                    {brand.name}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}

      {/* Values Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Cam Kết Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị cốt lõi giúp chúng tôi trở thành địa chỉ tin cậy cho
              thời trang hàng hiệu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div
                    className={`w-12 h-12 mb-4 bg-gradient-to-br ${value.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Tại Sao Chọn Chúng Tôi?
              </h2>
              <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành thời trang cao cấp, chúng
                tôi hiểu rõ nhu cầu của khách hàng và cam kết mang đến những sản
                phẩm chính hãng với dịch vụ tốt nhất.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-200 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Đại Lý Ủy Quyền</h3>
                  <p className="text-slate-200 leading-relaxed mb-6">
                    Chúng tôi là đại lý ủy quyền chính thức của hơn 500 thương
                    hiệu thời trang hàng đầu, đảm bảo mọi sản phẩm đều chính
                    hãng 100%.
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-2 font-semibold">4.9/5 đánh giá</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Dịch Vụ Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ tư vấn đến giao hàng, chúng tôi đồng hành cùng bạn trong mọi
              bước mua sắm
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Tư Vấn",
                desc: "Chuyên gia tư vấn phong cách cá nhân",
                icon: Heart,
              },
              {
                step: "02",
                title: "Chọn Lựa",
                desc: "Tuyển chọn sản phẩm phù hợp nhất",
                icon: Store,
              },
              {
                step: "03",
                title: "Thanh Toán",
                desc: "Đa dạng hình thức thanh toán",
                icon: ShoppingBag,
              },
              {
                step: "04",
                title: "Giao Hàng",
                desc: "Giao hàng nhanh chóng toàn quốc",
                icon: Truck,
              },
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-slate-700 shadow-lg">
                      {service.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Khám Phá Thời Trang Hàng Hiệu
            </h2>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi giúp bạn tìm kiếm những sản phẩm thời trang chính
              hãng từ các thương hiệu danh tiếng nhất thế giới.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product"
                className="px-8 py-4 bg-white text-slate-800 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                Mua Sắm Ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-all duration-200">
                Xem Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
            <Globe className="w-5 h-5 text-slate-500" />
            <p className="text-sm">
              Đại lý ủy quyền chính thức của hơn 500 thương hiệu thời trang hàng
              đầu
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
