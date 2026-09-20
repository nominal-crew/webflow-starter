export function updateBarbaNav(data) {
  const template = document.createElement('template');
  template.innerHTML = data.next.html.trim();

  const nextNodes = template.content.querySelectorAll('[data-barba-update]');
  const currentNodes = document.querySelectorAll('nav [data-barba-update]');

  currentNodes.forEach((current, index) => {
    const next = nextNodes[index];
    if (!next) return;

    const newStatus = next.getAttribute('aria-current');

    if (newStatus !== null) {
      current.setAttribute('aria-current', newStatus);
    } else {
      current.removeAttribute('aria-current');
    }

    const newClassList = next.getAttribute('class') || '';
    current.setAttribute('class', newClassList);
  });
}
