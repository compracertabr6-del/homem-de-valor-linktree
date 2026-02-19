import { useEffect, useState } from "react";

type CategoryId =
  | "gadgets"
  | "barbear"
  | "perfumes"
  | "relogios"
  | "suplementos"
  | "seguranca";

type Product = {
  id: string;
  name: string;
  url: string;
  highlight?: boolean;
  imageUrl?: string;
  priceHint?: string; // preço aproximado
  tagline?: string; // frase curta de venda
};

type ClicksState = Record<string, number>;

const STORAGE_KEY = "homem_de_valor_clicks_v1";

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "gadgets", label: "Aparelhos & Gadgets" },
  { id: "barbear", label: "Máquinas de barbear" },
  { id: "perfumes", label: "Perfumes masculinos" },
  { id: "relogios", label: "Relógios" },
  { id: "suplementos", label: "Suplementos" },
  { id: "seguranca", label: "Segurança para a família" },
];

const CATEGORY_IMAGES: Record<CategoryId, string> = {
  gadgets: "https://i.imgur.com/HC53EBP.jpeg",
  barbear: "https://i.imgur.com/ja9WaLH.png",
  perfumes: "https://i.imgur.com/sBcx1S9.png",
  relogios: "https://i.imgur.com/rjPUJLm.jpeg",
  suplementos: "https://i.imgur.com/H9dGgiO.png",
  seguranca: "https://i.imgur.com/vmSwwXW.jpeg",
};

