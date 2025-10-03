"use client";
import {
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
  Rocket,
  TrendingUp,
  CheckCircle,
  User,
  Star,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Rocket,
      title: "Pembuatan Proyek Bisnis",
      description:
        "Mulai dari nol, simpan & kelola ide bisnis dalam satu proyek terstruktur. Wujudkan ide menjadi rencana nyata.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Analisis Target Segmen",
      description:
        "Identifikasi siapa pelanggan ideal berdasarkan deskripsi bisnis dengan bantuan AI yang cerdas.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Sparkles,
      title: "Generator Proposisi Nilai Unik",
      description:
        "Bangun pesan nilai unik yang relevan dengan segmen target untuk menonjol di pasar.",
      color: "from-purple-600 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "Lab Inovasi",
      description:
        "Eksplorasi peluang inovasi melalui iterasi produk, kemasan, dan umpan balik pengguna.",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: TrendingUp,
      title: "Kesiapan Finansial & Investasi",
      description:
        "Proyeksi pendapatan & biaya bulanan, plus analisis kesiapan bisnis untuk menarik investor.",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Founder, Botanica Essentials",
      content:
        "ManagHer membantu saya mengubah ide skincare organik menjadi bisnis yang terstruktur. Sekarang saya tahu persis ke mana harus melangkah.",
      rating: 5,
    },
    {
      name: "Dina Kusuma",
      role: "Solopreneur, Local Craft Co.",
      content:
        "Fitur financial readiness-nya luar biasa! Saya bisa meyakinkan investor dengan proyeksi yang jelas dan profesional.",
      rating: 5,
    },
    {
      name: "Maya Pratiwi",
      role: "Creator, EduKids Digital",
      content:
        "Antarmukanya sangat ramah dan mudah dipahami. Tidak perlu jadi ahli bisnis untuk menggunakan ManagHer.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9FF] via-white to-[#F5F3FF]">
      {/* Navigation */}
      <nav className="z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 fixed">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#493D9E] to-[#B2A5FF] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#493D9E]">ManagHer</span>
          </div>
          <Link
            href="./dashboard"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "./dashboard";
            }}
            className="bg-[#493D9E] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#3d3182] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Mulai Sekarang
          </Link>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none mx-16">
        <div
          className="absolute w-96 h-96 bg-[#DAD2FF] rounded-full blur-3xl opacity-30"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute w-80 h-80 bg-[#FFF2AF] rounded-full blur-3xl opacity-20"
          style={{
            bottom: "20%",
            right: "10%",
            transform: `translate(-${scrollY * 0.08}px, ${scrollY * 0.12}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          <div
            className={`space-y-8 transition-all duration-700 ${
              scrollY < 100
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-[#FFF2AF] px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-[#493D9E]" />
              <span className="text-sm font-medium text-[#493D9E]">
                Platform #1 untuk Solopreneur Perempuan
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Punya Ide Bisnis,
              <span className="block text-[#493D9E]">Tapi Bingung Mulai?</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Kami tahu memulai itu menakutkan. Tapi kamu tidak sendiri.
              ManagHer membantu perempuan solopreneur mengubah ide menjadi
              bisnis yang terstruktur dan siap berkembang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  await router.push("./dashboard");
                  window.location.href="./dashboard";
                }}
                disabled={isLoading}
                className="group bg-[#493D9E] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#3d3182] transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {isLoading ? "Memuat..." : "Mulai Proyek Pertamamu"}
                </span>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
              <button className="border-2 border-[#493D9E] text-[#493D9E] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#493D9E] hover:text-white transition-all duration-300">
                Lihat Demo
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-[#493D9E]">500+</p>
                <p className="text-sm text-gray-600">Solopreneur Aktif</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-3xl font-bold text-[#493D9E]">1000+</p>
                <p className="text-sm text-gray-600">Proyek Bisnis Dibuat</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
              <img
                src="/Screenshot 2025-10-01 231645.png"
                alt="ManagHer Dashboard Preview"
                className="w-full rounded-xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#493D9E] to-[#B2A5FF] rounded-3xl blur-3xl opacity-20 transform scale-110" />
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section
        id="section-problem"
        className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${
          isVisible["section-problem"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-[#493D9E] to-[#6B5BB5] rounded-3xl p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Kenapa Banyak Ide Bisnis Tidak Pernah Dimulai?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-lg">Tidak tahu harus mulai dari mana</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-lg">
                    Bingung tentang prosedur dan struktur bisnis
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-lg">Takut membuat keputusan yang salah</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-lg">
                    Tidak ada panduan praktis yang mudah dipahami
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <CheckCircle className="w-12 h-12 text-[#FFF2AF] mb-4" />
                <h3 className="text-2xl font-bold mb-3">
                  ManagHer adalah Solusinya
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  Platform all-in-one yang memandu kamu selangkah demi selangkah
                  — dari ide hingga bisnis yang siap berkembang dan menarik
                  investor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="section-features"
        className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${
          isVisible["section-features"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#DAD2FF] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#493D9E]" />
            <span className="text-sm font-medium text-[#493D9E]">
              5 Tools Powerful untuk Bisnismu
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bangun Bisnismu Selangkah Demi Selangkah
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Setiap fitur dirancang khusus untuk membantumu berkembang — tanpa
            ribet, tanpa bingung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-[#FFF2AF] to-[#FFE880] rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-4">
            <Sparkles className="w-12 h-12 text-[#493D9E]" />
            <h3 className="text-2xl font-bold text-[#493D9E]">
              Dan Masih Banyak Lagi!
            </h3>
            <p className="text-gray-800">
              Temukan semua fitur yang dirancang khusus untukmu
            </p>
            <button className="bg-[#493D9E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3d3182] transition-all duration-300 hover:scale-105">
              Jelajahi Semua Fitur
            </button>
          </div>
        </div>
      </section>

      {/* Demo Interactive Section */}
      <section
        id="section-demo"
        className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${
          isVisible["section-demo"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-[#DAD2FF] to-white rounded-3xl p-12 border border-[#B2A5FF]/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lihat ManagHer Beraksi
            </h2>
            <p className="text-xl text-gray-600">
              Antarmuka yang intuitif, proses yang sederhana
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#493D9E] px-6 py-4 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex-1 text-center text-white font-medium">
                ManagHer
              </div>
            </div>
            <div className="p-6">
              <img
                src="/Screenshot 2025-10-01 231645.png"
                alt="ManagHer Interface"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="section-testimonials"
        className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${
          isVisible["section-testimonials"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Mereka Sudah Memulai. Giliran Kamu!
          </h2>
          <p className="text-xl text-gray-600">
            Cerita inspiratif dari solopreneur yang telah bertransformasi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#FFF2AF] text-[#FFF2AF]"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#493D9E] to-[#B2A5FF] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="section-cta"
        className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${
          isVisible["section-cta"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-[#493D9E] via-[#5B4DAB] to-[#6B5BB5] rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FFF2AF] rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Siap Wujudkan Ide Bisnismu?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              Bergabunglah dengan ratusan solopreneur perempuan yang telah
              memulai perjalanan mereka. Tidak ada biaya tersembunyi, tidak ada
              komitmen — mulai gratis hari ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  await router.push("./dashboard");
                  window.location.href="./dashboard";
                }}
                disabled={isLoading}
                className="group bg-white text-[#493D9E] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#FFF2AF] transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {isLoading ? "Memuat..." : "Mulai Proyek Pertamamu"}
                </span>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
              <p className="text-sm text-white/80">
                Gratis 14 hari • Tidak perlu kartu kredit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#493D9E] to-[#B2A5FF] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ManagHer</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform yang memberdayakan perempuan solopreneur untuk
                membangun bisnis impian mereka.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Karir
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 ManagHer. Semua hak dilindungi. Dibuat dengan ❤️ untuk
              solopreneur perempuan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
