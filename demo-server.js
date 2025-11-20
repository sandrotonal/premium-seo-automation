const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Content-Type': 'application/json'
};

// Helper functions
const sendResponse = (res, statusCode, data, headers = {}) => {
  res.writeHead(statusCode, { ...corsHeaders, ...headers });
  res.end(JSON.stringify(data, null, 2));
};

const sendHTML = (res, statusCode, html) => {
  res.writeHead(statusCode, { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};

// Parse request body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

// Routes and handlers
const routes = {
  // Health check
  '/health': (req, res, method) => {
    sendResponse(res, 200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'development',
      version: '1.0.0',
      service: 'AutoCloser Agent Platform'
    });
  },

  // Home/API overview
  '/': (req, res, method) => {
    sendResponse(res, 200, {
      message: '🤖 AutoCloser Agent Platform',
      description: 'AI Sales-Closing Chatbot Platform - Convert leads into paying customers',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api',
        documentation: '/docs',
        merchant: {
          register: '/api/auth/register',
          login: '/api/auth/login',
          dashboard: '/api/merchants/dashboard'
        },
        conversations: {
          list: '/api/conversations',
          messages: '/api/conversations/demo/messages'
        },
        ai: {
          analyze: '/api/ai/analyze-message',
          generate: '/api/ai/generate-response',
          qualify: '/api/ai/qualify-lead'
        },
        whatsapp: {
          status: '/api/whatsapp/status'
        },
        payments: {
          plans: '/api/payments/plans'
        }
      },
      features: [
        '🎯 AI-powered lead qualification',
        '💬 WhatsApp Business integration',
        '💰 Automated payment processing',
        '📊 Real-time analytics dashboard',
        '🔄 Human handoff system',
        '📱 Mobile app support'
      ]
    });
  },

  // Documentation page
  '/docs': (req, res, method) => {
    const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoCloser Agent API - Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 40px; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .content { padding: 40px; }
        .demo-note { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.5rem; }
        .endpoint { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #007bff; transition: all 0.3s ease; }
        .endpoint:hover { transform: translateX(5px); box-shadow: 0 5px 15px rgba(0,123,255,0.2); }
        .method { font-weight: bold; color: #007bff; font-size: 1.1rem; }
        .url { font-family: 'Courier New', monospace; background: #e9ecef; padding: 5px 10px; border-radius: 5px; margin: 0 10px; color: #495057; }
        .description { color: #666; margin-top: 10px; font-size: 0.95rem; }
        .try-button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; text-decoration: none; display: inline-block; transition: background 0.3s; }
        .try-button:hover { background: #0056b3; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AutoCloser Agent API</h1>
            <p>AI Sales-Closing Chatbot Platform - Demo Documentation</p>
        </div>
        
        <div class="content">
            <div class="demo-note">
                <strong>🎭 Demo Mode Aktif:</strong> Bu API demo modunda çalışıyor. Tüm endpoint'ler örnek veriler döndürür. Gerçek entegrasyon için tam proje yüklenmelidir.
            </div>
            
            <div class="section">
                <h3>🚀 Hızlı Başlangıç</h3>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/health</span>
                    <div class="description">Sistem durumunu kontrol et</div>
                    <a href="/health" class="try-button" target="_blank">Dene</a>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/</span>
                    <div class="description">API genel bakış ve endpoint listesi</div>
                    <a href="/" class="try-button" target="_blank">Dene</a>
                </div>
            </div>
            
            <div class="section">
                <h3>🔐 Kimlik Doğrulama</h3>
                <div class="endpoint">
                    <span class="method">POST</span><span class="url">/api/auth/register</span>
                    <div class="description">Yeni tedarikçi kaydı</div>
                    <button class="try-button" onclick="testRegister()">Test Register</button>
                </div>
                <div class="endpoint">
                    <span class="method">POST</span><span class="url">/api/auth/login</span>
                    <div class="description">Giriş yap</div>
                    <button class="try-button" onclick="testLogin()">Test Login</button>
                </div>
            </div>
            
            <div class="section">
                <h3>💬 Konuşmalar</h3>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/api/conversations</span>
                    <div class="description">Tüm konuşmaları listele</div>
                    <a href="/api/conversations" class="try-button" target="_blank">Dene</a>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/api/conversations/demo/messages</span>
                    <div class="description">Demo konuşma mesajlarını getir</div>
                    <a href="/api/conversations/demo/messages" class="try-button" target="_blank">Dene</a>
                </div>
            </div>
            
            <div class="section">
                <h3>🤖 AI Motor</h3>
                <div class="endpoint">
                    <span class="method">POST</span><span class="url">/api/ai/analyze-message</span>
                    <div class="description">Mesaj analizi ve niyet tespiti</div>
                    <button class="try-button" onclick="testAIAnalyze()">AI Analizi Dene</button>
                </div>
                <div class="endpoint">
                    <span class="method">POST</span><span class="url">/api/ai/generate-response</span>
                    <div class="description">AI yanıt üretimi</div>
                    <button class="try-button" onclick="testAIGenerate()">AI Yanıt Dene</button>
                </div>
                <div class="endpoint">
                    <span class="method">POST</span><span class="url">/api/ai/qualify-lead</span>
                    <div class="description">Lead kalifikasyonu</div>
                    <button class="try-button" onclick="testQualifyLead()">Lead Kalifikasyonu</button>
                </div>
            </div>
            
            <div class="section">
                <h3>📊 Dashboard</h3>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/api/merchants/dashboard</span>
                    <div class="description">Tedarikçi dashboard verileri</div>
                    <a href="/api/merchants/dashboard" class="try-button" target="_blank">Dashboard Görüntüle</a>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/api/whatsapp/status</span>
                    <div class="description">WhatsApp bağlantı durumu</div>
                    <a href="/api/whatsapp/status" class="try-button" target="_blank">WhatsApp Durumu</a>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span><span class="url">/api/payments/plans</span>
                    <div class="description">Abonelik planları</div>
                    <a href="/api/payments/plans" class="try-button" target="_blank">Planları Görüntüle</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🤖 AutoCloser Agent Platform Demo | <strong>MiniMax Agent</strong> tarafından geliştirildi</p>
        </div>
    </div>

    <script>
        async function testRegister() {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'demo@autocloser.com',
                        password: 'demo123',
                        businessName: 'Demo Store'
                    })
                });
                const data = await response.json();
                alert('Kayıt Başarılı!\\n' + JSON.stringify(data, null, 2));
            } catch (error) {
                alert('Hata: ' + error.message);
            }
        }

        async function testLogin() {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'demo@autocloser.com',
                        password: 'demo123'
                    })
                });
                const data = await response.json();
                alert('Giriş Başarılı!\\n' + JSON.stringify(data, null, 2));
            } catch (error) {
                alert('Hata: ' + error.message);
            }
        }

        async function testAIAnalyze() {
            try {
                const response = await fetch('/api/ai/analyze-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Merhaba, ürünleriniz hakkında bilgi alabilir miyim?',
                        conversationId: 'demo'
                    })
                });
                const data = await response.json();
                alert('AI Analiz Sonucu:\\n' + JSON.stringify(data, null, 2));
            } catch (error) {
                alert('Hata: ' + error.message);
            }
        }

        async function testAIGenerate() {
            try {
                const response = await fetch('/api/ai/generate-response', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Fiyat nedir?',
                        context: { previousMessages: [] },
                        intent: 'price_inquiry'
                    })
                });
                const data = await response.json();
                alert('AI Yanıt Sonucu:\\n' + JSON.stringify(data, null, 2));
            } catch (error) {
                alert('Hata: ' + error.message);
            }
        }

        async function testQualifyLead() {
            try {
                const response = await fetch('/api/ai/qualify-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { content: 'Fiyat nedir?', timestamp: new Date().toISOString() },
                            { content: 'Hemen alabilirim', timestamp: new Date().toISOString() }
                        ],
                        customerInfo: { budget: 'confirmed' }
                    })
                });
                const data = await response.json();
                alert('Lead Kalifikasyon Sonucu:\\n' + JSON.stringify(data, null, 2));
            } catch (error) {
                alert('Hata: ' + error.message);
            }
        }
    </script>