const PRODUCTS_BY_CATEGORY: Record<CategoryId, Product[]> = {
  gadgets: [
    {
      id: "gadgets-headphone-dapon",
      name: "Headphone Bluetooth Dapon 22h de Bateria",
      url: "https://mercadolivre.com/sec/2Pzv2YY",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_871158-MLA99870084511_112025-F.webp",
      priceHint: "Aprox. R$ 120,00",
      tagline: "Conforto e bateria para o dia todo.",
    },
    {
      id: "gadgets-fone-lenovo-xt62",
      name: "Fone Bluetooth Lenovo Livepods XT62",
      url: "https://mercadolivre.com/sec/2QMKGPq",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_676447-MLA95502873734_102025-F.webp",
      priceHint: "Aprox. R$ 90,00",
      tagline: "Som limpo e conexão estável.",
    },
    {
      id: "gadgets-caixa-som-boombox-10w",
      name: "Caixa de Som Bluetooth Boombox 10W com Rádio FM",
      url: "https://mercadolivre.com/sec/1tyLnxk",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_681719-MLA99467991212_112025-F.webp",
      priceHint: "Aprox. R$ 110,00",
      tagline: "Leve o som potente para qualquer lugar.",
    },
    {
      id: "gadgets-mouse-rgb",
      name: "Mouse Sem Fio Recarregável RGB Ergonômico",
      url: "https://mercadolivre.com/sec/2hrQ1Q1",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_746457-MLA103744403208_012026-F.webp",
      priceHint: "Aprox. R$ 60,00",
      tagline: "Mais conforto e estilo para o setup.",
    },
    {
      // PRODUTO NOVO
      id: "gadgets-powerbank-20000-lanterna",
      name: "Carregador Portátil Power Bank Display 20000mAh com Lanterna",
      url: "https://mercadolivre.com/sec/1RR4ugZ",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_928984-MLB89634311913_082025-F-carregador-portatil-power-bank-display-20000mah-com-lanterna.webp",
      priceHint: "Aprox. R$ 130,00",
      tagline: "Energia e lanterna sempre à mão.",
    },
    {
      id: "gadgets-powerbank-20000-led",
      name: "Power Bank 20.000mAh com Display LED",
      url: "https://mercadolivre.com/sec/1tBDgB8",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_758732-MLA103081906542_012026-F.webp",
      priceHint: "Aprox. R$ 140,00",
      tagline: "Carga rápida para o dia inteiro.",
    },
  ],
  barbear: [
    {
      id: "barbear-philips-oneblade-qp1424",
      name: "Philips OneBlade Aparador de Pelos QP1424",
      url: "https://mercadolivre.com/sec/1bW4WBC",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_977272-MLA99499029044_112025-F.webp",
      priceHint: "Aprox. R$ 200,00",
      tagline: "Apara barba e cabelo sem machucar.",
    },
    {
      id: "barbear-kemei-3em1-6558",
      name: "Kemei 3 em 1 Barbeador e Cortador KM-6558",
      url: "https://mercadolivre.com/sec/2ecPz5z",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_875537-MLA99498937668_112025-F.webp",
      priceHint: "Aprox. R$ 130,00",
      tagline: "Um único aparelho para tudo.",
    },
    {
      id: "barbear-kemei-1845",
      name: "Aparador de Pelos Kemei KM-1845 à Prova d’Água",
      url: "https://mercadolivre.com/sec/17e7cPD",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_828556-MLA99498810432_112025-F.webp",
      priceHint: "Aprox. R$ 100,00",
      tagline: "Resistente à água para o dia a dia.",
    },
    {
      id: "barbear-nixzen-corte",
      name: "Máquina de Cortar Cabelo Nixzen Elétrica",
      url: "https://mercadolivre.com/sec/2TPqpFj",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_669345-MLA100091972155_122025-F.webp",
      priceHint: "Aprox. R$ 90,00",
      tagline: "Corte potente em casa.",
    },
    {
      id: "barbear-kit-men-valente",
      name: "Kit Men Valente Completo para Barba",
      url: "https://mercadolivre.com/sec/2GxsLjM",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_716642-MLB105782814197_012026-F.webp",
      priceHint: "Aprox. R$ 80,00",
      tagline: "Barba alinhada e cheirosa.",
    },
    {
      id: "barbear-kemei-2024",
      name: "Barbeador Elétrico Kemei KM-2024 à Prova d’Água",
      url: "https://mercadolivre.com/sec/1hbMBbC",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_669652-MLA99972969327_112025-F.webp",
      priceHint: "Aprox. R$ 110,00",
      tagline: "Acabamento profissional em qualquer lugar.",
    },
  ],
  perfumes: [
    {
      id: "perfume-attracione-men",
      name: "Attracione Men 25ml com Feromônios",
      url: "https://mercadolivre.com/sec/12vnYFf",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_959293-MLA95095276551_102025-F.webp",
      priceHint: "Aprox. R$ 70,00",
      tagline: "Aroma marcante com feromônios.",
    },
    {
      id: "perfume-vodka-man",
      name: "Vodka Man Paris Elysees 100ml",
      url: "https://mercadolivre.com/sec/1FbrSjK",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_923566-MLU72756671736_112023-F.webp",
      priceHint: "Aprox. R$ 80,00",
      tagline: "Perfume intenso para a noite.",
    },
    {
      id: "perfume-natura-essencial-25",
      name: "Natura Essencial Masculino 25ml",
      url: "https://mercadolivre.com/sec/1ybKo4U",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_924071-MLU73551909829_122023-F.webp",
      priceHint: "Aprox. R$ 90,00",
      tagline: "Clássico elegante para o dia a dia.",
    },
    {
      id: "perfume-nautica-voyage",
      name: "Nautica Voyage Masculino 100ml",
      url: "https://mercadolivre.com/sec/1BAbuZd",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_856898-MLA87999531628_072025-F.webp",
      priceHint: "Aprox. R$ 150,00",
      tagline: "Fresco, ideal para dias quentes.",
    },
    {
      id: "perfume-eudora-club6",
      name: "Eudora Club 6 Exclusive",
      url: "https://mercadolivre.com/sec/1SeNcU3",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_910413-MLU74087910688_012024-F.webp",
      priceHint: "Aprox. R$ 110,00",
      tagline: "Assinatura olfativa de presença.",
    },
    {
      id: "perfume-natura-kaiak-100",
      name: "Natura Kaiak Masculino 100ml",
      url: "https://mercadolivre.com/sec/344Q7uM",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_682859-MLA82267255566_022025-F.webp",
      priceHint: "Aprox. R$ 100,00",
      tagline: "Ícone dos masculinos frescos.",
    },
  ],
  relogios: [
    {
      id: "relogio-digital-quadrado",
      name: "Relógio Digital Masculino Quadrado à Prova d’Água",
      url: "https://mercadolivre.com/sec/25E4RXc",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_876532-MLB74627796931_022024-F-relogio-masculino-digital-quadrado-a-prova-dagua-original.webp",
      priceHint: "Aprox. R$ 50,00",
      tagline: "Estilo retrô e resistente à água.",
    },
    {
      id: "relogio-saint-germain-murray",
      name: "Relógio Saint Germain Murray Black 40mm",
      url: "https://mercadolivre.com/sec/2HWjdAP",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_891309-MLA99974332749_112025-F.webp",
      priceHint: "Aprox. R$ 200,00",
      tagline: "Visual social elegante.",
    },
    {
      id: "relogio-yazole-332",
      name: "Relógio Masculino Yazole 332 Marrom",
      url: "https://mercadolivre.com/sec/13cJs7p",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_829021-MLA99460830540_112025-F.webp",
      priceHint: "Aprox. R$ 80,00",
      tagline: "Clássico marrom para o dia a dia.",
    },
    {
      id: "relogio-saint-germain-azul-42",
      name: "Relógio Clássico Saint Germain Prata/Azul 42mm",
      url: "https://mercadolivre.com/sec/22DXcpH",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_758835-MLA100010183395_122025-F.webp",
      priceHint: "Aprox. R$ 220,00",
      tagline: "Combinação prata e azul que chama atenção.",
    },
    {
      id: "relogio-smartwatch-s10",
      name: "Smartwatch S10 Série 10 com 2 Pulseiras",
      url: "https://mercadolivre.com/sec/1LLp4D2",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_861968-MLA105990049323_012026-F.webp",
      priceHint: "Aprox. R$ 130,00",
      tagline: "Smartwatch completo com 2 estilos de pulseira.",
    },
    {
      id: "relogio-smartwatch-ip68",
      name: "Smartwatch Masculino IP68 Notificações e Saúde",
      url: "https://mercadolivre.com/sec/2ksbKr6",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_698862-MLA103996126558_012026-F.webp",
      priceHint: "Aprox. R$ 160,00",
      tagline: "Monitoramento de saúde e resistência à água.",
    },
  ],
  suplementos: [
    {
      id: "sup-whey-max-baunilha-1kg",
      name: "Whey Pro Baunilha Max Titanium 1kg",
      url: "https://mercadolivre.com/sec/27hCvkX",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_694824-MLA99490288786_112025-F.webp",
      priceHint: "Aprox. R$ 90,00",
      tagline: "Proteína para ganho de massa e recuperação.",
    },
    {
      id: "sup-creatina-max-150",
      name: "Creatina Max Titanium 150g Sem Sabor",
      url: "https://mercadolivre.com/sec/1rW9NL2",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_860438-MLA99627617112_122025-F.webp",
      priceHint: "Aprox. R$ 50,00",
      tagline: "Mais força e explosão nos treinos.",
    },
    {
      // PRODUTO NOVO
      id: "sup-pre-treino-diabo-verde",
      name: "Pré-Treino Diabo Verde FTW 300g",
      url: "https://mercadolivre.com/sec/1psV1Mi",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_805404-MLA99564554280_122025-F.webp",
      priceHint: "Aprox. R$ 110,00",
      tagline: "Energia e foco extremos para o treino.",
    },
    {
      id: "sup-basic-whey-growth-1kg",
      name: "Basic Whey Growth 1kg Chocolate",
      url: "https://mercadolivre.com/sec/34cC4so",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_819000-MLA101180020755_122025-F.webp",
      priceHint: "Aprox. R$ 80,00",
      tagline: "Whey com ótimo custo-benefício.",
    },
    {
      id: "sup-creatina-darklab-1kg",
      name: "Creatina Monohidratada Dark Lab 1kg",
      url: "https://mercadolivre.com/sec/1EgTUww",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_848860-MLA99964507641_112025-F.webp",
      priceHint: "Aprox. R$ 140,00",
      tagline: "Creatina pura para alto rendimento.",
    },
    {
      id: "sup-nutri-whey-cookies-900",
      name: "Nutri Whey Cookies Integralmedica 900g",
      url: "https://mercadolivre.com/sec/1bkLzDq",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_996240-MLA99949682533_112025-F.webp",
      priceHint: "Aprox. R$ 100,00",
      tagline: "Mistura completa para energia e ganho de peso.",
    },
  ],
  seguranca: [
    {
      id: "seg-camera-ip-a8",
      name: "Câmera IP A8 Wi-Fi Externa à Prova d’Água",
      url: "https://mercadolivre.com/sec/1HnmEdi",
      highlight: true,
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_921837-MLA99700943906_122025-F.webp",
      priceHint: "Aprox. R$ 160,00",
      tagline: "Monitore áreas externas com visão noturna.",
    },
    {
      id: "seg-fechadura-papaiz-sl140",
      name: "Fechadura Digital Papaiz SL140 com Senha",
      url: "https://mercadolivre.com/sec/2puKeG1",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_641725-MLA99467966742_112025-F.webp",
      priceHint: "Aprox. R$ 250,00",
      tagline: "Mais segurança na entrada da sua casa.",
    },
    {
      id: "seg-sensor-porta-janela-zigbee",
      name: "Sensor Inteligente Porta/Janela Zigbee Tuya",
      url: "https://mercadolivre.com/sec/1nLzZFN",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_735454-MLU79130920202_092024-F.webp",
      priceHint: "Aprox. R$ 70,00",
      tagline: "Receba alerta sempre que abrir porta ou janela.",
    },
    {
      id: "seg-camera-lampada-360",
      name: "Câmera Lâmpada 360° Wi-Fi Full HD",
      url: "https://mercadolivre.com/sec/28RdtN7",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_726866-MLA99504979854_112025-F.webp",
      priceHint: "Aprox. R$ 90,00",
      tagline: "Câmera discreta com visão 360°.",
    },
    {
      id: "seg-video-porteiro-hd",
      name: "Vídeo Porteiro Sem Fio HD Bidirecional",
      url: "https://mercadolivre.com/sec/2evvJUE",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_613898-MLA99387215864_112025-F.webp",
      priceHint: "Aprox. R$ 230,00",
      tagline: "Veja e fale com quem está no portão.",
    },
    {
      id: "seg-baba-eletronica-vb603",
      name: "Babá Eletrônica VB603 Visão Noturna",
      url: "https://mercadolivre.com/sec/2zBTQGw",
      imageUrl:
        "https://http2.mlstatic.com/D_NQ_NP_2X_789928-MLA99885017637_112025-F.webp",
      priceHint: "Aprox. R$ 150,00",
      tagline: "Acompanhe seu bebê com visão noturna.",
    },
  ],
};

