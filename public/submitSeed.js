// submitSeed.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
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

    // For now, just log the seed object
    console.log('Seed submission:', seed);
    // TODO: Add GitHub API logic to write to proposals.json
  });
}); 
