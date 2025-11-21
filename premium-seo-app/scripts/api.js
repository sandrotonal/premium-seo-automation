// ===== AI API SERVICE =====

class AIAPIService {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.baseURL = 'https://api.openai.com/v1';
        this.isConfigured = !!this.apiKey;
        
        // Context for SEO-focused responses
        this.systemPrompt = `Sen profesyonel bir SEO uzmanısın ve AI asistanısın. Türkçe cevaplar ver. 
        
Kullanıcılar SEO, anahtar kelime araştırması, sayfa optimizasyonu, backlink, rakip analizi, teknik SEO ve 
web sitesi performansı konularında sorular soruyor. 

Her zaman:
- Pratik ve uygulanabilir tavsiyeler ver
- Türkçe olarak cevapla
- Konu SEO ile ilgili olduğunda detaylı açıklamalar yap
- Gerekirse örnekler ve adımlar sun
- Güncel SEO trendleri ve Google algoritması hakkında bilgi ver`;

        // Fallback responses for when API is not configured
        this.fallbackResponses = {
            greeting: [
                "Merhaba! Ben SEO AI asistanınızım. Size nasıl yardımcı olabilirim?",
                "Hoş geldiniz! Anahtar kelime araştırması, rakip analizi veya SEO optimizasyonu hakkında herhangi bir sorunuz var mı?",
                "Selam! SEO konularında size destek olmaktan mutluluk duyarım. Hangi konuda yardıma ihtiyacınız var?"
            ],
            keywords: [
                "Anahtar kelime araştırması için öncelikle hedef kitlenizi belirleyin. Ardından sektörünüzle ilgili kelimeleri toplayarak Google Keyword Planner, Ubersuggest veya Ahrefs kullanabilirsiniz.",
                "Etkili anahtar kelime stratejisi için uzun kuyruklu kelimeler (long-tail keywords) kullanın. Bu kelimeler daha az rekabetçi ve daha yüksek dönüşüm oranlarına sahiptir.",
                "Anahtar kelime araştırmasında şu adımları takip edin: 1) Ana konularınızı belirleyin, 2) Rakip analizi yapın, 3) Keyword difficulty'yi kontrol edin, 4) Search intent'i analiz edin."
            ],
            seo: [
                "SEO optimizasyonu için şu faktörlere dikkat edin: Sayfa hızı, mobil uyumluluk, meta başlık ve açıklamalar, içerik kalitesi, teknik SEO ve backlink profili.",
                "Teknik SEO'da en önemli faktörler: XML sitemap, robots.txt, site haritası, 404 error sayfalarını düzeltme, iç link yapısı ve sayfa yükleme hızı.",
                "İçerik SEO'su için: Benzersiz ve değerli içerik üretin, başlık etiketleri (H1, H2, H3) doğru kullanın, görsel alt text'lerini doldurun ve iç linkleme yapın."
            ],
            competitors: [
                "Rakip analizi için öncelikle ana rakiplerinizi belirleyin. Ardından onların backlink profillerini, anahtar kelime stratejilerini ve içerik yaklaşımlarını analiz edin.",
                "Rakip analizi araçları: SEMrush, Ahrefs, SimilarWeb ve Google Search Console. Bu araçlar ile rakibinizin güçlü ve zayıf yönlerini tespit edebilirsiniz.",
                "Rakip stratejisini analiz ederken: Hangi anahtar kelimelerde sıralandıkları, hangi içerik türlerini kullandıkları, sosyal medya stratejileri ve backlink kaynaklarını inceleyin."
            ],
            technical: [
                "Teknik SEO kontrolleri: 1) Sayfa hızı testi (Google PageSpeed Insights), 2) Mobil uyumluluk testi, 3) XML sitemap varlığı, 4) HTTPS sertifikası, 5) 404 hata sayfalarını düzeltin.",
                "Core Web Vitals optimizasyonu: LCP (Largest Contentful Paint) < 2.5s, FID (First Input Delay) < 100ms, CLS (Cumulative Layout Shift) < 0.1 olmalı.",
                "Site yapısı optimizasyonu için: Kategori sayfaları mantıklı bir hiyerarşi oluşturun, breadcrumbs ekleyin, internal linking yapın ve URL yapısını optimize edin."
            ],
            backlinks: [
                "Kaliteli backlink stratejileri: Guest posting, broken link building, resource page link building, influencer outreach ve içerik pazarlama.",
                "Backlink kalitesi için: Domain authority, spam score, anchor text çeşitliliği ve doğal link profiline dikkat edin.",
                "Link building'de kaçınılacaklar: PBN (Private Blog Network), düşük kaliteli dizin siteleri, aşırı anchor text optimizasyonu ve satın alınmış linkler."
            ],
            tools: [
                "SEO araçları önerilerim: Ücretsiz - Google Search Console, Google Analytics, PageSpeed Insights. Ücretli - SEMrush, Ahrefs, Moz, Screaming Frog.",
                "Anahtar kelime araştırma araçları: Google Keyword Planner, Ubersuggest, Answer The Public, AlsoAsked ve Google Trends.",
                "Teknik SEO araçları: Screaming Frog, GTmetrix, Pingdom, SEMrush Site Audit ve Google Mobile-Friendly Test."
            ],
            default: [
                "SEO konusunda size yardımcı olmaktan mutluluk duyarım. Anahtar kelime araştırması, rakip analizi, teknik SEO veya içerik optimizasyonu hakkında sorularınızı sorabilirsiniz.",
                "Bu konuda daha spesifik yardım istiyorsanız lütfen detay verin. SEO, anahtar kelimeler, backlink veya teknik optimizasyon konularından hangisinde destek istiyorsunuz?",
                "SEO stratejinizi geliştirmek için hangi alanda yardıma ihtiyacınız var? Anahtar kelime araştırması, içerik optimizasyonu veya rakip analizi konularında destek verebilirim."
            ]
        };
    }

    // Check if API is configured
    isApiConfigured() {
        return this.isConfigured && this.apiKey.length > 0;
    }

    // Set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        this.isConfigured = !!apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    // Get API key from localStorage
    getApiKey() {
        return localStorage.getItem('openai_api_key') || '';
    }

    // Remove API key
    removeApiKey() {
        this.apiKey = '';
        this.isConfigured = false;
        localStorage.removeItem('openai_api_key');
    }

    // Main method to get AI response
    async getResponse(userMessage) {
        if (!this.isApiConfigured()) {
            return this.getFallbackResponse(userMessage);
        }

        try {
            const response = await this.callOpenAI(userMessage);
            return response;
        } catch (error) {
            console.error('API call failed:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    // Call OpenAI API
    async callOpenAI(userMessage) {
        const messages = [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userMessage }
        ];

        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);
    }

    // Get fallback response when API is not available
    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for different response categories
        if (this.containsWords(message, ['merhaba', 'selam', 'naber', 'hello', 'hi'])) {
            return this.getRandomResponse('greeting');
        }
        
        if (this.containsWords(message, ['anahtar kelime', 'keyword', 'kelime', 'kelimeler'])) {
            return this.getRandomResponse('keywords');
        }
        
        if (this.containsWords(message, ['seo', 'optimizasyon', 'sıralama', 'ranking'])) {
            return this.getRandomResponse('seo');
        }
        
        if (this.containsWords(message, ['rakip', 'competitor', 'rakipler'])) {
            return this.getRandomResponse('competitors');
        }
        
        if (this.containsWords(message, ['teknik', 'technical', 'hız', 'speed', 'core web vitals'])) {
            return this.getRandomResponse('technical');
        }
        
        if (this.containsWords(message, ['backlink', 'link', 'bağlantı'])) {
            return this.getRandomResponse('backlinks');
        }
        
        if (this.containsWords(message, ['araç', 'tool', 'semrush', 'ahrefs'])) {
            return this.getRandomResponse('tools');
        }
        
        return this.getRandomResponse('default');
    }

    // Helper method to check if message contains words
    containsWords(message, words) {
        return words.some(word => message.includes(word));
    }

    // Helper method to get random response from category
    getRandomResponse(category) {
        const responses = this.fallbackResponses[category] || this.fallbackResponses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Test API connection
    async testConnection() {
        if (!this.isApiConfigured()) {
            return { success: false, message: 'API key bulunamadı' };
        }

        try {
            const testMessage = 'Merhaba, bu bir bağlantı testidir.';
            const response = await this.callOpenAI(testMessage);
            return { success: true, message: 'Bağlantı başarılı!', response: response };
        } catch (error) {
            return { success: false, message: `Bağlantı hatası: ${error.message}` };
        }
    }

    // Real SEO APIs Integration
    async performKeywordAnalysis(topic) {
        // Simulate external API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData = {
            primary: `${topic} araçları`,
            longTail: [
                `${topic} nedir`,
                `${topic} nasıl yapılır`,
                `${topic} stratejileri`,
                `${topic} optimizasyonu`,
                `${topic} best practices`
            ],
            related: [
                'dijital pazarlama',
                'web sitesi optimizasyonu',
                'arama motoru pazarlaması',
                'içerik pazarlama',
                'sosyal medya optimizasyonu'
            ],
            difficulty: Math.floor(Math.random() * 40) + 30,
            volume: Math.floor(Math.random() * 5000) + 1000,
            competition: Math.random() > 0.6 ? 'Yüksek' : Math.random() > 0.3 ? 'Orta' : 'Düşük'
        };
        
        return mockData;
    }

    async analyzeCompetitor(domain) {
        // Simulate competitor analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAnalysis = {
            domain: domain,
            seoScore: Math.floor(Math.random() * 30) + 60,
            backlinks: Math.floor(Math.random() * 5000) + 1000,
            organicKeywords: Math.floor(Math.random() * 1000) + 200,
            topKeywords: [
                { keyword: 'ana hizmet', position: Math.floor(Math.random() * 10) + 1 },
                { keyword: 'ürün kategorisi', position: Math.floor(Math.random() * 20) + 1 },
                { keyword: 'marka adı', position: Math.floor(Math.random() * 5) + 1 }
            ],
            strengths: [
                'Güçlü backlink profili',
                'Hızlı sayfa yükleme',
                'Mobil uyumluluk',
                'Kaliteli içerik'
            ],
            weaknesses: [
                'Meta açıklamalar eksik',
                'İç linkleme zayıf',
                'Teknik SEO sorunları',
                'Görsel optimizasyonu düşük'
            ]
        };
        
        return mockAnalysis;
    }

    async checkTechnicalSEO(url) {
        // Simulate technical SEO check
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const mockTechnical = {
            url: url,
            overall: Math.floor(Math.random() * 25) + 70,
            pageSpeed: {
                score: Math.floor(Math.random() * 30) + 60,
                issues: [
                    'Resim optimizasyonu gerekli',
                    'CSS dosyaları sıkıştırılmalı',
                    'JavaScript minifikasyonu gerekli'
                ]
            },
            mobile: {
                score: Math.floor(Math.random() * 20) + 75,
                issues: [
                    'Touch elementleri küçük',
                    'Sayfa viewport optimizasyonu'
                ]
            },
            coreWebVitals: {
                lcp: Math.random() > 0.5 ? 'İyi' : 'Geliştirilebilir',
                fid: Math.random() > 0.7 ? 'İyi' : 'Yavaş',
                cls: Math.random() > 0.4 ? 'İyi' : 'Sorunlu'
            },
            issues: [
                { type: 'error', description: 'Meta description eksik', priority: 'Yüksek' },
                { type: 'warning', description: 'Alt etiketleri eksik', priority: 'Orta' },
                { type: 'info', description: 'Internal linking artırılabilir', priority: 'Düşük' }
            ]
        };
        
        return mockTechnical;
    }
    }
}

// Create global instance
window.aiAPI = new AIAPIService();