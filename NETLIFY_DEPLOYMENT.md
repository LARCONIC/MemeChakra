# MemeChakra - Netlify Deployment Guide

## फाइल स्ट्रक्चर ओवरव्यू
```
memechakra/
├── client/                  # फ्रंटएंड कोड
│   ├── dist/                # बिल्ड आउटपुट (Vite द्वारा जेनरेट)
│   ├── src/
│   │   ├── components/      # React कंपोनेंट्स
│   │   ├── data/            # स्टेटिक डेटा
│   │   ├── hooks/           # कस्टम हुक्स
│   │   ├── lib/             # यूटिलिटी फंक्शंस
│   │   │   └── netlifyClient.ts   # Netlify API क्लाइंट
│   │   ├── pages/           # पेज कंपोनेंट्स
│   ├── index.html           # मेन HTML फाइल
│   └── vite.config.ts       # Vite कॉन्फिगरेशन
│
├── server/                  # बैकएंड कोड (डेवलपमेंट में उपयोग)
│   ├── db.ts                # डेटाबेस कनेक्शन
│   ├── index.ts             # मेन सर्वर फाइल
│   ├── routes.ts            # API रूट्स (डेवलपमेंट में उपयोग)
│   └── storage.ts           # डेटा स्टोरेज लॉजिक
│
├── shared/                  # शेयर्ड कोड
│   └── schema.ts            # डेटा मॉडल्स
│
├── netlify/                 # Netlify स्पेसिफिक फाइल्स
│   ├── build.sh             # Netlify बिल्ड स्क्रिप्ट
│   └── functions/           # सर्वरलेस फंक्शंस
│       └── api.ts           # API एंडपॉइंट्स के लिए फंक्शन
│
├── netlify.toml             # Netlify कॉन्फिगरेशन
├── package.json             # प्रोजेक्ट डिपेंडेंसीज
└── tsconfig.json            # TypeScript कॉन्फिगरेशन
```

## मुख्य फाइल्स का विवरण

### netlify.toml
Netlify सर्विस के लिए कॉन्फिगरेशन फाइल। इसमें बिल्ड कमांड, पब्लिश डायरेक्टरी और रीडायरेक्ट रूल्स शामिल हैं:
- बिल्ड कमांड: `npm run build`
- पब्लिश डायरेक्टरी: `client/dist`
- फंक्शंस डायरेक्टरी: `netlify/functions`
- API रीडायरेक्ट: `/api/*` से `/.netlify/functions/api/:splat`
- SPA रीडायरेक्ट: `/*` से `/index.html`

### netlify/functions/api.ts
यह फाइल Netlify फंक्शंस के लिए सभी API एंडपॉइंट्स को संभालती है:
- `/templates` - सभी टेम्पलेट प्राप्त करना
- `/templates/category/:slug` - केटेगरी के अनुसार टेम्पलेट प्राप्त करना
- `/categories` - सभी केटेगरीज प्राप्त करना
- `/ai/generate-meme` - एआई मीम टेक्स्ट जेनरेशन

### client/src/lib/netlifyClient.ts
यह फाइल Netlify डिप्लॉयमेंट के लिए फ्रंटएंड API क्लाइंट प्रदान करती है:
- डेवेलपमेंट और प्रोडक्शन मोड के बीच API URL स्विचिंग
- API रिक्वेस्ट के लिए हेल्पर फंक्शंस
- डेटा पोस्ट और प्राप्त करने की विधियां

### netlify/build.sh
Netlify के लिए बिल्ड प्रोसेस ऑटोमेट करने वाली स्क्रिप्ट:
- फ्रंटएंड बिल्ड
- Netlify फंक्शंस सेटअप
- आवश्यक फाइल्स कॉपी करना
- फंक्शन डिपेंडेंसीज इंस्टॉल करना

## डिप्लॉयमेंट के स्टेप्स

1. अपने कोड को GitHub पर पुश करें
2. Netlify में साइन इन करें और "New site from Git" चुनें
3. अपना GitHub रिपॉजिटरी कनेक्ट करें
4. बिल्ड सेटिंग्स कॉन्फिगर करें:
   - Build command: `./netlify/build.sh`
   - Publish directory: `client/dist`
   - Functions directory: `netlify/functions`
5. एनवायरमेंट वेरिएबल्स सेट करें:
   - `DATABASE_URL` - PostgreSQL डेटाबेस URL
   - `OPENAI_API_KEY` - OpenAI API की
6. "Deploy site" पर क्लिक करें

## महत्वपूर्ण नोट्स

1. **डेटाबेस सेटअप**: MemeChakra के लिए PostgreSQL डेटाबेस की आवश्यकता है। आप इसे Neon, Supabase, या Railway जैसे सेवाओं के माध्यम से सेट कर सकते हैं।

2. **API की**: OpenAI एकीकरण के लिए वैध API की आवश्यकता है।

3. **डेवलपमेंट टू प्रोडक्शन स्विचिंग**: `netlifyClient.ts` फाइल डेवलपमेंट और प्रोडक्शन एनवायरमेंट के बीच स्विच करने की सुविधा देती है, ताकि आप डेवलपमेंट में लोकल API रूट्स का उपयोग कर सकें और प्रोडक्शन में Netlify फंक्शंस का।

4. **CORS सेटिंग्स**: `api.ts` फाइल में CORS हेडर्स पहले से ही कॉन्फिगर हैं।

5. **फंक्शन टाइमआउट**: Netlify फंक्शंस का डिफॉल्ट टाइमआउट 10 सेकंड है। यदि एआई जेनरेशन समय अधिक लेता है, तो आप Netlify के प्रीमियम फंक्शंस का उपयोग कर सकते हैं।