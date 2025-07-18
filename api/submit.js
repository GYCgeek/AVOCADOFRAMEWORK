import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { name, email, who, pillar, type, description } = req.body;

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const contributor = name ? `${name}${email ? ' (' + email + ')' : ''}` : who;

    const newProposal = {
      id: null,
      pillar: pillar.toUpperCase(),
      type: type.charAt(0).toUpperCase() + type.slice(1),
      text: description,
      contributor,
      status: 'Under Review',
      date: dateStr,
      votes: 0,
    };

    const filePath = path.join(process.cwd(), 'public', 'data', 'proposals.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const proposals = JSON.parse(fileContent);

    // Set ID
    const lastId = proposals.length ? Math.max(...proposals.map(p => p.id)) : 0;
    newProposal.id = lastId + 1;

    // Append and write back
    proposals.push(newProposal);
    writeFileSync(filePath, JSON.stringify(proposals, null, 2));

    res.status(200).json({ success: true, proposal: newProposal });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Error saving proposal' });
  }
}

