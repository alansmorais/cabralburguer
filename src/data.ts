import { Product, Combo } from './types';

export const CATEGORIES = [
  { id: 'hamburgueres', name: 'Hambúrgueres', icon: 'lunch_dining' },
  { id: 'combos', name: 'Combos Especiais', icon: 'fastfood' },
  { id: 'hotdogs', name: 'Hot Dogs', icon: 'kebab_dining' },
  { id: 'porcoes', name: 'Porções & Entradas', icon: 'tapas' },
  { id: 'shakes', name: 'Sobremesas & Shakes', icon: 'icecream' },
  { id: 'bebidas', name: 'Sucos & Bebidas', icon: 'local_bar' },
];

export const PRODUCTS: Product[] = [
  // Hambúrgueres
  {
    id: 'h1',
    title: 'Costela',
    description: 'Pão de Brioche selado, hambúrguer artesanal 120g grelhado na brasa, 100g de costela bovina desfiada no fogo lento, cebola crispy dourada, bacon crocante e molho autoral da casa (maionese verde).',
    price: 43.90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQTKv6xlW_6we0R05tx7LPipXIn8aq6rzh-27aW2X1T7FJZzoMgqg0_wGHa6FzqOQ_XZn_s21sfSEOlRtW_4h0P6U46ihQvqJVuh8CSFzke0Lmef7DpAa7DosuEcYJE3qgRDNQKSrf8kF_jv1Z7uZJX3HzReAzWyLDns4jevXzP3S5WVMwpeHti6s2DIBDuNA8JeKR0CEu4aJzZ04k_s0x7spHuzzx3FveuMEcRRv-eJ-IabEW5ho8eg',
    badge: 'MAIS PEDIDO',
    badgeType: 'mais-pedido',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h2',
    title: 'Cambury',
    description: 'Pão de Brioche macio, hambúrguer artesanal 150g de puro frango empanado, recheado com Catupiry original cremoso, alface americana fresca, tomate e molho da casa.',
    price: 37.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    badge: 'FRANGO & CATUPIRY',
    badgeType: 'frango-catupiry',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h3',
    title: 'Juquey',
    description: 'Pão com gergelim tostado, hambúrguer artesanal 150g de linguiça especial recheado com mussarela derretida, queijo prato, alface americana, fatias de tomate fresco e molho da casa.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    badge: 'LINGUIÇA ARTESANAL',
    badgeType: 'linguica',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h4',
    title: 'Maresias',
    description: 'Pão de Brioche na manteiga, hambúrguer artesanal 120g na brasa, creme de cheddar cremoso, anéis crocantes de onion rings e generosas tiras de bacon crocante.',
    price: 37.90,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    badgeType: 'none',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h5',
    title: 'Paúba',
    description: 'Pão de Brioche, blend artesanal 120g, bloco de 100g de mussarela empanada e frita na farinha Panko japonesa, alface americana, tomate fatiado, cebola roxa fresca e maionese verde artesanal.',
    price: 40.90,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
    badge: 'PANKO CRUNCH',
    badgeType: 'panko',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h6',
    title: 'Santiago',
    description: 'Pão tostado com gergelim, hambúrguer artesanal 120g na brasa viva, cheddar cremoso e cebola caramelizada artesanalmente no molho shoyu especial.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    badgeType: 'none',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h7',
    title: 'Calhetas',
    description: 'Pão with gergelim, blend 120g recheado com cheddar, coberto com camada extra de queijo cheddar derretido, tiras crocantes de bacon e cebola crispy artesanal.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    badge: 'CHEDDAR EXPLOSION',
    badgeType: 'cheddar',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h8',
    title: 'Barê',
    description: 'Pão com gergelim, duplo hambúrguer artesanal somando 240g de carne suculenta, Catupiry original cremoso, alho dourado frito crocante e fatias de bacon.',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80',
    badge: '240G DUPLO',
    badgeType: 'duplo',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h9',
    title: 'Toque Toque',
    description: 'Pão com gergelim, hambúrguer 120g na brasa, alface americana fresca, mussarela derretida, tiras de bacon crocante e cebola crispy caseira.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    badgeType: 'none',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h10',
    title: 'Vegano Grão de Bico',
    description: 'Pão de brioche vegano, hambúrguer 150g de grão de bico selecionado com sementes de linhaça, empanado na farinha Panko, alface, tomate fatiado e molho vegano da casa.',
    price: 37.90,
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80',
    badge: '100% VEGANO',
    badgeType: 'vegano',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h11',
    title: 'Pitangueiras',
    description: 'A essência do hambúrguer clássico: Pão de Brioche macio e amanteigado, hambúrguer artesanal 120g grelhado no ponto e fatia generosa de queijo cheddar derretido.',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80',
    badgeType: 'none',
    category: 'hamburgueres',
    available: true
  },
  {
    id: 'h12',
    title: 'Una',
    description: 'Pão de gergelim tostado na manteiga, blend artesanal 120g grelhado ao ponto, queijo mussarela derretido, fatias de alface americana fresca e tomate italiano.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=600&q=80',
    badgeType: 'none',
    category: 'hamburgueres',
    available: true
  },

  // Hot Dogs
  {
    id: 'd1',
    title: 'Arrastão',
    description: 'Pão 20cm macio, maionese artesanal da casa, 2 salsichas suculentas, purê cremoso de batata, milho, ervilha, catchup, mostarda e batata palha fininha.',
    price: 21.90,
    image: 'https://images.unsplash.com/photo-1627053424445-982d1594f54e?auto=format&fit=crop&w=600&q=80',
    category: 'hotdogs',
    available: true
  },
  {
    id: 'd2',
    title: 'Barra do Sahy',
    description: 'Pão 20cm, maionese artesanal, purê caseiro de batata, costela bovina desfiada no bafo, mussarela derretida maçaricada, cebolinha fresca e molho barbecue.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80',
    badge: 'ESPECIAL COSTELA',
    badgeType: 'mais-pedido',
    category: 'hotdogs',
    available: true
  },
  {
    id: 'd3',
    title: 'Juréia',
    description: 'Contra filé em cubos salteados na brasa com generoso Catupiry original cremoso, maionese artesanal e purê.',
    price: 31.90,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    badge: 'Esgotado hoje',
    badgeType: 'none',
    category: 'hotdogs',
    available: false
  },
  {
    id: 'd4',
    title: 'Boiçucanga',
    description: 'Frango desfiado artesanal com combinação cremosa de catupiry and cheddar, bacon crocante em cubos, maionese artesanal e purê.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    badge: 'Esgotado hoje',
    badgeType: 'none',
    category: 'hotdogs',
    available: false
  },

  // Porções & Acompanhamentos
  {
    id: 'p1',
    title: 'Batata Frita Premium (500g)',
    description: '500g de batatas selecionadas, molho especial 2 queijos e costela desfiada por cima.',
    price: 46.90,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    badge: 'RECOMENDAÇÃO DO CHEF',
    badgeType: 'chef',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p2',
    title: 'Batata Cheddar & Bacon (500g)',
    description: '500g de batata frita bem crocante coberta com cheddar derretido e bacon em cubos.',
    price: 43.90,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p3',
    title: 'Batata Tradicional (Individual - 150g)',
    description: 'Batatas fritas tradicionais (150g), crocantes por fora e macias por dentro, salpicadas com sal de especiarias.',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p4',
    title: 'Batata Tradicional (Grande - 500g)',
    description: 'Batatas fritas tradicionais (500g) para compartilhar, crocantes por fora e macias por dentro, salpicadas com sal de especiarias.',
    price: 33.90,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p5',
    title: 'Coxinha Sem Massa (6 unid)',
    description: 'Feita exclusivamente com frango temperado desfiado, empanada com casquinha ultrafina e super crocante.',
    price: 29.00,
    image: 'https://images.unsplash.com/photo-1562601579-599dec554e85?auto=format&fit=crop&w=600&q=80',
    badge: 'PURO FRANGO',
    badgeType: 'vegano',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p6',
    title: 'Onion Rings (Pequena - 10 unid)',
    description: 'Anéis de cebola selecionados e empanados com massa temperada artesanal super crocante.',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p7',
    title: 'Onion Rings (Grande - 20 unid)',
    description: 'Anéis de cebola selecionados e empanados com massa temperada artesanal, acompanha molho barbecue da casa.',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },
  {
    id: 'p8',
    title: 'Nuggets de Frango (10 unid)',
    description: 'Empanados dourados com peito de frango temperado. Acompanha molho da casa à escolha.',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    category: 'porcoes',
    available: true
  },

  // Shakes & Sobremesas
  {
    id: 's1',
    title: 'Shake Ovomaltine',
    description: 'Sorvete de baunilha premium batido com flocos crocantes de Ovomaltine.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    badge: 'Cremoso 400ml',
    badgeType: 'linguica',
    category: 'shakes',
    available: true
  },
  {
    id: 's2',
    title: 'Shake Nutella',
    description: 'Creme de avelã autêntico Ferrero batido com sorvete artesanal de creme.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    badge: 'Cremoso 400ml',
    badgeType: 'linguica',
    category: 'shakes',
    available: true
  },
  {
    id: 's3',
    title: 'Pudim de Leite (120g)',
    description: 'Super cremoso, sem furinhos, com calda de caramelo brilhante e aveludada.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80',
    badge: 'Receita da Casa',
    badgeType: 'vegano',
    category: 'shakes',
    available: true
  },

  // Bebidas
  {
    id: 'b1',
    title: 'Suco de Laranja Natural (500ml)',
    description: 'Espremido na hora diretamente da fruta selecionada, sem conservantes, refrescante e gelado.',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  },
  {
    id: 'b2',
    title: 'Limonada Suíça / Natural (500ml)',
    description: 'Feita com limões frescos, espremidos e preparados na hora com gelo, super refrescante.',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  },
  {
    id: 'b3',
    title: 'Suco Polpa Morango / Abacaxi / Hortelã',
    description: 'Preparado com polpa de fruta premium selecionada. Informe o sabor de sua escolha nas observações.',
    price: 11.90,
    image: 'https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  },
  {
    id: 'b4',
    title: 'Cerveja Heineken Long Neck (330ml)',
    description: 'Cerveja premium Heineken estupidamente gelada para harmonizar com seu burger artesanal.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  },
  {
    id: 'b5',
    title: 'Cerveja Budweiser Long Neck (330ml)',
    description: 'Cerveja long neck Budweiser leve e gelada no ponto.',
    price: 13.00,
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  },
  {
    id: 'b6',
    title: 'Refrigerante Lata (Coca, Guaraná, Fanta)',
    description: 'Coca-cola, Guaraná Antarctica ou Fanta lata gelados de 350ml.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    category: 'bebidas',
    available: true
  }
];

export const COMBOS: Combo[] = [
  {
    id: 'c1',
    title: 'Combo Hambúrguer de Costela',
    description: 'O burger de costela artesanal desfiada por cima do blend 120g grelhado, acompanhado de uma lata gelada de Guaraná 269ml e uma porção de fritas sequinhas crocantes.',
    price: 54.90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANXgq40tqgdi1XworJg_HBsnd9d2kHMglzEON-eJm_HQ-2ZlANDEuWWrQUynBNvhmttEHUGsVSDjGPmS9-aceOp6OX8RmqtfMHq8oAJDHwlsizOWuJVGqWMgzQf_om2_QZl_C25sfPRgPaoFCFxAzunqx9KnTKW3mLhVAPOs3hpHVe6G0pgAKcYKaeOfFq2Fkqk4b1SsPI3eNp88JVK_dhXoZiVS4VXmLIbN1kEVOUba4k_alj5adSWA',
    badge: 'MAIS VENDIDO',
    category: 'combos',
    available: true
  },
  {
    id: 'c2',
    title: 'Combo Maresias',
    description: 'Pão de Brioche na manteiga, hambúrguer artesanal 120g na brasa, creme de cheddar cremoso, onion rings e tiras de bacon crocante + Guaraná + Fritas.',
    price: 52.90,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
    available: true
  },
  {
    id: 'c3',
    title: 'Combo Barê (240g)',
    description: 'Double burger artesanal somando 240g na brasa, Catupiry original, alho frito, bacon crocante + Guaraná lata gelado + Fritas sequinhas.',
    price: 57.90,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
    available: true
  },
  {
    id: 'c4',
    title: 'Combo Juquey',
    description: 'Pão de gergelim tostado, linguiça especial 150g recheada com mussarela derretida, queijo prato, salada fresca + Guaraná + Fritas.',
    price: 53.90,
    image: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
    available: true
  },
  {
    id: 'c5',
    title: 'Combo Cambury',
    description: 'Pão de Brioche, 150g de frango empanado crocante, recheado com Catupiry, salada de alface and tomate + Guaraná + Fritas.',
    price: 51.90,
    image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3de3?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
    available: true
  },
  {
    id: 'c6',
    title: 'Combo Paúba',
    description: 'Pão de Brioche, blend artesanal 120g na brasa, 140g queijo Brie empanado panko super crocante + Guaraná + Fritas.',
    price: 54.90,
    image: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
    available: true
  },
  {
    id: 'c7',
    title: 'Combo Vegetariano Grão de Bico',
    description: 'Hambúrguer de grão de bico 150g empanado na farinha Panko japonesa + Guaraná lata gelado + Fritas sequinhas crocantes.',
    price: 48.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    badge: 'OPÇÃO SAUDÁVEL & DELICIOSA',
    category: 'combos',
    available: true
  }
];

export const HISTORY_ORDERS = [
  {
    id: 'o-1',
    date: '18/10/2026',
    itemsSummary: '1x Combo Costela + 1x Shake Nutella',
    total: 77.80,
    items: [
      {
        id: 'hist-i1',
        product: COMBOS[0],
        quantity: 1,
        addedOptions: [],
        removedIngredients: []
      },
      {
        id: 'hist-i2',
        product: PRODUCTS.find(p => p.id === 's2')!,
        quantity: 1,
        addedOptions: [],
        removedIngredients: []
      }
    ]
  }
];
