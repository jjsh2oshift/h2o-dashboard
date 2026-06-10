exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const { since, until, level, time_increment } = params;
  const TOKEN = process.env.META_TOKEN;
  const ACCOUNT = '985112803241022';

  if (!TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'META_TOKEN not set' }) };
  }

  const fields = 'spend,impressions,reach,clicks,ctr,cpm,cpc,actions';
  let url = `https://graph.facebook.com/v19.0/act_${ACCOUNT}/insights?fields=${fields}&level=${level||'account'}&access_token=${TOKEN}`;

  if (since && until) {
    url += `&time_range={"since":"${since}","until":"${until}"}`;
  } else {
    url += `&date_preset=this_month`;
  }
  if (time_increment) url += `&time_increment=${time_increment}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
