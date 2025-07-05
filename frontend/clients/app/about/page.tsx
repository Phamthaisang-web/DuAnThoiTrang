"use client";

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
  Sparkles,
  Zap,
  TrendingUp,
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
      logo: "G",
      color: "from-red-500 to-pink-600",
    },
    {
      name: "Louis Vuitton",
      category: "Premium Bags & Fashion",
      logo: "LV",
      color: "from-amber-500 to-yellow-600",
    },
    {
      name: "Chanel",
      category: "Haute Couture",
      logo: "C",
      color: "from-gray-800 to-black",
    },
    {
      name: "Dior",
      category: "Luxury Fashion",
      logo: "D",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Hermès",
      category: "Premium Accessories",
      logo: "H",
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Prada",
      category: "Italian Fashion",
      logo: "P",
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "Versace",
      category: "Designer Fashion",
      logo: "V",
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Balenciaga",
      category: "Contemporary Luxury",
      logo: "B",
      color: "from-green-500 to-teal-600",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/5 to-orange-600/5 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 mb-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <Store className="w-4 h-4 mr-2 text-amber-500" />
            <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
            Thời Trang Hàng Hiệu
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 bg-clip-text text-transparent">
              Thương Hiệu
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Nổi Tiếng
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Chúng tôi là đại lý ủy quyền của
            <span className="font-semibold text-slate-800 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              {" "}
              hơn 500 thương hiệu thời trang hàng đầu thế giới
            </span>
            , mang đến cho bạn những sản phẩm chính hãng với chất lượng tuyệt
            vời.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-900 hover:from-slate-900 hover:via-gray-900 hover:to-black text-white font-semibold rounded-xl transition-all duration-500 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative">Khám Phá Thương Hiệu</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/contact"
              className="group px-8 py-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Liên Hệ Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:-translate-y-2"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text text-transparent mb-3">
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
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-8 border border-white/20">
              <Crown className="w-4 h-4 mr-2 text-amber-400" />
              Thương Hiệu Đối Tác
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Đối Tác Danh Tiếng
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chúng tôi tự hào là đại lý ủy quyền của những thương hiệu thời
              trang danh tiếng nhất thế giới
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 text-center transform hover:-translate-y-2 hover:bg-white/20"
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-br ${brand.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                  >
                    <span className="text-xl font-bold text-white">
                      {brand.logo}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-300">{brand.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white/80 via-gray-50/80 to-slate-100/80 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white font-medium mb-8 shadow-lg">
              <Shield className="w-4 h-4 mr-2" />
              Cam Kết Chất Lượng
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
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
                  className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="relative">
                    <div
                      className={`w-16 h-16 mb-6 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-slate-900 group-hover:bg-clip-text transition-all duration-300">
                      {value.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-8 border border-white/20">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                Ưu Điểm Vượt Trội
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Tại Sao Chọn
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Chúng Tôi?
                </span>
              </h2>

              <p className="text-xl text-slate-200 mb-10 leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành thời trang cao cấp, chúng
                tôi hiểu rõ nhu cầu của khách hàng và cam kết mang đến những sản
                phẩm chính hãng với dịch vụ tốt nhất.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-center text-white">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <ShoppingBag className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Đại Lý Ủy Quyền
                  </h3>

                  <p className="text-slate-200 leading-relaxed mb-8 text-lg">
                    Chúng tôi là đại lý ủy quyền chính thức của hơn 500 thương
                    hiệu thời trang hàng đầu, đảm bảo mọi sản phẩm đều chính
                    hãng 100%.
                  </p>

                  <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-3 font-semibold text-white">
                      4.9/5 đánh giá
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white/80 via-gray-50/80 to-slate-100/80 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-white font-medium mb-8 shadow-lg">
              <Gem className="w-4 h-4 mr-2" />
              Dịch Vụ Chuyên Nghiệp
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
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
                color: "from-pink-500 to-rose-600",
              },
              {
                step: "02",
                title: "Chọn Lựa",
                desc: "Tuyển chọn sản phẩm phù hợp nhất",
                icon: Store,
                color: "from-blue-500 to-indigo-600",
              },
              {
                step: "03",
                title: "Thanh Toán",
                desc: "Đa dạng hình thức thanh toán",
                icon: ShoppingBag,
                color: "from-emerald-500 to-teal-600",
              },
              {
                step: "04",
                title: "Giao Hàng",
                desc: "Giao hàng nhanh chóng toàn quốc",
                icon: Truck,
                color: "from-amber-500 to-orange-600",
              },
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="group text-center">
                  <div className="relative mb-8">
                    <div
                      className={`w-20 h-20 mx-auto bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-bold text-slate-700 shadow-xl border-2 border-gray-100">
                      {service.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-slate-900 group-hover:bg-clip-text transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="group relative bg-gradient-to-br from-slate-800 via-gray-800 to-zinc-800 rounded-3xl p-12 text-white overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-yellow-600/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Crown className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Khám Phá Thời Trang Hàng Hiệu
              </h2>

              <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                Hãy để chúng tôi giúp bạn tìm kiếm những sản phẩm thời trang
                chính hãng từ các thương hiệu danh tiếng nhất thế giới.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/product"
                  className="group px-8 py-2 bg-white text-slate-800 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <ShoppingBag className="w-5 h-5  mr-2 group-hover:scale-110 transition-transform" />
                  Mua Sắm Ngay
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-16 px-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 text-gray-500 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <p className="text-lg font-medium">
              Đại lý ủy quyền chính thức của hơn 500 thương hiệu thời trang hàng
              đầu
            </p>
          </div>
          <p className="text-gray-400">
            © 2024 Cửa hàng thời trang hàng hiệu. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
}
