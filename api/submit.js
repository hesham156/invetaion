// ==========================================================================
//  استقبال تأكيد الحضور (RSVP) وتخزينه في Supabase
//  Vercel Serverless Function — بتشتغل تلقائيًا على المسار /api/submit
//  المفاتيح السرية بتيجي من Environment Variables على Vercel (مش في الكود)
// ==========================================================================
module.exports = async (req, res) => {
  // نسمح فقط بـ POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : (req.body || {});

    // تنظيف وتحديد أطوال البيانات
    const name   = String(body.name   || '').trim().slice(0, 120);
    const attend = String(body.attend || '').trim().slice(0, 10);
    const guests = parseInt(body.guests, 10) || 0;
    const msg    = String(body.msg    || '').trim().slice(0, 1000);

    if (!name || !attend) {
      res.status(400).json({ error: 'الاسم وحالة الحضور مطلوبين' });
      return;
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      res.status(500).json({ error: 'السيرفر مش متظبط (متغيرات البيئة ناقصة)' });
      return;
    }

    const r = await fetch(`${url}/rest/v1/rsvps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        attend,
        guests: Math.max(0, Math.min(guests, 50)),
        msg
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      res.status(502).json({ error: 'خطأ في قاعدة البيانات', detail });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
};