</body>
</html>`;
    sendHTML(res, 200, html);
  },

  // Authentication routes
  '/api/auth/register': async (req, res, method) => {
    if (method === 'POST') {
      const body = await parseBody(req);
      sendResponse(res, 200, {
        success: true,
        message: 'Tedarikçi başarıyla kaydedildi',
        data: {
          userId: 'user_' + Date.now(),
          email: body.email || 'demo@autocloser.com',
          merchantId: 'merchant_' + Date.now(),
          status: 'pending_verification'
        }
      });
    } else {
      sendResponse(res, 405, { success: false, message: 'Method Not Allowed' });
    }
  },

  '/api/auth/login': async (req, res, method) => {
    if (method === 'POST') {
      const body = await parseBody(req);
      sendResponse(res, 200, {
        success: true,
        message: 'Giriş başarılı',
        data: {
          accessToken: 'jwt_access_token_demo_' + Date.now(),
          refreshToken: 'jwt_refresh_token_demo_' + Date.now(),
          user: {
            id: 'user_demo_1',
            email: body.email || 'demo@autocloser.com',
            role: 'merchant'
          }
        }
      });
    } else {
      sendResponse(res, 405, { success: false, message: 'Method Not Allowed' });
    }
  },

  // Merchant dashboard
  '/api/merchants/dashboard': (req, res, method) => {
    sendResponse(res, 200, {
      success: true,
      data: {
        stats: {
          totalConversations: 1247,
          activeConversations: 23,
          conversions: 89,
          revenue: 12456.78,
          conversionRate: 7.14,
          avgResponseTime: '2.3s'
        },
        recentConversations: [
          {
            id: 'conv_1',
            customer: {
              name: 'Ahmet Yılmaz',
              phone: '+905551234567'
            },
            status: 'active',
            lastMessage: 'Fiyat nedir?',
            timestamp: new Date().toISOString(),
            aiConfidence: 0.85
          },
          {
            id: 'conv_2',
            customer: {
              name: 'Ayşe Kaya',
              phone: '+905558765432'
            },
            status: 'waiting_payment',
            lastMessage: 'Hemen ödeme yapabilirim',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            aiConfidence: 0.92
          }
        ]
      }
    });
  },

  // AI endpoints
  '/api/ai/analyze-message': async (req, res, method) => {
    if (method === 'POST') {
      const body = await parseBody(req);
      const message = body.message || '';
      
      // Demo AI analysis
      let intent = 'general_inquiry';
      let sentiment = 'neutral';
      let confidence = 0.8;
      let urgency = 'low';
      
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('fiyat') || lowerMessage.includes('price')) {
        intent = 'price_inquiry';
        sentiment = 'neutral';
        confidence = 0.9;
      } else if (lowerMessage.includes('nedir') || lowerMessage.includes('what')) {
        intent = 'product_info';
        sentiment = 'curious';
        confidence = 0.85;
      } else if (lowerMessage.includes('acil') || lowerMessage.includes('urgent')) {
        intent = 'urgent_inquiry';
        sentiment = 'urgent';
        urgency = 'high';
        confidence = 0.95;
      }
      
      sendResponse(res, 200, {
        success: true,
        data: {
          intent,
          sentiment,
          confidence,
          urgency,
          keywords: ['demo', 'ai', 'analysis'],
          entities: [],
          timestamp: new Date().toISOString()
        }
      });
    } else {
      sendResponse(res, 405, { success: false, message: 'Method Not Allowed' });
    }
  },

  '/api/ai/generate-response': async (req, res, method) => {
    if (method === 'POST') {
      const { message, context, intent } = await parseBody(req);
      
      // Demo AI response generation
      let response = '';
      
      switch (intent) {
        case 'price_inquiry':
          response = 'Merhaba! Ürünlerimizin fiyatları kalite ve özelliklerine göre değişiklik gösteriyor. Size en uygun seçenekleri sunabilmek için hangi ürünle ilgili bilgi almak istediğinizi belirtebilir misiniz?';
          break;
        case 'product_info':
          response = 'Tabii ki! Ürünlerimiz hakkında detaylı bilgi almak istiyorsanız, önce hangi kategoride arama yaptığınızı öğrenebilir miyim? Bu sayede size en doğru bilgileri verebilirim.';
          break;
        case 'urgent_inquiry':
          response = 'Anlıyorum aceleci bir durumunuz var. Size hemen yardımcı olmak istiyorum. Konuyu biraz daha detaylandırabilirseniz, en hızlı şekilde çözüm sunabilirim.';
          break;
        default:
          response = 'Merhaba! Size nasıl yardımcı olabilirim? Sorularınızı veya ihtiyaçlarınızı paylaşırsanız, size en iyi şekilde destek olabilirim.';
      }
      
      sendResponse(res, 200, {
        success: true,
        data: {
          response,
          confidence: 0.88,
          suggestions: [
            'Ürün detayları',
            'Fiyat bilgisi',
            'İletişim bilgileri',
            'İnsan destek'
          ],
          followUpActions: ['offer_product_catalog', 'connect_sales_agent', 'schedule_demo']
        }
      });
    } else {
      sendResponse(res, 405, { success: false, message: 'Method Not Allowed' });
    }
  },

  '/api/ai/qualify-lead': async (req, res, method) => {
    if (method === 'POST') {
      const { messages, customerInfo } = await parseBody(req);
      
      // Demo lead qualification
      const qualification = {
        score: 0.78, // 0-1 scale
        level: 'hot_lead',
        budget: 'qualified',
        urgency: 'medium',
        timeline: '2_weeks',
        decisionMaker: 'confirmed',
        nextSteps: [
          'Send detailed product catalog',
          'Schedule product demonstration',
          'Prepare custom quote'
        ],
        confidence: 0.82,
        reasoning: [
          'Customer showed clear purchase intent',
          'Asked specific price questions',
          'Willing to schedule demo',
          'Confirmed budget availability'
        ]
      };
      
      sendResponse(res, 200, {
        success: true,
        data: qualification
      });
    } else {
      sendResponse(res, 405, { success: false, message: 'Method Not Allowed' });
    }
  },

  // WhatsApp status
  '/api/whatsapp/status': (req, res, method) => {
    sendResponse(res, 200, {
      success: true,
      data: {
        connected: true,
        phoneNumber: '+905551234567',
        businessName: 'Demo Store',
        status: 'active',
        lastActivity: new Date().toISOString(),
        messageCount: {
          sent: 1247,
          received: 1156,
          pending: 3
        },
        rateLimits: {
          messagesPerSecond: 5,
          messagesPerDay: 10000,
          remaining: 8765
        }
      }
    });
  },

  // Payment plans
  '/api/payments/plans': (req, res, method) => {
    sendResponse(res, 200, {
      success: true,
      data: {
        plans: [
          {
            id: 'starter',
            name: 'Starter',
            price: 99,
            currency: 'TRY',
            billingCycle: 'monthly',
            features: [
              '1,000 messages/month',
              'Basic AI conversation',
              'Email support',
              '1 WhatsApp number'
            ],
            limits: {
              messages: 1000,
              conversations: 500,
              users: 1
            }
          },
          {
            id: 'professional',
            name: 'Professional',
            price: 299,
            currency: 'TRY',
            billingCycle: 'monthly',
            popular: true,
            features: [
              '5,000 messages/month',
              'Advanced AI with lead qualification',
              'Priority support',
              '3 WhatsApp numbers',
              'Custom templates',
              'Analytics dashboard'
            ],
            limits: {
              messages: 5000,
              conversations: 2500,
              users: 3
            }
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 599,
            currency: 'TRY',
            billingCycle: 'monthly',
            features: [
              'Unlimited messages',
              'Full AI suite',
              '24/7 support',
              'Unlimited WhatsApp numbers',
              'Custom integrations',
              'White-label options',
              'Dedicated account manager'
            ],
            limits: {
              messages: -1, // unlimited
              conversations: -1,
              users: -1
            }
          }
        ]
      }
    });
  },

  // Conversations list
  '/api/conversations': (req, res, method) => {
    sendResponse(res, 200, {
      success: true,
      data: {
        conversations: [
          {
            id: 'conv_demo_1',
            customer: {
              name: 'Ahmet Yılmaz',
              phone: '+905551234567'
            },
            merchantId: 'merchant_demo_1',
            status: 'active',
            lastMessage: {
              content: 'Merhaba, ürünleriniz hakkında bilgi alabilir miyim?',
              timestamp: new Date().toISOString(),
              sender: 'customer'
            },
            aiMetadata: {
              intent: 'product_inquiry',
              confidence: 0.89,
              leadScore: 0.65,
              qualification: 'warm_lead'
            },
            unreadCount: 2,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'conv_demo_2',
            customer: {
              name: 'Ayşe Kaya',
              phone: '+905558765432'
            },
            merchantId: 'merchant_demo_1',
            status: 'payment_pending',
            lastMessage: {
              content: 'Fiyat teklifi alabilir miyim?',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              sender: 'customer'
            },
            aiMetadata: {
              intent: 'price_inquiry',
              confidence: 0.94,
              leadScore: 0.85,
              qualification: 'hot_lead'
            },
            unreadCount: 0,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1
        }
      }
    });
  }
};

// Handle conversations/:id/messages
const handleConversationMessages = (req, res, method, parsedUrl) => {
  const path = parsedUrl.pathname;
  if (path.includes('/messages')) {
    const messages = [
      {
        id: 'msg_1',
        conversationId: 'conv_demo_1',
        content: 'Merhaba, ürünleriniz hakkında bilgi alabilir miyim?',
        senderType: 'customer',
        senderId: 'customer_demo_1',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'delivered',
        aiMetadata: {
          intent: 'product_inquiry',
          sentiment: 'friendly',
          confidence: 0.89
        }
      },
      {
        id: 'msg_2',
        conversationId: 'conv_demo_1',
        content: 'Tabii ki! Size hangi ürün kategorisinde arama yaptığınızı öğrenebilir miyim? Bu sayede en uygun bilgileri verebilirim.',
        senderType: 'ai',
        senderId: 'ai_agent',
        timestamp: new Date(Date.now() - 7100000).toISOString(),
        status: 'delivered',
        aiMetadata: {
          intent: 'product_info_response',
          sentiment: 'helpful',
          confidence: 0.92
        }
      },
      {
        id: 'msg_3',
        conversationId: 'conv_demo_1',
        content: 'Elektronik ürünler arıyorum. Laptop ve telefonlar hakkında bilgi alabilir miyim?',
        senderType: 'customer',
        senderId: 'customer_demo_1',
        timestamp: new Date(Date.now() - 7000000).toISOString(),
        status: 'delivered',
        aiMetadata: {
          intent: 'specific_product_inquiry',
          sentiment: 'interested',
          confidence: 0.94
        }
      }
    ];
    
    sendResponse(res, 200, {
      success: true,
      data: {
        messages: messages,
        conversation: {
          id: 'conv_demo_1',
          status: 'active',
          aiContext: {
            currentIntent: 'product_inquiry',
            conversationStage: 'qualification',
            leadScore: 0.73,
            recommendedActions: [
              'send_product_catalog',
              'schedule_demo',
              'connect_sales_agent'
            ]
          }
        }
      }
    });
  }
};

// Main request handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  try {
    // Check if route exists
    if (routes[pathname]) {
      await routes[pathname](req, res, method);
    } else if (pathname.startsWith('/api/conversations/') && pathname.includes('/messages')) {
      handleConversationMessages(req, res, method, parsedUrl);
    } else {
      // 404 handler
      sendResponse(res, 404, {
        success: false,
        message: 'Endpoint bulunamadı',
        error: 'Not Found',
        path: pathname,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    sendResponse(res, 500, {
      success: false,
      message: 'Sunucu hatası',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│                                                             │');
  console.log('│         🤖 AutoCloser Agent Platform - Demo Server          │');
  console.log('│                                                             │');
  console.log('│  🚀 Server running on:     http://localhost:' + PORT + '      │');
  console.log('│  📚 API Documentation:     http://localhost:' + PORT + '/docs │');
  console.log('│  ❤️  Health Check:         http://localhost:' + PORT + '/health │');
  console.log('│                                                             │');
  console.log('│  🎯 Features:                                             │');
  console.log('│     • AI-powered lead qualification                        │');
  console.log('│     • WhatsApp Business integration                        │');
  console.log('│     • Automated payment processing                         │');
  console.log('│     • Real-time analytics dashboard                        │');
  console.log('│     • Human handoff system                                 │');
  console.log('│                                                             │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('Demo endpoints available:');
  console.log('  GET  /                    - API overview');
  console.log('  GET  /health             - Health check');
  console.log('  GET  /docs               - API documentation with UI');
  console.log('  POST /api/auth/register   - Merchant registration');
  console.log('  POST /api/auth/login      - Login');
  console.log('  GET  /api/conversations   - List conversations');
  console.log('  POST /api/ai/analyze-message - AI message analysis');
  console.log('  POST /api/ai/generate-response - AI response generation');
  console.log('  GET  /api/merchants/dashboard - Dashboard data');
  console.log('');
  console.log('💡 Visit /docs to see interactive API documentation!');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});