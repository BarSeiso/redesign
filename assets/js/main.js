/**
 * Modern Interactivity System - Portal Pemerintah Kota Palu
 * Redesign 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initModals();
  initSearch();
  initPrograms();
  initNewsFilter();
  initKecamatanTabs();
  initHeroSlider();
  initAccessibility();
  initSurvey();
  initVisitorCounter();
});

// 1. Floating Navbar & Scroll Effects
function initNavbar() {
  const nav = document.getElementById('main-nav');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('py-2', 'shadow-lg');
      nav.classList.remove('py-3.5');
    } else {
      nav.classList.add('py-3.5');
      nav.classList.remove('py-2', 'shadow-lg');
    }

    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
        backToTop.classList.add('opacity-100');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
        backToTop.classList.remove('opacity-100');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// 2. Animated Counters for "Palu dalam Angka"
function initCounters() {
  const statElements = document.querySelectorAll('[data-counter]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800;
          const start = 0;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeOut;

            let formatted = currentVal.toLocaleString('id-ID', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            });

            el.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${target.toLocaleString('id-ID', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
              })}${suffix}`;
            }
          }

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('palu-angka-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// 3. Modals & Popups System
function initModals() {
  const modal = document.getElementById('universal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  if (!modal) return;

  function openModal(title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Attach triggers
  window.openPaluModal = openModal;
  window.closePaluModal = closeModal;

  // Announcement triggers
  document.querySelectorAll('.announcement-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title');
      const date = item.getAttribute('data-date');
      const desc = item.getAttribute('data-desc');
      const file = item.getAttribute('data-file');

      openModal("Detail Pengumuman & Edaran", `
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <i class="far fa-calendar-alt"></i> ${date}
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">${title}</h3>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">${desc}</p>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="fas fa-file-pdf text-red-500 text-2xl"></i>
              <div>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">${file || 'Dokumen_Resmi_Palu.pdf'}</p>
                <p class="text-xs text-slate-400">PDF Document • Terverifikasi TTE Diskominfo</p>
              </div>
            </div>
            <a href="#" onclick="alert('Mengunduh salinan resmi dokumen PDF...'); return false;" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm">
              <i class="fas fa-download"></i> Unduh PDF
            </a>
          </div>
        </div>
      `);
    });
  });

  // Quick Action Tiles
  document.querySelectorAll('.action-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const type = tile.getAttribute('data-service-type');
      showServiceDetails(type);
    });
  });

  // Agenda triggers
  document.querySelectorAll('.agenda-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title');
      const date = item.getAttribute('data-date');
      const loc = item.getAttribute('data-location');
      const desc = item.getAttribute('data-desc');

      openModal("Detail Agenda Kegiatan Kota Palu", `
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-sm text-blue-600 font-semibold">
            <i class="fas fa-calendar-check"></i> ${date}
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">${title}</h3>
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
            <i class="fas fa-map-marker-alt text-red-500"></i> ${loc}
          </div>
          <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">${desc}</p>
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button onclick="alert('Agenda berhasil disematkan ke Google Calendar!'); closePaluModal();" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              <i class="fab fa-google mr-1"></i> Simpan ke Kalender
            </button>
          </div>
        </div>
      `);
    });
  });
}

// 4. Quick Action Details Handler
function showServiceDetails(type) {
  const services = {
    'kependudukan': {
      title: 'Administrasi Kependudukan (Dukcapil ONE)',
      desc: 'Pelayanan administrasi kependudukan cepat, mudah, dan terintegrasi secara online tanpa perlu antre di kantor dinas.',
      items: [
        { name: 'Perekaman & Cetak KTP-el', time: '1 Hari Kerja', url: 'https://dukcapil.palukota.go.id/one/' },
        { name: 'Penerbitan Kartu Keluarga (KK)', time: 'Online / Langsung', url: 'https://dukcapil.palukota.go.id/one/' },
        { name: 'Akta Kelahiran & Kematian', time: 'Online Mandiri', url: 'https://dukcapil.palukota.go.id/one/' },
        { name: 'Surat Pindah Datang / Keluar', time: 'Online 24 Jam', url: 'https://dukcapil.palukota.go.id/one/' },
        { name: 'Kartu Identitas Anak (KIA)', time: 'Antar ke Sekolah/Rumah', url: 'https://dukcapil.palukota.go.id/one/' }
      ]
    },
    'perizinan': {
      title: 'Pelayanan Perizinan Terpadu (e-SIGA & OSS)',
      desc: 'Sistem Pengendalian dan Pelayanan Perizinan Terpadu Kota Palu untuk mendukung kemudahan berusaha (Ease of Doing Business) dan legalitas usaha warga.',
      items: [
        { name: 'Persetujuan Bangunan Gedung (PBG)', time: 'SIMBG Terintegrasi', url: 'https://esiga.palukota.go.id' },
        { name: 'NIB / Izin Usaha Mikro & Kecil', time: 'Instan via OSS RBA', url: 'https://oss.go.id' },
        { name: 'Izin Reklame & Pemanfaatan Ruang', time: '3 Hari Kerja', url: 'https://esiga.palukota.go.id' },
        { name: 'Izin Tenaga Kesehatan & Apotek', time: 'Verifikasi Dinas Kesehatan', url: 'https://esiga.palukota.go.id' }
      ]
    },
    'pajak': {
      title: 'Pajak & Retribusi Daerah (Bapenda Kota Palu)',
      desc: 'Kanal digital pembayaran pajak daerah untuk mempermudah wajib pajak memenuhi kewajiban dan memantau realisasi penerimaan asli daerah (PAD).',
      items: [
        { name: 'e-PBB (Pajak Bumi & Bangunan)', time: 'Cek Tagihan & Bayar QRIS', url: 'https://bapenda.palukota.go.id' },
        { name: 'BPHTB Elektronik', time: 'Validasi Realtime', url: 'https://bapenda.palukota.go.id' },
        { name: 'Pajak Restoran, Hotel & Hiburan (PB1)', time: 'Self-assessment Online', url: 'https://bapenda.palukota.go.id' },
        { name: 'Retribusi Sampah & Pasar', time: 'Virtual Account & POS', url: 'https://bapenda.palukota.go.id' }
      ]
    },
    'pengaduan': {
      title: 'Kanal Pengaduan & Aspirasi Masyarakat',
      desc: 'Sampaikan kritik, saran, pengaduan infrastruktur, maupun aduan pelayanan langsung kepada Wali Kota Palu dan tim tindak lanjut instansi terkait.',
      items: [
        { name: 'Lapor Walikota Palu', time: 'Respons Maksimal 1x24 Jam', url: 'http://laporwalikota.palukota.go.id' },
        { name: 'SP4N-LAPOR! Nasional', time: 'Terhubung ke Ombudsman & MenPANRB', url: 'https://lapor.go.id' },
        { name: 'Call Center Darurat 112', time: 'Bebas Pulsa 24 Jam Nonstop', url: 'tel:112' },
        { name: 'WhatsApp Pengaduan Diskominfo', time: 'Chat Siaga Petugas', url: 'https://wa.me/628114500112' }
      ]
    }
  };

  const data = services[type] || services['kependudukan'];

  const itemsHtml = data.items.map(item => `
    <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-all">
      <div>
        <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">${item.name}</h4>
        <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">${item.time}</span>
      </div>
      <a href="${item.url}" target="_blank" class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1">
        Buka Layanan <i class="fas fa-external-link-alt text-[10px]"></i>
      </a>
    </div>
  `).join('');

  window.openPaluModal(data.title, `
    <div class="space-y-4">
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${data.desc}</p>
      <div class="space-y-2.5">
        ${itemsHtml}
      </div>
    </div>
  `);
}

// 5. Quick Search (`Ctrl+K`)
function initSearch() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const searchClose = document.getElementById('search-close');

  if (!searchModal || !searchInput) return;

  const searchableItems = [
    { type: 'Layanan', title: 'Administrasi Kependudukan (KTP, KK, Akta)', link: '#layanan-section', desc: 'Dukcapil ONE Kota Palu' },
    { type: 'Layanan', title: 'Perizinan Usaha & Bangunan (e-SIGA & PBG)', link: 'https://esiga.palukota.go.id', desc: 'Pelayanan Perizinan Terpadu' },
    { type: 'Layanan', title: 'Pajak Daerah & e-PBB', link: '#layanan-section', desc: 'Bapenda Kota Palu' },
    { type: 'Layanan', title: 'Lapor Walikota Online', link: 'http://laporwalikota.palukota.go.id', desc: 'Pengaduan & Aspirasi Masyarakat' },
    { type: 'Layanan', title: 'PPID - Keterbukaan Informasi Publik', link: 'https://palukota.go.id/layanan-ppid/', desc: 'Pejabat Pengelola Informasi' },
    { type: 'Layanan', title: 'JDIH - Produk Hukum & Peraturan Daerah', link: 'https://jdih.palukota.go.id', desc: 'Jaringan Dokumentasi Informasi Hukum' },
    { type: 'Layanan', title: 'LPSE - Pengadaan Barang dan Jasa Elektronik', link: 'https://www.lpsekotapalu.com/', desc: 'Unit Kerja Pengadaan' },
    { type: 'Pengumuman', title: 'Pengumuman Hasil Seleksi PPPK Tahap II', link: '#pengumuman', desc: 'BKPSDMD Kota Palu' },
    { type: 'Pengumuman', title: 'Edaran Peningkatan Kewaspadaan Cuaca Ekstrem', link: '#pengumuman', desc: 'BPBD Kota Palu' },
    { type: 'Berita', title: 'Wali Kota Palu Terima Bantuan Program LSDP Rp107 Miliar', link: '#berita', desc: 'Pengelolaan Sampah Terpadu' },
    { type: 'Berita', title: 'Inflasi Palu Masuk 10 Terendah Nasional', link: '#berita', desc: 'Stabilitas Harga Pangan TPID' },
    { type: 'Program', title: 'Program Unggulan Ekonomi & Investasi', link: '#program-unggulan', desc: 'UMKM Mandiri & Revitalisasi Pasar' },
    { type: 'Program', title: 'Program Palu Mantap Bergerak', link: '#program-unggulan', desc: '53 Program Kerja Prioritas' },
    { type: 'Darurat', title: 'Call Center Palu Siaga 112 Bebas Pulsa', link: 'tel:112', desc: 'Layanan Darurat Medis, Damkar, Bencana' }
  ];

  function openSearch() {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    searchInput.value = '';
    searchInput.focus();
    renderResults(searchableItems.slice(0, 5));
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function renderResults(items) {
    if (items.length === 0) {
      searchResults.innerHTML = `
        <div class="py-8 text-center text-slate-400">
          <i class="fas fa-search text-2xl mb-2"></i>
          <p class="text-sm">Tidak ada hasil ditemukan. Coba kata kunci lain.</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = items.map(item => `
      <a href="${item.link}" class="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group">
        <div class="flex items-center gap-3">
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
            item.type === 'Layanan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
            item.type === 'Darurat' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
            item.type === 'Pengumuman' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' :
            'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
          }">${item.type}</span>
          <div>
            <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">${item.title}</h4>
            <p class="text-xs text-slate-400">${item.desc}</p>
          </div>
        </div>
        <i class="fas fa-arrow-right text-xs text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
      </a>
    `).join('');
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderResults(searchableItems.slice(0, 5));
      return;
    }
    const filtered = searchableItems.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
    renderResults(filtered);
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeSearch();
    }
  });

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });
}

// 6. Program Unggulan Interactive Cards
function initPrograms() {
  const programsData = {
    'ekonomi': {
      title: 'Program Unggulan: Ekonomi & Investasi',
      icon: 'fas fa-chart-line text-blue-500',
      desc: 'Peningkatan daya saing ekonomi berbasis kemudahan investasi, modernisasi pasar rakyat, pembinaan 10.000 UMKM naik kelas, dan pengembangan ekonomi maritim di Teluk Palu.',
      targets: [
        'Bantuan Modal Usaha Bergulir Tanpa Bunga bagi Pelaku Usaha Mikro',
        'Revitalisasi Pasar Tradisional Masomba dan Pasar Manonda menjadi Pasar Bersih dan Higienis',
        'Fasilitasi Sertifikasi Halal Gratis & NIB Mandiri di 46 Kelurahan',
        'Pemberdayaan Nelayan Pesisir Teluk Palu dengan Bantuan Mesin Ramah Lingkungan'
      ]
    },
    'sosial': {
      title: 'Program Unggulan: Sosial Kependudukan',
      icon: 'fas fa-users text-green-500',
      desc: 'Perlindungan sosial komprehensif untuk memastikan tidak ada warga Kota Palu yang tertinggal dalam pemenuhan hak dasar hidup layak dan sejahtera.',
      targets: [
        'Bantuan Pangan Non-Tunai Daerah Tepat Sasaran Terverifikasi DTKS Terpadu',
        'Program Insentif bagi Penggali Kubur, Imam Masjid, Pegawai Syara, dan Pelayan Rumah Ibadah',
        'Pemberdayaan Kelompok Rentan, Disabilitas, dan Lanjut Usia dengan Pelatihan Berkelanjutan',
        'Penguatan Ketahanan Keluarga Melalui Kampung KB Mandiri Berkualitas'
      ]
    },
    'infrastruktur': {
      title: 'Program Unggulan: Infrastruktur & Tata Ruang',
      icon: 'fas fa-city text-orange-500',
      desc: 'Pembangunan infrastruktur perkotaan yang tangguh bencana gempa & likuefaksi, sistem drainase terpadu bebas genangan, serta peningkatan konektivitas jalan lingkungan.',
      targets: [
        'Pembangunan & Perbaikan Jalan Mulus hingga Gang dan Lorong Pemukiman Warga',
        'Optimalisasi Saluran Drainase Utama untuk Mengatasi Titik Genangan Air Hujan',
        'Penyediaan Lampu Penerangan Jalan Umum (PJU) Pintar di Seluruh Ruas Jalan Kota',
        'Penataan Kawasan Pesisir Anjungan Teluk Palu Menjadi Ruang Publik Ramah Keluarga'
      ]
    },
    'birokrasi': {
      title: 'Program Unggulan: Birokrasi & Keuangan',
      icon: 'fas fa-landmark text-purple-500',
      desc: 'Mewujudkan tata kelola pemerintahan yang bersih, melayani, dan transparan melalui digitalisasi SPBE serta pengelolaan keuangan daerah berbasis kinerja akuntabel.',
      targets: [
        'Implementasi SPBE Berpredikat Sangat Baik untuk Seluruh Pelayanan OPD',
        'Transparansi APBD Terbuka Realtime yang Dapat Dipantau Masyarakat',
        'Sistem Meritokrasi ASN Berbasis Kinerja dan Zona Integritas Bebas Korupsi',
        'Peningkatan Pendapatan Asli Daerah (PAD) Melalui Digitalisasi Retribusi & Pajak'
      ]
    },
    'pelayanan': {
      title: 'Program Unggulan: Pelayanan Dasar',
      icon: 'fas fa-hand-holding-heart text-teal-500',
      desc: 'Jaminan akses pendidikan dan kesehatan yang berkualitas, gratis, merata, dan mudah diakses oleh seluruh lapisan masyarakat Kota Palu.',
      targets: [
        'Universal Health Coverage (UHC) 100% BPJS Kesehatan Ditanggung Pemkot',
        'Program Beasiswa Berprestasi & Kurang Mampu untuk Pelajar & Mahasiswa Palu',
        'Peningkatan Layanan Puskesmas Rawat Inap 24 Jam dengan Dokter Standby',
        'Penyediaan Ambulans Gratis Siaga di Setiap Kecamatan'
      ]
    },
    'lingkungan': {
      title: 'Program Unggulan: Lingkungan Hidup',
      icon: 'fas fa-leaf text-emerald-500',
      desc: 'Menjaga kelestarian ekosistem Kota Palu, mewujudkan kota bersih peraih Piala Adipura berkelanjutan, pengelolaan sampah modern LSDP Rp107 Miliar, dan adaptasi perubahan iklim.',
      targets: [
        'Implementasi Program LSDP Bank Dunia Senilai Rp107 Miliar untuk Pengelolaan Sampah Modern',
        'Gerakan Palu Mantap Bergerak Bersih Lingkungan Bersama Satgas K5 Kelurahan',
        'Pengurangan Sampah Plastik Sekali Pakai & Bank Sampah Unit Komunitas',
        'Reboisasi dan Sabuk Hijau Pesisir (Mangrove) untuk Menahan Abrasi Teluk Palu'
      ]
    }
  };

  document.querySelectorAll('.program-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-program');
      const data = programsData[key];
      if (!data) return;

      const targetsList = data.targets.map(t => `
        <li class="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
          <i class="fas fa-check-circle text-blue-600 mt-1 flex-shrink-0"></i>
          <span>${t}</span>
        </li>
      `).join('');

      window.openPaluModal(data.title, `
        <div class="space-y-4">
          <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
            <i class="${data.icon} text-2xl"></i>
            <p class="text-xs text-blue-900 dark:text-blue-200 font-medium leading-relaxed">${data.desc}</p>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Sasaran Prioritas & Program Aksi:</h4>
            <ul class="space-y-2">
              ${targetsList}
            </ul>
          </div>
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Rencana Pembangunan Jangka Menengah Daerah (RPJMD)</span>
            <span class="font-bold text-blue-600">Palu Mantap Bergerak</span>
          </div>
        </div>
      `);
    });
  });
}

// 7. News Filter
function initNewsFilter() {
  const filterBtns = document.querySelectorAll('.news-filter-btn');
  const newsCards = document.querySelectorAll('.news-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      btn.classList.add('bg-blue-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 8. Interactive 8 Subdistricts (Kecamatan)
function initKecamatanTabs() {
  const kecamatanData = {
    'mantikulore': {
      nama: 'Kecamatan Mantikulore',
      kelurahan: '8 Kelurahan (Kawatuna, Lasoani, Poboya, Talise, Talise Valangguni, Tondo, Layana Indah, Tanamodindi)',
      penduduk: '± 76.500 Jiwa',
      luas: '206,80 km²',
      keunggulan: 'Pusat Pemerintahan Balai Kota Palu, Kawasan Pendidikan Tinggi (Universitas Tadulako), Kawasan Ekonomi Khusus (KEK) Palu, dan agrowisata perkebunan.'
    },
    'palubarat': {
      nama: 'Kecamatan Palu Barat',
      kelurahan: '6 Kelurahan (Baluase, Balaroa, Kamonji, Siranindi, Ujuna, Donggala Kodi)',
      penduduk: '± 63.200 Jiwa',
      luas: '8,28 km²',
      keunggulan: 'Pusat sejarah religi Makam Guru Tua (SIS Al-Jufri), sentra kuliner Khas Bawang Goreng Palu, pasar tradisional, dan kawasan pertokoan padat.'
    },
    'paluselatan': {
      nama: 'Kecamatan Palu Selatan',
      kelurahan: '5 Kelurahan (Birobuli Selatan, Birobuli Utara, Petobo, Tatura Selatan, Tatura Utara)',
      penduduk: '± 72.800 Jiwa',
      luas: '27,38 km²',
      keunggulan: 'Pintu gerbang udara Bandara Mutiara SIS Al-Jufri, pusat perdagangan otomotif & modern, sentra pemukiman asri, dan sport center.'
    },
    'palutimur': {
      nama: 'Kecamatan Palu Timur',
      kelurahan: '5 Kelurahan (Besusu Barat, Besusu Tengah, Besusu Timur, Lolu Selatan, Lolu Utara)',
      penduduk: '± 45.100 Jiwa',
      luas: '7,71 km²',
      keunggulan: 'Jantung pusat perkantoran perbankan & instansi vertikal, Lapangan Vatulemo, Taman GOR, dan deretan perhotelan bintang.'
    },
    'paluutara': {
      nama: 'Kecamatan Palu Utara',
      kelurahan: '5 Kelurahan (Kayumalue Ngapa, Kayumalue Pajeko, Mamboro, Mamboro Barat, Taipa)',
      penduduk: '± 28.400 Jiwa',
      luas: '29,94 km²',
      keunggulan: 'Kawasan maritim Pelabuhan Taipa, jalur logistik Pantura Sulawesi, perikanan budidaya garam tradisional Talise-Taipa, dan mangrove.'
    },
    'tatanga': {
      nama: 'Kecamatan Tatanga',
      kelurahan: '6 Kelurahan (Boyoringgo, Duyu, Nunu, Palupi, Pengawu, Tawanjuka)',
      penduduk: '± 52.300 Jiwa',
      luas: '14,95 km²',
      keunggulan: 'Kawasan pemukiman berkembang pesat, sentra kerajinan anyaman tenun lokal, pasar sub-terminal, dan pertanian hortikultura produktif.'
    },
    'tawaeli': {
      nama: 'Kecamatan Tawaeli',
      kelurahan: '5 Kelurahan (Baiya, Lambara, Panau, Pantoloan, Pantoloan Boya)',
      penduduk: '± 24.600 Jiwa',
      luas: '56,66 km²',
      keunggulan: 'Pelabuhan Samudera Peti Kemas Pantoloan (Hub Maritim Nasional ALKI II), kawasan industri manufaktur terpadu, dan pertambangan galian C berizin.'
    },
    'ulujadi': {
      nama: 'Kecamatan Ulujadi',
      kelurahan: '6 Kelurahan (Donggala Kodi, Kabonena, Silae, Tipo, Buluri, Watusampu)',
      penduduk: '± 38.100 Jiwa',
      luas: '43,34 km²',
      keunggulan: 'Panorama Teluk Palu spektakuler, perhotelan resort pesisir Pantai Malonda, jembatan wisata pantai, dan perbukitan paralayang.'
    }
  };

  const buttons = document.querySelectorAll('.kecamatan-btn');
  const infoContainer = document.getElementById('kecamatan-info-card');

  if (!infoContainer) return;

  function renderKecamatan(key) {
    const d = kecamatanData[key];
    if (!d) return;

    infoContainer.innerHTML = `
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-red-500"></i> ${d.nama}
          </h3>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            Wilayah Administrasi Pemkot Palu
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <span class="text-xs text-slate-400 block mb-1">Jumlah Penduduk</span>
            <span class="text-lg font-bold text-slate-800 dark:text-slate-100">${d.penduduk}</span>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <span class="text-xs text-slate-400 block mb-1">Luas Wilayah</span>
            <span class="text-lg font-bold text-slate-800 dark:text-slate-100">${d.luas}</span>
          </div>
          <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <span class="text-xs text-slate-400 block mb-1">Cakupan Wilayah</span>
            <span class="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">${d.kelurahan.split('(')[0]}</span>
          </div>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Daftar Kelurahan:</h4>
          <p class="text-sm text-slate-700 dark:text-slate-300">${d.kelurahan}</p>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Potensi & Keunggulan Wilayah:</h4>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${d.keunggulan}</p>
        </div>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');

      const k = btn.getAttribute('data-kecamatan');
      renderKecamatan(k);
    });
  });

  // initial load
  renderKecamatan('mantikulore');
}

// 9. Hero Slider Switcher
function initHeroSlider() {
  const heroWrapper = document.getElementById('hero-banner');
  const dots = document.querySelectorAll('.slider-dot');
  const locTag = document.getElementById('hero-location-text');

  if (!heroWrapper || dots.length === 0) return;

  const slides = [
    {
      img: 'assets/images/hero-bg.jpg',
      loc: 'Teluk Palu, Sulawesi Tengah'
    },
    {
      img: 'https://palukota.go.id/wp-content/uploads/elementor/thumbs/kantor_walikota_palu-p7utcmt7trwgnvl6337j4byit8lwp9z5we2qplol74.png',
      loc: 'Balai Kota Palu, Mantikulore'
    },
    {
      img: 'https://palukota.go.id/wp-content/uploads/elementor/thumbs/sungai_palu-p7utf0cj3p5k0e4x7m6kx8dgvawb5qeqk5fxds5rgw.jpg',
      loc: 'Sungai Palu & Jembatan Palu IV'
    }
  ];

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => {
        d.classList.remove('w-8', 'bg-white');
        d.classList.add('w-2.5', 'bg-white/50');
      });
      dot.classList.add('w-8', 'bg-white');
      dot.classList.remove('w-2.5', 'bg-white/50');

      const slide = slides[index];
      if (slide) {
        heroWrapper.style.backgroundImage = `url('${slide.img}')`;
        if (locTag) locTag.textContent = slide.loc;
      }
    });
  });
}

// 10. Accessibility Mode (Dark Mode & Font Scaler)
function initAccessibility() {
  const darkToggle = document.getElementById('dark-mode-toggle');
  const fontDec = document.getElementById('font-decrease');
  const fontInc = document.getElementById('font-increase');

  // Check saved theme or system preference
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  let fontLevel = 0;
  if (fontDec && fontInc) {
    fontInc.addEventListener('click', () => {
      if (fontLevel < 2) fontLevel++;
      applyFont();
    });
    fontDec.addEventListener('click', () => {
      if (fontLevel > -1) fontLevel--;
      applyFont();
    });
  }

  function applyFont() {
    document.body.classList.remove('font-lg', 'font-xl');
    if (fontLevel === 1) document.body.classList.add('font-lg');
    if (fontLevel === 2) document.body.classList.add('font-xl');
  }
}

// 11. Survey Rating Widget
function initSurvey() {
  const stars = document.querySelectorAll('.survey-star');
  const submitBtn = document.getElementById('survey-submit-btn');
  let selectedRating = 5;

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      stars.forEach((s, idx) => {
        if (idx < selectedRating) {
          s.classList.add('text-amber-400');
          s.classList.remove('text-slate-300');
        } else {
          s.classList.remove('text-amber-400');
          s.classList.add('text-slate-300');
        }
      });
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const feedback = document.getElementById('survey-feedback')?.value || '';
      alert(`Terima kasih atas partisipasi Anda! Nilai: ${selectedRating} Bintang. Masukan Anda sangat berharga bagi peningkatan Indeks Kepuasan Masyarakat (IKM) & SPBE Kota Palu.`);
      const container = document.getElementById('survey-widget-container');
      if (container) {
        container.innerHTML = `
          <div class="py-6 text-center text-emerald-600 dark:text-emerald-400">
            <i class="fas fa-check-circle text-3xl mb-2"></i>
            <h4 class="font-bold">Penilaian Berhasil Dikirim</h4>
            <p class="text-xs text-slate-500 mt-1">Terima kasih telah berkontribusi menyempurnakan Portal Kota Palu.</p>
          </div>
        `;
      }
    });
  }
}

// 12. Visitor Counter Live Simulation
function initVisitorCounter() {
  const todayCount = document.getElementById('counter-today');
  if (!todayCount) return;

  // Increment simulated online visitor occasionally
  setInterval(() => {
    const onlineEl = document.getElementById('counter-online');
    if (onlineEl) {
      const base = 24;
      const variation = Math.floor(Math.random() * 7) - 3;
      onlineEl.textContent = Math.max(18, base + variation);
    }
  }, 12000);
}

