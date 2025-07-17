// submitSeed.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#seedForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const seed = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      who: formData.get('who') || '',
      pillar: formData.get('pillar') || '',
      type: formData.get('type') || '',
      description: formData.get('contribution') || ''
      // file: formData.get('file') // Skipped for now
    };

    // Format proposal object
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const contributor = seed.name
      ? `${seed.name}${seed.email ? ' (' + seed.email + ')' : ''}`
      : seed.who;
    let newProposal = {
      id: null, // To be set after fetching proposals.json
      pillar: seed.pillar.toUpperCase(),
      type: seed.type.charAt(0).toUpperCase() + seed.type.slice(1),
      text: seed.description,
      contributor: contributor,
      status: 'Under Review',
      date: dateStr,
      votes: 0
    };
    console.log('Seed submission:', seed);
    console.log('Formatted proposal:', newProposal);

    // --- GitHub API integration ---
    const GITHUB_TOKEN = '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'; // Insert your token locally
    const REPO = 'GYCgeek/AVOCADOFRAMEWORK';
    const FILE_PATH = 'public/data/proposals.json';
    const BRANCH = 'main';
    const API_URL = `https://api.github.com/repos/GYCgeek/AVOCADOFRAMEWORK/contents/public/data/proposals.json`;

    try {
      // 1. Fetch proposals.json from GitHub
      const getRes = await fetch(`${API_URL}?ref=${BRANCH}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!getRes.ok) throw new Error('Failed to fetch proposals.json');
      const fileData = await getRes.json();
      const content = atob(fileData.content.replace(/\n/g, ''));
      let proposals = JSON.parse(content);

      // 2. Auto-increment id
      const lastId = proposals.length ? Math.max(...proposals.map(p => p.id)) : 0;
      newProposal.id = lastId + 1;

      // 3. Append new proposal
      proposals.push(newProposal);

      // 4. Convert back to base64
      const updatedContent = btoa(JSON.stringify(proposals, null, 2));

      // 5. PUT updated file to GitHub
      const putRes = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add Seed #${newProposal.id} from ${newProposal.contributor}`,
          content: updatedContent,
          sha: fileData.sha,
          branch: BRANCH
        })
      });
      if (!putRes.ok) throw new Error('Failed to update proposals.json');

      // 6. Redirect to thanks.html
      window.location.href = 'thanks.html';
    } catch (err) {
      alert('There was an error submitting your Seed. Please try again.');
      console.error(err);
    }
  });
}); 
