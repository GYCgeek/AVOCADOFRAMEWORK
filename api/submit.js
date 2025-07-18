// api/submit.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { GITHUB_TOKEN } = process.env;
  const REPO = 'GYCgeek/AVOCADOFRAMEWORK';
  const FILE_PATH = 'public/data/proposals.json';
  const BRANCH = 'main';
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  const newProposal = req.body;

  try {
    // 1. Fetch proposals.json
    const getRes = await fetch(`${API_URL}?ref=${BRANCH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      throw new Error(`GET failed: ${errText}`);
    }

    const fileData = await getRes.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const proposals = JSON.parse(content);

    // 2. Assign ID
    const lastId = proposals.length ? Math.max(...proposals.map(p => p.id)) : 0;
    newProposal.id = lastId + 1;

    // 3. Add proposal
    proposals.push(newProposal);

    // 4. Convert to base64
    const updatedContent = Buffer.from(JSON.stringify(proposals, null, 2)).toString('base64');

    // 5. PUT updated file
    const putRes = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add Seed #${newProposal.id} from ${newProposal.contributor}`,
        content: updatedContent,
        sha: fileData.sha,
        branch: BRANCH
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`PUT failed: ${errText}`);
    }

    return res.status(200).json({ success: true, id: newProposal.id });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
}