function App() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryId>("perfumes");
  const [clicks, setClicks] = useState<ClicksState>({});

  const baseProducts = PRODUCTS_BY_CATEGORY[activeCategory];
  const categoryImage = CATEGORY_IMAGES[activeCategory];
  const currentCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label || "";

  // ordena: mais clicados primeiro, depois TOP
  const products = [...baseProducts].sort((a, b) => {
    const ca = clicks[a.id] || 0;
    const cb = clicks[b.id] || 0;
    if (cb !== ca) return cb - ca; // mais clicado sobe
    const ha = a.highlight ? 1 : 0;
    const hb = b.highlight ? 1 : 0;
    if (hb !== ha) return hb - ha; // TOP sobe
    return 0;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setClicks(JSON.parse(saved));
    } catch {
      // ignora erros de storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clicks));
    } catch {
      // ignora erros de storage
    }
  }, [clicks]);

  function handleClick(product: Product) {
    setClicks((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    window.open(product.url, "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0d1017] to-[#000000] text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-emerald-500/12 bg-white/5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.9)] px-6 py-8 space-y-6">
          {/* topo linktree */}
          <section className="flex flex-col items-center text-center gap-3">
            <img
              src={categoryImage}
              alt={currentCategoryLabel}
              className="w-24 h-24 rounded-3xl object-cover border border-white/30 shadow-lg shadow-emerald-500/30"
            />

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Homem de Valor
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Seu hub premium de produtos masculinos, barba, estilo,
                suplementos e segurança para a família.
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Seleção pessoal de produtos que eu realmente usaria.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-300/90">
                {currentCategoryLabel}
              </p>
            </div>
          </section>

          {/* filtros de categoria */}
          <section className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={[
                    "whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all",
                    isActive
                      ? "bg-white text-slate-900 border-white shadow-md shadow-emerald-500/40"
                      : "bg-white/5 text-slate-100/80 border-white/15 hover:bg-white/10 hover:border-white/40",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              );
            })}
          </section>

          {/* micro orientação */}
          <section className="px-1 -mt-1">
            <p className="text-[11px] text-slate-400">
              Escolha um produto e clique em{" "}
              <span className="text-emerald-300 font-semibold">
                “Ver oferta”
              </span>{" "}
              para abrir a página oficial no Mercado Livre.
            </p>
          </section>

          {/* cards dos produtos – horizontal + glass/neon */}
          <section className="space-y-3">
            {products.map((product) => {
              const count = clicks[product.id] || 0;
              const imageSrc = product.imageUrl || categoryImage;

              const baseCardClasses = [
                "w-full rounded-2xl border px-3 py-3 text-sm",
                "bg-white/8 border-white/20",
                "shadow-[0_14px_45px_rgba(0,0,0,0.75)]",
                "flex items-center gap-3",
                "backdrop-blur-xl",
                "hover:bg-white/14 hover:border-emerald-400/80 hover:shadow-emerald-500/30",
                "transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]",
              ];

              if (product.highlight) {
                baseCardClasses.push(
                  "border-emerald-400/80 bg-emerald-400/15 animate-pulse"
                );
              }

              return (
                <button
                  key={product.id}
                  onClick={() => handleClick(product)}
                  className="w-full text-left"
                >
                  <div className={baseCardClasses.join(" ")}>
                    {/* foto do produto */}
                    <div className="relative shrink-0">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-emerald-300/40 shadow-md shadow-emerald-500/30"
                      />
                      {product.highlight && (
                        <span className="absolute -top-1 -right-1 rounded-full bg-emerald-500 text-[9px] font-semibold px-2 py-[2px] text-slate-900 shadow">
                          TOP
                        </span>
                      )}
                    </div>

                    {/* texto, tagline, preço e contador */}
                    <div className="flex-1 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[13px] leading-snug">
                          {product.name}
                        </p>
                        {product.tagline && (
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            {product.tagline}
                          </p>
                        )}
                        {product.priceHint && (
                          <p className="text-[11px] text-emerald-300 mt-0.5">
                            {product.priceHint}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end text-[10px] text-slate-200">
                        <span className="font-semibold text-emerald-300">
                          Cliques: {count}
                        </span>
                        <span className="opacity-80 mt-[2px]">
                          Ver oferta →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {/* mini CTA antes do rodapé */}
          <section className="pt-1">
            <p className="text-[11px] text-slate-300 text-center">
              Escolha o que combina com você, clique em{" "}
              <span className="text-emerald-300 font-semibold">
                “Ver oferta”
              </span>{" "}
              e finalize com segurança no Mercado Livre.
            </p>
          </section>

          {/* rodapé */}
          <section className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex flex-col items-center gap-1">
            <span>
              © {new Date().getFullYear()} Homem de Valor · Afiliado Mercado
              Livre
            </span>
            <span className="text-[10px] text-slate-500">
              Produtos ofertados através do Mercado Livre. Valores aproximados,
              consulte a página da oferta para o preço atualizado.
            </span>
            <span className="text-[10px] text-slate-500">
              Os cliques são contabilizados apenas neste dispositivo.
            </span>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
