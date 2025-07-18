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
    };

    // Format proposal object
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const contributor = seed.name
      ? `${seed.name}${seed.email ? ' (' + seed.email + ')' : ''}`
      : seed.who;

    const newProposal = {
      id: null, // to be added in the API
      pillar: seed.pillar.toUpperCase(),
      type: seed.type.charAt(0).toUpperCase() + seed.type.slice(1),
      text: seed.description,
      contributor: contributor,
      status: 'Under Review',
      date: dateStr,
      votes: 0
    };

    console.log('Submitting proposal:', newProposal);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProposal)
      });

      if (!res.ok) throw new Error('API call failed');
      window.location.href = 'thanks.html';
    } catch (err) {
      alert('There was an error submitting your Seed. Please try again.');
      console.error(err);
    }
  });
});
